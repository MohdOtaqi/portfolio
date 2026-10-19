import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "./nav";
import { PhoneMockup } from "./phone-mockup";
import { BrowserMockup } from "./browser-mockup";
import { PairedMockup } from "./paired-mockup";
import { Reveal } from "./reveal";
import { CtaLink } from "./ui/bezel";
import { kindLabel } from "@/lib/kind";
import { workProjects } from "@/lib/content";
import { href, ui, type Locale } from "@/lib/i18n";

// deterministic star dots for the static night backdrop (SSR-stable)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  top: (i * 37.7) % 100,
  left: (i * 61.3) % 100,
  o: 0.25 + ((i * 13) % 10) / 16,
  s: i % 9 === 0 ? 2 : 1,
}));

function NightBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-20 overflow-hidden bg-[linear-gradient(180deg,#060810_0%,#0a0e22_55%,#121833_100%)]">
      <div className="absolute -top-40 end-[-10rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(106,216,255,0.12)_0%,transparent_65%)]" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.s, height: s.s, opacity: s.o }}
        />
      ))}
    </div>
  );
}

/** Every screenshot, side by side in device frames — swipe on phones. */
function ScreenStrip({ media, device, label }: { media: string[]; device: "phone" | "browser"; label: string }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-10 sm:px-10" dir="ltr">
      {media.map((m, i) =>
        device === "phone" ? (
          <figure key={m} className="w-[200px] shrink-0 snap-start sm:w-[230px]">
            <div className="rounded-[2.2rem] border border-white/15 bg-[#0c0e1c] p-1.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m} alt={`${label} — ${i + 1}`} loading="lazy" decoding="async" className="aspect-[9/19] w-full rounded-[1.8rem] object-cover object-top" />
            </div>
          </figure>
        ) : (
          <figure key={m} className="w-[min(560px,82vw)] shrink-0 snap-start">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0c0e1c] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex gap-1.5 border-b border-white/10 px-4 py-2.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m} alt={`${label} — ${i + 1}`} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-top" />
            </div>
          </figure>
        )
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal variant="up" speed="fast" className="grid gap-x-10 gap-y-3 border-b border-border py-9 md:grid-cols-[13rem_1fr]">
      <h2 className="mono pt-1 text-xs uppercase tracking-[0.22em] text-brand">{label}</h2>
      <div>{children}</div>
    </Reveal>
  );
}

export function projectParams() {
  return workProjects("en").map((p) => ({ slug: p.slug! }));
}

export function projectMetadata(locale: Locale, slug: string): Metadata {
  const p = workProjects(locale).find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.blurb,
    alternates: {
      canonical: href(locale, `/work/${slug}`),
      languages: { en: `/work/${slug}`, ar: `/ar/work/${slug}` },
    },
    openGraph: { title: `${p.name} — Mohammad Otaqi`, description: p.blurb, url: href(locale, `/work/${slug}`) },
  };
}

