#!/usr/bin/env python3
"""
Fairway Friends multiplayer server.

Uses only Python's standard library, so there is nothing to install.
It serves the game files and runs the rooms:
  - create or join a room with a 4-letter code
  - turn order: every player takes one shot before anyone takes another
  - each player's shot is played on their own screen; the result (and the ball's
    path, so everyone can watch it) is shared with the room
  - live scorecard for everyone

Run it:   python3 server.py        then open http://localhost:8010
Online:   set the PORT environment variable (hosts like Render do this for you)
"""
import json
import os
import queue
import random
import secrets
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", "8010"))
ROOT = os.path.dirname(os.path.abspath(__file__))
PARS = [4, 4, 3, 5, 4, 3, 4, 4, 5]          # must match course-data.js
MAX_SCORE_MULTIPLIER = 2
MAX_PLAYERS = 4
MAX_WIND_MPH = 11
COLORS = ["#4d75ef", "#ff7168", "#2fb5a6", "#f5b700"]
LEAVE_AFTER_SECONDS = 45

lock = threading.RLock()
rooms = {}


def new_code():
    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    while True:
        code = "".join(random.choice(letters) for _ in range(4))
        if code not in rooms:
            return code


def clean_name(value):
    name = "".join(ch for ch in str(value or "") if ch not in "<>").strip()[:14]
    return name or "Golfer"


def clean_character(value):
    return "girl" if value == "girl" else "boy"


def make_winds():
    return [{"mph": round(random.uniform(0, MAX_WIND_MPH), 1), "angle": random.uniform(0, 6.283)} for _ in PARS]


class Room:
    def __init__(self):
        self.code = new_code()
        self.players = []
        self.host_id = None
        self.phase = "lobby"          # lobby, playing, holeover, finished
        self.hole = 0
        self.turn_id = None
        self.winds = make_winds()
        self.clients = []             # list of (player_id, queue)
        self.touched = time.time()

    def player_by_token(self, token):
        return next((p for p in self.players if p["token"] == token), None)

    def active_players(self):
        return [p for p in self.players if not p["left"]]

    def public_state(self):
        return {
            "code": self.code,
            "phase": self.phase,
            "hostId": self.host_id,
            "hole": self.hole,
            "turnId": self.turn_id,
            "wind": self.winds[self.hole],
            "pars": PARS,
            "players": [{
                "id": p["id"], "name": p["name"], "character": p["character"], "color": p["color"],
                "scores": p["scores"], "ball": p["ball"], "strokes": p["strokes"], "done": p["done"],
                "holed": p["holed"], "connected": p["connections"] > 0, "left": p["left"],
            } for p in self.players],
        }

    def send(self, payload):
        data = json.dumps(payload)
        for _, q in list(self.clients):
            q.put(data)

    def broadcast(self):
        self.send({"type": "state", "state": self.public_state()})

    # ---------- game flow ----------
    def start_hole(self, index):
        self.hole = index
        self.phase = "playing"
        if index > 0:
            # honour: best score on the last hole tees off first
            self.players.sort(key=lambda p: (p["scores"][index - 1] if p["scores"][index - 1] is not None else 99))
        for p in self.players:
            p["ball"] = None
            p["strokes"] = 0
            p["holed"] = False
            p["done"] = p["left"]
            if p["left"]:
                p["scores"][index] = PARS[index] * MAX_SCORE_MULTIPLIER
        first = next((p for p in self.players if not p["done"]), None)
        self.turn_id = first["id"] if first else None
        if not first:
            self.phase = "holeover"

    def advance_turn(self):
        """Round-robin: the next player (in order) who hasn't finished the hole."""
        order = self.players
        if not any(not p["done"] for p in order):
            self.turn_id = None
            self.phase = "finished" if self.hole >= len(PARS) - 1 else "holeover"
            return
        ids = [p["id"] for p in order]
        start = ids.index(self.turn_id) if self.turn_id in ids else -1
        for step in range(1, len(order) + 1):
            candidate = order[(start + step) % len(order)]
            if not candidate["done"]:
                self.turn_id = candidate["id"]
                return

    def mark_left(self, player):
        player["left"] = True
        if self.phase == "lobby":
            self.players = [p for p in self.players if p is not player]
            if self.host_id == player["id"] and self.players:
                self.host_id = self.players[0]["id"]
            return
        if not player["done"]:
            player["done"] = True
            player["scores"][self.hole] = PARS[self.hole] * MAX_SCORE_MULTIPLIER
            if self.turn_id == player["id"]:
                self.advance_turn()
            elif not any(not p["done"] for p in self.players):
                self.advance_turn()
        if self.host_id == player["id"]:
            others = self.active_players()
            if others:
                self.host_id = others[0]["id"]


