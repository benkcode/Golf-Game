# Fairway Friends v26

A cartoon nine-hole golf game you can play solo or against friends on their own computers.

## Start the game

1. Unzip `fairway-friends-v26.zip` into your Mac's Downloads folder.
2. Open Terminal and paste this one line:

```bash
cd ~/Downloads/fairway-friends-v26 && python3 server.py
```

3. Keep Terminal open and visit [http://localhost:8010](http://localhost:8010) in Chrome.

Nothing needs to be installed: `server.py` only uses what already comes with Python on a Mac.
To stop the game, click the Terminal window and press `Control-C`.
If Terminal says the address is already in use, an older copy is still running: press `Control-C` in that window, or restart Terminal, then paste the line again.

## Playing with friends

On the sign-in screen, type your name and pick your golfer (boy or girl).

- **Create a room** gives you a 4-letter code and an invite link.
- Friends type the code and press **Join room**, or open the invite link.
- When everyone appears in the lobby, the host presses **Start round**.
- Up to 4 players. Everyone plays the same wind.

Rules in a room:

- Everyone takes one shot before anyone takes another. When it isn't your turn you can walk around and watch, but you can't set up or swing.
- You watch each other's shots live, with a coloured tracer.
- The leaderboard (top right) shows everyone's score to par. Press **View scorecard** for the full card.
- After each hole the scorecard shows everyone's scores; anyone can tee off the next hole. On later holes, the lowest score on the last hole tees off 
