/*
 * وارد — the scroll story.
 *
 * One carton, followed from the supplier's truck to a shop counter, in one
 * world: a warehouse, a yard, a street, and a small supermarket at the end of
 * it. The world is built and lit in Blender (marketing/blender/wared-story.blend),
 * baked, and shipped as two glTF files: assets/3d/core.glb (the warehouse, the
 * yard and everything that moves) and assets/3d/far.glb (the street's far end
 * and the shop), which loads once the reader is past the rack.
 *
 * The page pins the canvas and turns scroll into story time T (0..7, one unit
 * per beat); this file turns T into a frame. Nothing accumulates between
 * frames: poses(T) places the carton, the vehicles and the camera from T
 * alone, so scrolling back plays the story backwards and a still is just
 * render(k). The same poses(T) keys the Blender scene (tools/poses.mjs), so
 * the Cycles stills and the live page show the same moment.
 *
 * Beats (T = k at the end of beat k):
 *   1  the truck backs onto the dock, doors open
 *   2  the carton comes off onto the belt and is scanned (GRN)
 *   3  a forklift puts it on rack A, bin A-04 (the camera rises with it)
 *   4  the bin label counts it in: 24 -> 64
 *   5  an order: picked, carried to the van, loaded
 *   6  the van drives down the street to the shop
 *   7  at the counter: scanned, and the invoice prints with its QR
 *
 * Needs THREE (r128), THREE.GLTFLoader and MeshoptDecoder as globals.
 */
