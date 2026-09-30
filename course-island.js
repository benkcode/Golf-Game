// Kai Lagoon: an 18-hole island course (same authoring format as course-data.js; distances in yards).
// Front nine: down among the palms, lagoons and beaches. Back nine: up on the headland, high above the sea, windier, the ocean in view on every hole.
// Extra fields used here:
//   ocean:   the sea, as a very large circle (so the shoreline is nearly straight along the hole).
//            { xYards, distanceYards, radiusYards, cliff }  cliff: true = rocky drop, false = sandy beach (beachYards wide)
//   seaLevelMeters: height of the sea (defaults to a little below the lowest point of the hole)
//   windBoost: coastal holes are breezier (the wind speed is multiplied by this)
//   ocean clearYards: open cliff-top grass (no jungle) that far in from the shore, so the sea stays in view
//   openHorizon: no tall ridges behind the green (the high holes look out over the sea)
//   treeClusters kind: 'palm' (coconut palms), 'mixed' (mostly palms with some broad jungle trees) or 'canopy'; the trees are scattered loosely; anything outside the rough is jungle
//   (a ball in the jungle costs 1 stroke and is dropped at the jungle's edge).
window.FAIRWAY_FRIENDS_ISLAND_DATA = {
  id: 'island',
  name: 'Kai Lagoon',
  theme: 'island',
  yardToMeter: 0.9144,
  yardageMarkers: [200, 150, 100],
  holes: [
    {
      number: 1,
      name: 'Aloha Start',
      par: 4,
      lengthYards: 360,
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: -1.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 230 },
        { xYards: -8, distanceYards: 360 }
      ],
      green: { xYards: -8, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: 0.008, z: 0.01 },
        design: { shape: { stretchX: 1.12, stretchZ: .9, turn: .35, lobes: [[2, .05, .6], [3, .05, 1.8], [5, .025, .3]] }, contours: [{ type: 'crown', x: .25, z: -.2, size: .4, height: .24 }, { type: 'bowl', x: -.4, z: .3, size: .28, depth: .12 }] } },
      bunkers: [
        { xYards: 25, distanceYards: 238, radiusXYards: 7, radiusZYards: 9 },
        { xYards: -30, distanceYards: 336, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 16, distanceYards: 375, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        { xYards: -33, distanceYards: 30, count: 7, spreadYards: 260, heightMin: 8, heightMax: 11, kind: 'palm' },
        { xYards: 34, distanceYards: 40, count: 7, spreadYards: 250, heightMin: 8, heightMax: 11, kind: 'palm' },
        { xYards: 36, distanceYards: 300, count: 4, spreadYards: 60, heightMin: 9, heightMax: 12, kind: 'mixed' }
      ]
    },
    {
      number: 2,
      name: 'Coconut Row',
      par: 4,
      lengthYards: 340,
      fairwayWidthYards: 38,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: 1 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 195 },
        { xYards: 22, distanceYards: 262 },
        { xYards: 30, distanceYards: 340 }
      ],
      green: { xYards: 30, radiusYards: 19, fringeYards: 4, raisedMeters: .4, slope: { x: -0.01, z: 0.008 },
        design: { shape: { stretchX: .92, stretchZ: 1.1, turn: -.4, lobes: [[2, .06, 1.2], [3, .04, .4], [4, .03, 2.1]] }, contours: [{ type: 'tier', dir: [0, -1], at: .05, width: .15, height: .36 }, { type: 'crown', x: .35, z: .35, size: .25, height: .12 }] } },
      bunkers: [
        { xYards: -27, distanceYards: 246, radiusXYards: 7, radiusZYards: 6 },
        { xYards: 55, distanceYards: 327, radiusXYards: 5, radiusZYards: 6 }
      ],
      water: [],
      treeClusters: [
        { xYards: 30, distanceYards: 175, count: 9, spreadYards: 55, heightMin: 9, heightMax: 12, kind: 'palm' },
        { xYards: -33, distanceYards: 35, count: 7, spreadYards: 180, heightMin: 8, heightMax: 11, kind: 'palm' },
        { xYards: 33, distanceYards: 40, count: 5, spreadYards: 100, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 3,
      name: 'Lagoon Hop',
      par: 3,
      lengthYards: 150,
      fairwayWidthYards: 42,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: .4 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 150 }
      ],
      green: { xYards: 0, radiusYards: 19, fringeYards: 4, raisedMeters: .3, slope: { x: 0.009, z: -0.006 },
        design: { shape: { stretchX: 1.18, stretchZ: .86, turn: .2, lobes: [[2, .05, .3], [3, .06, 2.4], [4, .03, 1.1]] }, contours: [{ type: 'ridge', from: [-.6, .1], to: [.5, -.3], width: .2, height: .12 }, { type: 'bowl', x: .3, z: .35, size: .25, depth: .1 }] } },
      bunkers: [
        { xYards: 26, distanceYards: 163, radiusXYards: 5, radiusZYards: 5 }
      ],
      water: [
        { xYards: 0, distanceYards: 74, radiusXYards: 34, radiusZYards: 34 }
      ],
      treeClusters: [
        { xYards: -42, distanceYards: 20, count: 5, spreadYards: 110, heightMin: 8, heightMax: 11, kind: 'palm' },
        { xYards: 42, distanceYards: 25, count: 5, spreadYards: 100, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 4,
      name: 'Banyan Bend',
      par: 5,
      lengthYards: 520,
      fairwayWidthYards: 38,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 0, endElevationMeters: 2 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 190 },
        { xYards: -22, distanceYards: 290 },
        { xYards: -10, distanceYards: 400 },
        { xYards: 12, distanceYards: 520 }
      ],
      green: { xYards: 12, radiusYards: 20, fringeYards: 4, raisedMeters: .5, slope: { x: 0.006, z: 0.012 },
        design: { shape: { stretchX: 1.05, stretchZ: 1.0, turn: .8, lobes: [[2, .06, .2], [3, .05, 1.4], [5, .03, .7]] }, contours: [{ type: 'falseFront', at: .6, width: .12, drop: .32 }, { type: 'crown', x: -.25, z: -.25, size: .32, height: .2 }] } },
      bunkers: [
        { xYards: 21, distanceYards: 250, radiusXYards: 6, radiusZYards: 8 },
        { xYards: -40, distanceYards: 360, radiusXYards: 6, radiusZYards: 7 },
        { xYards: -10, distanceYards: 501, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        { xYards: -31, distanceYards: 30, count: 7, spreadYards: 150, heightMin: 9, heightMax: 13, kind: 'mixed' },
        { xYards: 31, distanceYards: 40, count: 6, spreadYards: 140, heightMin: 9, heightMax: 13, kind: 'mixed' },
        { xYards: 8, distanceYards: 305, count: 6, spreadYards: 50, heightMin: 9, heightMax: 12, kind: 'palm' },
        { xYards: 32, distanceYards: 440, count: 5, spreadYards: 60, heightMin: 9, heightMax: 12, kind: 'palm' }
      ]
    },
    {
      number: 5,
      name: 'Jungle Tunnel',
      par: 4,
      lengthYards: 380,
      fairwayWidthYards: 32,
      roughWidthYards: 14,
      terrain: { startElevationMeters: 0, endElevationMeters: -1 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 380 }
      ],
      green: { xYards: 0, radiusYards: 19, fringeYards: 4, raisedMeters: 0, slope: { x: -0.01, z: 0.01 },
        design: { shape: { stretchX: .9, stretchZ: 1.12, turn: 0, lobes: [[2, .05, 1.1], [3, .04, .2], [4, .035, 1.7]] }, contours: [{ type: 'tier', dir: [1, 0], at: .1, width: .14, height: .38 }, { type: 'bowl', x: -.35, z: .3, size: .24, depth: .1 }] } },
      bunkers: [
        { xYards: -18, distanceYards: 252, radiusXYards: 5, radiusZYards: 7 },
        { xYards: 20, distanceYards: 364, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        { xYards: -25, distanceYards: 60, count: 5, spreadYards: 240, heightMin: 10, heightMax: 13, kind: 'mixed' },
        { xYards: 25, distanceYards: 70, count: 5, spreadYards: 240, heightMin: 10, heightMax: 13, kind: 'mixed' }
      ]
    },
    {
      number: 6,
      name: 'Beach Break',
      par: 3,
      lengthYards: 170,
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 3, endElevationMeters: 4 },
      seaLevelMeters: 0.6,
      windBoost: 1.25,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 170 }
      ],
      green: { xYards: 0, radiusYards: 20, fringeYards: 4, raisedMeters: 1, slope: { x: 0.006, z: 0.012 },
        design: { shape: { stretchX: 1.2, stretchZ: .85, turn: -.15, lobes: [[2, .05, .9], [3, .05, 2.2], [4, .03, .5]] }, contours: [{ type: 'crown', x: 0, z: .1, size: .5, height: .26 }, { type: 'bowl', x: .42, z: -.3, size: .22, depth: .1 }] } },
      bunkers: [
        { xYards: -22, distanceYards: 150, radiusXYards: 6, radiusZYards: 6 },
        { xYards: 32, distanceYards: 183, radiusXYards: 5, radiusZYards: 5 }
      ],
      water: [],
      ocean: [
        { xYards: 0, distanceYards: 2228, radiusYards: 2000, cliff: false, beachYards: 12 }
      ],
      treeClusters: [
        { xYards: -34, distanceYards: 20, count: 5, spreadYards: 120, heightMin: 8, heightMax: 11, kind: 'palm' },
        { xYards: 34, distanceYards: 25, count: 5, spreadYards: 120, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 7,
      name: 'Cliffside',
      par: 4,
      lengthYards: 410,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 8, endElevationMeters: 7 },
      seaLevelMeters: 0,
      windBoost: 1.35,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 190 },
        { xYards: -5, distanceYards: 300 },
        { xYards: -8, distanceYards: 410 }
      ],
      green: { xYards: -8, radiusYards: 18, fringeYards: 4, raisedMeters: 0, slope: { x: -0.012, z: 0.008 },
        design: { shape: { stretchX: 1.0, stretchZ: 1.15, turn: .5, lobes: [[2, .06, .5], [3, .05, 1.9], [5, .025, 1.2]] }, contours: [{ type: 'tier', dir: [1, 0], at: -.05, width: .15, height: .34 }, { type: 'crown', x: -.35, z: .3, size: .26, height: .14 }] } },
      bunkers: [
        { xYards: 23, distanceYards: 252, radiusXYards: 6, radiusZYards: 8 },
        { xYards: 17, distanceYards: 394, radiusXYards: 5, radiusZYards: 5 }
      ],
      water: [],
      ocean: [
        { xYards: -2038, distanceYards: 205, radiusYards: 2000, cliff: true }
      ],
      treeClusters: [
        { xYards: 33, distanceYards: 30, count: 8, spreadYards: 330, heightMin: 8, heightMax: 12, kind: 'palm' }
      ]
    },
    {
      number: 8,
      name: 'Reef Carry',
      par: 4,
      lengthYards: 320,
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 3, endElevationMeters: 2 },
      seaLevelMeters: -1.2,
      windBoost: 1.25,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 200 },
        { xYards: -6, distanceYards: 320 }
      ],
      green: { xYards: -6, radiusYards: 19, fringeYards: 4, raisedMeters: .3, slope: { x: 0.01, z: 0.01 },
        design: { shape: { stretchX: 1.1, stretchZ: .92, turn: -.6, lobes: [[2, .05, 1.7], [3, .05, .6], [4, .03, 2.3]] }, contours: [{ type: 'crown', x: -.3, z: 0, size: .36, height: .22 }, { type: 'bowl', x: .38, z: .25, size: .24, depth: .12 }] } },
      bunkers: [
        { xYards: -28, distanceYards: 205, radiusXYards: 6, radiusZYards: 7 },
        { xYards: 22, distanceYards: 336, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: 95, distanceYards: 95, radiusYards: 105, cliff: true }
      ],
      treeClusters: [
        { xYards: -34, distanceYards: 40, count: 6, spreadYards: 240, heightMin: 8, heightMax: 11, kind: 'palm' },
        { xYards: 34, distanceYards: 225, count: 4, spreadYards: 80, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 9,
      name: 'Sunset Finish',
      par: 4,
      lengthYards: 390,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 2, endElevationMeters: 1.5 },
      windBoost: 1.3,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 220 },
        { xYards: 6, distanceYards: 320 },
        { xYards: 10, distanceYards: 390 }
      ],
      green: { xYards: 10, radiusYards: 19, fringeYards: 4, raisedMeters: .3, slope: { x: -0.008, z: 0.01 },
        design: { shape: { stretchX: .95, stretchZ: 1.1, turn: .3, lobes: [[2, .06, 2.0], [3, .04, 1.0], [5, .025, .2]] }, contours: [{ type: 'tier', dir: [-1, -1], at: .05, width: .15, height: .32 }, { type: 'crown', x: .35, z: .35, size: .24, height: .12 }] } },
      bunkers: [
        { xYards: -25, distanceYards: 240, radiusXYards: 6, radiusZYards: 8 },
        { xYards: -17, distanceYards: 377, radiusXYards: 5, radiusZYards: 5 }
      ],
      water: [],
      ocean: [
        { xYards: 2052, distanceYards: 200, radiusYards: 2000, cliff: false, beachYards: 12 }
      ],
      treeClusters: [
        { xYards: -33, distanceYards: 30, count: 8, spreadYards: 330, heightMin: 8, heightMax: 12, kind: 'palm' }
      ]
    },
    // ---------- back nine: up on the headland ----------
    {
      number: 10,
      name: 'Trade Winds',
      par: 4,
      lengthYards: 405,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 22, endElevationMeters: 12 },
      seaLevelMeters: 0,
      windBoost: 1.45,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 200 },
        { xYards: 6, distanceYards: 320 },
        { xYards: 10, distanceYards: 405 }
      ],
      green: { xYards: 10, radiusYards: 19, fringeYards: 4, raisedMeters: .3, slope: { x: 0.01, z: 0.008 },
        design: { shape: { stretchX: 1.05, stretchZ: .95, turn: .3, lobes: [[2, .05, .8], [3, .05, 2.0], [4, .03, .4]] }, contours: [{ type: 'tier', dir: [-1, 0], at: .05, width: .15, height: .3 }, { type: 'bowl', x: .35, z: -.3, size: .24, depth: .1 }] } },
      bunkers: [
        { xYards: -24, distanceYards: 245, radiusXYards: 7, radiusZYards: 8 },
        { xYards: -17, distanceYards: 392, radiusXYards: 5, radiusZYards: 5 },
        { xYards: 34, distanceYards: 420, radiusXYards: 4, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: 2040, distanceYards: 230, radiusYards: 2000, cliff: true, clearYards: 25 }
      ],
      treeClusters: [
        { xYards: -34, distanceYards: 30, count: 7, spreadYards: 330, heightMin: 8, heightMax: 12, kind: 'palm' }
      ]
    },
    {
      number: 11,
      name: 'Blowhole',
      par: 3,
      lengthYards: 185,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 24, endElevationMeters: 18.5 },
      seaLevelMeters: 0,
      windBoost: 1.55,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 185 }
      ],
      green: { xYards: 0, radiusYards: 18, fringeYards: 4, raisedMeters: .4, slope: { x: -0.008, z: 0.01 },
        design: { shape: { stretchX: 1.0, stretchZ: 1.0, turn: -.2, lobes: [[2, .04, 1.5], [3, .05, .7], [5, .03, 2.2]] }, contours: [{ type: 'crown', x: -.2, z: .1, size: .45, height: .26 }, { type: 'bowl', x: .4, z: .35, size: .2, depth: .1 }] } },
      bunkers: [
        { xYards: -25, distanceYards: 182, radiusXYards: 5, radiusZYards: 6 },
        { xYards: 10, distanceYards: 207, radiusXYards: 6, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: 18, distanceYards: 98, radiusYards: 50, cliff: true },
        { xYards: 2058, distanceYards: 120, radiusYards: 2000, cliff: true, clearYards: 25 }
      ],
      treeClusters: [
        { xYards: -38, distanceYards: 40, count: 5, spreadYards: 120, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 12,
      name: 'Ridge Run',
      par: 5,
      lengthYards: 545,
      fairwayWidthYards: 38,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 14, endElevationMeters: 28 },
      seaLevelMeters: 0,
      windBoost: 1.5,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 6, distanceYards: 220 },
        { xYards: -4, distanceYards: 400 },
        { xYards: 4, distanceYards: 545 }
      ],
      green: { xYards: 4, radiusYards: 20, fringeYards: 4, raisedMeters: .5, slope: { x: 0.008, z: 0.012 },
        design: { shape: { stretchX: 1.05, stretchZ: 1.0, turn: .6, lobes: [[2, .06, .4], [3, .05, 1.6], [4, .03, 2.6]] }, contours: [{ type: 'falseFront', at: .6, width: .12, drop: .3 }, { type: 'crown', x: .25, z: -.3, size: .3, height: .18 }] } },
      bunkers: [
        { xYards: 24, distanceYards: 270, radiusXYards: 7, radiusZYards: 8 },
        { xYards: -12, distanceYards: 430, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 32, distanceYards: 532, radiusXYards: 5, radiusZYards: 5 }
      ],
      water: [],
      ocean: [
        { xYards: -2046, distanceYards: 280, radiusYards: 2000, cliff: true, clearYards: 25 }
      ],
      treeClusters: [
        { xYards: 32, distanceYards: 40, count: 7, spreadYards: 260, heightMin: 8, heightMax: 12, kind: 'palm' },
        { xYards: 30, distanceYards: 330, count: 6, spreadYards: 180, heightMin: 9, heightMax: 12, kind: 'mixed' }
      ]
    },
    {
      number: 13,
      name: 'Lookout Point',
      par: 4,
      lengthYards: 355,
      fairwayWidthYards: 38,
      roughWidthYards: 18,
      terrain: { startElevationMeters: 20, endElevationMeters: 30 },
      seaLevelMeters: 0,
      windBoost: 1.6,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 210 },
        { xYards: -6, distanceYards: 355 }
      ],
      green: { xYards: -6, radiusYards: 18, fringeYards: 4, raisedMeters: .6, slope: { x: 0.006, z: -0.01 },
        design: { shape: { stretchX: 1.0, stretchZ: .9, turn: .9, lobes: [[2, .05, 2.2], [3, .04, 1.2], [5, .03, .5]] }, contours: [{ type: 'ridge', from: [-.6, -.4], to: [.55, .5], width: .2, height: .16 }, { type: 'bowl', x: -.35, z: .35, size: .22, depth: .1 }] } },
      bunkers: [
        { xYards: 22, distanceYards: 230, radiusXYards: 6, radiusZYards: 8 },
        { xYards: -28, distanceYards: 340, radiusXYards: 5, radiusZYards: 6 },
        { xYards: 18, distanceYards: 346, radiusXYards: 5, radiusZYards: 5 }
      ],
      water: [],
      ocean: [
        { xYards: -6, distanceYards: 2389, radiusYards: 2000, cliff: true },
        { xYards: -2050, distanceYards: 300, radiusYards: 2000, cliff: true, clearYards: 25 }
      ],
      treeClusters: [
        { xYards: 32, distanceYards: 40, count: 6, spreadYards: 250, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 14,
      name: 'Whale Watch',
      par: 4,
      lengthYards: 425,
      greenDistanceYards: 420,  // card yardage follows the fairway round the bay; this is the straight line to the green
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 16, endElevationMeters: 14 },
      seaLevelMeters: 0,
      windBoost: 1.45,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 200 },
        { xYards: -40, distanceYards: 330 },
        { xYards: -55, distanceYards: 420 }
      ],
      green: { xYards: -55, radiusYards: 19, fringeYards: 4, raisedMeters: .3, slope: { x: -0.01, z: 0.008 },
        design: { shape: { stretchX: 1.1, stretchZ: .92, turn: -.5, lobes: [[2, .05, 1.0], [3, .06, .2], [4, .03, 1.9]] }, contours: [{ type: 'tier', dir: [0, -1], at: 0, width: .15, height: .34 }, { type: 'crown', x: .35, z: .3, size: .24, height: .12 }] } },
      bunkers: [
        { xYards: 12, distanceYards: 225, radiusXYards: 6, radiusZYards: 8 },
        { xYards: -33, distanceYards: 438, radiusXYards: 5, radiusZYards: 5 },
        { xYards: -76, distanceYards: 400, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: -110, distanceYards: 200, radiusYards: 82, cliff: true },
        { xYards: -2095, distanceYards: 380, radiusYards: 2000, cliff: true, clearYards: 20 }
      ],
      treeClusters: [
        { xYards: 32, distanceYards: 60, count: 6, spreadYards: 240, heightMin: 8, heightMax: 12, kind: 'palm' },
        { xYards: -34, distanceYards: 50, count: 3, spreadYards: 60, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 15,
      name: 'Crater Rim',
      par: 3,
      lengthYards: 160,
      fairwayWidthYards: 42,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 26, endElevationMeters: 21 },
      seaLevelMeters: 0,
      windBoost: 1.35,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 160 }
      ],
      green: { xYards: 0, radiusYards: 19, fringeYards: 4, raisedMeters: .3, slope: { x: 0.008, z: 0.01 },
        design: { shape: { stretchX: 1.0, stretchZ: .9, turn: .1, lobes: [[2, .05, .3], [3, .05, 1.5], [5, .03, 2.4]] }, contours: [{ type: 'bowl', x: 0, z: .05, size: .45, depth: .16 }, { type: 'crown', x: -.4, z: -.35, size: .22, height: .12 }] } },
      bunkers: [
        { xYards: 28, distanceYards: 163, radiusXYards: 5, radiusZYards: 6 },
        { xYards: -16, distanceYards: 180, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [
        { xYards: -14, distanceYards: 110, radiusXYards: 24, radiusZYards: 22 }
      ],
      ocean: [
        { xYards: 0, distanceYards: 2200, radiusYards: 2000, cliff: true },
        { xYards: 2070, distanceYards: 120, radiusYards: 2000, cliff: true, clearYards: 25 }
      ],
      treeClusters: [
        { xYards: -40, distanceYards: 20, count: 5, spreadYards: 110, heightMin: 8, heightMax: 11, kind: 'palm' }
      ]
    },
    {
      number: 16,
      name: 'Pali Drop',
      par: 4,
      lengthYards: 395,
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 34, endElevationMeters: 4 },
      seaLevelMeters: 0,
      windBoost: 1.4,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 265 },
        { xYards: -8, distanceYards: 395 }
      ],
      green: { xYards: -8, radiusYards: 20, fringeYards: 4, raisedMeters: .3, slope: { x: -0.008, z: 0.01 },
        design: { shape: { stretchX: 1.08, stretchZ: .95, turn: .4, lobes: [[2, .06, 1.9], [3, .04, .8], [4, .03, .1]] }, contours: [{ type: 'tier', dir: [1, 1], at: .05, width: .15, height: .3 }, { type: 'bowl', x: -.35, z: .3, size: .22, depth: .1 }] } },
      bunkers: [
        { xYards: 20, distanceYards: 275, radiusXYards: 7, radiusZYards: 8 },
        { xYards: -37, distanceYards: 386, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 17, distanceYards: 409, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: -8, distanceYards: 2437, radiusYards: 2000, cliff: false, beachYards: 14 },
        { xYards: 2060, distanceYards: 195, radiusYards: 2000, cliff: true, clearYards: 20 }
      ],
      treeClusters: [
        { xYards: -34, distanceYards: 40, count: 7, spreadYards: 280, heightMin: 8, heightMax: 12, kind: 'mixed' }
      ]
    },
    {
      number: 17,
      name: 'Seabird Cliffs',
      par: 5,
      lengthYards: 530,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 8, endElevationMeters: 12 },
      seaLevelMeters: 0,
      windBoost: 1.65,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -8, distanceYards: 200 },
        { xYards: 4, distanceYards: 380 },
        { xYards: 12, distanceYards: 530 }
      ],
      green: { xYards: 12, radiusYards: 19, fringeYards: 4, raisedMeters: .4, slope: { x: -0.01, z: 0.01 },
        design: { shape: { stretchX: .95, stretchZ: 1.1, turn: -.3, lobes: [[2, .05, .6], [3, .05, 2.3], [5, .025, 1.0]] }, contours: [{ type: 'crown', x: .3, z: .2, size: .36, height: .22 }, { type: 'bowl', x: -.38, z: -.28, size: .24, depth: .12 }] } },
      bunkers: [
        { xYards: -26, distanceYards: 250, radiusXYards: 7, radiusZYards: 8 },
        { xYards: 10, distanceYards: 330, radiusXYards: 6, radiusZYards: 5 },
        { xYards: -13, distanceYards: 517, radiusXYards: 5, radiusZYards: 6 },
        { xYards: 33, distanceYards: 545, radiusXYards: 4, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: 2046, distanceYards: 430, radiusYards: 2000, cliff: true, clearYards: 25 }
      ],
      treeClusters: [
        { xYards: -34, distanceYards: 40, count: 8, spreadYards: 330, heightMin: 8, heightMax: 12, kind: 'palm' }
      ]
    },
    {
      number: 18,
      name: 'Kai Point',
      par: 4,
      lengthYards: 440,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 10, endElevationMeters: 6 },
      seaLevelMeters: 0,
      windBoost: 1.5,
      openHorizon: true,
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 240 },
        { xYards: -6, distanceYards: 360 },
        { xYards: -12, distanceYards: 440 }
      ],
      green: { xYards: -12, radiusYards: 19, fringeYards: 4, raisedMeters: .4, slope: { x: 0.008, z: 0.01 },
        design: { shape: { stretchX: 1.0, stretchZ: .95, turn: .2, lobes: [[2, .06, 1.3], [3, .05, .5], [4, .03, 2.0]] }, contours: [{ type: 'tier', dir: [-1, 0], at: .05, width: .15, height: .34 }, { type: 'ridge', from: [.1, -.6], to: [.3, .6], width: .18, height: .12 }] } },
      bunkers: [
        { xYards: 22, distanceYards: 255, radiusXYards: 7, radiusZYards: 9 },
        { xYards: 15, distanceYards: 426, radiusXYards: 5, radiusZYards: 6 },
        { xYards: -32, distanceYards: 420, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      ocean: [
        { xYards: -2042, distanceYards: 300, radiusYards: 2000, cliff: true, clearYards: 25 },
        { xYards: -12, distanceYards: 2476, radiusYards: 2000, cliff: true }
      ],
      treeClusters: [
        { xYards: 34, distanceYards: 40, count: 8, spreadYards: 330, heightMin: 8, heightMax: 12, kind: 'palm' }
      ]
    }
  ]
};
