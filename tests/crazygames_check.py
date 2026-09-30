#!/usr/bin/env python3
"""Automated checks for the CrazyGames integration (SDK, Data module, rooms, invites, settings).

    pip install playwright && python3 -m playwright install chromium
    python3 tests/crazygames_check.py

It starts two local servers:
  * the real game server (server.py) for rooms and live updates, and
  * a plain static file server that plays the part of CrazyGames' file hosting (it can't answer /api calls),
then loads the game from the static server with a stand-in CrazyGames SDK (tests/mock_crazygames_sdk.js) and
checks every SDK call the game makes. The real SDK and a real CrazyGames page can't be reproduced locally:
see the QA list in README.md for what to check on CrazyGames itself.
"""
import asyncio, json, os, socket, subprocess, sys, tempfile, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME, STATIC = 8791, 8792
API = f"http://localhost:{GAME}"
MOCK = open(os.path.join(ROOT, "tests", "mock_crazygames_sdk.js"), encoding="utf-8").read()
THREE_FILE = os.environ.get("FF_THREE_FILE")  # optional local copy of three.module.js for offline runs
results = []


def check(label, ok, extra=""):
    results.append(bool(ok))
    print(("PASS " if ok else "FAIL ") + label + (f"  [{extra}]" if extra and not ok else ""), flush=True)


def api(route, body=None, method=None, headers=None):
    req = urllib.request.Request(API + route, data=json.dumps(body).encode() if body is not None else None, method=method,
                                 headers=dict({"Content-Type": "application/json"}, **(headers or {})))
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if raw else {}), dict(r.headers)
    except urllib.error.HTTPError as e:
        raw = e.read()
        return e.code, (json.loads(raw) if raw else {}), dict(e.headers)


def wait_port(port):
    for _ in range(100):
        try:
            socket.create_connection(("localhost", port), timeout=.2).close(); return
        except OSError:
            time.sleep(.1)
    raise RuntimeError(f"port {port} never opened")


