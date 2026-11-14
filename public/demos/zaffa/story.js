/*
 * زفّة: the scroll story (story.js).
 *
 * One wedding date, Thursday 13 August (evening), from a WhatsApp inquiry to
 * a settled balance, while the empty hall gets dressed for the night. The
 * hall is rendered offline in Blender (tools/blender/hall) as an image
 * sequence: 12 frames per beat, frame i is story time T = i / 12, 85 frames
 * per camera. The page pins this canvas and turns scroll into T (0..7);
 * render(T) draws the two frames either side of T, cross-faded. Nothing
 * accumulates between frames, so scrolling back plays the story backwards.
 *
 * Beats (T = k at the end of beat k):
 *   1  الاستفسار        the camera walks in; the 13th turns to a brass-hatched hold
 *   2  ما في حجز مزدوج   a second family's tile tries to land on it and is refused
 *   3  العقد            the contract is signed; the stage (الكوشة) assembles
 *   4  العربون          the deposit is in (the 13th turns ink); tables and chairs slide in
 *   5  تذكير قبل بيوم    runner, flowers and strands of light come down
 *   6  ليلة الفرح       night: chandeliers, candles and pinspots come up
 *   7  التسوية          the balance is paid; the month fills in
 *
 * Loading never blocks: the opening frame and each beat's first frame come
 * first, then (from the first scroll, warm()) every other frame, nearest
 * to the current position first. render(T) always draws the nearest frame
 * that has arrived.
 */
