import { Fragment } from "react";
import { Reveal, MaskLines, Stagger, StaggerItem } from "./reveal";
import { Bezel } from "@/components/ui/bezel";
import { getContent } from "@/lib/content";
import { ui, type Locale } from "@/lib/i18n";

const spring = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

export function About({ locale }: { locale: Locale }) {
  const { profile, certifications } = getContent(locale);
  const t = ui[locale].about;
  return (
    <section id="about" className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-10 sm:py-36">
      <Reveal variant="slide-right" speed="fast" className="eyebrow mb-12 flex items-center gap-3">
        <span className="h-px w-10 bg-brand" /> {t.eyebrow}
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="font-display text-h1 font-medium text-foreground">
            <MaskLines
              lines={[
                <Fragment key="1">{t.line1}</Fragment>,
                <Fragment key="2">
                  <span className="font-serif-it text-brand">{t.accent}</span>
                  {t.line2}
                </Fragment>,
              ]}
            />
          </h2>

          <Reveal variant="blur" speed="slow" delay={0.15}>
            <p className="mt-10 max-w-2xl text-lead text-muted-foreground">
              {profile.blurb}
            </p>
          </Reveal>

          {/* Three checkable facts from the day job, on the same hairlines as the systems index */}
          <Stagger
            amount={0.09}
            delay={0.2}
            className="mt-14 grid border-t border-border sm:grid-cols-[1.5fr_1fr_1fr]"
          >
            {[
              { v: "MT540–548", l: t.settlementNote },
              { v: "55", l: t.apiOps },
              { v: "170+", l: t.fixTests },
            ].map((x) => (
              <StaggerItem key={x.v} variant="up" speed="fast" className="border-b border-border py-6 sm:pe-6">
                <div dir="ltr" className="font-display text-4xl font-semibold tabular-nums text-foreground rtl:text-end sm:text-5xl">
                  {x.v}
                </div>
                <div className="mt-2 max-w-[24ch] text-sm text-muted-foreground">{x.l}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal variant="slide-left" delay={0.1} className="group lg:col-span-4">
          <Bezel
            className={`h-full transition-transform ${spring} group-hover:-translate-y-1`}
            innerClassName="relative flex h-full flex-col p-7"
          >
            <div className="mono mb-5 text-xs uppercase tracking-[0.25em] text-brand">
              {t.recognition}
            </div>
            <ul className="mb-8 space-y-4">
              {certifications.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mono text-brand">+</span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mono mt-auto border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
              {t.degree}
              <br />
              {t.school}
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}
