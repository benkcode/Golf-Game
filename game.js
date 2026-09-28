// Fairway Friends game code: graphics, physics, menus, multiplayer screens and sound.
// Loaded by index.html after Three.js (as an ES module) and clubs.js.
    'use strict';

    const COURSE_DATA = window.FAIRWAY_FRIENDS_COURSE_DATA;
    if (!COURSE_DATA) throw new Error('course-data.js did not load. Keep it beside index.html.');

    // Feel, physics, world scale, and UI tuning live here. Hole layouts live in course-data.js.
    const CONFIG = {
      units: { metersPerUnit: 1, metersToYards: 1.0936133 },
      world: { teeZ: 5, groundMarginMeters: 90, backRoughMeters: 40, hazardBankMeters: 12, teeWidthMeters: 5.5, teeDepthMeters: 7, ballDiameterMeters: .15, terrainGridSegments: 48 },
      physics: {
        fixedTimeStep: 1 / 120,
        gravity: -9.81,
        airDrag: .012,
        rollingStopSpeed: .12,
        windEffect: .22,
        windHeightEffect: 1.8,
        maxFrameTime: .2,
        waterCaptureHeight: .9,
        outOfBoundsCaptureHeight: .7,
        surfaces: {
          tee: { friction: .68, restitution: .30, stopSpeed: .12, distanceMultiplier: 1, impactKeep: .6, rollDecel: 2.4 },
          fairway: { friction: .54, restitution: .32, stopSpeed: .12, distanceMultiplier: 1, impactKeep: .62, rollDecel: 2.2 },
          rough: { friction: 1.35, restitution: .18, stopSpeed: .16, distanceMultiplier: .90, impactKeep: .38, rollDecel: 5.5 },
          fringe: { friction: .45, restitution: .24, stopSpeed: .10, distanceMultiplier: .96, impactKeep: .55, rollDecel: 1.6 },
          green: { friction: .19, restitution: .20, stopSpeed: .06, distanceMultiplier: 1, impactKeep: .55, rollDecel: 1.25 },
          sand: { friction: 3.7, restitution: .05, stopSpeed: .34, distanceMultiplier: .42, impactKeep: .12, rollDecel: 9 },
          water: { friction: 4, restitution: 0, stopSpeed: .3, distanceMultiplier: .5, impactKeep: 0, rollDecel: 20 },
          outOfBounds: { friction: 2, restitution: 0, stopSpeed: .3, distanceMultiplier: 1, impactKeep: 0, rollDecel: 20 }
        },
        maxBounces: 4,
        toppedRollShare: .45,
        bunkerDepthMeters: .12,
        waterDepthMeters: .04
      },
      spin: {
        backspinMaxRpm: 4200,
        sidespinMaxRpm: 3200,
        liftStrength: .085,
        magnusStrength: .22,
        airSpinDecay: .16,
        groundSpinDecay: 3.2,
        landingSpinLoss: .58,
        backspinGroundStop: .52
      },
      wind: {
        minMph: 0,
        maxMph: 11,
        mphToMetersPerSecond: .44704,
        alongFlightMultiplier: .55,
        crosswindMultiplier: 1.25,
        heightBias: 1.8,
        rerollKey: 'g'
      },
      // club distances were raised 20% with the back nine (18 holes, with par 5s you can reach in two)
      clubs: {
        Driver: { key: '1', model: 'driver', maxDistanceMeters: 240, maxRollMeters: 29, launchAngleDegrees: 14, backspinRpm: 1800, mishitSidespinRpm: 3200, clubLength: 1.16, headWidth: .28, sandMultiplier: .42, teeOnlySuggestion: true },
        '3-Wood': { key: '2', model: 'wood3', maxDistanceMeters: 216, maxRollMeters: 22, launchAngleDegrees: 13, backspinRpm: 2200, mishitSidespinRpm: 2800, clubLength: 1.13, headWidth: .26, sandMultiplier: .40 },
        '7-Iron': { key: '3', model: 'iron7', maxDistanceMeters: 174, maxRollMeters: 12, launchAngleDegrees: 24, backspinRpm: 3000, mishitSidespinRpm: 2400, clubLength: 1.02, headWidth: .22, sandMultiplier: .40 },
        Wedge: { key: '4', model: 'wedge', maxDistanceMeters: 98, maxRollMeters: 5, launchAngleDegrees: 36, backspinRpm: 4200, mishitSidespinRpm: 1500, clubLength: .88, headWidth: .26, sandMultiplier: .72, sandWedge: true },
        Putter: { key: '5', model: 'putter', maxDistanceMeters: 20, maxRollMeters: 20, launchAngleDegrees: 2, backspinRpm: 0, mishitSidespinRpm: 250, clubLength: .72, headWidth: .36, putter: true, sandMultiplier: .3 }
      },
      clubSuggestion: { enabled: true, fringePuttMeters: 15, powerHeadroom: .95 },
      clubModel: { headScale: 2.2, lengthToGround: .96 },
      swing: { meterSpeed: .92, putterMeterSpeed: .72, accuracySpeed: .72, powerMax: 1.15, sweetSpotCenter: .78, sweetSpotWidth: .2, overswingDistanceBonus: .12, overswingAccuracyPenalty: 2.4 },
      aim: { stepDegrees: 5, mouseDegreesPerPixel: .06, turnSpeedDegrees: 70, fineTurnSpeedDegrees: 18, autoAimAtPin: true, arrowCurve: .035, putterLineLength: 5, landingCircleRadius: 1.1 },
      shotQuality: { perfectWidthMultiplier: .5, niceWidthMultiplier: 1.4, toppedError: .26, fatError: .36, toppedPowerMultiplier: .32, fatPowerMultiplier: .42, fatLaunchAngleMultiplier: .78, toppedSpinMultiplier: 0, fatSpinMultiplier: .55 },
      character: { look: { polo: 0x3f5fd8, poloDark: 0x27409f, collar: 0xf4f1e6, skin: 0xf0b88a, hair: 0x6b3f24, cap: 0xe8584c, capDark: 0xb83f36, pants: 0xefe9d6, belt: 0x1f2f5c, buckle: 0xf4f1e6, shoe: 0xf7f7f2, sole: 0x223a73, glove: 0xffffff, nose: 0xf08a5b }, stance: { ballForward: .5, ballTowardTarget: .1, handHeight: .97, handReach: .36 }, height: 1.8, bodyColor: 0x4d75ef, skinColor: 0xf0b58f, capColor: 0xff7168, shoeColor: 0xf2f0df, walkSpeed: 4.2, jogSpeed: 8.5, acceleration: 16, deceleration: 20, turnSmoothness: 12, trunkRadius: .45, addressDistance: 2.4, addressOffset: 1.18, allowTeleport: true, teleportKey: 't', goToBallKey: 'f', goToBallFadeSeconds: .22 },
      animation: { walkCycleSpeed: 8.5, walkLegSwing: .48, walkArmSwing: .34, backswingMax: 1.75, putterBackswingMax: .52, downswingDuration: .48, contactPoint: .62, followThroughDuration: .42, followThroughHold: .38, followThroughAngle: 1.12, putterFollowThroughAngle: .42, addressKneeBend: .12, poseSmoothing: 16, putterStrokeBase: .34, putterStrokePerRadian: .55, putterFollowRatio: 1.05 },
      preview: { enabled: true, toggleKey: 'p', sampleEverySteps: 3, maxSteps: 900 },
      scoring: { cupDiameterMeters: .5, cupRadiusMeters: .25, holeCaptureSpeed: 1.35, cupPullRadius: .45, cupPullStrength: .9, cupDropSeconds: .45, maxScoreMultiplier: 2, skipHoleKey: 'n' },
      hazards: { waterSinkSeconds: 1.1, dropDelaySeconds: 1.6, dropSeconds: .7, dropClearanceMeters: 2, sandOnlyWedge: true },
      greens: { slopeGravity: 9, bakedShade: false, shadeExaggeration: 7, flowDots: 340, previewShare: .5 },
      putting: { rangePerDistance: 1.6, rangeExtraMeters: 1.5, minRangeMeters: 4, aimPastCupMeters: .3, pullFlagOnGreen: true },
      camera: {
        thirdPersonOffset: { x: 3.1, y: 2.55, z: 4.9 },
        puttingOffset: { x: 1.85, y: 1.48, z: 3.15 },
        puttRead: { back: 3.7, side: 1.05, height: .9, lookAhead: 6, lookHeight: -.15 },
        lookAhead: 6,
        puttingLookAhead: 3.8,
        lookHeight: 1.05,
        puttingLookHeight: .48,
        followSmoothness: 7,
        flightPositionRate: 2.6,
        flightLookRate: 5.5,
        flightTurnRate: 1.8,
        yawSmoothness: 9,
        mouseOrbitSpeed: .004,
        keyOrbitSpeedDegrees: 120,
        autoFollowRate: 1.6,
        ballFollowDistance: 7,
        ballFollowHeight: 4.4,
        ballLookAhead: 3,
        ballHoldDuration: 1.55,
        minGroundClearance: 1.05,
        treeClearance: 1.15,
        farClip: 1100,
        fogNear: 65,
        fogFar: 620
      },
      presentation: { flyoverDuration: 4.2, introDuration: 1.8, greenCameraHeight: 16, midCameraHeight: 22, teeCameraHeight: 7.4 },
      audio: { masterVolume: .8, effectsVolume: .68, ambienceVolume: .18, musicVolume: .55, musicBpm: 84, birdMinDelay: 5, birdMaxDelay: 11 },
      characters: {
        boy: { look: { polo: 0x3f5fd8, poloDark: 0x27409f, collar: 0xf4f1e6, skin: 0xf0b88a, hair: 0x6b3f24, cap: 0xe8584c, capDark: 0xb83f36, pants: 0xefe9d6, belt: 0x1f2f5c, buckle: 0xf4f1e6, shoe: 0xf7f7f2, sole: 0x223a73, glove: 0xffffff, nose: 0xf08a5b, sock: 0xffffff } },
        girl: { look: { polo: 0x2fb5a6, poloDark: 0x1d8a7e, collar: 0xffffff, skin: 0xe7a77c, hair: 0x7a3b1e, cap: 0xff6fa3, capDark: 0xd9477f, pants: 0xf7f5ee, belt: 0xff6fa3, buckle: 0xffffff, shoe: 0xffffff, sole: 0xff6fa3, glove: 0xffffff, nose: 0xf08a5b, sock: 0xffffff } }
      },
      tracer: { maxPoints: 420, width: .22, lingerSeconds: 2.2, color: 0xffe066 },
      effects: { maxParticles: 260, maxTrailPoints: 42, trailInterval: .028, particleGravity: 7.2, splashRingCount: 6 },
      onboarding: { tipDuration: 4.3 },
      storage: { settingsKey: 'fairwayFriends.settings.v1', bestScoreKey: 'fairwayFriends.bestScore18.v1', tipsKey: 'fairwayFriends.tips.v1', tutorialKey: 'fairwayFriends.tutorialDone.v1', teleportKey: 'fairwayFriends.teleportTaught.v1', historyKey: 'fairwayFriends.history.v1', deviceKey: 'fairwayFriends.device.v1' },
      settingsDefaults: { character: 'boy', sound: true, music: true, musicVolume: .35, cameraSensitivity: 1, trajectoryPreview: true, mouseAim: true, mouseSensitivity: .6, autoClub: true },
      debug: { enabled: false, allowSpinKeys: false, allowLoftKeys: false },
      courseVisuals: { treeTrunkColor: 0x76502e, treeDarkColor: 0x285f3a, treeLightColor: 0x3f8750, fairwayStripeA: 0x91ce72, fairwayStripeB: 0x86c567, roughColor: 0x78b963, greenColor: 0x73bd68, fringeColor: 0x65ae5d, sandColor: 0xe4c47e, waterColor: 0x4caec4, outOfBoundsColor: 0xf8f7e9, markerBlue: 0x3c76d9, markerWhite: 0xf5f3dc, markerRed: 0xe95d58, slopeColor: 0xd8f0b8, flagHeightMeters: 2.5, cupDiameterMeters: .5,
        cartoon: {
          roughA: 0x72b95a, roughB: 0x64ab4f, deepRough: 0x4e9043, firstCut: 0x86c965,
          fairwayA: 0xa3dd79, fairwayB: 0x86ca63, fairwayEdge: 0x78bd5a, teeColor: 0x9bd873,
          fringe: 0x7ac85e, greenA: 0x98e274, greenB: 0x84d563, greenEdge: 0x5aa84a,
          sand: 0xf3dca3, sandDark: 0xd8b777, water: 0x3cb3dc, waterDeep: 0x2a8fc2, waterFoam: 0xe6fbff,
          trunk: 0x7a4f2c, oakGreens: [0x3f9d49, 0x4bae50, 0x368d43, 0x5cb957, 0x46a04a], pineGreens: [0x2e7d47, 0x286f40, 0x378a4d], autumn: [0xf2a33a, 0xe8743b, 0xf5c542, 0xd8573f, 0xf0b45a, 0xf49ac1], autumnShare: .2, outline: 0x1d3a26,
          groundTint: 0xc4c4c4, sandLift: .14, surfaceLift: { green: .07, fringe: .07, fairway: .05, tee: .08, firstCut: .03 }, stripeMeters: 9, greenStripeMeters: 2.4, greenRampMeters: 7, bunkerDepth: .75, bunkerWall: .32, bunkerBerm: .22, bunkerLipWidth: .22, bunkerSurround: 1.34, pondDepth: .8, moundHeight: .55,
          cartPath: { width: 2.5, offset: 6, wiggle: 1.6, color: 0xe2d9c4, edge: 0xb9ad93, jointMeters: 4 }, tufts: 1300, flowers: 420, rocks: 10, treeScale: 1.35, treeDensity: 1.5, pineShare: .28, decorSpacing: 7, decorRows: 5, terrainCellMeters: 2.5, terrainMargin: 70
        } },
      scene: { skyColor: 0xd6effa, skyTopColor: 0x79c6f2 },
      ui: {
        font: 'Nunito, Trebuchet MS, system-ui, sans-serif',
        colors: { ink: '#172238', muted: '#6a7483', panel: '#ffffff', panelSoft: '#f4f7fb', outline: '#172238', accent: '#ffd449', blue: '#4f7cff', green: '#61c979', red: '#ff786e', shadow: 'rgba(16,31,52,.18)', mapBg: '#cfe8aa', meterBg: '#e8edf3', onColor: '#ffffff' },
        dockSwingMeter: true,
        sizes: { padding: 16, radius: 18, outlineWidth: 2, buttonRadius: 15, minimap: 180, swingPanelWidth: 176, meterHeight: 112, clubButtonWidth: 88, menuPanelWidth: 470 }
      }
    };

    const $ = id => document.getElementById(id);
    function applyUITheme() {
      const root = document.documentElement;
      Object.entries(CONFIG.ui.colors).forEach(([key, value]) => root.style.setProperty(`--ui-${key}`, value));
      const sizes = CONFIG.ui.sizes;
      root.style.setProperty('--ui-font', CONFIG.ui.font);
      root.style.setProperty('--ui-pad', `${sizes.padding}px`);
      root.style.setProperty('--ui-radius', `${sizes.radius}px`);
      root.style.setProperty('--ui-outline-width', `${sizes.outlineWidth}px`);
      root.style.setProperty('--ui-button-radius', `${sizes.buttonRadius}px`);
      root.style.setProperty('--minimap-size', `${sizes.minimap}px`);
      root.style.setProperty('--swing-panel-width', `${sizes.swingPanelWidth}px`);
      root.style.setProperty('--meter-height', `${sizes.meterHeight}px`);
      root.style.setProperty('--club-button-width', `${sizes.clubButtonWidth}px`);
      root.style.setProperty('--menu-panel-width', `${sizes.menuPanelWidth}px`);
    }
    applyUITheme();

    // Browser storage is optional: the game still works when private mode blocks it.
    function readStoredJSON(key, fallback) {
      try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); }
      catch (error) { return fallback; }
    }
    function writeStoredJSON(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch (error) { /* Saving is a convenience, never a reason to stop the game. */ }
    }
    const storedSettingsValue = readStoredJSON(CONFIG.storage.settingsKey, {});
    const storedSettings = storedSettingsValue && typeof storedSettingsValue === 'object' ? storedSettingsValue : {};
    function safeSettingNumber(value, fallback, minimum, maximum) { const number = Number(value); return Number.isFinite(number) ? THREE.MathUtils.clamp(number, minimum, maximum) : fallback; }
    const settings = {
      sound: typeof storedSettings.sound === 'boolean' ? storedSettings.sound : CONFIG.settingsDefaults.sound,
      musicVolume: safeSettingNumber(storedSettings.musicVolume, CONFIG.settingsDefaults.musicVolume, 0, 1),
      cameraSensitivity: safeSettingNumber(storedSettings.cameraSensitivity, CONFIG.settingsDefaults.cameraSensitivity, .5, 2),
      trajectoryPreview: typeof storedSettings.trajectoryPreview === 'boolean' ? storedSettings.trajectoryPreview : CONFIG.settingsDefaults.trajectoryPreview,
      mouseAim: typeof storedSettings.mouseAim === 'boolean' ? storedSettings.mouseAim : CONFIG.settingsDefaults.mouseAim,
      mouseSensitivity: safeSettingNumber(storedSettings.mouseSensitivity, CONFIG.settingsDefaults.mouseSensitivity, .2, 2),
      autoClub: typeof storedSettings.autoClub === 'boolean' ? storedSettings.autoClub : CONFIG.settingsDefaults.autoClub,
      music: typeof storedSettings.music === 'boolean' ? storedSettings.music : CONFIG.settingsDefaults.music,
      character: storedSettings.character === 'girl' ? 'girl' : 'boy',
      playerName: typeof storedSettings.playerName === 'string' ? storedSettings.playerName.slice(0, 14) : ''
    };
    const storedTips = readStoredJSON(CONFIG.storage.tipsKey, []);
    const onboarding = { seen: new Set(Array.isArray(storedTips) ? storedTips : []), queue: [], active: null, timer: 0 };
    const gameFlow = { mode: 'menu', settingsReturn: 'menu', flyoverTime: 0, introTime: 0, flyoverCurve: null, flyoverLookCurve: null };

    const scene = new THREE.Scene();
    scene.background = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d'); const grad = g.createLinearGradient(0, 0, 0, 256); grad.addColorStop(0, '#' + CONFIG.scene.skyTopColor.toString(16).padStart(6, '0')); grad.addColorStop(.62, '#' + CONFIG.scene.skyColor.toString(16).padStart(6, '0')); grad.addColorStop(1, '#' + CONFIG.scene.skyColor.toString(16).padStart(6, '0')); g.fillStyle = grad; g.fillRect(0, 0, 4, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    scene.fog = new THREE.Fog(CONFIG.scene.skyColor, CONFIG.camera.fogNear, CONFIG.camera.fogFar);
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .3, CONFIG.camera.farClip); // near .3 (was .1): 3x finer depth, no shimmer between the grass layers far away
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    $('game').appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdff2ff, 0x365c3b, 2.2));
    const sun = new THREE.DirectionalLight(0xfff4d5, 3.1);
    sun.position.set(-80, 100, 70);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -280;
    sun.shadow.camera.right = 280;
    sun.shadow.camera.top = 280;
    sun.shadow.camera.bottom = -280;
    sun.shadow.camera.far = 650;
    scene.add(sun);

    let currentHoleIndex = 0;
    let currentHole = null;
    let courseGroup = new THREE.Group();
    scene.add(courseGroup);
    const courseRuntime = { waterMaterials: [], treeColliders: [], bounds: null, flagMesh: null, flagBasePositions: null, flagRoot: null };
    const effects = { particles: [], rings: [], trailPositions: [], trailAccumulator: 0, particlePoints: null, particlePositionArray: null, particleColorArray: null, trailPoints: null, trailPositionArray: null };
    const scorecard = COURSE_DATA.holes.map(raw => ({ par: raw.par, score: null }));
    let holeState = { strokes: 0, penalties: 0, completed: false };
    let gameComplete = false;

    const ballRadius = CONFIG.world.ballDiameterMeters * .5;
    // Smooth, glossy ball with a subtle dimple pattern
    const dimpleTexture = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 256);
      for (let row = 0; row < 18; row += 1) { const y = (row + .5) * 256 / 18; const count = Math.max(6, Math.round(36 * Math.sin(Math.PI * (row + .5) / 18))); for (let i = 0; i < count; i += 1) { const x = (i + (row % 2) * .5) * 512 / count; const grad = g.createRadialGradient(x, y, 0, x, y, 6); grad.addColorStop(0, '#5a5a5a'); grad.addColorStop(1, '#808080'); g.fillStyle = grad; g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill(); } }
      const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t; })();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 48, 32), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .38, clearcoat: .9, clearcoatRoughness: .18, bumpMap: dimpleTexture, bumpScale: .6 }));
    ball.castShadow = true;
    scene.add(ball);
    const softShadowTexture = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64); grad.addColorStop(0, 'rgba(20,45,25,.55)'); grad.addColorStop(.45, 'rgba(20,45,25,.35)'); grad.addColorStop(1, 'rgba(20,45,25,0)'); g.fillStyle = grad; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
    const ballShadow = new THREE.Mesh(new THREE.CircleGeometry(ballRadius * 1.9, 48), new THREE.MeshBasicMaterial({ map: softShadowTexture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -12, polygonOffsetUnits: -24 }));
    ballShadow.rotation.x = -Math.PI / 2;
    scene.add(ballShadow);

    // Smooth, flowing guide lines (no more square dots): a ground ribbon for aiming and a tube for the predicted path
    const guideTexture = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 32; const g = c.getContext('2d'); g.clearRect(0, 0, 128, 32);
      const grad = g.createLinearGradient(0, 0, 0, 32); grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(.3, 'rgba(255,255,255,1)'); grad.addColorStop(.7, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad; g.beginPath(); g.roundRect ? g.roundRect(8, 4, 76, 24, 12) : g.rect(8, 4, 76, 24); g.fill();
      const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();
    const aimTexture = guideTexture.clone(); aimTexture.needsUpdate = true;
    const guideMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: guideTexture, side: THREE.DoubleSide, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -14, polygonOffsetUnits: -28 });
    const aimMaterial = new THREE.MeshBasicMaterial({ color: 0xffd449, map: aimTexture, side: THREE.DoubleSide, transparent: true, opacity: .9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -14, polygonOffsetUnits: -28 });
    const aimLine = new THREE.Mesh(new THREE.BufferGeometry(), aimMaterial);
    const aimArrow = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 32), new THREE.MeshStandardMaterial({ color: 0xffd449, roughness: .4 }));
    const aimTarget = new THREE.Mesh(new THREE.RingGeometry(CONFIG.aim.landingCircleRadius * .78, CONFIG.aim.landingCircleRadius, 96), new THREE.MeshBasicMaterial({ color: 0xffd449, side: THREE.DoubleSide, transparent: true, opacity: .9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -14, polygonOffsetUnits: -28 }));
    aimTarget.rotation.x = -Math.PI / 2;
    scene.add(aimLine, aimArrow, aimTarget);
    const previewPoints = new THREE.Mesh(new THREE.BufferGeometry(), guideMaterial); previewPoints.renderOrder = 2;
    // Landing marker: where the ball will first come down (bright target + light beam + distance label)
    const landingMarker = new THREE.Group(); landingMarker.visible = false; scene.add(landingMarker);
    const landingDisc = new THREE.Mesh(new THREE.CircleGeometry(1.35, 64), new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: .22, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -15, polygonOffsetUnits: -30 })); landingDisc.rotation.x = -Math.PI / 2; landingMarker.add(landingDisc);
    const landingRingOuter = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.4, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -16, polygonOffsetUnits: -32 })); landingRingOuter.rotation.x = -Math.PI / 2; landingMarker.add(landingRingOuter);
    const landingRingInner = new THREE.Mesh(new THREE.RingGeometry(.28, .42, 48), new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -16, polygonOffsetUnits: -32 })); landingRingInner.rotation.x = -Math.PI / 2; landingMarker.add(landingRingInner);
    const beamTexture = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 128; const g = c.getContext('2d'); const grad = g.createLinearGradient(0, 128, 0, 0); grad.addColorStop(0, 'rgba(255,230,102,.9)'); grad.addColorStop(1, 'rgba(255,230,102,0)'); g.fillStyle = grad; g.fillRect(0, 0, 4, 128); return new THREE.CanvasTexture(c); })();
    const landingBeam = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, 6, 16, 1, true), new THREE.MeshBasicMaterial({ map: beamTexture, transparent: true, depthWrite: false, side: THREE.DoubleSide })); landingBeam.position.y = 3; landingMarker.add(landingBeam);
    // Shot tracer: a smooth glowing ribbon that follows the ball through the air
    const tracerTexture = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 32; const g = c.getContext('2d'); const along = g.createLinearGradient(0, 0, 256, 0); along.addColorStop(0, 'rgba(255,255,255,0)'); along.addColorStop(.35, 'rgba(255,255,255,.55)'); along.addColorStop(1, 'rgba(255,255,255,1)'); g.fillStyle = along; g.fillRect(0, 0, 256, 32); g.globalCompositeOperation = 'destination-in'; const across = g.createLinearGradient(0, 0, 0, 32); across.addColorStop(0, 'rgba(0,0,0,0)'); across.addColorStop(.22, 'rgba(0,0,0,.45)'); across.addColorStop(.4, 'rgba(0,0,0,1)'); across.addColorStop(.6, 'rgba(0,0,0,1)'); across.addColorStop(.78, 'rgba(0,0,0,.45)'); across.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = across; g.fillRect(0, 0, 256, 32); return new THREE.CanvasTexture(c); })();
    const tracer = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: CONFIG.tracer.color, map: tracerTexture, transparent: true, depthWrite: false, side: THREE.DoubleSide })); tracer.frustumCulled = false; tracer.renderOrder = 4; tracer.visible = false;
    const tracerState = { points: [], accumulator: 0, linger: 0 };
    // the tracer is two ribbons: a wide soft halo in the shot's colour and a thin bright core, both tapering to a fine tail, plus a glow on the ball
    const tracerGlow = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: CONFIG.tracer.color, map: tracerTexture, transparent: true, opacity: .4, depthWrite: false, side: THREE.DoubleSide })); tracerGlow.frustumCulled = false; tracerGlow.renderOrder = 3; tracerGlow.visible = false;
    const tracerHead = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })(), color: CONFIG.tracer.color, transparent: true, depthWrite: false })); tracerHead.renderOrder = 5; tracerHead.visible = false;
    const tracerGround = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x173d24, map: tracerTexture, transparent: true, opacity: .26, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -12 })); tracerGround.frustumCulled = false; tracerGround.renderOrder = 2; tracerGround.visible = false;
    const tracerGroundPts = [];
    scene.add(previewPoints, tracer, tracerGlow, tracerHead, tracerGround);
    // flat ribbon that follows a list of points just above the grass
    const _ribbonT = new THREE.Vector3(), _ribbonS = new THREE.Vector3();
    // Flat ribbon along a list of points. Buffers are reused frame to frame (no new arrays while the ball flies),
    // each point remembers whether it's in the air, and "taper" makes the tail thinner than the head.
    function ribbonGeometry(points, width, geometry, taper = 0) {
      const n = points.length; let buf = geometry.userData.rib;
      if (!buf || buf.cap < n) {
        const cap = Math.max(64, Math.ceil(n * 1.5)); buf = { cap, pos: new Float32Array(cap * 6), uv: new Float32Array(cap * 4) };
        const idx = new Uint32Array((cap - 1) * 6); for (let i = 0; i < cap - 1; i += 1) { const k = i * 6, v = i * 2; idx[k] = v; idx[k + 1] = v + 1; idx[k + 2] = v + 2; idx[k + 3] = v + 1; idx[k + 4] = v + 3; idx[k + 5] = v + 2; }
        const pa = new THREE.BufferAttribute(buf.pos, 3), ua = new THREE.BufferAttribute(buf.uv, 2); pa.setUsage(THREE.DynamicDrawUsage); ua.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute('position', pa); geometry.setAttribute('uv', ua); geometry.setIndex(new THREE.BufferAttribute(idx, 1)); geometry.userData.rib = buf;
      }
      const pos = buf.pos, uv = buf.uv; let along = 0;
      for (let i = 0; i < n; i += 1) {
        const a = points[Math.max(0, i - 1)], b = points[Math.min(n - 1, i + 1)]; const p = points[i];
        const tangent = _ribbonT.set(b.x - a.x, b.y - a.y, b.z - a.z).normalize();
        if (p._air === undefined) p._air = p.y - surfaceInfoAt(p.x, p.z).height > .25;
        const side = p._air ? _ribbonS.subVectors(camera.position, p).cross(tangent).normalize() : _ribbonS.set(-tangent.z, 0, tangent.x).normalize();
        const w = width * (taper ? 1 - taper + taper * (n > 1 ? i / (n - 1) : 1) : 1) / 2;
        const sx = side.x * w, sy = side.y * w, sz = side.z * w;
        if (i > 0) along += p.distanceTo(points[i - 1]);
        const k = i * 6; pos[k] = p.x + sx; pos[k + 1] = p.y + sy; pos[k + 2] = p.z + sz; pos[k + 3] = p.x - sx; pos[k + 4] = p.y - sy; pos[k + 5] = p.z - sz;
        const u = i * 4; uv[u] = along; uv[u + 1] = 0; uv[u + 2] = along; uv[u + 3] = 1;
      }
      geometry.attributes.position.needsUpdate = true; geometry.attributes.uv.needsUpdate = true; geometry.setDrawRange(0, Math.max(0, (n - 1) * 6));
      if (!geometry.boundingSphere) geometry.boundingSphere = new THREE.Sphere(); if (n) { const mid = points[n >> 1]; geometry.boundingSphere.center.copy(mid); geometry.boundingSphere.radius = along + width + 2; }
      return along;
    }

    // Reusable VFX pools avoid creating Three.js materials during play.
    function initializeEffectPools() {
      const particleGeometry = new THREE.BufferGeometry();
      effects.particlePositionArray = new Float32Array(CONFIG.effects.maxParticles * 3);
      effects.particleColorArray = new Float32Array(CONFIG.effects.maxParticles * 3);
      const particlePosition = new THREE.BufferAttribute(effects.particlePositionArray, 3); particlePosition.setUsage(THREE.DynamicDrawUsage);
      const particleColor = new THREE.BufferAttribute(effects.particleColorArray, 3); particleColor.setUsage(THREE.DynamicDrawUsage);
      particleGeometry.setAttribute('position', particlePosition); particleGeometry.setAttribute('color', particleColor); particleGeometry.setDrawRange(0, 0);
      effects.particlePoints = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: .13, vertexColors: true, transparent: true, opacity: .92, depthWrite: false }));
      effects.particlePoints.frustumCulled = false; scene.add(effects.particlePoints);

      const trailGeometry = new THREE.BufferGeometry();
      effects.trailPositionArray = new Float32Array(CONFIG.effects.maxTrailPoints * 3);
      const trailPosition = new THREE.BufferAttribute(effects.trailPositionArray, 3); trailPosition.setUsage(THREE.DynamicDrawUsage);
      trailGeometry.setAttribute('position', trailPosition); trailGeometry.setDrawRange(0, 0);
      effects.trailPoints = new THREE.Points(trailGeometry, new THREE.PointsMaterial({ color: 0xfff2b0, size: .14, sizeAttenuation: true, transparent: true, opacity: .68, depthWrite: false }));
      effects.trailPoints.frustumCulled = false; effects.trailPoints.visible = false; scene.add(effects.trailPoints);

      const ringGeometry = new THREE.RingGeometry(.13, .21, 28);
      for (let i = 0; i < CONFIG.effects.splashRingCount; i += 1) {
        const material = new THREE.MeshBasicMaterial({ color: 0xd9ffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(ringGeometry, material); mesh.rotation.x = -Math.PI / 2; mesh.visible = false; scene.add(mesh);
        effects.rings.push({ mesh, life: 0, active: false });
      }
    }
    initializeEffectPools();

    const ballState = { position: new THREE.Vector3(), velocity: new THREE.Vector3(), origin: new THREE.Vector3(), inFlight: false, onGround: false, isPutting: false, holed: false, surface: 'tee', bounces: 0, carryDistance: 0, firstLandingRecorded: false, shotMessage: '—', cupCooldown: 0, treeHit: false };
    const spin = { backspinRpm: 0, sidespinRpm: 0 };
    const wind = { mph: 0, angle: 0, vector: new THREE.Vector3() };
    const movement = { keys: Object.create(null), velocity: new THREE.Vector3(), walkPhase: 0, moving: false, blockedMessageTime: 0, aimHudTimer: 0 };
    const mp = { active: false, replay: null, code: null, token: null, myId: null, state: null, es: null, remotes: new Map(), shotPending: false, path: [], pathClock: 0, lastHole: -1, started: false, pendingCard: false, lastTurn: null, viewingCard: false };
    const cameraState = { ballHold: 0, flightDirection: new THREE.Vector3(0, 0, -1), yaw: 0 };
    const swing = { phase: 'ready', value: 0, direction: 1, power: 0, accuracy: 0, holdActive: false };
    let currentClubName = 'Driver';
    let aimAngleRadians = 0;
    let previewEnabled = settings.trajectoryPreview;
    let previewClock = 1;
    let addressing = false;
    let requestedSideSpin = 0;
    let lastRenderedShotMessage = null;
    let swingAnimation = { active: false, time: 0, power: 0, sidespinRpm: 0, contactTriggered: false, shotQuality: null, direction: new THREE.Vector3(0, 0, -1) };

    // Small procedural sound engine. All audio is synthesized; there are no media files.
    const audioEngine = {
      context: null,
      master: null,
      sfx: null,
      ambience: null,
      windSource: null,
      noiseBuffer: null,
      nextBird: 5,
      ensure() {
        if (!settings.sound) return null;
        try {
          if (!this.context) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            this.context = new AudioContextClass();
            this.master = this.context.createGain(); this.sfx = this.context.createGain(); this.ambience = this.context.createGain();
            this.sfx.connect(this.master); this.ambience.connect(this.master);
            // a gentle limiter on the way out: cheers + music + a hit at once never jump out louder than the rest
            const limiter = this.context.createDynamicsCompressor(); limiter.threshold.value = -16; limiter.knee.value = 12; limiter.ratio.value = 5; limiter.attack.value = .003; limiter.release.value = .2; this.master.connect(limiter).connect(this.context.destination);
            const sampleRate = this.context.sampleRate; this.noiseBuffer = this.context.createBuffer(1, sampleRate, sampleRate);
            const channel = this.noiseBuffer.getChannelData(0); for (let i = 0; i < channel.length; i += 1) channel[i] = Math.random() * 2 - 1;
            const source = this.context.createBufferSource(); const filter = this.context.createBiquadFilter();
            source.buffer = this.noiseBuffer; source.loop = true; filter.type = 'lowpass'; filter.frequency.value = 650;
            source.connect(filter).connect(this.ambience); source.start(); this.windSource = source;
          }
          if (this.context.state === 'suspended') this.context.resume();
          this.applySettings(); return this.context;
        } catch (error) { return null; }
      },
      applySettings() {
        if (!this.context || !this.master) return;
        const now = this.context.currentTime;
        this.master.gain.setTargetAtTime(settings.sound ? CONFIG.audio.masterVolume : 0, now, .03);
        this.sfx.gain.setTargetAtTime(CONFIG.audio.effectsVolume, now, .03);
        this.ambience.gain.setTargetAtTime(CONFIG.audio.ambienceVolume * settings.musicVolume, now, .08);
        if (this.musicBus) this.musicBus.gain.setTargetAtTime(settings.music ? CONFIG.audio.musicVolume * settings.musicVolume : 0, now, .4);
      },
      tone(frequency, duration, volume = .16, type = 'sine', delay = 0, endFrequency = null) {
        const context = this.ensure(); if (!context || !settings.sound) return;
        const start = context.currentTime + delay; const oscillator = context.createOscillator(); const gain = context.createGain();
        oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
        gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + Math.min(.025, duration * .2)); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        oscillator.connect(gain).connect(this.sfx); oscillator.start(start); oscillator.stop(start + duration + .02);
      },
      noise(duration, volume = .12, frequency = 1600, delay = 0) {
        const context = this.ensure(); if (!context || !settings.sound || !this.noiseBuffer) return;
        const start = context.currentTime + delay; const source = context.createBufferSource(); const filter = context.createBiquadFilter(); const gain = context.createGain();
        source.buffer = this.noiseBuffer; filter.type = 'bandpass'; filter.frequency.value = frequency; filter.Q.value = .75;
        gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + .012); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        source.connect(filter).connect(gain).connect(this.sfx); source.start(start, Math.random() * .65, duration + .03); source.stop(start + duration + .04);
      },
      // the strike sounds different for every kind of contact: crisp for pure, dull thud for a fat or topped shot, a soft tock for putts
      clubHit(kind) {
        if (kind === true) kind = 'pure'; else if (kind === false || !kind) kind = 'great';
        if (kind === 'putt') { this.tone(1250, .05, .13, 'triangle', 0, 1100); this.noise(.03, .07, 3200); return; }
        if (kind === 'pure') { this.noise(.07, .2, 2700); this.tone(1180, .09, .15, 'triangle', 0, 1550); return; }
        if (kind === 'great') { this.noise(.07, .2, 1900); this.tone(760, .09, .15, 'triangle', 0, 640); return; }
        if (kind === 'miss') { this.noise(.08, .19, 1300); this.tone(520, .1, .13, 'triangle', 0, 400); return; }
        this.noise(.11, .15, 620); this.tone(170, .14, .13, 'sine', 0, 110); // bad: fat or topped
      },
      landing(surface) {
        if (surface === 'sand') { this.noise(.2, .18, 520); this.tone(105, .16, .1, 'sine', 0, 70); }
        else { this.noise(.1, surface === 'green' ? .17 : .2, surface === 'green' ? 900 : 1250); } // levels matched by measurement: every effect lands within a few dB
      },
      splash() { this.noise(.34, .21, 1050); this.tone(190, .24, .08, 'sine', 0, 95); },
      cup() { this.tone(940, .12, .14, 'sine'); this.tone(610, .18, .12, 'sine', .1, 420); },
      cheer() { [523.25, 659.25, 783.99].forEach((frequency, index) => this.tone(frequency, .26, .105, 'sine', .12 + index * .09)); this.noise(.45, .035, 2300, .12); },
      bird() { this.tone(1760, .09, .025, 'sine', 0, 2350); this.tone(2050, .1, .022, 'sine', .11, 2650); },
      // ---------- "Fairway Stroll": an original looping tune, synthesized live (no audio files, no licensing) ----------
      // 84 BPM in F major. Chords: Fmaj7 | Dm7 | Bbmaj7 | C7. 16-bar form: 8 bars with the melody, 8 bars of soft arpeggios.
      song: {
        chords: [[53, 57, 60, 64], [50, 53, 57, 60], [58, 62, 65, 69], [55, 58, 60, 64]],
        bass: [41, 38, 34, 36],
        melody: [
          [72, -1, 69, -1, 67, 69, -1, -1], [65, -1, -1, 67, 69, -1, 72, -1], [74, -1, 72, -1, 69, -1, 67, -1], [67, -1, -1, -1, -1, -1, -1, -1],
          [69, 72, -1, 74, -1, 72, -1, 69], [67, -1, 65, -1, -1, -1, 62, -1], [65, -1, 69, -1, 72, -1, 77, -1], [74, -1, 72, -1, -1, -1, -1, -1]
        ]
      },
      musicState: { step: 0, nextTime: 0, running: false },
      midiToHz(m) { return 440 * Math.pow(2, (m - 69) / 12); },
      setupMusic() {
        const c = this.context; if (this.musicBus || !c) return;
        this.musicBus = c.createGain(); this.musicBus.gain.value = 0; this.musicTone = c.createBiquadFilter(); this.musicTone.type = 'lowpass'; this.musicTone.frequency.value = 4200;
        this.musicBus.connect(this.musicTone).connect(this.master);
        // a soft echo for the melody so it sounds spacious
        this.echo = c.createDelay(1); this.echo.delayTime.value = 60 / CONFIG.audio.musicBpm * .75; this.echoFeedback = c.createGain(); this.echoFeedback.gain.value = .28; this.echoTone = c.createBiquadFilter(); this.echoTone.type = 'lowpass'; this.echoTone.frequency.value = 2200;
        this.echo.connect(this.echoTone).connect(this.echoFeedback).connect(this.echo); this.echoTone.connect(this.musicBus);
        this.musicState.nextTime = c.currentTime + .15; this.musicState.running = true; this.applySettings();
      },
      voice(freq, start, length, volume, type = 'sine', attack = .01, release = .4, toEcho = false, detune = 0) {
        const c = this.context; const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = freq; o.detune.value = detune;
        g.gain.setValueAtTime(.0001, start); g.gain.exponentialRampToValueAtTime(volume, start + attack); g.gain.setTargetAtTime(.0001, start + length, release / 4);
        o.connect(g); g.connect(this.musicBus); if (toEcho) g.connect(this.echo); o.start(start); o.stop(start + length + release * 1.5);
      },
      padChord(notes, start, length) {
        const c = this.context; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; f.connect(this.musicBus);
        notes.forEach(m => [-7, 7].forEach(detune => { const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = this.midiToHz(m); o.detune.value = detune;
          g.gain.setValueAtTime(.0001, start); g.gain.exponentialRampToValueAtTime(.018, start + .6); g.gain.setTargetAtTime(.0001, start + length - .2, .35); o.connect(g).connect(f); o.start(start); o.stop(start + length + 1.4); }));
      },
      pluck(m, start, volume) { const hz = this.midiToHz(m); this.voice(hz, start, .05, volume, 'sine', .006, 1.1, true); this.voice(hz * 2, start, .03, volume * .22, 'triangle', .004, .45, true); this.voice(hz * 4, start, .01, volume * .06, 'sine', .003, .2); },
      shaker(start, volume) { const c = this.context; const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); src.buffer = this.noiseBuffer; f.type = 'highpass'; f.frequency.value = 6500; g.gain.setValueAtTime(.0001, start); g.gain.exponentialRampToValueAtTime(volume, start + .008); g.gain.exponentialRampToValueAtTime(.0001, start + .07); src.connect(f).connect(g).connect(this.musicBus); src.start(start, Math.random() * .5, .09); },
      scheduleStep(step, t) {
        const eighth = 60 / CONFIG.audio.musicBpm / 2; const bar = Math.floor(step / 8) % 16; const inBar = step % 8; const chord = bar % 4; const S = this.song;
        if (inBar === 0) { this.padChord(S.chords[chord], t, eighth * 8); this.voice(this.midiToHz(S.bass[chord]), t, eighth * 3, .09, 'sine', .02, .6); }
        if (inBar === 4) this.voice(this.midiToHz(S.bass[chord] + 7), t, eighth * 2.5, .06, 'sine', .02, .5);
        if (bar < 8) { const note = S.melody[bar][inBar]; if (note > 0) this.pluck(note, t, .07); }
        else if (inBar % 2 === 0) { const tones = S.chords[chord]; this.pluck(tones[(inBar / 2 + bar) % tones.length] + 12, t, .032); }
        if (inBar % 2 === 1) this.shaker(t, bar < 8 ? .012 : .009);
      },
      updateMusic() {
        if (!this.context || !settings.sound) return; if (!this.musicBus) this.setupMusic();
        const eighth = 60 / CONFIG.audio.musicBpm / 2; const ms = this.musicState;
        if (ms.nextTime < this.context.currentTime - .5) ms.nextTime = this.context.currentTime + .05; // after a pause or a hidden tab
        while (ms.nextTime < this.context.currentTime + .3) { if (settings.music) this.scheduleStep(ms.step, ms.nextTime); ms.nextTime += eighth; ms.step = (ms.step + 1) % 128; }
      },
      update(dt) {
        this.updateMusic();
        if (!settings.sound || !this.context || gameFlow.mode === 'paused') return;
        this.nextBird -= dt;
        if (this.nextBird <= 0) { this.bird(); this.nextBird = THREE.MathUtils.randFloat(CONFIG.audio.birdMinDelay, CONFIG.audio.birdMaxDelay); }
      }
    };

    function yardsToMeters(value) { return value * COURSE_DATA.yardToMeter; }
    function metersToYards(value) { return value / COURSE_DATA.yardToMeter; }
    function clamp01(value) { return THREE.MathUtils.clamp(value, 0, 1); }
    function random01(seed) { const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return value - Math.floor(value); }
    function worldPointFromYards(hole, xYards, distanceYards) { return { x: yardsToMeters(xYards), z: CONFIG.world.teeZ - yardsToMeters(distanceYards) }; }

    function normalizeHole(raw) {
      const path = raw.fairwayPath.map(point => ({ d: yardsToMeters(point.distanceYards), x: yardsToMeters(point.xYards), z: CONFIG.world.teeZ - yardsToMeters(point.distanceYards) }));
      const straightYards = raw.greenDistanceYards || raw.lengthYards; // card yardage is measured along the route; this is the straight tee-to-green distance
      const greenPoint = worldPointFromYards(raw, raw.green.xYards, straightYards);
      const hole = {
        raw,
        number: raw.number,
        name: raw.name,
        par: raw.par,
        lengthYards: raw.lengthYards,
        greenDistanceYards: straightYards,
        lengthMeters: yardsToMeters(straightYards),
        fairwayWidthMeters: yardsToMeters(raw.fairwayWidthYards),
        roughWidthMeters: yardsToMeters(raw.roughWidthYards),
        terrain: raw.terrain,
        path,
        green: { center: new THREE.Vector3(greenPoint.x, 0, greenPoint.z), radiusMeters: yardsToMeters(raw.green.radiusYards), fringeMeters: yardsToMeters(raw.green.fringeYards), raisedMeters: raw.green.raisedMeters || 0, slope: raw.green.slope || { x: 0, z: 0 }, design: normalizeGreenDesign(raw.green.design) },
        bunkers: raw.bunkers.map(bunker => ({ x: yardsToMeters(bunker.xYards), z: CONFIG.world.teeZ - yardsToMeters(bunker.distanceYards), radiusX: yardsToMeters(bunker.radiusXYards), radiusZ: yardsToMeters(bunker.radiusZYards) })),
        water: raw.water.map(water => ({ x: yardsToMeters(water.xYards), z: CONFIG.world.teeZ - yardsToMeters(water.distanceYards), radiusX: yardsToMeters(water.radiusXYards), radiusZ: yardsToMeters(water.radiusZYards) })),
        trees: [],
        tee: new THREE.Vector3(0, 0, CONFIG.world.teeZ)
      };
      raw.treeClusters.forEach((cluster, clusterIndex) => {
        const look = CONFIG.courseVisuals.cartoon; const count = Math.max(1, Math.round(cluster.count * look.treeDensity)); const outward = Math.sign(cluster.xYards) || 1;
        for (let i = 0; i < count; i += 1) {
          const along = count === 1 ? .5 : i / (count - 1);
          const dYards = THREE.MathUtils.clamp(cluster.distanceYards + (along - .5) * cluster.spreadYards, 4, straightYards + 25);
          const xJitter = (random01(clusterIndex * 100 + i + raw.number) - .5) * Math.min(8, cluster.spreadYards * .08) + (i % 2) * outward * 5;
          const x = yardsToMeters(cluster.xYards + xJitter);
          const z = CONFIG.world.teeZ - yardsToMeters(dYards);
          const height = THREE.MathUtils.lerp(cluster.heightMin || 6, cluster.heightMax || 10, random01(clusterIndex * 17 + i * 3 + raw.number)) * look.treeScale;
          const pine = random01(clusterIndex * 31 + i * 7 + raw.number * 3) < look.pineShare;
          hole.trees.push({ x, z, height, radius: height * (pine ? .24 : .3) * .85, baseY: 0, pine, seed: clusterIndex * 131 + i * 17 + raw.number });
        }
      });
      const maxSide = Math.max(hole.fairwayWidthMeters / 2 + hole.roughWidthMeters + 20, 65); const side = hole.fairwayWidthMeters / 2 + hole.roughWidthMeters + 20;
      const pathXs = path.map(p => p.x).concat([greenPoint.x]); // bends and S-curves widen the ground so the whole route sits on the course
      hole.bounds = { minX: Math.min(-maxSide, Math.min(...pathXs) - side), maxX: Math.max(maxSide, Math.max(...pathXs) + side), minZ: CONFIG.world.teeZ - hole.lengthMeters - CONFIG.world.groundMarginMeters, maxZ: CONFIG.world.teeZ + 28 };
      hole.pins = findPinPositions(hole); hole.pinIndex = pinOfTheDay(hole); hole.pin = hole.pins[hole.pinIndex].position.clone(); hole.pinLabel = hole.pins[hole.pinIndex].label;
      return hole;
    }

    function fairwayCenterAtDistance(distanceMeters, hole = currentHole) {
      const path = hole.path;
      const d = THREE.MathUtils.clamp(distanceMeters, 0, hole.lengthMeters);
      for (let i = 0; i < path.length - 1; i += 1) {
        if (d <= path[i + 1].d) {
          const t = (d - path[i].d) / Math.max(.001, path[i + 1].d - path[i].d);
          return new THREE.Vector3(THREE.MathUtils.lerp(path[i].x, path[i + 1].x, t), 0, THREE.MathUtils.lerp(path[i].z, path[i + 1].z, t));
        }
      }
      const end = path[path.length - 1];
      return new THREE.Vector3(end.x, 0, end.z);
    }

    function smooth01(t) { t = THREE.MathUtils.clamp(t, 0, 1); return t * t * (3 - 2 * t); }
    // Straight-line slope from tee to green (the hole's uphill/downhill feel)
    function baseTerrainHeightAt(x, z, hole = currentHole) {
      if (!hole) return 0;
      const distance = THREE.MathUtils.clamp((CONFIG.world.teeZ - z), 0, hole.lengthMeters);
      const t = hole.lengthMeters <= 0 ? 0 : distance / hole.lengthMeters;
      return THREE.MathUtils.lerp(hole.terrain.startElevationMeters || 0, hole.terrain.endElevationMeters || 0, t);
    }
    // Soft cartoon mounds in the rough (never on the fairway, tee or green)
    function roughMoundsAt(x, z, hole) {
      const look = CONFIG.courseVisuals.cartoon; const d = CONFIG.world.teeZ - z; const c = fairwayCenterAtDistance(d, hole); const side = Math.abs(x - c.x);
      const w = smooth01((side - (hole.fairwayWidthMeters / 2 + 4)) / 10); if (w <= 0) return 0;
      const g = greenEdgeDistance(x, z, hole); const gw = smooth01((g - (hole.green.fringeMeters + 10)) / 12);
      const tw = smooth01((d - 14) / 16);
      const n = Math.sin(x * .13 + z * .041) * Math.sin(z * .083 - x * .052) + .5 * Math.sin(x * .29 - z * .17);
      return n * look.moundHeight * w * gw * tw;
    }
    // Ground height: slope + mounds, rising smoothly into the green, dipping into bunkers and ponds
    function terrainHeightAt(x, z, hole = currentHole, skipHazards = false) {
      if (!hole) return 0;
      const look = CONFIG.courseVisuals.cartoon;
      let h = baseTerrainHeightAt(x, z, hole) + roughMoundsAt(x, z, hole);
      const g = hole.green; const ramp = look.greenRampMeters + g.raisedMeters * 3; const rough = Math.hypot(x - g.center.x, z - g.center.z);
      if (rough < g.radiusMeters * 1.6 + g.fringeMeters + ramp) { const ge = greenEdgeDistance(x, z, hole) - g.fringeMeters; if (ge < ramp) { const t = ge <= 0 ? 1 : smooth01(1 - ge / ramp); h = THREE.MathUtils.lerp(h, greenHeightAt(x, z, hole), t); } }
      if (skipHazards === true) return h;
      if (skipHazards === 'coarse') { for (const w of hole.water) { const e = ((x - w.x) / (w.radiusX * 1.08 + 1.5)) ** 2 + ((z - w.z) / (w.radiusZ * 1.08 + 1.5)) ** 2; if (e < 1) h -= look.pondDepth * smooth01((1 - e) * 1.4); } return h; }
      // bunker dip stays inside the sand, so the grass around it stays level
      for (const b of hole.bunkers) {
        const e = Math.hypot((x - b.x) / b.radiusX, (z - b.z) / b.radiusZ);
        if (e < 1) h -= look.bunkerDepth * smooth01((1 - e) / look.bunkerWall);                       // steep sand face, flat floor
        else if (e < 1 + look.bunkerLipWidth) h += look.bunkerBerm * Math.sin(Math.PI * (e - 1) / look.bunkerLipWidth); // grassy lip
      }
      for (const w of hole.water) { const e = ((x - w.x) / (w.radiusX * 1.08 + 1.5)) ** 2 + ((z - w.z) / (w.radiusZ * 1.08 + 1.5)) ** 2; if (e < 1) h -= look.pondDepth * smooth01((1 - e) * 1.4); }
      return h;
    }
    function waterLevelAt(water, hole = currentHole) { return baseTerrainHeightAt(water.x, water.z, hole) - .12; }
    function ellipseContains(x, z, shape) {
      return ((x - shape.x) / shape.radiusX) ** 2 + ((z - shape.z) / shape.radiusZ) ** 2 <= 1;
    }

    // ---------- green design: irregular outline, authored contours, pin positions ----------
    function normalizeGreenDesign(d = {}) {
      const shape = Object.assign({ stretchX: 1, stretchZ: 1, turn: 0, lobes: [] }, d.shape || {});
      const contours = (d.contours || []).map(c => {
        if (c.type === 'falseFront') return { type: 'tier', front: true, dx: 0, dz: 1, at: c.at ?? .55, width: (c.width ?? .14) * .6, height: -(c.drop ?? .3) * 1.2 }; // a short, steep face (~20%): weak shots can't stay on it
        if (c.type === 'tier') { const L = Math.hypot(c.dir[0], c.dir[1]) || 1; return { type: 'tier', dx: c.dir[0] / L, dz: c.dir[1] / L, at: c.at ?? 0, width: c.width ?? .14, height: c.height ?? .4 }; }
        if (c.type === 'ridge') return { type: 'ridge', ax: c.from[0], az: c.from[1], bx: c.to[0], bz: c.to[1], width: c.width ?? .2, height: c.height ?? .15 };
        return { type: 'mound', x: c.x ?? 0, z: c.z ?? 0, size: c.size ?? .4, height: c.type === 'bowl' ? -(c.depth ?? .25) : (c.height ?? .25) };
      });
      return { shape, contours };
    }
    // distance from the green's centre to its edge in the direction of (x, z)
    function greenEdgeRadius(x, z, hole = currentHole) {
      const g = hole.green; const sh = g.design.shape; const dx = x - g.center.x, dz = z - g.center.z;
      const c = Math.cos(-sh.turn), sn = Math.sin(-sh.turn); const qx = dx * c - dz * sn, qz = dx * sn + dz * c; const a = Math.atan2(qz, qx);
      let r = 1 / Math.sqrt((Math.cos(a) / sh.stretchX) ** 2 + (Math.sin(a) / sh.stretchZ) ** 2);
      let wobble = 1; for (const [k, amp, ph] of sh.lobes) wobble += amp * Math.sin(k * a + ph);
      return g.radiusMeters * r * wobble;
    }
    // how far outside the putting surface a point is (negative = on the green)
    function greenEdgeDistance(x, z, hole = currentHole) { const g = hole.green; return Math.hypot(x - g.center.x, z - g.center.z) - greenEdgeRadius(x, z, hole); }
    function greenContourHeight(x, z, hole) {
      const g = hole.green; const R = g.radiusMeters; const px = (x - g.center.x) / R, pz = (z - g.center.z) / R; let h = 0;
      for (const c of g.design.contours) {
        if (c.type === 'mound') { const d2 = ((px - c.x) ** 2 + (pz - c.z) ** 2) / (c.size * c.size); if (d2 < 9) h += c.height * Math.exp(-d2); }
        else if (c.type === 'tier') { const t = (px * c.dx + pz * c.dz - c.at) / c.width; h += c.height * (t <= -1 ? 0 : t >= 1 ? 1 : (() => { const u = (t + 1) / 2; return u * u * (3 - 2 * u); })()); }
        else if (c.type === 'ridge') { const vx = c.bx - c.ax, vz = c.bz - c.az; const L2 = vx * vx + vz * vz || 1; const t = THREE.MathUtils.clamp(((px - c.ax) * vx + (pz - c.az) * vz) / L2, 0, 1); const ex = px - (c.ax + vx * t), ez = pz - (c.az + vz * t); h += c.height * Math.exp(-(ex * ex + ez * ez) / (c.width * c.width)); }
      }
      return h;
    }
    function greenHeightAt(x, z, hole = currentHole) {
      const green = hole.green;
      const base = baseTerrainHeightAt(green.center.x, green.center.z, hole) + green.raisedMeters;
      return base + green.slope.x * (x - green.center.x) + green.slope.z * (z - green.center.z) + greenContourHeight(x, z, hole);
    }
    // downhill gradient of the putting surface (rise per metre in x and z)
    function greenGradientAt(x, z, hole = currentHole) { const e = .12; return { x: (greenHeightAt(x + e, z, hole) - greenHeightAt(x - e, z, hole)) / (2 * e), z: (greenHeightAt(x, z + e, hole) - greenHeightAt(x, z - e, hole)) / (2 * e) }; }
    function describeGreenSpot(hole, x, z) {
      const g = hole.green; const px = (x - g.center.x) / g.radiusMeters, pz = (z - g.center.z) / g.radiusMeters;
      const fb = pz > .22 ? 'front' : pz < -.22 ? 'back' : ''; const lr = px > .22 ? 'right' : px < -.22 ? 'left' : '';
      let spot = fb && lr ? `${fb}-${lr}` : fb || lr || 'middle';
      const tiers = g.design.contours.filter(c => c.type === 'tier' && !c.front);
      if (tiers.length) { let up = 0, all = 0; tiers.forEach(c => { const t = THREE.MathUtils.clamp(((px * c.dx + pz * c.dz - c.at) / c.width + 1) / 2, 0, 1); up += Math.abs(c.height) * (c.height > 0 ? t : 1 - t); all += Math.abs(c.height); }); const level = up / all; if (level > .62) spot += ', top tier'; else if (level < .38) spot += ', bottom tier'; }
      return spot;
    }
    // pins go on the flatter parts of the green, spread apart: one near the middle, the rest far from each other
    function findPinPositions(hole) {
      const g = hole.green; const R = g.radiusMeters; let cands = [];
      for (let limit of [.022, .03, .045, 1]) {
        cands = [];
        for (let i = -12; i <= 12; i += 1) for (let j = -12; j <= 12; j += 1) {
          const x = g.center.x + i / 12 * R * 1.3, z = g.center.z + j / 12 * R * 1.3; const dist = Math.hypot(x - g.center.x, z - g.center.z);
          if (dist > greenEdgeRadius(x, z, hole) * .68) continue; if (hole.bunkers.some(b => ellipseContains(x, z, b)) || hole.water.some(w => ellipseContains(x, z, w))) continue;
          const gr = greenGradientAt(x, z, hole); const slope = Math.hypot(gr.x, gr.z);
          // flat all around the cup, not just at its centre
          let worst = slope; for (let k = 0; k < 6; k += 1) { const a = k / 6 * Math.PI * 2; const gg = greenGradientAt(x + Math.cos(a) * 1.2, z + Math.sin(a) * 1.2, hole); worst = Math.max(worst, Math.hypot(gg.x, gg.z)); }
          if (worst <= limit) cands.push({ x, z, dist, slope: worst, h: greenContourHeight(x, z, hole) });
        }
        if (cands.length >= 6) break;
      }
      const chosen = []; cands.sort((a, b) => a.dist - b.dist); if (cands.length) chosen.push(cands[0]);
      while (chosen.length < 4 && chosen.length < cands.length) { let best = null, bestD = -1; for (const c of cands) { const d = Math.min(...chosen.map(o => Math.hypot(o.x - c.x, o.z - c.z) + Math.abs(o.h - c.h) * R * .6)); /* spread out, and on different levels */ if (d > bestD) { bestD = d; best = c; } } if (bestD < R * .3) break; chosen.push(best); }
      if (!chosen.length) chosen.push({ x: g.center.x, z: g.center.z });
      return chosen.map(c => ({ position: new THREE.Vector3(c.x, 0, c.z), label: describeGreenSpot(hole, c.x, c.z) }));
    }
    // today's pin: the same for everyone in a room, and it moves every day
    function pinOfTheDay(hole) {
      const text = (typeof mp !== 'undefined' && mp.active && mp.code) ? `${mp.code}-${(mp.state && mp.state.round) || 0}` /* fresh pins every rematch */ : `day${Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000)}`;
      let seed = 7; for (const ch of text) seed = (seed * 31 + ch.charCodeAt(0)) % 100003;
      return Math.floor(random01(seed * .137 + hole.number * 9.73) * hole.pins.length) % hole.pins.length;
    }
    function outOfBoundsAt(x, z, hole = currentHole) {
      const distance = CONFIG.world.teeZ - z;
      const center = fairwayCenterAtDistance(distance, hole);
      const fairwayEdge = hole.fairwayWidthMeters / 2 + hole.roughWidthMeters;
      const inCorridor = distance >= -10 && distance <= hole.lengthMeters + 18 && Math.hypot(x - center.x, z - center.z) <= fairwayEdge;
      if (inCorridor) return false;
      // water hazards (and the banks around them) are in play, so shortcuts across a lake or creek are real options, never out of bounds
      const bank = CONFIG.world.hazardBankMeters; if (hole.water.some(w => ((x - w.x) / (w.radiusX + bank)) ** 2 + ((z - w.z) / (w.radiusZ + bank)) ** 2 <= 1)) return false;
      // there is playable rough all around the green, so a ball hit long can be played back from where it lies
      const g = hole.green; return Math.hypot(x - g.center.x, z - g.center.z) > greenSafeRadius(hole);
    }
    function greenSafeRadius(hole = currentHole) { return hole.green.radiusMeters * 1.3 + hole.green.fringeMeters + CONFIG.world.backRoughMeters; }

    // The painted grass layers sit a few cm above the ground mesh; the ball rests on top of them
    function surfaceLiftAt(surface, x, z, hole) {
      const lift = CONFIG.courseVisuals.cartoon.surfaceLift;
      if (lift[surface] !== undefined) return lift[surface];
      if (surface === 'rough') { const d = CONFIG.world.teeZ - z; if (d > 19 && d < fairwayEndMeters(hole) + 3) { const c = fairwayCenterAtDistance(d, hole); if (Math.hypot(x - c.x, z - c.z) <= hole.fairwayWidthMeters / 2 + 3) return lift.firstCut; } }
      return 0;
    }
    function surfaceInfoAt(x, z, hole = currentHole) { const info = rawSurfaceInfoAt(x, z, hole); if (info.surface !== 'water' && info.surface !== 'sand' && info.surface !== 'outOfBounds') info.height += surfaceLiftAt(info.surface, x, z, hole); return info; }
    function rawSurfaceInfoAt(x, z, hole = currentHole) {
      const terrain = terrainHeightAt(x, z, hole);
      const water = hole.water.find(item => ellipseContains(x, z, item));
      if (water) return { surface: 'water', height: Math.min(terrain, waterLevelAt(water, hole)) };
      const bunker = hole.bunkers.find(item => ellipseContains(x, z, item));
      if (bunker) return { surface: 'sand', height: terrain + CONFIG.courseVisuals.cartoon.sandLift - .04 };
      if (Math.hypot(x - hole.green.center.x, z - hole.green.center.z) < hole.green.radiusMeters * 1.6 + hole.green.fringeMeters) {
        const edge = greenEdgeDistance(x, z, hole);
        if (edge <= 0) return { surface: 'green', height: greenHeightAt(x, z, hole) };
        if (edge <= hole.green.fringeMeters) return { surface: 'fringe', height: greenHeightAt(x, z, hole) };
      }
      const distance = CONFIG.world.teeZ - z;
      const center = fairwayCenterAtDistance(distance, hole);
      if (Math.abs(x) <= CONFIG.world.teeWidthMeters / 2 && Math.abs(z - CONFIG.world.teeZ) <= CONFIG.world.teeDepthMeters / 2) return { surface: 'tee', height: terrain };
      if (distance >= 0 && distance <= hole.lengthMeters && Math.hypot(x - center.x, z - center.z) <= hole.fairwayWidthMeters / 2) return { surface: 'fairway', height: terrain };
      if (outOfBoundsAt(x, z, hole)) return { surface: 'outOfBounds', height: terrain };
      return { surface: 'rough', height: terrain };
    }

    // ---------- cartoon course building ----------
    const lookTextures = {};
    function hexCss(hex) { return '#' + hex.toString(16).padStart(6, '0'); }
    function lookTexture(key, width, height, draw, repeat = false) {
      if (lookTextures[key]) return lookTextures[key];
      const c = document.createElement('canvas'); c.width = width; c.height = height; draw(c.getContext('2d'), width, height);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      if (repeat) { t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.RepeatWrapping; }
      t.userData.shared = true; lookTextures[key] = t; return t;
    }
    // Painted grass layers are cut away inside bunkers and ponds (no more fairway stripes poking through),
    // with a gentle darker ring around each hazard edge
    const MAX_HAZARDS = 12;
    function hazardData(hole) {
      const v = [], types = []; [...hole.bunkers.map(b => [b, 0]), ...hole.water.map(w => [w, 1])].slice(0, MAX_HAZARDS).forEach(([h, t]) => { v.push(new THREE.Vector4(h.x, h.z, h.radiusX, h.radiusZ)); types.push(t); });
      const count = v.length; while (v.length < MAX_HAZARDS) { v.push(new THREE.Vector4(0, 0, 1, 1)); types.push(0); } return { v, types, count };
    }
    // cut: 'overlay' (painted grass: hidden under bunkers, their lips and ponds), 'ground' (hidden inside bunker bowls), 'none'
    function withHazards(material, hole, cut) {
      const H = hazardData(hole); const cutSand = cut === 'overlay' ? 1.14 : cut === 'ground' ? .99 : 0; const cutWater = cut === 'overlay' ? 1.1 : 0;
      material.onBeforeCompile = shader => {
        shader.uniforms.uHaz = { value: H.v }; shader.uniforms.uHazType = { value: H.types }; shader.uniforms.uHazCount = { value: H.count };
        shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vHazWorld;').replace('#include <project_vertex>', '#include <project_vertex>\nvHazWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vHazWorld; uniform vec4 uHaz[${MAX_HAZARDS}]; uniform float uHazType[${MAX_HAZARDS}]; uniform int uHazCount;`)
          .replace('#include <map_fragment>', `#include <map_fragment>
for (int i = 0; i < ${MAX_HAZARDS}; i++) { if (i >= uHazCount) break; float e = length((vHazWorld.xz - uHaz[i].xy) / uHaz[i].zw); if (e < (uHazType[i] > .5 ? ${cutWater.toFixed(3)} : ${cutSand.toFixed(3)})) discard; }`);
      };
      material.customProgramCacheKey = () => 'hazards2-' + cut;
      return material;
    }
    function overlayMaterial(map, order) { return new THREE.MeshLambertMaterial({ map, color: CONFIG.courseVisuals.cartoon.groundTint, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -order, polygonOffsetUnits: -order * 2 }); }
    // Builds a grid that hugs the ground. pointAt(i, j) returns { x, z, u, v }
    function groundGrid(rows, cols, pointAt, lift, material, level = false) {
      const positions = [], uvs = [], indices = [];
      for (let i = 0; i <= rows; i += 1) for (let j = 0; j <= cols; j += 1) { const p = pointAt(i, j); positions.push(p.x, terrainHeightAt(p.x, p.z, currentHole, level) + lift, p.z); uvs.push(p.u, p.v); }
      for (let i = 0; i < rows; i += 1) for (let j = 0; j < cols; j += 1) { const a = i * (cols + 1) + j, b = a + 1, c = a + cols + 1, d = c + 1; indices.push(a, c, b, b, c, d); }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material); mesh.receiveShadow = true; courseGroup.add(mesh); return mesh;
    }
    function ringGrid(cx, cz, rx, rz, inner, outer, lift, material, rows = 10, segments = 128) {
      return groundGrid(rows, segments, (i, j) => { const r = inner + (outer - inner) * (i / rows), a = (j / segments) * Math.PI * 2; return { x: cx + Math.cos(a) * rx * r, z: cz + Math.sin(a) * rz * r, u: i / rows, v: j / segments }; }, lift, material);
    }
    function ellipseGrid(cx, cz, rx, rz, lift, material, rings = 12, segments = 72, level = false) {
      return groundGrid(rings, segments, (i, j) => { const r = i / rings, a = (j / segments) * Math.PI * 2; return { x: cx + Math.cos(a) * rx * r, z: cz + Math.sin(a) * rz * r, u: .5 + Math.cos(a) * r * .5, v: .5 + Math.sin(a) * r * .5 }; }, lift, material, level);
    }
    function makeTerrain(hole) {
      const look = CONFIG.courseVisuals.cartoon; const m = look.terrainMargin;
      const minX = hole.bounds.minX - m, maxX = hole.bounds.maxX + m, minZ = hole.bounds.minZ - m, maxZ = hole.bounds.maxZ + m;
      const cols = Math.ceil((maxX - minX) / look.terrainCellMeters), rows = Math.ceil((maxZ - minZ) / look.terrainCellMeters);
      const positions = [], colors = [], indices = []; const a = new THREE.Color(look.roughA), b = new THREE.Color(look.roughB), deep = new THREE.Color(look.deepRough), tmp = new THREE.Color();
      for (let i = 0; i <= rows; i += 1) {
        const z = maxZ - (i / rows) * (maxZ - minZ);
        for (let j = 0; j <= cols; j += 1) {
          const x = minX + (j / cols) * (maxX - minX); let y = terrainHeightAt(x, z, hole, 'coarse'); if (Math.hypot(x - hole.green.center.x, z - hole.green.center.z) < hole.green.radiusMeters * 1.6 + hole.green.fringeMeters) y -= .35 * smooth01((hole.green.fringeMeters - 1 - greenEdgeDistance(x, z, hole)) / 2); positions.push(x, y, z);
          const patch = .5 + .5 * Math.sin(x * .061 + Math.sin(z * .037) * 2.1) * Math.cos(z * .049 - x * .018);
          tmp.copy(a).lerp(b, patch); if (outOfBoundsAt(x, z, hole)) tmp.lerp(deep, .75); colors.push(tmp.r, tmp.g, tmp.b);
        }
      }
      for (let i = 0; i < rows; i += 1) for (let j = 0; j < cols; j += 1) { const p = i * (cols + 1) + j, q = p + 1, r = p + cols + 1, t = r + 1; indices.push(p, q, r, q, t, r); }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, withHazards(new THREE.MeshLambertMaterial({ vertexColors: true, color: CONFIG.courseVisuals.cartoon.groundTint, side: THREE.DoubleSide }), hole, 'ground')); mesh.receiveShadow = true; courseGroup.add(mesh);
    }
    function fairwayEndMeters(hole) { return hole.lengthMeters - hole.green.radiusMeters - hole.green.fringeMeters + 2.5; }
    function makeFairway(hole) {
      const look = CONFIG.courseVisuals.cartoon;
      // mowing stripes across the fairway, with a darker collar along each edge
      const stripes = lookTexture('fairway', 64, 256, (g, w, h) => {
        g.fillStyle = hexCss(look.fairwayA); g.fillRect(0, 0, w, h / 2); g.fillStyle = hexCss(look.fairwayB); g.fillRect(0, h / 2, w, h / 2);
        g.fillStyle = hexCss(look.fairwayEdge); g.fillRect(0, 0, 3, h); g.fillRect(w - 3, 0, 3, h);
      }, true);
      const cut = lookTexture('firstcut', 8, 8, (g, w, h) => { g.fillStyle = hexCss(look.firstCut); g.fillRect(0, 0, w, h); });
      const start = 22, end = fairwayEndMeters(hole), step = 2;
      const ribbon = (width, lift, material, extra) => {
        const s0 = start - extra, s1 = end + extra; const rows = Math.ceil((s1 - s0) / step), cols = 12, half = width / 2;
        groundGrid(rows, cols, (i, j) => {
          const d = s0 + (i / rows) * (s1 - s0); const c = fairwayCenterAtDistance(d, hole);
          const normal = new THREE.Vector3(1, 0, 0); // rows run straight across the hole, so the strip can never fold over itself on a sharp bend (that folding flickered)
          let wFactor = 1; const fromStart = d - s0, toEnd = s1 - d; if (fromStart < half) wFactor = Math.sqrt(Math.max(0, 1 - ((half - fromStart) / half) ** 2)); if (toEnd < half) wFactor = Math.sqrt(Math.max(0, 1 - ((half - toEnd) / half) ** 2));
          const off = (j / cols - .5) * width * wFactor;
          return { x: c.x + normal.x * off, z: c.z + normal.z * off, u: j / cols, v: d / (look.stripeMeters * 2) };
        }, lift, material, true);
      };
      ribbon(hole.fairwayWidthMeters + 6, .03, withHazards(overlayMaterial(cut, 1), hole, 'overlay'), 3);
      ribbon(hole.fairwayWidthMeters, .07, withHazards(overlayMaterial(stripes, 2), hole, 'overlay'), 0);
    }
    function makeGreen(hole) {
      const look = CONFIG.courseVisuals.cartoon; const g = hole.green; const cx = g.center.x, cz = g.center.z;
      const SEG = 180; const edge = []; let maxR = 0;
      for (let j = 0; j <= SEG; j += 1) { const a = j / SEG * Math.PI * 2; const r = greenEdgeRadius(cx + Math.cos(a), cz + Math.sin(a), hole); edge.push(r); maxR = Math.max(maxR, r); }
      const S = maxR + g.fringeMeters + 1.2; const W = 1024;
      const toPx = (x, z) => [(.5 + (x - cx) / (2 * S)) * W, (.5 - (z - cz) / (2 * S)) * W];
      const outline = (ctx, extra) => { ctx.beginPath(); for (let j = 0; j < SEG; j += 1) { const a = j / SEG * Math.PI * 2; const [px, py] = toPx(cx + Math.cos(a) * (edge[j] + extra), cz + Math.sin(a) * (edge[j] + extra)); j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); };
      const map = lookTexture(`green-v3-${hole.number}`, W, W, ctx => {
        ctx.fillStyle = hexCss(look.fringe); outline(ctx, g.fringeMeters + .9); ctx.fill();
        // putting surface with diagonal mowing stripes
        ctx.save(); outline(ctx, 0); ctx.clip(); ctx.fillStyle = hexCss(look.greenA); ctx.fillRect(0, 0, W, W);
        const band = look.greenStripeMeters / (2 * S) * W; ctx.translate(W / 2, W / 2); ctx.rotate(Math.PI / 4); ctx.fillStyle = hexCss(look.greenB);
        for (let x = -W; x < W; x += band * 2) ctx.fillRect(x, -W, band, W * 2);
        ctx.restore();
        // collar line where the green meets the fringe
        ctx.strokeStyle = hexCss(look.greenEdge); ctx.lineWidth = W * .004; outline(ctx, 0); ctx.stroke();
        // baked low side-light so every crown, bowl and tier reads at a glance
        if (!CONFIG.greens.bakedShade) return; // greens are one even colour now; the slope shows in the flowing dots while putting
        const N = 256, shade = document.createElement('canvas'); shade.width = shade.height = N; const sc = shade.getContext('2d'); const img = sc.createImageData(N, N); const d = img.data;
        const L = new THREE.Vector3(-.66, .45, .6).normalize(); const E = CONFIG.greens.shadeExaggeration; const n = new THREE.Vector3();
        for (let y = 0; y < N; y += 1) for (let x = 0; x < N; x += 1) {
          const wx = cx + ((x + .5) / N - .5) * 2 * S, wz = cz - ((y + .5) / N - .5) * 2 * S; const gr = greenGradientAt(wx, wz, hole);
          n.set(-gr.x * E, 1, -gr.z * E).normalize(); const lit = n.dot(L) / L.y - 1; const v = THREE.MathUtils.clamp(128 + Math.sign(lit) * Math.pow(Math.abs(lit), .55) * 95, 40, 215); /* gentle slopes show, steep faces don't blow out */ const i = (y * N + x) * 4; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
        }
        sc.putImageData(img, 0, 0);
        if (CONFIG.greens.bakedShade) { ctx.save(); outline(ctx, .15); ctx.clip(); ctx.globalCompositeOperation = 'soft-light'; ctx.imageSmoothingEnabled = true; ctx.drawImage(shade, 0, 0, W, W); ctx.globalAlpha = .6; ctx.drawImage(shade, 0, 0, W, W); ctx.restore(); }
      });
      const RINGS = 48;
      const greenMesh = groundGrid(RINGS, SEG, (i, j) => { const a = j / SEG * Math.PI * 2; const r = (i / RINGS) * (edge[j] + g.fringeMeters + .45); const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; return { x, z, u: .5 + (x - cx) / (2 * S), v: .5 + (z - cz) / (2 * S) }; }, .07, withHazards(overlayMaterial(map, 4), hole, 'overlay'), true);
      // light it as if flat, so slopes don't turn parts of the green lighter or darker
      const nrm = greenMesh.geometry.attributes.normal; for (let k = 0; k < nrm.count; k += 1) nrm.setXYZ(k, 0, nrm.getY(k) < 0 ? -1 : 1, 0); nrm.needsUpdate = true; // keep each normal's side (the mesh is built facing down and drawn two-sided), only straighten it
    }
    function makeTee(hole) {
      const teeY = terrainHeightAt(0, CONFIG.world.teeZ, hole);
      const tee = new THREE.Mesh(new THREE.BoxGeometry(CONFIG.world.teeWidthMeters, .08, CONFIG.world.teeDepthMeters), new THREE.MeshLambertMaterial({ color: new THREE.Color(CONFIG.courseVisuals.cartoon.teeColor).multiply(new THREE.Color(CONFIG.courseVisuals.cartoon.groundTint)) }));
      tee.position.set(0, teeY + .04, CONFIG.world.teeZ); tee.receiveShadow = true; courseGroup.add(tee);
      [-1.15, 1.15].forEach(x => {
        const marker = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .18, 12), new THREE.MeshStandardMaterial({ color: x < 0 ? 0x4d75ef : 0xff7168, roughness: .8 }));
        marker.position.set(x, teeY + .17, CONFIG.world.teeZ - .8); marker.castShadow = true; courseGroup.add(marker);
      });
    }

    function makeBunker(bunker) {
      const look = CONFIG.courseVisuals.cartoon;
      // high-resolution sand: fine grain, soft rake lines, shaded lip on the sun side, smooth anti-aliased edge
      const map = lookTexture('sand-hd', 1024, 1024, (g, w) => {
        const img = g.createImageData(w, w); const d = img.data; const light = new THREE.Color(look.sand), dark = new THREE.Color(look.sandDark);
        const L = [light.r * 255, light.g * 255, light.b * 255].map(v => Math.pow(v / 255, 1 / 2.2) * 255), D = [dark.r * 255, dark.g * 255, dark.b * 255].map(v => Math.pow(v / 255, 1 / 2.2) * 255);
        for (let y = 0; y < w; y += 1) for (let x = 0; x < w; x += 1) {
          const nx = (x + .5) / w * 2 - 1, ny = (y + .5) / w * 2 - 1; const r = Math.hypot(nx, ny); const i = (y * w + x) * 4;
          if (r > 1) { d[i + 3] = 0; continue; }
          let t = THREE.MathUtils.smoothstep(r, .72, 1) * .9;                         // darker toward the lip
          t += Math.max(0, (nx * -.6 + ny * -.8)) * THREE.MathUtils.smoothstep(r, .55, 1) * .5; // lip shadow on one side
          const rake = Math.sin((nx * .8 + ny * .6) * 90) * .5 + .5; t -= rake * .05 * (1 - r);
          const grain = (Math.random() - .5) * 14;
          for (let c = 0; c < 3; c += 1) d[i + c] = THREE.MathUtils.clamp(L[c] + (D[c] - L[c]) * THREE.MathUtils.clamp(t, 0, 1) + grain, 0, 255);
          d[i + 3] = 255 * (1 - THREE.MathUtils.smoothstep(r, .975, 1));
        }
        g.putImageData(img, 0, 0);
      });
      const material = overlayMaterial(map, 8); material.transparent = true; material.color.set(0xd2d2d2);
      const sand = ellipseGrid(bunker.x, bunker.z, bunker.radiusX, bunker.radiusZ, CONFIG.courseVisuals.cartoon.sandLift, material, 22, 128); sand.renderOrder = 3;
      // grassy lip: darker where it turns down into the sand, fading softly into the fairway or rough
      const lipTex = lookTexture('bunker-lip', 256, 4, (g, w, h) => { const grad = g.createLinearGradient(0, 0, w, 0); grad.addColorStop(0, 'rgba(58,112,50,1)'); grad.addColorStop(.12, 'rgba(70,128,58,1)'); grad.addColorStop(.35, 'rgba(96,160,74,1)'); grad.addColorStop(.62, 'rgba(112,178,86,.85)'); grad.addColorStop(1, 'rgba(112,178,86,0)'); g.fillStyle = grad; g.fillRect(0, 0, w, h); });
      const lipMat = overlayMaterial(lipTex, 6); lipMat.transparent = true; lipMat.depthWrite = false;
      const lip = ringGrid(bunker.x, bunker.z, bunker.radiusX, bunker.radiusZ, .94, look.bunkerSurround, .05, lipMat, 12, 128); lip.renderOrder = 2;
    }
    function makeWater(water) {
      const look = CONFIG.courseVisuals.cartoon;
      const material = new THREE.ShaderMaterial({
        transparent: true, fog: true, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6,
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
          uTime: { value: 0 }, uCenter: { value: new THREE.Vector2(water.x, water.z) }, uRadius: { value: new THREE.Vector2(water.radiusX, water.radiusZ) },
          uDeep: { value: new THREE.Color(look.waterDeep) }, uShallow: { value: new THREE.Color(look.water) }, uFoam: { value: new THREE.Color(look.waterFoam) }, uSky: { value: new THREE.Color(CONFIG.scene.skyColor) },
          uSunDir: { value: sun.position.clone().normalize() }, uSeed: { value: water.x * .13 + water.z * .07 }
        }]),
        vertexShader: `varying vec3 vWorld;
          #include <fog_pars_vertex>
          void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
          }`,
        fragmentShader: `uniform float uTime; uniform vec2 uCenter; uniform vec2 uRadius; uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam; uniform vec3 uSky; uniform vec3 uSunDir; uniform float uSeed; varying vec3 vWorld;
          #include <fog_pars_fragment>
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
          float waves(vec2 p, float t) { return noise(p * .45 + vec2(t * .22, t * .15)) * .6 + noise(p * 1.1 - vec2(t * .31, -t * .19)) * .3 + noise(p * 2.7 + vec2(-t * .4, t * .33)) * .1; }
          void main() {
            vec2 d = (vWorld.xz - uCenter) / uRadius; float e = length(d); float a = atan(d.y, d.x);
            float edge = 1.0 + .045 * sin(a * 3.0 + uSeed) + .028 * sin(a * 7.0 + uSeed * 2.3) + .015 * sin(a * 13.0 + 1.7);
            if (e > edge) discard;
            float k = e / edge; float t = uTime;
            vec3 col = mix(uDeep, uShallow, smoothstep(.1, .95, k));
            float h = waves(vWorld.xz, t); float hx = waves(vWorld.xz + vec2(.08, 0.0), t) - h; float hz = waves(vWorld.xz + vec2(0.0, .08), t) - h;
            vec3 n = normalize(vec3(-hx * 5.0, 1.0, -hz * 5.0)); vec3 V = normalize(cameraPosition - vWorld);
            float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0); col = mix(col, uSky, fres * .6);
            float spec = pow(max(dot(n, normalize(uSunDir + V)), 0.0), 90.0); col += vec3(1.0, .97, .9) * spec * .9;
            col *= .94 + h * .12;
            float shore = smoothstep(edge - .09, edge - .015, e); float foam = smoothstep(.45, .7, noise(vWorld.xz * 1.4 + vec2(t * .5, -t * .4)));
            col = mix(col, uFoam, shore * (.35 + .65 * foam) * .75);
            gl_FragColor = vec4(col, 1.0 - smoothstep(edge - .012, edge, e));
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
            #include <fog_fragment>
          }`
      });
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 160), material);
      mesh.rotation.x = -Math.PI / 2; mesh.position.set(water.x, waterLevelAt(water), water.z); mesh.scale.set(water.radiusX * 1.08, water.radiusZ * 1.08, 1); mesh.renderOrder = 2; courseGroup.add(mesh);
      courseRuntime.waterMaterials.push(material);
      const bankMat = new THREE.MeshLambertMaterial({ color: CONFIG.courseVisuals.cartoon.groundTint, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -12 });
      bankMat.onBeforeCompile = shader => {
        shader.uniforms.uCenter = { value: new THREE.Vector2(water.x, water.z) }; shader.uniforms.uRadius = { value: new THREE.Vector2(water.radiusX, water.radiusZ) }; shader.uniforms.uSeed = { value: water.x * .13 + water.z * .07 };
        shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vBankWorld;').replace('#include <project_vertex>', '#include <project_vertex>\nvBankWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vBankWorld; uniform vec2 uCenter; uniform vec2 uRadius; uniform float uSeed;')
          .replace('#include <map_fragment>', `#include <map_fragment>
vec2 bd = (vBankWorld.xz - uCenter) / uRadius; float be = length(bd); float ba = atan(bd.y, bd.x);
float bEdge = 1.0 + .045 * sin(ba * 3.0 + uSeed) + .028 * sin(ba * 7.0 + uSeed * 2.3) + .015 * sin(ba * 13.0 + 1.7);
float bd2 = be - bEdge; if (bd2 < -.05) discard;
vec3 mud = vec3(.16, .19, .09), damp = vec3(.12, .27, .09), grass = vec3(.15, .33, .10);
vec3 bc = mix(mud, damp, smoothstep(-.02, .05, bd2)); bc = mix(bc, grass, smoothstep(.06, .2, bd2));
diffuseColor.rgb = bc; diffuseColor.a *= 1.0 - smoothstep(.1, .24, bd2);`);
      };
      bankMat.customProgramCacheKey = () => 'pond-bank';
      const bank = ringGrid(water.x, water.z, water.radiusX, water.radiusZ, .9, 1.45, .05, bankMat, 14, 160); bank.renderOrder = 1;
    }
    // Chunky cartoon trees (round oaks and stacked pines) drawn with instancing, with dark outlines
    function makeForest(hole) {
      const look = CONFIG.courseVisuals.cartoon; const trees = [];
      hole.trees.forEach(tree => { tree.baseY = terrainHeightAt(tree.x, tree.z); trees.push(tree); courseRuntime.treeColliders.push(tree); });
      // decorative forest outside the white stakes (no collision needed: that's out of bounds)
      const edge = hole.fairwayWidthMeters / 2 + hole.roughWidthMeters;
      let seed = hole.number * 1000;
      const decor = (x, z) => { seed += 1; if (!outOfBoundsAt(x, z, hole)) return; const h = (8 + random01(seed * 1.3) * 7) * look.treeScale; trees.push({ x, z, baseY: terrainHeightAt(x, z), height: h, pine: random01(seed * 2.7) < look.pineShare + .08, seed, decor: true }); };
      for (let d = -18; d < hole.lengthMeters + 40; d += look.decorSpacing) {
        const c = fairwayCenterAtDistance(d, hole);
        [-1, 1].forEach(side => { for (let row = 0; row < look.decorRows; row += 1) { if (row >= 3 && random01(seed * 3.3 + row) < .35) continue; const off = edge + 5 + row * (row >= 3 ? 8.5 : 7) + random01(seed * 5.1 + row) * 3.5; const dz = (random01(seed * 9.3 + row) - .5) * 4; decor(c.x + side * off, c.z - dz); } });
      }
      const g = hole.green.center; for (let a = -2.1; a <= 2.1; a += .11) for (let row = 0; row < 3; row += 1) { const r = greenSafeRadius(hole) + 4 + row * 7; decor(g.x + Math.sin(a) * r, g.z - Math.cos(a) * r); }
      for (let x = -edge - 20; x <= edge + 20; x += 7) for (let row = 0; row < 2; row += 1) decor(x + random01(seed) * 3, CONFIG.world.teeZ + 20 + row * 7);

      const oak = [], pine = [];
      trees.forEach(t => (t.pine ? pine : oak).push(t));
      const trunkGeo = new THREE.CylinderGeometry(.55, .8, 1, 7); const blobGeo = new THREE.SphereGeometry(1, 12, 9); const coneGeo = new THREE.ConeGeometry(1, 1, 10);
      const toon = color => new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() });
      const white = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: toonGradient() });
      const outlineMat = new THREE.MeshBasicMaterial({ color: look.outline, side: THREE.BackSide });
      const parts = { trunk: [], blob: [], cone: [] }; let currentDecor = false;
      const add = (list, x, y, z, sx, sy, sz, color, ry = 0) => list.push({ x, y, z, sx, sy, sz, color, ry, decor: currentDecor });
      oak.forEach(t => {
        currentDecor = !!t.decor; const h = t.height, rc = h * .3, rnd = k => random01(t.seed * 13.7 + k); const fall = rnd(31) < look.autumnShare * (t.decor ? 1 : .6); const palette = fall ? [look.autumn[Math.floor(rnd(33) * look.autumn.length)]] : look.oakGreens; const shade = (c, k) => fall ? new THREE.Color(c).multiplyScalar(.9 + rnd(k + 40) * .2).getHex() : c; const base = shade(palette[Math.floor(rnd(1) * palette.length)], 1);
        add(parts.trunk, t.x, t.baseY + h * .22, t.z, h * .05, h * .46, h * .05, look.trunk);
        add(parts.blob, t.x, t.baseY + h * .6, t.z, rc, rc * .9, rc, base);
        for (let k = 0; k < 4; k += 1) { const a = k * Math.PI / 2 + rnd(k + 2) * 1.2; const r = rc * (.5 + rnd(k + 9) * .15); add(parts.blob, t.x + Math.cos(a) * rc * .62, t.baseY + h * (.52 + rnd(k + 5) * .12), t.z + Math.sin(a) * rc * .62, r, r * .9, r, shade(palette[Math.floor(rnd(k + 20) * palette.length)], k + 2)); }
        add(parts.blob, t.x - rc * .1, t.baseY + h * .82, t.z + rc * .05, rc * .62, rc * .56, rc * .62, fall ? shade(palette[0], 9) : look.oakGreens[3]);
      });
      pine.forEach(t => {
        currentDecor = !!t.decor; const h = t.height, rnd = k => random01(t.seed * 7.3 + k), color = look.pineGreens[Math.floor(rnd(1) * look.pineGreens.length)];
        add(parts.trunk, t.x, t.baseY + h * .14, t.z, h * .045, h * .3, h * .045, look.trunk);
        add(parts.cone, t.x, t.baseY + h * .42, t.z, h * .27, h * .42, h * .27, color, rnd(2) * 3);
        add(parts.cone, t.x, t.baseY + h * .63, t.z, h * .21, h * .36, h * .21, color, rnd(3) * 3);
        add(parts.cone, t.x, t.baseY + h * .83, t.z, h * .14, h * .34, h * .14, color, rnd(4) * 3);
      });
      const dummy = new THREE.Object3D(); const col = new THREE.Color();
      const instanced = (geometry, allParts, material, outlineScale) => [false, true].forEach(decorGroup => {
        const list = allParts.filter(p => p.decor === decorGroup); if (!list.length) return;
        // only trees near play cast shadows; the background forest skips the shadow pass
        const mesh = new THREE.InstancedMesh(geometry, material, list.length); mesh.castShadow = !decorGroup; mesh.receiveShadow = !decorGroup;
        const outline = outlineScale ? new THREE.InstancedMesh(geometry, outlineMat, list.length) : null;
        list.forEach((p, i) => {
          dummy.position.set(p.x, p.y, p.z); dummy.rotation.set(0, p.ry, 0); dummy.scale.set(p.sx, p.sy, p.sz); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, col.setHex(p.color));
          if (outline) { dummy.scale.set(p.sx * outlineScale, p.sy * outlineScale, p.sz * outlineScale); dummy.updateMatrix(); outline.setMatrixAt(i, dummy.matrix); }
        });
        courseGroup.add(mesh); if (outline) courseGroup.add(outline);
      });
      instanced(trunkGeo, parts.trunk, white, 1.18);
      instanced(blobGeo, parts.blob, white, 1.06);
      instanced(coneGeo, parts.cone, white, 1.08);
    }
    let sharedToonGradient = null;
    function toonGradient() {
      if (sharedToonGradient) return sharedToonGradient;
      const data = new Uint8Array([95, 95, 95, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
      sharedToonGradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat); sharedToonGradient.minFilter = sharedToonGradient.magFilter = THREE.NearestFilter; sharedToonGradient.needsUpdate = true; sharedToonGradient.userData.shared = true; return sharedToonGradient;
    }
    function makeFlagAndCup(hole) {
      const y = greenHeightAt(hole.pin.x, hole.pin.z, hole); const H = CONFIG.courseVisuals.flagHeightMeters;
      const pin = new THREE.Group(); pin.position.set(hole.pin.x, y, hole.pin.z);
      const poleGroup = new THREE.Group(); pin.add(poleGroup);
      // flagstick: glossy white fibreglass, two thin red rings up top, a brass ferrule at the base and a round white tip
      const white = new THREE.MeshStandardMaterial({ color: 0xfbfbf6, roughness: .22, metalness: .05 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(.021, .025, H, 24), white); pole.position.y = H / 2; pole.castShadow = true; poleGroup.add(pole);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xd7362b, roughness: .35 });
      [H - .86, H - .8].forEach(h => { const ring = new THREE.Mesh(new THREE.CylinderGeometry(.0225, .0225, .025, 24), ringMat); ring.position.y = h; poleGroup.add(ring); });
      const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(.027, .027, .07, 24), new THREE.MeshStandardMaterial({ color: 0xc9a14a, roughness: .3, metalness: .7 })); ferrule.position.y = .035; poleGroup.add(ferrule);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(.036, 24, 16), white); cap.position.y = H + .015; poleGroup.add(cap);
      // the flag: a red swallowtail with a cream stitched border, a cream sleeve round the pole and the hole number in the game's serif
      const FW = 1.08, FH = .7;
      const drawFlag = (g, w, h, mirrorText = false) => {
        g.clearRect(0, 0, w, h); const notch = w * .16; const shape = () => { g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w - notch, h / 2); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); };
        g.save(); shape(); g.clip();
        const cloth = g.createLinearGradient(0, 0, w, 0); cloth.addColorStop(0, '#e8483a'); cloth.addColorStop(1, '#c92f25'); g.fillStyle = cloth; g.fillRect(0, 0, w, h);
        const sheen = g.createLinearGradient(0, 0, 0, h); sheen.addColorStop(0, 'rgba(255,255,255,.12)'); sheen.addColorStop(.5, 'rgba(255,255,255,0)'); sheen.addColorStop(1, 'rgba(0,0,0,.12)'); g.fillStyle = sheen; g.fillRect(0, 0, w, h);
        g.fillStyle = '#f7efd9'; g.fillRect(0, 0, w * .075, h); // sleeve
        g.strokeStyle = 'rgba(247,239,217,.9)'; g.lineWidth = h * .018; g.setLineDash([h * .04, h * .03]); const m = h * .07; g.beginPath(); g.moveTo(w * .075 + m, m); g.lineTo(w - m * 1.2, m); g.lineTo(w - notch - m * .9, h / 2); g.lineTo(w - m * 1.2, h - m); g.lineTo(w * .075 + m, h - m); g.closePath(); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#f7efd9'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${Math.round(h * .56)}px "YB Serif", Georgia, serif`; g.shadowColor = 'rgba(80,10,5,.35)'; g.shadowOffsetY = h * .02; g.translate(w * .47, h * .54); if (mirrorText) g.scale(-1, 1); g.fillText(String(hole.number), 0, 0); // the back of the cloth gets its own, so the number never reads backwards
        g.restore();
      };
      const flagTex = lookTexture(`flag-v2-${hole.number}`, 512, 332, drawFlag), flagBackTex = lookTexture(`flag-v2b-${hole.number}`, 512, 332, (g, w, h) => drawFlag(g, w, h, true));
      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => { [[flagTex, false], [flagBackTex, true]].forEach(([t, m]) => { drawFlag(t.image.getContext('2d'), t.image.width, t.image.height, m); t.needsUpdate = true; }); });
      const flagGeometry = new THREE.PlaneGeometry(FW, FH, 30, 10);
      const flag = new THREE.Mesh(flagGeometry, new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.FrontSide, roughness: .75, alphaTest: .5 }));
      const flagBack = new THREE.Mesh(flagGeometry, new THREE.MeshStandardMaterial({ map: flagBackTex, side: THREE.BackSide, roughness: .75, alphaTest: .5 }));
      flag.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: flagTex, alphaTest: .5, side: THREE.DoubleSide }); // the shadow has the swallowtail too
      // the sleeve edge sits on the pole (the plane is turned 90°, so it hangs off along -z)
      flag.position.set(0, H - FH / 2 - .03, -FW / 2 - .018); flag.rotation.y = Math.PI / 2; flag.castShadow = true; flagBack.position.copy(flag.position); flagBack.rotation.copy(flag.rotation);
      poleGroup.add(flag, flagBack); courseRuntime.flagHalfW = FW / 2;
      // the cup: a dark hole with a white liner and a soft inner wall
      const cupR = CONFIG.scoring.cupRadiusMeters; const cupTop = CONFIG.courseVisuals.cartoon.surfaceLift.green + .004;
      const holeTex = lookTexture('cup-hd', 512, 512, (g, w) => { const r = w / 2; const grad = g.createRadialGradient(r, r * .78, r * .1, r, r, r); grad.addColorStop(0, '#020403'); grad.addColorStop(.62, '#08110a'); grad.addColorStop(.9, '#1c2b1e'); grad.addColorStop(1, '#2e4230'); g.fillStyle = grad; g.beginPath(); g.arc(r, r, r, 0, Math.PI * 2); g.fill(); const wall = g.createLinearGradient(0, 0, 0, w); wall.addColorStop(0, 'rgba(120,150,120,.25)'); wall.addColorStop(.35, 'rgba(0,0,0,0)'); g.fillStyle = wall; g.beginPath(); g.arc(r, r, r * .98, Math.PI, Math.PI * 2); g.fill(); });
      const cup = new THREE.Mesh(new THREE.CircleGeometry(cupR, 96), new THREE.MeshBasicMaterial({ map: holeTex, polygonOffset: true, polygonOffsetFactor: -10, polygonOffsetUnits: -20 }));
      cup.rotation.x = -Math.PI / 2; cup.position.y = cupTop; pin.add(cup);
      const liner = new THREE.Mesh(new THREE.RingGeometry(cupR * .86, cupR * 1.06, 96), new THREE.MeshStandardMaterial({ color: 0xf6f8f3, roughness: .35, polygonOffset: true, polygonOffsetFactor: -11, polygonOffsetUnits: -22 }));
      liner.rotation.x = -Math.PI / 2; liner.position.y = cupTop + .001; pin.add(liner);
      const pinSlope = greenGradientAt(hole.pin.x, hole.pin.z, hole); pin.rotation.set(Math.atan(pinSlope.z), 0, -Math.atan(pinSlope.x));
      courseGroup.add(pin); courseRuntime.flagMesh = flag; courseRuntime.flagBasePositions = Float32Array.from(flagGeometry.attributes.position.array); courseRuntime.flagRoot = poleGroup; courseRuntime.flagLift = 0;
    }

    function makeYardageMarkers(hole) {
      COURSE_DATA.yardageMarkers.forEach((yardage, index) => {
        if (yardage >= hole.greenDistanceYards) return;
        const distanceMeters = hole.lengthMeters - yardsToMeters(yardage);
        const center = fairwayCenterAtDistance(distanceMeters, hole);
        const next = fairwayCenterAtDistance(Math.min(hole.lengthMeters, distanceMeters + 1), hole);
        const direction = new THREE.Vector3(next.x - center.x, 0, next.z - center.z).normalize();
        const normal = new THREE.Vector3(-direction.z, 0, direction.x);
        const color = [CONFIG.courseVisuals.markerBlue, CONFIG.courseVisuals.markerWhite, CONFIG.courseVisuals.markerRed][index];
        [-1, 1].forEach(side => {
          const position = center.clone().addScaledVector(normal, side * hole.fairwayWidthMeters * .35);
          const marker = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .62, 10), new THREE.MeshStandardMaterial({ color, roughness: .7 }));
          marker.position.set(position.x, terrainHeightAt(position.x, position.z, hole) + .31, position.z); marker.castShadow = true; courseGroup.add(marker);
        });
      });
    }

    function makeOutOfBoundsStakes(hole) {
      const offset = hole.fairwayWidthMeters / 2 + hole.roughWidthMeters + 1.3;
      for (let d = 0; d < hole.lengthMeters; d += yardsToMeters(22)) {
        const center = fairwayCenterAtDistance(d, hole); const next = fairwayCenterAtDistance(Math.min(hole.lengthMeters, d + 1), hole); const direction = new THREE.Vector3(next.x - center.x, 0, next.z - center.z).normalize(); const normal = new THREE.Vector3(-direction.z, 0, direction.x);
        [-1, 1].forEach(side => {
          const p = center.clone().addScaledVector(normal, side * offset); const stake = new THREE.Mesh(new THREE.CylinderGeometry(.045, .055, 1.05, 8), new THREE.MeshStandardMaterial({ color: CONFIG.courseVisuals.outOfBoundsColor, roughness: .6 }));
          stake.position.set(p.x, terrainHeightAt(p.x, p.z, hole) + .525, p.z); stake.castShadow = true; courseGroup.add(stake);
        });
      }
    }

    function disposeGroupResources(group) {
      const geometries = new Set(); const materials = new Set();
      group.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (Array.isArray(object.material)) object.material.forEach(material => materials.add(material)); else if (object.material) materials.add(object.material); if (object.isInstancedMesh) object.dispose(); });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
    }
    function clearCourse() {
      scene.remove(courseGroup); disposeGroupResources(courseGroup);
      courseGroup = new THREE.Group(); scene.add(courseGroup);
      courseRuntime.treeColliders = []; courseRuntime.waterMaterials = []; courseRuntime.butterflies = []; courseRuntime.flagMesh = null; courseRuntime.flagBasePositions = null; courseRuntime.flagRoot = null;
      clearEffects();
    }


    // ---------- course details: cart path, tee area, grass tufts, wildflowers, bushes, rocks ----------
    function inAnyHazard(hole, x, z, pad = 1.25) {
      return hole.bunkers.some(b => Math.hypot((x - b.x) / b.radiusX, (z - b.z) / b.radiusZ) < pad) || hole.water.some(w => Math.hypot((x - w.x) / w.radiusX, (z - w.z) / w.radiusZ) < pad + .15);
    }
    function makeCartPath(hole) {
      const P = CONFIG.courseVisuals.cartoon.cartPath; const maxOff = hole.fairwayWidthMeters / 2 + hole.roughWidthMeters - 3; const step = 1.5;
      // starts just in front of the tee box, out to the side (it used to begin behind the tee, where the centre line has no direction, so it cut straight across the tee)
      const start = CONFIG.world.teeDepthMeters + 4, end = hole.lengthMeters - hole.green.radiusMeters - hole.green.fringeMeters - 4;
      const build = side => {
        const pts = []; let blocked = 0;
        for (let d = start; d <= end; d += step) {
          const c = fairwayCenterAtDistance(d, hole), n = fairwayCenterAtDistance(d + 1, hole), b = fairwayCenterAtDistance(Math.max(0, d - 1), hole);
          const dir = new THREE.Vector2(n.x - b.x, n.z - b.z); if (dir.lengthSq() < 1e-6) dir.set(0, -1); dir.normalize(); const nx = -dir.y, nz = dir.x;
          let off = hole.fairwayWidthMeters / 2 + P.offset + Math.sin(d * .035 + hole.number) * P.wiggle;
          while (off < maxOff && inAnyHazard(hole, c.x + nx * side * off, c.z + nz * side * off)) off += 1;   // curve around ponds and bunkers
          if (inAnyHazard(hole, c.x + nx * side * off, c.z + nz * side * off)) blocked += 1;
          pts.push({ d, c, nx, nz, off });
        }
        for (let pass = 0; pass < 4; pass += 1) for (let i = 1; i < pts.length - 1; i += 1) pts[i].off = (pts[i - 1].off + pts[i].off * 2 + pts[i + 1].off) / 4; // smooth the curves
        return { side, blocked, pts: pts.map(p => ({ x: p.c.x + p.nx * side * p.off, z: p.c.z + p.nz * side * p.off })) };
      };
      const left = build(-1), right = build(1); const path = (left.blocked < right.blocked || (left.blocked === right.blocked && hole.number % 2)) ? left : right;
      courseRuntime.cartPathSide = path.side; courseRuntime.cartPathPts = path.pts;
      // warm concrete: soft wear down the middle, fine grain, expansion joints, curbed edges that fade smoothly into the grass
      const tex = lookTexture('cartpath-hd', 256, 1024, (g, w, h) => {
        const img = g.createImageData(w, h); const d = img.data; const base = new THREE.Color(P.color), edgeC = new THREE.Color(P.edge);
        const B = [base.r, base.g, base.b].map(v => Math.pow(v, 1 / 2.2) * 255), E = [edgeC.r, edgeC.g, edgeC.b].map(v => Math.pow(v, 1 / 2.2) * 255);
        for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
          const u = (x + .5) / w, i = (y * w + x) * 4; const across = Math.abs(u - .5) * 2;
          let shade = 1 + (1 - across) * .04 - Math.pow(across, 6) * .08 + (Math.random() - .5) * .05; const joint = (y % (h / 4)) < 2 ? .86 : 1; const curb = across > .9 ? THREE.MathUtils.smoothstep(across, .9, .95) : 0;
          for (let k = 0; k < 3; k += 1) d[i + k] = THREE.MathUtils.clamp((B[k] + (E[k] - B[k]) * curb) * shade * joint, 0, 255);
          d[i + 3] = 255 * (1 - THREE.MathUtils.smoothstep(across, .96, 1));
        }
        g.putImageData(img, 0, 0);
      }, true);
      const shadowTex = lookTexture('cartpath-shadow', 128, 4, (g, w, h) => { const grad = g.createLinearGradient(0, 0, w, 0); grad.addColorStop(0, 'rgba(30,60,25,0)'); grad.addColorStop(.3, 'rgba(30,60,25,.35)'); grad.addColorStop(.7, 'rgba(30,60,25,.35)'); grad.addColorStop(1, 'rgba(30,60,25,0)'); g.fillStyle = grad; g.fillRect(0, 0, w, h); });
      const pts = path.pts; const cols = 6; const total = (pts.length - 1) * step;
      const strip = (width, lift, material, vScale) => groundGrid(pts.length - 1, cols, (i, j) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b.x - a.x, dz = b.z - a.z; const len = Math.hypot(dx, dz) || 1;
        const along = i * step; const cap = Math.min(1, along / 1.6, (total - along) / 1.6); const taper = Math.sqrt(Math.max(.02, 1 - (1 - cap) ** 2)); // rounded ends
        const off = (j / cols - .5) * width * taper; return { x: pts[i].x - dz / len * off, z: pts[i].z + dx / len * off, u: j / cols, v: along / vScale };
      }, lift, material);
      const shadowMat = withHazards(overlayMaterial(shadowTex, 3), hole, 'overlay'); shadowMat.transparent = true; shadowMat.depthWrite = false; strip(P.width + 1.1, .09, shadowMat, 1).renderOrder = 1;
      const pathMat = withHazards(overlayMaterial(tex, 4), hole, 'overlay'); pathMat.transparent = true; pathMat.color.set(0xd6d6d6); strip(P.width, .11, pathMat, P.jointMeters * 4).renderOrder = 2;
    }
    function makeTeeArea(hole) {
      const teeY = terrainHeightAt(0, CONFIG.world.teeZ, hole); const side = -(courseRuntime.cartPathSide || 1); const W = CONFIG.world.teeWidthMeters;
      const mat = color => new THREE.MeshStandardMaterial({ color, roughness: .8, flatShading: true });
      const put = (geo, m, x, y, z, ry = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; courseGroup.add(o); return o; };
      // hole sign
      const sx = side * (W / 2 + 2.2), sz = CONFIG.world.teeZ - 1.5, gy = terrainHeightAt(sx, sz, hole);
      put(new THREE.BoxGeometry(.12, 1.4, .12), mat(0x7a4f2c), sx - .55, gy + .7, sz); put(new THREE.BoxGeometry(.12, 1.4, .12), mat(0x7a4f2c), sx + .55, gy + .7, sz);
      const signTex = lookTexture(`sign-${hole.number}`, 512, 300, (g, w, h) => {
        g.fillStyle = '#1f4d2e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c14e'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20);
        g.fillStyle = '#f7f3e6'; g.textAlign = 'center'; g.font = '900 104px system-ui, sans-serif'; g.fillText(`HOLE ${hole.number}`, w / 2, 124);
        g.font = '800 54px system-ui, sans-serif'; g.fillText(`PAR ${hole.par} · ${hole.lengthYards} YDS`, w / 2, 200); g.font = '700 38px system-ui, sans-serif'; g.fillStyle = '#f2c14e'; g.fillText(hole.name.toUpperCase(), w / 2, 258);
      });
      const board = put(new THREE.BoxGeometry(1.6, .95, .08), [mat(0x5b3a20), mat(0x5b3a20), mat(0x5b3a20), mat(0x5b3a20), new THREE.MeshStandardMaterial({ map: signTex, roughness: .7 }), new THREE.MeshStandardMaterial({ map: signTex, roughness: .7 })], sx, gy + 1.25, sz, 0);
      board.rotation.y = side < 0 ? .5 : -.5;
      // bench
      const bx = -side * (W / 2 + 2.4), bz = CONFIG.world.teeZ + 1.5, by = terrainHeightAt(bx, bz, hole); const wood = mat(0xa8713f), iron = mat(0x2b2f36);
      [-.62, .62].forEach(o => put(new THREE.BoxGeometry(.08, .45, .45), iron, bx, by + .22, bz + o, 0));
      put(new THREE.BoxGeometry(.5, .07, 1.5), wood, bx, by + .47, bz); put(new THREE.BoxGeometry(.08, .45, 1.5), wood, bx + (side > 0 ? -.24 : .24), by + .75, bz);
      // ball washer
      const wx = -side * (W / 2 + 1.2), wz = CONFIG.world.teeZ - 2.6, wy = terrainHeightAt(wx, wz, hole);
      put(new THREE.CylinderGeometry(.05, .05, 1, 10), iron, wx, wy + .5, wz); put(new THREE.BoxGeometry(.28, .3, .22), mat(0x2e6b3f), wx, wy + 1.05, wz); put(new THREE.CylinderGeometry(.03, .03, .2, 8), mat(0xe8584c), wx, wy + 1.28, wz);
      // flower bed behind the tee
      const bedR = W / 2 + 3.6;
      const mulch = lookTexture('mulch', 256, 256, (g, w, h) => { g.fillStyle = '#5c3d26'; g.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i += 1) { g.fillStyle = ['#6f4a2d', '#4a3020', '#7a5536', '#3f2a1c'][i % 4]; g.save(); g.translate(random01(i * 1.3) * w, random01(i * 2.9) * h); g.rotate(random01(i * 4.1) * 3); g.fillRect(-3, -1, 6, 2); g.restore(); } });
      mulch.wrapS = mulch.wrapT = THREE.RepeatWrapping; mulch.repeat.set(3, 1);
      const soil = new THREE.Mesh(new THREE.RingGeometry(bedR - 1.1, bedR + 1.1, 64, 3, 0, Math.PI), new THREE.MeshLambertMaterial({ map: mulch, color: 0xc8c8c8, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 }));
      soil.rotation.x = -Math.PI / 2; soil.scale.set(1, .55, 1); soil.position.set(0, teeY + .05, CONFIG.world.teeZ + 3); soil.rotation.z = Math.PI; soil.receiveShadow = true; courseGroup.add(soil);
      const edgeStones = new THREE.Mesh(new THREE.TorusGeometry(bedR + 1.12, .07, 5, 64, Math.PI), mat(0xc9c2b2)); edgeStones.rotation.x = -Math.PI / 2; edgeStones.rotation.z = Math.PI; edgeStones.scale.set(1, .55, 1); edgeStones.position.set(0, teeY + .06, CONFIG.world.teeZ + 3); courseGroup.add(edgeStones);
      const flowers = []; const bandColors = [0xffffff, 0xff8fb1, 0xffe066, 0xb48cff, 0xff7a59, 0x7fb8ff];
      for (let i = 0; i < 230; i += 1) { const a = random01(hole.number * 50 + i) * Math.PI, r = bedR - .85 + random01(i * 7.1) * 1.4; flowers.push([Math.cos(a) * r, CONFIG.world.teeZ + 3 + Math.sin(a) * r * .55, bandColors[Math.floor(a / Math.PI * bandColors.length) % bandColors.length]]); }
      scatterFlowers(hole, flowers, { size: 1.25 });
      // low boxwood hedge behind the bed
      const hedge = []; for (let a = .12; a < Math.PI - .1; a += .16) { const r = bedR + 1.9; hedge.push({ x: Math.cos(a) * r, z: CONFIG.world.teeZ + 3 + Math.sin(a) * r * .6, y: teeY + .35, sx: .55, sy: .42, sz: .5, color: CONFIG.courseVisuals.cartoon.oakGreens[Math.floor(a * 10) % 3] }); }
      hedge.forEach(hh => { hh.y = terrainHeightAt(hh.x, hh.z, hole) + .33; }); detailInstanced(new THREE.SphereGeometry(1, 12, 9), hedge, 0x3f9d49, true);
    }
    const DETAIL_COLORS = { flowers: [0xffffff, 0xffe066, 0xff8fb1, 0xb48cff, 0xff7a59, 0x7fb8ff], tuft: [0x3f8a3a, 0x4c9a42, 0x366f33], rock: [0x9aa1a6, 0x8a9096, 0xb0b5b8] };
    function detailInstanced(geometry, items, color, castShadow = false) {
      if (!items.length) return; const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: toonGradient() }), items.length); const dummy = new THREE.Object3D(); const col = new THREE.Color();
      items.forEach((it, i) => { dummy.position.set(it.x, it.y, it.z); dummy.rotation.set(it.rx || 0, it.ry || 0, 0); dummy.scale.set(it.sx, it.sy, it.sz); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, col.setHex(it.color)); });
      mesh.castShadow = castShadow; mesh.receiveShadow = true; courseGroup.add(mesh);
    }
    // Real little flowers: five petals around a golden centre, a stem and two leaves, grouped in colour clusters
    let flowerParts = null;
    function mergeGeometries(list) {
      const pos = [], nor = []; list.forEach(g => { const n = g.index ? g.toNonIndexed() : g; n.computeVertexNormals(); pos.push(...n.attributes.position.array); nor.push(...n.attributes.normal.array); });
      const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return out;
    }
    function getFlowerParts() {
      if (flowerParts) return flowerParts;
      const petals = []; for (let k = 0; k < 5; k += 1) { const a = k / 5 * Math.PI * 2; const g = new THREE.SphereGeometry(1, 8, 6); g.scale(.055, .018, .032); g.translate(.05, 0, 0); g.rotateZ(.25); g.rotateY(a); petals.push(g); }
      const leaves = [-1, 1].map(side => { const g = new THREE.SphereGeometry(1, 6, 4); g.scale(.05, .012, .022); g.translate(.045, 0, 0); g.rotateZ(side * .5); g.rotateY(side > 0 ? 0 : Math.PI); g.translate(0, -.12 + side * .03, 0); return g; });
      const stem = new THREE.CylinderGeometry(.008, .011, .26, 5); stem.translate(0, -.13, 0);
      flowerParts = { head: mergeGeometries(petals), center: new THREE.SphereGeometry(.03, 10, 8), stem: mergeGeometries([stem, ...leaves]) };
      return flowerParts;
    }
    function scatterFlowers(hole, spots, options = {}) {
      if (!spots.length) return; const parts = getFlowerParts(); const heads = [], centers = [], stems = [];
      spots.forEach(([x, z, color], i) => {
        const size = (options.size || 1) * (.8 + random01(x * 1.7 + z * 2.3) * .45); const h = (.2 + random01(x * 4.1 - z) * .13) * size; const y = terrainHeightAt(x, z, hole) + CONFIG.courseVisuals.cartoon.surfaceLift.firstCut * 0 + h;
        const ry = random01(x + z * 3.1) * Math.PI * 2, tilt = (random01(z * 5.7) - .5) * .35;
        const c = color !== undefined ? color : DETAIL_COLORS.flowers[Math.floor(random01(x * 3.3 + z) * DETAIL_COLORS.flowers.length)];
        heads.push({ x, y, z, sx: size, sy: size, sz: size, rx: tilt, ry, color: c }); centers.push({ x, y: y + .012 * size, z, sx: size, sy: size * .7, sz: size, color: c === 0xffe066 ? 0xd9822b : 0xffd23f });
        stems.push({ x, y, z, sx: size, sy: h / .26, sz: size, rx: tilt * .5, ry, color: 0x3f8f3a });
      });
      detailInstanced(parts.head, heads, 0xffffff); detailInstanced(parts.center, centers, 0xffd23f); detailInstanced(parts.stem, stems, 0x3f8a3a);
    }
    // flowers grouped into same-colour clusters look planted rather than random
    function flowerCluster(cx, cz, count, radius, seed) {
      const color = DETAIL_COLORS.flowers[Math.floor(random01(seed * 7.7) * DETAIL_COLORS.flowers.length)]; const out = [];
      for (let i = 0; i < count; i += 1) { const a = random01(seed * 13 + i) * Math.PI * 2, r = Math.sqrt(random01(seed * 17 + i * 3)) * radius; out.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r, color]); }
      return out;
    }
    function makeRoughDetails(hole) {
      const look = CONFIG.courseVisuals.cartoon; const edge = hole.fairwayWidthMeters / 2; const g = hole.green.center; const tufts = [], flowerSpots = [], rocks = [], bushes = []; let seed = hole.number * 7777;
      const okSpot = (x, z) => { const s = surfaceInfoAt(x, z).surface; if (s !== 'rough') return false; if (inAnyHazard(hole, x, z, 1.35)) return false; if (Math.hypot(x - g.x, z - g.z) < hole.green.radiusMeters + hole.green.fringeMeters + 2) return false; if (Math.abs(x) < 6 && Math.abs(z - CONFIG.world.teeZ) < 7) return false; const pp = courseRuntime.cartPathPts || []; for (let k = 0; k < pp.length; k += 2) if (Math.abs(pp[k].z - z) < 3 && Math.hypot(pp[k].x - x, pp[k].z - z) < CONFIG.courseVisuals.cartoon.cartPath.width / 2 + 1) return false; return true; };
      for (let i = 0; i < look.tufts; i += 1) {
        seed += 1; const d = random01(seed) * (hole.lengthMeters + 10); const c = fairwayCenterAtDistance(d, hole); const side = random01(seed * 1.9) > .5 ? 1 : -1; const off = edge + 3.5 + random01(seed * 2.7) ** 1.6 * (hole.roughWidthMeters - 2);
        const x = c.x + side * off, z = c.z + (random01(seed * 4.1) - .5) * 3; if (!okSpot(x, z)) continue;
        const h = .32 + random01(seed * 5.3) * .35; const y = terrainHeightAt(x, z, hole);
        for (let k = 0; k < 3; k += 1) tufts.push({ x: x + (k - 1) * .09, z: z + (random01(seed + k) - .5) * .14, y: y + h / 2, sx: .09, sy: h, sz: .07, rx: (k - 1) * .35, ry: random01(seed * 6 + k) * 3, color: DETAIL_COLORS.tuft[k] });
      }
      for (let i = 0; i < look.flowers; i += 1) {
        seed += 1; const d = random01(seed) * (hole.lengthMeters + 20) - 10; const c = fairwayCenterAtDistance(d, hole); const side = random01(seed * 1.3) > .5 ? 1 : -1;
        if (i % 5) continue; // fewer, fuller patches
        const cluster = edge + hole.roughWidthMeters * (.55 + random01(seed * 3.7) * .4); const x = c.x + side * cluster + (random01(seed * 8.1) - .5) * 2, z = c.z + (random01(seed * 9.2) - .5) * 2;
        if (okSpot(x, z)) flowerCluster(x, z, 7 + Math.floor(random01(seed) * 6), .9, seed).forEach(f => { if (okSpot(f[0], f[1])) flowerSpots.push(f); });
      }
      // flowers and bushes framing the back of the green
      for (let a = -1.1; a <= 1.1; a += .12) { const r = hole.green.radiusMeters + hole.green.fringeMeters + 8 + random01(a * 10 + hole.number) * 5; const x = g.x + Math.sin(a) * r, z = g.z - Math.cos(a) * r; if (okSpot(x, z)) { if (random01(a * 31) > .5) bushes.push([x, z]); else flowerCluster(x, z, 9, 1, a * 100 + hole.number).forEach(f => { if (okSpot(f[0], f[1])) flowerSpots.push(f); }); } }
      // rocks by the ponds and along the rough
      hole.water.forEach((w, wi) => { for (let k = 0; k < 7; k += 1) { const a = random01(wi * 90 + k) * Math.PI * 2; const x = w.x + Math.cos(a) * w.radiusX * 1.32, z = w.z + Math.sin(a) * w.radiusZ * 1.32; if (surfaceInfoAt(x, z).surface !== 'water') rocks.push([x, z]); } });
      for (let i = 0; i < look.rocks; i += 1) { seed += 1; const d = random01(seed) * hole.lengthMeters; const c = fairwayCenterAtDistance(d, hole); const side = random01(seed * 2.2) > .5 ? 1 : -1; const x = c.x + side * (edge + hole.roughWidthMeters - 1.5), z = c.z; if (okSpot(x, z)) rocks.push([x, z]); }
      detailInstanced(new THREE.ConeGeometry(1, 1, 4), tufts, 0x3f8a3a);
      scatterFlowers(hole, flowerSpots, { size: .9 });
      detailInstanced(new THREE.DodecahedronGeometry(1, 0), rocks.map(([x, z], i) => { const r = .6 + random01(x + z) * .6; return { x, z, y: terrainHeightAt(x, z, hole) + r * .3, sx: r * 1.3, sy: r * .75, sz: r, ry: random01(i) * 3, color: DETAIL_COLORS.rock[i % 3] }; }), 0x9aa1a6, true);
      const bushParts = []; bushes.forEach(([x, z], i) => { const y = terrainHeightAt(x, z, hole); for (let k = 0; k < 3; k += 1) { const r = .55 + random01(i * 3 + k) * .35; bushParts.push({ x: x + (k - 1) * .55, z: z + (random01(i + k * 5) - .5) * .5, y: y + r * .7, sx: r, sy: r * .85, sz: r, color: look.oakGreens[(i + k) % look.oakGreens.length] }); } });
      detailInstanced(new THREE.SphereGeometry(1, 12, 9), bushParts, 0x4caa4f, true);
    }
    // ---------- green reading: little dots that flow downhill while you line up a putt ----------
    const greenFlow = (() => {
      const N = CONFIG.greens.flowDots; const pos = new Float32Array(N * 3), alpha = new Float32Array(N);
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
      const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uOpacity: { value: 0 }, uScale: { value: 300 }, uColor: { value: new THREE.Color(0xffffff) } },
        vertexShader: 'attribute float alpha; varying float vA; uniform float uScale; void main() { vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(0.06 * uScale / -mv.z, 2.0, 7.0); }',
        fragmentShader: 'uniform float uOpacity; uniform vec3 uColor; varying float vA; void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(uColor, smoothstep(0.5, 0.18, d) * vA * uOpacity); }' });
      const points = new THREE.Points(geo, mat); points.frustumCulled = false; points.renderOrder = 6; points.visible = false; scene.add(points);
      return { N, pos, alpha, geo, mat, points, P: Array.from({ length: N }, () => ({ x: 0, z: 0, age: 1, life: 0 })), fade: 0, hole: null };
    })();
    function updateGreenFlow(dt) {
      const F = greenFlow; const lie = currentHole ? surfaceInfoAt(ballState.position.x, ballState.position.z).surface : '';
      const want = gameFlow.mode === 'playing' && addressing && currentClub().putter && (lie === 'green' || lie === 'fringe') && !ballState.inFlight && !holeState.completed;
      F.fade = THREE.MathUtils.clamp(F.fade + (want ? 2.5 : -4) * dt, 0, 1); F.mat.uniforms.uOpacity.value = F.fade * F.fade * (3 - 2 * F.fade);
      if (F.fade <= 0) { F.points.visible = false; return; } F.points.visible = true;
      if (F.hole !== currentHole) { F.hole = currentHole; F.P.forEach(p => { p.age = p.life = 0; }); }
      F.mat.uniforms.uScale.value = renderer.domElement.clientHeight * .5 * camera.projectionMatrix.elements[5];
      const b = ballState.position, pin = currentHole.pin; const cx = (b.x + pin.x) / 2, cz = (b.z + pin.z) / 2; const r = Math.max(4, Math.hypot(b.x - pin.x, b.z - pin.z) / 2 + 3.5); const fr = currentHole.green.fringeMeters;
      for (let i = 0; i < F.N; i += 1) {
        const p = F.P[i];
        if (p.age >= p.life) { let ok = false; for (let t = 0; t < 8 && !ok; t += 1) { const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r; p.x = cx + Math.cos(a) * d; p.z = cz + Math.sin(a) * d; ok = greenEdgeDistance(p.x, p.z) < fr * .6; } p.age = ok ? 0 : 0; p.life = ok ? 1.3 + Math.random() * 1.5 : .01; p.dead = !ok; }
        const g = greenGradientAt(p.x, p.z); const slope = Math.hypot(g.x, g.z);
        if (slope > 1e-4) { const speed = Math.min(1.5, .07 + slope * 22); p.x -= g.x / slope * speed * dt; p.z -= g.z / slope * speed * dt; }
        p.age += dt; if (greenEdgeDistance(p.x, p.z) > fr * .8) p.age = Math.max(p.age, p.life - .15);
        const k = i * 3; F.pos[k] = p.x; F.pos[k + 1] = greenHeightAt(p.x, p.z) + .13; F.pos[k + 2] = p.z;
        F.alpha[i] = p.dead ? 0 : Math.sin(Math.PI * Math.min(1, p.age / p.life)) * (.3 + Math.min(.55, slope * 26));
      }
      F.geo.attributes.position.needsUpdate = true; F.geo.attributes.alpha.needsUpdate = true;
    }
    // ---------- the wider world: horizon hills, shrubs under the trees, pond reeds, a parked cart, birds and butterflies ----------
    function makeScenery(hole) {
      const look = CONFIG.courseVisuals.cartoon; const B = hole.bounds; const M = look.terrainMargin; let seed = hole.number * 4321;
      const rnd = () => { seed += 1; return random01(seed * 1.618); };
      const toon = () => new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: toonGradient() });
      // a low meadow beyond the edge of the course so there is never a gap at the horizon
      let minY = Infinity; for (let i = 0; i <= 8; i += 1) { minY = Math.min(minY, terrainHeightAt(B.minX - M + 2, B.minZ + (B.maxZ - B.minZ) * i / 8, hole), terrainHeightAt(B.maxX + M - 2, B.minZ + (B.maxZ - B.minZ) * i / 8, hole)); }
      const cx = (B.minX + B.maxX) / 2, cz = (B.minZ + B.maxZ) / 2;
      const meadow = new THREE.Mesh(new THREE.CircleGeometry(1400, 48), new THREE.MeshLambertMaterial({ color: new THREE.Color(look.roughB).multiply(new THREE.Color(look.groundTint)) }));
      meadow.rotation.x = -Math.PI / 2; meadow.position.set(cx, minY - 1.2, cz); meadow.receiveShadow = false; courseGroup.add(meadow);
      // rolling hills in a ring around the hole, each topped with a scatter of trees
      const hills = [], hillTrees = [], hillPines = []; const hillColors = [0x5aa851, 0x4f9a4a, 0x67b25a, 0x5e9f55, 0x72b862];
      const ring = (x0, x1, z0, z1, pad) => { const per = 2 * ((x1 - x0) + (z1 - z0)); let t = rnd() * per; const pts = []; while (pts.length < 44) { t += per / 44 * (.7 + rnd() * .6); const u = t % per; let x, z, nx = 0, nz = 0; if (u < x1 - x0) { x = x0 + u; z = z0; nz = -1; } else if (u < (x1 - x0) + (z1 - z0)) { x = x1; z = z0 + u - (x1 - x0); nx = 1; } else if (u < 2 * (x1 - x0) + (z1 - z0)) { x = x1 - (u - (x1 - x0) - (z1 - z0)); z = z1; nz = 1; } else { x = x0; z = z1 - (u - 2 * (x1 - x0) - (z1 - z0)); nx = -1; } const out = pad + rnd() * 90; pts.push([x + nx * out, z + nz * out]); } return pts; };
      ring(B.minX - M, B.maxX + M, B.minZ - M, B.maxZ + M, 45).forEach(([x, z], i) => {
        const r = 45 + rnd() * 70, hgt = r * (.2 + rnd() * .22), y = minY - 1.5;
        hills.push({ x, y, z, sx: r, sy: hgt, sz: r * (.8 + rnd() * .5), ry: rnd() * 3, color: hillColors[i % hillColors.length] });
        const n = 5 + Math.floor(rnd() * 7);
        for (let k = 0; k < n; k += 1) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * r * .75; const tx = x + Math.cos(a) * d, tz = z + Math.sin(a) * d; const top = y + hgt * Math.sqrt(Math.max(0, 1 - (d / r) ** 2)); const th = 9 + rnd() * 8;
          if (rnd() < .45) hillPines.push({ x: tx, y: top + th * .45, z: tz, sx: th * .24, sy: th, sz: th * .24, color: look.pineGreens[k % 3] });
          else { const fall = rnd() < .25; hillTrees.push({ x: tx, y: top + th * .55, z: tz, sx: th * .38, sy: th * .34, sz: th * .38, color: fall ? look.autumn[Math.floor(rnd() * 5)] : look.oakGreens[k % 5] }); } }
      });
      const inst = (geo, list, shadow = false) => { if (!list.length) return; const mesh = new THREE.InstancedMesh(geo, toon(), list.length); const dummy = new THREE.Object3D(); const col = new THREE.Color(); list.forEach((it, i) => { dummy.position.set(it.x, it.y, it.z); dummy.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0); dummy.scale.set(it.sx, it.sy, it.sz); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); mesh.setColorAt(i, col.setHex(it.color)); }); mesh.castShadow = shadow; mesh.receiveShadow = shadow; courseGroup.add(mesh); return mesh; };
      inst(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), hills);
      inst(new THREE.SphereGeometry(1, 10, 8), hillTrees); inst(new THREE.ConeGeometry(1, 1, 8), hillPines);
      // shrubs and ferns along the foot of the tree lines, so the forest meets the rough softly
      const edge = hole.fairwayWidthMeters / 2 + hole.roughWidthMeters; const shrubs = [], ferns = [];
      for (let d = -10; d < hole.lengthMeters + 20; d += 2.6) {
        const c = fairwayCenterAtDistance(d, hole), n = fairwayCenterAtDistance(d + 1, hole); const dx = n.x - c.x, dz = n.z - c.z, L = Math.hypot(dx, dz); if (L < .2) continue; const nx = -dz / L, nz = dx / L;
        [-1, 1].forEach(side => { if (rnd() < .25) return; const off = edge + 2.2 + rnd() * 3; const x = c.x + nx * side * off, z = c.z + nz * side * off; if (!outOfBoundsAt(x, z, hole) || inAnyHazard(hole, x, z, 1.4)) return; if (Math.hypot(x - hole.green.center.x, z - hole.green.center.z) < hole.green.radiusMeters + hole.green.fringeMeters + 6) return; const y = terrainHeightAt(x, z, hole);
          if (rnd() < .6) { const r = .7 + rnd() * .8; const fall = rnd() < .18; for (let k = 0; k < 3; k += 1) { const rr = r * (.7 + rnd() * .4); shrubs.push({ x: x + (k - 1) * r * .7, y: y + rr * .6, z: z + (rnd() - .5) * r, sx: rr, sy: rr * .8, sz: rr, color: fall ? look.autumn[Math.floor(rnd() * 5)] : look.oakGreens[Math.floor(rnd() * 5)] }); } }
          else for (let k = 0; k < 6; k += 1) { const a = k / 6 * Math.PI * 2 + rnd(); ferns.push({ x: x + Math.cos(a) * .25, y: y + .35, z: z + Math.sin(a) * .25, sx: .12, sy: .75, sz: .05, rx: Math.cos(a) * .7, rz: -Math.sin(a) * .7, ry: 0, color: [0x3f8a3a, 0x4f9e44, 0x2f7a35][k % 3] }); } });
      }
      inst(new THREE.SphereGeometry(1, 10, 8), shrubs, true); inst(new THREE.ConeGeometry(1, 1, 4), ferns);
      // reeds and cattails around the ponds
      const reeds = [], heads = [];
      hole.water.forEach(w => { const count = Math.round((w.radiusX + w.radiusZ) * 2.2); for (let i = 0; i < count; i += 1) { if (rnd() < .35) continue; const a = rnd() * Math.PI * 2; const k = 1.02 + rnd() * .12; const x = w.x + Math.cos(a) * w.radiusX * k, z = w.z + Math.sin(a) * w.radiusZ * k; const y = waterLevelAt(w);
        for (let j = 0; j < 4; j += 1) { const h = .7 + rnd() * .8; const ox = (rnd() - .5) * .5, oz = (rnd() - .5) * .5; const lean = (rnd() - .5) * .3; reeds.push({ x: x + ox, y: y + h / 2, z: z + oz, sx: .035, sy: h, sz: .035, rx: lean, rz: (rnd() - .5) * .3, color: j % 2 ? 0x5e9b3e : 0x4c8a36 }); if (j < 2 && rnd() < .7) heads.push({ x: x + ox + Math.sin(-lean) * 0, y: y + h * .98, z: z + oz + lean * h * .5, sx: .07, sy: .2, sz: .07, color: 0x7a4a2a }); } } });
      inst(new THREE.CylinderGeometry(1, 1, 1, 5), reeds); inst(new THREE.CapsuleGeometry(1, 1, 3, 6), heads);
      // a golf cart parked on the path beside the tee
      const pp = courseRuntime.cartPathPts || []; if (pp.length > 12) { const a = pp[8], b = pp[11]; const yaw = Math.atan2(b.x - a.x, b.z - a.z); const side = courseRuntime.cartPathSide || 1; const px = a.x + Math.cos(yaw) * side * .1, pz = a.z; courseGroup.add(makeGolfCart(px, terrainHeightAt(px, pz, hole), pz, yaw)); }
      // butterflies fluttering over the tee flower bed and behind the green
      courseRuntime.butterflies = []; const wingGeo = new THREE.CircleGeometry(.09, 10); wingGeo.translate(.08, 0, 0); const bColors = [0xffd23f, 0xff8fb1, 0xffffff, 0x9fd3ff, 0xff9a4a];
      const g = hole.green.center; const homes = [[0, CONFIG.world.teeZ + 4], [3, CONFIG.world.teeZ + 5], [-3, CONFIG.world.teeZ + 4.5], [g.x + 8, g.z - hole.green.radiusMeters - 10], [g.x - 9, g.z - hole.green.radiusMeters - 9], [g.x, g.z - hole.green.radiusMeters - 12]];
      homes.forEach(([hx, hz], i) => { const m = new THREE.MeshBasicMaterial({ color: bColors[i % bColors.length], side: THREE.DoubleSide }); const fly = new THREE.Group(); const l = new THREE.Mesh(wingGeo, m), r = new THREE.Mesh(wingGeo, m); r.rotation.y = Math.PI; fly.add(l, r); fly.userData = { hx, hz, hy: terrainHeightAt(hx, hz, hole) + .7, l, r, phase: i * 1.7, speed: .5 + random01(i * 3.3) * .4 }; courseRuntime.butterflies.push(fly); courseGroup.add(fly); });
      birds.userData.center.set(cx, 0, cz); birds.userData.baseY = minY;
    }
    function makeGolfCart(x, y, z, yaw) {
      const cart = new THREE.Group(); const m = c => new THREE.MeshToonMaterial({ color: c, gradientMap: toonGradient() });
      const put = (geo, mat, px, py, pz) => { const o = new THREE.Mesh(geo, mat); o.position.set(px, py, pz); o.castShadow = true; o.receiveShadow = true; cart.add(o); return o; };
      const white = m(0xf7f5ee), green = m(0x2e7a4a), dark = m(0x22262c), tan = m(0xe8d9b0);
      put(new THREE.BoxGeometry(1.2, .38, 2.3), white, 0, .55, 0);                         // body
      put(new THREE.BoxGeometry(1.14, .22, 1.0), green, 0, .88, -.05);                     // seat
      put(new THREE.BoxGeometry(1.14, .5, .14), green, 0, 1.1, .42);                       // seat back
      put(new THREE.BoxGeometry(1.1, .3, .5), white, 0, .82, -.9);                         // front cowl
      [[-.52, -.95], [.52, -.95], [-.52, .95], [.52, .95]].forEach(([px, pz]) => { const w = put(new THREE.CylinderGeometry(.26, .26, .18, 14), dark, px, .28, pz); w.rotation.z = Math.PI / 2; });
      [[-.52, -.72], [.52, -.72], [-.52, .9], [.52, .9]].forEach(([px, pz]) => put(new THREE.CylinderGeometry(.03, .03, 1.2, 6), white, px, 1.35, pz));
      put(new THREE.BoxGeometry(1.3, .08, 2.0), white, 0, 1.96, .1);                         // roof
      put(new THREE.BoxGeometry(.05, .22, .05), dark, -.2, 1.1, -.62).rotation.x = .5;       // steering column
      const wheel = put(new THREE.TorusGeometry(.16, .025, 6, 16), dark, -.2, 1.2, -.58); wheel.rotation.x = -1.1;
      put(new THREE.CylinderGeometry(.2, .2, .7, 10), tan, 0, 1.05, 1.08);                   // golf bag on the back
      [[-.06, 0xe44b3a], [.06, 0x4d75ef], [0, 0xf2c14e]].forEach(([o, c], i) => put(new THREE.SphereGeometry(.07, 8, 6), m(c), o, 1.47 + i * .03, 1.08 + o));
      cart.position.set(x, y + .02, z); cart.rotation.y = yaw; return cart;
    }
    // birds gliding in lazy circles high over the hole (built once)
    const birds = new THREE.Group(); birds.userData = { center: new THREE.Vector3(), baseY: 0 }; scene.add(birds);
    (() => { const mat = new THREE.MeshBasicMaterial({ color: 0x33404f, side: THREE.DoubleSide }); const wing = new THREE.BufferGeometry(); wing.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -.25, 0, 0, .2, 1.1, .05, 0], 3)); wing.computeVertexNormals();
      for (let f = 0; f < 3; f += 1) { const flock = new THREE.Group(); flock.userData = { radius: 70 + f * 45, height: 38 + f * 12, speed: (.07 + f * .02) * (f % 2 ? -1 : 1), angle: f * 2.1, off: new THREE.Vector3(f * 30 - 30, 0, f * 40 - 40) };
        for (let i = 0; i < 4 + f; i += 1) { const bird = new THREE.Group(); const l = new THREE.Mesh(wing, mat), r = new THREE.Mesh(wing, mat); r.scale.x = -1; const body = new THREE.Mesh(new THREE.SphereGeometry(.16, 6, 4), mat); body.scale.set(.8, .7, 2); bird.add(l, r, body); bird.position.set((i % 2 ? 1 : -1) * Math.ceil(i / 2) * 2.2, (random01(i * 7 + f) - .5) * 2, Math.ceil(i / 2) * 2.4); bird.userData = { l, r, phase: random01(i * 3 + f * 11) * 6 }; bird.scale.setScalar(1.4); flock.add(bird); }
        birds.add(flock); } })();
    function updateScenery(dt) {
      const t = performance.now() / 1000;
      birds.children.forEach(flock => { const u = flock.userData; u.angle += u.speed * dt; const c = birds.userData.center; flock.position.set(c.x + u.off.x + Math.cos(u.angle) * u.radius, birds.userData.baseY + u.height + Math.sin(u.angle * 2) * 3, c.z + u.off.z + Math.sin(u.angle) * u.radius); flock.rotation.y = -u.angle + (u.speed > 0 ? Math.PI : 0);
        flock.children.forEach(b => { const glide = Math.sin(t * .6 + b.userData.phase) > .3; const flap = glide ? .12 : Math.sin(t * 9 + b.userData.phase) * .6; b.userData.l.rotation.z = flap; b.userData.r.rotation.z = -flap; }); });
      (courseRuntime.butterflies || []).forEach(f => { const u = f.userData; const k = t * u.speed + u.phase; f.position.set(u.hx + Math.sin(k) * 2.2 + Math.sin(k * 2.3) * .6, u.hy + Math.sin(k * 3.1) * .35 + .2, u.hz + Math.cos(k * .8) * 1.8); f.rotation.y = Math.atan2(Math.cos(k) * 2.2, -Math.sin(k * .8) * 1.8); const flap = Math.sin(t * 22 + u.phase) * 1.1; u.l.rotation.z = flap; u.r.rotation.z = -flap; });
    }
    // soft cartoon clouds drifting across the sky (built once)
    const clouds = new THREE.Group(); scene.add(clouds);
    (() => { const mat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: toonGradient(), fog: false }); const geo = new THREE.SphereGeometry(1, 12, 9);
      for (let i = 0; i < 14; i += 1) { const cloud = new THREE.Group(); const a = (i / 14) * Math.PI * 2 + random01(i) * .4; const r = 260 + random01(i * 3) * 160; cloud.position.set(Math.cos(a) * r, 70 + random01(i * 5) * 45, Math.sin(a) * r - 150);
        for (let k = 0; k < 5; k += 1) { const puff = new THREE.Mesh(geo, mat); const s = 9 + random01(i * 9 + k) * 9; puff.scale.set(s * 1.4, s * .8, s); puff.position.set((k - 2) * 12 + random01(i + k) * 6, random01(i * 2 + k) * 5, random01(i * 4 + k) * 8); cloud.add(puff); }
        cloud.userData.speed = .6 + random01(i * 7) * .8; clouds.add(cloud); } })();
    function buildCourse(hole) {
      clearCourse();
      makeTerrain(hole); makeFairway(hole); makeTee(hole); makeGreen(hole);
      hole.bunkers.forEach(makeBunker); hole.water.forEach(makeWater); makeForest(hole);
      makeYardageMarkers(hole); makeOutOfBoundsStakes(hole); makeFlagAndCup(hole);
      makeCartPath(hole); makeTeeArea(hole); makeRoughDetails(hole); makeScenery(hole);
      courseRuntime.bounds = hole.bounds;
    }

    function makeBodySegment(length, width, material) {
      const segment = new THREE.Mesh(new THREE.BoxGeometry(width, length, width), material); segment.position.y = -length / 2; segment.castShadow = true; return segment;
    }
    // Low-poly golfer: red cap, brown hair, friendly face, blue polo with white collar, navy belt,
    // cream trousers, white shoes with navy soles and a white glove on the left hand.
    function buildGolfer(character = 'boy') {
      const c = CONFIG.character; const girl = character === 'girl'; const look = (CONFIG.characters[character] || CONFIG.characters.boy).look; const root = new THREE.Group();
      const mat = color => new THREE.MeshStandardMaterial({ color, roughness: .82, flatShading: true });
      const M = { sock: mat(look.sock), polo: mat(look.polo), poloDark: mat(look.poloDark), collar: mat(look.collar), skin: mat(look.skin), hair: mat(look.hair), cap: mat(look.cap), capDark: mat(look.capDark), pants: mat(look.pants), belt: mat(look.belt), buckle: mat(look.buckle), shoe: mat(look.shoe), sole: mat(look.sole), glove: mat(look.glove), eye: mat(0x1b1d24), nose: mat(look.nose), mouth: mat(0x6b3526) };
      const part = (geometry, material, x = 0, y = 0, z = 0, parent = root) => { const m = new THREE.Mesh(geometry, material); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
      const cyl = (rt, rb, h, seg = 7) => new THREE.CylinderGeometry(rt, rb, h, seg);
      const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

      // legs (pivot at the hip): cream trousers, white shoes, navy soles
      const makeLeg = side => {
        const leg = new THREE.Group(); leg.position.set(side * .12, .84, 0); root.add(leg);
        if (girl) { part(cyl(.08, .07, .46, 7), M.skin, 0, -.36, 0, leg); part(cyl(.076, .07, .16, 7), M.sock, 0, -.66, 0, leg); }
        else part(cyl(.108, .092, .74, 7), M.pants, 0, -.37, 0, leg);
        part(box(.19, .1, .3), M.shoe, 0, -.785, -.05, leg);
        part(box(.2, .04, .31), M.sole, 0, -.82, -.05, leg);
        return leg;
      };
      const leftLeg = makeLeg(-1), rightLeg = makeLeg(1);
      if (girl) { const skort = part(cyl(.24, .31, .3, 8), M.pants, 0, .8, 0); skort.scale.z = .78; }   // skort
      else part(box(.44, .18, .27), M.pants, 0, .86, 0);                  // hips
      part(box(.46, .07, .29), M.belt, 0, .94, 0);                        // belt
      part(box(.08, .05, .02), M.buckle, 0, .94, -.15);                   // buckle

      // upper body pivots at the waist, so leaning over the ball tilts the chest and head together
      const torso = new THREE.Group(); torso.position.set(0, .95, 0); root.add(torso);
      const polo = part(cyl(.29, .25, .52, 8), M.polo, 0, .27, 0, torso); polo.scale.z = .62;
      part(box(.055, .15, .012), M.poloDark, 0, .44, -.165, torso);       // placket
      [.47, .41].forEach(y => part(cyl(.012, .012, .01, 8), M.poloDark, 0, y, -.174, torso).rotation.x = Math.PI / 2);
      part(cyl(.13, .15, .06, 8), M.collar, 0, .55, .01, torso);          // collar band
      [-1, 1].forEach(side => { const flap = part(box(.13, .04, .09), M.collar, side * .07, .53, -.1, torso); flap.rotation.set(-.35, 0, side * .45); });
      part(cyl(.065, .07, .09, 7), M.skin, 0, .6, 0, torso);              // neck

      // head: blocky face, ears, hair, red cap with a forward brim
      const head = new THREE.Group(); head.position.set(0, .82, -.01); head.scale.setScalar(1.1); torso.add(head);
      part(box(.34, .36, .32), M.skin, 0, 0, 0, head);
      [-1, 1].forEach(side => {
        part(box(.05, .085, .07), M.skin, side * .19, -.005, .01, head);                      // ears
        part(box(.04, .05, .012), M.eye, side * .07, .02, -.162, head);                      // eyes
        const brow = part(box(.075, .02, .012), M.hair, side * .075, .085, -.163, head); brow.rotation.z = side * -.12;
        if (!girl) { part(box(.03, .1, .15), M.hair, side * .172, .09, .075, head); part(box(.025, .07, .03), M.hair, side * .172, .03, -.055, head); } // side hair + sideburn
      });
      const nose = part(new THREE.ConeGeometry(.03, .07, 4), M.nose, 0, -.015, -.185, head); nose.rotation.x = -Math.PI / 2;
      const smile = part(new THREE.TorusGeometry(.05, .009, 4, 12, Math.PI), M.mouth, 0, -.065, -.162, head); smile.rotation.z = Math.PI;
      if (girl) {
        part(box(.36, .3, .1), M.hair, 0, .0, .14, head);                                     // back of the hair
        part(box(.37, .1, .34), M.hair, 0, .19, .0, head);                                    // top of the hair (shows above the visor)
        const bangs = part(box(.3, .07, .05), M.hair, -.02, .13, -.16, head); bangs.rotation.z = .12;
        [-1, 1].forEach(side => { part(box(.035, .24, .16), M.hair, side * .175, -.02, .06, head); const lash = part(box(.022, .012, .012), M.eye, side * .097, .045, -.163, head); lash.rotation.z = side * -.5; });
        const tail = new THREE.Group(); tail.position.set(0, .11, .23); tail.rotation.x = .38; head.add(tail);
        part(cyl(.095, .045, .44, 8), M.hair, 0, -.21, 0, tail); part(new THREE.TorusGeometry(.06, .018, 6, 12), M.cap, 0, -.01, 0, tail).rotation.x = Math.PI / 2;  // ponytail + hair tie
        const band = part(new THREE.TorusGeometry(.19, .028, 6, 16), M.cap, 0, .15, .0, head); band.rotation.x = Math.PI / 2; band.scale.set(1, 1.02, .9);  // visor band
        const brim = part(box(.32, .025, .2), M.cap, 0, .15, -.24, head); brim.rotation.x = .1;
      } else {
        part(box(.36, .24, .1), M.hair, 0, .02, .14, head);                                   // back of the hair
        part(box(.1, .06, .05), M.hair, .16, -.12, .12, head);
        const crown = part(cyl(.195, .205, .15, 8), M.cap, 0, .235, .01, head); crown.scale.z = .98;
        part(cyl(.02, .02, .02, 6), M.capDark, 0, .315, .01, head);                           // button
        const brim = part(box(.3, .025, .18), M.cap, 0, .17, -.24, head); brim.rotation.x = .12;
        part(box(.14, .05, .02), M.capDark, 0, .2, .205, head);                                // back strap
      }

      // arms: short blue sleeves, skin arms, white glove on the left hand
      const shoulderY = 1.36; const armsRig = new THREE.Group(); armsRig.position.set(0, shoulderY, 0); root.add(armsRig);
      const makeArm = (side, gloved) => {
        const arm = new THREE.Group(); arm.position.set(side * .3, 0, 0); armsRig.add(arm);
        part(cyl(.095, .085, .19, 7), M.polo, 0, -.09, 0, arm);
        part(cyl(.062, .058, .16, 6), M.skin, 0, -.25, 0, arm);
        part(cyl(.058, .05, .22, 6), M.skin, 0, -.43, 0, arm);
        const hand = part(box(.1, .12, .08), gloved ? M.glove : M.skin, 0, -.58, 0, arm); hand.rotation.y = side * .2;
        return arm;
      };
      const leftArm = makeArm(-1, true), rightArm = makeArm(1, false);
      const carryHolder = new THREE.Group(); carryHolder.position.y = -.6; rightArm.add(carryHolder);
      const clubRoot = new THREE.Group(); clubRoot.position.set(0, c.stance.handHeight - shoulderY, -c.stance.handReach); armsRig.add(clubRoot);

      const shadow = new THREE.Mesh(new THREE.CircleGeometry(.42, 32), new THREE.MeshBasicMaterial({ color: 0x244b2d, transparent: true, opacity: .2, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .012; root.add(shadow);
      return { character, root, torso, head, armsRig, leftArm, rightArm, leftLeg, rightLeg, clubRoot, carryHolder, shadow };
    }
    let golfer = buildGolfer(settings.character); scene.add(golfer.root);
    function swapGolfer(character) {
      if (golfer.character === character) return; const old = golfer; const next = buildGolfer(character);
      next.root.position.copy(old.root.position); next.root.rotation.copy(old.root.rotation); scene.remove(old.root); scene.add(next.root); golfer = next; golfer.clubMode = null;
      if (typeof updateClubVisual === 'function' && currentHole) { updateClubVisual(); if (addressing) applySwingPose(0); else applyWalkingPose(); }
    }

    function currentClub() { return CONFIG.clubs[currentClubName]; }
    // swing: both hands on the grip, face toward the target. carry: held in the right hand, pointing forward
    function holdClub(mode) {
      const model = clubModels[clubKey(currentClub().model)]; if (!model || golfer.clubMode === mode) return; golfer.clubMode = mode;
      if (mode === 'swing') { golfer.clubRoot.add(model); model.rotation.set(0, Math.PI / 2, 0); model.position.set(0, (golfer.clubSoleOffset || 0) + (model.userData.soleFix || 0), 0); }
      else { golfer.carryHolder.add(model); model.rotation.set(1.05, 0, 0); model.position.set(0, .02, 0); }
    }
    const _armDir = new THREE.Vector3(), _down = new THREE.Vector3(0, -1, 0);
    function pointArmAtHands(arm) { _armDir.set(golfer.clubRoot.position.x - arm.position.x, golfer.clubRoot.position.y, golfer.clubRoot.position.z).normalize(); arm.quaternion.setFromUnitVectors(_down, _armDir); }
    function directionFromAimAngle(angle) { return new THREE.Vector3(Math.sin(angle), 0, -Math.cos(angle)).normalize(); }
    function aimDirection() { return directionFromAimAngle(aimAngleRadians); }
    function effectiveLoft(club = currentClub()) { return club.launchAngleDegrees; }
    // how long a putt 'plays': uphill putts play longer, downhill ones shorter (the break is still yours to read)
    function puttPlaysLikeMeters() {
      if (!currentHole) return 10; const d = Math.hypot(ballState.position.x - currentHole.pin.x, ballState.position.z - currentHole.pin.z); const lie = surfaceInfoAt(ballState.position.x, ballState.position.z).surface;
      if (lie !== 'green' && lie !== 'fringe') return d; const rise = greenHeightAt(currentHole.pin.x, currentHole.pin.z) - greenHeightAt(ballState.position.x, ballState.position.z);
      return Math.max(.5, d + rise * CONFIG.greens.slopeGravity / CONFIG.physics.surfaces.green.rollDecel);
    }
    function putterRangeMeters() { const p = CONFIG.putting; const d = currentHole ? puttPlaysLikeMeters() : 10; return THREE.MathUtils.clamp(d * p.rangePerDistance + p.rangeExtraMeters, p.minRangeMeters, CONFIG.clubs.Putter.maxDistanceMeters); }
    function clubFullSpeed(club) { if (club.putter) return Math.sqrt(2 * CONFIG.physics.surfaces.green.rollDecel * putterRangeMeters()); if (club.speedTrim) return club.speedTrim * rawClubFullSpeed(club);
      return rawClubFullSpeed(club); }
    function rawClubFullSpeed(club) { const launch = THREE.MathUtils.degToRad(effectiveLoft(club)); return Math.sqrt(Math.abs(CONFIG.physics.gravity) * club.maxDistanceMeters / Math.max(.15, Math.sin(2 * launch))); }
    function effectiveLaunchSpeed(club, power) { const safePower = THREE.MathUtils.clamp(power, 0, CONFIG.swing.powerMax); const fullSpeed = clubFullSpeed(club); return safePower <= 1 ? fullSpeed * Math.sqrt(safePower) : fullSpeed * (1 + (safePower - 1) * CONFIG.swing.overswingDistanceBonus); }
    function calibrateClubs() {
      const dt = CONFIG.physics.fixedTimeStep;
      Object.values(CONFIG.clubs).forEach(club => {
        if (club.putter) return; club.speedTrim = 1;
        for (let pass = 0; pass < 4; pass++) {
          const speed = clubFullSpeed(club); const angle = THREE.MathUtils.degToRad(effectiveLoft(club));
          let vx = speed * Math.cos(angle), vy = speed * Math.sin(angle), x = 0, y = 0, rpm = club.backspinRpm;
          for (let i = 0; i < 6000; i++) {
            const v = Math.hypot(vx, vy); rpm *= Math.exp(-CONFIG.spin.airSpinDecay * dt);
            vy += (rpm / CONFIG.spin.backspinMaxRpm) * v * CONFIG.spin.liftStrength * dt + CONFIG.physics.gravity * dt;
            const drag = Math.exp(-CONFIG.physics.airDrag * dt); vx *= drag; vy *= drag; x += vx * dt; y += vy * dt;
            if (y < 0 && vy < 0) break;
          }
          club.speedTrim *= Math.sqrt(club.maxDistanceMeters / Math.max(1, x));
        }
      });
    }
    function backspinForClub(club = currentClub(), power = 1) { return club.backspinRpm * (.55 + .45 * THREE.MathUtils.clamp(power, 0, CONFIG.swing.powerMax)); }
    function distanceMultiplierForLie(club, lie) {
      if (lie === 'sand') return club.sandWedge ? club.sandMultiplier : CONFIG.physics.surfaces.sand.distanceMultiplier;
      return (CONFIG.physics.surfaces[lie] || CONFIG.physics.surfaces.rough).distanceMultiplier;
    }
    // Feet stand on the drawn grass (green, fringe, fairway, tee and sand sit slightly above the bare ground)
    function standingHeightAt(x, z) { const info = surfaceInfoAt(x, z); return info.surface === 'water' || info.surface === 'outOfBounds' ? terrainHeightAt(x, z) : info.height; }
    function setGolferGroundHeight() { if (currentHole) golfer.root.position.y = standingHeightAt(golfer.root.position.x, golfer.root.position.z); }
    // At address the club's sole rests exactly on the grass under the ball, even on a slope or a lifted green
    function updateClubSoleOffset() {
      if (!currentHole) return; const ground = surfaceInfoAt(ballState.position.x, ballState.position.z).height;
      const soleAtAddress = golfer.root.position.y + CONFIG.character.stance.handHeight - CONFIG.clubModel.lengthToGround;
      golfer.clubSoleOffset = THREE.MathUtils.clamp(ground + .006 - soleAtAddress, -.1, .25);
    }

    // The golfer holds the cartoon club model for the selected club (built once, then reused)
    const clubModels = {};
    // the girl golfer carries the limited edition pink set; everyone sees it (her own screen, friends' screens, replays)
    function clubEdition(character) { return character === 'girl' ? 'pink' : undefined; }
    function clubKey(model, character = golfer.character) { return `${model}:${clubEdition(character) || 'std'}`; }
    function buildClubModel(modelName, character) {
      const model = GolfClubs.createClub(modelName, { headScale: CONFIG.clubModel.headScale, length: CONFIG.clubModel.lengthToGround, flatSole: true, edition: clubEdition(character) });
      model.traverse(o => { if (o.isMesh && o.name !== 'outline') o.castShadow = true; });
      // lofted faces can dip below the sole: measure the real lowest point once and lift the club by that much
      model.updateMatrixWorld(true); const low = new THREE.Box3().setFromObject(model.userData.head).min.y; model.userData.soleFix = -CONFIG.clubModel.lengthToGround - low;
      return model;
    }
    function updateClubVisual() {
      const club = currentClub(); golfer.clubRoot.clear();
      const key = clubKey(club.model); if (!clubModels[key]) clubModels[key] = buildClubModel(club.model, golfer.character);
      golfer.carryHolder.clear(); golfer.clubRoot.add(clubModels[key]); golfer.clubMode = null;
    }

    function holeTotal() { return holeState.strokes + holeState.penalties; }
    function currentRoundScore() { return scorecard.reduce((sum, row, index) => sum + (row.score === null ? (index === currentHoleIndex ? holeTotal() : 0) : row.score), 0); }
    function currentRoundPar() { return scorecard.reduce((sum, row, index) => sum + (row.score !== null || (index === currentHoleIndex && holeTotal() > 0) ? row.par : 0), 0); }
    // score to par counts finished holes only (like real golf: '+1 thru 3'); a hole in progress never shows as under par
    function roundToPar() { let strokes = 0, par = 0; scorecard.forEach(row => { if (row.score !== null) { strokes += row.score; par += row.par; } }); return strokes - par; }
    function formatToPar(value) { return value === 0 ? 'E' : value > 0 ? `+${value}` : `${value}`; }
    function scoreTerm(score, par) { if (score === 1) return 'Hole in one'; const difference = score - par; if (difference <= -3) return 'Albatross'; if (difference === -2) return 'Eagle'; if (difference === -1) return 'Birdie'; if (difference === 0) return 'Par'; if (difference === 1) return 'Bogey'; if (difference === 2) return 'Double bogey'; if (difference === 3) return 'Triple bogey'; return `+${difference}`; }
    // the friendly line shown when a hole ends
    function holeCheer(score, par) {
      const d = score - par;
      if (score === 1) return { main: 'HOLE IN ONE!', tier: 'pure' };
      if (d <= -3) return { main: 'Albatross!!', tier: 'pure' };
      if (d === -2) return { main: 'Great eagle!', tier: 'pure' };
      if (d === -1) return { main: 'Nice birdie!', tier: 'pure' };
      if (d === 0) return { main: 'Nice par!', tier: 'great' };
      if (d === 1) return { main: 'Good bogey', tier: 'ok' };
      if (d === 2) return { main: 'Unfortunate double bogey', tier: 'miss' };
      if (d === 3) return { main: 'Unfortunate triple bogey', tier: 'bad' };
      return { main: `Unfortunate +${d}`, tier: 'bad' };
    }
    function showHoleCheer(score, par) { const c = holeCheer(score, par); showShotPop(c.main, `${score} on a par ${par}`, `hole ${c.tier}`, 2); showHoleCheer.until = performance.now() + 2100; }
    // let the hole cheer and confetti play on the course before the scorecard slides in
    function afterCheer(fn) { const wait = (showHoleCheer.until || 0) - performance.now(); if (wait > 0) setTimeout(fn, wait); else fn(); }

    // ---------- saved scores: your own history on this device + the all-time leaderboard on the server ----------
    const roundRecord = { id: null, saved: false, mpKey: null, rankHtml: '' };
    function deviceId() { let id = readStoredJSON(CONFIG.storage.deviceKey, null); if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).replace(/[^a-z0-9-]/gi, '').slice(0, 32); writeStoredJSON(CONFIG.storage.deviceKey, id); } return id; }
    function readHistory() { const h = readStoredJSON(CONFIG.storage.historyKey, []); return Array.isArray(h) ? h : []; }
    function addToHistory(entry) { const h = readHistory(); if (h.some(r => r.id === entry.id)) return; h.unshift(entry); writeStoredJSON(CONFIG.storage.historyKey, h.slice(0, 60)); }
    function showCardRank(html, keep = true) { if (keep && html) roundRecord.rankHtml = html; const el = $('card-rank'); el.hidden = !html; el.innerHTML = html || ''; const btn = el.querySelector('button'); if (btn) btn.addEventListener('click', () => { gameFlow.boardFromCard = true; openBoard('all'); }); }
    async function postFinishedRound(holes, mode) {
      const total = holes.reduce((a, b) => a + b, 0); const toPar = total - totalCoursePar();
      if (mode === 'solo') { if (roundRecord.saved) { showCardRank(roundRecord.rankHtml); return; } roundRecord.saved = true; }
      const id = mode === 'solo' ? (roundRecord.id || `${deviceId()}-${Date.now().toString(36)}`) : roundRecord.mpKey;
      addToHistory({ id, when: Date.now(), holes, total, toPar, mode }); saveBestScore(total);
      showCardRank('Saving your round…');
      try {
        let rank = null, players = null;
        if (mode === 'solo') { const r = await fetch('/api/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: settings.playerName || 'Golfer', holes, character: settings.character, device: deviceId(), roundId: id }) }); const d = await r.json(); if (!r.ok) throw new Error(d.error || 'save failed'); rank = d.rank; players = d.players; }
        else { await new Promise(res => setTimeout(res, 600)); const d = await (await fetch(`/api/leaderboard?period=all&limit=1&device=${encodeURIComponent(deviceId())}`)).json(); rank = d.me && d.me.rank; players = d.players; }
        showCardRank(rank ? `You’re <b>#${rank}</b> of ${players} golfers all-time <button type="button">Leaderboard</button>` : `Round saved <button type="button">Leaderboard</button>`);
      } catch (e) { showCardRank('Saved to <b>My rounds</b> on this device (the leaderboard server couldn’t be reached).'); }
    }
    let boardPeriod = 'all';
    function openBoard(period = boardPeriod) { hideMenuScreens(); $('scorecard-overlay').hidden = true; $('board-menu').hidden = false; document.body.classList.add('menu-open'); if (gameFlow.mode !== 'scorecard') gameFlow.boardReturn = gameFlow.mode; gameFlow.mode = 'menu'; renderBoard(period); }
    function closeBoard() { $('board-menu').hidden = true; if (gameFlow.boardFromCard) { gameFlow.boardFromCard = false; document.body.classList.remove('menu-open'); if (mp.active && mp.state) showMpScorecard(mp.state); else renderScorecard(); return; } showMainMenu(); }
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const whenText = ms => { const d = new Date(ms); const days = Math.floor((Date.now() - ms) / 86400000); return days <= 0 ? 'today' : days === 1 ? 'yesterday' : days < 7 ? `${days} days ago` : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); };
    const tpClass = v => v < 0 ? 'under' : v > 0 ? 'over' : 'even';
    async function renderBoard(period) {
      boardPeriod = period; document.querySelectorAll('.board-tabs button').forEach(b => b.classList.toggle('on', b.dataset.period === period)); const body = $('board-body'); const note = $('board-note');
      if (period === 'mine') {
        const h = readHistory(); const holesNow = COURSE_DATA.holes.length; const full = h.filter(r => r.holes.length === holesNow); if (!h.length) { note.textContent = ''; body.innerHTML = `<div class="board-empty">No finished rounds yet. Play all ${holesNow} holes and your scores show up here.</div>`; return; }
        const best = full.length ? Math.min(...full.map(r => r.total)) : null; const avg = full.length ? full.reduce((a, r) => a + r.total, 0) / full.length : null;
        note.textContent = 'Rounds you finished on this device.';
        body.innerHTML = `<div class="board-stats"><div><small>${holesNow}-hole rounds</small><b>${full.length}</b></div><div><small>Best</small><b>${best === null ? '—' : `${best} <span style="font-size:13px">(${formatToPar(best - totalCoursePar())})</span>`}</b></div><div><small>Average</small><b>${avg === null ? '—' : avg.toFixed(1)}</b></div></div>` +
          h.slice(0, 40).map((r, i) => { const old = r.holes.length !== holesNow; const half = n => r.holes.slice(n, n + 9).reduce((a, b) => a + b, 0); return `<div class="board-row"><span class="rk">${h.length - i}</span><span class="nm">${r.mode === 'room' ? 'Room round' : 'Solo round'}${old ? ` <em>${r.holes.length} holes</em>` : ''}<small>${whenText(r.when)} · ${r.holes.length > 9 ? `out ${half(0)} · in ${half(9)}` : r.holes.join(' ')}</small></span><span class="tp ${tpClass(r.toPar)}">${formatToPar(r.toPar)}</span><span class="tt">${r.total}</span></div>`; }).join('');
        return;
      }
      note.textContent = 'Loading…'; body.innerHTML = '';
      try {
        const d = await (await fetch(`/api/leaderboard?period=${period}&limit=100&device=${encodeURIComponent(deviceId())}`)).json(); if (boardPeriod !== period) return;
        if (!d.entries.length) { note.textContent = ''; body.innerHTML = `<div class="board-empty">No ${COURSE_DATA.holes.length}-hole rounds ${period === 'today' ? 'today' : period === 'week' ? 'this week' : 'yet'}. Finish all ${COURSE_DATA.holes.length} holes to get on the board!</div>`; return; }
        note.textContent = `Each golfer’s best round · ${d.players} golfer${d.players === 1 ? '' : 's'} · ${d.rounds} round${d.rounds === 1 ? '' : 's'} played${d.me && !d.entries.some(e => e.me) ? ` · you’re #${d.me.rank}` : ''}`;
        body.innerHTML = d.entries.map(e => `<div class="board-row${e.me ? ' me' : ''}"><span class="rk${e.rank <= 3 ? ` top r${e.rank}` : ''}">${e.rank}</span><span class="nm">${esc(e.name)}${e.me ? '<em>you</em>' : ''}<small>${whenText(e.when * 1000)} · ${e.mode === 'room' ? 'room' : 'solo'}</small></span><span class="tp ${tpClass(e.toPar)}">${formatToPar(e.toPar)}</span><span class="tt">${e.total}</span></div>`).join('');
      } catch (e) { note.textContent = ''; body.innerHTML = '<div class="board-empty">The leaderboard server couldn’t be reached. Your own scores are under <b>My rounds</b>.</div>'; }
    }
    function totalCoursePar() { return COURSE_DATA.holes.reduce((sum, hole) => sum + hole.par, 0); }
    function updateBestScoreDisplay() {
      const best = readStoredJSON(CONFIG.storage.bestScoreKey, null); const element = $('best-score');
      if (!best || !Number.isFinite(best.score)) { element.textContent = ''; element.classList.add('empty'); return; } element.classList.remove('empty');
      element.textContent = `your best: ${best.score} (${formatToPar(best.score - totalCoursePar())})`;
    }
    function saveBestScore(total) {
      const previous = readStoredJSON(CONFIG.storage.bestScoreKey, null);
      if (!previous || !Number.isFinite(previous.score) || total < previous.score) writeStoredJSON(CONFIG.storage.bestScoreKey, { score: total });
      updateBestScoreDisplay();
    }
    function saveSettings() { writeStoredJSON(CONFIG.storage.settingsKey, settings); }
    function syncSettingsUI() {
      $('setting-sound').checked = settings.sound; $('setting-music-on').checked = settings.music; $('setting-music').value = String(Math.round(settings.musicVolume * 100)); $('setting-camera').value = String(Math.round(settings.cameraSensitivity * 100)); $('setting-preview').checked = settings.trajectoryPreview; $('setting-mouse-aim').checked = settings.mouseAim; $('setting-auto-club').checked = settings.autoClub; $('setting-mouse').value = String(Math.round(settings.mouseSensitivity * 100)); $('setting-mouse-value').textContent = `${settings.mouseSensitivity.toFixed(1)}×`; $('setting-mouse').disabled = !settings.mouseAim;
      $('setting-music-value').textContent = `${Math.round(settings.musicVolume * 100)}%`; $('setting-camera-value').textContent = `${settings.cameraSensitivity.toFixed(1)}×`;
    }
    function applySettings() {
      previewEnabled = settings.trajectoryPreview; previewClock = 1; $('toggle-preview').textContent = `Shot preview: ${previewEnabled ? 'on' : 'off'}`; $('toggle-preview').title = 'Show or hide the dotted ball flight (P)'; audioEngine.applySettings(); syncSettingsUI(); saveSettings();
    }
    function clearHeldInputs() { Object.keys(movement.keys).forEach(key => { movement.keys[key] = false; }); movement.velocity.set(0, 0, 0); movement.moving = false; if (swing.phase === 'power' && !swingAnimation.active) resetSwingMeter(); else swing.holdActive = false; }
    function hideMenuScreens() { ['main-menu', 'lobby-menu', 'board-menu', 'how-menu', 'settings-menu', 'pause-menu', 'confirm-restart'].forEach(id => { $(id).hidden = true; }); }
    // Restarting a hole always asks first
    let restartReturnsToPause = false;
    function askRestartHole() {
      if (mp.active) { updateStatus('Holes can’t be restarted in a multiplayer round'); return; }
      if (gameFlow.mode !== 'playing' && gameFlow.mode !== 'paused') return;
      restartReturnsToPause = gameFlow.mode === 'paused'; clearHeldInputs(); gameFlow.mode = 'paused'; hideMenuScreens(); $('confirm-restart').hidden = false; document.body.classList.add('menu-open'); $('confirm-restart-no').focus();
    }
    function closeRestartConfirm(restart) {
      hideMenuScreens();
      if (restart) { document.body.classList.remove('menu-open'); gameFlow.mode = 'playing'; resetCurrentHole(); return; }
      if (restartReturnsToPause) { $('pause-menu').hidden = false; } else { document.body.classList.remove('menu-open'); gameFlow.mode = 'playing'; }
    }
    function showMainMenu() {
      hideMenuScreens(); $('scorecard-overlay').hidden = true; $('hole-intro').hidden = true; $('flyover-skip').hidden = true; $('tip-toast').classList.remove('show'); onboarding.active = null; onboarding.timer = 0; $('main-menu').hidden = false; document.body.classList.add('menu-open'); gameFlow.mode = 'menu'; clearHeldInputs(); updateBestScoreDisplay();
    }
    function showHowToPlay() { hideMenuScreens(); $('how-menu').hidden = false; document.body.classList.add('menu-open'); gameFlow.mode = 'menu'; }
    function openSettings(returnTo) { gameFlow.settingsReturn = returnTo; hideMenuScreens(); $('settings-menu').hidden = false; document.body.classList.add('menu-open'); gameFlow.mode = 'settings'; syncSettingsUI(); }
    function closeSettings() { if (gameFlow.settingsReturn === 'pause') { hideMenuScreens(); $('pause-menu').hidden = false; document.body.classList.add('menu-open'); gameFlow.mode = 'paused'; } else showMainMenu(); }
    function pauseGame() {
      if (gameFlow.mode !== 'playing') return; clearHeldInputs(); gameFlow.mode = 'paused'; hideMenuScreens(); $('pause-menu').hidden = false; document.body.classList.add('menu-open');
    }
    function resumeGame() { if (gameFlow.mode !== 'paused') return; hideMenuScreens(); document.body.classList.remove('menu-open'); gameFlow.mode = 'playing'; audioEngine.ensure(); }
    function quitToMenu() { clearHeldInputs(); if (mp.active) mpLeave(); else showMainMenu(); }
    // title screen: "Play with friends" swaps the two big buttons for start-a-room / join-with-a-code
    function showFriendsStep(on) { $('friends-step').hidden = !on; document.querySelector('.ts-go').hidden = on; $('signin-error').textContent = ''; if (on) ($('join-code').value ? $('join-room') : $('create-room')).focus({ preventScroll: true }); }
    function startNewRound() { const nm = $('player-name').value.trim(); if (nm) { settings.playerName = nm; applySettings(); } audioEngine.ensure(); hideMenuScreens(); document.body.classList.remove('menu-open'); restartRound(true); }

    // ---------- first-hole tutorial: each step waits until the player has actually done it ----------
    // key caps show the player's real keyboard: on AZERTY the walk keys are Z Q S D, and so on (Chrome/Edge report the layout)
    const keyLabels = { KeyW: 'W', KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyE: 'E', KeyF: 'F', KeyR: 'R', KeyP: 'P' };
    const kl = code => keyLabels[code] || code;
    try { if (navigator.keyboard && navigator.keyboard.getLayoutMap) navigator.keyboard.getLayoutMap().then(map => { let changed = false; Object.keys(keyLabels).forEach(code => { const v = map.get(code); if (v && v.length === 1 && v.toUpperCase() !== keyLabels[code]) { keyLabels[code] = v.toUpperCase(); changed = true; } }); if (changed) refreshKeyLabels(); }).catch(() => {}); } catch (e) {}
    function refreshKeyLabels() { document.querySelectorAll('kbd[data-code]').forEach(k => { k.textContent = kl(k.dataset.code); }); if (tutorial.active) renderTutorialStep(); updateAddressPrompt(); }
    const K = (...keys) => keys.map(k => { const code = /^[A-Z]$/.test(k) ? 'Key' + k : null; const label = code ? kl(code) : k; return `<kbd${label.length > 2 ? ' class="wide"' : ''}${code ? ` data-code="${code}"` : ''}>${label}</kbd>`; }).join('');
    // a little mouse drawing with the button to use lit up (left / right) or arrows for sliding it
    const M = (what = 'left') => `<svg class="mouse-ico" viewBox="0 0 24 34" width="22" height="31" aria-label="${what === 'move' ? 'move the mouse' : what + ' mouse button'}"><rect x="2" y="2" width="20" height="30" rx="10" fill="#fff" stroke="#172238" stroke-width="2.4"/><line x1="12" y1="2" x2="12" y2="13" stroke="#172238" stroke-width="2"/><line x1="2" y1="13" x2="22" y2="13" stroke="#172238" stroke-width="2"/>${what === 'left' ? '<path d="M3.2 12 V11 a8.8 8.8 0 0 1 7.6-8.7 V12 z" fill="#ffd23f"/>' : what === 'right' ? '<path d="M20.8 12 V11 a8.8 8.8 0 0 0 -7.6-8.7 V12 z" fill="#ffd23f"/>' : '<path d="M-6 22 l4 -3 v6 z M30 22 l-4 -3 v6 z" fill="#172238"/>'}</svg>`;
    const TUTORIAL_STEPS = [
      { id: 'move', title: 'Walk', keys: () => `${K('W', 'A', 'S', 'D')} <span>+</span> ${K('Shift')} <span>jog</span>`, text: 'Walk toward the tee.', next: true, done: t => t.walked > 4 },
      { id: 'look', title: 'Look around', keys: () => `${K('←', '→')} <span>or</span> ${M('right')} <span>drag</span>`, text: 'Find the flag.', next: true, done: t => t.turned > .6 },
      { id: 'goto', title: 'Go to your ball', keys: () => `${K('F')}`, text: 'Jumps you to the ball, aimed at the flag.', done: () => addressing },
      { id: 'aim', title: 'Aim', keys: () => `${K('A', 'D')} <span>or</span> ${M('move')}`, text: 'Keep the yellow line on the fairway.', next: true, done: t => t.aimMoved > .05 },
      { id: 'club', title: 'Pick a club', keys: () => `${K('1', '2', '3', '4', '5')}`, text: 'Gold “Coach pick” = best club.', next: true, done: t => t.clubChanged },
      { id: 'power', title: 'Set power', keys: () => `${K('Space')} <span>or</span> ${M('left')} <span>hold, let go</span>`, text: 'Let go when the bar is full enough.', done: () => swing.phase === 'accuracy' || swingAnimation.active || ballState.inFlight },
      { id: 'accuracy', title: 'Hit it straight', keys: () => `${K('Space')} <span>or</span> ${M('left')} <span>again</span>`, text: 'Press when the bouncing marker is in the gold zone.', done: () => swingAnimation.active || ballState.inFlight },
      { id: 'watch', title: 'Follow the ball', keys: () => `${K('F')} <span>when it stops</span>`, text: 'Jump to it for your next shot.', done: () => addressing && !ballState.inFlight && !swingAnimation.active },
      { id: 'finish', title: 'You’re ready!', keys: () => `${K('Esc')} <span>pause</span>`, text: 'Hole it out. “Controls” lists every key.', next: 'Let’s play', auto: 5, done: () => false }
    ];
    // touch screens get their own tutorial: no keys, no walking
    const touchQuery = new URLSearchParams(location.search).get('touch');
    const touchMode = touchQuery === '1' || (touchQuery !== '0' && ((window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 1 && !window.matchMedia('(pointer: fine)').matches));
    const T = text => `<kbd class="wide">${text}</kbd>`;
    if (touchMode) TUTORIAL_STEPS.splice(0, TUTORIAL_STEPS.length,
      { id: 'goto', title: 'Your ball', keys: () => T('automatic'), text: 'You’re set up at your ball for every shot.', done: () => addressing },
      { id: 'aim', title: 'Aim', keys: () => `${T('drag ◀ ▶')}`, text: 'Keep the yellow line on the fairway.', next: true, done: t => t.aimMoved > .05 },
      { id: 'club', title: 'Pick a club', keys: () => `${T('tap a club')}`, text: 'Gold “Coach pick” = best club.', next: true, done: t => t.clubChanged },
      { id: 'power', title: 'Set power', keys: () => `${T('hold SWING')} <span>let go</span>`, text: 'Let go when the bar is full enough.', done: () => swing.phase === 'accuracy' || swingAnimation.active || ballState.inFlight },
      { id: 'accuracy', title: 'Hit it straight', keys: () => `${T('tap SWING')}`, text: 'Tap when the bouncing marker is in the gold zone.', done: () => swingAnimation.active || ballState.inFlight },
      { id: 'watch', title: 'Follow the ball', keys: () => T('sit back'), text: 'You’re taken to it when it stops.', done: () => addressing && !ballState.inFlight && !swingAnimation.active },
      { id: 'finish', title: 'You’re ready!', keys: () => `${T('☰')} <span>pause</span>`, text: 'Hole it out. On the green, dots flow downhill.', next: 'Let’s play', auto: 5, done: () => false });
    const tutorial = { active: false, step: 0, walked: 0, turned: 0, aimMoved: 0, clubChanged: false, lastYaw: 0, lastAim: 0, lastClub: null, doneTimer: 0 };
    function startTutorial() {
      Object.assign(tutorial, { active: true, step: 0, doneTimer: 0 }); resetTutorialProgress(); $('tip-toast').classList.remove('show'); onboarding.queue.length = 0; onboarding.active = null; renderTutorialStep();
    }
    function resetTutorialProgress() { Object.assign(tutorial, { autoT: 0, walked: 0, turned: 0, aimMoved: 0, clubChanged: false, lastYaw: cameraState.yaw, lastAim: aimAngleRadians, lastClub: currentClubName }); }
    function renderTutorialStep() {
      const step = TUTORIAL_STEPS[tutorial.step]; const box = $('tutorial'); box.hidden = false; box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump');
      $('tut-step').textContent = `Step ${tutorial.step + 1} of ${TUTORIAL_STEPS.length}`; $('tut-title').textContent = step.title; $('tut-keys').innerHTML = step.keys(); $('tut-text').textContent = step.text;
      $('tut-dots').innerHTML = TUTORIAL_STEPS.map((_, i) => `<i class="${i < tutorial.step ? 'done' : i === tutorial.step ? 'on' : ''}"></i>`).join('');
      $('tut-next').hidden = !step.next; $('tut-next').textContent = typeof step.next === 'string' ? step.next : 'Skip step'; $('tut-done').hidden = true;
    }
    function advanceTutorial() {
      if (!tutorial.active) return; tutorial.doneTimer = 0;
      if (tutorial.step >= TUTORIAL_STEPS.length - 1) { endTutorial(); return; }
      tutorial.step += 1; resetTutorialProgress(); renderTutorialStep();
    }
    function endTutorial() { document.body.classList.remove('calm', 'tut-on'); tutorial.active = false; $('tutorial').hidden = true; writeStoredJSON(CONFIG.storage.tutorialKey, true); }
    function updateCalmMode() {
      const learning = tutorial.active && gameFlow.mode === 'playing';
      document.body.classList.toggle('tut-on', learning);
      document.body.classList.toggle('calm', learning && !addressing && !swingAnimation.active && !ballState.inFlight && swing.phase === 'ready');
    }
    function updateTutorial(dt) {
      if (!tutorial.active || gameFlow.mode !== 'playing') return;
      tutorial.walked += Math.hypot(movement.velocity.x, movement.velocity.z) * dt;
      tutorial.turned += Math.abs(wrapAngle(cameraState.yaw - tutorial.lastYaw)) * (addressing ? 0 : 1); tutorial.lastYaw = cameraState.yaw;
      tutorial.aimMoved += Math.abs(wrapAngle(aimAngleRadians - tutorial.lastAim)) * (addressing ? 1 : 0); tutorial.lastAim = aimAngleRadians;
      if (currentClubName !== tutorial.lastClub) { tutorial.clubChanged = true; tutorial.lastClub = currentClubName; }
      // if the player steps away mid-swing, go back to the "jump to your ball" step
      const id = TUTORIAL_STEPS[tutorial.step].id;
      if (holeState.completed) { endTutorial(); return; }
      // swung before finishing the earlier steps? skip ahead to 'follow your ball' instead of nagging
      if (['aim', 'club', 'power'].includes(id) && (swingAnimation.active || ballState.inFlight)) { tutorial.step = TUTORIAL_STEPS.findIndex(s => s.id === 'watch'); resetTutorialProgress(); renderTutorialStep(); return; }
      if (['aim', 'club', 'power', 'accuracy'].includes(id) && !addressing && !swingAnimation.active && !ballState.inFlight) { tutorial.step = TUTORIAL_STEPS.findIndex(s => s.id === 'goto'); resetTutorialProgress(); renderTutorialStep(); return; }
      const cur = TUTORIAL_STEPS[tutorial.step]; if (cur.auto) { tutorial.autoT = (tutorial.autoT || 0) + dt; if (tutorial.autoT >= cur.auto) { endTutorial(); return; } } // the last card closes by itself
      if (tutorial.doneTimer > 0) { tutorial.doneTimer -= dt; if (tutorial.doneTimer <= 0) advanceTutorial(); return; }
      if (TUTORIAL_STEPS[tutorial.step].done(tutorial)) { $('tut-done').hidden = false; $('tut-next').hidden = true; tutorial.doneTimer = .9; audioEngine.ensure(); }
    }
    // After the first shot on hole 1 the player must press F once, so everyone learns the teleport
    const teleportLesson = { active: false, done: touchMode || !!readStoredJSON(CONFIG.storage.teleportKey, false) };
    function markTeleportTaught() { if (!teleportLesson.done) { teleportLesson.done = true; writeStoredJSON(CONFIG.storage.teleportKey, true); } }
    function updateTeleportLesson() {
      if (teleportLesson.done || teleportLesson.active || gameFlow.mode !== 'playing' || tutorial.active) return;
      if (currentHoleIndex !== 0 || holeState.strokes < 1 || ballState.inFlight || swingAnimation.active || hazardSeq || cupDrop || ballState.holed || holeState.completed || addressing || cameraState.ballHold > 0) return;
      teleportLesson.active = true; clearHeldInputs(); $('teleport-gate').hidden = false; $('tg-go').focus();
    }
    function completeTeleportLesson() {
      if (!teleportLesson.active) return; teleportLesson.active = false; markTeleportTaught(); $('teleport-gate').hidden = true; goToBall();
      setTimeout(() => updateStatus('Remember: press F anytime to jump to your ball'), 400);
    }

    // ======================= MULTIPLAYER =======================
    function playerName() { return (settings.playerName || '').trim() || 'You'; }
    async function mpPost(route, body) {
      let r; try { r = await fetch('/api/' + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
      catch (e) { throw new Error('Could not reach the game server. Start it with: python3 server.py'); }
      if (r.status === 501 || r.status === 405) throw new Error('Multiplayer needs the game server. In Terminal run: python3 server.py');
      const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Something went wrong. Try again.'); return j;
    }
    const mpAuth = extra => Object.assign({ code: mp.code, token: mp.token }, extra || {});
    function mpConnect() {
      if (mp.es) mp.es.close(); const es = new EventSource(`/events?code=${encodeURIComponent(mp.code)}&token=${encodeURIComponent(mp.token)}`); mp.es = es;
      es.onmessage = e => { const msg = JSON.parse(e.data); if (msg.type === 'shot' && msg.playerId !== mp.myId) startReplay(msg); if (msg.state) mpApplyState(msg.state); };
      es.onerror = () => { if (es.readyState === 2) mpEndSession('The room has closed.'); };
    }
    async function mpCreateOrJoin(join) {
      const name = $('player-name').value.trim(); if (!name) { $('signin-error').textContent = 'Type your name first.'; $('player-name').focus(); return; }
      settings.playerName = name; applySettings(); $('signin-error').textContent = ''; audioEngine.ensure();
      const code = $('join-code').value.trim().toUpperCase(); if (join && code.length !== 4) { $('signin-error').textContent = 'Room codes have 4 letters.'; return; }
      try {
        const r = await mpPost(join ? 'join' : 'create', { name, character: settings.character, code, device: deviceId() });
        Object.assign(mp, { active: true, code: r.code, token: r.token, myId: r.id, started: false, lastHole: -1, state: null, lastTurn: null });
        sessionStorage.setItem('ff-mp', JSON.stringify({ code: r.code, token: r.token, id: r.id })); history.replaceState(null, '', `?room=${r.code}`); mpConnect();
      } catch (e) { $('signin-error').textContent = e.message; }
    }
    function mpEndSession(message) {
      if (mp.es) mp.es.close(); mp.es = null; mp.active = false; mp.state = null; mp.started = false; mp.replay = null; sessionStorage.removeItem('ff-mp');
      mp.remotes.forEach(removeRemote); mp.remotes.clear(); $('player-tags').innerHTML = ''; document.body.classList.remove('mp-mode'); $('leaderboard').hidden = true; $('turn-banner').hidden = true;
      history.replaceState(null, '', location.pathname); showMainMenu(); if (message) $('signin-error').textContent = message;
    }
    function mpLeave() { if (mp.active) mpPost('leave', mpAuth()).catch(() => {}); mpEndSession(); }
    function me() { return mp.state && mp.state.players.find(p => p.id === mp.myId); }
    function mpPlayer(id) { return mp.state && mp.state.players.find(p => p.id === id); }
    function mpMyTurn() { return !mp.active || (mp.state && mp.state.phase === 'playing' && mp.state.turnId === mp.myId && !(mp.replay && mp.replay.active)); }
    function mpWaitText() { const t = mp.state && mpPlayer(mp.state.turnId); return t ? `Wait for ${t.name} to hit · everyone takes one shot before the next` : 'Waiting for the other players'; }

    function renderLobby(st) {
      if ($('lobby-code').dataset.code !== st.code) { $('lobby-code').dataset.code = st.code; $('lobby-code').innerHTML = [...st.code].map(ch => `<span>${ch}</span>`).join(''); } $('lb-code').textContent = st.code; $('lobby-link').value = `${location.origin}${location.pathname}?room=${st.code}`;
      const ul = $('lobby-players'); ul.innerHTML = '';
      st.players.forEach(p => { const li = document.createElement('li'); li.innerHTML = `<span class="dot" style="background:${p.color}"></span><span></span><small>${p.character === 'girl' ? 'Girl' : 'Boy'}${p.id === st.hostId ? ' · Host' : ''}</small>`; li.children[1].textContent = p.name + (p.id === mp.myId ? ' (you)' : ''); ul.appendChild(li); });
      const host = st.hostId === mp.myId; const n = st.players.length;
      $('lobby-start').hidden = !host; $('lobby-start').textContent = n < 2 ? 'Start alone (waiting for friends)' : `Start round · ${n} players`;
      $('lobby-wait').textContent = host ? (n < 2 ? 'Share the code, then start when your friends appear here.' : 'Everyone here? Start the round!') : 'Waiting for the host to start the round.';
    }
    function showLobby() { hideMenuScreens(); $('lobby-menu').hidden = false; document.body.classList.add('menu-open'); gameFlow.mode = 'menu'; }

    function applyRoomWind(w) { if (!w) return; wind.mph = w.mph; wind.angle = w.angle; wind.vector.set(Math.sin(w.angle), 0, -Math.cos(w.angle)).multiplyScalar(w.mph * CONFIG.wind.mphToMetersPerSecond); updateHud(); }
    function mpApplyState(st) {
      mp.state = st;
      if (st.phase === 'lobby') { showLobby(); renderLobby(st); return; }
      if (!mp.started || st.hole !== mp.lastHole) {
        const newRound = !mp.started || st.hole < mp.lastHole; mp.started = true; mp.lastHole = st.hole; mp.shotPending = false; mp.pendingCard = false; mp.viewingCard = false;
        hideMenuScreens(); document.body.classList.remove('menu-open'); document.body.classList.add('mp-mode'); $('leaderboard').hidden = false;
        if (newRound) { scorecard.forEach(row => { row.score = null; }); }
        loadHole(st.hole, true); const mine = me(); if (mine && mine.ball) { ballState.position.set(mine.ball.x, mine.ball.y, mine.ball.z); ballState.surface = mine.ball.surface; approachBallPosition(); }
      }
      applyRoomWind(st.wind);
      const mine = me(); if (mine) scorecard.forEach((row, i) => { row.score = mine.scores[i]; });
      updateRemotes(st); renderLeaderboard(st); updateTurnBanner(st);
      if (st.phase === 'holeover' || st.phase === 'finished') { mp.viewingCard = false; if (mp.replay && mp.replay.active) mp.pendingCard = true; else afterCheer(() => { if (mp.state === st || (mp.state && mp.state.phase === st.phase && mp.state.hole === st.hole)) showMpScorecard(mp.state); }); }
      else if (!mp.viewingCard && !$('scorecard-overlay').hidden && gameFlow.mode === 'scorecard') { $('scorecard-overlay').hidden = true; gameFlow.mode = 'playing'; }
    }
    function updateTurnBanner(st) {
      const b = $('turn-banner'); if (st.phase !== 'playing') { b.hidden = true; return; }
      const turn = mpPlayer(st.turnId); if (!turn) { b.hidden = true; return; }
      if (mp.replay && mp.replay.active) { const w = mpPlayer(mp.replay.playerId); b.hidden = false; b.classList.remove('mine'); b.innerHTML = `👀 Watching ${w ? w.name.replace(/[<>&]/g, '') : 'the'}’s shot…`; return; }
      const mine = turn.id === mp.myId; b.hidden = false; b.classList.toggle('mine', mine);
      b.innerHTML = mine ? '🏌️ Your turn!' : `<span style="color:${turn.color}">●</span> ${turn.name.replace(/[<>&]/g, '')} is up — watch their shot`;
      if (mine && mp.lastTurn !== st.turnId + ':' + turn.strokes) { audioEngine.tone(988, .18, .09, 'sine'); audioEngine.tone(1318, .22, .08, 'sine', .12); if (!addressing) updateStatus('Your turn!'); }
      mp.lastTurn = st.turnId + ':' + turn.strokes;
    }
    function renderLeaderboard(st) {
      $('lb-hole').textContent = `Hole ${st.hole + 1} of ${st.pars.length}`;
      const rows = st.players.filter(p => !p.left || p.scores.some(x => x !== null)).map(p => ({ p, t: playerTotals(p.scores, st.pars) }));
      rows.sort((a, b) => (a.t.toPar - b.t.toPar) || (b.t.thru - a.t.thru));
      let pos = 0, last = null; const ol = $('lb-rows'); ol.innerHTML = '';
      rows.forEach((r, i) => { if (r.t.toPar !== last) { pos = i + 1; last = r.t.toPar; } const li = document.createElement('li'); if (st.turnId === r.p.id) li.classList.add('turn');
        const thru = r.p.done && st.phase === 'playing' ? `F${st.hole + 1}` : r.t.thru ? `thru ${r.t.thru}` : 'thru 0'; const now = st.phase === 'playing' && !r.p.done && r.p.strokes ? ` · ${r.p.strokes}` : '';
        li.innerHTML = `<span class="pos">${pos}</span><span class="dot" style="background:${r.p.color}"></span><span class="nm"></span><span class="thru">${thru}${now}</span><span class="topar ${toParClass(r.t.toPar)}">${r.t.thru ? formatToPar(r.t.toPar) : 'E'}</span>`;
        li.querySelector('.nm').textContent = r.p.name + (r.p.id === mp.myId ? ' (you)' : '') + (r.p.left ? ' · left' : ''); ol.appendChild(li); });
    }
    function showMpScorecard(st) {
      const players = st.players.map(p => ({ name: p.name + (p.id === mp.myId ? ' (you)' : ''), color: p.color, scores: p.scores }));
      $('golf-card-wrap').innerHTML = golfCardHtml(players, st.pars, st.hole); $('scorecard-hole-tag').textContent = st.phase === 'finished' ? 'Final' : `Hole ${st.hole + 1}`;
      const ranked = st.players.filter(p => !p.left).map(p => ({ p, t: playerTotals(p.scores, st.pars) })).sort((a, b) => a.t.total - b.t.total);
      if (st.phase === 'finished') {
        const best = ranked[0]; const tied = ranked.filter(r => r.t.total === best.t.total);
        $('scorecard-title').innerHTML = `<span class="card-winner">${tied.length > 1 ? 'It’s a tie!' : (best.p.id === mp.myId ? 'You win!' : `${best.p.name.replace(/[<>&]/g, '')} wins!`)}</span>`;
        $('scorecard-subtitle').textContent = `Lowest total wins · ${best.t.total} strokes (${formatToPar(best.t.toPar)})`;
        const host = st.hostId === mp.myId; $('next-hole').hidden = !host; $('next-hole').textContent = 'Play again'; $('card-leave').hidden = false; $('card-wait').textContent = host ? '' : 'The host can start another round.';
        if (best.p.id === mp.myId) audioEngine.cheer();
      } else {
        const lead = ranked[0]; $('scorecard-title').textContent = `Hole ${st.hole + 1} complete`; $('scorecard-subtitle').textContent = lead ? `${lead.p.id === mp.myId ? 'You lead' : lead.p.name + ' leads'} at ${formatToPar(lead.t.toPar)}` : '';
        $('next-hole').hidden = false; $('next-hole').textContent = `Tee off hole ${st.hole + 2}`; $('card-leave').hidden = true; $('card-wait').textContent = 'Anyone can start the next hole.';
      }
      showScorecard();
      showCardRank('', false); if (st.phase === 'finished' && !mp.viewingCard) { const mine = st.players.find(p => p.id === mp.myId); const key = `${st.code}-${st.winds ? JSON.stringify(st.winds).length : ''}-${mine ? mine.scores.join('') : ''}-${Math.floor(Date.now() / 600000)}`; if (mine && mine.scores.every(v => v !== null)) { if (roundRecord.mpKey !== key) { roundRecord.mpKey = key; roundRecord.rankHtml = ''; postFinishedRound(mine.scores.slice(), 'room'); } else if (roundRecord.rankHtml) showCardRank(roundRecord.rankHtml); } }
      applyCardMode(st.phase === 'finished');
    }
    function mpNextFromCard() { if (!mp.state) return; if (mp.state.phase === 'finished') mpPost('rematch', mpAuth()).catch(e => updateStatus(e.message)); else mpPost('next', mpAuth()).catch(e => updateStatus(e.message)); }
    // phones: between holes the card shrinks to a slim strip (the full card is one tap away, and shows in full after the round)
    function ordinal(n) { return n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : Math.min(n % 10, 4) % 4] || 'th'); }
    function myRoundStatus() {
      if (mp.active && mp.state) { const st = mp.state; const ranked = st.players.filter(p => !p.left).map(p => ({ p, t: playerTotals(p.scores, st.pars) })).sort((a, b) => a.t.total - b.t.total); const i = ranked.findIndex(r => r.p.id === mp.myId); const me = ranked[i]; if (!me) return null;
        const place = ranked.filter(r => r.t.total < me.t.total).length + 1; const tied = ranked.filter(r => r.t.total === me.t.total).length > 1; return { toPar: me.t.toPar, thru: me.t.thru, place: ranked.length > 1 ? (tied ? 'T' : '') + ordinal(place) : '' }; }
      const t = playerTotals(scorecard.map(r => r.score), scorecard.map(r => r.par)); return { toPar: t.toPar, thru: t.thru, place: '' };
    }
    function applyCardMode(final) {
      const sign = $('card-sign'); sign.hidden = !final; if (final) { const esc = t => String(t).replace(/[&<>"]/g, ''); sign.innerHTML = `Player <b>${esc(playerName())}</b> Date <b>${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</b>`; }
      const mini = touchUI.compact && !final && !mp.viewingCard && !cardFullRequested; $('scorecard-overlay').classList.toggle('mini', mini); if (!mini) return;
      const me = myRoundStatus(); const hole = mp.active && mp.state ? mp.state.hole : currentHoleIndex; const mine = mp.active && mp.state ? (mp.state.players.find(p => p.id === mp.myId) || {}).scores?.[hole] : scorecard[currentHoleIndex].score; const par = mp.active && mp.state ? mp.state.pars[hole] : currentHole.par;
      $('scorecard-title').textContent = mine ? holeCheer(mine, par).main : `Hole ${hole + 1} complete`;
      $('card-mini-line').innerHTML = me ? `Hole ${hole + 1} done · you’re <b>${me.toPar === 0 ? 'even' : formatToPar(me.toPar)}</b> thru ${me.thru}${me.place ? ` · <b>${me.place}</b>` : ''}` : '';
    }
    let cardFullRequested = false;
    function closeLiveCard() { $('scorecard-overlay').hidden = true; gameFlow.mode = 'playing'; mp.viewingCard = false; }

    // ---- other players on the course ----
    const remoteBallGeo = new THREE.SphereGeometry(ballRadius, 32, 24);
    function ensureRemote(p) {
      let r = mp.remotes.get(p.id); if (r && r.character === p.character) return r; if (r) removeRemote(r);
      const g = buildGolfer(p.character); scene.add(g.root);
      const ballMesh = new THREE.Mesh(remoteBallGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .35 })); ballMesh.castShadow = true; scene.add(ballMesh);
      const halo = new THREE.Mesh(new THREE.RingGeometry(.14, .22, 32), new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: .9, depthWrite: false })); halo.rotation.x = -Math.PI / 2; scene.add(halo);
      const tag = document.createElement('div'); tag.className = 'player-tag'; tag.style.background = p.color; tag.textContent = p.name; $('player-tags').appendChild(tag);
      r = { id: p.id, character: p.character, golfer: g, club: null, clubModel: null, ball: ballMesh, halo, tag }; setRemoteClub(r, 'iron7'); mp.remotes.set(p.id, r); return r;
    }
    // show the club a friend is actually using (and in her colours if she plays the girl golfer)
    function setRemoteClub(r, modelName) {
      if (!GolfClubs.SPECS[modelName]) modelName = 'iron7'; if (r.clubModel === modelName && r.club) return;
      if (r.club) r.golfer.clubRoot.remove(r.club); r.clubCache = r.clubCache || {}; const club = r.clubCache[modelName] || (r.clubCache[modelName] = buildClubModel(modelName, r.character)); club.rotation.set(0, Math.PI / 2, 0); club.position.set(0, club.userData.soleFix || 0, 0);
      r.golfer.clubRoot.add(club); r.club = club; r.clubModel = modelName;
    }
    function remoteClubFor(clubName) { const c = CONFIG.clubs[clubName]; return c ? c.model : null; }
    function removeRemote(r) { scene.remove(r.golfer.root); scene.remove(r.ball); scene.remove(r.halo); r.tag.remove(); }
    const _rDown = new THREE.Vector3(0, -1, 0), _rDir = new THREE.Vector3();
    function poseRemote(g, angle, address) {
      if (!address) { g.armsRig.rotation.set(0, 0, 0); g.leftArm.rotation.set(0, 0, 0); g.rightArm.rotation.set(0, 0, 0); g.torso.rotation.set(0, 0, 0); g.head.rotation.set(0, 0, 0); g.leftLeg.rotation.x = 0; g.rightLeg.rotation.x = 0; g.clubRoot.visible = false; return; }
      g.clubRoot.visible = true; [g.leftArm, g.rightArm].forEach(arm => { _rDir.set(g.clubRoot.position.x - arm.position.x, g.clubRoot.position.y, g.clubRoot.position.z).normalize(); arm.quaternion.setFromUnitVectors(_rDown, _rDir); });
      g.armsRig.rotation.set(0, -angle * .18, -angle * .78); g.clubRoot.rotation.set(0, 0, -angle * .3); g.torso.rotation.set(-.2, -angle * .3, 0); g.head.rotation.set(-.32 + Math.max(0, angle) * .25, angle * .22, 0);
      g.leftLeg.rotation.x = CONFIG.animation.addressKneeBend; g.rightLeg.rotation.x = CONFIG.animation.addressKneeBend;
    }
    function placeRemoteAtBall(r, pos, address) {
      const pin = currentHole.pin; const a = Math.atan2(pin.x - pos.x, -(pin.z - pos.z)); const aim = new THREE.Vector3(Math.sin(a), 0, -Math.cos(a)); const toBall = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
      const back = address ? 0 : 2.2; const x = pos.x - toBall.x * (.5 + back) - aim.x * (.1 + back * .6), z = pos.z - toBall.z * (.5 + back) - aim.z * (.1 + back * .6);
      r.golfer.root.position.set(x, standingHeightAt(x, z), z); r.golfer.root.rotation.y = address ? -a - Math.PI / 2 : -a;
    }
    function remoteBallPos(p, index) {
      if (p.ball) return new THREE.Vector3(p.ball.x, p.ball.y, p.ball.z);
      const tee = surfaceInfoAt(0, CONFIG.world.teeZ); return new THREE.Vector3((index + 1) * .9, tee.height + ballRadius, CONFIG.world.teeZ + .4);
    }
    function updateRemotes(st) {
      const others = st.players.filter(p => p.id !== mp.myId); const keep = new Set(others.map(p => p.id));
      mp.remotes.forEach((r, id) => { if (!keep.has(id)) { removeRemote(r); mp.remotes.delete(id); } });
      others.forEach((p, i) => { const r = ensureRemote(p); r.tag.textContent = p.name; if (mp.replay && mp.replay.active && mp.replay.playerId === p.id) return;
        const pos = remoteBallPos(p, i); const gone = p.holed || p.left || (p.done && st.phase === 'playing'); r.ball.visible = !gone; r.halo.visible = !gone; r.golfer.root.visible = !p.left && !(p.done && st.phase === 'playing');
        r.ball.position.copy(pos); r.halo.position.set(pos.x, pos.y - ballRadius + .02, pos.z); const up = st.turnId === p.id && st.phase === 'playing'; if (up && currentHole) setRemoteClub(r, remoteClubFor(suggestClub(pos))); placeRemoteAtBall(r, pos, up); poseRemote(r.golfer, 0, up); });
    }
    function updateRemoteTags() {
      mp.remotes.forEach(r => { const g = r.golfer.root; if (!g.visible) { r.tag.hidden = true; return; } const v = g.position.clone(); v.y += 2.35; v.project(camera); r.tag.hidden = v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1; r.tag.style.left = `${(v.x * .5 + .5) * window.innerWidth}px`; r.tag.style.top = `${(-v.y * .5 + .5) * window.innerHeight}px`; });
    }
    // ---- watching someone else's shot ----
    const replayTracerTexture = tracerTexture.clone(); replayTracerTexture.needsUpdate = true;
    const replayTracer = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0xffffff, map: replayTracerTexture, transparent: true, depthWrite: false, side: THREE.DoubleSide })); replayTracer.frustumCulled = false; replayTracer.visible = false; scene.add(replayTracer);
    function startReplay(msg) {
      const p = mp.state && mpPlayer(msg.playerId); const pts = (msg.path || []).map(q => new THREE.Vector3(q[0], q[1], q[2])); if (!p || pts.length < 2) return;
      const r = ensureRemote(p); r.golfer.root.visible = true; r.ball.visible = true; r.halo.visible = false; setRemoteClub(r, remoteClubFor(msg.club) || remoteClubFor(suggestClub(pts[0])) || 'iron7'); placeRemoteAtBall(r, pts[0], true); r.ball.position.copy(pts[0]);
      const first = pts.find(q => q.distanceTo(pts[0]) > 1) || pts[1]; cameraState.flightDirection.set(first.x - pts[0].x, 0, first.z - pts[0].z).normalize();
      replayTracer.material.color.set(p.color); mp.replay = { active: true, club: msg.club, playerId: p.id, pts, t: 0, ball: r.ball, remote: r, velocity: new THREE.Vector3(), trail: [], swing: 0, hold: 0, holed: msg.holed, contact: false, landed: false };
      updateStatus(`${p.name} is hitting…`); if (mp.state) updateTurnBanner(mp.state);
    }
    function updateReplay(dt) {
      const R = mp.replay; if (!R) return;
      if (R.swing < .95) { R.swing += dt; const t = R.swing; const angle = t < .45 ? -1.6 * Math.sin(t / .45 * Math.PI / 2) : t < .62 ? -1.6 * (1 - ((t - .45) / .17) ** 2) : 1.1 * Math.min(1, (t - .62) / .3); poseRemote(R.remote.golfer, angle, true);
        if (!R.contact && t >= .62) { R.contact = true; audioEngine.clubHit(R.club === 'Putter' ? 'putt' : 'great'); } if (t < .62) return; }
      if (R.active) {
        R.t += dt; const f = R.t * 30; const i = Math.floor(f);
        if (i >= R.pts.length - 1) { R.ball.position.copy(R.pts[R.pts.length - 1]); R.velocity.set(0, 0, 0); R.hold += dt; if (R.holed) R.ball.visible = false;
          if (R.hold > 1.6) { R.active = false; replayTracer.visible = false; const p = mpPlayer(R.playerId); if (p) updateStatus(R.holed ? `${p.name} holed out!` : `${p.name}'s ball stopped`); if (mp.state) { updateRemotes(mp.state); updateTurnBanner(mp.state); } if (mp.pendingCard && mp.state) { mp.pendingCard = false; showMpScorecard(mp.state); } } }
        else { const a = R.pts[i], b = R.pts[i + 1]; R.ball.position.lerpVectors(a, b, f - i); R.velocity.subVectors(b, a).multiplyScalar(30);
          const ground = terrainHeightAt(R.ball.position.x, R.ball.position.z); if (R.ball.position.y - ground > .3) { if (!R.trail.length || R.trail[R.trail.length - 1].distanceTo(R.ball.position) > .4) R.trail.push(R.ball.position.clone()); } else if (!R.landed && R.trail.length > 5) { R.landed = true; audioEngine.landing(surfaceInfoAt(R.ball.position.x, R.ball.position.z).surface); } }
        if (R.trail.length > 2) { const len = ribbonGeometry(R.trail.concat([R.ball.position.clone()]), .3, replayTracer.geometry, .7); replayTracerTexture.repeat.set(1 / Math.max(.001, len), 1); replayTracer.visible = true; replayTracer.material.opacity = R.hold > 0 ? Math.max(0, 1 - R.hold / 1.6) : 1; }
      }
    }
    function mpTick(dt) {
      if (!mp.active) return; updateReplay(dt); updateRemoteTags();
      if (!mp.shotPending) return;
      if (ballState.inFlight) { mp.pathClock += dt; if (mp.pathClock >= 1 / 30 && mp.path.length < 900) { mp.pathClock = 0; const q = ballState.position; mp.path.push([+q.x.toFixed(2), +q.y.toFixed(2), +q.z.toFixed(2)]); } }
      const settled = !ballState.inFlight && !hazardSeq && !(cupDrop && !cupDrop.done) && !swingAnimation.active;
      if (!settled) return; mp.shotPending = false; const q = ballState.position; mp.path.push([+q.x.toFixed(2), +q.y.toFixed(2), +q.z.toFixed(2)]);
      mpPost('shot', mpAuth({ result: { x: q.x, y: q.y, z: q.z, surface: ballState.surface, strokes: holeTotal(), holed: ballState.holed, done: holeState.completed, club: mp.shotClub || currentClubName, path: mp.path } })).catch(e => updateStatus(e.message));
      if (holeState.completed) updateStatus(ballState.holed ? `In the hole in ${holeTotal()}! Waiting for the others to finish` : 'Hole finished · waiting for the others');
    }

    // ---- character previews on the sign-in screen ----
    const previewScenes = [];
    // Character select: each golfer stands on a patch of tee grass in front of a soft sky and tree line,
    // lit from the front. Idle: leaning on the driver. The picked golfer takes practice swings.
    function previewBackdrop() {
      const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d'); const grad = g.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#7cc4f0'); grad.addColorStop(.55, '#cfeaf9'); grad.addColorStop(1, '#eef8e6'); g.fillStyle = grad; g.fillRect(0, 0, 4, 256);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    function softDiscTexture(inner, outer) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, inner); grad.addColorStop(.6, inner); grad.addColorStop(1, outer); g.fillStyle = grad; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
    }
    function holdPreviewClub(p, mode) {
      if (p.mode === mode) return; p.mode = mode;
      if (mode === 'idle') { p.g.carryHolder.add(p.club); p.club.rotation.set(0, 0, p.lean); p.club.position.set(0, .02, 0); }
      else { p.g.clubRoot.add(p.club); p.club.rotation.set(0, Math.PI / 2, 0); p.club.position.set(0, p.club.userData.soleFix || 0, 0); }
    }
    function idlePreviewPose(p, t) {
      const g = p.g; holdPreviewClub(p, 'idle'); const breathe = Math.sin(t * 1.6) * .02;
      g.armsRig.rotation.set(0, 0, 0); g.torso.rotation.set(breathe, 0, 0); g.head.rotation.set(-.05 + breathe, Math.sin(t * .7) * .12, 0);
      g.leftLeg.rotation.x = 0; g.rightLeg.rotation.x = 0; g.leftArm.rotation.set(.05, 0, .12); g.rightArm.rotation.set(0, 0, p.armOut);
    }
    const PREVIEW_SWING = { every: 5, backStart: .25, top: 1.05, impact: 1.3, finish: 1.75, hold: 2.5 };
    function previewSwingAngle(u) {
      const P = PREVIEW_SWING; const ease = x => x * x * (3 - 2 * x);
      if (u < P.backStart) return 0; if (u < P.top) return -1.65 * ease((u - P.backStart) / (P.top - P.backStart));
      if (u < P.impact) { const k = (u - P.top) / (P.impact - P.top); return -1.65 * (1 - k * k); }
      if (u < P.finish) return 1.15 * ease((u - P.impact) / (P.finish - P.impact)); return 1.15;
    }
    function setupCharacterPreviews() {
      document.querySelectorAll('.char-card').forEach((card, index) => {
        const type = card.dataset.character; const canvas = card.querySelector('canvas'); let r;
        try { r = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { return; }
        r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(400, 360, false); r.outputColorSpace = THREE.SRGBColorSpace;
        const sc = new THREE.Scene(); sc.background = previewBackdrop(); sc.fog = new THREE.Fog(0xdff1f7, 5, 13);
        // front key light so faces read clearly, a cool fill from the other side, and a warm rim from behind
        sc.add(new THREE.HemisphereLight(0xffffff, 0x7fae62, 1.25));
        const key = new THREE.DirectionalLight(0xfff4e0, 2.4); key.position.set(-1.6, 2.6, -3.2); sc.add(key);
        const fill = new THREE.DirectionalLight(0xdbeeff, .8); fill.position.set(2.5, 1.2, -1.5); sc.add(fill);
        const rim = new THREE.DirectionalLight(0xfff0c8, 1.1); rim.position.set(0, 2.5, 3); sc.add(rim);
        // grass, a tee patch with a soft shadow, and a blurred tree line
        const grass = new THREE.Mesh(new THREE.CircleGeometry(14, 48), new THREE.MeshLambertMaterial({ color: 0x74bf57 })); grass.rotation.x = -Math.PI / 2; sc.add(grass);
        const tee = new THREE.Mesh(new THREE.CircleGeometry(.95, 48), new THREE.MeshBasicMaterial({ map: softDiscTexture('rgba(150,214,110,1)', 'rgba(150,214,110,0)'), transparent: true, depthWrite: false })); tee.rotation.x = -Math.PI / 2; tee.position.y = .004; sc.add(tee);
        const shade = new THREE.Mesh(new THREE.CircleGeometry(.5, 32), new THREE.MeshBasicMaterial({ map: softDiscTexture('rgba(20,50,20,.35)', 'rgba(20,50,20,0)'), transparent: true, depthWrite: false })); shade.rotation.x = -Math.PI / 2; shade.position.set(.08, .008, .06); shade.scale.set(1.1, .8, 1); sc.add(shade);
        const treeMat = new THREE.MeshLambertMaterial({ color: 0x3f9d49 }); const treeMat2 = new THREE.MeshLambertMaterial({ color: 0x2e8040 });
        for (let i = 0; i < 16; i += 1) { const blob = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), i % 2 ? treeMat : treeMat2); const s = .9 + random01(i * 7 + index) * .8; blob.scale.set(s, s * 1.1, s); blob.position.set(-7 + i * .95 + random01(i * 3) * .4, .9 + random01(i * 5) * .7, 6.5 + random01(i * 11) * 1.5); sc.add(blob); }
        const g = buildGolfer(type); g.shadow.visible = false; g.root.rotation.y = type === 'girl' ? .32 : -.32; sc.add(g.root);
        const club = GolfClubs.createClub('driver', { headScale: 2.2, length: .96, flatSole: true, edition: clubEdition(type) });
        club.updateMatrixWorld(true); club.userData.soleFix = -CONFIG.clubModel.lengthToGround - new THREE.Box3().setFromObject(club.userData.head).min.y;
        const cam = new THREE.PerspectiveCamera(28, 400 / 360, .1, 30); cam.position.set(0, 1.02, -5); cam.lookAt(0, .98, 0);
        const p = { r, sc, cam, g, card, club, mode: null, lean: .42, armOut: .16, swingT: -1, nextSwing: 1.2 + index * .6 };
        holdPreviewClub(p, 'idle'); previewScenes.push(p);
      });
      let last = performance.now();
      const loop = now => {
        const dt = Math.min(.05, (now - last) / 1000); last = now; const t = now / 1000;
        if (!$('main-menu').hidden) previewScenes.forEach(p => {
          const picked = p.card.getAttribute('aria-checked') === 'true';
          if (picked) { p.nextSwing -= dt; if (p.swingT < 0 && p.nextSwing <= 0) p.swingT = 0; }
          if (p.swingT >= 0) { p.swingT += dt; holdPreviewClub(p, 'swing'); poseRemote(p.g, previewSwingAngle(p.swingT), true); if (p.swingT >= PREVIEW_SWING.hold) { p.swingT = -1; p.nextSwing = PREVIEW_SWING.every; } }
          else idlePreviewPose(p, t);
          p.r.render(p.sc, p.cam);
        });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
    function playPreviewSwing(type) { const p = previewScenes.find(q => q.card.dataset.character === type); if (p && p.swingT < 0) { p.swingT = 0; } }
    function selectCharacter(type) {
      settings.character = type === 'girl' ? 'girl' : 'boy'; applySettings(); document.querySelectorAll('.char-card').forEach(c => c.setAttribute('aria-checked', String(c.dataset.character === settings.character)));
      swapGolfer(settings.character); if (previewScenes.length) playPreviewSwing(settings.character); if (mp.active && mp.state && mp.state.phase === 'lobby') mpPost('character', mpAuth({ character: settings.character })).catch(() => {});
    }
    function queueTip(id, text) {
      if (tutorial.active || touchMode) return;
      if (id === 'swing' || id === 'aim' || id === 'walk') return; // the key line at the bottom already says this; no pop-up on top of it
      if (id === 'putt') text = 'On the green, let go at the dashed line on the power bar. The dots flow downhill, so aim a little uphill.';
      if (onboarding.seen.has(id) || onboarding.queue.some(tip => tip.id === id) || onboarding.active?.id === id) return;
      onboarding.queue.push({ id, text }); if (!onboarding.active) showNextTip();
    }
    function showNextTip() {
      if (!onboarding.queue.length || gameFlow.mode !== 'playing') return;
      onboarding.active = onboarding.queue.shift(); onboarding.timer = CONFIG.onboarding.tipDuration; onboarding.seen.add(onboarding.active.id); writeStoredJSON(CONFIG.storage.tipsKey, Array.from(onboarding.seen)); $('tip-text').textContent = onboarding.active.text; $('tip-toast').classList.add('show');
    }
    function updateOnboarding(dt) {
      if (!onboarding.active) { if (onboarding.queue.length && gameFlow.mode === 'playing') showNextTip(); return; }
      if (gameFlow.mode !== 'playing') return; onboarding.timer -= dt;
      if (onboarding.timer <= 0) { $('tip-toast').classList.remove('show'); onboarding.active = null; if (onboarding.queue.length) window.setTimeout(showNextTip, 220); }
    }

    function rerollWind(silent = false) {
      wind.mph = THREE.MathUtils.randFloat(CONFIG.wind.minMph, CONFIG.wind.maxMph); wind.angle = Math.random() * Math.PI * 2; wind.vector.set(Math.sin(wind.angle), 0, -Math.cos(wind.angle)).multiplyScalar(wind.mph * CONFIG.wind.mphToMetersPerSecond); if (!silent) updateStatus(`Wind rerolled — ${wind.mph.toFixed(0)} mph`); updateHud();
    }

    function swingSweetWidth() { return CONFIG.swing.sweetSpotWidth / (1 + Math.max(0, swing.power - 1) * CONFIG.swing.overswingAccuracyPenalty); }
    function shotResultForAccuracy(club, accuracy) {
      const error = accuracy - CONFIG.swing.sweetSpotCenter; const perfectLimit = swingSweetWidth() * CONFIG.shotQuality.perfectWidthMultiplier; let label = club.putter ? 'Smooth stroke' : 'Pure!'; let type = 'perfect'; let powerMultiplier = 1; let launchAngleMultiplier = 1; let spinMultiplier = 1; let groundRoll = Boolean(club.putter);
      if (Math.abs(error) > perfectLimit) {
        if (Math.abs(error) <= perfectLimit * CONFIG.shotQuality.niceWidthMultiplier) { label = club.putter ? 'Good roll' : 'Great strike'; type = 'nice'; }
        else if (error >= CONFIG.shotQuality.toppedError && !club.putter) { label = 'Topped it'; type = 'topped'; powerMultiplier = CONFIG.shotQuality.toppedPowerMultiplier; spinMultiplier = CONFIG.shotQuality.toppedSpinMultiplier; groundRoll = true; }
        else if (error <= -CONFIG.shotQuality.fatError && !club.putter) { label = 'Chunked it'; type = 'fat'; powerMultiplier = CONFIG.shotQuality.fatPowerMultiplier; launchAngleMultiplier = CONFIG.shotQuality.fatLaunchAngleMultiplier; spinMultiplier = CONFIG.shotQuality.fatSpinMultiplier; }
        else if (error > 0) { const mild = Math.abs(error) <= swingSweetWidth() / 2 + .06; label = club.putter ? 'Pulled it' : mild ? 'Pulled left' : 'Hook!'; type = 'hook'; }
        else { const mild = Math.abs(error) <= swingSweetWidth() / 2 + .06; label = club.putter ? 'Pushed it' : mild ? 'Pushed right' : 'Slice!'; type = 'slice'; }
      }
      const normalizedError = error >= 0 ? error / Math.max(.001, 1 - CONFIG.swing.sweetSpotCenter) : error / CONFIG.swing.sweetSpotCenter;
      let sidespin = -THREE.MathUtils.clamp(normalizedError, -1, 1) * club.mishitSidespinRpm * spinMultiplier;
      if (type === 'perfect' || club.putter) sidespin = 0;
      else if (Math.abs(error) <= swingSweetWidth() / 2) sidespin *= .35;
      if (CONFIG.debug.enabled && CONFIG.debug.allowSpinKeys) sidespin += requestedSideSpin * CONFIG.spin.sidespinMaxRpm;
      return { label, type, powerMultiplier, launchAngleMultiplier, sidespinRpm: THREE.MathUtils.clamp(sidespin, -CONFIG.spin.sidespinMaxRpm, CONFIG.spin.sidespinMaxRpm), groundRoll };
    }

    function resetSwingMeter() { swing.phase = 'ready'; swing.value = 0; swing.direction = 1; swing.power = 0; swing.accuracy = 0; swing.holdActive = false; updateSwingMeterUI(); }
    function beginSwingHold() { if (hazardSeq) return; if (!mpMyTurn()) { updateStatus(mpWaitText()); return; } if (gameFlow.mode !== 'playing' || !addressing || ballState.inFlight || swingAnimation.active || ballState.holed || holeState.completed) return; audioEngine.ensure(); if (swing.phase === 'accuracy') { completeAccuracyClick(); return; } if (swing.phase !== 'ready') return; swing.phase = 'power'; swing.value = 0; swing.direction = 1; swing.holdActive = true; queueTip('swing', 'Hold the mouse or Space for power. Release, then click the gold accuracy zone.'); updateStatus(currentClub().putter ? 'Hold to pull the putter back' : 'Hold to swing back — release to set power'); updateSwingMeterUI(); }
    function releaseSwingHold() { if (!swing.holdActive || swing.phase !== 'power') return; swing.holdActive = false; swing.power = THREE.MathUtils.clamp(swing.value, 0, CONFIG.swing.powerMax); swing.phase = 'accuracy'; swing.value = 1; swing.direction = -1; updateStatus('Accuracy marker bouncing — strike when it’s in the gold zone'); updateSwingMeterUI(); }
    function completeAccuracyClick() { if (gameFlow.mode !== 'playing' || !addressing || ballState.inFlight || swingAnimation.active || swing.phase !== 'accuracy') return; swing.accuracy = THREE.MathUtils.clamp(swing.value, 0, 1); const shotQuality = shotResultForAccuracy(currentClub(), swing.accuracy); swing.phase = 'swinging'; swing.value = 0; swingAnimation = { active: true, time: 0, power: swing.power, sidespinRpm: shotQuality.sidespinRpm, contactTriggered: false, shotQuality, direction: aimDirection() }; updateStatus(`${shotQuality.label} — downswing to contact`); updateSwingMeterUI(); updateAddressPrompt(); swingHitFlash(TIER[shotQuality.type] || 'ok'); }
    // the meter itself reacts to the strike: gold glow for pure, green for great, a shake for a miss
    function swingHitFlash(tier) { const h = $('swing-hud'); h.classList.remove('hit-pure', 'hit-great', 'hit-miss', 'hit-bad', 'hit-ok'); void h.offsetWidth; h.classList.add('hit-' + tier); clearTimeout(swingHitFlash.t); swingHitFlash.t = setTimeout(() => h.classList.remove('hit-' + tier), 1100); }
    // Where to let go of the power bar to reach the flag (ignores wind and slope, so it's a guide)
    function flagPowerRatio() {
      if (!addressing || !currentHole) return null; const club = currentClub(); const lie = surfaceInfoAt(ballState.position.x, ballState.position.z).surface;
      const d = Math.hypot(ballState.position.x - currentHole.pin.x, ballState.position.z - currentHole.pin.z);
      const reach = club.putter ? putterRangeMeters() : (club.maxDistanceMeters + club.maxRollMeters * .6) * distanceMultiplierForLie(club, lie) ** 2;
      const playsLike = club.putter ? puttPlaysLikeMeters() : d;
      const power = club.putter ? (playsLike + CONFIG.putting.aimPastCupMeters) / reach : d / reach; return power <= CONFIG.swing.powerMax ? power / CONFIG.swing.powerMax : null;
    }
    function updateSwingMeter(dt) {
      if (swing.phase === 'power' && swing.holdActive) {
        const speed = currentClub().putter ? CONFIG.swing.putterMeterSpeed : CONFIG.swing.meterSpeed;
        if (currentClub().putter) swing.value = Math.min(CONFIG.swing.powerMax, swing.value + speed * dt);
        else { swing.value += swing.direction * speed * dt; if (swing.value >= CONFIG.swing.powerMax) { swing.value = CONFIG.swing.powerMax; swing.direction = -1; } if (swing.value <= 0) { swing.value = 0; swing.direction = 1; } }
      } else if (swing.phase === 'accuracy') { swing.value += swing.direction * CONFIG.swing.accuracySpeed * dt; if (swing.value <= 0) { swing.value = 0; swing.direction = 1; } if (swing.value >= 1) { swing.value = 1; swing.direction = -1; } } // the accuracy marker bounces until you strike
      updateSwingMeterUI(); const target = flagPowerRatio(); const marker = $('power-target'); if (target === null || swing.phase === 'accuracy') marker.style.display = 'none'; else { marker.style.display = 'block'; marker.style.bottom = `${target * 100}%`; }
    }
    function updateSwingMeterUI() {
      const show = addressing || swingAnimation.active; $('swing-hud').hidden = !show; document.body.classList.toggle('swinging', show && CONFIG.ui.dockSwingMeter);
      const putting = show && currentClub().putter; $('swing-title').textContent = putting ? 'PUTT' : 'SWING'; $('putt-readout').hidden = !putting;
      if (putting) { // live distance for the putt, in the same 'plays like' feet as the flag
        const reach = putterRangeMeters(); const pw = swing.phase === 'power' ? swing.value : (swing.power || 0); const rolls = Math.max(0, pw * reach - CONFIG.putting.aimPastCupMeters) * 3.281; const flag = puttPlaysLikeMeters() * 3.281;
        $('putt-now').textContent = pw > 0 ? `${Math.round(rolls)} ft` : '—'; $('putt-flag').textContent = `${Math.round(flag)} ft`; $('putt-readout').classList.toggle('close', pw > 0 && Math.abs(rolls - flag) <= Math.max(1, flag * .08)); }
      const powerRatio = THREE.MathUtils.clamp((swing.phase === 'power' ? swing.value : swing.power) / CONFIG.swing.powerMax, 0, 1); const accuracyRatio = swing.phase === 'accuracy' ? swing.value : swing.accuracy;
      $('power-fill').style.height = `${powerRatio * 100}%`; $('power-marker').style.bottom = `${powerRatio * 100}%`; $('accuracy-marker').style.top = `${(1 - THREE.MathUtils.clamp(accuracyRatio, 0, 1)) * 100}%`;
      const width = swingSweetWidth(); $('accuracy-sweet-zone').style.top = `${(1 - CONFIG.swing.sweetSpotCenter - width / 2) * 100}%`; $('accuracy-sweet-zone').style.height = `${width * 100}%`;
      $('power-value').textContent = swing.phase === 'power' || swing.power ? `${Math.round(powerRatio * 100)}%` : '0%'; $('accuracy-value').textContent = swing.phase === 'accuracy' || swing.accuracy ? `${Math.round(accuracyRatio * 100)}%` : '—'; $('swing-phase').textContent = swing.phase === 'ready' ? 'Ready' : swing.phase === 'power' ? 'Power' : swing.phase === 'accuracy' ? 'Accuracy' : 'Contact'; $('swing-instruction').textContent = swing.phase === 'ready' ? (touchMode ? 'Hold SWING to swing back' : '') : swing.phase === 'power' ? 'Release to set power' : swing.phase === 'accuracy' ? 'Click when the marker is in the gold zone' : 'Club is moving to the ball';
    }
    function updateClubButtons() { document.querySelectorAll('.club-button').forEach(button => { button.classList.toggle('selected', button.dataset.club === currentClubName); button.classList.toggle('suggested', button.dataset.club === suggestedClubName); button.classList.toggle('locked', CONFIG.hazards.sandOnlyWedge && !CONFIG.clubs[button.dataset.club].sandWedge && ballInSand()); }); }
    function buildClubButtons() { const wrap = $('club-buttons'); Object.entries(CONFIG.clubs).forEach(([name, club]) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'club-button'; button.dataset.club = name; button.innerHTML = `<kbd>${club.key}</kbd><strong>${name}</strong><span>${Math.round(metersToYards(club.maxDistanceMeters))} yd</span>`; wrap.appendChild(button); }); updateClubButtons(); }
    // Coach pick: the club that fits this shot best, from the distance to the flag and the lie
    let suggestedClubName = null;
    function suggestClub(at = ballState.position) {
      const cfg = CONFIG.clubSuggestion; const lie = surfaceInfoAt(at.x, at.z).surface;
      const distance = Math.hypot(at.x - currentHole.pin.x, at.z - currentHole.pin.z);
      const entries = Object.entries(CONFIG.clubs); const putter = entries.find(([, c]) => c.putter)[0];
      if (lie === 'green' || (lie === 'fringe' && distance <= cfg.fringePuttMeters)) return putter;
      if (lie === 'sand') return entries.find(([, c]) => c.sandWedge)[0];
      const full = entries.filter(([, c]) => !c.putter && (!c.teeOnlySuggestion || lie === 'tee')).sort((a, b) => a[1].maxDistanceMeters - b[1].maxDistanceMeters);
      const lieFactor = distanceMultiplierForLie(full[0][1], lie) ** 2;
      for (const [name, c] of full) if ((c.maxDistanceMeters + c.maxRollMeters * .5) * lieFactor * cfg.powerHeadroom >= distance) return name;
      return full[full.length - 1][0];
    }
    function refreshSuggestion() {
      if (!CONFIG.clubSuggestion.enabled || !currentHole || ballState.inFlight || ballState.holed || holeState.completed) { suggestedClubName = null; updateClubButtons(); return; }
      suggestedClubName = suggestClub(); updateClubButtons();
    }
    function applySuggestedClub() {
      refreshSuggestion(); if (!suggestedClubName) return;
      const distanceYards = Math.round(metersToYards(Math.hypot(ballState.position.x - currentHole.pin.x, ballState.position.z - currentHole.pin.z)));
      const club = CONFIG.clubs[suggestedClubName];
      if (settings.autoClub && suggestedClubName !== currentClubName) { selectClub(suggestedClubName); updateStatus(`Coach pick: ${suggestedClubName} · ${distanceYards} yd to the flag`); }
      else if (suggestedClubName === currentClubName) updateStatus(`Coach pick: ${suggestedClubName} · ${distanceYards} yd to the flag`);
      else updateStatus(`Coach suggests the ${suggestedClubName} (press ${club.key}) · ${distanceYards} yd to the flag`);
    }
    function ballInSand() { return !!currentHole && !ballState.inFlight && surfaceInfoAt(ballState.position.x, ballState.position.z).surface === 'sand'; }
    function sandWedgeName() { return Object.keys(CONFIG.clubs).find(n => CONFIG.clubs[n].sandWedge); }
    function selectClub(name) { if (CONFIG.hazards.sandOnlyWedge && CONFIG.clubs[name] && !CONFIG.clubs[name].sandWedge && ballInSand()) { updateStatus(`In a bunker you need the ${sandWedgeName()} · only a high-loft club can get the ball out`); const b = document.querySelector(`.club-button[data-club="${name}"]`); if (b) { b.classList.remove('denied'); void b.offsetWidth; b.classList.add('denied'); } return; }
      if (gameFlow.mode !== 'playing' || !CONFIG.clubs[name] || ballState.inFlight || swingAnimation.active || holeState.completed) return; currentClubName = name; previewClock = 1; updateClubVisual(); resetSwingMeter(); updateClubButtons(); updateStatus(`${name} selected — aim, then hold to swing`); updateHud(); }

    function ballDistanceToGolfer() { return Math.hypot(golfer.root.position.x - ballState.position.x, golfer.root.position.z - ballState.position.z); }
    // Real golf stance: the golfer stands beside the ball, facing it, with the target on their left
    function stanceYaw() { return -aimAngleRadians - Math.PI / 2; }
    function approachBallPosition() {
      const aim = aimDirection(); const toBall = new THREE.Vector3(Math.cos(aimAngleRadians), 0, Math.sin(aimAngleRadians)); const st = CONFIG.character.stance;
      const x = ballState.position.x - toBall.x * st.ballForward - aim.x * st.ballTowardTarget, z = ballState.position.z - toBall.z * st.ballForward - aim.z * st.ballTowardTarget;
      golfer.root.position.set(x, standingHeightAt(x, z), z); golfer.root.rotation.y = stanceYaw(); updateClubSoleOffset();
    }
    function syncGolferAim() { if (addressing || swingAnimation.active) approachBallPosition(); else golfer.root.rotation.y = -aimAngleRadians; }
    function enterAddressMode() { if (hazardSeq) return; if (!mpMyTurn()) { updateStatus(mpWaitText()); return; } if (gameFlow.mode !== 'playing' || ballState.inFlight || swingAnimation.active || ballState.holed || holeState.completed) return; if (ballDistanceToGolfer() > CONFIG.character.addressDistance) { updateStatus('Walk closer to the ball first'); return; } addressing = true; movement.moving = false; movement.velocity.set(0, 0, 0); if (CONFIG.aim.autoAimAtPin) aimAtPin(); approachBallPosition(); resetSwingMeter(); queueTip('aim', 'You start aimed at the flag. Hold A/D or move the mouse to adjust. The circle shows the expected landing area.'); updateStatus('Aimed at the flag — adjust if you like, then hold to swing'); applySuggestedClub(); if (CONFIG.hazards.sandOnlyWedge && ballInSand() && !currentClub().sandWedge) { currentClubName = sandWedgeName(); updateClubVisual(); resetSwingMeter(); updateClubButtons(); } if (ballInSand()) updateStatus(`Bunker! Splash it out with the ${sandWedgeName()} · swing a little harder than the distance`); updateAddressPrompt(); }
    function leaveAddressMode() { if (!addressing || swingAnimation.active) return; addressing = false; resetSwingMeter(); updateStatus('Walking mode — move to the ball and press E near it'); updateAddressPrompt(); }
    function teleportGolferToBall() { if (!CONFIG.debug.enabled || !CONFIG.character.allowTeleport || ballState.inFlight || swingAnimation.active || ballState.holed || holeState.completed) return; approachBallPosition(); addressing = false; resetSwingMeter(); updateStatus('Teleported near the ball — press E to address'); updateAddressPrompt(); }
    // one short "what now" line at the bottom, with real key caps and a mouse drawing instead of long sentences
    function setHint(html) { const el = $('hint'); if (el.dataset.html !== html) { el.dataset.html = html; el.innerHTML = html; } }
    function updateAddressPrompt() {
      if (gameFlow.mode === 'flyover') return setHint(''); // the flyover has its own skip note
      if (gameFlow.mode === 'intro') return setHint('Any key to start');
      if (gameComplete) return setHint('Round complete');
      if (holeState.completed) return setHint(`${K('Enter')} next hole`);
      if (swingAnimation.active) return setHint('Swinging…');
      if (addressing) return setHint(swing.phase === 'ready' ? `${K('A', 'D')} aim · hold ${K('Space')} or ${M('left')} swing · ${K('E')} step away` : ''); // mid-swing the meter itself says what to do
      const nearby = !ballState.inFlight && ballDistanceToGolfer() <= CONFIG.character.addressDistance;
      setHint(nearby ? `${K('E')} set up to hit` : `${K('W', 'A', 'S', 'D')} walk · ${K('F')} go to your ball`);
    }
    function dampAngle(current, target, amount) { const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current)); return current + difference * THREE.MathUtils.clamp(amount, 0, 1); }
    // Walking is relative to the camera: W always goes where the camera looks.
    // Speed ramps up and down smoothly, and the golfer slides along water, stakes and tree trunks.
    function walkBlocked(x, z) {
      const surface = surfaceInfoAt(x, z).surface; if (surface === 'water' || surface === 'outOfBounds') return surface;
      for (const tree of courseRuntime.treeColliders) if (Math.hypot(x - tree.x, z - tree.z) < CONFIG.character.trunkRadius) return 'tree';
      return null;
    }
    function updateMovement(dt) {
      if (addressing || swingAnimation.active || ballState.holed || holeState.completed) { movement.velocity.set(0, 0, 0); movement.moving = false; return; }
      const horizontal = (movement.keys.d ? 1 : 0) - (movement.keys.a ? 1 : 0); const forwardInput = (movement.keys.w ? 1 : 0) - (movement.keys.s ? 1 : 0); const length = Math.hypot(horizontal, forwardInput);
      const yaw = cameraState.yaw; const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)); const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const speed = movement.keys.shift ? CONFIG.character.jogSpeed : CONFIG.character.walkSpeed;
      const desired = length ? forward.multiplyScalar(forwardInput / length).addScaledVector(right, horizontal / length).multiplyScalar(speed) : new THREE.Vector3();
      const rate = length ? CONFIG.character.acceleration : CONFIG.character.deceleration; movement.velocity.lerp(desired, 1 - Math.exp(-rate * dt));
      if (!length && movement.velocity.lengthSq() < .0025) movement.velocity.set(0, 0, 0);
      const bounds = currentHole.bounds; const pos = golfer.root.position;
      const nextX = THREE.MathUtils.clamp(pos.x + movement.velocity.x * dt, bounds.minX, bounds.maxX); const nextZ = THREE.MathUtils.clamp(pos.z + movement.velocity.z * dt, bounds.minZ, bounds.maxZ);
      let blocked = walkBlocked(nextX, nextZ);
      if (!blocked) { pos.x = nextX; pos.z = nextZ; }
      else if (!walkBlocked(nextX, pos.z)) { pos.x = nextX; movement.velocity.z *= .3; }
      else if (!walkBlocked(pos.x, nextZ)) { pos.z = nextZ; movement.velocity.x *= .3; }
      else movement.velocity.multiplyScalar(.2);
      if (blocked && blocked !== 'tree' && movement.blockedMessageTime <= 0) { updateStatus(blocked === 'water' ? 'Water hazard — the golfer cannot walk into the water' : 'Out of bounds — stay inside the white stakes'); movement.blockedMessageTime = .8; }
      movement.blockedMessageTime -= dt; setGolferGroundHeight();
      const moveSpeed = Math.hypot(movement.velocity.x, movement.velocity.z);
      if (moveSpeed > .25) golfer.root.rotation.y = dampAngle(golfer.root.rotation.y, Math.atan2(-movement.velocity.x, -movement.velocity.z), CONFIG.character.turnSmoothness * dt);
      movement.moving = moveSpeed > .25; if (movement.moving) movement.walkPhase += dt * CONFIG.animation.walkCycleSpeed * (moveSpeed / CONFIG.character.walkSpeed) * .85;
    }
    // Camera yaw: follows the aim while addressing; while walking, arrows or right-drag orbit it,
    // and it gently swings behind the golfer when walking straight ahead.
    function updateCameraYaw(dt) {
      const follow = addressing || swingAnimation.active;
      if (follow) { cameraState.yaw = dampAngle(cameraState.yaw, -aimAngleRadians, 1 - Math.exp(-CONFIG.camera.yawSmoothness * dt)); return; }
      const orbit = (movement.keys.arrowright ? 1 : 0) - (movement.keys.arrowleft ? 1 : 0);
      if (orbit) cameraState.yaw -= orbit * THREE.MathUtils.degToRad(CONFIG.camera.keyOrbitSpeedDegrees) * settings.cameraSensitivity * dt;
      const straight = movement.keys.w && !movement.keys.a && !movement.keys.d && !orbit;
      if (straight && movement.moving) cameraState.yaw = dampAngle(cameraState.yaw, golfer.root.rotation.y, 1 - Math.exp(-CONFIG.camera.autoFollowRate * dt));
    }
    // Hold A/D or the arrows to turn the aim smoothly (hold Shift for fine aim)
    function updateAimKeys(dt) {
      if (!addressing || swing.phase !== 'ready' || ballState.inFlight || swingAnimation.active) return;
      const turn = ((movement.keys.d || movement.keys.arrowright) ? 1 : 0) - ((movement.keys.a || movement.keys.arrowleft) ? 1 : 0); if (!turn) return;
      const speedDegrees = movement.keys.shift || currentClub().putter ? CONFIG.aim.fineTurnSpeedDegrees : CONFIG.aim.turnSpeedDegrees;
      aimAngleRadians = wrapAngle(aimAngleRadians + THREE.MathUtils.degToRad(speedDegrees * settings.cameraSensitivity) * turn * dt); previewClock = 1; syncGolferAim();
      movement.aimHudTimer -= dt; if (movement.aimHudTimer <= 0) { movement.aimHudTimer = .12; updateStatus(`Aim ${Math.round(THREE.MathUtils.radToDeg(aimAngleRadians - angleToPin()))}° from the flag`); updateHud(); }
    }
    function wrapAngle(angle) { return Math.atan2(Math.sin(angle), Math.cos(angle)); }
    function angleToPin() { const pin = currentHole.pin; return Math.atan2(pin.x - ballState.position.x, -(pin.z - ballState.position.z)); }
    function aimAtPin() { aimAngleRadians = angleToPin(); previewClock = 1; }
    // F: quick trip to the ball, already set up and aimed at the flag
    // computers: once the ball has stopped, a big "press F" reminder shows after 5 seconds, or straight away if a key is pressed that does nothing yet
    const fNudge = { t: 0, keyed: false };
    function fNudgeWanted() { return !touchMode && gameFlow.mode === 'playing' && !addressing && !ballState.inFlight && !swingAnimation.active && !ballState.holed && !holeState.completed && !hazardSeq && !(typeof cupDrop !== 'undefined' && cupDrop) && mpMyTurn() && !tutorial.active && !teleportLesson.active && holeTotal() > 0 && ballDistanceToGolfer() > CONFIG.character.addressDistance + 2; }
    function updateFNudge(dt) {
      const want = fNudgeWanted(); if (!want) { fNudge.t = 0; fNudge.keyed = false; } else fNudge.t += dt;
      const show = want && (fNudge.t >= 5 || fNudge.keyed); const el = $('f-nudge'); if (el.hidden === show) el.hidden = !show;
    }
    function goToBall() {
      if (hazardSeq || gameFlow.mode !== 'playing' || ballState.inFlight || swingAnimation.active || ballState.holed || holeState.completed || addressing) return;
      markTeleportTaught(); const fade = $('go-fade'); fade.classList.add('on');
      setTimeout(() => { if (CONFIG.aim.autoAimAtPin) aimAtPin(); approachBallPosition(); movement.velocity.set(0, 0, 0); cameraState.yaw = -aimAngleRadians; enterAddressMode(); fade.classList.remove('on'); }, CONFIG.character.goToBallFadeSeconds * 1000);
    }
    function applyWalkingPose() { holdClub('carry'); const wave = movement.moving ? Math.sin(movement.walkPhase) : 0; golfer.leftLeg.rotation.x = wave * CONFIG.animation.walkLegSwing; golfer.rightLeg.rotation.x = -wave * CONFIG.animation.walkLegSwing; golfer.armsRig.rotation.set(0, 0, 0); golfer.leftArm.rotation.set(-wave * CONFIG.animation.walkArmSwing, 0, 0); golfer.rightArm.rotation.set(wave * CONFIG.animation.walkArmSwing * .5 - .15, 0, 0); golfer.torso.rotation.set(0, 0, 0); golfer.head.rotation.set(0, 0, 0); setGolferGroundHeight(); }
    function applyAddressPose(backAmount = 0, dt = 1 / 60) { const club = currentClub(); const maxBack = club.putter ? CONFIG.animation.putterBackswingMax : CONFIG.animation.backswingMax; const target = -maxBack * THREE.MathUtils.clamp(backAmount, 0, 1); const current = golfer.poseAngle === undefined ? target : golfer.poseAngle; applySwingPose(THREE.MathUtils.damp(current, target, CONFIG.animation.poseSmoothing, dt)); }
    // angle < 0 = backswing, 0 = at the ball, > 0 = follow-through. Arms and club swing together from the shoulders.
    function applySwingPose(angle) {
      holdClub('swing'); const club = currentClub(); golfer.poseAngle = angle; const held = clubModels[clubKey(club.model)]; if (held && held.parent === golfer.clubRoot) held.position.y = (golfer.clubSoleOffset || 0) + (held.userData.soleFix || 0);
      pointArmAtHands(golfer.leftArm); pointArmAtHands(golfer.rightArm);
      golfer.armsRig.rotation.set(0, -angle * (club.putter ? .04 : .18), -angle * (club.putter ? .9 : .78));
      golfer.clubRoot.rotation.set(0, 0, -angle * (club.putter ? .1 : .3));
      golfer.leftLeg.rotation.x = CONFIG.animation.addressKneeBend; golfer.rightLeg.rotation.x = CONFIG.animation.addressKneeBend;
      golfer.torso.rotation.set(-.2, -angle * (club.putter ? .08 : .3), 0); golfer.head.rotation.set(-.32 + Math.max(0, angle) * .25, angle * (club.putter ? .05 : .22), 0); setGolferGroundHeight();
    }
    function updateSwingAnimation(dt) {
      if (!swingAnimation.active) return;
      const A = CONFIG.animation; const club = currentClub(); swingAnimation.time += dt; const t = swingAnimation.time;
      if (swingAnimation.startAngle === undefined) { const maxBack = club.putter ? A.putterBackswingMax : A.backswingMax; const planned = -maxBack * THREE.MathUtils.clamp(swingAnimation.power / CONFIG.swing.powerMax, 0, 1); swingAnimation.startAngle = Math.min(-.05, golfer.poseAngle !== undefined ? golfer.poseAngle : planned); swingAnimation.lastAngle = swingAnimation.startAngle; }
      const b = swingAnimation.startAngle; let angle, endTime;
      if (club.putter) {
        // pendulum stroke: smooth back-and-through, follow-through matches the backstroke
        const through = Math.min(A.putterFollowThroughAngle * 1.5, Math.abs(b) * A.putterFollowRatio + .05); const T = A.putterStrokeBase + Math.abs(b) * A.putterStrokePerRadian;
        const u = clamp01(t / T); angle = b + (through - b) * (1 - Math.cos(Math.PI * u)) / 2; endTime = T + A.followThroughHold;
      } else {
        // downswing speeds up into the ball, then the follow-through eases out
        const down = A.downswingDuration, follow = A.followThroughDuration;
        if (t < down) { const p = t / down; angle = b * (1 - p * p); } else { const q = clamp01((t - down) / follow); angle = A.followThroughAngle * (1 - (1 - q) ** 3); }
        endTime = down + follow + A.followThroughHold;
      }
      applySwingPose(angle);
      if (!swingAnimation.contactTriggered && swingAnimation.lastAngle < 0 && angle >= 0) { swingAnimation.contactTriggered = true; launchBall(swingAnimation.power, swingAnimation.sidespinRpm, swingAnimation.shotQuality, swingAnimation.direction); onShotContact(swingAnimation.shotQuality); updateStatus(`${swingAnimation.shotQuality.label}`); }
      swingAnimation.lastAngle = angle;
      if (t >= endTime) { swingAnimation.active = false; swing.phase = 'ready'; swing.value = 0; swing.power = 0; swing.accuracy = 0; updateSwingMeterUI(); updateAddressPrompt(); }
    }
    function updateGolferPose(dt = 1 / 60) { if (swingAnimation.active) return; if (addressing || swing.phase === 'power' || swing.phase === 'accuracy') applyAddressPose(swing.phase === 'power' ? swing.value / CONFIG.swing.powerMax : swing.power / CONFIG.swing.powerMax, dt); else { golfer.poseAngle = undefined; applyWalkingPose(); } }

    function clearEffects() {
      effects.particles.length = 0; effects.trailPositions.length = 0; effects.trailAccumulator = 0;
      if (effects.particlePoints) effects.particlePoints.geometry.setDrawRange(0, 0);
      if (effects.trailPoints) effects.trailPoints.geometry.setDrawRange(0, 0);
      effects.rings.forEach(ring => { ring.active = false; ring.life = 0; ring.mesh.visible = false; ring.mesh.material.opacity = 0; });
    }
    function particlePalette(type) {
      if (type === 'sand') return [0xe9ca82, 0xd4ae62, 0xf4dc9e];
      if (type === 'water') return [0xd9ffff, 0x8ce1ee, 0xffffff];
      if (type === 'confetti') return [0xffd449, 0x4f7cff, 0xff786e, 0x61c979, 0xffffff];
      return [0xa9d884, 0x79b75f, 0xd6e5a0];
    }
    function emitParticles(position, type, count) {
      const palette = particlePalette(type);
      for (let i = 0; i < count; i += 1) {
        if (effects.particles.length >= CONFIG.effects.maxParticles) effects.particles.shift();
        const angle = Math.random() * Math.PI * 2; const spread = type === 'confetti' ? 2.2 : type === 'water' ? 1.3 : .72; const lift = type === 'confetti' ? THREE.MathUtils.randFloat(2.7, 5.5) : THREE.MathUtils.randFloat(.65, 2.15);
        const color = new THREE.Color(palette[i % palette.length]);
        effects.particles.push({ position: position.clone(), velocity: new THREE.Vector3(Math.cos(angle) * Math.random() * spread, lift, Math.sin(angle) * Math.random() * spread), life: type === 'confetti' ? THREE.MathUtils.randFloat(1.5, 2.5) : THREE.MathUtils.randFloat(.45, .85), maxLife: type === 'confetti' ? 2.5 : .85, color });
      }
    }
    function triggerWaterSplash(position) {
      const surface = surfaceInfoAt(position.x, position.z); const splashPosition = position.clone(); splashPosition.y = surface.height + .05;
      const ring = effects.rings.find(item => !item.active) || effects.rings[0]; ring.active = true; ring.life = 0; ring.mesh.visible = true; ring.mesh.position.copy(splashPosition); ring.mesh.scale.setScalar(1); ring.mesh.material.opacity = .9;
      emitParticles(splashPosition, 'water', 18); audioEngine.splash();
    }
    function triggerLandingEffect(position, surface) {
      const effectPosition = position.clone(); effectPosition.y = surfaceInfoAt(position.x, position.z).height + .05;
      if (surface === 'sand') emitParticles(effectPosition, 'sand', 22);
      else if (['tee', 'fairway', 'rough', 'fringe', 'green'].includes(surface)) emitParticles(effectPosition, 'grass', surface === 'green' ? 6 : 12);
      audioEngine.landing(surface);
    }
    function triggerConfetti(position) { const origin = position.clone(); origin.y += .35; emitParticles(origin, 'confetti', 72); }
    function updateFlag(now) {
      const flag = courseRuntime.flagMesh; const base = courseRuntime.flagBasePositions; if (!flag || !base) return;
      const attribute = flag.geometry.attributes.position; const strength = THREE.MathUtils.clamp(wind.mph / Math.max(1, CONFIG.wind.maxMph), 0, 1);
      for (let i = 0; i < attribute.count; i += 1) { const x = base[i * 3]; attribute.array[i * 3 + 2] = base[i * 3 + 2] + Math.sin(now * .0045 + x * 8) * (.018 + strength * .075) * THREE.MathUtils.clamp(x + (courseRuntime.flagHalfW || .47), 0, 1.2); }
      attribute.needsUpdate = true;
      if (courseRuntime.flagRoot) { courseRuntime.flagRoot.rotation.z = -Math.sin(wind.angle) * strength * .075; courseRuntime.flagRoot.rotation.x = Math.cos(wind.angle) * strength * .055; }
    }
    function updateEffects(dt) {
      for (let i = effects.particles.length - 1; i >= 0; i -= 1) { const particle = effects.particles[i]; particle.life -= dt; if (particle.life <= 0) { effects.particles.splice(i, 1); continue; } particle.velocity.y -= CONFIG.effects.particleGravity * dt; particle.position.addScaledVector(particle.velocity, dt); }
      const count = Math.min(effects.particles.length, CONFIG.effects.maxParticles);
      for (let i = 0; i < count; i += 1) { const particle = effects.particles[i]; effects.particlePositionArray[i * 3] = particle.position.x; effects.particlePositionArray[i * 3 + 1] = particle.position.y; effects.particlePositionArray[i * 3 + 2] = particle.position.z; effects.particleColorArray[i * 3] = particle.color.r; effects.particleColorArray[i * 3 + 1] = particle.color.g; effects.particleColorArray[i * 3 + 2] = particle.color.b; }
      effects.particlePoints.geometry.setDrawRange(0, count); effects.particlePoints.geometry.attributes.position.needsUpdate = true; effects.particlePoints.geometry.attributes.color.needsUpdate = true;
      effects.rings.forEach(ring => { if (!ring.active) return; ring.life += dt; ring.mesh.scale.setScalar(1 + ring.life * 4.8); ring.mesh.material.opacity = Math.max(0, .9 - ring.life * 1.8); if (ring.life >= .52) { ring.active = false; ring.mesh.visible = false; } });

      if (ballState.inFlight && !ballState.onGround) { effects.trailAccumulator += dt; if (effects.trailAccumulator >= CONFIG.effects.trailInterval) { effects.trailAccumulator = 0; effects.trailPositions.push(ballState.position.clone()); if (effects.trailPositions.length > CONFIG.effects.maxTrailPoints) effects.trailPositions.shift(); } }
      else if (effects.trailPositions.length && gameFlow.mode === 'playing') effects.trailPositions.shift();
      const trailCount = effects.trailPositions.length;
      for (let i = 0; i < trailCount; i += 1) { const point = effects.trailPositions[i]; effects.trailPositionArray[i * 3] = point.x; effects.trailPositionArray[i * 3 + 1] = point.y; effects.trailPositionArray[i * 3 + 2] = point.z; }
      effects.trailPoints.geometry.setDrawRange(0, trailCount); effects.trailPoints.geometry.attributes.position.needsUpdate = true;
    }

    function updateShotCount() { ballState.shotNumber = holeTotal(); }
    function applyHazardPenalty(type, state, preview) {
      if (preview) { state.inFlight = false; state.velocity.set(0, 0, 0); return true; }
      startHazardSequence(type, state); return true;
    }
    // Water: splash, sink, +1 stroke, then a drop on dry land behind where it went in (never nearer the hole).
    // Out of bounds: +1 stroke and the ball is dropped back where it was last hit.
    let hazardSeq = null;
    function findDropSpot(impact, origin) {
      const pin = currentHole.pin; const away = new THREE.Vector3(impact.x - pin.x, 0, impact.z - pin.z).normalize(); const clear = CONFIG.hazards.dropClearanceMeters;
      const dry = (x, z) => { const s = surfaceInfoAt(x, z).surface; return s !== 'water' && s !== 'outOfBounds' && s !== 'sand'; };
      for (let k = 0; k < 90; k += .5) {
        const x = impact.x + away.x * k, z = impact.z + away.z * k;
        if (dry(x, z) && dry(x + away.x * clear, z + away.z * clear) && dry(x + away.z * 1.2, z - away.x * 1.2) && dry(x - away.z * 1.2, z + away.x * 1.2)) return new THREE.Vector3(x + away.x * clear, 0, z + away.z * clear);
      }
      // nothing dry straight back (e.g. inside a sweeping dogleg): take the nearest dry, in-bounds grass that is no nearer the hole, so a ball never goes back to the tee
      const limit = Math.hypot(impact.x - pin.x, impact.z - pin.z) - .5;
      for (let r = 2; r <= 70; r += 1) for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) {
        const x = impact.x + Math.cos(a) * r, z = impact.z + Math.sin(a) * r;
        if (Math.hypot(x - pin.x, z - pin.z) >= limit && dry(x, z) && dry(x + 1.5, z) && dry(x - 1.5, z) && dry(x, z + 1.5) && dry(x, z - 1.5)) return new THREE.Vector3(x, 0, z);
      }
      return origin.clone();
    }
    function startHazardSequence(type, state) {
      const impact = state.position.clone(); const drop = type === 'water' ? findDropSpot(impact, state.origin) : state.origin.clone();
      state.velocity.set(0, 0, 0); state.inFlight = false; state.onGround = true; state.isPutting = false; holeState.penalties += 1; updateShotCount();
      if (type === 'water') { triggerWaterSplash(impact); impact.y = surfaceInfoAt(impact.x, impact.z).height + ballRadius * .2; }
      hazardSeq = { type, t: 0, impact, drop, dropped: false, dropStart: 0 }; cameraState.ballHold = CONFIG.hazards.dropDelaySeconds + CONFIG.hazards.dropSeconds + .8;
      state.shotMessage = type === 'water' ? 'Splash! In the water · +1 penalty stroke' : 'Out of bounds! · +1 penalty stroke'; updateStatus(state.shotMessage);
    }
    function updateHazardSequence(dt) {
      if (!hazardSeq) return; const q = hazardSeq, H = CONFIG.hazards; q.t += dt;
      if (!q.dropped) {
        if (q.type === 'water') { const k = clamp01(q.t / H.waterSinkSeconds); ballState.position.set(q.impact.x, q.impact.y - k * .35, q.impact.z); ball.visible = k < .95; }
        else ball.visible = q.t < .35 || (q.t < .7 && Math.floor(q.t * 12) % 2 === 0);
        if (q.t >= H.dropDelaySeconds) { q.dropped = true; q.dropStart = q.t; ball.visible = true; updateStatus(q.type === 'water' ? 'Penalty drop · play your next shot from the dry grass' : 'Replay from where you last hit'); }
        return;
      }
      const u = clamp01((q.t - q.dropStart) / H.dropSeconds); const ground = surfaceInfoAt(q.drop.x, q.drop.z).height + ballRadius;
      const bounce = Math.abs(Math.cos(u * Math.PI * 1.5)) * (1 - u) ** 2 * .9; ballState.position.set(q.drop.x, ground + bounce, q.drop.z);
      if (u >= 1) {
        ballState.position.set(q.drop.x, ground, q.drop.z); ballState.surface = surfaceInfoAt(q.drop.x, q.drop.z).surface; hazardSeq = null; ball.visible = true; updateAddressPrompt();
        if (holeTotal() >= currentHole.par * CONFIG.scoring.maxScoreMultiplier) finishHole('max');
      }
    }
    function checkTreeCollision(previous, current, state, preview) {
      for (const tree of courseRuntime.treeColliders) {
        if (state.origin && Math.hypot(state.origin.x - tree.x, state.origin.z - tree.z) <= tree.radius + 1.2) continue; // playing out from under this tree: it can't trap the ball
        const base = tree.baseY; const currentHeight = current.y - base; if (currentHeight < .18 || currentHeight > tree.height + .35) continue;
        let hit = false;
        for (let step = 0; step <= 4; step += 1) { const t = step / 4; const x = THREE.MathUtils.lerp(previous.x, current.x, t); const z = THREE.MathUtils.lerp(previous.z, current.z, t); if (Math.hypot(x - tree.x, z - tree.z) <= tree.radius) { hit = true; break; } }
        if (hit) { const awayX = previous.x - tree.x, awayZ = previous.z - tree.z, awayLen = Math.hypot(awayX, awayZ) || 1; const bounceSpeed = Math.max(.6, Math.hypot(state.velocity.x, state.velocity.z) * .16); state.position.set(previous.x, Math.min(previous.y, current.y), previous.z); state.velocity.x = awayX / awayLen * bounceSpeed; state.velocity.z = awayZ / awayLen * bounceSpeed; state.velocity.y = -Math.max(1.2, Math.abs(state.velocity.y) * .25); state.onGround = false; state.treeHit = true; if (!preview) updateStatus('Tree hit — the ball dropped down'); return true; }
      }
      return false;
    }

    // Ball slides to the middle of the cup and drops in, then the hole is scored
    let cupDrop = null;
    function startCupDrop() {
      const c = currentHole.pin; const top = greenHeightAt(c.x, c.z) + CONFIG.courseVisuals.cartoon.surfaceLift.green;
      cupDrop = { t: 0, from: ballState.position.clone(), to: new THREE.Vector3(c.x, top + ballRadius, c.z), bottom: top - ballRadius * .45, done: false };
      ballState.velocity.set(0, 0, 0); ballState.inFlight = false; ballState.onGround = true; ballState.holed = true; audioEngine.cup();
    }
    function updateCupDrop(dt) {
      if (!cupDrop) return; cupDrop.t += dt; if (cupDrop.done) return; const slide = Math.min(1, cupDrop.t / .16); ballState.position.lerpVectors(cupDrop.from, cupDrop.to, 1 - (1 - slide) ** 2);
      if (cupDrop.t > .16) { const fall = Math.min(1, (cupDrop.t - .16) / (CONFIG.scoring.cupDropSeconds - .16)); ballState.position.y = THREE.MathUtils.lerp(cupDrop.to.y, cupDrop.bottom, fall * fall); }
      if (cupDrop.t >= CONFIG.scoring.cupDropSeconds && !cupDrop.done) { cupDrop.done = true; finishHole('holed'); }
    }
    function finishHole(reason) {
      if (holeState.completed) return;
      const maxScore = currentHole.par * CONFIG.scoring.maxScoreMultiplier; let score = holeTotal();
      if (reason === 'skip' && score === 0) score = currentHole.par;
      if (reason === 'max') score = maxScore;
      score = Math.min(maxScore, Math.max(1, score)); holeState.completed = true; scorecard[currentHoleIndex].score = score; ballState.inFlight = false; addressing = false; swingAnimation.active = false; resetSwingMeter();
      if (reason === 'holed') { ballState.holed = true; ballState.shotMessage = `In the hole! · ${scoreTerm(score, currentHole.par)}`; showHoleCheer(score, currentHole.par); if (score <= currentHole.par - 1) audioEngine.cheer(); triggerConfetti(currentHole.pin.clone().setY(greenHeightAt(currentHole.pin.x, currentHole.pin.z))); updateStatus(ballState.shotMessage); }
      else if (reason === 'max') { ballState.shotMessage = `Picked up · ${scoreTerm(score, currentHole.par)}`; showHoleCheer(score, currentHole.par); updateStatus(`Maximum score reached — ${scoreTerm(score, currentHole.par)}`); }
      else { ballState.shotMessage = `Hole skipped · ${scoreTerm(score, currentHole.par)}`; updateStatus('Debug skip recorded'); }
      if (mp.active) updateAddressPrompt(); else { const hs = holeState; updateAddressPrompt(); afterCheer(() => { if (holeState === hs && hs.completed && gameFlow.mode === 'playing') renderScorecard(); }); }
    }
    function showScorecard() { gameFlow.mode = 'scorecard'; clearHeldInputs(); $('tip-toast').classList.remove('show'); onboarding.active = null; onboarding.timer = 0; $('scorecard-overlay').hidden = false; }
    function scoreMark(score, par) { if (score === null || score === undefined) return ''; const d = score - par; const cls = d <= -2 ? 'eagle' : d === -1 ? 'birdie' : d === 1 ? 'bogey' : d >= 2 ? 'double' : ''; return `<span class="mk ${cls}">${score}</span>`; }
    function toParClass(v) { return v < 0 ? 'under' : v > 0 ? 'over' : 'even'; }
    function playerTotals(scores, pars) { let total = 0, par = 0, thru = 0; scores.forEach((sc, i) => { if (sc !== null && sc !== undefined) { total += sc; par += pars[i]; thru += 1; } }); return { total, toPar: total - par, thru }; }
    // players: [{ name, color, scores }]
    // a real golf card: Front 9 (OUT) and Back 9 (IN, TOT, +/-) stacked; a nine-hole course keeps the single OUT card
    function golfCardHtml(players, pars, highlight) {
      const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const sum = (arr, a, b) => arr.slice(a, b).reduce((x, y) => x + (y || 0), 0);
      const half = (from, to, label, last) => {
        const idx = []; for (let i = from; i < to; i++) idx.push(i); const cls = i => (i === highlight ? 'cur' : '');
        let h = `<table class="golf-card${last ? '' : ' front'}"><thead><tr><th class="side"><span class="lg">${label}</span><span class="sm">${label === 'FRONT' ? 'F9' : label === 'BACK' ? 'B9' : '#'}</span></th>` + idx.map(i => `<th class="${cls(i)}">${i + 1}</th>`).join('') + `<th class="sum">${to <= 9 ? 'OUT' : 'IN'}</th>${last && from > 0 ? '<th class="sum">TOT</th>' : ''}${last ? '<th class="sum">+/−</th>' : ''}</tr></thead><tbody>`;
        h += '<tr class="par"><td class="name">PAR</td>' + idx.map(i => `<td class="${cls(i)}">${pars[i]}</td>`).join('') + `<td class="out">${sum(pars, from, to)}</td>${last && from > 0 ? `<td class="out">${sum(pars, 0, pars.length)}</td>` : ''}${last ? '<td></td>' : ''}</tr>`;
        const yd = COURSE_DATA.holes.map(x => x.lengthYards);
        h += '<tr class="par yds"><td class="name"><span class="lg">YARDS</span><span class="sm">YDS</span></td>' + idx.map(i => `<td class="${cls(i)}">${yd[i]}</td>`).join('') + `<td class="out">${sum(yd, from, to)}</td>${last && from > 0 ? `<td class="out">${sum(yd, 0, yd.length)}</td>` : ''}${last ? '<td></td>' : ''}</tr>`;
        players.forEach(pl => { const t = playerTotals(pl.scores, pars); const part = pl.scores.slice(from, to); const partPlayed = part.some(v => v !== null && v !== undefined);
          h += `<tr><td class="name"><i style="background:${pl.color}"></i>${esc(pl.name)}</td>` + idx.map(i => `<td class="${cls(i)}">${scoreMark(pl.scores[i], pars[i])}</td>`).join('') + `<td class="out tot">${partPlayed ? sum(pl.scores, from, to) : ''}</td>${last && from > 0 ? `<td class="out tot">${t.thru ? t.total : ''}</td>` : ''}${last ? `<td class="tot ${toParClass(t.toPar)}">${t.thru ? formatToPar(t.toPar) : ''}</td>` : ''}</tr>`; });
        return h + '</tbody></table>';
      };
      if (pars.length <= 9) return half(0, pars.length, 'HOLE', true);
      return half(0, 9, 'FRONT', false) + half(9, pars.length, 'BACK', true);
    }
    function renderScorecard() {
      const pars = scorecard.map(r => r.par); const me = { name: playerName(), color: '#4d75ef', scores: scorecard.map(r => r.score) };
      $('golf-card-wrap').innerHTML = golfCardHtml([me], pars, currentHoleIndex); $('card-leave').hidden = true; $('card-wait').textContent = ''; $('next-hole').hidden = false;
      const t = playerTotals(me.scores, pars); const final = currentHoleIndex === COURSE_DATA.holes.length - 1 && scorecard.every(row => row.score !== null); gameComplete = final;
      $('scorecard-hole-tag').textContent = final ? 'Final' : `Hole ${currentHole.number}`;
      $('scorecard-title').textContent = final ? 'Final card' : `Hole ${currentHole.number} complete`; $('scorecard-subtitle').textContent = final ? `${t.total} strokes · ${t.toPar === 0 ? 'even par' : formatToPar(t.toPar)} for ${COURSE_DATA.holes.length}` : `${holeCheer(scorecard[currentHoleIndex].score, currentHole.par).main} · ${formatToPar(t.toPar)} for the round`; $('next-hole').textContent = final ? 'Play again' : `Next hole · ${currentHoleIndex + 2}`;
      showCardRank('', false); if (final && !mp.active) postFinishedRound(scorecard.map(r => r.score), 'solo');
      showScorecard(); applyCardMode(final);
    }
    function advanceHole() { if (currentHoleIndex >= COURSE_DATA.holes.length - 1) { restartRound(true); return; } loadHole(currentHoleIndex + 1, true); }
    function restartRound(present = true) { scorecard.forEach(row => { row.score = null; }); roundRecord.id = `${deviceId()}-${Date.now().toString(36)}`; roundRecord.saved = false; roundRecord.rankHtml = ''; gameComplete = false; loadHole(0, present); }
    function resetCurrentHole() { scorecard[currentHoleIndex].score = null; loadHole(currentHoleIndex, true); }
    function skipToNextHole() { if (holeState.completed || ballState.inFlight || swingAnimation.active) return; finishHole('skip'); }

    function resetBallState() {
      if (typeof shotFeel !== 'undefined') { shotFeel.shot = null; shotFeel.slowLeft = 0; shotFeel.timeScale = 1; }
      cameraState.watchBall = false; tracerState.points.length = 0; tracerState.linger = 0; if (typeof tracer !== 'undefined') { tracer.visible = false; tracerGlow.visible = false; tracerHead.visible = false; tracerGround.visible = false; }
      cupDrop = null; hazardSeq = null; ball.visible = true; if (typeof ballShadow !== 'undefined') ballShadow.visible = true;
      const teeHeight = surfaceInfoAt(0, CONFIG.world.teeZ).height; ballState.position.set(0, teeHeight + ballRadius, CONFIG.world.teeZ); ballState.origin.copy(ballState.position); ballState.velocity.set(0, 0, 0); ballState.inFlight = false; ballState.onGround = false; ballState.isPutting = false; ballState.holed = false; ballState.surface = 'tee'; ballState.bounces = 0; ballState.carryDistance = 0; ballState.firstLandingRecorded = false; ballState.shotMessage = '—'; ballState.cupCooldown = 0; ballState.treeHit = false; spin.backspinRpm = 0; spin.sidespinRpm = 0; aimAngleRadians = 0; previewClock = 1; addressing = false; swingAnimation.active = false; cameraState.ballHold = 0; movement.moving = false; holeState = { strokes: 0, penalties: 0, completed: false }; ball.position.copy(ballState.position); approachBallPosition(); cameraState.yaw = -aimAngleRadians; movement.velocity.set(0, 0, 0); applyWalkingPose(); resetSwingMeter(); updateStatus(`Hole ${currentHole.number} · today's pin is ${currentHole.pinLabel === 'middle' ? 'in the middle' : currentHole.pinLabel} · walk to the ball and press E`); updateAddressPrompt(); updateHud();
    }
    function startHolePresentation() {
      const green = currentHole.pin.clone(); green.y = greenHeightAt(green.x, green.z);
      const mid = fairwayCenterAtDistance(currentHole.lengthMeters * .54); mid.y = terrainHeightAt(mid.x, mid.z);
      const tee = currentHole.tee.clone(); tee.y = terrainHeightAt(tee.x, tee.z);
      const start = green.clone().add(new THREE.Vector3(7, CONFIG.presentation.greenCameraHeight, -13));
      const middle = mid.clone().add(new THREE.Vector3(-10, CONFIG.presentation.midCameraHeight, 3));
      const end = tee.clone().add(new THREE.Vector3(6.5, CONFIG.presentation.teeCameraHeight, 13));
      const greenLook = green.clone().add(new THREE.Vector3(0, .5, 0)); const midLook = mid.clone().add(new THREE.Vector3(0, .7, 0)); const teeLook = fairwayCenterAtDistance(Math.min(34, currentHole.lengthMeters)); teeLook.y = terrainHeightAt(teeLook.x, teeLook.z) + 1;
      gameFlow.flyoverCurve = new THREE.CatmullRomCurve3([start, middle, end]); gameFlow.flyoverLookCurve = new THREE.CatmullRomCurve3([greenLook, midLook, teeLook]); gameFlow.flyoverTime = 0; gameFlow.introTime = 0; gameFlow.mode = 'flyover';
      $('hole-intro').hidden = true; $('flyover-skip').hidden = false; document.body.classList.remove('menu-open'); updateAddressPrompt();
    }
    function finishFlyover() {
      if (gameFlow.mode !== 'flyover') return; gameFlow.mode = 'intro'; gameFlow.introTime = 0; $('flyover-skip').hidden = true; $('intro-title').textContent = `Hole ${currentHole.number} · ${currentHole.name}`; $('intro-details').textContent = `Par ${currentHole.par} · ${currentHole.lengthYards} yards`; $('hole-intro').hidden = false; updateAddressPrompt();
    }
    function beginHolePlay() {
      if (gameFlow.mode !== 'intro' && gameFlow.mode !== 'flyover') return; gameFlow.mode = 'playing'; $('hole-intro').hidden = true; $('flyover-skip').hidden = true; audioEngine.ensure(); updateStatus(`Hole ${currentHole.number} · today's pin is ${currentHole.pinLabel === 'middle' ? 'in the middle' : currentHole.pinLabel} · ${touchMode ? 'drag to aim, hold SWING' : 'walk to the ball and press E'}`); updateAddressPrompt(); if (currentHoleIndex === 0 && holeState.strokes === 0) { if (!readStoredJSON(CONFIG.storage.tutorialKey, false)) startTutorial(); else queueTip('walk', 'Press F to go straight to your ball, or walk with WASD. Press E near the ball to set up.'); }
    }
    function updateHolePresentation(dt) {
      if (gameFlow.mode === 'flyover') {
        gameFlow.flyoverTime += dt; const t = THREE.MathUtils.clamp(gameFlow.flyoverTime / CONFIG.presentation.flyoverDuration, 0, 1); const eased = t * t * (3 - 2 * t); const desired = gameFlow.flyoverCurve.getPoint(eased); constrainCameraPosition(desired); camera.position.copy(desired); camera.lookAt(gameFlow.flyoverLookCurve.getPoint(eased)); if (t >= 1) finishFlyover();
      } else if (gameFlow.mode === 'intro') { gameFlow.introTime += dt; if (gameFlow.introTime >= CONFIG.presentation.introDuration) beginHolePlay(); }
    }
    // every texture on the course gets full anisotropic filtering, so stripes, sand and signs stay crisp at low camera angles
    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1);
    function sharpenTextures(root) { root.traverse(o => { const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; mats.forEach(m => { ['map', 'alphaMap', 'bumpMap'].forEach(k => { const t = m[k]; if (t && t.isTexture && t.anisotropy < maxAniso) { t.anisotropy = maxAniso; t.needsUpdate = true; } }); }); }); }
    function loadHole(index, present = true) {
      currentHoleIndex = THREE.MathUtils.clamp(index, 0, COURSE_DATA.holes.length - 1); currentHole = normalizeHole(COURSE_DATA.holes[currentHoleIndex]); gameComplete = false; $('scorecard-overlay').hidden = true; buildCourse(currentHole); sharpenTextures(scene); scene.fog.far = Math.max(CONFIG.camera.fogFar, currentHole.lengthMeters * 1.3); resetBallState(); rerollWind(true); updateHud(); updateMinimap(); if (present) startHolePresentation();
    }

    function launchBall(power, sidespinRpm, shotQuality, launchDirection) {
      if (gameFlow.mode !== 'playing' || ballState.inFlight || ballState.holed || holeState.completed) return;
      tracerState.points.length = 0; tracerState.linger = 0; tracerState.accumulator = 0; cameraState.watchBall = true;
      if (mp.active) { mp.shotPending = true; mp.shotClub = currentClubName; mp.pathClock = 0; mp.path = [[+ballState.position.x.toFixed(2), +ballState.position.y.toFixed(2), +ballState.position.z.toFixed(2)]]; }
      const club = currentClub(); const quality = shotQuality || shotResultForAccuracy(club, CONFIG.swing.sweetSpotCenter); const lieInfo = surfaceInfoAt(ballState.position.x, ballState.position.z); const lie = lieInfo.surface; addressing = false;
      const effectivePower = THREE.MathUtils.clamp(power * quality.powerMultiplier, 0, CONFIG.swing.powerMax); const angle = THREE.MathUtils.degToRad(effectiveLoft(club) * quality.launchAngleMultiplier); let speed = effectiveLaunchSpeed(club, effectivePower); speed *= distanceMultiplierForLie(club, lie);
      const direction = (launchDirection || aimDirection()).clone(); direction.y = 0; direction.normalize(); const groundRoll = Boolean(club.putter || quality.groundRoll);
      if (groundRoll && !club.putter) { const decel = (CONFIG.physics.surfaces[lie] || CONFIG.physics.surfaces.fairway).rollDecel; speed = Math.sqrt(2 * decel * club.maxDistanceMeters * CONFIG.physics.toppedRollShare * effectivePower) / Math.max(.2, Math.cos(angle)); }
      ballState.rollCap = club.putter ? Infinity : Math.sqrt(2 * CONFIG.physics.surfaces.fairway.rollDecel * club.maxRollMeters * Math.max(.25, effectivePower));
      ballState.position.y = lieInfo.height + ballRadius; ballState.velocity.set(direction.x * speed * Math.cos(angle), groundRoll ? 0 : speed * Math.sin(angle), direction.z * speed * Math.cos(angle)); spin.backspinRpm = groundRoll ? 0 : backspinForClub(club, effectivePower); spin.sidespinRpm = groundRoll ? 0 : sidespinRpm; ballState.inFlight = true; ballState.onGround = groundRoll; ballState.isPutting = club.putter; ballState.origin.copy(ballState.position); ballState.surface = lie; ballState.bounces = 0; ballState.carryDistance = 0; ballState.firstLandingRecorded = false; ballState.shotMessage = quality.label; ballState.cupCooldown = 0; ballState.treeHit = false; holeState.strokes += 1; updateShotCount(); cameraState.flightDirection.copy(direction); cameraState.ballHold = 0; effects.trailPositions.length = 0; effects.trailAccumulator = 0; audioEngine.clubHit(club.putter ? 'putt' : (TIER[quality.type] || 'great')); updateStatus(`${quality.label} — ${lie === 'sand' ? 'from the bunker' : club.putter ? 'putt rolling' : currentClubName}`); updateAddressPrompt();
    }

    function stepPhysics(state, spinState, dt, preview = false) {
      if (!state.inFlight) return;
      state.cupCooldown = Math.max(0, (state.cupCooldown || 0) - dt); const previous = state.position.clone(); const groundBefore = surfaceInfoAt(state.position.x, state.position.z); const isAirborne = !state.onGround || state.position.y > groundBefore.height + ballRadius + .002; const speed = state.velocity.length(); const spinDecay = isAirborne ? CONFIG.spin.airSpinDecay : CONFIG.spin.groundSpinDecay; const spinMultiplier = Math.exp(-spinDecay * dt); spinState.backspinRpm *= spinMultiplier; spinState.sidespinRpm *= spinMultiplier;
      let slopePull = 0; if (state.onGround && (groundBefore.surface === 'green' || groundBefore.surface === 'fringe')) { const gr = greenGradientAt(state.position.x, state.position.z); const k = CONFIG.greens.slopeGravity; state.velocity.x -= gr.x * k * dt; state.velocity.z -= gr.z * k * dt; slopePull = Math.hypot(gr.x, gr.z) * k; } // break comes from the ground right under the ball
      if (speed > .001 && isAirborne) {
        const backspinRatio = spinState.backspinRpm / CONFIG.spin.backspinMaxRpm; const sidespinRatio = preview ? 0 : spinState.sidespinRpm / CONFIG.spin.sidespinMaxRpm; state.velocity.y += backspinRatio * speed * CONFIG.spin.liftStrength * dt;
        const lateralDirection = new THREE.Vector3(-state.velocity.z, 0, state.velocity.x); if (lateralDirection.lengthSq() > .000001 && Math.abs(sidespinRatio) > .000001) { lateralDirection.normalize(); state.velocity.addScaledVector(lateralDirection, sidespinRatio * speed * CONFIG.spin.magnusStrength * dt); }
        const flightDirection = new THREE.Vector3(state.velocity.x, 0, state.velocity.z); if (flightDirection.lengthSq() > .000001 && state.position.y - groundBefore.height > ballRadius + .15) { flightDirection.normalize(); const crosswindDirection = new THREE.Vector3(-flightDirection.z, 0, flightDirection.x); const alongWind = wind.vector.dot(flightDirection) * CONFIG.wind.alongFlightMultiplier; const crossWind = wind.vector.dot(crosswindDirection) * CONFIG.wind.crosswindMultiplier; const windForce = flightDirection.multiplyScalar(alongWind).addScaledVector(crosswindDirection, crossWind); const heightMultiplier = 1 + THREE.MathUtils.clamp((state.position.y - groundBefore.height) / 8, 0, 1) * CONFIG.wind.heightBias; state.velocity.addScaledVector(windForce, CONFIG.physics.windEffect * heightMultiplier * dt); }
      }
      if (isAirborne) state.velocity.y += CONFIG.physics.gravity * dt; else state.velocity.y = 0; state.velocity.multiplyScalar(Math.exp(-CONFIG.physics.airDrag * dt)); state.position.addScaledVector(state.velocity, dt);
      if (checkTreeCollision(previous, state.position, state, preview)) return;
      const ground = surfaceInfoAt(state.position.x, state.position.z);
      if (ground.surface === 'water' && state.position.y <= ground.height + CONFIG.physics.waterCaptureHeight) { applyHazardPenalty('water', state, preview); return; }
      if (ground.surface === 'outOfBounds' && state.position.y <= ground.height + CONFIG.physics.outOfBoundsCaptureHeight) { applyHazardPenalty('outOfBounds', state, preview); return; }
      // a rolling ball stays glued to the grass on gentle downhills instead of 'floating' (which skipped friction and let wind push it)
      const contactTolerance = state.onGround && state.velocity.y <= .5 ? .07 : 0;
      if (state.position.y <= ground.height + ballRadius + contactTolerance) {
        state.position.y = ground.height + ballRadius; const downwardSpeed = Math.abs(state.velocity.y); const landedThisStep = !state.onGround; state.onGround = true; state.surface = ground.surface;
        if (landedThisStep && !state.firstLandingRecorded) { state.carryDistance = Math.hypot(state.position.x - state.origin.x, state.position.z - state.origin.z); state.firstLandingRecorded = true; spinState.backspinRpm *= CONFIG.spin.landingSpinLoss; spinState.sidespinRpm *= CONFIG.spin.landingSpinLoss; if (!preview) { triggerLandingEffect(state.position, state.surface); updateStatus(`Landed on ${state.surface} — ${state.carryDistance.toFixed(1)} m carry`); } }
        const surface = CONFIG.physics.surfaces[state.surface] || CONFIG.physics.surfaces.rough; const backspinRatio = Math.max(0, spinState.backspinRpm / CONFIG.spin.backspinMaxRpm);
        const impact = landedThisStep && downwardSpeed > .35 && !state.isPutting;
        if (impact) {
          // every bounce takes horizontal speed away (more with backspin, a lot in sand and rough)
          const keep = surface.impactKeep * (1 - Math.min(.6, backspinRatio * CONFIG.spin.backspinGroundStop));
          state.velocity.x *= keep; state.velocity.z *= keep;
          const capAtImpact = state.rollCap === undefined ? Infinity : state.rollCap * 1.15; const hsImpact = Math.hypot(state.velocity.x, state.velocity.z);
          if (hsImpact > capAtImpact) { state.velocity.x *= capAtImpact / hsImpact; state.velocity.z *= capAtImpact / hsImpact; }
        }
        if (impact && state.surface !== 'sand' && downwardSpeed * surface.restitution > .8 && state.bounces < CONFIG.physics.maxBounces) { state.velocity.y = downwardSpeed * surface.restitution; state.onGround = false; state.bounces += 1; }
        else {
          state.velocity.y = 0;
          if (!state.onGround || landedThisStep) {
            // just started rolling: cap the roll so each club rolls a realistic amount
            const cap = state.rollCap === undefined ? Infinity : state.rollCap; const hs = Math.hypot(state.velocity.x, state.velocity.z);
            if (hs > cap) { state.velocity.x *= cap / hs; state.velocity.z *= cap / hs; }
          }
          state.onGround = true;
          // steady rolling slowdown (m/s per second) so the ball always comes to a stop
          const hs = Math.hypot(state.velocity.x, state.velocity.z); const drop = surface.rollDecel * dt;
          if (hs <= drop) { state.velocity.x = 0; state.velocity.z = 0; } else { state.velocity.x *= (hs - drop) / hs; state.velocity.z *= (hs - drop) / hs; }
        }
        state.carryDistance = Math.hypot(state.position.x - state.origin.x, state.position.z - state.origin.z);
        const horizontalSpeed = Math.hypot(state.velocity.x, state.velocity.z); const pinDistance = Math.hypot(state.position.x - currentHole.pin.x, state.position.z - currentHole.pin.z);
        if (state.surface === 'green' && pinDistance < CONFIG.scoring.cupPullRadius && pinDistance > .001 && horizontalSpeed < 1.4) {
          // a slow ball near the cup curls toward it, like a real hole edge
          const pull = CONFIG.scoring.cupPullStrength * dt; state.velocity.x += (currentHole.pin.x - state.position.x) / pinDistance * pull; state.velocity.z += (currentHole.pin.z - state.position.z) / pinDistance * pull;
        }
        if (state.surface === 'green' && pinDistance <= CONFIG.scoring.cupRadiusMeters) {
          if (horizontalSpeed <= CONFIG.scoring.holeCaptureSpeed) { if (preview) { state.velocity.set(0, 0, 0); state.inFlight = false; state.previewHoled = true; return; } if (state === ballState) { startCupDrop(); return; } }
          else if (!preview && state === ballState && state.cupCooldown <= 0) { state.cupCooldown = .35; state.velocity.multiplyScalar(.86); updateStatus('Lipped out — that putt was a little too fast'); }
        }
        if (downwardSpeed < 1.1 && horizontalSpeed < surface.stopSpeed && slopePull < surface.rollDecel) { state.velocity.set(0, 0, 0); state.inFlight = false; cameraState.ballHold = preview ? 0 : CONFIG.camera.ballHoldDuration; if (!preview) { const ft = Math.round(Math.hypot(state.position.x - currentHole.pin.x, state.position.z - currentHole.pin.z) * 3.281); updateStatus(state.surface === 'green' ? `On the green · ${ft} ft to the cup` : state.surface === 'sand' ? `In the bunker · you'll need the ${sandWedgeName()} to get out` : `Ball stopped on ${state.surface}`); if (state.surface === 'green' || state.surface === 'fringe') queueTip('putt', 'On the green: the flag comes out and the dashed yellow line on the power bar shows how hard to hit. Let go right at the line, and watch the little dots: they flow downhill, and the faster they move the more the putt will break.'); if (holeTotal() >= currentHole.par * CONFIG.scoring.maxScoreMultiplier) finishHole('max'); updateAddressPrompt(); } }
        else if (state.bounces >= 5 && horizontalSpeed < .45) { state.velocity.set(0, 0, 0); state.inFlight = false; cameraState.ballHold = preview ? 0 : CONFIG.camera.ballHoldDuration; if (!preview) { if (state.surface === 'green' || state.surface === 'fringe') queueTip('putt', 'On the green: the flag comes out and the dashed yellow line on the power bar shows how hard to hit. Let go right at the line, and watch the little dots: they flow downhill, and the faster they move the more the putt will break.'); if (holeTotal() >= currentHole.par * CONFIG.scoring.maxScoreMultiplier) finishHole('max'); updateStatus(`Ball stopped on ${state.surface}`); updateAddressPrompt(); } }
      }
    }

    // the preview line and landing target use the power that reaches the flag (the dashed FLAG line on the power bar),
    // not the club's maximum; if the flag is out of reach they show a full swing
    function previewPower() { const r = flagPowerRatio(); return r === null ? 1 : THREE.MathUtils.clamp(r * CONFIG.swing.powerMax, .05, 1); }
    function makePreviewState() {
      const club = currentClub(); const pw = previewPower(); const angle = THREE.MathUtils.degToRad(effectiveLoft(club)); const ground = surfaceInfoAt(ballState.position.x, ballState.position.z); const speed = effectiveLaunchSpeed(club, pw) * distanceMultiplierForLie(club, ground.surface); const direction = aimDirection(); const state = { position: new THREE.Vector3(ballState.position.x, ground.height + ballRadius, ballState.position.z), origin: ballState.position.clone(), velocity: new THREE.Vector3(direction.x * speed * Math.cos(angle), club.putter ? 0 : speed * Math.sin(angle), direction.z * speed * Math.cos(angle)), inFlight: true, onGround: Boolean(club.putter), isPutting: Boolean(club.putter), holed: false, surface: ground.surface, bounces: 0, carryDistance: 0, firstLandingRecorded: false, cupCooldown: 0, treeHit: false };
      state.rollCap = club.putter ? Infinity : Math.sqrt(2 * CONFIG.physics.surfaces.fairway.rollDecel * club.maxRollMeters);
      const previewSpin = { backspinRpm: club.putter ? 0 : backspinForClub(club, pw), sidespinRpm: 0 }; return { state, previewSpin };
    }
    // ---------- where am I hitting? a flag marker over the pin, and a landing tag that never covers it ----------
    function updatePinMarker() {
      const el = $('pin-marker'); const lie = currentHole ? surfaceInfoAt(ballState.position.x, ballState.position.z).surface : '';
      const d = currentHole ? Math.hypot(ballState.position.x - currentHole.pin.x, ballState.position.z - currentHole.pin.z) : 0;
      const show = currentHole && (gameFlow.mode === 'playing' || gameFlow.mode === 'intro') && !holeState.completed && !ballState.holed && !(lie === 'green' && d < 12) && !(mp.replay && mp.replay.active && false);
      if (!show) { el.hidden = true; return null; }
      const top = currentHole.pin.clone(); top.y = greenHeightAt(top.x, top.z) + CONFIG.courseVisuals.flagHeightMeters + .15;
      const v = top.clone().project(camera); const behind = v.z > 1; let x = (v.x * .5 + .5) * innerWidth, y = (-v.y * .5 + .5) * innerHeight; if (behind) { x = innerWidth - x; y = innerHeight - 60; }
      const padX = 48, topPad = touchMode ? 70 : 20, bottomPad = touchMode ? 150 : 120; const edge = behind || x < padX || x > innerWidth - padX || y < topPad + 30 || y > innerHeight - bottomPad;
      const cx = THREE.MathUtils.clamp(x, padX, innerWidth - padX), cy = THREE.MathUtils.clamp(y, topPad + 30, innerHeight - bottomPad);
      el.hidden = false; el.classList.toggle('edge', edge);
      if (edge) { const ang = Math.atan2(y - cy, x - cx); el.style.setProperty('--pm-rot', `${(ang * 180 / Math.PI - 90).toFixed(0)}deg`); }
      $('pm-dist').textContent = (lie === 'green' || lie === 'fringe') ? `${Math.round(d * 3.281)} ft` : `${Math.round(metersToYards(d))} yd`;
      el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) translate(-50%, -100%)`;
      return el.getBoundingClientRect();
    }
    function updateLandingMarker(now) {
      const aiming = gameFlow.mode === 'playing' && addressing && !ballState.holed && !holeState.completed && previewEnabled && landingMarker.userData.valid && !currentClub().putter;
      const flying = ballState.inFlight && !ballState.firstLandingRecorded && landingMarker.userData.valid && !ballState.isPutting;
      landingMarker.visible = aiming || flying; const label = $('landing-label');
      if (!landingMarker.visible) { label.hidden = true; return; }
      const pulse = 1 + Math.sin(now / 260) * .06; landingRingOuter.scale.setScalar(pulse); landingRingInner.scale.setScalar(2 - pulse);
      landingMarker.scale.setScalar(THREE.MathUtils.clamp(camera.position.distanceTo(landingMarker.position) / 40, 1, 4)); // stays easy to see from far away
      const p = landingMarker.position.clone(); p.y += 1.1; p.project(camera);
      if (p.z > 1) { label.hidden = true; return; }
      label.hidden = false; label.textContent = `Lands ~${landingMarker.userData.carryYards} yd`; const lx = (p.x * .5 + .5) * window.innerWidth; let ly = (-p.y * .5 + .5) * window.innerHeight; label.style.left = `${lx}px`; label.style.top = `${ly}px`;
      const pinBox = updateLandingMarker.pinBox; if (pinBox) { const r = label.getBoundingClientRect(); if (!(r.right < pinBox.left - 4 || r.left > pinBox.right + 4 || r.bottom < pinBox.top - 4 || r.top > pinBox.bottom + 4)) { const ground = landingMarker.position.clone().project(camera); ly = Math.max((-ground.y * .5 + .5) * window.innerHeight + r.height + 14, pinBox.bottom + r.height + 8); label.style.top = `${ly}px`; } }
    }
    function updateTracer(dt) {
      const flying = ballState.inFlight && !ballState.isPutting && !ballState.onGround;
      if (flying) {
        tracerState.linger = 0; tracerState.accumulator += dt; if (tracerState.accumulator >= .016) { tracerState.accumulator = 0; tracerState.points.push(ballState.position.clone()); if (tracerState.points.length > CONFIG.tracer.maxPoints) tracerState.points.shift(); }
        tracer.material.opacity = 1;
      } else if (tracerState.points.length) {
        tracerState.linger += dt; tracer.material.opacity = Math.max(0, 1 - tracerState.linger / CONFIG.tracer.lingerSeconds);
        if (tracerState.linger >= CONFIG.tracer.lingerSeconds) { tracerState.points.length = 0; tracerState.linger = 0; }
      }
      tracerGlow.material.opacity = tracer.material.opacity * .16; tracerGround.material.opacity = tracer.material.opacity * .26;
      tracerHead.visible = flying && tracerState.points.length > 1; if (tracerHead.visible) { tracerHead.position.copy(ballState.position); tracerHead.scale.setScalar(THREE.MathUtils.clamp(camera.position.distanceTo(ballState.position) * .011, .25, 1.5)); }
      if (tracerState.points.length < 3) { tracer.visible = tracerGlow.visible = tracerGround.visible = false; return; }
      const pts = tracerState.points; if (flying) { const tip = tracerState.tip || (tracerState.tip = new THREE.Vector3()); tip.copy(ballState.position); tip._air = true; tip._gy = undefined; pts.push(tip); }
      const core = tracer.userData.width || CONFIG.tracer.width;
      const length = ribbonGeometry(pts, core, tracer.geometry, .7); ribbonGeometry(pts, core * 2.2, tracerGlow.geometry, .7);
      // the ball's path traced on the grass underneath, so draws, fades and slices read at a glance
      for (let i = 0; i < pts.length; i += 1) { const q = pts[i]; if (q._gy === undefined) q._gy = surfaceInfoAt(q.x, q.z).height; const g = tracerGroundPts[i] || (tracerGroundPts[i] = new THREE.Vector3()); g.set(q.x, q._gy + .06, q.z); g._air = false; }
      tracerGroundPts.length = pts.length; ribbonGeometry(tracerGroundPts, core * 1.1, tracerGround.geometry, .5);
      if (flying) pts.pop();
      tracerTexture.repeat.set(1 / Math.max(.001, length), 1); tracerTexture.offset.x = 0; tracer.visible = tracerGlow.visible = tracerGround.visible = true;
    }
    const shotFeel = { timeScale: 1, slowLeft: 0, slowTotal: .55, punch: 0, shot: null };
    const TIER = { perfect: 'pure', nice: 'great', hook: 'miss', slice: 'miss', topped: 'bad', fat: 'bad' };
    // Shot pop-ups run on the Web Animations API: composited transform/opacity only, no forced layout, and a new pop smoothly replaces the old one
    function showShotPop(main, sub, tier, hold = 1) {
      const el = $('shot-pop'); if (showShotPop.anim) showShotPop.anim.cancel();
      $('shot-pop-main').textContent = main; $('shot-pop-sub').textContent = sub || ''; el.className = (tier || 'ok') + (main.length > 14 ? ' long' : ''); el.hidden = false;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; const big = /pure/.test(el.className);
      const T = (x, y, sc) => `translate(-50%, ${y}%) scale(${sc})`;
      const frames = reduce ? [{ opacity: 0 }, { opacity: 1, offset: .08 }, { opacity: 1, offset: .85 }, { opacity: 0 }].map(f => ({ ...f, transform: T(0, -50, 1) }))
        : [{ opacity: 0, transform: T(0, -44, big ? .72 : .82), easing: 'cubic-bezier(.2,.9,.3,1.25)' }, { opacity: 1, transform: T(0, -50, 1), offset: .13, easing: 'linear' }, { opacity: 1, transform: T(0, -51, 1), offset: .8, easing: 'cubic-bezier(.4,0,1,1)' }, { opacity: 0, transform: T(0, -58, .98) }];
      showShotPop.anim = el.animate(frames, { duration: 1300 * hold, fill: 'forwards' });
      showShotPop.anim.onfinish = () => { el.hidden = true; };
    }
    function onShotContact(quality) {
      const club = currentClub(); const tier = TIER[quality.type] || 'ok'; const pin = currentHole.pin;
      shotFeel.shot = { club: currentClubName, putter: !!club.putter, start: ballState.position.clone(), startToPin: Math.hypot(ballState.position.x - pin.x, ballState.position.z - pin.z), strokesBefore: holeTotal(), tier, judged: false };
      const SUB = { hook: 'curving left', slice: 'curving right', topped: 'thin · low runner', fat: 'heavy · came up short', perfect: club.putter ? '' : 'right off the sweet spot', nice: '' };
      showShotPop(quality.label, SUB[quality.type] || '', tier);
      const tc = { pure: 0xffc233, great: 0xffffff, miss: 0xff9d45, bad: 0xff6b5b }[tier] || 0xffffff; tracer.material.color.set(tc); tracerGlow.material.color.set(tc); tracerHead.material.color.set(tc); tracer.userData.width = tier === 'pure' ? CONFIG.tracer.width * 1.2 : CONFIG.tracer.width;
      if (tier === 'great' && !club.putter) shotFeel.punch = .45;
      if (tier === 'pure' && !club.putter) { shotFeel.slowLeft = shotFeel.slowTotal = .55; shotFeel.punch = 1; audioEngine.tone(1568, .35, .07, 'sine', .05); audioEngine.tone(2093, .45, .05, 'sine', .14); }
    }
    function judgeShot() {
      const sh = shotFeel.shot; if (!sh || sh.judged) return; sh.judged = true;
      if (ballState.holed || hazardSeq || holeTotal() > sh.strokesBefore + 1) return; // holed, water and out of bounds have their own messages
      const pin = currentHole.pin; const end = ballState.position; const left = Math.hypot(end.x - pin.x, end.z - pin.z);
      const travelled = Math.hypot(end.x - sh.start.x, end.z - sh.start.z); const along = ((end.x - sh.start.x) * (pin.x - sh.start.x) + (end.z - sh.start.z) * (pin.z - sh.start.z)) / Math.max(1, sh.startToPin);
      const past = along > sh.startToPin; const lie = surfaceInfoAt(end.x, end.z).surface; const ft = Math.round(left * 3.281); let verdict = '', tier = 'ok';
      if (sh.putter) {
        if (left < 1) { verdict = 'Tap-in left'; tier = 'great'; } else if (past) { verdict = `Ran it ${ft} ft past`; tier = 'miss'; } else { verdict = `Left it ${ft} ft short`; tier = 'miss'; }
      } else if (lie === 'green' || lie === 'fringe') { verdict = left < 3 ? `Stuck it! ${ft} ft` : `On the green · ${ft} ft`; tier = left < 3 ? 'pure' : 'great'; }
      else if (past && left > 15 && travelled > 20) { verdict = 'Too much club'; tier = 'miss'; }
      else if (!past && left > 25 && sh.startToPin < CONFIG.clubs[sh.club].maxDistanceMeters * 1.05 && travelled < sh.startToPin * .8) { verdict = 'Not enough club'; tier = 'miss'; }
      else if (lie === 'fairway') { verdict = 'Fairway found'; tier = 'great'; }
      else if (lie === 'rough') { verdict = 'In the rough'; tier = 'miss'; }
      else if (lie === 'sand') { verdict = 'Found the bunker'; tier = 'bad'; }
      if (verdict) { showShotPop(verdict, `${Math.round(metersToYards(travelled))} yd`, tier); }
    }
    function updateShotFeel(dt) {
      if (shotFeel.slowLeft > 0) { shotFeel.slowLeft = Math.max(0, shotFeel.slowLeft - dt); const k = 1 - shotFeel.slowLeft / shotFeel.slowTotal; shotFeel.timeScale = .45 + .55 * k * k * (3 - 2 * k); } else shotFeel.timeScale = 1;
      if (shotFeel.punch > 0) { shotFeel.punch = Math.max(0, shotFeel.punch - dt * 1.6); const e = shotFeel.punch; camera.fov = 55 - Math.sin((1 - e) * Math.PI) * 3.5 * e; camera.updateProjectionMatrix(); } else if (camera.fov !== 55) { camera.fov = 55; camera.updateProjectionMatrix(); }
      if (shotFeel.shot && !shotFeel.shot.judged && !ballState.inFlight && !swingAnimation.active && !cupDrop && !hazardSeq && gameFlow.mode === 'playing') judgeShot();
    }
    // ---------- touch controls: swing button, automatic placement at the ball, compact top bar ----------
    const touchUI = { settle: 0, dragged: false, swingPointer: null, compact: false };
    function applyTouchLayout() {
      document.body.classList.toggle('touch', touchMode);
      touchUI.compact = touchMode && Math.min(window.innerWidth, window.innerHeight) <= 560; document.body.classList.toggle('compact', touchUI.compact);
      $('m-bar').hidden = !touchMode; $('touch-ui').hidden = !touchMode;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touchMode ? 1.6 : 2)); // phones: sharp enough, much lighter on the GPU and battery
    }
    function touchCanGoToBall() { return gameFlow.mode === 'playing' && !addressing && !ballState.inFlight && !swingAnimation.active && !ballState.holed && !holeState.completed && !hazardSeq && !cupDrop && mpMyTurn() && !(mp.replay && mp.replay.active); }
    function updateTouchUI(dt) {
      if (!touchMode) return;
      const playing = gameFlow.mode === 'playing'; $('touch-ui').style.display = playing ? '' : 'none'; $('m-bar').style.display = (playing || gameFlow.mode === 'paused' || gameFlow.mode === 'flyover' || gameFlow.mode === 'intro') ? '' : 'none';
      // no walking on phones: once the ball has settled (and it's your turn) you're placed at it automatically
      if (touchCanGoToBall() && cameraState.ballHold <= 0 && !teleportLesson.active) { touchUI.settle += dt; if (touchUI.settle > (holeTotal() === 0 ? .5 : 1.1)) { touchUI.settle = 0; goToBall(); } } else touchUI.settle = 0;
      $('t-ball').hidden = !(touchCanGoToBall());
      const btn = $('t-swing'); const phase = swing.phase; const canSwing = playing && addressing && mpMyTurn() && !ballState.inFlight && !swingAnimation.active && !ballState.holed && !holeState.completed;
      let label = 'SWING', sub = currentClub().putter ? 'hold to putt' : 'hold';
      if (!mpMyTurn()) { label = 'WAIT'; sub = 'not your turn'; } else if (phase === 'power' && swing.holdActive) { label = 'RELEASE'; sub = 'set power'; } else if (phase === 'accuracy') { label = 'TAP!'; sub = 'gold zone'; } else if (!canSwing) { label = 'SWING'; sub = ballState.inFlight || swingAnimation.active ? 'watch' : '…'; }
      $('t-swing-label').textContent = label; $('t-swing-sub').textContent = sub; btn.classList.toggle('accuracy', phase === 'accuracy'); btn.classList.toggle('idle', !canSwing && phase !== 'accuracy');
      $('t-aim-hint').hidden = !(canSwing && phase === 'ready' && !touchUI.dragged && holeTotal() === 0 && currentHoleIndex < 2);
    }
    function updateMobileBar(pinYards, lie) {
      if (!touchMode || !currentHole) return; $('mb-num').textContent = String(currentHole.number); $('mb-name').textContent = currentHole.name; $('mb-par').textContent = `Par ${currentHole.par} · ${currentHole.lengthYards} yds`;
      $('mb-pin').textContent = lie === 'green' || lie === 'fringe' ? `${Math.round(Math.hypot(ballState.position.x - currentHole.pin.x, ballState.position.z - currentHole.pin.z) * 3.281)} ft` : `${pinYards} yd`;
      $('mb-wind').textContent = $('wind-mph').textContent.replace(' mph', ''); $('mb-wind-arrow').textContent = $('wind-arrow').textContent; $('mb-wind-arrow').style.transform = $('wind-arrow').style.transform;
      const toPar = roundToPar(); const el = $('mb-score'); const txt = formatToPar(toPar); if (el.textContent !== txt) { el.textContent = txt; const b = $('mb-score-btn'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } el.className = toPar < 0 ? 'under' : toPar > 0 ? 'over' : ''; const st = mp.active ? myRoundStatus() : null; $('mb-place').textContent = st && st.place ? st.place : '';
    }
    function setupTouchControls() {
      applyTouchLayout(); if (!touchMode) return; $('flyover-skip').textContent = 'Tap to skip the flyover';
      const btn = $('t-swing');
      const press = event => { event.preventDefault(); audioEngine.ensure(); if (gameFlow.mode !== 'playing') return; btn.classList.add('pressed');
        if (swing.phase === 'accuracy') { completeAccuracyClick(); return; }
        if (!addressing) { if (touchCanGoToBall()) goToBall(); return; }
        touchUI.swingPointer = event.pointerId; try { btn.setPointerCapture(event.pointerId); } catch (e) {} beginSwingHold(); };
      const release = event => { btn.classList.remove('pressed'); if (touchUI.swingPointer !== null && event.pointerId === touchUI.swingPointer) { touchUI.swingPointer = null; if (gameFlow.mode === 'playing') releaseSwingHold(); } };
      btn.addEventListener('pointerdown', press); btn.addEventListener('pointerup', release); btn.addEventListener('pointercancel', release); btn.addEventListener('contextmenu', e => e.preventDefault());
      $('t-ball').addEventListener('click', () => { if (touchCanGoToBall()) goToBall(); });
      $('t-menu').addEventListener('click', () => { if (gameFlow.mode === 'playing') pauseGame(); else if (gameFlow.mode === 'paused') resumeGame(); });
      window.addEventListener('orientationchange', () => setTimeout(applyTouchLayout, 250));
    }
    function updateBallPrompt() {
      const el = $('ball-prompt');
      const show = gameFlow.mode === 'playing' && !addressing && !ballState.inFlight && !swingAnimation.active && !hazardSeq && !cupDrop && !ballState.holed && !holeState.completed && !teleportLesson.active && mpMyTurn() && ballDistanceToGolfer() <= CONFIG.character.addressDistance * 1.6
        && !(tutorial.active && tutorial.step < TUTORIAL_STEPS.findIndex(st => st.id === 'goto'));
      if (!show) { el.hidden = true; return; }
      const v = ballState.position.clone(); v.y += .55; v.project(camera); if (v.z > 1) { el.hidden = true; return; }
      el.hidden = false; el.style.left = `${(v.x * .5 + .5) * window.innerWidth}px`; el.style.top = `${(-v.y * .5 + .5) * window.innerHeight}px`;
    }
    function updateAimVisuals() {
      const visible = gameFlow.mode === 'playing' && !ballState.inFlight && !swingAnimation.active && !ballState.holed && !holeState.completed; const putter = currentClub().putter;
      aimLine.visible = visible && !putter; aimArrow.visible = visible && !putter; aimTarget.visible = visible && !putter; if (!visible) return;
      guideTexture.offset.x -= .012; aimTexture.offset.x -= .008;
      if (putter) return;
      const start = ballState.position.clone(); const direction = aimDirection(); const range = currentClub().maxDistanceMeters; const right = new THREE.Vector3(-direction.z, 0, direction.x);
      const end = start.clone().addScaledVector(direction, range); const control = start.clone().addScaledVector(direction, range * .52).addScaledVector(right, range * CONFIG.aim.arrowCurve);
      const pts = new THREE.QuadraticBezierCurve3(start, control, end).getPoints(64).slice(2); pts.forEach(p => { p.y = surfaceInfoAt(p.x, p.z).height + .03; });
      const length = ribbonGeometry(pts, .28, aimLine.geometry); aimTexture.repeat.set(length / 2.2, 1);
      aimArrow.position.copy(end); aimArrow.position.y = surfaceInfoAt(end.x, end.z).height + .32; aimArrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    }
    function updateTrajectoryPreview(frameDt = 0) {
      if (gameFlow.mode !== 'playing' || !previewEnabled || ballState.inFlight || swingAnimation.active || ballState.holed || holeState.completed) { previewPoints.visible = false; return; } previewClock += frameDt; if (previewClock < .1) return; previewClock = 0;
      const { state, previewSpin } = makePreviewState(); const pts = []; const putter = currentClub().putter;
      let carrySpot = null;
      for (let step = 0; step < CONFIG.preview.maxSteps && state.inFlight; step += 1) { if (!carrySpot && state.firstLandingRecorded) carrySpot = state.position.clone(); if (step % 2 === 0) { const ground = surfaceInfoAt(state.position.x, state.position.z).height; pts.push(new THREE.Vector3(state.position.x, Math.max(ground + .03, state.position.y - ballRadius + .03), state.position.z)); } stepPhysics(state, previewSpin, CONFIG.physics.fixedTimeStep, true); }
      const last = state.position; pts.push(new THREE.Vector3(last.x, surfaceInfoAt(last.x, last.z).height + .03, last.z));
      if (pts.length < 3) { previewPoints.visible = false; return; }
      let curve = new THREE.CatmullRomCurve3(pts); let smooth = curve.getSpacedPoints(Math.min(220, Math.max(24, Math.round(curve.getLength() * 3))));
      if (putter) { const keep = Math.max(1.2, curve.getLength() * CONFIG.greens.previewShare); smooth = smooth.slice(0, Math.max(3, Math.round(smooth.length * Math.min(1, keep / Math.max(.01, curve.getLength()))))); } // putts: show the start line, you read the break
      const length = ribbonGeometry(smooth, putter ? .14 : .3, previewPoints.geometry); guideTexture.repeat.set(length / (putter ? .45 : 2.4), 1); previewPoints.visible = true;
      aimTarget.position.set(last.x, surfaceInfoAt(last.x, last.z).height + .035, last.z); const r = putter ? .32 : 1; aimTarget.scale.set(r, r, r);
      aimTarget.material.color.set(state.previewHoled ? 0x5fe07a : 0xffd449);
      if (!putter && carrySpot) { landingMarker.position.set(carrySpot.x, surfaceInfoAt(carrySpot.x, carrySpot.z).height + .04, carrySpot.z); landingMarker.userData.carryYards = Math.round(metersToYards(Math.hypot(carrySpot.x - ballState.position.x, carrySpot.z - ballState.position.z))); landingMarker.userData.valid = true; }
      else landingMarker.userData.valid = false;
    }

    // ---------- yardage book: an ink sketch of the hole with today's pin and a pencil mark for your ball ----------
    const yardageSketch = { hole: null, pin: null, map: null };
    function drawYardageSketch() {
      const svg = $('yb-sketch'); if (!svg || !currentHole) return;
      if (yardageSketch.hole === currentHole && yardageSketch.pin === currentHole.pinIndex) return; yardageSketch.hole = currentHole; yardageSketch.pin = currentHole.pinIndex;
      const H = currentHole, g = H.green; const W = +svg.getAttribute('width'), Ht = +svg.getAttribute('height');
      // fit the hole (tee at the bottom, green at the top) into the sketch box
      const xs = [], zs = []; H.path.forEach(p => { xs.push(p.x); zs.push(p.z); }); xs.push(g.center.x - g.radiusMeters * 1.3, g.center.x + g.radiusMeters * 1.3); zs.push(g.center.z - g.radiusMeters * 1.3, CONFIG.world.teeZ + 4);
      H.water.forEach(w => { xs.push(w.x - w.radiusX, w.x + w.radiusX); }); const pad = 7;
      const minX = Math.min(...xs) - H.fairwayWidthMeters / 2, maxX = Math.max(...xs) + H.fairwayWidthMeters / 2, minZ = Math.min(...zs), maxZ = Math.max(...zs);
      const k = (Ht - 2 * pad) / (maxZ - minZ); const kx = Math.min(k * 3.2, (W - 2 * pad) / (maxX - minX)); /* stretched sideways like a real yardage book, so doglegs and hazards read */ const ox = (W - (maxX - minX) * kx) / 2, oy = (Ht - (maxZ - minZ) * k) / 2;
      const P = (x, z) => [ox + (x - minX) * kx, oy + (z - minZ) * k]; yardageSketch.map = P;
      const f = n => n.toFixed(1); const line = 'M' + H.path.map(p => P(p.x, p.z).map(f).join(',')).join(' L');
      const green = []; for (let j = 0; j < 40; j += 1) { const a = j / 40 * Math.PI * 2; const r = greenEdgeRadius(g.center.x + Math.cos(a), g.center.z + Math.sin(a)); green.push(P(g.center.x + Math.cos(a) * r, g.center.z + Math.sin(a) * r).map(f).join(',')); }
      const [tx, ty] = P(0, CONFIG.world.teeZ); const [px, py] = P(H.pin.x, H.pin.z); const [gx, gy] = P(g.center.x, g.center.z);
      const mid = H.path[Math.floor(H.path.length / 2)] || H.path[0]; const [mx, my] = P(mid.x, mid.z); const labelLeft = mx > W * .55;
      const ink = '#1d2a44', red = '#7a2d2a';
      let out = `<path d="${line}" fill="none" stroke="${ink}" stroke-opacity=".16" stroke-width="${f(H.fairwayWidthMeters * kx)}" stroke-linecap="round" stroke-linejoin="round"/>`;
      H.water.forEach(w => { const [wx, wy] = P(w.x, w.z); out += `<ellipse cx="${f(wx)}" cy="${f(wy)}" rx="${f(w.radiusX * kx)}" ry="${f(Math.max(2, w.radiusZ * k))}" fill="rgba(80,150,210,.35)" stroke="${ink}" stroke-width="1.1"/><path d="M${f(wx - w.radiusX * k * .5)} ${f(wy)} q${f(w.radiusX * kx * .12)} -2 ${f(w.radiusX * kx * .25)} 0 t${f(w.radiusX * kx * .25)} 0 t${f(w.radiusX * kx * .25)} 0" fill="none" stroke="${ink}" stroke-width=".8" stroke-opacity=".6"/>`; });
      out += `<path d="${line}" fill="none" stroke="${ink}" stroke-width="1.2" stroke-dasharray="2 3" stroke-linecap="round"/>`;
      out += `<path d="M${green.join(' L')} Z" fill="rgba(60,140,70,.28)" stroke="${ink}" stroke-width="1.4" stroke-linejoin="round"/>`;
      H.bunkers.forEach(b => { const [bx, by] = P(b.x, b.z); out += `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${f(Math.max(2.2, b.radiusX * kx))}" ry="${f(Math.max(1.8, b.radiusZ * k))}" fill="rgba(222,190,120,.45)" stroke="${red}" stroke-width="1.1" stroke-dasharray="1 1.4"/>`; });
      out += `<circle cx="${f(tx)}" cy="${f(ty)}" r="2.4" fill="${ink}"/>`;
      out += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(px)}" y2="${f(py - 12)}" stroke="${red}" stroke-width="1.3"/><path d="M${f(px)} ${f(py - 12)} l7 2.8 l-7 2.8z" fill="${red}"/>`;
      out += `<text x="${f(labelLeft ? mx - 6 : mx + 7)}" y="${f(my + 4)}" text-anchor="${labelLeft ? 'end' : 'start'}" font-family="'YB Hand', 'Bradley Hand', cursive" font-weight="700" font-size="15" fill="${red}">${H.lengthYards}</text>`;
      out += `<g id="yb-ball"><path d="M-2.6 -2.6 L2.6 2.6 M2.6 -2.6 L-2.6 2.6" stroke="#3a3f47" stroke-width="1.5" stroke-linecap="round"/></g>`;
      svg.innerHTML = out;
    }
    function markBallOnSketch() { const m = yardageSketch.map; const el = document.getElementById('yb-ball'); if (!m || !el) return; const [x, y] = m(ballState.position.x, ballState.position.z); el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); el.style.display = ballState.holed ? 'none' : ''; }
    function updateMinimap() {
      const canvas = $('minimap-canvas'); const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height; ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#cfe8aa'; ctx.fillRect(0, 0, w, h); const bounds = currentHole.bounds; const mapX = x => (x - bounds.minX) / (bounds.maxX - bounds.minX) * w; const mapY = z => (z - bounds.minZ) / (bounds.maxZ - bounds.minZ) * h;
      ctx.lineCap = 'round'; ctx.strokeStyle = '#86c96d'; ctx.lineWidth = Math.max(8, currentHole.fairwayWidthMeters / (bounds.maxX - bounds.minX) * w); ctx.beginPath(); currentHole.path.forEach((point, index) => index ? ctx.lineTo(mapX(point.x), mapY(point.z)) : ctx.moveTo(mapX(point.x), mapY(point.z))); ctx.stroke();
      currentHole.water.forEach(water => { ctx.fillStyle = '#56b7d1'; ctx.beginPath(); ctx.ellipse(mapX(water.x), mapY(water.z), water.radiusX / (bounds.maxX - bounds.minX) * w, water.radiusZ / (bounds.maxZ - bounds.minZ) * h, 0, 0, Math.PI * 2); ctx.fill(); });
      currentHole.bunkers.forEach(bunker => { ctx.fillStyle = '#e4c47e'; ctx.beginPath(); ctx.ellipse(mapX(bunker.x), mapY(bunker.z), bunker.radiusX / (bounds.maxX - bounds.minX) * w, bunker.radiusZ / (bounds.maxZ - bounds.minZ) * h, 0, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#72be68'; ctx.beginPath(); for (let j = 0; j < 48; j += 1) { const a = j / 48 * Math.PI * 2, gc = currentHole.green.center; const r = greenEdgeRadius(gc.x + Math.cos(a), gc.z + Math.sin(a)); const px = mapX(gc.x + Math.cos(a) * r), py = mapY(gc.z + Math.sin(a) * r); j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fill(); currentHole.trees.forEach(tree => { ctx.fillStyle = '#286442'; ctx.beginPath(); ctx.arc(mapX(tree.x), mapY(tree.z), 2.1, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#ed765c'; ctx.fillRect(mapX(currentHole.pin.x) - 1, mapY(currentHole.pin.z) - 8, 2, 9); ctx.fillStyle = '#172238'; ctx.beginPath(); ctx.arc(mapX(ballState.position.x), mapY(ballState.position.z), 4, 0, Math.PI * 2); ctx.fill();
    }
    function positionSwingHud() { const hud = $('swing-hud'); if (hud.hidden) return; if (CONFIG.ui.dockSwingMeter) { hud.classList.add('docked'); return; } hud.classList.remove('docked'); const world = golfer.root.position.clone(); world.y += CONFIG.character.height + .35; world.project(camera); const x = (world.x * .5 + .5) * window.innerWidth; const y = (-world.y * .5 + .5) * window.innerHeight; const panelWidth = CONFIG.ui.sizes.swingPanelWidth; $('swing-hud').style.left = `${THREE.MathUtils.clamp(x, panelWidth / 2 + 8, window.innerWidth - panelWidth / 2 - 8)}px`; $('swing-hud').style.top = `${THREE.MathUtils.clamp(y, 92, window.innerHeight - 100)}px`; }
    function constrainCameraPosition(position, look = null) {
      let minimumY = terrainHeightAt(position.x, position.z) + CONFIG.camera.minGroundClearance;
      for (const tree of courseRuntime.treeColliders) {
        const top = tree.baseY + tree.height + CONFIG.camera.treeClearance; const directDistance = Math.hypot(position.x - tree.x, position.z - tree.z);
        if (directDistance < tree.radius + CONFIG.camera.treeClearance && position.y < top) minimumY = Math.max(minimumY, top);
        if (look) {
          const vx = look.x - position.x; const vz = look.z - position.z; const lengthSq = vx * vx + vz * vz; const projection = lengthSq ? THREE.MathUtils.clamp(((tree.x - position.x) * vx + (tree.z - position.z) * vz) / lengthSq, 0, 1) : 0; const closestX = position.x + vx * projection; const closestZ = position.z + vz * projection;
          if (Math.hypot(closestX - tree.x, closestZ - tree.z) < tree.radius * .9 && position.y < top) minimumY = Math.max(minimumY, top);
        }
      }
      position.y = Math.max(position.y, minimumY); return position;
    }
    // Smooth, broadcast-style camera: position and aim point both glide (frame-rate independent),
    // and the chase direction turns gently instead of snapping on every bounce.
    function updateStandardCamera(frameDt) {
      if (gameFlow.mode === 'flyover') return;
      if (gameFlow.mode === 'playing') cameraState.ballHold = Math.max(0, cameraState.ballHold - frameDt);
      if (!cameraState.lookPoint) cameraState.lookPoint = camera.position.clone().add(new THREE.Vector3(0, 0, -10));
      const C = CONFIG.camera; let desiredCamera; let look; let posRate, lookRate;
      const spectating = mp.replay && mp.replay.active;
      // after a shot the camera keeps watching the ball until you walk or teleport
      if (cameraState.watchBall && (addressing || movement.moving || hazardSeq)) cameraState.watchBall = false;
      const ballMode = spectating || ballState.inFlight || cameraState.ballHold > 0 || (cameraState.watchBall && !ballState.holed);
      if (ballMode) {
        const target = spectating ? mp.replay.ball.position : ballState.position; const vel = spectating ? mp.replay.velocity : ballState.velocity;
        const horizontal = new THREE.Vector3(vel.x, 0, vel.z);
        if (horizontal.lengthSq() > 4) cameraState.flightDirection.lerp(horizontal.normalize(), 1 - Math.exp(-C.flightTurnRate * frameDt)).normalize();
        desiredCamera = target.clone().addScaledVector(cameraState.flightDirection, -C.ballFollowDistance);
        desiredCamera.y = Math.max(target.y + C.ballFollowHeight, terrainHeightAt(desiredCamera.x, desiredCamera.z) + 1.6);
        look = target.clone().addScaledVector(cameraState.flightDirection, C.ballLookAhead); look.y += .55;
        posRate = C.flightPositionRate; lookRate = C.flightLookRate;
      } else {
        const lie = surfaceInfoAt(ballState.position.x, ballState.position.z).surface; const puttingView = lie === 'green' || lie === 'fringe' || currentClub().putter; const source = puttingView ? C.puttingOffset : C.thirdPersonOffset; const tall = camera.aspect < .9; /* portrait phones: pull the camera in behind the golfer instead of off to the side */ const offset = new THREE.Vector3(source.x * (tall ? .4 : 1), source.y * (tall ? 1.18 : 1), source.z * (tall ? 1.4 : 1)).applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraState.yaw); desiredCamera = golfer.root.position.clone().add(offset); const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraState.yaw); look = golfer.root.position.clone().addScaledVector(forward, puttingView ? C.puttingLookAhead : C.lookAhead); look.y += puttingView ? C.puttingLookHeight : C.lookHeight;
        if (puttingView && addressing && currentClub().putter && !swingAnimation.active) {
          // reading a putt: crouch low behind the ball, looking down the line, so the slopes show in the light
          const aim = aimDirection(); const side = new THREE.Vector3(-aim.z, 0, aim.x); const P = C.puttRead; const tallView = camera.aspect < .9;
          desiredCamera = ballState.position.clone().addScaledVector(aim, -P.back * (tallView ? 1.25 : 1)).addScaledVector(side, P.side * (tallView ? .45 : 1)); desiredCamera.y = ballState.position.y + P.height;
          look = ballState.position.clone().addScaledVector(aim, P.lookAhead); look.y = ballState.position.y + P.lookHeight;
        }
        posRate = C.followSmoothness * settings.cameraSensitivity; lookRate = posRate * 1.6;
      }
      constrainCameraPosition(desiredCamera, look);
      // a far jump (e.g. walking away from where the ball stopped) is a quick fade-cut, not a dizzying swoop
      if (camera.position.distanceTo(desiredCamera) > 45 && gameFlow.mode === 'playing' && !cameraState.cutting) {
        cameraState.cutting = true; const fade = $('go-fade'); fade.classList.add('on');
        setTimeout(() => { camera.position.copy(desiredCamera); cameraState.lookPoint.copy(look); fade.classList.remove('on'); cameraState.cutting = false; }, 200);
      }
      if (cameraState.cutting) return;
      camera.position.lerp(desiredCamera, 1 - Math.exp(-posRate * frameDt));
      const groundUnder = terrainHeightAt(camera.position.x, camera.position.z) + .9; if (camera.position.y < groundUnder) camera.position.y += (groundUnder - camera.position.y) * (1 - Math.exp(-8 * frameDt));
      cameraState.lookPoint.lerp(look, 1 - Math.exp(-lookRate * frameDt)); camera.lookAt(cameraState.lookPoint);
    }
    function updatePuttingFlag(dt) {
      const root = courseRuntime.flagRoot; if (!root) return;
      const lie = surfaceInfoAt(ballState.position.x, ballState.position.z).surface;
      const out = CONFIG.putting.pullFlagOnGreen && (cupDrop ? cupDrop.t < CONFIG.scoring.cupDropSeconds + 1.2 : !holeState.completed && (lie === 'green' || (ballState.inFlight && ballState.isPutting)));
      courseRuntime.flagLift = THREE.MathUtils.damp(courseRuntime.flagLift, out ? 1 : 0, 6, dt);
      root.position.y = courseRuntime.flagLift * 1.6; root.visible = courseRuntime.flagLift < .97;
      // far away, the flag grows so it still reads as a flag from the tee (normal size once you're close)
      const far = camera.position.distanceTo(currentHole.pin); const grow = THREE.MathUtils.clamp(far / 75, 1, 3.2); root.scale.setScalar(THREE.MathUtils.damp(root.scale.x, grow, 4, dt));
      root.traverse(o => { if (o.material) { o.material.transparent = courseRuntime.flagLift > .01; o.material.opacity = 1 - courseRuntime.flagLift; } });
    }
    function updateVisuals(frameDt, now) {
      courseRuntime.waterMaterials.forEach(m => { m.uniforms.uTime.value = now / 1000; }); updateBallPrompt(); updateTouchUI(frameDt); updateShotFeel(frameDt); mpTick(gameFlow.mode === 'paused' ? 0 : frameDt); clouds.children.forEach(c => { c.position.x += c.userData.speed * frameDt; if (c.position.x > 460) c.position.x = -460; }); updateScenery(gameFlow.mode === 'paused' ? 0 : frameDt); updateGreenFlow(gameFlow.mode === 'paused' ? 0 : frameDt); updateLandingMarker.pinBox = updatePinMarker(); updateLandingMarker(now); updateTracer(gameFlow.mode === 'paused' ? 0 : frameDt); updateHazardSequence(gameFlow.mode === 'paused' ? 0 : frameDt);
      updateCupDrop(gameFlow.mode === 'paused' ? 0 : frameDt); updatePuttingFlag(frameDt); ballShadow.visible = !cupDrop;
      ball.position.copy(ballState.position); ballShadow.position.set(ballState.position.x, ballState.position.y - ballRadius + .012, ballState.position.z); const height = Math.max(0, ballState.position.y - (surfaceInfoAt(ballState.position.x, ballState.position.z).height + ballRadius)); const shadowScale = THREE.MathUtils.clamp(1.55 - height * .11, .55, 1.55); ballShadow.scale.set(shadowScale, shadowScale, shadowScale); ballShadow.material.opacity = THREE.MathUtils.clamp(.25 - height * .018, .06, .25);
      updateStandardCamera(frameDt); positionSwingHud(); updateAimVisuals(); updateTrajectoryPreview(frameDt); updateAddressPrompt(); updateHud(); updateMinimap(); updateEffects(gameFlow.mode === 'paused' ? 0 : frameDt); updateFlag(now);
    }
    function updateHud() {
      if (!currentHole) return; const pinDistance = Math.hypot(ballState.position.x - currentHole.pin.x, ballState.position.z - currentHole.pin.z); const roundScore = currentRoundScore(); const roundPar = currentRoundPar(); const lie = surfaceInfoAt(ballState.position.x, ballState.position.z).surface; const club = currentClub(); const lieLabels = { tee: 'Tee', fairway: 'Fairway', rough: 'Rough', sand: 'Bunker', fringe: 'Fringe', green: 'Green', water: 'Water', outOfBounds: 'Out of bounds' };
      $('hole-num').textContent = String(currentHole.number); $('hole-name').textContent = currentHole.name; $('hole-meta').textContent = `Par ${currentHole.par} · ${currentHole.lengthYards}`; drawYardageSketch(); markBallOnSketch(); const rise = (lie === 'green' || lie === 'fringe') ? greenHeightAt(currentHole.pin.x, currentHole.pin.z) - greenHeightAt(ballState.position.x, ballState.position.z) : 0; $('pin-spot').textContent = currentHole.pinLabel; $('pin-distance').textContent = (lie === 'green' || lie === 'fringe') ? `${Math.round(pinDistance * 3.281)} ft${rise > .06 ? ' uphill' : rise < -.06 ? ' downhill' : ''}` : `${Math.round(metersToYards(pinDistance))} to pin`; $('lie').textContent = (lieLabels[lie] || lie).toLowerCase(); updateMobileBar(Math.round(metersToYards(pinDistance)), lie); $('stroke-count').textContent = String(holeTotal()); $('course-score').textContent = String(roundScore); $('score-to-par').textContent = `Course: ${formatToPar(roundToPar())}`; $('score-to-par').style.color = roundToPar() > 0 ? 'var(--ui-red)' : roundToPar() < 0 ? 'var(--ui-green)' : 'var(--ui-blue)';
      if (ballState.shotMessage !== lastRenderedShotMessage) { const message = $('shot-message'); lastRenderedShotMessage = ballState.shotMessage; message.textContent = ballState.shotMessage; message.hidden = !ballState.shotMessage || ballState.shotMessage === '—' || $('status').textContent.startsWith(ballState.shotMessage); if (!message.hidden) flashStatusCard(); message.classList.remove('pop'); requestAnimationFrame(() => message.classList.add('pop')); }
      $('wind-mph').textContent = `${wind.mph.toFixed(0)} mph`; const windDegrees = THREE.MathUtils.radToDeg(Math.atan2(wind.vector.x, -wind.vector.z)); const windLean = THREE.MathUtils.clamp(wind.mph / CONFIG.wind.maxMph, 0, 1); $('wind-arrow').style.transform = `rotate(${windDegrees}deg) translateY(${-windLean * 2}px) scale(${1 + windLean * .12})`; $('swing-title').textContent = club.putter ? `Putter · ${Math.round(putterRangeMeters() * 3.281)} ft max` : `${currentClubName} · ${Math.round(metersToYards(club.maxDistanceMeters))} yd`; if (!ballState.inFlight) refreshSuggestion(); else updateClubButtons();
    }
    // the status bubble is news, not a permanent sign: it shows when something changes, then fades after a few seconds
    function flashStatusCard() { const card = document.querySelector('.status-card'); card.classList.add('fresh'); clearTimeout(flashStatusCard.t); flashStatusCard.t = setTimeout(() => card.classList.remove('fresh'), 3800); }
    function updateStatus(message) { const el = $('status'); if (el.textContent === message) return; el.textContent = message; flashStatusCard(); }

    function rotateAim(direction) { if (gameFlow.mode !== 'playing' || !addressing || ballState.inFlight || swingAnimation.active) return; aimAngleRadians = wrapAngle(aimAngleRadians + THREE.MathUtils.degToRad(CONFIG.aim.stepDegrees * settings.cameraSensitivity) * direction); previewClock = 1; syncGolferAim(); updateStatus(`Aim ${Math.round(THREE.MathUtils.radToDeg(aimAngleRadians))}°`); updateHud(); }
    // Mouse aim is relative and gentle: sliding the mouse sideways nudges the aim a little.
    // It no longer snaps to wherever the cursor points, so small hand movements don't swing it around.
    function updateAimFromPointer(event) {
      if (event.buttons & 2) { if (!addressing && gameFlow.mode === 'playing') cameraState.yaw -= (event.movementX || 0) * CONFIG.camera.mouseOrbitSpeed * settings.cameraSensitivity; return; }
      if (!settings.mouseAim || gameFlow.mode !== 'playing' || !addressing || swing.phase !== 'ready' || ballState.inFlight || swingAnimation.active) return;
      const dx = THREE.MathUtils.clamp(event.movementX || 0, -40, 40); if (!dx) return;
      aimAngleRadians = wrapAngle(aimAngleRadians + THREE.MathUtils.degToRad(dx * CONFIG.aim.mouseDegreesPerPixel * settings.mouseSensitivity)); previewClock = 1; syncGolferAim();
      movement.aimHudTimer = 0;
    }
    function togglePreview() { if (gameFlow.mode !== 'playing') return; settings.trajectoryPreview = !previewEnabled; applySettings(); updateStatus(`Trajectory preview ${previewEnabled ? 'on' : 'off'}`); updateHud(); }

    function loadInitialState() { setupTouchControls(); calibrateClubs(); buildClubButtons(); updateClubVisual(); loadHole(0, false); applySettings(); camera.position.set(5, 3.2, 10); showMainMenu(); }

    // Menu and settings controls.
    $('play-game').addEventListener('click', startNewRound);
    $('open-how').addEventListener('click', showHowToPlay);
    $('open-board').addEventListener('click', () => openBoard('all')); $('board-close').addEventListener('click', closeBoard);
    document.querySelectorAll('.board-tabs button').forEach(b => b.addEventListener('click', () => renderBoard(b.dataset.period)));
    $('close-how').addEventListener('click', showMainMenu);
    $('open-settings-main').addEventListener('click', () => openSettings('menu'));
    $('open-settings-pause').addEventListener('click', () => openSettings('pause'));
    $('close-settings').addEventListener('click', closeSettings);
    $('resume-game').addEventListener('click', resumeGame);
    $('restart-hole-menu').addEventListener('click', () => askRestartHole());
    $('quit-menu').addEventListener('click', quitToMenu);
    $('setting-sound').addEventListener('change', event => { settings.sound = event.target.checked; if (settings.sound) audioEngine.ensure(); applySettings(); });
    $('setting-music-on').addEventListener('change', event => { settings.music = event.target.checked; applySettings(); });
    $('setting-music').addEventListener('input', event => { settings.musicVolume = Number(event.target.value) / 100; applySettings(); });
    $('setting-camera').addEventListener('input', event => { settings.cameraSensitivity = Number(event.target.value) / 100; applySettings(); });
    $('setting-preview').addEventListener('change', event => { settings.trajectoryPreview = event.target.checked; applySettings(); });
    $('setting-auto-club').addEventListener('change', event => { settings.autoClub = event.target.checked; applySettings(); });
    $('setting-mouse-aim').addEventListener('change', event => { settings.mouseAim = event.target.checked; applySettings(); });
    $('setting-mouse').addEventListener('input', event => { settings.mouseSensitivity = Number(event.target.value) / 100; applySettings(); });

    // In-game controls.
    $('club-buttons').addEventListener('click', event => { const button = event.target.closest('.club-button'); if (button) selectClub(button.dataset.club); });
    $('toggle-preview').addEventListener('click', togglePreview);
    $('reset').addEventListener('click', () => { if (gameFlow.mode === 'playing') askRestartHole(); });
    $('how-replay-tutorial').addEventListener('click', () => { writeStoredJSON(CONFIG.storage.tutorialKey, false); $('how-replay-tutorial').textContent = '✓ The tutorial will play on hole 1'; });
    $('tg-go').addEventListener('click', () => completeTeleportLesson());
    $('open-friends').addEventListener('click', () => showFriendsStep(true)); $('friends-back').addEventListener('click', () => showFriendsStep(false));
    $('create-room').addEventListener('click', () => mpCreateOrJoin(false)); $('join-room').addEventListener('click', () => mpCreateOrJoin(true));
    $('join-code').addEventListener('keydown', e => { if (e.key === 'Enter') mpCreateOrJoin(true); e.stopPropagation(); }); $('player-name').addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); if (!$('friends-step').hidden) $('create-room').click(); else $('play-game').click(); } });
    $('lobby-start').addEventListener('click', () => mpPost('start', mpAuth()).catch(e => { $('lobby-wait').textContent = e.message; }));
    $('lobby-leave').addEventListener('click', () => mpLeave());
    // sharing the room: big code tiles, native share sheet on phones, copy buttons everywhere
    async function copyText(text) { try { await navigator.clipboard.writeText(text); return true; } catch (e) { const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e2) {} t.remove(); return ok; } }
    function flashLabel(el, text) { const old = el.dataset.label || el.textContent; el.dataset.label = old; el.textContent = text; clearTimeout(el._t); el._t = setTimeout(() => { el.textContent = old; }, 1400); }
    const roomCode = () => (mp.state && mp.state.code) || mp.code || '';
    const copyCode = async () => { const code = roomCode(); if (!code) return; await copyText(code); const tiles = $('lobby-code'); tiles.classList.add('copied'); setTimeout(() => tiles.classList.remove('copied'), 1200); flashLabel($('lobby-copy-code'), 'Copied!'); };
    $('lobby-code').addEventListener('click', copyCode); $('lobby-copy-code').addEventListener('click', copyCode);
    $('lobby-share').addEventListener('click', async () => {
      const code = roomCode(); const url = $('lobby-link').value; const text = `Play a round of Fairway Friends with me! Room code: ${code}`;
      if (navigator.share) { try { await navigator.share({ title: 'Fairway Friends', text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      await copyText(`${text}\n${url}`); flashLabel($('lobby-share'), 'Invite copied!');
    });
    $('lb-room').addEventListener('click', async () => { const code = roomCode(); if (!code) return; await copyText(code); flashLabel($('lb-code'), 'Copied!'); });
    $('lobby-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('lobby-link').value); } catch (e) { $('lobby-link').select(); document.execCommand('copy'); } $('lobby-copy').textContent = 'Copied!'; setTimeout(() => { $('lobby-copy').textContent = 'Copy link'; }, 1400); });
    function openPeekCard() {
      if (gameFlow.mode !== 'playing') return; clearHeldInputs(); mp.viewingCard = true;
      if (mp.active && mp.state) { if (mp.state.phase !== 'playing') { mp.viewingCard = false; return; } showMpScorecard(mp.state); $('scorecard-hole-tag').textContent = `Playing hole ${mp.state.hole + 1}`; }
      else { const pars = scorecard.map(r => r.par); $('golf-card-wrap').innerHTML = golfCardHtml([{ name: playerName(), color: '#4d75ef', scores: scorecard.map(r => r.score) }], pars, currentHoleIndex); $('scorecard-hole-tag').textContent = `Playing hole ${currentHoleIndex + 1}`; const t = myRoundStatus(); $('scorecard-subtitle').textContent = t && t.thru ? `${t.toPar === 0 ? 'Even par' : formatToPar(t.toPar)} thru ${t.thru}` : 'No holes finished yet'; showScorecard(); }
      $('scorecard-overlay').classList.remove('mini'); $('next-hole').hidden = false; $('next-hole').textContent = 'Back to the course'; $('card-wait').textContent = ''; $('card-leave').hidden = true; $('scorecard-title').textContent = 'Live scorecard';
    }
    $('f-nudge').addEventListener('click', () => goToBall());
    $('lb-card').addEventListener('click', openPeekCard); $('mb-score-btn').addEventListener('click', openPeekCard);
    $('card-full').addEventListener('click', () => { cardFullRequested = true; if (mp.active && mp.state) showMpScorecard(mp.state); else renderScorecard(); });
    document.querySelectorAll('.char-card').forEach(c => c.addEventListener('click', () => selectCharacter(c.dataset.character)));
    $('tut-next').addEventListener('click', () => advanceTutorial()); $('tut-skip').addEventListener('click', () => endTutorial());
    $('controls-chip').addEventListener('click', () => { const open = $('controls-panel').hidden; $('controls-panel').hidden = !open; $('controls-chip').setAttribute('aria-expanded', String(open)); document.body.classList.toggle('controls-open', open); });
    $('replay-tutorial').addEventListener('click', () => { $('controls-panel').hidden = true; document.body.classList.remove('controls-open'); $('controls-chip').setAttribute('aria-expanded', 'false'); if (gameFlow.mode === 'playing') startTutorial(); });
    $('confirm-restart-yes').addEventListener('click', () => closeRestartConfirm(true)); $('confirm-restart-no').addEventListener('click', () => closeRestartConfirm(false));
    $('next-hole').addEventListener('click', () => { cardFullRequested = false; if (mp.viewingCard) { closeLiveCard(); return; } if (mp.active) mpNextFromCard(); else advanceHole(); });
    $('card-leave').addEventListener('click', () => mpLeave());
    $('scorecard-overlay').addEventListener('click', e => { if (mp.viewingCard && e.target.id === 'scorecard-overlay') closeLiveCard(); });
    renderer.domElement.addEventListener('pointermove', event => {
      if (touchDrag.id !== null && event.pointerId === touchDrag.id) {
        const dx = event.clientX - touchDrag.x; touchDrag.x = event.clientX; touchDrag.y = event.clientY; if (!dx || gameFlow.mode !== 'playing') return;
        if (addressing && swing.phase === 'ready' && !ballState.inFlight && !swingAnimation.active) { // drag to aim; finer on the green
          const degPerPx = (currentClub().putter ? .07 : .14) * settings.mouseSensitivity; aimAngleRadians = wrapAngle(aimAngleRadians + THREE.MathUtils.degToRad(dx * degPerPx)); previewClock = 1; syncGolferAim(); movement.aimHudTimer = 0; touchUI.dragged = true;
        } else if (!addressing) cameraState.yaw -= dx * .006;
        return;
      }
      updateAimFromPointer(event);
    });
    const endTouchDrag = event => { if (event.pointerId === touchDrag.id) touchDrag.id = null; };
    renderer.domElement.addEventListener('pointerup', endTouchDrag); renderer.domElement.addEventListener('pointercancel', endTouchDrag);
    const touchDrag = { id: null, x: 0, y: 0 };
    renderer.domElement.addEventListener('pointerdown', event => {
      if (event.button !== 0) return; event.preventDefault();
      if (touchMode || event.pointerType === 'touch') {
        if (gameFlow.mode === 'flyover') { finishFlyover(); return; }
        if (gameFlow.mode === 'intro') { beginHolePlay(); return; }
        audioEngine.ensure(); touchDrag.id = event.pointerId; touchDrag.x = event.clientX; touchDrag.y = event.clientY; try { renderer.domElement.setPointerCapture(event.pointerId); } catch (e) {} return;
      }
      if (gameFlow.mode === 'flyover') { finishFlyover(); return; }
      if (gameFlow.mode === 'intro') { beginHolePlay(); return; }
      if (gameFlow.mode !== 'playing') return; audioEngine.ensure();
      if (!addressing) { if (ballDistanceToGolfer() <= CONFIG.character.addressDistance) enterAddressMode(); return; }
      if (swing.phase === 'accuracy') completeAccuracyClick(); else beginSwingHold();
    });
    window.addEventListener('pointerup', event => { if (touchMode || event.pointerType === 'touch') return; if (event.button === 0 && gameFlow.mode === 'playing') releaseSwingHold(); }); // touch swings are handled by the SWING button
    renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
    // keys are read by position (event.code), so W A S D sit in the same spot on AZERTY (Z Q S D), QWERTZ, Dvorak…
    const MOVE_CODES = { KeyW: 'w', ArrowUp: 'w', KeyS: 's', ArrowDown: 's', KeyA: 'a', KeyD: 'd', ShiftLeft: 'shift', ShiftRight: 'shift', ArrowLeft: 'arrowleft', ArrowRight: 'arrowright' };
    const letterOf = event => (/^Key[A-Z]$/.test(event.code) ? event.code.slice(3).toLowerCase() : (event.key || '').toLowerCase());
    // pinch / ctrl+wheel would zoom the whole page mid-round and wreck the layout
    window.addEventListener('wheel', e => { if (e.ctrlKey && gameFlow.mode === 'playing') e.preventDefault(); }, { passive: false });
    ['gesturestart', 'gesturechange'].forEach(t => document.addEventListener(t, e => { if (gameFlow.mode === 'playing') e.preventDefault(); }));
    window.addEventListener('keydown', event => {
      // Cmd/Ctrl/Alt shortcuts (reload, new tab, find, print…) belong to the browser, never to the game
      if (event.metaKey || event.ctrlKey || event.altKey) { Object.keys(movement.keys).forEach(k => { movement.keys[k] = false; }); return; }
      const key = letterOf(event);
      if (gameFlow.mode === 'playing') {
        const f = document.activeElement; if (f && f !== document.body && (f.tagName === 'BUTTON' || f.tagName === 'A')) f.blur(); // Space must swing, not press the last clicked button
        if (event.key === 'Tab' || event.key === '/' || event.key === "'") event.preventDefault(); // no focus hopping or Firefox quick-find mid-swing
      }
      if (teleportLesson.active) { event.preventDefault(); if (key === 'f' || key === 'enter' || event.code === 'Space') completeTeleportLesson(); return; }
      if (gameFlow.mode === 'flyover') { event.preventDefault(); finishFlyover(); return; }
      if (gameFlow.mode === 'intro') { event.preventDefault(); beginHolePlay(); return; }
      if (event.key === 'Escape') {
        event.preventDefault();
        if (mp.viewingCard && !$('scorecard-overlay').hidden) { closeLiveCard(); return; }
        if (!$('confirm-restart').hidden) closeRestartConfirm(false);
        else if (gameFlow.mode === 'settings') closeSettings();
        else if (gameFlow.mode === 'paused') resumeGame();
        else if (gameFlow.mode === 'playing') pauseGame();
        else if (!$('how-menu').hidden) showMainMenu();
        else if (!$('board-menu').hidden) closeBoard();
        return;
      }
      if (gameFlow.mode === 'scorecard') { if (key === 'enter') { event.preventDefault(); if (mp.viewingCard) closeLiveCard(); else if (mp.active) mpNextFromCard(); else advanceHole(); } return; }
      if (gameFlow.mode !== 'playing') return;
      if (key === 'e') { event.preventDefault(); if (addressing) leaveAddressMode(); else enterAddressMode(); return; }
      if (CONFIG.debug.enabled && CONFIG.character.allowTeleport && key === CONFIG.character.teleportKey) { event.preventDefault(); teleportGolferToBall(); return; }
      if (event.code === 'Space') { event.preventDefault(); if (fNudgeWanted()) fNudge.keyed = true; if (!event.repeat) beginSwingHold(); return; }
      if (CONFIG.debug.enabled && key === CONFIG.scoring.skipHoleKey) { event.preventDefault(); skipToNextHole(); return; }
      if (key === CONFIG.character.goToBallKey) { event.preventDefault(); goToBall(); return; }
      if (!MOVE_CODES[event.code] && fNudgeWanted()) fNudge.keyed = true; // pressed something that can't do anything from here: show the F reminder now
      const mv = MOVE_CODES[event.code]; if (mv) { event.preventDefault(); movement.keys[mv] = true; }
      const digit = /^(?:Digit|Numpad)([0-9])$/.exec(event.code); if (digit) Object.entries(CONFIG.clubs).forEach(([name, club]) => { if (digit[1] === club.key) selectClub(name); });
      if (key === CONFIG.preview.toggleKey) togglePreview();
      else if (key === 'r' && !event.repeat) askRestartHole();
      else if (CONFIG.debug.enabled && key === CONFIG.wind.rerollKey) rerollWind();
    });
    window.addEventListener('keyup', event => { if (event.code === 'Space' && gameFlow.mode === 'playing') releaseSwingHold(); const mv = MOVE_CODES[event.code]; if (mv) movement.keys[mv] = false; });
    window.addEventListener('blur', clearHeldInputs);
    function fitToWindow() { renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touchMode ? 1.6 : 2)); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); applyTouchLayout(); }
    window.addEventListener('resize', fitToWindow);
    // phones report the new size a moment after rotating, and full screen changes size too
    window.addEventListener('orientationchange', () => setTimeout(fitToWindow, 250)); document.addEventListener('fullscreenchange', () => { setTimeout(fitToWindow, 60); syncFullscreenButtons(); }); document.addEventListener('webkitfullscreenchange', () => setTimeout(fitToWindow, 60));
    // full screen: a button on the title screen and in the pause menu (hidden where the browser can't do it, e.g. iPhone Safari)
    const canFullscreen = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    function toggleFullscreen() { const d = document, el = d.documentElement; try { if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else (el.requestFullscreen || el.webkitRequestFullscreen).call(el).catch?.(() => {}); } catch (e) {} }
    function syncFullscreenButtons() { const on = !!(document.fullscreenElement || document.webkitFullscreenElement); document.querySelectorAll('.fs-toggle').forEach(b => { b.hidden = !canFullscreen; b.textContent = on ? 'Exit full screen' : 'Full screen'; }); }
    document.querySelectorAll('.fs-toggle').forEach(b => b.addEventListener('click', toggleFullscreen)); syncFullscreenButtons();

    let previousTime = performance.now(); let accumulator = 0;
    function animate(now) {
      requestAnimationFrame(animate); const frameTime = Math.min((now - previousTime) / 1000, CONFIG.physics.maxFrameTime); previousTime = now;
      if (gameFlow.mode === 'playing') {
        accumulator += frameTime * shotFeel.timeScale; while (accumulator >= CONFIG.physics.fixedTimeStep) { stepPhysics(ballState, spin, CONFIG.physics.fixedTimeStep, false); accumulator -= CONFIG.physics.fixedTimeStep; }
        updateMovement(frameTime); updateCameraYaw(frameTime); updateTutorial(frameTime); updateCalmMode(); updateTeleportLesson(); updateAimKeys(frameTime); updateSwingMeter(frameTime); updateSwingAnimation(frameTime); updateGolferPose(frameTime); updateFNudge(frameTime);
      } else accumulator = 0;
      updateHolePresentation(frameTime); updateOnboarding(frameTime); audioEngine.update(frameTime); updateVisuals(frameTime, now); renderer.render(scene, camera);
    }

    loadInitialState(); requestAnimationFrame(animate); document.body.classList.remove('loading');
    // sign-in screen: name, golfer previews, invite links and reconnecting after a refresh
    $('player-name').value = settings.playerName || ''; $('ts-course').textContent = `${COURSE_DATA.holes.length} holes · par ${totalCoursePar()}`; setupCharacterPreviews(); selectCharacter(settings.character);
    (() => { const q = new URLSearchParams(location.search).get('room'); if (q) { $('join-code').value = q.toUpperCase().slice(0, 4); showFriendsStep(true); }
      const saved = JSON.parse(sessionStorage.getItem('ff-mp') || 'null'); if (saved && saved.code && (!q || q.toUpperCase() === saved.code)) { Object.assign(mp, { active: true, code: saved.code, token: saved.token, myId: saved.id, started: false, lastHole: -1 }); mpConnect(); } })();
  