(function (root) {
  "use strict";

  var FPB = 12, BEATS = 7, COUNT = FPB * BEATS + 1, PARALLEL = 4;
  // Two cameras, rendered separately. (ax, ay) is where the subject sits in
  // the frame (Blender lens shift, see hall_scene.py ANCHOR); the page asks
  // for it to land at (fx, fy) of the canvas, clear of the words.
  var SETS = {
    desktop: { dir: "assets/seq/desktop/", w: 1280, h: 800, ax: 0.35, ay: 0.5 },
    mobile: { dir: "assets/seq/mobile/", w: 720, h: 1200, ax: 0.5, ay: 0.3 }
  };
  var mobileQuery = root.matchMedia ? root.matchMedia("(max-width: 760px)") : { matches: false };

  function file(i) { return (i < 10 ? "00" : i < 100 ? "0" : "") + i + ".webp"; }

  function mount(canvas, options) {
    options = options || {};
    var ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("no 2d canvas");
    var set, imgs, state, inflight, waiters, all = false;
    var want = 0, fx = 0.5, fy = 0.5, ratio = 1, last = "";

    function useSet() {
      var s = mobileQuery.matches ? SETS.mobile : SETS.desktop;
      if (s === set) return false;
      set = s; imgs = []; state = []; inflight = 0; waiters = []; last = "";
      for (var i = 0; i < COUNT; i++) state.push(0);   // 0 not asked, 1 loading, 2 ready, 3 failed
      pump();
      return true;
    }

    // Which frame to fetch next: the opening frame and the beats' first
    // frames (nearest first), then, once scrolling has begun, the rest.
    function next() {
      var best = -1, bestD = 1e9, i, d;
      for (i = 0; i < COUNT; i += FPB) {
        d = Math.abs(i - want);
        if (state[i] === 0 && d < bestD) { best = i; bestD = d; }
      }
      if (best >= 0 || !all) return best;
      for (i = 0; i < COUNT; i++) {
        // ahead of the reader counts a little nearer than behind
        d = i >= want ? i - want : (want - i) * 1.5;
        if (state[i] === 0 && d < bestD) { best = i; bestD = d; }
      }
      return best;
    }
    function pump() {
      while (inflight < PARALLEL) {
        var i = next();
        if (i < 0) return;
        load(i);
      }
    }
    function load(i) {
      var s = set, im = new Image();
      state[i] = 1; inflight++;
      function done(ok) {
        if (s !== set) return;
        inflight--;
        state[i] = ok ? 2 : 3;
        if (ok) imgs[i] = im;
        for (var w = waiters.length - 1; w >= 0; w--) {
          if (state[waiters[w].i] >= 2) { var cb = waiters[w].cb; waiters.splice(w, 1); cb(); }
        }
        // a frame nearer to the one on screen arrived: draw again
        if (ok && options.onRedraw && Math.abs(i - want) <= 2) options.onRedraw();
        pump();
      }
      im.decoding = "async";
      im.src = s.dir + file(i);
      if (im.decode) im.decode().then(function () { done(true); }, function () { done(false); });
      else { im.onload = function () { done(true); }; im.onerror = function () { done(false); }; }
    }

    // The reader is on the way in: fetch the rest of the sequence.
    function warm() { if (!all) { all = true; pump(); } }

    function nearest(f) {
      for (var d = 0; d < COUNT; d++) {
        var a = Math.floor(f) - d, b = Math.ceil(f) + d;
        if (a >= 0 && state[a] === 2) return a;
        if (b < COUNT && state[b] === 2) return b;
      }
      return -1;
    }

    function resize() {
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      useSet();
      // never more backing pixels than the frames have
      var cover = Math.max(w / set.w, h / set.h);
      var dpr = Math.min(root.devicePixelRatio || 1, options.maxDpr || 2);
      ratio = Math.max(1, Math.min(dpr, 1 / cover));
      var bw = Math.round(w * ratio), bh = Math.round(h * ratio);
      if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
      last = "";
    }

    function blit(im, alpha) {
      var cw = canvas.width, ch = canvas.height;
      var s = Math.max(cw / set.w, ch / set.h), dw = set.w * s, dh = set.h * s;
      var dx = Math.min(0, Math.max(cw - dw, fx * cw - set.ax * dw));
      var dy = Math.min(0, Math.max(ch - dh, fy * ch - set.ay * dh));
      ctx.globalAlpha = alpha;
      ctx.drawImage(im, dx, dy, dw, dh);
    }

    function render(T) {
      var f = Math.max(0, Math.min(COUNT - 1, T * FPB));
      want = Math.round(f);
      if (!all && T > 0.02) warm();
      var i0 = Math.floor(f), i1 = Math.min(COUNT - 1, i0 + 1), u = f - i0, key;
      if (state[i0] === 2 && state[i1] === 2) {
        u = Math.round(u * 64) / 64;
        key = i0 + ":" + u;
        if (key === last) return true;
        blit(imgs[i0], 1);
        if (u > 0 && i1 !== i0) blit(imgs[i1], u);
      } else {
        var n = nearest(f);
        if (n < 0) return false;
        key = n + ":n";
        if (key === last) return true;
        blit(imgs[n], 1);
      }
      ctx.globalAlpha = 1;
      last = key;
      return true;
    }

    // Call back once the frames around T are in (captures and first paint).
    function prime(T, cb) {
      var f = Math.max(0, Math.min(COUNT - 1, T * FPB)), need = [Math.floor(f), Math.ceil(f)];
      want = Math.round(f);
      var left = 0;
      need.forEach(function (i) {
        if (state[i] >= 2) return;
        left++;
        waiters.push({ i: i, cb: function () { if (--left === 0) cb(); } });
        if (state[i] === 0) load(i);
      });
      if (left === 0) cb();
    }

    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", function () { resize(); if (options.onRedraw) options.onRedraw(); });
    resize();

    return {
      render: render,
      resize: resize,
      prime: prime,
      warm: warm,
      setFrame: function (x, y) { fx = x; fy = y; last = ""; },
      setDpr: function (d) { options.maxDpr = d; resize(); },
      stats: function () {
        var n = 0;
        for (var i = 0; i < COUNT; i++) if (state[i] === 2) n++;
        return { set: set.dir, loaded: n, count: COUNT, ratio: ratio, width: canvas.width, height: canvas.height };
      }
    };
  }

  root.ZaffaStory = { mount: mount, BEATS: BEATS, FRAMES_PER_BEAT: FPB };
})(window);
