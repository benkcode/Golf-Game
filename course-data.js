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
        { xYards: -11, distanceYards: 304, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 11, distanceYards: 303, radiusXYards: 6, radiusZYards: 5 }
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
        { xYards: 26, distanceYards: 114, radiusXYards: 7, radiusZYards: 6 }
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
        { xYards: -13, distanceYards: 502, radiusXYards: 7, radiusZYards: 5 },
        { xYards: 13, distanceYards: 502, radiusXYards: 7, radiusZYards: 5 }
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
        design: { shape: { stretchX: 1.15, stretchZ: .88, turn: -.3, lobes: [[2, .05, .3], [3, .06, 2.2], [4, .03, 1.0]] }, contours: [{ type: 'falseFront', at: .58, width: .13, drop: .38 }, { type: 'crown', x: -.3, z: -.12, size: .34, height: .26 }, { type: 'bowl', x: .4, z: -.35, size: .25, depth: .12 }] } },
      bunkers: [
        { xYards: -10, distanceYards: 364, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 19, distanceYards: 370, radiusXYards: 5, radiusZYards: 4 }
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
        { xYards: -16, distanceYards: 137, radiusXYards: 7, radiusZYards: 5 }
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
        { xYards: 21, distanceYards: 383, radiusXYards: 6, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -31, distanceYards: 24, count: 8, spreadYards: 165, heightMin: 6, heightMax: 10 },
        { xYards: 31, distanceYards: 25, count: 8, spreadYards: 155, heightMin: 6, heightMax: 10 },
        { xYards: 31, distanceYards: 168, count: 11, spreadYards: 70, heightMin: 8, heightMax: 10 },  // the corner trees guard the shortcut from the inside rough
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
        { xYards: -14, distanceYards: 384, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 15, distanceYards: 384, radiusXYards: 5, radiusZYards: 4 }
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
        { xYards: -13, distanceYards: 474, radiusXYards: 7, radiusZYards: 5 },
        { xYards: 12, distanceYards: 476, radiusXYards: 7, radiusZYards: 5 }
      ],
      water: [],
      treeClusters: [
        { xYards: -33, distanceYards: 25, count: 9, spreadYards: 180, heightMin: 6, heightMax: 10 },
        { xYards: 33, distanceYards: 25, count: 9, spreadYards: 180, heightMin: 6, heightMax: 10 },
        { xYards: -38, distanceYards: 260, count: 8, spreadYards: 205, heightMin: 7, heightMax: 10 },
        { xYards: 38, distanceYards: 260, count: 8, spreadYards: 205, heightMin: 7, heightMax: 10 }
      ]
    },
    // ---------- back nine ----------
    {
      number: 10,
      name: "Split Decision",
      par: 4,
      lengthYards: 375,
      greenDistanceYards: 372,  // card yardage follows the fairway; this is the straight line to the green
      fairwayWidthYards: 44,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: 1.2 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 130 },
        { xYards: -8, distanceYards: 215 },
        { xYards: 6, distanceYards: 300 },
        { xYards: 6, distanceYards: 372 }
      ],
      green: { xYards: 6, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: 0.01, z: -0.006 },
        design: { shape: { stretchX: 1.1, stretchZ: .92, turn: -.45, lobes: [[2, .05, 1.4], [3, .06, .3], [5, .025, 2.4]] }, contours: [{ type: 'ridge', from: [-.65, .45], to: [.6, -.5], width: .2, height: .2 }, { type: 'bowl', x: -.42, z: -.45, size: .26, depth: .18 }] } },
      bunkers: [
        { xYards: -3, distanceYards: 215, radiusXYards: 7, radiusZYards: 7 },
        { xYards: -15, distanceYards: 350, radiusXYards: 6, radiusZYards: 4 },
        { xYards: 32, distanceYards: 391, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        {xYards: -33, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -33, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -33, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -39, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -34, distanceYards: 255, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 33, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 9},
        {xYards: 33, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 9},
        {xYards: 33, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 9},
        {xYards: 27, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 9},
        {xYards: 32, distanceYards: 255, count: 5, spreadYards: 54, heightMin: 6, heightMax: 9},
        {xYards: -30, distanceYards: 320, count: 4, spreadYards: 54, heightMin: 7, heightMax: 10},
        {xYards: -30, distanceYards: 380, count: 4, spreadYards: 54, heightMin: 7, heightMax: 10},
        {xYards: 42, distanceYards: 320, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 42, distanceYards: 380, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10}
      ]
    },
    {
      number: 11,
      name: "Creekside Run",
      par: 5,
      lengthYards: 545,
      greenDistanceYards: 530,  // card yardage follows the fairway; this is the straight line to the green
      fairwayWidthYards: 44,
      roughWidthYards: 24,
      terrain: { startElevationMeters: 0, endElevationMeters: -2.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -16, distanceYards: 150 },
        { xYards: -36, distanceYards: 290 },
        { xYards: -12, distanceYards: 430 },
        { xYards: 10, distanceYards: 530 }
      ],
      green: { xYards: 10, radiusYards: 22, fringeYards: 5, raisedMeters: 0, slope: { x: -0.006, z: 0.008 },
        design: { shape: { stretchX: 1.28, stretchZ: .8, turn: .15, lobes: [[2, .04, .8], [3, .05, 2.1], [4, .03, .5]] }, contours: [{ type: 'crown', x: .05, z: 0, size: .5, height: .22 }] } },
      bunkers: [
        { xYards: -34, distanceYards: 250, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 36, distanceYards: 510, radiusXYards: 6, radiusZYards: 5 },
        { xYards: -14, distanceYards: 553, radiusXYards: 6, radiusZYards: 4 }
      ],
      water: [
        { xYards: -24, distanceYards: 400, radiusXYards: 17, radiusZYards: 7 },
        { xYards: 6, distanceYards: 418, radiusXYards: 19, radiusZYards: 7 },
        { xYards: 26, distanceYards: 270, radiusXYards: 11, radiusZYards: 9 }
      ],
      treeClusters: [
        {xYards: -36, distanceYards: 15, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -43, distanceYards: 80, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -49, distanceYards: 145, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -59, distanceYards: 210, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -68, distanceYards: 275, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -61, distanceYards: 340, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -50, distanceYards: 405, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -37, distanceYards: 470, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: 32, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 26, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 20, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 12, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 3, distanceYards: 305, count: 4, spreadYards: 54, heightMin: 7, heightMax: 11},
        {xYards: 8, distanceYards: 365, count: 4, spreadYards: 54, heightMin: 7, heightMax: 11},
        {xYards: 29, distanceYards: 458, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10}
      ]
    },
    {
      number: 12,
      name: "Quarry Drop",
      par: 3,
      lengthYards: 175,
      fairwayWidthYards: 40,
      roughWidthYards: 24,
      terrain: { startElevationMeters: 0, endElevationMeters: -6.0 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 175 }
      ],
      green: { xYards: 2, radiusYards: 21, fringeYards: 5, raisedMeters: 0, slope: { x: 0.0, z: -0.016 },
        design: { shape: { stretchX: 1.1, stretchZ: .95, turn: .2, lobes: [[2, .05, 2.2], [3, .05, .9], [4, .03, 1.6]] }, contours: [{ type: 'bowl', x: .42, z: -.05, size: .3, depth: .16 }, { type: 'falseFront', at: .6, width: .13, drop: .3 }, { type: 'crown', x: 1.25, z: .05, size: .38, height: .75 }] } },
      bunkers: [
        { xYards: -30, distanceYards: 162, radiusXYards: 7, radiusZYards: 6 },
        { xYards: 19, distanceYards: 150, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        {xYards: -33, distanceYards: 15, count: 5, spreadYards: 50, heightMin: 7, heightMax: 11},
        {xYards: -33, distanceYards: 70, count: 5, spreadYards: 50, heightMin: 7, heightMax: 11},
        {xYards: -33, distanceYards: 125, count: 5, spreadYards: 50, heightMin: 7, heightMax: 11},
        {xYards: 33, distanceYards: 15, count: 5, spreadYards: 50, heightMin: 7, heightMax: 11},
        {xYards: 33, distanceYards: 70, count: 5, spreadYards: 50, heightMin: 7, heightMax: 11},
        {xYards: 33, distanceYards: 125, count: 5, spreadYards: 50, heightMin: 7, heightMax: 11}
      ]
    },
    {
      number: 13,
      name: "The Switchback",
      par: 4,
      lengthYards: 430,
      greenDistanceYards: 415,  // card yardage follows the fairway; this is the straight line to the green
      fairwayWidthYards: 38,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: 4.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -20, distanceYards: 215 },
        { xYards: 32, distanceYards: 305 },
        { xYards: 30, distanceYards: 340 },
        { xYards: 8, distanceYards: 415 }
      ],
      green: { xYards: 8, radiusYards: 20, fringeYards: 4, raisedMeters: 0.5, slope: { x: 0.006, z: 0.008 },
        design: { shape: { stretchX: 1.05, stretchZ: .96, turn: .6, lobes: [[2, .05, 1.8], [3, .06, .7], [5, .025, 1.1]] }, contours: [{ type: 'tier', dir: [-.7, -.7], at: 0, width: .13, height: .45 }] } },
      bunkers: [
        { xYards: -36, distanceYards: 200, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 10, distanceYards: 262, radiusXYards: 7, radiusZYards: 6 },
        { xYards: -12, distanceYards: 395, radiusXYards: 6, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        {xYards: -32, distanceYards: 15, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: -38, distanceYards: 70, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: -43, distanceYards: 125, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: -48, distanceYards: 180, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: -40, distanceYards: 235, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -24, distanceYards: 263, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -8, distanceYards: 291, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -1, distanceYards: 319, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -4, distanceYards: 347, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: 29, distanceYards: 15, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: 23, distanceYards: 70, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: 18, distanceYards: 125, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: 13, distanceYards: 180, count: 5, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: 60, distanceYards: 300, count: 4, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: 57, distanceYards: 355, count: 4, spreadYards: 50, heightMin: 6, heightMax: 10}
      ]
    },
    {
      number: 14,
      name: "Risky Reach",
      par: 4,
      lengthYards: 315,
      greenDistanceYards: 292,  // card yardage follows the fairway; this is the straight line to the green
      fairwayWidthYards: 40,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: -1.0 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -26, distanceYards: 120 },
        { xYards: -46, distanceYards: 205 },
        { xYards: -22, distanceYards: 265 },
        { xYards: 0, distanceYards: 292 }
      ],
      green: { xYards: 0, radiusYards: 18, fringeYards: 4, raisedMeters: 0, slope: { x: 0.006, z: -0.004 },
        design: { shape: { stretchX: 1.15, stretchZ: .85, turn: -.55, lobes: [[2, .05, .6], [3, .05, 1.9], [4, .03, 2.8]] }, contours: [{ type: 'falseFront', at: .5, width: .13, drop: .3 }, { type: 'bowl', x: -.42, z: -.4, size: .28, depth: .18 }] } },
      bunkers: [
        { xYards: -28, distanceYards: 278, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 29, distanceYards: 303, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [
        { xYards: 4, distanceYards: 225, radiusXYards: 22, radiusZYards: 16 }
      ],
      treeClusters: [
        {xYards: -37, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -50, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -64, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -78, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -60, distanceYards: 255, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 30, distanceYards: 15, count: 4, spreadYards: 50, heightMin: 6, heightMax: 10},
        {xYards: 18, distanceYards: 70, count: 4, spreadYards: 50, heightMin: 6, heightMax: 10}
      ]
    },
    {
      number: 15,
      name: "Needle's Eye",
      par: 3,
      lengthYards: 205,
      fairwayWidthYards: 30,
      roughWidthYards: 18,
      terrain: { startElevationMeters: 0, endElevationMeters: 2.8 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 0, distanceYards: 205 }
      ],
      green: { xYards: 0, radiusYards: 20, fringeYards: 4, raisedMeters: 0, slope: { x: 0.004, z: -0.006 },
        design: { shape: { stretchX: .74, stretchZ: 1.45, turn: 0, lobes: [[4, .12, -1.5708], [3, .025, .4]] }, contours: [{ type: 'ridge', from: [-.7, 0], to: [.7, 0], width: .16, height: .2 }] } },
      bunkers: [
        { xYards: -25, distanceYards: 189, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 24, distanceYards: 221, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        {xYards: -20, distanceYards: 12, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: -20, distanceYards: 47, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: -20, distanceYards: 82, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: -20, distanceYards: 117, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: -20, distanceYards: 152, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 20, distanceYards: 12, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 20, distanceYards: 47, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 20, distanceYards: 82, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 20, distanceYards: 117, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 20, distanceYards: 152, count: 4, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: -37, distanceYards: 200, count: 3, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: -37, distanceYards: 235, count: 3, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 37, distanceYards: 200, count: 3, spreadYards: 32, heightMin: 8, heightMax: 12},
        {xYards: 37, distanceYards: 235, count: 3, spreadYards: 32, heightMin: 8, heightMax: 12}
      ]
    },
    {
      number: 16,
      name: "Crescent Lake",
      par: 5,
      lengthYards: 560,
      greenDistanceYards: 540,  // card yardage follows the fairway; this is the straight line to the green
      fairwayWidthYards: 44,
      roughWidthYards: 42,
      terrain: { startElevationMeters: 0, endElevationMeters: 0.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -26, distanceYards: 140 },
        { xYards: -52, distanceYards: 270 },
        { xYards: -42, distanceYards: 400 },
        { xYards: 8, distanceYards: 540 }
      ],
      green: { xYards: 8, radiusYards: 22, fringeYards: 5, raisedMeters: 0, slope: { x: 0.004, z: 0.004 },
        design: { shape: { stretchX: 1.05, stretchZ: 1.05, turn: .3, lobes: [[3, .13, .4], [2, .03, 1.2]] }, contours: [{ type: 'bowl', x: 0, z: .22, size: .38, depth: .2 }, { type: 'tier', dir: [0, -1], at: .32, width: .12, height: .35 }] } },
      bunkers: [
        { xYards: -76, distanceYards: 262, radiusXYards: 6, radiusZYards: 5 },
        { xYards: -14, distanceYards: 516, radiusXYards: 6, radiusZYards: 5 },
        { xYards: 33, distanceYards: 556, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [
        { xYards: 0, distanceYards: 300, radiusXYards: 20, radiusZYards: 26 },
        { xYards: 14, distanceYards: 400, radiusXYards: 17, radiusZYards: 22 }
      ],
      treeClusters: [
        {xYards: -38, distanceYards: 15, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -50, distanceYards: 80, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -62, distanceYards: 145, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -75, distanceYards: 210, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -87, distanceYards: 275, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -82, distanceYards: 340, count: 5, spreadYards: 58, heightMin: 6, heightMax: 10},
        {xYards: -80, distanceYards: 385, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -74, distanceYards: 413, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -64, distanceYards: 441, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -54, distanceYards: 469, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: -44, distanceYards: 497, count: 3, spreadYards: 25, heightMin: 6, heightMax: 10},
        {xYards: 32, distanceYards: 15, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 21, distanceYards: 75, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 19, distanceYards: 470, count: 4, spreadYards: 50, heightMin: 6, heightMax: 10}
      ]
    },
    {
      number: 17,
      name: "Bunker Alley",
      par: 4,
      lengthYards: 420,
      fairwayWidthYards: 42,
      roughWidthYards: 22,
      terrain: { startElevationMeters: 0, endElevationMeters: -0.8 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: -4, distanceYards: 200 },
        { xYards: 4, distanceYards: 330 },
        { xYards: 0, distanceYards: 420 }
      ],
      green: { xYards: 0, radiusYards: 20, fringeYards: 4, raisedMeters: 0.6, slope: { x: 0.004, z: 0.004 },
        design: { shape: { stretchX: 1.12, stretchZ: .92, turn: -.2, lobes: [[2, .04, .2], [3, .05, 1.5], [5, .02, 2.9]] }, contours: [{ type: 'crown', x: 0, z: -.05, size: .75, height: .14 }, { type: 'bowl', x: 0, z: .45, size: .3, depth: .12 }, { type: 'tier', dir: [0, -1], at: .55, width: .14, height: -.28 }] } },
      bunkers: [
        { xYards: -15, distanceYards: 215, radiusXYards: 7, radiusZYards: 7 },
        { xYards: 16, distanceYards: 245, radiusXYards: 7, radiusZYards: 7 },
        { xYards: -12, distanceYards: 300, radiusXYards: 6, radiusZYards: 6 },
        { xYards: 20, distanceYards: 400, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [],
      treeClusters: [
        {xYards: -33, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -34, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -36, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -37, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -34, distanceYards: 255, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -30, distanceYards: 315, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -31, distanceYards: 375, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 33, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 32, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 30, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 29, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 32, distanceYards: 255, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 36, distanceYards: 315, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 35, distanceYards: 375, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10}
      ]
    },
    {
      number: 18,
      name: "Homeward Bound",
      par: 4,
      lengthYards: 455,
      greenDistanceYards: 445,  // card yardage follows the fairway; this is the straight line to the green
      fairwayWidthYards: 42,
      roughWidthYards: 24,
      terrain: { startElevationMeters: 0, endElevationMeters: -5.5 },
      fairwayPath: [
        { xYards: 0, distanceYards: 0 },
        { xYards: 8, distanceYards: 200 },
        { xYards: -18, distanceYards: 330 },
        { xYards: -10, distanceYards: 385 },
        { xYards: 0, distanceYards: 445 }
      ],
      green: { xYards: 0, radiusYards: 22, fringeYards: 5, raisedMeters: 0, slope: { x: 0.0, z: 0.004 },
        design: { shape: { stretchX: 1.2, stretchZ: .86, turn: .1, lobes: [[2, .04, 1.6], [3, .05, .6], [4, .025, 2.2]] }, contours: [{ type: 'bowl', x: 0, z: .1, size: .55, depth: .28 }, { type: 'tier', dir: [0, -1], at: .55, width: .12, height: .3 }, { type: 'crown', x: -1.05, z: .05, size: .35, height: .45 }, { type: 'crown', x: 1.05, z: .05, size: .35, height: .45 }] } },
      bunkers: [
        { xYards: 34, distanceYards: 250, radiusXYards: 7, radiusZYards: 6 },
        { xYards: -37, distanceYards: 405, radiusXYards: 5, radiusZYards: 4 },
        { xYards: 30, distanceYards: 459, radiusXYards: 5, radiusZYards: 4 }
      ],
      water: [
        { xYards: 0, distanceYards: 403, radiusXYards: 24, radiusZYards: 8 }
      ],
      treeClusters: [
        {xYards: -33, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -31, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -29, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -26, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -37, distanceYards: 255, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -49, distanceYards: 315, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: -45, distanceYards: 375, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 36, distanceYards: 15, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 38, distanceYards: 75, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 40, distanceYards: 135, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 43, distanceYards: 195, count: 5, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 22, distanceYards: 300, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10},
        {xYards: 20, distanceYards: 360, count: 4, spreadYards: 54, heightMin: 6, heightMax: 10}
      ]
    }
  ]
};
