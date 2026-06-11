import { Reveal } from "./reveal";
import { experience } from "@/lib/data";

/** Per-role domain accent hues — subtle, overlaid on the rail node so each
 *  role reads as its own "discipline" while staying in the observatory palette.
 *  Index-based with a modulo fallback so adding roles to data.ts never breaks. */
const ACCENTS = ["var(--brand)", "var(--brand-2, var(--brand))", "var(--brand)"];

export function ExperienceSection() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-36">
      <Reveal
        variant="slide-right"
        speed="normal"
        className="eyebrow mb-14 flex items-center gap-3"
      >
        <span className="h-px w-10 bg-brand" /> Experience
      </Reveal>

      <ol className="relative">
        {/* Connecting rail — runs the full height of the timeline */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-[7px] top-2 w-px bg-gradient-to-b from-border via-border to-transparent sm:left-[9px]"
        />

        {experience.map((job, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <li key={job.company} className="relative">
              <Reveal
                variant="slide-left"
                speed="fast"
                delay={i * 0.08}
                className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 pb-16 pl-0 sm:gap-x-9 sm:pb-20"
              >
                {/* Rail node / marker — domain-coded accent */}
                <span className="relative mt-[6px] flex h-4 w-4 items-center justify-center sm:h-5 sm:w-5">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full opacity-25 blur-[2px]"
                    style={{ backgroundColor: accent }}
                  />
                  <span
                    aria-hidden
                    className="relative h-2 w-2 rounded-full ring-2 ring-background sm:h-2.5 sm:w-2.5"
                    style={{ backgroundColor: accent }}
                  />
                </span>

                {/* Role content to the right of the rail */}
                <div className="min-w-0">
                  <div className="mono text-xs tracking-wide text-muted-foreground">
                    {job.period}
                  </div>

                  <h3 className="mt-2 font-display text-h3 font-medium text-foreground">
                    {job.company}
                  </h3>
                  <div
                    className="mt-1 text-sm font-medium"
                    style={{ color: accent }}
                  >
                    {job.role}
                  </div>

                  <p className="mt-4 max-w-2xl text-muted-foreground">
                    {job.summary}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {job.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex max-w-3xl gap-4 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mono mt-[2px] shrink-0"
                          style={{ color: accent }}
                        >
                          —
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="mono rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
