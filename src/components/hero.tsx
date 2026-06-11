"use client";

import { motion, type Variants } from "framer-motion";
import { profile } from "@/lib/data";

const EXPO = [0.16, 1, 0.3, 1] as const;
const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EXPO } },
};

function Sun() {
  return (
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full bg-[#e8920c] shadow-[0_0_60px_18px_rgba(232,146,12,0.45)]" />
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-7 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8920c]/70"
          style={{ transform: `rotate(${i * 45}deg) translateY(-26px)` }}
        />
      ))}
    </div>
  );
}

function Moon() {
  return (
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full bg-[#cfe6ff] shadow-[0_0_50px_14px_rgba(106,216,255,0.35)]" />
      <div className="absolute right-[-3px] top-[-3px] h-14 w-14 rounded-full bg-[#090b1a]" />
      {[
        { t: "-18px", l: "44px" },
        { t: "26px", l: "60px" },
        { t: "50px", l: "10px" },
      ].map((s, i) => (
        <span key={i} className="absolute h-1 w-1 rounded-full bg-[#cfe6ff]" style={{ top: s.t, left: s.l }} />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-dvh w-full overflow-hidden">
      {/* split backgrounds */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        {/* DAY */}
        <div className="theme-day relative flex flex-col justify-between bg-background px-6 pb-10 pt-28 sm:px-10 md:min-h-dvh">
          <motion.div variants={fade} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="flex items-center justify-between">
            <span className="eyebrow text-foreground/70">Day · 09:00</span>
            <Sun />
          </motion.div>
          <motion.div variants={fade} initial="hidden" animate="show" transition={{ delay: 0.5 }} className="max-w-sm">
            <div className="mono mb-2 text-xs uppercase tracking-[0.25em] text-brand">By day</div>
            <p className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
              Fintech Engineer <span className="text-muted-foreground">@ ZagTrader</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              SWIFT &amp; FIX settlement systems, market-data feeds, and trading
              infrastructure in C#/.NET.
            </p>
            <a href="#day" data-cursor="hover" className="mono mt-5 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-brand">
              Enter the day <span aria-hidden>↓</span>
            </a>
          </motion.div>
        </div>

        {/* NIGHT */}
        <div className="theme-night relative flex flex-col justify-between bg-background px-6 pb-10 pt-28 sm:px-10 md:min-h-dvh">
          {/* faint stars */}
          {[...Array(16)].map((_, i) => (
            <span key={i} className="absolute h-px w-px rounded-full bg-white/70" style={{ top: `${(i * 53) % 90 + 4}%`, left: `${(i * 37) % 92 + 4}%`, opacity: (i % 3) * 0.3 + 0.3 }} aria-hidden />
          ))}
          <motion.div variants={fade} initial="hidden" animate="show" transition={{ delay: 0.3 }} className="flex items-center justify-between">
            <Moon />
            <span className="eyebrow text-foreground/70">Night · 23:00</span>
          </motion.div>
          <motion.div variants={fade} initial="hidden" animate="show" transition={{ delay: 0.6 }} className="max-w-sm md:ml-auto md:text-right">
            <div className="mono mb-2 text-xs uppercase tracking-[0.25em] text-brand">By night</div>
            <p className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
              Maker &amp; <span className="text-muted-foreground">app builder</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I design and ship products after hours — Flutter, React &amp; Node —
              turning ideas into real apps.
            </p>
            <a href="#night" data-cursor="hover" className="mono mt-5 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-brand md:flex-row-reverse">
              Enter the night <span aria-hidden>↓</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* center seam */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent md:block" aria-hidden />

      {/* spanning name (mix-blend auto-inverts across the seam) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center mix-blend-difference">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 1 }}
          className="eyebrow mb-3 text-white"
        >
          Mohammad Otaqi — Software Engineer
        </motion.span>
        <h1 className="display-hero text-white" style={{ fontSize: "clamp(3.2rem, 13vw, 12rem)" }}>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "115%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: EXPO, delay: 0.25 }} className="block">
              MOHAMMAD
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "115%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: EXPO, delay: 0.33 }} className="block">
              OTAQI
            </motion.span>
          </span>
        </h1>
      </div>

      {/* availability pill (top center) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="absolute left-1/2 top-20 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white backdrop-blur-md md:flex"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6ad8ff] opacity-70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-[#6ad8ff]" />
        </span>
        <span className="mono tracking-widest">AVAILABLE FOR WORK — 2026</span>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 mix-blend-difference"
      >
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="mono text-xs text-white">
          scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