(function (root) {
  "use strict";

  var PI = Math.PI;
  function clamp01(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
  function seg(T, a, b) { return clamp01((T - a) / (b - a)); }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function inOut(u) { u = clamp01(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  function sine(u) { u = clamp01(u); return 0.5 - 0.5 * Math.cos(PI * u); }
  function outC(u) { u = clamp01(u); return 1 - Math.pow(1 - u, 3); }
  function inC(u) { u = clamp01(u); return u * u * u; }

  // Cubic Hermite through keyed values (Catmull-Rom tangents, uneven times).
  // C1 everywhere, so the camera never jerks when it passes a key.
  function spline(keys, T) {
    var n = keys.length;
    if (T <= keys[0][0]) return keys[0].slice(1);
    if (T >= keys[n - 1][0]) return keys[n - 1].slice(1);
    var i = 0;
    while (T > keys[i + 1][0]) i++;
    var k0 = keys[Math.max(0, i - 1)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(n - 1, i + 2)];
    var h = k2[0] - k1[0], u = (T - k1[0]) / h, u2 = u * u, u3 = u2 * u;
    var h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
    var out = [];
    for (var j = 1; j < k1.length; j++) {
      var m1 = i === 0 ? 0 : (k2[j] - k0[j]) / (k2[0] - k0[0]) * h;
      var m2 = i + 2 >= n ? 0 : (k3[j] - k1[j]) / (k3[0] - k1[0]) * h;
      out.push(h00 * k1[j] + h10 * m1 + h01 * k2[j] + h11 * m2);
    }
    return out;
  }

  // ------------------------------------------------------------------
  // Vehicle paths. A pose is the rear axle {x, z, h}; h = 0 faces +z.
  // A drive is a cubic Bezier whose ends follow the headings, so the
  // vehicle turns the way a vehicle turns (about its rear axle).
  // ------------------------------------------------------------------
  function dirOf(h) { return { x: Math.sin(h), z: Math.cos(h) }; }
  function drivePose(a, b, rev, u) {
    var L = Math.hypot(b.x - a.x, b.z - a.z) * 0.42;
    var s = rev ? -1 : 1, da = dirOf(a.h), db = dirOf(b.h);
    var p1 = { x: a.x + s * da.x * L, z: a.z + s * da.z * L };
    var p2 = { x: b.x - s * db.x * L, z: b.z - s * db.z * L };
    var v = 1 - u;
    var x = v * v * v * a.x + 3 * v * v * u * p1.x + 3 * v * u * u * p2.x + u * u * u * b.x;
    var z = v * v * v * a.z + 3 * v * v * u * p1.z + 3 * v * u * u * p2.z + u * u * u * b.z;
    var tx = 3 * v * v * (p1.x - a.x) + 6 * v * u * (p2.x - p1.x) + 3 * u * u * (b.x - p2.x);
    var tz = 3 * v * v * (p1.z - a.z) + 6 * v * u * (p2.z - p1.z) + 3 * u * u * (b.z - p2.z);
    var h = (tx * tx + tz * tz) < 1e-9 ? (u < 0.5 ? a.h : b.h) : Math.atan2(tx, tz) + (rev ? PI : 0);
    return { x: x, z: z, h: h };
  }
  // A list of steps over T. Each: [t0, t1, from, to, rev, fy0, fy1]; from/to
  // null means "stand still". Before the first step: its start; after the
  // last: its end.
  function track(steps, T) {
    var s = steps[0];
    if (T <= s[0]) return { x: s[2].x, z: s[2].z, h: s[2].h, fy: s[5] };
    for (var i = 0; i < steps.length; i++) {
      s = steps[i];
      var next = steps[i + 1];
      if (T <= s[1] || !next || T < next[0]) {
        var u = inOut(seg(T, s[0], s[1]));
        var p = s[3] ? drivePose(s[2], s[3], s[4], u) : { x: s[2].x, z: s[2].z, h: s[2].h };
        return { x: p.x, z: p.z, h: p.h, fy: lerp(s[5], s[6], u) };
      }
    }
    return null;
  }
  function local(pose, lx, ly, lz) {
    var s = Math.sin(pose.h), c = Math.cos(pose.h);
    return { x: pose.x + lx * c + lz * s, y: ly, z: pose.z - lx * s + lz * c };
  }

  // ------------------------------------------------------------------
  // The world's fixed points (metres; these match the Blender scene).
  // ------------------------------------------------------------------
  var CONV_Z = 7.5, CONV_TOP = 0.95;
  var CARTON_H = 0.468;                       // 54 x 51 x 47 cm: twelve 1.5 L bottles
  var FORK_TOP = 0.023;                       // tine top above the carriage origin
  var FORK_TO_CENTER = FORK_TOP + CARTON_H / 2;
  var REACH = 0.98;                           // forklift origin -> carton centre, carton on the backrest
  var SCAN_X = 16.5;
  var BIN = { x: 19.5, y: 3.4, z: -5.785 };   // A-04: bay 2, level 3, front slot
  var DECK = 0.075;                           // wire deck above the beam
  var STREET_Z = 18;
  var SCANNER = { x: -44.4, z: 11.45 };
  var COUNTER_TOP = 1.12;
  var DOLLY_SEAT = { y: 0.138 + CARTON_H / 2, z: -0.25 };   // on the nose plate, against the frame
  var DOLLY_START = { x: -36.0, z: 17.6, h: -PI / 2 };          // at the van's tail, facing the shop
  var DOLLY_END = { x: -43.3, z: 12.45, h: -PI / 2 - 1.35 };    // enters square through the shop front

  // Truck (supplier) and van (ours): rear-axle poses.
  var TRUCK_DOCK = { x: 20.6, z: CONV_Z, h: PI / 2 };   // cargo mouth lands on the belt end
  var TRUCK_AWAY = { x: 40, z: CONV_Z, h: PI / 2 };
  var TRUCK_SEAT = -0.55;                               // the carton, truck-local, just inside the doors
  var VAN_DOCK = { x: 23, z: 13.1, h: 0 };
  var VAN_TURN = { x: 14, z: STREET_Z, h: -PI / 2 };
  var VAN_SHOP = { x: -38.6, z: STREET_Z, h: -PI / 2 };
  var VAN_FLOOR = 0.78, VAN_SEAT = -0.40;               // van-local: just inside the rear doors

  // The hero forklift's day. [t0, t1, from, to, reverse, forkY0, forkY1]
  var L_WAIT = { x: SCAN_X, z: 3.2, h: 0 };
  var L_BELT = { x: SCAN_X, z: CONV_Z - REACH - 0.02, h: 0 };
  var L_BACK = { x: SCAN_X, z: 2.0, h: 0 };
  var L_RACK_A = { x: BIN.x, z: -2.9, h: PI };
  var L_RACK_IN = { x: BIN.x, z: BIN.z + REACH, h: PI };
  var L_PARK = { x: BIN.x, z: -1.7, h: PI };
  var L_SWING = { x: 17.2, z: -1.4, h: PI / 2 };
  var L_YARD = { x: VAN_DOCK.x, z: 4.0, h: 0 };
  var L_VAN = { x: VAN_DOCK.x, z: VAN_DOCK.z + VAN_SEAT - REACH, h: 0 };
  var L_VAN_OFF = { x: VAN_DOCK.x, z: 9.4, h: 0 };
  var BELT_FY = CONV_TOP + CARTON_H / 2 - FORK_TO_CENTER;
  var BIN_FY = BIN.y + DECK + CARTON_H / 2 - FORK_TO_CENTER;
  var VAN_FY = VAN_FLOOR + CARTON_H / 2 - FORK_TO_CENTER;
  var LIFT = [
    [1.9, 2.0, L_WAIT, null, false, BELT_FY - 0.08, BELT_FY - 0.08],
    [2.0, 2.12, L_WAIT, L_BELT, false, BELT_FY - 0.08, BELT_FY - 0.08],
    [2.12, 2.17, L_BELT, null, false, BELT_FY - 0.08, BELT_FY + 0.06],
    [2.17, 2.33, L_BELT, L_BACK, true, BELT_FY + 0.06, 0.25],
    [2.33, 2.62, L_BACK, L_RACK_A, false, 0.25, 0.3],
    [2.62, 2.76, L_RACK_A, null, false, 0.3, BIN_FY + 0.08],
    [2.76, 2.85, L_RACK_A, L_RACK_IN, false, BIN_FY + 0.08, BIN_FY + 0.08],
    [2.85, 2.89, L_RACK_IN, null, false, BIN_FY + 0.08, BIN_FY - 0.04],
    [2.89, 2.97, L_RACK_IN, L_PARK, true, BIN_FY - 0.04, BIN_FY - 0.04],
    [3.05, 3.3, L_PARK, null, false, BIN_FY - 0.04, 0.2],
    // beat 5: the order
    [4.05, 4.18, L_PARK, null, false, 0.2, BIN_FY - 0.04],
    [4.18, 4.3, L_PARK, L_RACK_IN, false, BIN_FY - 0.04, BIN_FY - 0.04],
    [4.3, 4.34, L_RACK_IN, null, false, BIN_FY - 0.04, BIN_FY + 0.08],
    [4.34, 4.46, L_RACK_IN, L_RACK_A, true, BIN_FY + 0.08, BIN_FY + 0.08],
    [4.46, 4.56, L_RACK_A, null, false, BIN_FY + 0.08, 0.3],
    [4.56, 4.66, L_RACK_A, L_SWING, true, 0.3, 0.3],
    [4.66, 4.84, L_SWING, L_YARD, false, 0.3, VAN_FY + 0.08],
    [4.84, 4.92, L_YARD, L_VAN, false, VAN_FY + 0.08, VAN_FY + 0.08],
    [4.92, 4.95, L_VAN, null, false, VAN_FY + 0.08, VAN_FY - 0.05],
    [4.95, 5.0, L_VAN, L_VAN_OFF, true, VAN_FY - 0.05, 0.2],
  ];
  LIFT.forEach(function (st) { if (st[0] >= 4) { st[0] = 4.1 + (st[0] - 4.05) * 0.9; st[1] = 4.1 + (st[1] - 4.05) * 0.9; } });
  // When the forklift holds the carton.
  var CARRY = [[2.15, 2.875], [4.1 + 0.27 * 0.9, 4.1 + 0.89 * 0.9]];

  function truckPose(T) {
    if (T < 2.3) {
      var u = outC(seg(T, 0, 0.74));
      return { x: lerp(TRUCK_AWAY.x, TRUCK_DOCK.x, u), z: CONV_Z, h: PI / 2 };
    }
    var w = inC(seg(T, 2.45, 2.95));
    return { x: lerp(TRUCK_DOCK.x, TRUCK_AWAY.x, w), z: CONV_Z, h: PI / 2 };
  }
  function truckDoors(T) { return sine(seg(T, 0.74, 0.98)) * (1 - sine(seg(T, 2.3, 2.44))); }

  // The van: one smooth run along dock -> turn -> shop, by arc length.
  var VAN_PATH = (function () {
    var pts = [], N = 60, i;
    for (i = 0; i <= N; i++) pts.push(drivePose(VAN_DOCK, VAN_TURN, false, i / N));
    for (i = 1; i <= N; i++) pts.push({ x: lerp(VAN_TURN.x, VAN_SHOP.x, i / N), z: STREET_Z, h: -PI / 2 });
    var acc = [0];
    for (i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
    return { pts: pts, acc: acc, len: acc[acc.length - 1] };
  })();
  function vanPose(T) {
    if (T < 5.05) return { x: VAN_DOCK.x, z: VAN_DOCK.z, h: VAN_DOCK.h };
    var u = sine(seg(T, 5.08, 5.94));
    var d = u * VAN_PATH.len, P = VAN_PATH.pts, A = VAN_PATH.acc, i = 1;
    while (i < A.length - 1 && A[i] < d) i++;
    var f = (d - A[i - 1]) / Math.max(1e-6, A[i] - A[i - 1]);
    return { x: lerp(P[i - 1].x, P[i].x, f), z: lerp(P[i - 1].z, P[i].z, f), h: lerp(P[i - 1].h, P[i].h, f) };
  }
  function vanDoors(T) {
    return sine(seg(T, 4.6, 4.78)) * (1 - sine(seg(T, 5.0, 5.08))) + sine(seg(T, 5.95, 6.03));
  }

  // The hand truck: from behind the van, across the pavement, to the counter.
  function dollyPose(T) {
    return drivePose(DOLLY_START, DOLLY_END, false, inOut(seg(T, 6.14, 6.44)));
  }

  // Where the carton is, and which way it faces.
  function cartonAt(T) {
    var lift = track(LIFT, T);
    var forks = function () {
      var d = dirOf(lift.h);
      return { x: lift.x + d.x * REACH, y: lift.fy + FORK_TO_CENTER, z: lift.z + d.z * REACH, h: lift.h };
    };
    var cy = CARTON_H / 2;
    if (T < 1.0) {
      var p = local(truckPose(T), 0, CONV_TOP + cy, TRUCK_SEAT);
      return { x: p.x, y: p.y, z: p.z, h: 0 };
    }
    if (T < CARRY[0][0]) {
      var tp1 = local(truckPose(1), 0, 0, TRUCK_SEAT);
      var x = T > 2.0 ? SCAN_X : lerp(tp1.x, SCAN_X, inOut(seg(T, 1.0, 1.55)));
      return { x: x, y: CONV_TOP + cy, z: CONV_Z, h: 0 };
    }
    if (T < CARRY[0][1]) return forks();
    if (T < CARRY[1][0]) return { x: BIN.x, y: BIN.y + DECK + cy, z: BIN.z, h: PI };
    if (T < CARRY[1][1]) return forks();
    if (T < 6.02) {
      var vp = vanPose(T), q = local(vp, 0, VAN_FLOOR + cy, VAN_SEAT);
      return { x: q.x, y: q.y, z: q.z, h: vp.h };
    }
    // Out of the van onto the hand truck, then with it to the counter.
    var seat = local(dollyPose(T), 0, DOLLY_SEAT.y, DOLLY_SEAT.z);
    var dh = dollyPose(T).h;
    if (T < 6.14) {
      var out = local(vanPose(6), 0, VAN_FLOOR + cy, VAN_SEAT), a = inOut(seg(T, 6.02, 6.14));
      return { x: lerp(out.x, seat.x, a), y: lerp(out.y, seat.y, a) + Math.sin(a * PI) * 0.15, z: lerp(out.z, seat.z, a), h: lerp(vanPose(6).h, dh, a) };
    }
    return { x: seat.x, y: seat.y, z: seat.z, h: dh };
  }

  // ------------------------------------------------------------------
  // Camera. [T, targetX, Y, Z (fixed point), follow (0 fixed .. 1 carton),
  //          offX, offY, offZ (added to the carton), distance, azimuth,
  //          elevation, fov]
  // ------------------------------------------------------------------
  var CAM = [
    [0.0, 6, 0, 2, 0, 0, 0, 0, 74, 34, 26, 30],
    [0.5, 20, 1.5, 6, 0.35, 0, 0, 0, 34, 36, 18, 30],
    [1.0, 20, 1.5, 6, 1, -1.2, 0.3, 0, 10.5, -56, 15, 32],
    [1.6, 20, 1.5, 6, 1, 0.4, 0.1, 0, 7.6, -40, 13, 32],
    [2.0, 20, 1.5, 6, 1, 0.3, 0.1, 0, 7.2, -36, 14, 32],
    [2.45, 20, 1.5, 6, 1, 0, 0.4, 0, 10, -6, 20, 32],
    [2.75, 20, 1.5, 6, 1, 0, 0.2, 0, 8.2, 10, 12, 32],
    [3.0, 20, 1.5, 6, 1, 0.2, -0.75, 0.4, 11, 24, 11, 32],
    [4.0, 20, 1.5, 6, 1, 0, -0.45, 0.2, 4.2, -6, 2, 30],
    [4.35, 20, 1.5, 6, 1, 0, -0.2, 0, 7.4, 18, 9, 32],
    [4.7, 20, 1.5, 6, 1, 0, 0.3, 0, 10, 70, 16, 32],
    [5.0, 20, 1.5, 6, 1, 0, 0.1, 0, 10, 125, 20, 32],
    [5.25, 20, 1.5, 6, 1, 0, 0.4, 0, 12, 60, 16, 32],
    [5.6, 20, 1.5, 6, 1, 0, 0.6, 0, 16, 20, 12, 32],
    [6.0, 20, 1.5, 6, 1, -3, 0.5, -2, 16, 28, 17, 32],
    // Over the parked van, then down into the shop under the awning (its
    // low edge is 2.5 m up): stay low from 6.45 on.
    [6.25, -45, 1, 12, 0.7, 0, 0.3, 0, 12, -8, 22, 34],
    [6.45, -45, 1, 12, 0.5, 0, 0.3, 0, 8, -12, 6, 34],
    [7.0, -45.8, 1.0, 11.5, 0, 0, 0, 0, 4.55, -56, 17, 40],
  ];
  // Portrait screens: the opening shot looks down the length of the building,
  // so the warehouse fills a tall frame instead of a strip across its middle.
  var CAM_P = CAM.slice();
  CAM_P[0] = [0.0, 16, 0, 2, 0, 0, 0, 0, 62, 62, 32, 38];

  function cameraAt(T, aspect) {
    var c = spline(aspect < 1 ? CAM_P : CAM, T), car = cartonAt(T), f = c[3];
    var tx = lerp(c[0], car.x + c[4], f), ty = lerp(c[1], car.y + c[5], f), tz = lerp(c[2], car.z + c[6], f);
    var dist = c[7], az = c[8] * PI / 180, el = c[9] * PI / 180, fov = c[10];
    // Portrait screens see less sideways: step back so the subject keeps its
    // room. Inside the shop there is no room to step back, so widen instead.
    if (aspect < 1.2) {
      var indoor = seg(T, 6.2, 6.45);
      dist *= lerp(1 + (1.2 - aspect) * 0.85, 1, indoor);
      fov += (1.2 - aspect) * 45 * indoor;
    }
    return {
      x: tx + dist * Math.sin(az) * Math.cos(el), y: ty + dist * Math.sin(el), z: tz + dist * Math.cos(az) * Math.cos(el),
      tx: tx, ty: ty, tz: tz, fov: fov, dist: dist,
    };
  }

  // Everything that changes with T, as plain numbers. Shared by the page and
  // by tools/poses.mjs, which keys the Blender scene from it.
  function poses(T, aspect) {
    aspect = aspect || 16 / 9;
    var tp = truckPose(T), vp = vanPose(T), lp = track(LIFT, T), c = cartonAt(T), dp = dollyPose(T);
    var sOn = seg(T, 1.6, 1.68) * (1 - seg(T, 1.86, 1.92));
    var rise = inOut(seg(T, 6.52, 6.66));
    return {
      T: T,
      truck: { x: tp.x, z: tp.z, h: tp.h, doors: truckDoors(T), visible: T < 2.97 },
      van: { x: vp.x, z: vp.z, h: vp.h, doors: vanDoors(T) },
      lift: { x: lp.x, z: lp.z, h: lp.h, fy: lp.fy, mast: Math.max(0, lp.fy - 1.0) },
      carton: { x: c.x, y: c.y, z: c.z, h: c.h, flaps: sine(seg(T, 6.44, 6.54)) },
      dolly: { x: dp.x, z: dp.z, h: dp.h, visible: T > 6.0 },
      bottle: {
        visible: T > 6.5,
        x: lerp(c.x, SCANNER.x, rise), z: lerp(c.z, SCANNER.z, rise),
        y: lerp(c.y + 0.1, COUNTER_TOP + 0.02, rise) + Math.sin(rise * PI) * 0.35,
      },
      scan: sOn,
      lamp: T > 1.88 && T < 2.4 ? "green" : sOn > 0 ? "red" : "off",
      count: Math.round(lerp(24, 64, inOut(seg(T, 3.25, 3.8)))),
      scan2: seg(T, 6.66, 6.7) * (1 - seg(T, 6.76, 6.8)),
      accepted: T > 6.78,
      printed: outC(seg(T, 6.74, 6.95)),
      cam: cameraAt(T, aspect),
    };
  }

  // ------------------------------------------------------------------
  // Canvas textures: printed things in the world. tools/labels.mjs reads
  // this block (FONT .. receiptTex) to print the same labels for Blender.
  // ------------------------------------------------------------------
  var FONT = "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif";
  var MONO = "'IBM Plex Mono', Consolas, monospace";
  var EAN = "M6 0h1v52h-1zM7 0h1v52h-1zM9 0h1v52h-1zM13 0h1v52h-1zM14 0h1v52h-1zM16 0h1v52h-1zM19 0h1v52h-1zM20 0h1v52h-1zM21 0h1v52h-1zM23 0h1v52h-1zM25 0h1v52h-1zM28 0h1v52h-1zM29 0h1v52h-1zM30 0h1v52h-1zM34 0h1v52h-1zM35 0h1v52h-1zM37 0h1v52h-1zM39 0h1v52h-1zM40 0h1v52h-1zM41 0h1v52h-1zM44 0h1v52h-1zM50 0h1v52h-1zM51 0h1v52h-1zM52 0h1v52h-1zM55 0h1v52h-1zM57 0h1v52h-1zM58 0h1v52h-1zM59 0h1v52h-1zM62 0h1v52h-1zM64 0h1v52h-1zM65 0h1v52h-1zM68 0h1v52h-1zM69 0h1v52h-1zM71 0h1v52h-1zM72 0h1v52h-1zM74 0h1v52h-1zM75 0h1v52h-1zM78 0h1v52h-1zM83 0h1v52h-1zM85 0h1v52h-1zM89 0h1v52h-1zM0 0h1v58h-1zM2 0h1v58h-1zM46 0h1v58h-1zM48 0h1v58h-1zM92 0h1v58h-1zM94 0h1v58h-1z";

  function canvasTex(THREE, w, h, draw, scale) {
    scale = scale || 2;
    var c = document.createElement("canvas");
    c.width = w * scale; c.height = h * scale;
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.flipY = false;                       // glTF UVs
    tex.anisotropy = 4;
    tex.redraw = function (arg) { var x = c.getContext("2d"); x.setTransform(scale, 0, 0, scale, 0, 0); draw(x, w, h, arg); tex.needsUpdate = true; };
    tex.redraw();
    return tex;
  }
  function barcode(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(w / 95, h / 58);
    ctx.fill(new Path2D(EAN));
    ctx.restore();
  }
  function cartonLabel(ctx, w, h) {
    ctx.fillStyle = "#FBFAF6"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1E221F";
    ctx.direction = "rtl"; ctx.textAlign = "right";
    ctx.font = "700 34px " + FONT; ctx.fillText("زيت ذرة 1.5 لتر", w - 18, 46);
    ctx.font = "500 22px " + MONO; ctx.direction = "ltr"; ctx.textAlign = "left";
    ctx.fillText("ZYT-150-12", 18, 44);
    ctx.fillStyle = "#1E221F"; ctx.fillRect(w - 150, 64, 132, 74);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "600 40px " + MONO; ctx.textAlign = "center";
    ctx.fillText("A-04", w - 84, 116);
    ctx.fillStyle = "#1E221F";
    barcode(ctx, 18, 66, 210, 72);
    ctx.font = "500 16px " + MONO; ctx.textAlign = "left";
    ctx.fillText("2 004005 001237", 30, 158);
  }
  function binLabel(ctx, w, h, count) {
    ctx.fillStyle = "#FBFAF6"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0D4A4E"; ctx.fillRect(0, 0, 150, h);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "600 44px " + MONO; ctx.textAlign = "center"; ctx.direction = "ltr";
    ctx.fillText("A-04", 75, h / 2 + 15);
    ctx.fillStyle = "#1E221F"; ctx.textAlign = "right"; ctx.direction = "rtl";
    ctx.font = "600 26px " + FONT; ctx.fillText("زيت ذرة 1.5 لتر", w - 16, 42);
    ctx.font = "400 22px " + FONT; ctx.fillStyle = "#4A504A"; ctx.fillText("الرصيد", w - 16, 84);
    ctx.direction = "ltr"; ctx.textAlign = "left";
    ctx.font = "600 52px " + MONO; ctx.fillStyle = count > 24 ? "#0D4A4E" : "#1E221F";
    ctx.fillText(String(count), 170, 98);
  }
  function smallBin(ctx, w, h, name) {
    ctx.fillStyle = "#FBFAF6"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1E221F"; ctx.font = "600 40px " + MONO; ctx.textAlign = "center";
    ctx.fillText(name, w / 2, h / 2 + 14);
  }
  function shopSign(ctx, w, h) {
    ctx.fillStyle = "#0D4A4E"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#F2F3F0"; ctx.direction = "rtl"; ctx.textAlign = "center";
    ctx.font = "700 92px " + FONT; ctx.fillText("سوبرماركت النخيل", w / 2, h / 2 + 32);
    ctx.fillStyle = "#D98A1E"; ctx.fillRect(0, h - 10, w, 10);
  }
  function screenTex(ctx, w, h, state) {
    ctx.fillStyle = "#F7F7F4"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0D4A4E"; ctx.fillRect(0, 0, w, 44);
    ctx.fillStyle = "#FFFFFF"; ctx.direction = "rtl"; ctx.textAlign = "right";
    ctx.font = "600 22px " + FONT; ctx.fillText("الفاتورة", w - 16, 30);
    ctx.fillStyle = "#1E221F"; ctx.font = "600 24px " + FONT; ctx.fillText("زيت ذرة 1.5 لتر", w - 16, 92);
    ctx.direction = "ltr"; ctx.textAlign = "left"; ctx.font = "500 22px " + MONO;
    ctx.fillText("INV-2026-00412", 16, 92);
    ctx.fillText("124.120", 16, 140);
    ctx.direction = "rtl"; ctx.textAlign = "right"; ctx.font = "400 20px " + FONT; ctx.fillStyle = "#4A504A";
    ctx.fillText("الإجمالي (د.أ)", w - 16, 140);
    if (state) {
      ctx.fillStyle = "#E3F1EA"; ctx.fillRect(16, 168, w - 32, 54);
      ctx.fillStyle = "#1F7A55"; ctx.font = "600 22px " + FONT;
      ctx.fillText("مقبولة في الفوترة الوطنية · بيئة اختبار", w - 30, 203);
    }
  }
  function receiptTex(ctx, w, h) {
    ctx.fillStyle = "#FDFCF8"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1E221F"; ctx.textAlign = "center"; ctx.direction = "rtl";
    ctx.font = "700 30px " + FONT; ctx.fillText("فاتورة ضريبية", w / 2, 50);
    ctx.font = "500 20px " + MONO; ctx.direction = "ltr"; ctx.fillText("INV-2026-00412", w / 2, 82);
    ctx.direction = "rtl"; ctx.font = "400 20px " + FONT; ctx.fillText("سوبرماركت النخيل", w / 2, 112);
    ctx.fillRect(20, 128, w - 40, 2);
    var rows = [["زيت ذرة 1.5 لتر", "54.000"], ["معجون أسنان 100 مل", "43.500"], ["مناديل ورقية", "9.500"], ["ضريبة المبيعات 16%", "17.120"]];
    rows.forEach(function (r, i) {
      var y = 166 + i * 36;
      ctx.direction = "rtl"; ctx.textAlign = "right"; ctx.font = "400 20px " + FONT; ctx.fillText(r[0], w - 20, y);
      ctx.direction = "ltr"; ctx.textAlign = "left"; ctx.font = "500 20px " + MONO; ctx.fillText(r[1], 20, y);
    });
    ctx.fillRect(20, 300, w - 40, 2);
    ctx.direction = "rtl"; ctx.textAlign = "right"; ctx.font = "700 22px " + FONT; ctx.fillText("الإجمالي (د.أ)", w - 20, 336);
    ctx.direction = "ltr"; ctx.textAlign = "left"; ctx.font = "600 24px " + MONO; ctx.fillText("124.120", 20, 336);
    // a QR-like block, labelled a sample on the line below
    var s = 7, ox = w / 2 - 18 * s, oy = 362, seed = 7;
    for (var y = 0; y < 37; y++) for (var x = 0; x < 37; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      var finder = (x < 7 && y < 7) || (x > 29 && y < 7) || (x < 7 && y > 29);
      var on = finder ? ((x % 36 === 0 || y % 36 === 0 || x === 6 || y === 6 || x === 30 || y === 30) || ((x % 30 >= 2 && x % 30 <= 4) && (y % 30 >= 2 && y % 30 <= 4))) : seed / 233280 > 0.52;
      if (on) ctx.fillRect(ox + x * s, oy + y * s, s, s);
    }
    ctx.textAlign = "center"; ctx.direction = "rtl"; ctx.font = "400 18px " + FONT; ctx.fillStyle = "#4A504A";
    ctx.fillText("نموذج، مش فاتورة حقيقية", w / 2, h - 18);
  }


  // ------------------------------------------------------------------
  // Tone mapping: AgX, the view transform the Blender stills are rendered
  // with, so the baked light reads the same on the page as in the posters.
  // (Fit by Filament / three.js; inputs and outputs are linear sRGB.)
  // ------------------------------------------------------------------
  var AGX = [
    "vec3 agxContrast( vec3 x ) {",
    "  vec3 x2 = x * x; vec3 x4 = x2 * x2;",
    "  return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;",
    "}",
    "vec3 CustomToneMapping( vec3 color ) {",
    "  const mat3 toRec2020 = mat3( vec3( 0.6274, 0.0691, 0.0164 ), vec3( 0.3293, 0.9195, 0.0880 ), vec3( 0.0433, 0.0113, 0.8956 ) );",
    "  const mat3 fromRec2020 = mat3( vec3( 1.6605, -0.1246, -0.0182 ), vec3( -0.5876, 1.1329, -0.1006 ), vec3( -0.0728, -0.0083, 1.1187 ) );",
    "  const mat3 inset = mat3( vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ), vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ), vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 ) );",
    "  const mat3 outset = mat3( vec3( 1.1271005818144368, -0.1413297634984383, -0.14132976349843826 ), vec3( -0.11060664309660323, 1.157823702216272, -0.11060664309660294 ), vec3( -0.016493938717834573, -0.016493938717834257, 1.2519364065950405 ) );",
    "  color *= toneMappingExposure;",
    "  color = inset * ( toRec2020 * color );",
    "  color = clamp( ( log2( max( color, 1e-10 ) ) + 12.47393 ) / 16.5, 0.0, 1.0 );",
    "  color = outset * agxContrast( color );",
    "  color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );",
    "  return clamp( fromRec2020 * color, 0.0, 1.0 );",
    "}",
  ].join("\n");
  function installAgX(THREE) {
    var chunk = THREE.ShaderChunk.tonemapping_pars_fragment, stub = "vec3 CustomToneMapping( vec3 color ) { return color; }";
    if (chunk.indexOf(stub) >= 0) THREE.ShaderChunk.tonemapping_pars_fragment = chunk.replace(stub, AGX);
    return chunk.indexOf(stub) >= 0 || chunk.indexOf("agxContrast") >= 0;
  }

  // The bake stores light scaled down by K so it fits a texture or a vertex
  // colour; materials multiply it back.
  var K = 4;
  var BG = 0xb9c6c8;

  // ------------------------------------------------------------------
  // Mount.
  // ------------------------------------------------------------------
  function mount(canvas, options) {
    var THREE = root.THREE;
    options = options || {};
    var base = options.base || "assets/3d/";

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: !!options.preserveDrawingBuffer });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = installAgX(THREE) ? THREE.CustomToneMapping : THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.localClippingEnabled = true;
    renderer.setClearColor(BG, 1);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.2, 700);
    var frameX = 0.5, frameY = 0.5, vw = 16, vh = 9;
    var nodes = {}, mats = {}, owned = [];

    // One material per baked look, shared by every mesh that has it.
    var kk = new THREE.Color(K, K, K);
    function convert(src, hasColor) {
      var name = src.name || "", key = name + (hasColor ? "+vc" : "");
      if (mats[key]) return mats[key];
      var m;
      if (/^E_|^M_Emit/.test(name)) {
        m = new THREE.MeshBasicMaterial({ color: src.emissive && src.emissive.getHex() ? src.emissive.clone().multiplyScalar(3) : src.color.clone() });
      } else if (src.map) {
        m = new THREE.MeshBasicMaterial({ map: src.map, color: kk, vertexColors: hasColor });
        src.map.anisotropy = 4;
      } else {
        m = new THREE.MeshBasicMaterial({ color: kk, vertexColors: hasColor });
      }
      m.name = name;
      mats[key] = m;
      return m;
    }
    function adopt(gltf) {
      gltf.scene.traverse(function (o) {
        if (o.name) nodes[o.name] = o;
        if (o.isMesh) {
          var old = o.material;
          o.material = convert(old, !!o.geometry.attributes.color);
          if (old !== o.material) old.dispose();
          o.matrixAutoUpdate = true;
        }
      });
      // Static parts never move: freeze their matrices.
      gltf.scene.updateMatrixWorld(true);
      scene.add(gltf.scene);
    }

    // Soft contact shadows under what moves (the bake only knows the static world).
    var blobTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 4, 32, 32, 32);
      g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(0.55, "rgba(0,0,0,0.32)"); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();
    var blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
    var blobGeo = new THREE.PlaneGeometry(1, 1).rotateX(-PI / 2);
    function blob(w, d, oz) {
      var m = new THREE.Mesh(blobGeo, blobMat), g = new THREE.Group();
      m.scale.set(w, 1, d); m.position.set(0, 0.012, oz); m.renderOrder = 1;
      g.add(m); scene.add(g);
      return g;
    }
    var blobs = { truck: blob(4.0, 9.2, 2.78), van: blob(3.3, 5.8, 1.63), lift: blob(1.8, 2.6, -0.14), dolly: blob(1.2, 1.1, -0.3) };

    // Runtime prints: the bin count, the till screen.
    var count = 24, accepted = false;
    var binTex = canvasTex(THREE, 480, 120, function (ctx, w, h) { binLabel(ctx, w, h, count); });
    var screenTexture = canvasTex(THREE, 420, 240, function (ctx, w, h) { screenTex(ctx, w, h, accepted); });
    var receiptClip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    function wireCore() {
      var lbl = nodes.BinLabel_A04_24, other = nodes.BinLabel_A04_64;
      if (other) other.visible = false;
      if (lbl) lbl.traverse(function (o) {
        if (o.isMesh && /bin-A-04/.test(o.material.name)) { o.material = o.material.clone(); o.material.map = binTex; owned.push(o.material); }
      });
      ["ScanLamp_Off", "ScanLamp_Green"].forEach(function (n) {
        if (nodes[n]) nodes[n].traverse(function (o) { if (o.isMesh) { o.material = o.material.clone(); owned.push(o.material); } });
      });
    }
    function wireFar() {
      if (nodes.Far_Static) nodes.Far_Static.traverse(function (o) {
        if (o.isMesh && /pos-screen/.test(o.material.name)) { o.material = o.material.clone(); o.material.map = screenTexture; owned.push(o.material); }
      });
      if (nodes.Receipt) nodes.Receipt.traverse(function (o) {
        if (o.isMesh) { o.material = o.material.clone(); o.material.clippingPlanes = [receiptClip]; o.material.side = THREE.DoubleSide; owned.push(o.material); }
      });
    }
    var RECEIPT = { y0: 1.325, y1: 2.16 };

    function load(name) {
      return new Promise(function (resolve, reject) {
        var loader = new THREE.GLTFLoader();
        loader.setMeshoptDecoder(root.MeshoptDecoder);
        loader.load(base + name, resolve, undefined, reject);
      });
    }
    // Upload textures and compile shaders one task at a time, so the first
    // frame is not one long task that does all of it.
    function warm(obj) {
      var texs = [];
      obj.traverse(function (o) {
        if (!o.isMesh) return;
        var m = o.material;
        if (m.map && texs.indexOf(m.map) < 0) texs.push(m.map);
      });
      var steps = texs.map(function (t) { return function () { if (renderer.initTexture) renderer.initTexture(t); }; });
      steps.push(function () { renderer.compile(scene, camera); });
      return steps.reduce(function (p, f) {
        return p.then(function () { return new Promise(function (res) { setTimeout(function () { f(); res(); }, 0); }); });
      }, Promise.resolve());
    }
    var model = { pending: true, farReady: false };
    var farPromise = null;
    function loadFar() {
      if (!farPromise) {
        farPromise = load("far.glb").then(function (g) {
          adopt(g); wireFar();
          return warm(g.scene);
        }).then(function () {
          model.farReady = true;
          if (options.onUpdate) options.onUpdate();
        });
        farPromise.catch(function () { farPromise = null; });
      }
      return farPromise;
    }
    var ready = (root.MeshoptDecoder && root.MeshoptDecoder.ready ? root.MeshoptDecoder.ready : Promise.resolve())
      .then(function () { return load("core.glb"); })
      .then(function (g) {
        adopt(g); wireCore();
        return warm(scene);
      })
      .then(function () {
        model.pending = false;
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { binTex.redraw(); screenTexture.redraw(); if (options.onUpdate) options.onUpdate(); });
      });

    function setNode(n, x, y, z, h) {
      var o = nodes[n];
      if (!o) return null;
      o.position.set(x, y, z); o.rotation.set(0, h, 0);
      return o;
    }
    function child(n, f) { var o = nodes[n]; if (o) f(o); }
    function place(g, x, z, h) { g.position.set(x, 0, z); g.rotation.y = h; }

    var red = new THREE.Color(0xff3b1f), dim = new THREE.Color(0x2a2e2b);
    function render(T) {
      if (T > 3 && !farPromise) loadFar();
      var P = poses(T, vw / vh);

      var tr = setNode("Truck", P.truck.x, 0, P.truck.z, P.truck.h);
      if (tr) tr.visible = P.truck.visible;
      blobs.truck.visible = P.truck.visible; place(blobs.truck, P.truck.x, P.truck.z, P.truck.h);
      child("Truck_DoorL", function (o) { o.rotation.y = 1.75 * P.truck.doors; });
      child("Truck_DoorR", function (o) { o.rotation.y = -1.75 * P.truck.doors; });

      setNode("Van", P.van.x, 0, P.van.z, P.van.h); place(blobs.van, P.van.x, P.van.z, P.van.h);
      child("Van_DoorL", function (o) { o.rotation.y = 1.75 * P.van.doors; });
      child("Van_DoorR", function (o) { o.rotation.y = -1.75 * P.van.doors; });

      setNode("Forklift_Hero", P.lift.x, 0, P.lift.z, P.lift.h); place(blobs.lift, P.lift.x, P.lift.z, P.lift.h);
      child("Forklift_Hero_Forks", function (o) { o.position.y = P.lift.fy; });
      child("Forklift_Hero_Mast", function (o) { o.position.y = P.lift.mast; });

      setNode("HeroCarton", P.carton.x, P.carton.y, P.carton.z, P.carton.h);
      child("HeroCarton_FlapL", function (o) { o.rotation.z = 2.2 * P.carton.flaps; });
      child("HeroCarton_FlapR", function (o) { o.rotation.z = -2.2 * P.carton.flaps; });

      var d = setNode("Dolly", P.dolly.x, 0, P.dolly.z, P.dolly.h);
      if (d) d.visible = P.dolly.visible;
      blobs.dolly.visible = !!d && P.dolly.visible; place(blobs.dolly, P.dolly.x, P.dolly.z, P.dolly.h);
      var b = setNode("Bottle", P.bottle.x, P.bottle.y, P.bottle.z, 0);
      if (b) b.visible = P.bottle.visible;

      child("ScanLamp_Green", function (o) { o.visible = P.lamp === "green"; });
      child("ScanLamp_Off", function (o) {
        o.visible = P.lamp !== "green";
        o.traverse(function (m) { if (m.isMesh) m.material.color.copy(P.lamp === "red" ? red : dim); });
      });
      if (P.count !== count) { count = P.count; binTex.redraw(); }
      if (P.accepted !== accepted) { accepted = P.accepted; screenTexture.redraw(); }
      child("Receipt", function (o) { o.visible = P.printed > 0.002; });
      receiptClip.constant = RECEIPT.y0 + (RECEIPT.y1 - RECEIPT.y0) * P.printed + 0.002;

      var c = P.cam;
      camera.position.set(c.x, c.y, c.z);
      camera.lookAt(c.tx, c.ty, c.tz);
      if (camera.fov !== c.fov) { camera.fov = c.fov; camera.updateProjectionMatrix(); }
      renderer.render(scene, camera);
    }

    var sized = "";
    function resize() {
      var w = canvas.clientWidth || canvas.width, h = canvas.clientHeight || canvas.height;
      var dpr = Math.min(root.devicePixelRatio || 1, options.maxDpr || 2);
      // Cap the drawing buffer by pixel count, not only by DPR: a wide window
      // at DPR 1 is already 3+ MP, and an integrated GPU drops frames filling
      // it. The scene is baked and unlit, so it upscales without visible loss.
      var maxPx = options.maxPixels || 2.1e6;
      if (w * h * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / (w * h));
      if (sized !== w + "x" + h + "@" + dpr) {
        sized = w + "x" + h + "@" + dpr;
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
      }
      vw = w; vh = h;
      camera.aspect = w / h;
      // Put the subject where the text panel is not.
      camera.setViewOffset(w, h, (0.5 - frameX) * w, (0.5 - frameY) * h, w, h);
      camera.updateProjectionMatrix();
    }
    resize();

    model.ready = ready;
    model.render = render;
    model.resize = resize;
    model.loadAll = function () { return ready.then(loadFar); };
    /** Where on screen the subject should sit, as fractions of the canvas. */
    model.setFrame = function (x, y) { frameX = x; frameY = y; sized = ""; resize(); };
    /** Cheaper: fewer pixels. */
    model.degrade = function () { options.maxDpr = Math.min(options.maxDpr || 2, 1.25); sized = ""; resize(); };
    model.setDpr = function (v) { options.maxDpr = v; sized = ""; resize(); };
    model.info = function () { return renderer.info; };
    model.dispose = function () {
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
      });
      var seen = [];
      Object.keys(mats).map(function (k) { return mats[k]; }).concat(owned, [blobMat]).forEach(function (m) {
        if (seen.indexOf(m) >= 0) return;
        seen.push(m);
        if (m.map) m.map.dispose();
        m.dispose();
      });
      [blobTex, binTex, screenTexture].forEach(function (t) { t.dispose(); });
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
    };
    return model;
  }

  root.WaredStory = { mount: mount, poses: poses, BEATS: 7 };
})(typeof window !== "undefined" ? window : this);