def new_player(name, character, color):
    return {
        "id": secrets.token_hex(4), "token": secrets.token_hex(16), "name": clean_name(name),
        "character": clean_character(character), "color": color, "scores": [None] * len(PARS),
        "ball": None, "strokes": 0, "done": False, "holed": False, "connections": 0,
        "left": False, "last_seen": time.time(),
    }


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.woff2': 'font/woff2', '.js': 'text/javascript'}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        pass  # keep the terminal quiet

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def json_reply(self, status, obj):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = min(int(self.headers.get("Content-Length") or 0), 200_000)
        try:
            return json.loads(self.rfile.read(length) or b"{}")
        except ValueError:
            return {}

    # ---------- live updates (Server-Sent Events) ----------
    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/health":
            return self.json_reply(200, {"ok": True, "rooms": len(rooms)})
        if url.path != "/events":
            return super().do_GET()
        qs = parse_qs(url.query)
        code = (qs.get("code") or [""])[0].upper()
        token = (qs.get("token") or [""])[0]
        with lock:
            room = rooms.get(code)
            player = room.player_by_token(token) if room else None
            if not player:
                self.send_response(404)
                self.end_headers()
                return
            q = queue.Queue()
            room.clients.append((player["id"], q))
            player["connections"] += 1
            player["last_seen"] = time.time()
            if player["left"] and room.phase != "lobby":
                player["left"] = False   # back in from the next hole
            room.broadcast()
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("X-Accel-Buffering", "no")
        self.end_headers()
        try:
            self.wfile.write(b"retry: 2000\n\n")
            self.wfile.flush()
            while True:
                try:
                    data = q.get(timeout=15)
                    self.wfile.write(f"data: {data}\n\n".encode())
                except queue.Empty:
                    self.wfile.write(b": ping\n\n")
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass
        finally:
            with lock:
                if (player["id"], q) in room.clients:
                    room.clients.remove((player["id"], q))
                player["connections"] = max(0, player["connections"] - 1)
                player["last_seen"] = time.time()
                room.broadcast()

    # ---------- actions ----------
    def do_POST(self):
        path = urlparse(self.path).path
        body = self.read_json()
        with lock:
            if path == "/api/create":
                room = Room()
                player = new_player(body.get("name"), body.get("character"), COLORS[0])
                room.players.append(player)
                room.host_id = player["id"]
                rooms[room.code] = room
                return self.json_reply(200, {"code": room.code, "token": player["token"], "id": player["id"]})

            room = rooms.get(str(body.get("code", "")).upper())
            if not room:
                return self.json_reply(404, {"error": "That room code was not found. Check the 4 letters and try again."})
            room.touched = time.time()

            if path == "/api/join":
                if room.phase != "lobby":
                    return self.json_reply(409, {"error": "That round has already started. Ask your friends to make a new room."})
                if len(room.players) >= MAX_PLAYERS:
                    return self.json_reply(409, {"error": "That room is full (4 players max)."})
                used = {p["color"] for p in room.players}
                player = new_player(body.get("name"), body.get("character"), next(c for c in COLORS if c not in used))
                room.players.append(player)
                room.broadcast()
                return self.json_reply(200, {"code": room.code, "token": player["token"], "id": player["id"]})

            me = room.player_by_token(body.get("token"))
            if not me:
                return self.json_reply(403, {"error": "You are not in this room. Join again with the room code."})

            if path == "/api/character":
                me["character"] = clean_character(body.get("character"))
                room.broadcast()
                return self.json_reply(200, {"ok": True})

            if path == "/api/start":
                if me["id"] != room.host_id:
                    return self.json_reply(403, {"error": "Only the host can start the round."})
                if room.phase != "lobby":
                    return self.json_reply(409, {"error": "The round already started."})
                room.start_hole(0)
                room.broadcast()
                return self.json_reply(200, {"ok": True})

            if path == "/api/shot":
                if room.phase != "playing" or room.turn_id != me["id"]:
                    return self.json_reply(409, {"error": "It isn't your turn yet."})
                result = body.get("result") or {}
                try:
                    ball = {k: round(float(result[k]), 3) for k in ("x", "y", "z")}
                except (KeyError, TypeError, ValueError):
                    return self.json_reply(400, {"error": "Bad shot data."})
                ball["surface"] = str(result.get("surface", ""))[:16]
                max_score = PARS[room.hole] * MAX_SCORE_MULTIPLIER
                me["ball"] = ball
                me["strokes"] = max(0, min(int(result.get("strokes", 0)), max_score))
                me["holed"] = bool(result.get("holed"))
                me["done"] = bool(result.get("done")) or me["holed"] or me["strokes"] >= max_score
                if me["done"]:
                    me["scores"][room.hole] = max(1, min(me["strokes"], max_score))
                path_points = result.get("path") or []
                if not isinstance(path_points, list):
                    path_points = []
                room.advance_turn()
                room.send({"type": "shot", "playerId": me["id"], "path": path_points[:900], "result": ball, "holed": me["holed"], "state": room.public_state()})
                return self.json_reply(200, {"ok": True})

            if path == "/api/next":
                if room.phase == "holeover":
                    room.start_hole(room.hole + 1)
                    room.broadcast()
                return self.json_reply(200, {"ok": True})

            if path == "/api/rematch":
                if room.phase != "finished":
                    return self.json_reply(409, {"error": "The round is not over yet."})
                room.players = [p for p in room.players if not p["left"]]
                for p in room.players:
                    p["scores"] = [None] * len(PARS)
                room.winds = make_winds()
                room.start_hole(0)
                room.broadcast()
                return self.json_reply(200, {"ok": True})

            if path == "/api/leave":
                room.mark_left(me)
                if not room.active_players():
                    rooms.pop(room.code, None)
                else:
                    room.broadcast()
                return self.json_reply(200, {"ok": True})

        return self.json_reply(404, {"error": "Unknown action."})


def housekeeping():
    """Skip players who disconnect for a while and clear out old rooms."""
    while True:
        time.sleep(5)
        now = time.time()
        with lock:
            for code, room in list(rooms.items()):
                for p in list(room.players):
                    if p["connections"] == 0 and not p["left"] and now - p["last_seen"] > LEAVE_AFTER_SECONDS:
                        room.mark_left(p)
                        room.broadcast()
                if not room.clients and now - room.touched > 3 * 3600:
                    rooms.pop(code, None)


if __name__ == "__main__":
    threading.Thread(target=housekeeping, daemon=True).start()
    server = ThreadingHTTPServer(("", PORT), Handler)
    server.daemon_threads = True
    print(f"Fairway Friends is running at http://localhost:{PORT}")
    print("Friends on the same Wi-Fi can join at http://<this computer's IP>:" + str(PORT))
    print("Press Control-C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
