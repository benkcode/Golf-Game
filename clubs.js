// Cartoon golf club models (Driver, 3-Wood, 7-Iron, Wedge, Putter) for Fairway Friends.
// Loaded after Three.js. See GolfClubs.createClub(type, options).
(function (root) {
  'use strict';

  const SPECS = {
    driver: {
      name: 'Driver', kind: 'wood', length: 1.15, loft: 10.5, lie: 58,
      head: { w: 0.125, h: 0.066, d: 0.115 },
      crown: 0x1E3A8A, stripe: 0xF2542D, face: 0xC7D1DB, sole: 0x9AA7B4,
      grip: 0x23272E, gripBand: 0xF2542D, shaft: 0x30343B
    },
    wood3: {
      name: '3-Wood', kind: 'wood', length: 1.08, loft: 15, lie: 59,
      head: { w: 0.105, h: 0.045, d: 0.09 },
      crown: 0x1D7A45, stripe: 0xFFD23F, face: 0xC7D1DB, sole: 0x9AA7B4,
      grip: 0x23272E, gripBand: 0xFFD23F, shaft: 0x30343B
    },
    iron7: {
      name: '7-Iron', kind: 'iron', length: 0.94, loft: 34, lie: 62,
      head: { w: 0.078, h: 0.05, t: 0.012 },
      metal: 0x9FB0C2, accent: 0x2E86DE, badge: 0x2E86DE, label: '7',
      grip: 0x23272E, gripBand: 0x2E86DE, shaft: 0xA9B4BF
    },
    wedge: {
      name: 'Wedge', kind: 'iron', length: 0.9, loft: 56, lie: 64,
      head: { w: 0.078, h: 0.06, t: 0.014 },
      metal: 0xE0A93F, accent: 0x9B5DE5, badge: 0x9B5DE5, label: '56',
      grip: 0x23272E, gripBand: 0x9B5DE5, shaft: 0xA9B4BF
    },
    putter: {
      name: 'Putter', kind: 'putter', length: 0.87, loft: 3, lie: 71,
      head: { r: 0.055, h: 0.026 },
      body: 0xE4432D, face: 0xD9E0E8, line: 0xFFFFFF,
      grip: 0xF4F4F4, gripBand: 0xE4432D, shaft: 0xA9B4BF
    }
  };

  const OUTLINE_COLOR = 0x15314B;
  const DEG = Math.PI / 180;

  // ---------- shared materials ----------
  let gradientMap = null;
  function getGradient() {
    if (gradientMap) return gradientMap;
    const data = new Uint8Array([80, 80, 80, 255, 165, 165, 165, 255, 255, 255, 255, 255]);
    gradientMap = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.needsUpdate = true;
    return gradientMap;
  }
  const matCache = {};
  function toon(color) {
    if (!matCache[color]) matCache[color] = new THREE.MeshToonMaterial({ color, gradientMap: getGradient() });
    return matCache[color];
  }
  let outlineMat = null;
  function outline(mesh, thickness) {
    if (!outlineMat) outlineMat = new THREE.MeshBasicMaterial({ color: OUTLINE_COLOR, side: THREE.BackSide });
    const o = new THREE.Mesh(mesh.geometry, outlineMat);
    o.scale.setScalar(1 + (thickness || 0.08));
    o.name = 'outline';
    mesh.add(o);
    return mesh;
  }
  function mesh(geo, color, name) {
    const m = new THREE.Mesh(geo, toon(color));
    m.name = name || '';
    m.castShadow = true;
    return m;
  }

  // Badge with a number, drawn on a canvas
  function badgeTexture(text, color) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#' + color.toString(16).padStart(6, '0');
    g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.fill();
    g.lineWidth = 8; g.strokeStyle = '#15314B'; g.stroke();
    g.fillStyle = '#FFFFFF';
    g.font = `bold ${text.length > 1 ? 58 : 76}px system-ui, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 64, 68);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4; if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // ---------- parts ----------
  function buildGrip(s, group, gripLen) {
    const r = s.kind === 'putter' ? 0.019 : 0.016;
    const grip = mesh(new THREE.CylinderGeometry(r, r * 0.8, gripLen, 16), s.grip, 'grip');
    grip.position.y = -gripLen / 2;
    group.add(outline(grip, 0.12));
    // colored bands
    [0.18, 0.55].forEach((f) => {
      const band = mesh(new THREE.CylinderGeometry(r * 1.06, r * 1.06, 0.018, 16), s.gripBand, 'gripBand');
      band.position.y = -gripLen * f;
      group.add(band);
    });
    const cap = mesh(new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), s.gripBand, 'gripCap');
    group.add(cap);
  }

  function buildShaft(s, group, top, bottom) {
    const len = top - bottom;
    const shaft = mesh(new THREE.CylinderGeometry(0.0085, 0.0055, len, 10), s.shaft, 'shaft');
    shaft.position.y = -(top + bottom) / 2;
    group.add(outline(shaft, 0.25));
    // a light stripe so the shaft reads as steel
    const shine = mesh(new THREE.CylinderGeometry(0.0035, 0.002, len * 0.9, 6), 0xFFFFFF, 'shaftShine');
    shine.position.set(-0.004, -(top + bottom) / 2, -0.004);
    group.add(shine);
  }

  function buildHosel(s, group, from, to, x) {
    const len = from - to;
    const hosel = mesh(new THREE.CylinderGeometry(0.0075, 0.011, len, 10), s.kind === 'wood' ? 0x30343B : (s.metal || s.face), 'hosel');
    hosel.position.set(x || 0, -(from + to) / 2, 0);
    group.add(outline(hosel, 0.2));
  }

  // Head space: origin = heel at the sole, face toward -Z, toe toward +X, sole at y = 0
  function buildWoodHead(s, k) {
    const head = new THREE.Group();
    const w = s.head.w * k, h = s.head.h * k, d = s.head.d * k;
    const cx = w * 0.46, cy = h * 0.5, cz = d * 0.02;

    const body = mesh(new THREE.SphereGeometry(1, 32, 20), s.crown, 'crown');
    body.scale.set(w / 2, h / 2, d / 2);
    body.position.set(cx, cy, cz);
    head.add(outline(body, 0.07));

    // racing stripe across the crown
    const stripe = mesh(new THREE.SphereGeometry(1, 24, 16), s.stripe, 'stripe');
    stripe.scale.set(w * 0.07, h * 0.515, d * 0.5);
    stripe.position.set(cx, cy + h * 0.004, cz + d * 0.005);
    head.add(stripe);

    // silver sole
    const sole = mesh(new THREE.SphereGeometry(1, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), s.sole, 'sole');
    sole.scale.set(w / 2 * 1.015, h / 2 * 1.025, d / 2 * 1.015);
    sole.position.set(cx, cy, cz);
    head.add(sole);

    // clubface: a flat silver lens set into the front of the head
    const faceGroup = new THREE.Group();
    faceGroup.position.set(cx, cy * 0.96, cz - d * 0.46);
    faceGroup.rotation.x = s.loft * DEG * 0.5;
    const face = mesh(new THREE.SphereGeometry(1, 28, 16), s.face, 'face');
    face.scale.set(w * 0.33, h * 0.33, d * 0.07);
    faceGroup.add(face);
    for (let i = -1; i <= 1; i++) {
      const groove = mesh(new THREE.BoxGeometry(w * 0.34, h * 0.03, 0.002), 0x5B6F80, 'groove');
      groove.position.set(0, i * h * 0.12, -d * 0.068);
      faceGroup.add(groove);
    }
    head.add(faceGroup);

    // alignment dot on the crown
    const dot = mesh(new THREE.SphereGeometry(1, 12, 8), 0xFFFFFF, 'alignDot');
    dot.scale.set(w * 0.035, h * 0.03, w * 0.035);
    dot.position.set(cx, h * 0.995, cz - d * 0.3);
    head.add(dot);

    return { head, hoselBottom: h * 0.45, width: w, height: h };
  }

  function buildIronHead(s, k) {
    const head = new THREE.Group();
    const L = s.head.w * k, H = s.head.h * k, T = s.head.t * k;

    // blade outline: flat sole, rounded toe, sloping top line
    const shape = new THREE.Shape();
    shape.moveTo(0, H * 0.08);
    shape.lineTo(L * 0.12, 0);
    shape.lineTo(L * 0.86, 0);
    shape.quadraticCurveTo(L * 1.04, 0, L * 1.03, H * 0.5);
    shape.quadraticCurveTo(L * 1.0, H * 1.0, L * 0.74, H * 0.97);
    shape.lineTo(L * 0.1, H * 0.62);
    shape.quadraticCurveTo(0, H * 0.58, 0, H * 0.08);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: T, bevelEnabled: true, bevelThickness: T * 0.25, bevelSize: T * 0.3, bevelSegments: 3, curveSegments: 16
    });
    // center the geometry so the outline scales evenly, then restore its position
    geo.computeBoundingBox();
    const bb = geo.boundingBox, c = new THREE.Vector3();
    bb.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);

    const blade = new THREE.Group();          // tilted back by the loft, set into the flat sole below
    blade.position.set(0, H * 0.06, T * 0.35);
    blade.rotation.x = s.loft * DEG * 0.6;
    const plate = mesh(geo, s.metal, 'blade');
    // bb was refreshed by translate(), so it is now centered: put the sole at y = 0 and the face at z = 0
    plate.position.set(c.x, -bb.min.y, -bb.min.z);
    blade.add(outline(plate, 0.05));

    // grooves on the face (face is the -Z side)
    for (let i = 0; i < 5; i++) {
      const groove = mesh(new THREE.BoxGeometry(L * 0.58, H * 0.022, 0.002), 0x6B7C8C, 'groove');
      groove.position.set(L * 0.5, H * (0.2 + i * 0.12), -0.0006);
      blade.add(groove);
    }

    // back of the head: a thick rounded sole (cavity back), a colored stripe and a number badge
    const bar = new THREE.Shape();
    bar.moveTo(L * 0.1, 0); bar.lineTo(L * 0.9, 0);
    bar.quadraticCurveTo(L * 0.99, 0, L * 0.97, H * 0.3);
    bar.lineTo(L * 0.14, H * 0.2);
    bar.quadraticCurveTo(L * 0.06, H * 0.18, L * 0.1, 0);
    const barGeo = new THREE.ExtrudeGeometry(bar, { depth: T * 0.8, bevelEnabled: true, bevelThickness: T * 0.25, bevelSize: T * 0.25, bevelSegments: 3, curveSegments: 12 });
    barGeo.computeBoundingBox();
    const bc = new THREE.Vector3(); barGeo.boundingBox.getCenter(bc); barGeo.translate(-bc.x, -bc.y, -bc.z);
    // the sole is NOT lofted, so it sits flat on the ground
    const soleBar = mesh(barGeo, s.metal, 'cavity');
    // (translate() refreshes the bounding box, so min.y is now minus half the height)
    soleBar.position.set(bc.x, -barGeo.boundingBox.min.y, T * 0.9);
    head.add(outline(soleBar, 0.05));
    const stripe = mesh(new THREE.BoxGeometry(L * 0.62, H * 0.05, 0.003), s.accent, 'accentStripe');
    stripe.position.set(L * 0.54, H * 0.14, T * 1.9);
    stripe.rotation.z = 0.12;
    head.add(stripe);
    const badge = new THREE.Mesh(
      new THREE.CircleGeometry(H * 0.2, 24),
      new THREE.MeshBasicMaterial({ map: badgeTexture(s.label, s.badge), transparent: true })
    );
    badge.name = 'badge';
    badge.position.set(L * 0.66, H * 0.56, T * 1.62);
    blade.add(badge);

    head.add(blade);
    return { head, hoselBottom: H * 0.35, width: L, height: H };
  }

  function buildPutterHead(s, k) {
    const head = new THREE.Group();
    const r = s.head.r * k, h = s.head.h * k;
    const cx = r * 0.87; // shaft enters near the heel

    // half-moon mallet: flat face at z = 0, rounded back toward +Z
    const body = mesh(new THREE.CylinderGeometry(r, r, h, 40, 1, false, -Math.PI / 2, Math.PI), s.body, 'mallet');
    body.position.set(cx, h / 2, 0.004);
    head.add(outline(body, 0.06));

    const face = mesh(new THREE.BoxGeometry(r * 2 * 0.98, h * 0.9, 0.006), s.face, 'face');
    face.position.set(cx, h / 2, 0.001);
    head.add(outline(face, 0.05));

    // white sight line and two dots on top, for lining up putts
    const line = mesh(new THREE.BoxGeometry(r * 0.08, 0.002, r * 0.85), s.line, 'sightLine');
    line.position.set(cx, h + 0.001, r * 0.45);
    head.add(line);
    [-0.35, 0.35].forEach((f) => {
      const dot = mesh(new THREE.CylinderGeometry(r * 0.09, r * 0.09, 0.003, 16), s.line, 'sightDot');
      dot.position.set(cx + r * f, h + 0.001, r * 0.55);
      head.add(dot);
    });

    // small collar where the shaft enters the heel
    const collar = mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.012, 12), s.face, 'collar');
    collar.position.set(0, h + 0.004, 0);
    head.add(outline(collar, 0.15));

    return { head, hoselBottom: h, width: r * 2, height: h };
  }

  // ---------- main ----------
  function createClub(type, options) {
    // options: headScale, length (grip top to sole), flatSole (sole flat with a vertical shaft)
    let s = SPECS[type];
    if (!s) throw new Error('Unknown club: ' + type);
    const opts = Object.assign({ headScale: 2.2 }, options || {});
    const k = opts.headScale;
    if (opts.length) s = Object.assign({}, s, { length: opts.length });

    const club = new THREE.Group();
    club.name = 'club_' + type;
    const gripLen = s.kind === 'putter' ? 0.25 : 0.27;
    buildGrip(s, club, gripLen);

    let built;
    if (s.kind === 'wood') built = buildWoodHead(s, k);
    else if (s.kind === 'iron') built = buildIronHead(s, k);
    else built = buildPutterHead(s, k);

    // The head is pre-tilted so the sole is flat when the club is set at its lie angle
    const tilt = opts.flatSole ? 0 : (90 - s.lie) * DEG;
    const headPivot = new THREE.Group();
    headPivot.name = 'head';
    headPivot.position.set(0, -s.length, 0);
    headPivot.rotation.z = -tilt;
    headPivot.add(built.head);
    club.add(headPivot);

    const hoselLen = s.kind === 'putter' ? 0.04 : 0.07;
    const hoselBottom = -s.length + built.hoselBottom;
    buildShaft(s, club, gripLen, s.length - built.hoselBottom - hoselLen);
    buildHosel(s, club, s.length - built.hoselBottom - hoselLen, s.length - built.hoselBottom);

    club.userData = {
      type, name: s.name, loft: s.loft, lie: s.lie, length: s.length,
      addressTilt: tilt,          // club.rotation.z = addressTilt at address
      head: headPivot,
      hoselBottom
    };
    return club;
  }

  const TYPES = ['driver', 'wood3', 'iron7', 'wedge', 'putter'];
  root.GolfClubs = { createClub, SPECS, TYPES };
})(typeof window !== 'undefined' ? window : this);
