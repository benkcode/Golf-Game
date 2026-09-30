// A stand-in for the CrazyGames SDK v3, injected by tests/crazygames_check.py before the page loads.
// It records every call in window.__cg.calls so the test can check order and arguments.
(function () {
  const opts = window.__cgOptions || {};
  const cg = window.__cg = { calls: [], data: Object.assign({}, opts.data || {}), settings: Object.assign({ disableChat: false, muteAudio: false }, opts.settings || {}), settingsListeners: [], joinListeners: [], initDone: false };
  const rec = (name, arg) => cg.calls.push(arg === undefined ? [name] : [name, JSON.parse(JSON.stringify(arg))]);
  window.CrazyGames = { SDK: {
    environment: 'crazygames',
    init: () => new Promise(res => setTimeout(() => { cg.initDone = true; rec('init'); res(); }, 300)),
    data: {
      getItem(k) { if (!cg.initDone) throw new Error('data used before init'); return Object.prototype.hasOwnProperty.call(cg.data, k) ? cg.data[k] : null; },
      setItem(k, v) { if (!cg.initDone) throw new Error('data used before init'); cg.data[k] = String(v); rec('data.setItem', k); },
      removeItem(k) { delete cg.data[k]; rec('data.removeItem', k); }, clear() { cg.data = {}; rec('data.clear'); }
    },
    game: {
      gameplayStart() { rec('gameplayStart'); }, gameplayStop() { rec('gameplayStop'); }, loadingStart() { rec('loadingStart'); }, loadingStop() { rec('loadingStop'); }, happytime() { rec('happytime'); },
      get settings() { return Object.assign({}, cg.settings); }, addSettingsChangeListener(fn) { cg.settingsListeners.push(fn); }, removeSettingsChangeListener() {},
      isInstantMultiplayer: !!opts.instant, inviteParams: opts.invite || null, getInviteParam(k) { return opts.invite && opts.invite[k] != null ? String(opts.invite[k]) : null; },
      addJoinRoomListener(fn) { cg.joinListeners.push(fn); }, removeJoinRoomListener() {},
      updateRoom(d) { rec('updateRoom', d); }, leftRoom() { rec('leftRoom'); },
      inviteLink(p) { rec('inviteLink', p); return 'https://www.crazygames.com/game/fairway-friends?roomId=' + p.roomId; }
    },
    user: { isUserAccountAvailable: true, getUser: async () => (opts.username ? { username: opts.username } : null) }
  } };
  cg.changeSettings = s => { Object.assign(cg.settings, s); cg.settingsListeners.forEach(fn => fn(Object.assign({}, cg.settings))); };
  cg.join = p => cg.joinListeners.forEach(fn => fn(p));
})();
