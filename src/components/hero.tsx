import type { CSSProperties } from "react";

// Entrance motion is pure CSS (.hero-in / .hero-line in globals.css), so it starts at
// first paint instead of waiting for hydration — the hero text is the page's LCP.
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

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
      {/* split backgrounds — stacked day / name band / night on phones, side by side from md */}
      <div className="relative grid min-h-dvh grid-cols-1 grid-rows-[1fr_auto_1fr] md:absolute md:inset-0 md:grid-cols-2 md:grid-rows-1">
        {/* DAY */}
        <div className="theme-day relative flex flex-col justify-between gap-8 bg-background px-6 pb-8 pt-24 sm:px-10 md:min-h-dvh md:pb-10 md:pt-28">
          <div className="hero-in flex items-center justify-between" style={at(200)}>
            <span className="eyebrow text-foreground/70">Day · 09:00</span>
            <Sun />
          </div>
          <div className="hero-in max-w-sm" style={at(450)}>
            <div className="mono mb-2 text-xs uppercase tracking-[0.25em] text-brand">By day</div>
            <p className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
              Fintech Engineer <span className="text-muted-foreground">@ ZagTrader</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              SWIFT &amp; FIX systems, exchange connectivity and AI test
              automation in C#/.NET and TypeScript.
            </p>
            <a href="#day" data-cursor="hover" className="mono -my-2.5 mt-2.5 inline-flex items-center gap-2 py-2.5 text-sm text-foreground transition-colors hover:text-brand">
              Enter the day <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        {/* spanning name (mix-blend auto-inverts across the seam).
            Phones: an in-flow band between day and night with its own half-light /
            half-dark backdrop, so the name never lands on either half's content.
            md+: absolute over the whole hero, inverting across the vertical seam.
            The z-10 must sit on the blending element, not the wrapper: a z-indexed
            wrapper isolates the blend and the name stops inverting. */}
        <div className="pointer-events-none relative md:absolute md:inset-0">
          {/* backdrop sized by invisible copies of the same text, so the day/night split
              falls exactly between the two name lines */}
          <div className="invisible absolute inset-0 flex flex-col text-center md:hidden" aria-hidden>
            <div className="theme-day visible bg-background px-4 pt-7">
              <span className="eyebrow invisible mb-3 block">Mohammad Otaqi — Software Engineer</span>
              <span className="display-hero invisible block" style={{ fontSize: "clamp(3.2rem, 13vw, 12rem)" }}>MOHAMMAD</span>
            </div>
            <div className="theme-night visible flex-1 bg-background" />
          </div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-7 text-center mix-blend-difference md:py-0">
            <span className="hero-in eyebrow mb-3 block" style={{ ...at(150), color: "#fff" }}>
              Mohammad Otaqi — Software Engineer
            </span>
            <h1 className="display-hero text-white" style={{ fontSize: "clamp(3.2rem, 13vw, 12rem)" }}>
              <span className="block overflow-hidden">
                <span className="hero-line block" style={at(250)}>MOHAMMAD</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block" style={at(330)}>OTAQI</span>
              </span>
            </h1>
          </div>
        </div>

        {/* NIGHT */}
        <div className="theme-night relative flex flex-col justify-between gap-8 bg-background px-6 pb-10 pt-8 sm:px-10 md:min-h-dvh md:pt-28">
          {/* faint stars */}
          {[...Array(16)].map((_, i) => (
            <span key={i} className="absolute h-px w-px rounded-full bg-white/70" style={{ top: `${(i * 53) % 90 + 4}%`, left: `${(i * 37) % 92 + 4}%`, opacity: (i % 3) * 0.3 + 0.3 }} aria-hidden />
          ))}
          <div className="hero-in flex items-center justify-between" style={at(300)}>
            <Moon />
            <span className="eyebrow text-foreground/70">Night · 23:00</span>
          </div>
          <div className="hero-in max-w-sm md:ml-auto md:text-right" style={at(600)}>
            <div className="mono mb-2 text-xs uppercase tracking-[0.25em] text-brand">By night</div>
            <p className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
              Maker &amp; <span className="text-muted-foreground">app builder</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I design and ship products after hours — mobile apps and SaaS in
              Flutter, React Native, Next.js &amp; Django.
            </p>
            <a href="#night" data-cursor="hover" className="mono -my-2.5 mt-2.5 inline-flex items-center gap-2 py-2.5 text-sm text-foreground transition-colors hover:text-brand md:flex-row-reverse">
              Enter the night <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* center seam */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent md:block" aria-hidden />

      {/* availability pill (top center) */}
      <div
        className="hero-in absolute left-1/2 top-20 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-[#0b0e1c]/85 px-4 py-1.5 text-xs text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] md:flex"
        style={at(1000)}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6ad8ff] opacity-70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-[#6ad8ff]" />
        </span>
        <span className="mono tracking-widest">AVAILABLE FOR WORK — 2026</span>
      </div>

      {/* scroll cue (desktop; phones have the Enter links right above the fold) */}
      <div className="hero-in absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 mix-blend-difference md:block" style={at(1300)}>
        <div className="hero-bob mono text-xs text-white">scroll ↓</div>
      </div>
    </section>
  );
}
