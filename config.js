// Build settings. The normal copy (served by server.py, e.g. on Render) leaves these empty:
// the game then talks to the server it was loaded from.
// tools/build_crazygames.py writes its own config.js into the CrazyGames upload with:
//   crazygames: true                       -> load and initialise the CrazyGames SDK
//   apiBase: 'https://<your-app>.onrender.com'  -> where rooms, live updates and the leaderboard live (HTTPS)
window.FF_CONFIG = Object.assign({ crazygames: false, apiBase: '' }, window.FF_CONFIG || {}); // a page can set FF_CONFIG first (the automated tests do)
