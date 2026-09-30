// Fairway Friends platform layer.
// Everything that talks to the CrazyGames SDK lives here, so the game code never calls the SDK directly and the
// same files still run on our own server (Render) or localhost, where the SDK is absent or "disabled".
//
//   FFPlatform.init()            - loads + initialises the SDK (awaited by index.html before the game code runs)
//   FFPlatform.store             - getItem / setItem / removeItem: the CrazyGames Data module on CrazyGames, localStorage elsewhere
//   FFPlatform.gameplay(active)  - gameplayStart / gameplayStop, only sent when the state really changes
//   FFPlatform.loadingDone()     - loadingStop
//   FFPlatform.room.update/left  - updateRoom / leftRoom
//   FFPlatform.invite            - startup invite params, runtime join listener, invite links
//   FFPlatform.settings          - { disableChat, muteAudio } + onSettings(listener)
//   FFPlatform.diagnostics()     - a snapshot for QA (also printed by ?ffdebug=1)
(function () {
  'use strict';
  const LOG = '[FF/CrazyGames]';
  const cfg = window.FF_CONFIG || {};
  const qs = new URLSearchParams(location.search);
  const debug = qs.get('ffdebug') === '1';
  const events = []; // recent SDK calls, for diagnostics
  function note(kind, detail) { const e = { t: Math.round(performance.now()), kind, detail }; events.push(e); if (events.length > 80) events.shift(); if (debug || kind === 'error') console[kind === 'error' ? 'warn' : 'info'](LOG, kind, detail === undefined ? '' : detail); }

  const state = { environment: 'none', sdkLoaded: false, initialised: false, initError: null, dataModule: false, migrated: [], settings: { disableChat: false, muteAudio: false }, instantMultiplayer: false, startupInvite: null, gameplay: false, room: null };
  const settingsListeners = new Set(), joinListeners = new Set();
  let sdk = null;

  // ---------- loading the SDK script (only the CrazyGames build has the <script> tag; this also covers ?useLocalSdk=true) ----------
  function sdkWanted() { return !!cfg.crazygames || qs.get('useLocalSdk') === 'true' || /(^|\.)crazygames\./i.test(location.hostname); }
  function loadSdkScript() {
    if (window.CrazyGames && window.CrazyGames.SDK) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
      s.onload = resolve; s.onerror = () => reject(new Error('SDK script failed to load')); document.head.appendChild(s);
    });
  }
  const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what} timed out after ${ms} ms`)), ms))]);

  // ---------- storage: Data module on CrazyGames, localStorage everywhere else ----------
  const local = {
    getItem(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    setItem(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode: saving is optional */ } },
    removeItem(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const DATA_LIMIT = 1000000, DATA_SOFT_LIMIT = 900000; // the Data module holds 1 MB per player; we stay well under
  const cgData = {
    getItem(k) { try { return sdk.data.getItem(k); } catch (e) { note('error', { op: 'data.getItem', key: k, error: String(e && e.message || e) }); return local.getItem(k); } },
    setItem(k, v) {
      try {
        if (dataSize(k, v) > DATA_SOFT_LIMIT) { note('error', { op: 'data.setItem', key: k, error: 'would exceed the 1 MB Data module limit; not saved' }); return false; }
        sdk.data.setItem(k, v); return true;
      } catch (e) { note('error', { op: 'data.setItem', key: k, error: String(e && (e.code || e.message) || e) }); return false; }
    },
    removeItem(k) { try { sdk.data.removeItem(k); } catch (e) { note('error', { op: 'data.removeItem', key: k, error: String(e && e.message || e) }); } }
  };
  const KNOWN_KEYS = ['fairwayFriends.settings.v1', 'fairwayFriends.bestScore18.v1', 'fairwayFriends.bestScore.island.v1', 'fairwayFriends.bestScore.island18.v1', 'fairwayFriends.tips.v1', 'fairwayFriends.tutorialDone.v1', 'fairwayFriends.teleportTaught.v1', 'fairwayFriends.history.v1', 'fairwayFriends.device.v1'];
  function dataSize(changedKey, changedValue) { let total = 0; KNOWN_KEYS.forEach(k => { const v = k === changedKey ? changedValue : (sdk ? safeGet(k) : null); if (v) total += k.length + v.length + 6; }); return total; }
  function safeGet(k) { try { return sdk.data.getItem(k); } catch (e) { return null; } }
  const store = { getItem: k => (state.dataModule ? cgData : local).getItem(k), setItem: (k, v) => (state.dataModule ? cgData : local).setItem(k, v), removeItem: k => (state.dataModule ? cgData : local).removeItem(k) };

  // One-time, non-destructive copy of progress saved before the Data module was used.
  // Rules: never overwrite a value the Data module already has, except to keep the BETTER best score and the
  // UNION of the round history (so a newer cloud save and an older local save both survive). Done once per device.
  const MIGRATION_FLAG = 'fairwayFriends.cgMigrated.v1';
  function migrateLocalProgress() {
    if (local.getItem(MIGRATION_FLAG) === 'done') return;
    const parse = v => { try { return JSON.parse(v); } catch (e) { return undefined; } };
    KNOWN_KEYS.forEach(k => {
      const old = local.getItem(k); if (old === null) return; const cur = safeGet(k);
      if (cur === null || cur === undefined) { if (cgData.setItem(k, old)) state.migrated.push(k); return; }
      if (k.indexOf('bestScore') >= 0) { const a = parse(old), b = parse(cur); if (a && b && Number.isFinite(a.score) && Number.isFinite(b.score) && a.score < b.score && cgData.setItem(k, old)) state.migrated.push(k + ' (better local best)'); return; }
      if (k === 'fairwayFriends.history.v1') {
        const a = parse(old), b = parse(cur); if (!Array.isArray(a) || !Array.isArray(b)) return;
        const seen = new Set(b.map(r => r && (r.id || JSON.stringify(r)))); const merged = b.concat(a.filter(r => r && !seen.has(r.id || JSON.stringify(r))));
        if (merged.length !== b.length) { merged.sort((x, y) => (y.when || 0) - (x.when || 0)); if (cgData.setItem(k, JSON.stringify(merged.slice(0, 60)))) state.migrated.push(k + ' (merged)'); }
      }
    });
    local.setItem(MIGRATION_FLAG, 'done'); note('migration', state.migrated.length ? state.migrated : 'nothing to copy');
  }

  // ---------- init ----------
  let readyPromise = null;
  function init() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      if (!sdkWanted()) { state.environment = 'none'; note('init', 'not a CrazyGames build: SDK skipped, localStorage saves'); return state; }
      try {
        await withTimeout(loadSdkScript(), 10000, 'SDK script'); state.sdkLoaded = true; sdk = window.CrazyGames.SDK;
        await withTimeout(sdk.init(), 12000, 'SDK.init()'); state.initialised = true; state.environment = sdk.environment || 'unknown';
        note('init', { environment: state.environment });
        if (state.environment === 'disabled') { sdk = null; return state; } // other domains: every SDK call would throw
        try { sdk.game.loadingStart(); note('loadingStart'); } catch (e) { note('error', { op: 'loadingStart', error: String(e) }); }
        // Data module: available after init; a quick probe tells us if the dashboard setting is on
        try { sdk.data.getItem('fairwayFriends.probe'); state.dataModule = true; migrateLocalProgress(); } catch (e) { state.dataModule = false; note('error', { op: 'data module unavailable, falling back to localStorage', error: String(e && (e.code || e.message) || e) }); }
        try { const s = sdk.game.settings || {}; state.settings = { disableChat: !!s.disableChat, muteAudio: !!s.muteAudio }; } catch (e) {}
        try { sdk.game.addSettingsChangeListener(ns => { state.settings = { disableChat: !!(ns && ns.disableChat), muteAudio: !!(ns && ns.muteAudio) }; note('settings', state.settings); settingsListeners.forEach(fn => { try { fn(state.settings); } catch (e) { console.error(e); } }); }); } catch (e) { note('error', { op: 'addSettingsChangeListener', error: String(e) }); }
        try { state.instantMultiplayer = !!sdk.game.isInstantMultiplayer; } catch (e) {}
        try { const p = sdk.game.inviteParams; state.startupInvite = p ? Object.assign({}, p) : (sdk.game.getInviteParam('roomId') ? { roomId: sdk.game.getInviteParam('roomId') } : null); } catch (e) {}
        try { sdk.game.addJoinRoomListener(params => { note('joinRoomListener', params); joinListeners.forEach(fn => { try { fn(params || {}); } catch (e) { console.error(e); } }); }); } catch (e) { note('error', { op: 'addJoinRoomListener', error: String(e) }); }
        note('ready', { dataModule: state.dataModule, settings: state.settings, instantMultiplayer: state.instantMultiplayer, startupInvite: state.startupInvite });
      } catch (e) {
        state.initError = String(e && e.message || e); sdk = null; note('error', { op: 'init', error: state.initError });
      }
      return state;
    })();
    return readyPromise;
  }
  const active = () => !!sdk;
  function call(op, fn) { if (!sdk) return undefined; try { const r = fn(sdk); note(op); return r; } catch (e) { note('error', { op, error: String(e && e.message || e) }); return undefined; } }

  // ---------- user ----------
  async function username() {
    if (!sdk) return null;
    try { if (sdk.user && sdk.user.isUserAccountAvailable === false) return null; const u = await sdk.user.getUser(); return u && u.username ? String(u.username) : null; }
    catch (e) { note('error', { op: 'user.getUser', error: String(e) }); return null; }
  }

  // ---------- room state for CrazyGames' invite + Instant Multiplayer UI ----------
  let lastRoomJson = '';
  const room = {
    update(roomId, isJoinable) {
      const data = { roomId: String(roomId), isJoinable: !!isJoinable, inviteParams: { roomId: String(roomId), region: 'global' } };
      const json = JSON.stringify(data); if (json === lastRoomJson) return; lastRoomJson = json; state.room = data;
      call('updateRoom ' + json, s => s.game.updateRoom(data));
    },
    left() { if (!state.room) return; state.room = null; lastRoomJson = ''; call('leftRoom', s => s.game.leftRoom()); }
  };
  const invite = {
    startup: () => state.startupInvite,
    consumeStartup() { const p = state.startupInvite; state.startupInvite = null; return p; },
    onJoin(fn) { joinListeners.add(fn); },
    link(roomId) { return call('inviteLink', s => s.game.inviteLink({ roomId: String(roomId), region: 'global' })) || null; }
  };

  window.FFPlatform = {
    init, get ready() { return readyPromise || init(); }, store, room, invite, username,
    get isCrazyGames() { return active(); }, get environment() { return state.environment; },
    get settings() { return state.settings; }, onSettings(fn) { settingsListeners.add(fn); },
    get instantMultiplayer() { return state.instantMultiplayer; },
    gameplay(on) { on = !!on; if (on === state.gameplay) return; state.gameplay = on; call(on ? 'gameplayStart' : 'gameplayStop', s => on ? s.game.gameplayStart() : s.game.gameplayStop()); },
    loadingDone() { call('loadingStop', s => s.game.loadingStop()); },
    happytime() { call('happytime', s => s.game.happytime()); },
    log: note,
    diagnostics() { return JSON.parse(JSON.stringify({ state, events: events.slice(-30), apiBase: cfg.apiBase || '(same origin)' })); }
  };
  if (debug) window.addEventListener('load', () => setTimeout(() => console.info(LOG, 'diagnostics', window.FFPlatform.diagnostics()), 4000));
})();