async def main():
    from playwright.async_api import async_playwright
    data_dir = tempfile.mkdtemp()
    game = subprocess.Popen([sys.executable, os.path.join(ROOT, "server.py")], env=dict(os.environ, PORT=str(GAME), DATA_DIR=data_dir), stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    static = subprocess.Popen([sys.executable, "-m", "http.server", str(STATIC), "--bind", "127.0.0.1"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    try:
        wait_port(GAME); wait_port(STATIC)

        # ---- server: CORS for a game page served from another domain (CrazyGames) ----
        st, _, h = api("/api/create", method="OPTIONS", headers={"Origin": "https://www.crazygames.com", "Access-Control-Request-Method": "POST"})
        check("server answers the CORS preflight (OPTIONS 204, POST + Content-Type allowed)", st == 204 and "POST" in h.get("Access-Control-Allow-Methods", "") and "Content-Type" in h.get("Access-Control-Allow-Headers", ""), f"{st} {h}")
        st, body, h = api("/api/create", {"name": "Cors", "character": "boy", "device": "d-cors"}, headers={"Origin": "https://www.crazygames.com"})
        check("room creation works cross-origin (200 + Access-Control-Allow-Origin)", st == 200 and h.get("Access-Control-Allow-Origin") == "*" and len(body.get("code", "")) == 4, f"{st} {body} {h.get('Access-Control-Allow-Origin')}")
        st, body, _ = api("/api/join", {"name": "X", "code": "QQQQ", "device": "d-x"})
        check("unknown room gives a machine-readable reason (code: not_found)", st == 404 and body.get("code") == "not_found", f"{st} {body}")

        async with async_playwright() as p:
            browser = await p.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"])

            async def open_game(options=None, config=None, local=None, url=None):
                ctx = await browser.new_context(viewport={"width": 1100, "height": 700})
                page = await ctx.new_page(); page.set_default_timeout(240000)
                page.errors, page.logs = [], []
                page.on("pageerror", lambda e: page.errors.append(str(e)))
                page.on("console", lambda m: page.logs.append(m.text))
                if THREE_FILE:
                    await page.route("**/three.module.js", lambda route: route.fulfill(path=THREE_FILE, content_type="text/javascript"))
                cfg = dict({"crazygames": True, "apiBase": API}, **(config or {}))
                pre = f"window.__cgOptions = {json.dumps(options or {})}; window.FF_CONFIG = {json.dumps(cfg)};"
                if local:
                    pre += "try { if (!sessionStorage.getItem('seeded')) { " + "".join(f"localStorage.setItem({json.dumps(k)}, {json.dumps(v)});" for k, v in local.items()) + " sessionStorage.setItem('seeded', '1'); } } catch (e) {}"
                await page.add_init_script(pre + "\n" + MOCK)
                await page.goto(url or f"http://127.0.0.1:{STATIC}/index.html")
                await page.wait_for_function("window.__cg && document.body && !document.body.classList.contains('loading')")
                await page.wait_for_timeout(600)
                return ctx, page

            calls = lambda page: page.evaluate("window.__cg.calls")
            names = lambda cs: [c[0] for c in cs]

            # ---- 1. SDK initialised during loading, before any save data is read; loading reported ----
            ctx, page = await open_game()
            cs = names(await calls(page))
            diag = await page.evaluate("FFPlatform.diagnostics()")
            check("SDK init() is awaited first, then loadingStart ... loadingStop", cs[:2] == ["init", "loadingStart"] and "loadingStop" in cs, cs[:6])
            check("Data module is active on CrazyGames; no SDK errors; no page errors", diag["state"]["dataModule"] and not [e for e in diag["events"] if e["kind"] == "error"] and not page.errors, f"{diag['events'][-5:]} {page.errors[:2]}")
            check("the title screen is not reported as gameplay", "gameplayStart" not in cs, cs)

            # ---- 2. gameplay start/stop at the right moments; muteAudio ----
            await page.fill("#player-name", "Tester"); await page.click("#play-game"); await page.wait_for_timeout(1500)
            for key in ["x", "x"]:                                   # skip the flyover, then start the hole
                await page.keyboard.press(key); await page.wait_for_timeout(700)
            for key in ["Escape", "Escape", "Escape"]:               # pause, resume, pause
                await page.keyboard.press(key); await page.wait_for_timeout(600)
            await page.click("#quit-menu"); await page.wait_for_timeout(600)
            g = [c for c in names(await calls(page)) if c.startswith("gameplay")]
            alternating = all(g[i] != g[i + 1] for i in range(len(g) - 1))
            check(f"gameplayStart on tee-off, Stop on pause, Start on resume, Stop on quit ({' > '.join(g)})", len(g) >= 4 and g[0] == "gameplayStart" and g[-1] == "gameplayStop" and alternating, g)
            await page.evaluate("window.__cg.changeSettings({ muteAudio: true })"); await page.wait_for_timeout(400)
            muted = await page.evaluate("FFPlatform.settings.muteAudio && (!audioEngine.master || audioEngine.master.gain.value < .05)")
            check("muteAudio from CrazyGames silences the game at runtime", muted)
            await ctx.close()

            # ---- 3. saves: one-time migration from localStorage into the Data module, never losing newer progress ----
            local = {"fairwayFriends.settings.v1": json.dumps({"playerName": "Local Larry", "character": "boy"}),
                     "fairwayFriends.bestScore18.v1": json.dumps({"score": 80}),
                     "fairwayFriends.history.v1": json.dumps([{"id": "old-local", "when": 1, "total": 80}])}
            cloud = {"fairwayFriends.bestScore18.v1": json.dumps({"score": 75}),
                     "fairwayFriends.history.v1": json.dumps([{"id": "newer-cloud", "when": 2, "total": 75}])}
            ctx, page = await open_game({"data": cloud}, local=local)
            d = await page.evaluate("window.__cg.data")
            hist = [r["id"] for r in json.loads(d.get("fairwayFriends.history.v1", "[]"))]
            check("migration copies settings that the Data module doesn't have yet", json.loads(d.get("fairwayFriends.settings.v1", "{}")).get("playerName") == "Local Larry", d.get("fairwayFriends.settings.v1"))
            check("migration keeps the better (cloud) best score 75 instead of the older local 80", json.loads(d["fairwayFriends.bestScore18.v1"])["score"] == 75, d["fairwayFriends.bestScore18.v1"])
            check("migration merges round history (both rounds kept, newest first)", hist == ["newer-cloud", "old-local"], hist)
            check("migration runs once (flag stored)", await page.evaluate("localStorage.getItem('fairwayFriends.cgMigrated.v1') === 'done'"))
            await page.click(".char-card[data-character=girl]"); await page.wait_for_timeout(300)
            check("new saves go to the Data module (picking a golfer updates it)", json.loads((await page.evaluate("window.__cg.data"))["fairwayFriends.settings.v1"]).get("character") == "girl")
            await ctx.close()

            # ---- 4. room creation from a page on another domain + updateRoom / leftRoom ----
            ctx, page = await open_game()
            await page.fill("#player-name", "Hosty"); await page.click("#open-friends"); await page.click("#create-room")
            await page.wait_for_function("!document.getElementById('lobby-menu').hidden", timeout=30000)
            code = await page.evaluate("mp.code"); await page.wait_for_timeout(400)
            ups = [c[1] for c in await calls(page) if c[0] == "updateRoom"]
            check(f"Create a room works cross-origin and reports the room (updateRoom {code}, joinable)", ups and ups[-1] == {"roomId": code, "isJoinable": True, "inviteParams": {"roomId": code, "region": "global"}}, ups)
            check("the lobby's invite link is CrazyGames' own invite link", "crazygames.com" in await page.evaluate("document.getElementById('lobby-link').value"))
            for i in range(3):
                api("/api/join", {"name": f"Pal{i}", "character": "girl", "code": code, "device": f"d-pal{i}"})
            await page.wait_for_function("mp.state && mp.state.players.length === 4", timeout=15000); await page.wait_for_timeout(300)
            ups = [c[1] for c in await calls(page) if c[0] == "updateRoom"]
            check("a full room (4/4) is reported as not joinable", ups[-1]["isJoinable"] is False, ups[-1])
            await page.click("#lobby-leave"); await page.wait_for_timeout(500)
            check("leaving calls leftRoom()", names(await calls(page))[-1] == "leftRoom" or "leftRoom" in names(await calls(page)), names(await calls(page))[-4:])
            await ctx.close()

            ctx, page = await open_game()
            await page.fill("#player-name", "Starter"); await page.click("#open-friends"); await page.click("#create-room")
            await page.wait_for_function("!document.getElementById('lobby-menu').hidden", timeout=30000)
            await page.click("#lobby-start"); await page.wait_for_function("mp.state && mp.state.phase === 'playing'", timeout=15000); await page.wait_for_timeout(300)
            ups = [c[1] for c in await calls(page) if c[0] == "updateRoom"]
            check("once the match starts the room is reported as not joinable", ups[-1]["isJoinable"] is False, ups[-1])
            await ctx.close()

            # ---- 5. Instant Multiplayer: straight into a private room, CrazyGames username used ----
            ctx, page = await open_game({"instant": True, "username": "CGTester"})
            await page.wait_for_function("!document.getElementById('lobby-menu').hidden", timeout=30000); await page.wait_for_timeout(300)
            ups = [c[1] for c in await calls(page) if c[0] == "updateRoom"]
            check("Instant Multiplayer opens a joinable room with no clicks, named after the CrazyGames user", ups and ups[-1]["isJoinable"] and await page.evaluate("mp.state.players[0].name") == "CGTester", ups)
            await ctx.close()

            # ---- 6. startup invite + disableChat ----
            _, host, _ = api("/api/create", {"name": "Rude Name", "character": "boy", "device": "d-host"})
            ctx, page = await open_game({"invite": {"roomId": host["code"], "region": "global"}, "settings": {"disableChat": True}, "username": "Guest1"})
            await page.wait_for_function("mp.state && mp.state.players.length === 2", timeout=30000); await page.wait_for_timeout(300)
            lobby = await page.evaluate("document.getElementById('lobby-players').innerText")
            check("startup invite joins the room from the invite link", await page.evaluate("mp.code") == host["code"])
            check("disableChat: other players' typed names are hidden", "Rude Name" not in lobby and "Player 1" in lobby, lobby)
            await page.evaluate("window.__cg.changeSettings({ disableChat: false })"); await page.wait_for_timeout(400)
            check("settings change at runtime: names come back when chat is allowed again", "Rude Name" in await page.evaluate("document.getElementById('lobby-players').innerText"))
            await ctx.close()

            # ---- 7. runtime join listener + useful invite errors ----
            ctx, page = await open_game()
            _, host2, _ = api("/api/create", {"name": "Runtime", "character": "boy", "device": "d-host2"})
            await page.evaluate(f"window.__cg.join({{ roomId: '{host2['code']}' }})")
            await page.wait_for_function("mp.state && mp.state.players.length === 2", timeout=30000)
            check("join-room listener (invite accepted while the game is open) moves the player into that room", await page.evaluate("mp.code") == host2["code"])
            async def invite_error(params):
                await page.evaluate("document.getElementById('signin-error').textContent = ''")
                await page.evaluate(f"window.__cg.join({json.dumps(params)})")
                try:
                    await page.wait_for_function("document.getElementById('signin-error').textContent.length > 0 && !/Waking/.test(document.getElementById('signin-error').textContent)", timeout=20000)
                except Exception:
                    pass
                return await page.evaluate("document.getElementById('signin-error').textContent")
            msg = await invite_error({"roomId": "ZQZQ"})
            check("missing / expired room: clear message", "doesn’t exist" in msg, msg)
            msg = await invite_error({"roomId": "12"})
            check("malformed invite: clear message", "isn’t valid" in msg, msg)
            msg = await invite_error({"roomId": host2["code"], "region": "eu"})
            check("room in another region: clear message", "region" in msg, msg)
            _, full, _ = api("/api/create", {"name": "Full", "character": "boy", "device": "d-full"})
            for i in range(3):
                api("/api/join", {"name": f"F{i}", "character": "boy", "code": full["code"], "device": f"d-f{i}"})
            msg = await invite_error({"roomId": full["code"]})
            check("full room: clear message", "full" in msg, msg)
            await ctx.close()

            # ---- 8. the original bug: the game calling /api on the host that serves its files ----
            ctx, page = await open_game(config={"apiBase": ""})
            await page.fill("#player-name", "Old"); await page.click("#open-friends"); await page.click("#create-room"); await page.wait_for_timeout(2500)
            msg = await page.evaluate("document.getElementById('signin-error').textContent")
            detail = [l for l in page.logs if "[FF/room]" in l]
            check("reproduced: with no server address the file host answers /api/create with a non-JSON error page", "unexpected reply" in msg and detail, f"{msg} {detail[:1]}")
            await ctx.close()
            await browser.close()
    finally:
        game.terminate(); static.terminate()
    print(f"\n{sum(results)}/{len(results)} CrazyGames checks passed")
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    asyncio.run(main())
