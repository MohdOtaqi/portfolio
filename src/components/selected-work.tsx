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
import { PairedMockup } from "./paired-mockup";
import { Magnetic } from "./magnetic";
import { Reveal } from "./reveal";
import { Bezel, CtaLink } from "./ui/bezel";
import { getContent, type Project } from "@/lib/content";
import { href, ui, type Locale } from "@/lib/i18n";
import { kindLabel } from "@/lib/kind";

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

const labels = (locale: Locale) => ui[locale].work;

/** Small device thumbnail for the phone list: the phone app when there is one, else the web shot. */
function Thumb({ p }: { p: Project }) {
  const phone = p.device === "phone" ? p.media?.[0] : p.companion?.kind === "phone" ? p.companion.media[0] : undefined;
  if (phone) {
    return (
      <div className="relative w-[74px] shrink-0 overflow-hidden rounded-[1.1rem] border border-white/15 bg-[#0c0e1c] p-1 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={phone} alt="" loading="lazy" decoding="async" className="aspect-[9/19] w-full rounded-[0.85rem] object-cover object-top" />
      </div>
    );
  }
  return (
    <div className="relative w-[118px] shrink-0 overflow-hidden rounded-lg border border-white/15 bg-[#0c0e1c] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex gap-1 border-b border-white/10 px-2 py-1.5" aria-hidden>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span className="h-1 w-1 rounded-full bg-white/30" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.media?.[0]} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-top" />
    </div>
  );
}

