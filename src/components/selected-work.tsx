"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { PhoneMockup } from "./phone-mockup";
import { BrowserMockup } from "./browser-mockup";
import { Magnetic } from "./magnetic";
import { Reveal } from "./reveal";
import { Bezel, CtaLink } from "./ui/bezel";
import { projects } from "@/lib/data";

const apps = projects.filter((p) => !p.internal);
const AUTOPLAY_MS = 6800;
const EXPO = [0.16, 1, 0.3, 1] as const;

// direction-aware: +1 forward, -1 back — content slides toward the new tab
const contentV: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 36 : -36, filter: "blur(10px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -28 : 28, filter: "blur(10px)" }),
};

const mockupV: Variants = {
  enter: (d: number) => ({ opacity: 0, scale: 0.92, x: d > 0 ? 28 : -28 }),
  center: { opacity: 1, scale: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, scale: 0.96, x: d > 0 ? -20 : 20 }),
};

export function SelectedWork() {
  const reduced = useReducedMotion();
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = apps.length;
  // autoplay runs only when nothing is holding it: no reduced-motion, not hovered,
  // not focused-within (so a keyboard reader is never swapped out), not user-paused.
  const playing = !reduced && !hoverPaused && !focusPaused && !userPaused;
  const p = apps[active];

  const go = useCallback((next: number) => {
    setActive(([cur]) => [next, next > cur ? 1 : -1]);
  }, []);

  // explicit user selection — claims control (stops autoplay) + moves keyboard focus
  const select = useCallback(
    (next: number) => {
      setUserPaused(true);
      go(next);
      tabRefs.current[next]?.focus();
    },
    [go]
  );

  // autoplay: re-armed on every active change via deps, paused/stopped cleanly
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go((active + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, active, count, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") {
      e.preventDefault();
      select((active + 1) % count);
    } else if (k === "ArrowLeft" || k === "ArrowUp") {
      e.preventDefault();
      select((active - 1 + count) % count);
    } else if (k === "Home") {
      e.preventDefault();
      select(0);
    } else if (k === "End") {
      e.preventDefault();
      select(count - 1);
    }
  };

  const ord = String(active + 1).padStart(2, "0");
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <section
      id="work"
      className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-36"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusPaused(false);
      }}
    >
      {/* header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <Reveal variant="slide-right" speed="normal" className="eyebrow mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" /> Night — Selected work
          </Reveal>
          <Reveal variant="blur" speed="slow" delay={0.05}>
            <h2 className="font-display text-h1 font-semibold text-foreground">
              Things I build{" "}
              <span className="font-serif-it text-brand">after hours</span>.
            </h2>
          </Reveal>
        </div>
        <Reveal variant="fade" speed="normal" className="mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {String(count).padStart(2, "0")} projects · shipped
        </Reveal>
      </div>

      {/* featured panel */}
      <Bezel className="overflow-hidden">
        <div
          id="sw-panel"
          role="tabpanel"
          aria-labelledby={`sw-tab-${active}`}
          className="relative grid items-center gap-8 p-7 sm:p-10 md:grid-cols-2 md:gap-10"
        >
          {/* ghosted ordinal — decorative depth, only where the column is wide enough */}
          <div aria-hidden className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none lg:block">
            <AnimatePresence mode="wait">
              <motion.span
                key={ord}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 0.07, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: EXPO }}
                className="block font-display text-[16rem] font-bold leading-none text-foreground"
              >
                {ord}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* copy */}
          <div className="relative z-10 min-h-[280px] sm:min-h-[260px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={p.name}
                custom={dir}
                variants={contentV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: EXPO }}
              >
                <div className="mono mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-brand">
                  <span>{p.year}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {p.device === "browser" ? "Web" : "Mobile"}
                  </span>
                  {p.demoUrl && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
                    </span>
                  )}
                </div>

                <h3 className="font-display text-h2 font-semibold leading-[1.05] text-foreground">
                  {p.name}
                </h3>

                <p className="mt-4 max-w-md text-lead text-muted-foreground">
                  {p.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {p.demoUrl && (
                    <Magnetic strength={0.4}>
                      <CtaLink href={p.demoUrl} variant="solid" external>
                        Live demo
                      </CtaLink>
                    </Magnetic>
                  )}
                  {p.links?.map((l) => (
                    <Magnetic key={l.label} strength={0.4}>
                      <CtaLink href={l.href} variant="ghost" external>
                        {l.label}
                      </CtaLink>
                    </Magnetic>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* mockup — FIXED-height stage with crossfade-in-place (no mode="wait"),
              so switching between a tall phone and a short browser never reflows the panel */}
          <div className="relative z-10 h-[500px]">
            <AnimatePresence custom={dir} initial={false}>
              <motion.div
                key={p.name}
                custom={dir}
                variants={mockupV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EXPO }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {p.device === "browser" ? (
                  <BrowserMockup media={p.media} label={p.name} url={p.demoUrl} />
                ) : (
                  <PhoneMockup media={p.media} label={p.name} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Bezel>

      {/* control row: pause/play toggle (keyboard + touch reachable) + numbered tab rail */}
      <div className="mt-6 flex items-center gap-3">
        {!reduced && (
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={playing ? "Pause auto-rotation" : "Resume auto-rotation"}
            aria-pressed={!playing}
            data-cursor="hover"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground ${focusRing}`}
          >
            {playing ? (
              <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden className="fill-current">
                <rect x="0" y="0" width="3.4" height="12" rx="1" />
                <rect x="7.6" y="0" width="3.4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden className="fill-current">
                <path d="M1 0.7L10.5 6L1 11.3V0.7Z" />
              </svg>
            )}
          </button>
        )}

        <div
          role="tablist"
          aria-label="Selected projects"
          onKeyDown={onKeyDown}
          className="no-scrollbar relative flex flex-1 gap-1 overflow-x-auto"
        >
          {apps.map((a, i) => {
            const on = i === active;
            return (
              <button
                key={a.name}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`sw-tab-${i}`}
                role="tab"
                aria-selected={on}
                aria-controls="sw-panel"
                tabIndex={on ? 0 : -1}
                data-cursor="hover"
                onClick={() => select(i)}
                className={`group relative flex shrink-0 items-baseline gap-2 rounded-md px-3.5 pb-3 pt-2 text-left ${focusRing}`}
              >
                <span
                  className={`mono text-[11px] tabular-nums transition-colors ${
                    on ? "text-brand" : "text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`whitespace-nowrap text-sm font-medium tracking-tight transition-colors ${
                    on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                  }`}
                >
                  {a.name}
                </span>

                {/* sliding active indicator — rides the baseline below */}
                {on && (
                  <motion.span
                    layoutId="sw-active-rail"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* baseline flush under the rail so the brand indicator reads as a moving underline */}
      <div className="h-px w-full bg-border" />
    </section>
  );
}
