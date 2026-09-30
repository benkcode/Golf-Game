// Kai Lagoon: a 9-hole island course (same authoring format as course-data.js; distances in yards).
// Extra fields used here:
//   ocean:   the sea, as a very large circle (so the shoreline is nearly straight along the hole).
//            { xYards, distanceYards, radiusYards, cliff }  cliff: true = rocky drop, false = sandy beach (beachYards wide)
//   seaLevelMeters: height of the sea (defaults to a little below the lowest point of the hole)
//   windBoost: coastal holes are breezier (the wind speed is multiplied by this)
//   treeClusters kind: 'palm' (coconut palms) or 'canopy' (broad jungle trees); anything outside the rough is jungle
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
        { xYards: 36, distanceYards: 300, count: 4, spreadYards: 60, heightMin: 9, heightMax: 12, kind: 'canopy' }
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
        { xYards: -31, distanceYards: 30, count: 7, spreadYards: 150, heightMin: 9, heightMax: 13, kind: 'canopy' },
        { xYards: 31, distanceYards: 40, count: 6, spreadYards: 140, heightMin: 9, heightMax: 13, kind: 'canopy' },
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
        { xYards: -25, distanceYards: 60, count: 5, spreadYards: 240, heightMin: 10, heightMax: 13, kind: 'canopy' },
        { xYards: 25, distanceYards: 70, count: 5, spreadYards: 240, heightMin: 10, heightMax: 13, kind: 'canopy' }
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
    }
  ]
};
