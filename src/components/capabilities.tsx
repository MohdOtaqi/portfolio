"use client";

import { Reveal, Stagger, StaggerItem } from "./reveal";
import { getContent } from "@/lib/content";
import { ui, type Locale } from "@/lib/i18n";

export function Capabilities({ locale }: { locale: Locale }) {
  const { skillGroups } = getContent(locale);
  const t = ui[locale].toolkit;
  return (
    <section
      id="capabilities"
      className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-36"
    >
      <Reveal className="eyebrow mb-6 flex items-center gap-3">
        <span className="h-px w-10 bg-brand" /> {t.eyebrow}
      </Reveal>

      <Reveal variant="blur" speed="slow" className="mb-12 max-w-2xl">
        <h2 className="font-display text-h2 font-medium tracking-tight text-foreground">
          {t.title}
        </h2>
      </Reveal>

      <Stagger className="border-t border-border" amount={0.07}>
        {skillGroups.map((group, i) => (
          <StaggerItem key={group.title} variant="up" speed="fast">
            <div className="group grid grid-cols-12 items-start gap-4 border-b border-border py-8 transition-colors hover:bg-card/60">
              <div className="col-span-12 flex items-center gap-5 sm:col-span-4">
                <span className="mono text-xs text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h3 font-medium tracking-tight text-foreground transition-colors group-hover:text-brand">
                  {group.title}
                </h3>
              </div>
              <div className="col-span-12 flex flex-wrap gap-2 sm:col-span-8">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors group-hover:border-foreground/30 group-hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