export function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const list = workProjects(locale);
  const i = list.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = list[i];
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  const t = ui[locale].project;
  const w = ui[locale].work;
  const workHref = `${href(locale, "/")}#work`;
  const isVitalGuard = p.slug === "vitalguard";

  return (
    <>
      <NightBackdrop />
      <Nav locale={locale} />
      <main className="theme-night relative min-h-dvh overflow-x-clip text-foreground">
        <article className="mx-auto max-w-[1200px] px-5 pb-20 pt-28 sm:px-10 sm:pt-36">
          <a href={workHref} className="mono inline-flex items-center gap-2 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
            <span aria-hidden className="rtl-flip">←</span> {t.back}
          </a>

          {/* hero: copy + the same mockup as the home showcase */}
          <header className="mt-8 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal variant="blur" speed="slow">
              <div className="mono flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.2em] text-brand">
                <span>{p.year}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{kindLabel(p, w)}</span>
                {p.demoUrl && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {w.live}
                  </span>
                )}
                {p.status && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-foreground/80">{p.status}</span>
                  </>
                )}
              </div>
              <h1 className="mt-4 font-display text-display font-semibold leading-[0.95] text-foreground">{p.name}</h1>
              <p className="mt-6 max-w-xl text-lead text-muted-foreground">{p.blurb}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {p.demoUrl && (
                  <CtaLink href={p.demoUrl} variant="solid" external>
                    {w.liveDemo}
                  </CtaLink>
                )}
                {p.links?.map((l, k) => (
                  <CtaLink key={l.label} href={l.href} variant={!p.demoUrl && k === 0 ? "solid" : "ghost"} external={!l.href.startsWith("/")}>
                    {l.label}
                  </CtaLink>
                ))}
              </div>
            </Reveal>
            <div className="relative h-[480px] sm:h-[520px]" dir="ltr">
              <div className="absolute inset-0 flex items-center justify-center">
                {p.companion ? (
                  <PairedMockup p={p} />
                ) : p.device === "browser" ? (
                  <BrowserMockup media={p.media} label={p.name} url={p.demoUrl} />
                ) : (
                  <PhoneMockup media={p.media} label={p.name} />
                )}
              </div>
            </div>
          </header>

          {/* all screens */}
          {p.media && p.media.length > 0 && (
            <section className="mt-24">
              <h2 className="mono mb-6 text-xs uppercase tracking-[0.22em] text-brand">{t.screens}</h2>
              <ScreenStrip media={p.media} device={p.device ?? "phone"} label={p.name} />
              {p.device === "browser" && p.companion?.kind === "phone" && (
                <div className="mt-6">
                  <ScreenStrip media={p.companion.media} device="phone" label={p.name} />
                </div>
              )}
            </section>
          )}

          {/* VitalGuard: the printable wristband case, live */}
          {isVitalGuard && (
            <section className="mt-24">
              <h2 className="mono mb-3 text-xs uppercase tracking-[0.22em] text-brand">{t.model}</h2>
              <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{t.modelNote}</p>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111413]">
                <iframe
                  src="/vitalguard/wristband-viewer.html"
                  title={`${p.name} — ${t.model}`}
                  loading="lazy"
                  className="block h-[860px] w-full md:h-[700px]"
                />
              </div>
              <a href="/vitalguard/wristband-viewer.html" target="_blank" rel="noreferrer" className="mono mt-4 inline-flex items-center gap-2 py-2 text-xs text-foreground underline decoration-border underline-offset-4 hover:text-brand">
                {t.openModel} <span aria-hidden>↗</span>
              </a>
              {p.companion?.kind === "render" && (
                <div className="mt-10">
                  <h3 className="mono mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{t.renders}</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {p.companion.media.map((m) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={m} src={m} alt={`${p.name} — ${t.renders}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* the write-up */}
          <section className="mt-24 border-t border-border">
            <Row label={t.overview}>
              <p className="max-w-3xl text-lead text-foreground/90">{p.description}</p>
            </Row>
            {p.highlights && p.highlights.length > 0 && (
              <Row label={t.built}>
                <ul className="max-w-3xl space-y-4">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-4 leading-relaxed text-muted-foreground">
                      <span aria-hidden className="mono mt-[3px] shrink-0 text-brand">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Row>
            )}
            <Row label={t.stack}>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="mono rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </Row>
            {(p.status || p.demoUrl) && (
              <Row label={t.status}>
                <p className="text-foreground/90">{[p.demoUrl ? w.live : null, p.status].filter(Boolean).join(" · ")}</p>
              </Row>
            )}
          </section>

          {/* previous / next */}
          <nav className="mt-20 grid gap-4 sm:grid-cols-2" aria-label={`${t.prev} / ${t.next}`}>
            {[
              { p: prev, label: t.prev, arrow: "←" },
              { p: next, label: t.next, arrow: "→" },
            ].map(({ p: q, label, arrow }, k) => (
              <a
                key={label}
                href={href(locale, `/work/${q.slug}`)}
                className={`group rounded-3xl border border-border p-6 transition-colors hover:border-brand/50 hover:bg-white/[0.03] ${k === 1 ? "sm:text-end" : ""}`}
              >
                <span className="mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {k === 0 && <span aria-hidden className="rtl-flip me-2">{arrow}</span>}
                  {label}
                  {k === 1 && <span aria-hidden className="rtl-flip ms-2">{arrow}</span>}
                </span>
                <span className="mt-2 block font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-brand">{q.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{q.blurb}</span>
              </a>
            ))}
          </nav>
        </article>

        <footer className="mono mx-auto flex max-w-[1200px] items-center justify-between border-t border-border px-5 py-6 text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground sm:px-10">
          <a href={href(locale, "/")} className="hover:text-foreground">{ui[locale].contact.footer}</a>
          <span>© 2026</span>
        </footer>
      </main>
    </>
  );
}
