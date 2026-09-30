#!/usr/bin/env python3
"""Build the CrazyGames upload for Fairway Friends.

    python3 tools/build_crazygames.py --api https://YOUR-APP.onrender.com

Makes dist/crazygames/ and dist/fairway-friends-crazygames.zip (upload the zip to the CrazyGames developer portal).
The build:
  * adds the CrazyGames SDK v3 <script> tag to index.html (so the SDK is detected and initialised before the game runs)
  * writes config.js with crazygames: true and apiBase = your room server (must be HTTPS, running server.py)
  * leaves out server.py, README and anything that isn't needed in the browser
Your Render deployment keeps running the normal files; this folder is only for CrazyGames.
"""
import argparse, json, os, shutil, sys, urllib.request, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ["index.html", "game.js", "clubs.js", "course-data.js", "course-island.js", "platform.js"]
SDK_TAG = '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--api", required=True, help="HTTPS address of your running game server, e.g. https://fairway-friends.onrender.com")
    ap.add_argument("--out", default=os.path.join(ROOT, "dist"))
    ap.add_argument("--skip-check", action="store_true", help="don't try to reach the server's /health while building")
    a = ap.parse_args()
    api = a.api.strip().rstrip("/")
    if not api.startswith("https://"):
        sys.exit("--api must start with https:// (CrazyGames pages are HTTPS, so an http:// server would be blocked as mixed content)")

    if not a.skip_check:
        try:
            with urllib.request.urlopen(api + "/health", timeout=75) as r:
                health = json.load(r)
                cors = r.headers.get("Access-Control-Allow-Origin")
            print(f"server OK: {api}/health -> {health}; CORS header: {cors!r}")
            if cors != "*":
                print("WARNING: the server does not send Access-Control-Allow-Origin yet. Deploy this version of server.py to Render first.")
        except Exception as e:  # the build still works; this is just an early warning
            print(f"WARNING: could not reach {api}/health ({e}). Multiplayer and the leaderboard will fail until that server is up.")

    out = os.path.join(a.out, "crazygames")
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    for f in FILES:
        shutil.copy2(os.path.join(ROOT, f), out)
    shutil.copytree(os.path.join(ROOT, "fonts"), os.path.join(out, "fonts"))
    with open(os.path.join(out, "config.js"), "w", encoding="utf-8") as fh:
        fh.write("// CrazyGames build (written by tools/build_crazygames.py)\n")
        fh.write("window.FF_CONFIG = Object.assign(" + json.dumps({"crazygames": True, "apiBase": api}) + ", window.FF_CONFIG || {});\n")
    idx = os.path.join(out, "index.html")
    html = open(idx, encoding="utf-8").read()
    if SDK_TAG not in html:
        html = html.replace('  <script src="./config.js"></script>', "  " + SDK_TAG + '\n  <script src="./config.js"></script>', 1)
    html = html.replace('<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>',
                        '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>\n  <link rel="preconnect" href="' + api + '" crossorigin>', 1)
    open(idx, "w", encoding="utf-8").write(html)
    assert SDK_TAG in html, "could not insert the SDK tag"

    zpath = os.path.join(a.out, "fairway-friends-crazygames.zip")
    if os.path.exists(zpath):
        os.remove(zpath)
    total = 0
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for base, _, files in os.walk(out):
            for f in files:
                full = os.path.join(base, f)
                z.write(full, os.path.relpath(full, out))
                total += os.path.getsize(full)
    print(f"built {out}\nzip   {zpath} ({os.path.getsize(zpath) / 1024:.0f} KB zipped, {total / 1024:.0f} KB unzipped; Three.js loads from the jsDelivr CDN)")


if __name__ == "__main__":
    main()
