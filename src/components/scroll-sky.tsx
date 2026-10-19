"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useScrollProgress } from "./smooth-scroll";

// deterministic PRNG so SSR and client agree (no hydration mismatch, no grid)
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ScrollSky({ rtl = false }: { rtl?: boolean }) {
  const p = useScrollProgress();
  const reduce = useReducedMotion();

  // Anchor the day→dusk→night timeline to the REAL positions of the #day and
  // #night blocks so the sky is fully night just before the light-on-dark night
  // content scrolls in — regardless of how long the page grows.
  const [z, setZ] = useState({ a: 0.2, b: 0.34 });
  useEffect(() => {
    const measure = () => {
      const day = document.getElementById("day");
      const night = document.getElementById("night");
      const vh = window.innerHeight;
      const range = document.documentElement.scrollHeight - vh;
      if (!day || !night || range <= 0) return;
      const duskTop = day.offsetTop + day.offsetHeight;
      const nightTop = night.offsetTop;
      let a = (duskTop - vh * 1.35) / range;
      let b = (nightTop - vh * 1.05) / range;
      a = Math.min(Math.max(a, 0.06), 0.8);
      b = Math.min(Math.max(b, a + 0.1), 0.95);
      setZ({ a, b });
    };
    measure();
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1200);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // phones: the sun and moon ride the right edge so they never sit under text
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const { a, b } = z;
  const golden = a * 0.7; // late-afternoon warm-up begins before dusk
  const sunset = a + (b - a) * 0.42; // peak sunset
  const deepDusk = a + (b - a) * 0.78; // violet hour
  const KF = [0, golden, a, sunset, deepDusk, b, 1];

  // Vertical sky gradient: zenith (top) is always cooler/darker than the horizon
  // (bottom). Each band grades through the whole day cycle => a sky with depth,
  // not a flat fill. Day stays light (dark text readable); night goes deep.
  // Rendered as two stacked static gradients (keyframe k under k+1) with only the
  // top layer's OPACITY following scroll: a crossfade is the same linear colour
  // blend, but it is composited instead of repainting a full-screen gradient
  // every frame (that repaint was the main cause of scroll jank on phones).
  const zenith = ["#d6e3ef", "#bcd0e2", "#a9bcd6", "#7a6d97", "#2a2750", "#0a0d1c", "#060810"];
  const mid = ["#e9ede9", "#eadfc8", "#f1d39e", "#d97f54", "#5b3a63", "#0d1126", "#090c1e"];
  const horizon = ["#f6efe0", "#f8e6c0", "#ffd596", "#ffb265", "#a8505f", "#1a2142", "#121833"];
  const grad = (k: number) => `linear-gradient(180deg, ${zenith[k]} 0%, ${mid[k]} 55%, ${horizon[k]} 100%)`;
  const [seg, setSeg] = useState(0);
  const blend = useMotionValue(0);
  const place = (v: number) => {
    let k = 0;
    while (k < KF.length - 2 && v > KF[k + 1]) k++;
    const span = KF[k + 1] - KF[k];
    blend.set(span > 0 ? Math.min(Math.max((v - KF[k]) / span, 0), 1) : 0);
    if (k !== seg) setSeg(k);
  };
  useMotionValueEvent(p, "change", place);
  useEffect(() => place(p.get()), [a, b]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── single light source on a real arc ───────────────────────────────────
  // SUN: rides from upper-left across to the right, sinking to the horizon by
  // sunset. Its halo grows and reddens as it descends (atmospheric scatter).
  // Positions are transforms (x/y), not top/left, so moving it never re-lays-out.
  // phones in Arabic: text starts on the right, so the bodies ride the left edge instead
  const edge = (v: string) => (rtl ? `${100 - parseFloat(v)}vw` : v);
  const sunX = useTransform(p, [0, sunset], narrow ? [edge("80vw"), edge("90vw")] : ["26vw", "78vw"]);
  const sunY = useTransform(p, [0, golden, sunset], narrow ? ["9vh", "14vh", "82vh"] : ["16vh", "26vh", "82vh"]);
  const sunOpacity = useTransform(p, [0, a, sunset], [1, 1, 0]);
  const sunHalo = useTransform(p, [0, golden, sunset], [1, 1.5, 2.6]);
  // halo colour: three static glows crossfaded (warm → amber → red)
  const glowAmber = useTransform(p, [0, golden], [0, 1]);
  const glowRed = useTransform(p, [golden, sunset], [0, 1]);

  // MOON: holds back until the sky is genuinely dark (otherwise its phase
  // shadow reads as an ugly black disc on the bright sunset), then rises high.
  const moonY = useTransform(p, [deepDusk, b], narrow ? ["78vh", "8vh"] : ["78vh", "15vh"]);
  const moonX = useTransform(p, [deepDusk, 1], narrow ? [edge("84vw"), edge("86vw")] : ["26vw", "20vw"]);
  const moonOpacity = useTransform(p, [deepDusk, deepDusk + (b - deepDusk) * 0.4, b], [0, 0.85, 1]);

  // stars fade in through the violet hour; parallax by depth layer
  const starOpacity = useTransform(p, [deepDusk, b], [0, 1]);
  const starShift = [
    useTransform(p, [a, 1], ["0px", "-26px"]),
    useTransform(p, [a, 1], ["0px", "-58px"]),
    useTransform(p, [a, 1], ["0px", "-100px"]),
  ];

  const stars = useMemo(() => {
    const rnd = mulberry32(0x5eed);
    return Array.from({ length: 130 }, () => {
      const layer = rnd() < 0.5 ? 0 : rnd() < 0.7 ? 1 : 2;
      return {
        top: rnd() * 100,
        left: rnd() * 100,
        size: rnd() < 0.86 ? 1 : 2,
        layer,
        dur: 2.6 + rnd() * 4.5,
        delay: rnd() * 6,
        base: 0.25 + rnd() * 0.65,
      };
    });
  }, []);

  // reduced motion: freeze the sky at a calm dusk frame, hide moving bodies
  if (reduce) {
    return (
      <div
        className="fixed inset-0 -z-20"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, #2a2750 0%, #5b3a63 55%, #a8505f 100%)",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: grad(seg) }} />
      <motion.div className="absolute inset-0 will-change-[opacity]" style={{ background: grad(seg + 1), opacity: blend }} />

      {/* sun */}
      <motion.div style={{ x: sunX, y: sunY, opacity: sunOpacity }} className="absolute left-0 top-0 will-change-transform">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div style={{ scale: sunHalo }} className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 max-md:h-[22rem] max-md:w-[22rem]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,238,196,0.9)_0%,rgba(255,196,110,0.45)_38%,rgba(255,170,80,0)_70%)]" />
            <motion.div style={{ opacity: glowAmber }} className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,214,140,0.9)_0%,rgba(255,160,80,0.5)_40%,rgba(255,130,60,0)_72%)]" />
            <motion.div style={{ opacity: glowRed }} className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,150,90,0.95)_0%,rgba(232,90,60,0.55)_42%,rgba(200,60,50,0)_74%)]" />
          </motion.div>
          <div className="relative h-24 w-24 rounded-full bg-[radial-gradient(circle,#fff6e0_0%,#ffd486_52%,#f7a23c_100%)] blur-[1px] max-md:h-16 max-md:w-16" />
        </div>
      </motion.div>

      {/* moon */}
      <motion.div style={{ x: moonX, y: moonY, opacity: moonOpacity }} className="absolute left-0 top-0 will-change-transform">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(126,223,255,0.28)_0%,rgba(110,160,255,0.08)_45%,transparent_70%)]" />
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[radial-gradient(circle_at_38%_36%,#f2f8ff_0%,#cfe0f5_55%,#9fb3d4_100%)] shadow-[0_0_60px_16px_rgba(126,223,255,0.25)] max-md:h-14 max-md:w-14">
            {/* phase shadow */}
            <div className="absolute -right-6 -top-5 h-24 w-24 rounded-full bg-[#070a16] max-md:-right-4 max-md:-top-3.5 max-md:h-16 max-md:w-16" />
          </div>
        </div>
      </motion.div>

      {/* parallax starfield (night only) */}
      <motion.div style={{ opacity: starOpacity }} className="absolute inset-0 will-change-[opacity]">
        {[0, 1, 2].map((layer) => (
          <motion.div key={layer} style={{ y: starShift[layer] }} className="absolute inset-0 will-change-transform">
            {stars
              .filter((s) => s.layer === layer)
              .map((s, i) => (
                <span
                  key={i}
                  className="sky-star absolute rounded-full bg-white"
                  style={{
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    width: s.size,
                    height: s.size,
                    // @ts-expect-error custom props consumed by the keyframe
                    "--tw-base": s.base,
                    animationDuration: `${s.dur}s`,
                    animationDelay: `${s.delay}s`,
                  }}
                />
              ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
