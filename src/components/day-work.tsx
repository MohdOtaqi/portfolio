import { Reveal } from "./reveal";
import { projects } from "@/lib/data";

const systems = projects.filter((p) => p.internal);

/** The ZagTrader systems as an editorial index — hairline rows, mono metadata,
 *  no cards. Sits under the experience timeline in the day half. */
export function DayWork() {
  return (
    <section id="systems" className="relative mx-auto max-w-[1400px] px-5 pb-24 sm:px-10 sm:pb-36">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <Reveal variant="slide-right" speed="normal" className="eyebrow mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" /> Systems — ZagTrader
          </Reveal>
          <Reveal variant="blur" speed="slow" delay={0.05}>
            <h2 className="font-display text-h2 font-semibold text-foreground">
              What I&apos;ve built <span className="font-serif-it text-brand">on the clock</span>.
            </h2>
          </Reveal>
        </div>
        <Reveal variant="fade" speed="normal" className="mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {String(systems.length).padStart(2, "0")} systems
        </Reveal>
      </div>

      <ol className="border-t border-border">
        {systems.map((s, i) => (
          <li key={s.name} className="border-b border-border">
            <Reveal
              variant="up"
              speed="fast"
              delay={i * 0.05}
              className="grid gap-x-8 gap-y-3 py-8 md:grid-cols-[3rem_minmax(0,18rem)_1fr]"
            >
              <span className="mono pt-1 text-[11px] tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
                <div className="mono mt-2 text-[11px] uppercase tracking-wider text-muted-foreground/80">{s.year}</div>
              </div>
              <div>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <div className="mono mt-4 text-[11px] text-muted-foreground/80">{s.tags.join(" · ")}</div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
