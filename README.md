# Fairway Friends v45

A cartoon golf game you can play solo or against friends on their own computers and phones. Two courses: the original 18 holes (par 72, 6,655 yards) and **Kai Lagoon**, an 18-hole island course (par 71, 6,480 yards): the front nine down among the palms, lagoons and beaches, the back nine up on the headland, high above the sea and windier, with the ocean in view on every hole.

## Start the game

1. Unzip `fairway-friends-v45.zip` into your Mac's Downloads folder.
2. Open Terminal and paste this one line:

```bash
cd ~/Downloads/fairway-friends-v45 && python3 server.py
```

3. Keep Terminal open and visit [http://localhost:8010](http://localhost:8010) in Chrome.

Nothing needs to be installed: `server.py` only uses what already comes with Python on a Mac.
To stop the game, click the Terminal window and press `Control-C`.
If Terminal says the address is already in use, an older copy is still running: press `Control-C` in that window, or restart Terminal, then paste the line again.

## Playing with friends

On the sign-in screen, type your name, pick your golfer (boy or girl) and pick a course: **18 holes** or **Kai Lagoon**. The girl golfer carries the limited edition pink club set. The game remembers the course you last picked.

- Tap **Play with friends**, then **Create a room**. It shows your 4-letter room code in big tiles. Tap **Share invite** (on phones it opens the share sheet for Messages, WhatsApp and so on) or **Copy code**. The invite link is tucked under "Or send the invite link". During the round the code stays on the leaderboard: tap it to copy it again.
- Friends tap **Play with friends**, type the code and press **Join room**, or just open the invite link (it fills the code in for them).
- The lobby shows the course. The host can switch between **18 holes** and **Kai Lagoon** until the round starts; everyone else's game follows automatically.
- When everyone appears in the lobby, the host presses **Start round**.
- Up to 4 players. Everyone plays the same wind.

Rules in a room:

- Everyone takes one shot before anyone takes another. When it isn't your turn you can walk around and watch, but you can't set up or swing.
- You watch each other's shots live, with a coloured tracer.
- The leaderboard (top right) shows everyone's score to par. Press **View scorecard** for the full card.
- After each hole the scorecard shows everyone's scores; anyone can tee off the next hole. On later holes, the lowest score on the last hole tees off first.
- Lowest total wins. On the 18 holes the scorecard shows the front nine (OUT), back nine (IN) and total, like a real card.

### Friends on the same Wi-Fi

1. On the computer running `server.py`, find its IP address: System Settings > Wi-Fi > Details (it looks like `192.168.1.23`).
2. Friends open `http://192.168.1.23:8010` (use your number) in Chrome.
3. If it won't load, allow Python through the Mac firewall when asked.

### Putting it online (friends anywhere)

Render.com has a free plan that can run `server.py` as-is:

1. Put this folder in a GitHub repository.
2. On render.com: **New > Web Service**, pick the repo.
3. Runtime **Python 3**, Build command: `echo ok`, Start command: `python3 server.py`, Instance type **Free**.
4. Render gives you a link like `https://fairway-friends.onrender.com`. Share it; players create or join rooms there.

Free Render servers go to sleep when nobody is playing, so open the link a minute before your friends do. Rooms are kept in memory, so they reset if the server restarts.

## The 18 holes

| Hole | Name | Par | Yards | | Hole | Name | Par | Yards |
|---|---|---|---|---|---|---|---|---|
| 1 | Gentle Bend | 4 | 350 | | 10 | Split Decision | 4 | 375 |
| 2 | Front Door | 4 | 330 | | 11 | Creekside Run | 5 | 545 |
| 3 | The Big Target | 3 | 140 | | 12 | Quarry Drop | 3 | 175 |
| 4 | Long Meadow | 5 | 530 | | 13 | The Switchback | 4 | 430 |
| 5 | Waterline | 4 | 390 | | 14 | Risky Reach | 4 | 315 |
| 6 | High Green | 3 | 165 | | 15 | Needle's Eye | 3 | 205 |
| 7 | Corner Risk | 4 | 410 | | 16 | Crescent Lake | 5 | 560 |
| 8 | Island Window | 4 | 360 | | 17 | Bunker Alley | 4 | 420 |
| 9 | Summit Finish | 5 | 500 | | 18 | Homeward Bound | 4 | 455 |
| | **Out** | **36** | **3,175** | | | **In** | **36** | **3,480** |

Card yardages follow the fairway, like a real course. On the bending holes the straight line to the green is shorter, which is what makes the shortcuts pay: carry the pond on 14 and you can drive the green; hug the creek on 11 or the lake on 16 and the green is reachable in two. Water hazards and their banks are always in play (never out of bounds), and a ball in the water is dropped on the nearest dry grass that isn't closer to the hole.

Club distances (pure strike, no wind, carry / total): Driver 260 / 282 yd, 3-Wood 234 / 251, 7-Iron 189 / 204, Wedge 107 / 115.

## Kai Lagoon (18 holes)

| Hole | Name | Par | Yards | What to expect |
|---|---|---|---|---|
| 1 | Aloha Start | 4 | 360 | A gentle opener between the palms |
| 2 | Coconut Row | 4 | 340 | Doglegs right to a raised green |
| 3 | Lagoon Hop | 3 | 150 | All carry over a turquoise lagoon |
| 4 | Banyan Bend | 5 | 520 | A long S-bend through the jungle |
| 5 | Jungle Tunnel | 4 | 380 | Straight and narrow, jungle on both sides |
| 6 | Beach Break | 3 | 170 | The ocean waits behind the green |
| 7 | Cliffside | 4 | 410 | The ocean all down the left, green on the cliff edge |
| 8 | Reef Carry | 4 | 320 | Cut across the rocky cove as far as you dare |
| 9 | Sunset Finish | 4 | 390 | Beach and ocean down the right |
| | **Out** | **35** | **3,040** | |
| 10 | Trade Winds | 4 | 405 | Downhill off the headland, cliffs and ocean down the right |
| 11 | Blowhole | 3 | 185 | Carry a rocky ocean inlet from one cliff to the next |
| 12 | Ridge Run | 5 | 545 | Climbs a long ridge, the sea far below on the left |
| 13 | Lookout Point | 4 | 355 | Uphill to a green on the point: long means the ocean |
| 14 | Whale Watch | 4 | 425 | Doglegs left round a cliff bay; cut across it if you dare |
| 15 | Crater Rim | 3 | 160 | Down over a crater pond, the sea behind the green |
| 16 | Pali Drop | 4 | 395 | Drops 30 m from tee to green, beach behind; a perfect drive can reach |
| 17 | Seabird Cliffs | 5 | 530 | The windiest hole: the cliffs close in on the right |
| 18 | Kai Point | 4 | 440 | Home along the cliff edge, ocean left and behind the green |
| | **In** | **36** | **3,440** | |
| | **Total** | **71** | **6,480** | |

Island rules:

- **Jungle**: past the rough on either side is thick jungle (there are no white stakes on this course). A ball in the jungle costs 1 stroke and is dropped on the grass at the edge of the jungle where it went in, the same distance down the hole.
- **Ocean**: the sea is a water hazard, never out of bounds. A ball in the ocean costs 1 stroke and is dropped on the grass at the nearest bit of shore to where it went in, never closer to the hole, and clear of the cliff edge.
- **Beaches** play like bunkers: only the Wedge works from the sand.
- **Sea breeze**: the coastal holes (6 to 9) are windier than the jungle holes, and the back nine up on the headland is windier still (up to about 18 mph).
- **Cliffs**: on the back nine a ball that runs off a cliff top is in the ocean: 1 stroke, and you drop on the grass a few metres back from the edge.
- The lagoon on hole 3 and the crater pond on 15 are normal ponds: 1 stroke and a drop on the dry grass behind them.

The island has its own best score and its own leaderboard. Rounds from when Kai Lagoon had 9 holes stay saved, but only full 18-hole rounds go on the Kai Lagoon board now.

## Phones and tablets

The game switches to touch controls automatically on phones and tablets:

- No walking: you're placed at your ball for every shot, aimed at the flag. The **⛳ To ball** button does it by hand if you've looked around.
- Drag left or right on the course to aim (it's finer on the green).
- Tap a club in the tray at the bottom (swipe it to see them all).
- Hold the big yellow **SWING** button for power, let go, then tap it again when it turns green and the marker is in the gold zone.
- **☰** pauses the game, restarts the hole or opens Settings.
- Your score is a small circle at the top right (green under par, red over; in a room it also shows your place). Tap it for the full scorecard. Between holes you get a slim strip with your result and **Next hole**; the full card shows after the round (or tap **Full card**).
- A flag tag with the distance always floats over today's pin (on phones and computers), so you can see where you're aiming from the tee. If the pin is off-screen, the tag sits at the edge and points toward it.

To play on a phone, the phone has to reach the computer running `server.py`: on the same Wi-Fi, open `http://YOUR-COMPUTER-IP:8010` (see "Friends on the same Wi-Fi" below), or use the Render link. Add `?touch=1` or `?touch=0` to the address to force touch controls on or off.

## Controls

The first time you play, hole 1 walks you through the controls one short step at a time. Each step moves on by itself once you've done it, and **Skip tutorial** closes it for good. Click **? Controls** (bottom left) any time to see every key or replay the tutorial. The line at the bottom of the screen always shows the keys for what you can do right now.

- `F`: go straight to your ball (set up and aimed at the flag). The game reminds you about this once, then leaves you alone
- `WASD` or `↑`/`↓`: walk; hold `Shift` to jog. `←`/`→` or right-drag: look around. Keys go by position, so AZERTY players use `Z Q S D`, and the on-screen key caps show your own keyboard's letters (in Chrome and Edge)
- `E`: set up at the ball or step away (a bubble saying **E · Hit the ball** pops up when you're close enough)
- `A/D` (or slide the mouse): aim; hold `Shift` for fine aim
- `1` Driver, `2` 3-Wood, `3` 7-Iron, `4` Wedge, `5` Putter. The gold **Coach pick** badge shows the best club
- Hold `Space` (or the mouse) for power, let go, then press again when the bouncing accuracy marker is in the gold zone (it keeps bouncing until you do, no rush)
- `P`: shot preview on/off. `R`: restart hole (solo only, asks first). `Enter`: next hole on the scorecard. `Esc`: pause or close a menu
- Browser shortcuts (Cmd/Ctrl + anything) are left alone, so Cmd+R, Ctrl+W and friends never press game keys by accident
- **Full screen** is on the title screen and in the pause menu (or press F11 / Ctrl+Cmd+F)

When you finish a hole the game cheers you on ("Nice birdie!", "Nice par!", "Good bogey"…) before the scorecard appears.

Water costs 1 stroke and you drop on dry grass behind the pond. Out of bounds (past the white stakes along the sides, or deep into the trees) costs 1 stroke and you replay the shot. Hitting over the green is fine: there's rough all around the back of each green, so you just chip back from where the ball stops. In a bunker only the Wedge works.

## Leaderboard and saved scores

Every finished round (solo or in a room) is posted to the leaderboard automatically. Each course has its own board and its own best score. Open **🏆 Leaderboard** on the main menu and pick **18 holes** or **Kai Lagoon** at the top:

- **All-time / This week / Today**: each golfer's best round, lowest score first. You're highlighted.
- **My rounds**: every round you've finished on this device, with your best and your average.

At the end of a round the scorecard shows where you placed ("You're #2 of 57 golfers all-time").

Scores are checked on the server (every hole of that course, each between 1 stroke and double par; room rounds are recorded by the server itself), and one device can't post rounds seconds apart.

### Keeping scores on Render (important)

Render's free plan wipes the server's files every time it restarts or goes to sleep, so a plain scores file would be emptied several times a day. Use a free Upstash database instead (about 5 minutes, no card needed):

1. Sign up at [upstash.com](https://upstash.com) and create a **Redis** database (any region near your Render region, free plan).
2. On the database page, find the **REST API** section and copy the two values: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. In Render, open your service > **Environment** > **Add Environment Variable**, add both with exactly those names, and save. Render restarts the game.
4. Check the server log on Render: it should say `Leaderboard: 0 saved rounds loaded from Upstash.`

On your own computer (or a paid Render service with a disk) nothing is needed: scores are saved in `scores.json` next to `server.py`, or in the folder named by a `DATA_DIR` environment variable. `scores.json` is never served to players and is listed in `.gitignore` so it doesn't end up on GitHub.

## Greens

Every green has its own shape and slopes: crowns, bowls, ridges, false fronts and two-tier greens.

- The pin moves. Each day every hole gets a new "pin of the day" (everyone in a multiplayer room gets the same one). The top-left panel shows where it is, e.g. "back-left" or "top tier".
- When you set up with the Putter, the camera drops low behind the ball and little white dots flow downhill. Faster dots mean a steeper slope and more curve.
- While you putt, the meter on the right shows how far your putt will roll next to how far the flag plays (it turns green when they match).
- The putting line only shows the start of the putt, so reading the curve is up to you. The yellow mark on the power bar already allows for uphill and downhill.
- To change a green, edit its `design` in `course-data.js` (the notes at the top of that file explain each setting).

## Music

The background tune, "Fairway Stroll", is an original piece written for this game and generated live in the browser. There are no audio files and no third-party music, so there is nothing to license. Turn it on or off in Settings.

## CrazyGames

The game runs on CrazyGames from a separate build. Your Render site keeps working exactly as before, and the CrazyGames copy talks to that same Render server for rooms, live updates and the leaderboard.

### 1. Put the new server.py on Render first

The CrazyGames page lives on CrazyGames' domain, so the server now allows cross-origin requests (CORS). Push this version to GitHub so Render redeploys it, then check `https://YOUR-APP.onrender.com/health` in a browser shows `{"ok": true, ...}`.

### 2. Build the upload

```
cd ~/Downloads/fairway-friends-v45
python3 tools/build_crazygames.py --api https://YOUR-APP.onrender.com
```

This makes `dist/fairway-friends-crazygames.zip`. Upload that zip to the CrazyGames developer portal. (The build adds the CrazyGames SDK tag, points the game at your server and leaves out server.py.)

### 3. Settings in the CrazyGames developer portal

- Progress save: **"Yes, using the Data Module from the CrazyGames SDK"** (without it the Data module is switched off and CrazyGames shows "Your progress won't be saved!")
- Multiplayer: yes, with a lobby size of **1 to 4 players**
- Instant Multiplayer: supported. Turn it on if you want the "Play with friends" entry point to drop players straight into a room
- Chat: the game has **no chat**. With CrazyGames' "disable chat" setting on, other players' typed names are hidden and shown as Player 2, 3...
- Keep your Render service awake if you can (a paid instance, or an uptime pinger hitting `/health`). The free plan sleeps after 15 minutes and the first room of the day then takes up to a minute to open (the game shows "Waking up the game server...")

### What the game does with the SDK

- Initialises the SDK while the page loads, before any save is read, and reports loading start and stop
- Saves (settings, best score, round history, tutorial flags) go to the Data module. The first time, it copies an existing browser save across without overwriting anything newer: it keeps the better best score and merges the round history
- Gameplay start and stop: start when a hole is being played (including the hole flyover), stop on pause, scorecards, lobby and menus
- Rooms: reports the room code, whether it can be joined (only in the lobby with a free seat) and the invite parameters; calls `leftRoom` when you leave
- Invites: joins the room from an invite link at startup, and from the join listener while the game is open. Missing, expired, full and wrong-region rooms each get a clear message
- Instant Multiplayer: opens a private room straight away, named after the CrazyGames username
- Respects `muteAudio` and `disableChat`, including when they change mid-game
- Add `?ffdebug=1` to the page address to log every SDK call and print a diagnostics snapshot in the browser console. Room failures are always logged with the tag `[FF/room]`

### Automated checks

```
pip3 install playwright && python3 -m playwright install chromium
python3 tests/crazygames_check.py
```

These checks use a stand-in SDK, so they check the game's side of every call but not CrazyGames' own pages. Test those on CrazyGames with their QA tool.

## Files

- `index.html`: the menus, on-screen panels and styling
- `game.js`: the game itself (graphics, physics, golfers, multiplayer, sound)
- `server.py`: serves the game and runs the multiplayer rooms
- `course-data.js`: the 18 hole layouts, in yards (the server reads the pars from here too)
- `course-island.js`: the 18 Kai Lagoon holes, including the ocean, beaches and cliffs (the server reads these pars too)
- `clubs.js`: the cartoon club models
- `platform.js`: the CrazyGames SDK layer (saves, rooms, invites, settings); does nothing outside CrazyGames
- `config.js`: build settings (empty for the normal copy; the CrazyGames build writes its own)
- `tools/build_crazygames.py`: makes the CrazyGames upload
- `tests/`: automated CrazyGames checks and the stand-in SDK they use
- `fonts/`: the handwriting and serif fonts for the yardage-book hole card (free, open-licence fonts, included so they work offline)

The game loads Three.js from the internet, so the computer needs a connection when the page opens.
