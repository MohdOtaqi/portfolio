import { Reveal } from "./reveal";
import { getContent } from "@/lib/content";
import { href, ui, type Locale } from "@/lib/i18n";

/** The games as a shelf of phone screens: each one opens its project page.
 *  Sits under Selected Work, which keeps the non-game products. */
export function Games({ locale }: { locale: Locale }) {
  const games = getContent(locale).projects.filter((p) => p.category === "game");
  const t = ui[locale].games;
  const w = ui[locale].work;
  return (
    <section id="games" className="relative mx-auto max-w-[1400px] px-5 pb-24 sm:px-10 sm:pb-36">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <Reveal variant="slide-right" speed="normal" className="eyebrow mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" /> {t.eyebrow}
          </Reveal>
          <Reveal variant="blur" speed="slow" delay={0.05}>
            <h2 className="font-display text-h2 font-semibold text-foreground">
              {t.title} <span className="font-serif-it text-brand">{t.accent}</span>.
            </h2>
          </Reveal>
        </div>
        <Reveal variant="fade" speed="normal" className="mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {String(games.length).padStart(2, "0")} {t.count}
        </Reveal>
      </div>

      <ol className="grid gap-x-10 border-t border-border md:grid-cols-2 xl:grid-cols-3">
        {games.map((g, i) => (
          <li key={g.name} className="border-b border-border">
            <Reveal variant="up" speed="fast" delay={(i % 3) * 0.05}>
              <a
                href={href(locale, `/work/${g.slug}`)}
                className="group grid grid-cols-[1fr_auto] gap-5 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="mono text-[11px] tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-foreground">{g.name}</h3>
                  {locale === "en" && g.altName && (
                    <p lang="ar" className="mt-1 text-sm text-muted-foreground/80">
                      {g.altName}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{g.blurb}</p>
                  <p className="mono mt-3 text-[11px] text-foreground/70">{g.status}</p>
                  <span className="mono mt-auto inline-flex items-center gap-1.5 pt-4 text-xs text-foreground transition-colors group-hover:text-brand">
                    {w.viewProject} <span aria-hidden className="rtl-flip">→</span>
                  </span>
                </div>
                <div className="w-[104px] shrink-0 overflow-hidden rounded-[1.3rem] border border-white/15 bg-[#0c0e1c] p-1 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] transition-transform duration-200 ease-out group-hover:-translate-y-1 motion-reduce:transform-none sm:w-[124px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.media?.[0]}
                    alt={g.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[9/19] w-full rounded-[1rem] object-cover object-top"
                  />
                </div>
              </a>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
