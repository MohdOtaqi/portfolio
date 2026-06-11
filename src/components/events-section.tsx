"use client";

import { SmartImage } from "./smart-image";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { Bezel } from "./ui/bezel";
import { events } from "@/lib/data";

// Asymmetric bento rhythm: wide hero, two standard, wide closer.
// Index-keyed so the layout stays deliberate rather than a uniform 4-grid.
const SPAN = [
  "lg:col-span-3 lg:row-span-2", // 0 — tall + wide hero
  "lg:col-span-2", // 1 — standard
  "lg:col-span-2", // 2 — standard
  "lg:col-span-3", // 3 — wide closer
] as const;

const ASPECT = [
  "aspect-[4/5] sm:aspect-[3/4] lg:h-full", // hero fills its tall cell
  "aspect-[16/10]",
  "aspect-[16/10]",
  "aspect-[16/9]",
] as const;

export function EventsSection() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-10 sm:py-36">
      <Reveal variant="blur" speed="slow">
        <div className="eyebrow mb-4 flex items-center gap-3">
          <span className="h-px w-10 bg-brand" /> Beyond the desk
        </div>
        <h2 className="font-display text-h2 font-semibold text-foreground">
          Hackathons, awards &amp;{" "}
          <span className="font-serif-it text-brand">community</span>.
        </h2>
      </Reveal>

      <Stagger
        amount={0.1}
        delay={0.1}
        className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-5"
      >
        {events.map((e, i) => (
          <StaggerItem
            key={e.title}
            variant="up"
            speed="normal"
            className={SPAN[i % SPAN.length] ?? "lg:col-span-2"}
          >
            <Bezel className="group h-full" innerClassName="flex h-full flex-col">
              <div className="overflow-hidden">
                <SmartImage
                  src={e.image}
                  alt={e.title}
                  label={e.title}
                  className={`w-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${ASPECT[i % ASPECT.length] ?? "aspect-[16/10]"}`}
                />
              </div>
              <div className="flex flex-1 flex-col justify-end p-5">
                <h3 className="font-display text-h3 font-medium text-foreground">
                  {e.title}
                </h3>
                <p className="mono mt-1 text-xs text-brand">{e.caption}</p>
              </div>
            </Bezel>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