export function SelectedWork({ locale }: { locale: Locale }) {
  const { projects, workshop } = getContent(locale);
  const apps = projects.filter((p) => !p.internal);
  const t = labels(locale);
  const rtl = locale === "ar";

  const reduced = useReducedMotion();
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  // the tabbed showcase is desktop-only; phones get a plain list, so don't autoplay a hidden panel
  const [wide, setWide] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const count = apps.length;
  // autoplay runs only when nothing is holding it: no reduced-motion, not hovered,
  // not focused-within (so a keyboard reader is never swapped out), not user-paused.
  const playing = wide && !reduced && !hoverPaused && !focusPaused && !userPaused;
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
    const timer = setTimeout(() => go((active + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [playing, active, count, go]);

  // keep the active tab visible when the rail overflows (autoplay walks past the
  // visible edge). Relative scrollBy works in both LTR and RTL; scrollIntoView
  // would also move the page.
  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[active];
    if (!rail || !tab) return;
    const r = rail.getBoundingClientRect();
    const a = tab.getBoundingClientRect();
    const behavior = reduced ? "auto" : "smooth";
    if (a.left < r.left) rail.scrollBy({ left: a.left - r.left - 16, behavior });
    else if (a.right > r.right) rail.scrollBy({ left: a.right - r.right + 16, behavior });
  }, [active, reduced]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (k === fwd || k === "ArrowDown") {
      e.preventDefault();
      select((active + 1) % count);
    } else if (k === back || k === "ArrowUp") {
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
            <span className="h-px w-10 bg-brand" /> {t.eyebrow}
          </Reveal>
          <Reveal variant="blur" speed="slow" delay={0.05}>
            <h2 className="font-display text-h1 font-semibold text-foreground">
              {t.title}{" "}
              <span className="font-serif-it text-brand">{t.accent}</span>.
            </h2>
          </Reveal>
        </div>
        <Reveal variant="fade" speed="normal" className="mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {String(count).padStart(2, "0")} {t.count}
        </Reveal>
      </div>

      {/* PHONES — a plain list: tap a project to open its page */}
      <ol className="border-t border-border md:hidden">
        {apps.map((a, i) => (
          <li key={a.name} className="border-b border-border">
            <a
              href={a.slug ? href(locale, `/work/${a.slug}`) : a.demoUrl}
              className={`group grid grid-cols-[1fr_auto] items-center gap-5 py-6 ${focusRing}`}
            >
              <div className="min-w-0">
                <div className="mono flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.18em]">
                  <span className="text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-muted-foreground">{kindLabel(a, t)}</span>
                  {a.demoUrl && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t.live}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-foreground">{a.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.blurb}</p>
                {a.status && <p className="mono mt-2 text-[11px] text-foreground/70">{a.status}</p>}
                <span className="mono mt-3 inline-flex items-center gap-1.5 text-xs text-foreground transition-colors group-hover:text-brand">
                  {t.viewProject} <span aria-hidden className="rtl-flip">→</span>
                </span>
              </div>
              <Thumb p={a} />
            </a>
          </li>
        ))}
      </ol>

      {/* DESKTOP — featured panel + tab rail */}
      <div className="hidden md:block">
        <Bezel className="overflow-hidden">
          <div
            id="sw-panel"
            role="tabpanel"
            aria-labelledby={`sw-tab-${active}`}
            className="relative grid items-center gap-8 p-7 sm:p-10 md:grid-cols-2 md:gap-10"
          >
            {/* ghosted ordinal — decorative depth, only where the column is wide enough */}
            <div aria-hidden className="pointer-events-none absolute end-2 top-1/2 hidden -translate-y-1/2 select-none lg:block">
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
                  <div className="mono mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.2em] text-brand">
                    <span>{p.year}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{kindLabel(p, t)}</span>
                    {p.demoUrl && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t.live}
                      </span>
                    )}
                    {p.status && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-foreground/80">{p.status}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display text-h2 font-semibold leading-[1.05] text-foreground">
                    {p.name}
                  </h3>

                  <p className="mt-4 max-w-md text-lead text-muted-foreground">
                    {p.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="mono rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {p.demoUrl && (
                      <Magnetic strength={0.4}>
                        <CtaLink href={p.demoUrl} variant="solid" external>
                          {t.liveDemo}
                        </CtaLink>
                      </Magnetic>
                    )}
                    {p.slug && (
                      <Magnetic strength={0.4}>
                        <CtaLink href={href(locale, `/work/${p.slug}`)} variant={p.demoUrl ? "ghost" : "solid"}>
                          {t.caseStudy}
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
            <div className="relative z-10 h-[500px]" dir="ltr">
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
                  {p.companion ? (
                    <PairedMockup p={p} />
                  ) : p.device === "browser" ? (
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
              aria-label={playing ? t.pause : t.resume}
              aria-pressed={!playing}
              data-cursor="hover"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground ${focusRing}`}
            >
              {playing ? (
                <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden className="fill-current">
                  <rect x="0" y="0" width="3.4" height="12" rx="1" />
                  <rect x="7.6" y="0" width="3.4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden className="rtl-flip fill-current">
                  <path d="M1 0.7L10.5 6L1 11.3V0.7Z" />
                </svg>
              )}
            </button>
          )}

          <div
            ref={railRef}
            role="tablist"
            aria-label={t.tablist}
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
                  className={`group relative flex shrink-0 items-baseline gap-2 rounded-md px-3.5 pb-3 pt-2 text-start ${focusRing}`}
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
      </div>

      {/* workshop — projects without screenshots yet, as a quiet text index */}
      {workshop.length > 0 && (
        <div className="mt-20">
          <Reveal variant="fade" speed="normal" className="mono mb-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {t.bench}
          </Reveal>
          <ul className="border-t border-border">
            {workshop.map((w, i) => (
              <li key={w.name} className="border-b border-border">
                <Reveal
                  variant="up"
                  speed="fast"
                  delay={i * 0.05}
                  className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[3rem_14rem_1fr]"
                >
                  <span className="mono text-[11px] tabular-nums text-brand">
                    {String(count + i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{w.name}</h3>
                    <div className="mono mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {w.kind}
                    </div>
                  </div>
                  <div>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{w.description}</p>
                    <div className="mono mt-3 text-[11px] text-muted-foreground/80">{w.tags.join(" · ")}</div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
