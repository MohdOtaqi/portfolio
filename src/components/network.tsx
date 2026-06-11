"use client";

import { forwardRef, useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Bezel } from "@/components/ui/bezel";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const Node = forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode; big?: boolean }
>(({ className, children, big }, ref) => (
  <div
    ref={ref}
    data-cursor="hover"
    className={cn(
      "group z-10 flex items-center justify-center rounded-2xl border border-border bg-card text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1",
      big
        ? "size-28 border-brand/40 bg-brand/[0.06] px-2"
        : "size-20 px-2",
      className
    )}
  >
    <span className={cn("mono leading-tight", big ? "text-sm text-foreground" : "text-[11px] text-muted-foreground")}>
      {children}
    </span>
  </div>
));
Node.displayName = "Node";

export function Network() {
  const container = useRef<HTMLDivElement>(null);
  const center = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const l3 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);

  return (
    <section className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-10 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" /> The system
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-h1 text-foreground">
              Messages that settle <span className="font-serif-it text-brand">trades</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-muted-foreground">
              At ZagTrader I build the gateway between markets, custodians and
              banks — routing, validating and archiving SWIFT &amp; FIX messages
              across the post-trade lifecycle.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-8">
          <Bezel innerClassName="theme-night">
            <div
              ref={container}
              className="relative flex h-[420px] w-full items-center justify-between overflow-hidden bg-background px-8 py-12 sm:px-16"
            >
            <div className="flex flex-col justify-between">
              <Node ref={l1}>SWIFT<br />MT54x</Node>
              <Node ref={l2}>FIX<br />Engine</Node>
              <Node ref={l3}>Banks<br />/ Custody</Node>
            </div>
            <Node ref={center} big>
              Settlement<br />Engine
            </Node>
            <div className="flex flex-col justify-between">
              <Node ref={r1}>Exchanges</Node>
              <Node ref={r2}>SQL<br />Server</Node>
              <Node ref={r3}>Market<br />Data</Node>
            </div>

            {[l1, l2, l3].map((ref, i) => (
              <AnimatedBeam
                key={`l${i}`}
                containerRef={container}
                fromRef={ref}
                toRef={center}
                curvature={i === 1 ? 0 : i === 0 ? 40 : -40}
                gradientStartColor="#5ef0ff"
                gradientStopColor="#7c83ff"
                duration={4}
                delay={i * 0.6}
              />
            ))}
            {[r1, r2, r3].map((ref, i) => (
              <AnimatedBeam
                key={`r${i}`}
                containerRef={container}
                fromRef={center}
                toRef={ref}
                curvature={i === 1 ? 0 : i === 0 ? -40 : 40}
                gradientStartColor="#5ef0ff"
                gradientStopColor="#7c83ff"
                duration={4}
                delay={i * 0.6 + 1.2}
              />
            ))}
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}
