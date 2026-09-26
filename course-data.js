// Fairway Friends course authoring file.
// Distances and positions in this file are yards. The game converts them to meters.
// Green designs use the green's own frame: x runs left (-) to right (+) as you look at the green from the fairway,
// z runs back (-) to front (+), and positions and sizes are fractions of the green's radius. Heights are in meters.
//   shape:    stretchX / stretchZ squash the outline, turn rotates it (radians), lobes = [wave count, size, phase] bumps on the edge
//   crown:    a rounded hump (x, z, size, height)          bowl: a dip that collects balls (x, z, size, depth)
//   ridge:    a spine between two points (from, to, width, height)
//   tier:     a step up toward dir, placed 'at' along it (dir, at, width, height)   falseFront: the front edge falls away (at, width, drop)
// Pin positions are picked automatically from the flatter parts of each green; the pin of the day changes daily.
window.FAIRWAY_FRIENDS_COURSE_DATA = {
  yardToMeter: 0.9144,
  yardageMarkers: [200, 150, 100],
  holes: [
    {
      number: 1,
      name: 'Gentle Bend',
      par: 4,
      lengthYards: 350,
      fairwayWidthYards: 38,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: -3.2 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 175 },
        { xYards: -9, distanceYards: 250 },
        { xYards: -14, distanceYards: 350 }
      ],
      green: { xYards: -14, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: 0.018, z: -0.008 },
        design: { shape: { stretchX: 1.12, stretchZ: .9, turn: .35, lobes: [[2, .05, .4], [3, .06, 1.3], [5, .025, 2.2]] }, contours: [{ type: 'crown', x: .28, z: -.05, size: .42, height: .32 }, { type: 'bowl', x: -.38, z: -.42, size: .32, depth: .22 }] } },
      bunkers: [
        { xYards: -2, distanceYards: 326, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        { xYards: -29, distanceYards: 25, count: 9, spreadYards: 105, heightMin: 6, heightMax: 9 },
        { xYards: 29, distanceYards: 22, count: 9, spreadYards: 110, heightMin: 6, heightMax: 10 },
        { xYards: -32, distanceYards: 150, count: 8, spreadYards: 120, heightMin: 7, heightMax: 10 },
        { xYards: 32, distanceYards: 155, count: 8, spreadYards: 115, heightMin: 6, heightMax: 9 },
        { xYards: -34, distanceYards: 276, count: 8, spreadYards: 68, heightMin: 7, heightMax: 10 },
        { xYards: 34, distanceYards: 275, count: 8, spreadYards: 68, heightMin: 6, heightMax: 10 }
      ]
    },
    {
      number: 2,
      name: 'Front Door',
      par: 4,
      lengthYards: 330,
      fairwayWidthYards: 40,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 0, endElevationMeters: 0.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 330 }
      ],
      green: { xYards: 0, radiusYards: 21, fringeYards: 4, raisedMeters: 0, slope: { x: -0.012, z: 0.01 },
        design: { shape: { stretchX: .92, stretchZ: 1.12, turn: -.2, lobes: [[2, .04, 1.1], [3, .07, .2], [4, .03, 2.6]] }, contours: [{ type: 'falseFront', at: .52, width: .14, drop: .38 }, { type: 'ridge', from: [-.62, .25], to: [.55, -.5], width: .2, height: .16 }] } },
      bunkers: [
        { xYards: -8, distanceYards: 311, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 8, distanceYards: 311, radiusXYards: 6, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -31, distanceYards: 20, count: 10, spreadYards: 280, heightMin: 6, heightMax: 10 },
        { xYards: 31, distanceYards: 22, count: 10, spreadYards: 280, heightMin: 6, heightMax: 10 },
        { xYards: -38, distanceYards: 210, count: 7, spreadYards: 95, heightMin: 7, heightMax: 10 },
        { xYards: 38, distanceYards: 220, count: 7, spreadYards: 95, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 3,
      name: 'The Big Target',
      par: 3,
      lengthYards: 140,
      fairwayWidthYards: 46,
      roughWidthYards: 24,
      terrain: { startElevationMeters: 0, endElevationMeters: 0.3 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 140 }
      ],
      green: { xYards: 0, radiusYards: 28, fringeYards: 5, raisedMeters: 0, slope: { x: 0.009, z: -0.014 },
        design: { shape: { stretchX: 1.2, stretchZ: .86, turn: .1, lobes: [[2, .05, 2.0], [3, .05, .7], [5, .03, 1.5]] }, contours: [{ type: 'tier', dir: [0, -1], at: .02, width: .13, height: .48 }, { type: 'bowl', x: -.36, z: .42, size: .28, depth: .2 }, { type: 'crown', x: .45, z: -.45, size: .25, height: .15 }] } },
      bunkers: [
        { xYards: 14, distanceYards: 126, radiusXYards: 7, radiusZYards: 6 }
      ],
      water: [],
      treeClusters: [
        { xYards: -34, distanceYards: 20, count: 7, spreadYards: 105, heightMin: 6, heightMax: 9 },
        { xYards: 34, distanceYards: 18, count: 7, spreadYards: 110, heightMin: 6, heightMax: 9 },
        { xYards: -42, distanceYards: 105, count: 5, spreadYards: 45, heightMin: 7, heightMax: 10 },
        { xYards: 42, distanceYards: 105, count: 5, spreadYards: 7, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 4,
      name: 'Long Meadow',
      par: 5,
      lengthYards: 530,
      fairwayWidthYards: 44,
      roughWidthYards: 26,
      terrain: { startElevationMeters: 0, endElevationMeters: 1.2 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 3, distanceYards: 180 },
        { xYards: -2, distanceYards: 360 },
        { xYards: 0, distanceYards: 530 }
      ],
      green: { xYards: 0, radiusYards: 23, fringeYards: 5, raisedMeters: 0, slope: { x: -0.01, z: 0.006 },
        design: { shape: { stretchX: 1.05, stretchZ: 1, turn: 0, lobes: [[3, .08, .9], [2, .04, .1], [5, .03, 2.9]] }, contours: [{ type: 'bowl', x: .05, z: .05, size: .55, depth: .42 }, { type: 'crown', x: .5, z: -.5, size: .24, height: .2 }] } },
      bunkers: [
        { xYards: -12, distanceYards: 505, radiusXYards: 7, radiusZYards: 5 },
        { xYards: 12, distanceYards: 504, radiusXYards: 7, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -36, distanceYards: 30, count: 8, spreadYards: 160, heightMin: 6, heightMax: 9 },
        { xYards: 36, distanceYards: 26, count: 8, spreadYards: 160, heightMin: 6, heightMax: 9 },
        { xYards: -39, distanceYards: 260, count: 7, spreadYards: 230, heightMin: 7, heightMax: 10 },
        { xYards: 39, distanceYards: 270, count: 7, spreadYards: 225, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 5,
      name: 'Waterline',
      par: 4,
      lengthYards: 390,
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: -0.4 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 210 },
        { xYards: 5, distanceYards: 390 }
      ],
      green: { xYards: 5, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: 0.012, z: 0.009 },
        design: { shape: { stretchX: 1.15, stretchZ: .88, turn: -.3, lobes: [[2, .05, .3], [3, .06, 2.2], [4, .03, 1.0]] }, contours: [{ type: 'falseFront', at: .58, width: .13, drop: .32 }, { type: 'crown', x: -.3, z: -.12, size: .34, height: .26 }, { type: 'bowl', x: .4, z: -.35, size: .25, depth: .12 }] } },
      bunkers: [
        { xYards: -10, distanceYards: 364, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 18, distanceYards: 370, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [
        { xYards: 2, distanceYards: 346, radiusXYards: 27, radiusZYards: 10 }
      ],
      treeClusters: [
        { xYards: -31, distanceYards: 20, count: 9, spreadYards: 300, heightMin: 6, heightMax: 10 },
        { xYards: 32, distanceYards: 25, count: 9, spreadYards: 290, heightMin: 6, heightMax: 10 },
        { xYards: -42, distanceYards: 300, count: 6, spreadYards: 80, heightMin: 7, heightMax: 10 },
        { xYards: 42, distanceYards: 300, count: 6, spreadYards: 80, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 6,
      name: 'High Green',
      par: 3,
      lengthYards: 165,
      fairwayWidthYards: 44,
      roughWidthYards: 24,
      terrain: { startElevationMeters: 0, endElevationMeters: 1.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 165 }
      ],
      green: { xYards: 0, radiusYards: 23, fringeYards: 5, raisedMeters: 2, slope: { x: -0.006, z: -0.004 },
        design: { shape: { stretchX: .95, stretchZ: 1.08, turn: .5, lobes: [[2, .05, .8], [3, .05, 1.9], [4, .035, .4]] }, contours: [{ type: 'crown', x: 0, z: 0, size: .62, height: .48 }, { type: 'ridge', from: [-.2, .5], to: [.1, -.55], width: .18, height: .1 }] } },
      bunkers: [
        { xYards: -10, distanceYards: 147, radiusXYards: 7, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -35, distanceYards: 18, count: 7, spreadYards: 120, heightMin: 6, heightMax: 9 },
        { xYards: 35, distanceYards: 20, count: 7, spreadYards: 120, heightMin: 6, heightMax: 9 },
        { xYards: -42, distanceYards: 120, count: 5, spreadYards: 45, heightMin: 7, heightMax: 10 },
        { xYards: 42, distanceYards: 120, count: 5, spreadYards: 45, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 7,
      name: 'Corner Risk',
      par: 4,
      lengthYards: 410,
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: 0.4 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 185 },
        { xYards: 27, distanceYards: 275 },
        { xYards: 34, distanceYards: 410 }
      ],
      green: { xYards: 34, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: 0.01, z: -0.012 },
        design: { shape: { stretchX: 1.1, stretchZ: .95, turn: -.45, lobes: [[2, .06, 1.6], [3, .05, .5], [5, .025, .9]] }, contours: [{ type: 'tier', dir: [1, 0], at: 0, width: .14, height: .44 }, { type: 'bowl', x: .42, z: .36, size: .25, depth: .16 }, { type: 'crown', x: -.45, z: -.2, size: .25, height: .14 }] } },
      bunkers: [
        { xYards: 22, distanceYards: 386, radiusXYards: 6, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -31, distanceYards: 24, count: 8, spreadYards: 165, heightMin: 6, heightMax: 10 },
        { xYards: 31, distanceYards: 25, count: 8, spreadYards: 155, heightMin: 6, heightMax: 10 },
        { xYards: 16, distanceYards: 205, count: 13, spreadYards: 92, heightMin: 8, heightMax: 10 },
        { xYards: 43, distanceYards: 220, count: 10, spreadYards: 88, heightMin: 7, heightMax: 10 },
        { xYards: -40, distanceYards: 300, count: 7, spreadYards: 105, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 8,
      name: 'Island Window',
      par: 4,
      lengthYards: 360,
      fairwayWidthYards: 38,
      roughWidthYards: 20,
      terrain: { startElevationMeters: 0, endElevationMeters: -0.8 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -4, distanceYards: 210 },
        { xYards: 0, distanceYards: 360 }
      ],
      green: { xYards: 0, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: -0.01, z: -0.01 },
        design: { shape: { stretchX: .98, stretchZ: 1.05, turn: .2, lobes: [[2, .04, .5], [3, .05, 2.6], [4, .03, 1.7]] }, contours: [{ type: 'ridge', from: [0, .65], to: [.05, -.65], width: .2, height: .22 }, { type: 'bowl', x: -.02, z: -.5, size: .24, depth: .14 }] } },
      bunkers: [
        { xYards: -10, distanceYards: 335, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 10, distanceYards: 335, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [
        { xYards: -20, distanceYards: 337, radiusXYards: 13, radiusZYards: 16 },
        { xYards: 20, distanceYards: 337, radiusXYards: 13, radiusZYards: 16 },
        { xYards: 0, distanceYards: 328, radiusXYards: 22, radiusZYards: 7 }
      ],
      treeClusters: [
        { xYards: -30, distanceYards: 25, count: 9, spreadYards: 260, heightMin: 6, heightMax: 10 },
        { xYards: 30, distanceYards: 24, count: 9, spreadYards: 255, heightMin: 6, heightMax: 10 },
        { xYards: -37, distanceYards: 298, count: 7, spreadYards: 55, heightMin: 7, heightMax: 10 },
        { xYards: 37, distanceYards: 298, count: 7, spreadYards: 55, heightMin: 7, heightMax: 10 }
      ]
    },
    {
      number: 9,
      name: 'Summit Finish',
      par: 5,
      lengthYards: 500,
      fairwayWidthYards: 42,
      roughWidthYards: 24,
      terrain: { startElevationMeters: 0, endElevationMeters: 8.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -4, distanceYards: 190 },
        { xYards: 4, distanceYards: 350 },
        { xYards: 0, distanceYards: 500 }
      ],
      green: { xYards: 0, radiusYards: 22, fringeYards: 5, raisedMeters: 1, slope: { x: 0.014, z: -0.016 },
        design: { shape: { stretchX: 1.1, stretchZ: .95, turn: -.15, lobes: [[2, .05, 1.2], [3, .07, .4], [4, .03, 2.0]] }, contours: [{ type: 'tier', dir: [0, -1], at: .12, width: .13, height: .4 }, { type: 'tier', dir: [-1, 0], at: .3, width: .12, height: .22 }, { type: 'crown', x: .05, z: .45, size: .25, height: .14 }] } },
      bunkers: [
        { xYards: -12, distanceYards: 208, radiusXYards: 8, radiusZYards: 6 },
        { xYards: 12, distanceYards: 214, radiusXYards: 8, radiusZYards: 6 },
        { xYards: -12, distanceYards: 476, radiusXYards: 7, radiusZYards: 5 },
        { xYards: 12, distanceYards: 476, radiusXYards: 7, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -33, distanceYards: 25, count: 9, spreadYards: 180, heightMin: 6, heightMax: 10 },
        { xYards: 33, distanceYards: 25, count: 9, spreadYards: 180, heightMin: 6, heightMax: 10 },
        { xYards: -38, distanceYards: 260, count: 8, spreadYards: 205, heightMin: 7, heightMax: 10 },
        { xYards: 38, distanceYards: 260, count: 8, spreadYards: 205, heightMin: 7, heightMax: 10 }
      ]
    }
  ]
};
