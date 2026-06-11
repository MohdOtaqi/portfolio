import { Fragment } from "react";
import { Reveal, MaskLines, Stagger, StaggerItem } from "./reveal";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { Bezel } from "@/components/ui/bezel";
import { profile, certifications } from "@/lib/data";

const spring = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-10 sm:py-36">
      <Reveal variant="slide-right" speed="fast" className="eyebrow mb-12 flex items-center gap-3">
        <span className="h-px w-10 bg-brand" /> Day — The engineer
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="font-display text-h1 font-medium text-foreground">
            <MaskLines
              lines={[
                <Fragment key="1">I engineer systems where</Fragment>,
                <Fragment key="2">
                  <span className="font-serif-it text-brand">reliability</span> isn&apos;t optional —
                </Fragment>,
                <Fragment key="3">it&apos;s the product.</Fragment>,
              ]}
            />
          </h2>

          <Reveal variant="blur" speed="slow" delay={0.15}>
            <p className="mt-10 max-w-2xl text-lead text-muted-foreground">
              {profile.blurb}
            </p>
          </Reveal>

          {/* Asymmetric bento: one large feature stat + three smaller ones, each a machined plate */}
          <Stagger
            amount={0.09}
            delay={0.2}
            className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:grid-rows-2"
          >
            <StaggerItem
              variant="up"
              speed="normal"
              className="group col-span-2 sm:col-span-1 sm:row-span-2"
            >
              <Bezel
                className={`h-full transition-transform ${spring} group-hover:-translate-y-1`}
                innerClassName="flex h-full flex-col justify-between p-6 sm:p-7"
              >
                <div className="mono text-[11px] uppercase tracking-[0.25em] text-brand">
                  Settlement
                </div>
                <div className="mt-10">
                  <div className="font-display text-5xl font-semibold leading-none text-foreground sm:text-6xl">
                    <span className="text-brand">MT54x</span>
                  </div>
                  <div className="mono mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    SWIFT settlement (ISO 15022)
                  </div>
                </div>
              </Bezel>
            </StaggerItem>

            {[
              { n: 7, s: "+", l: "systems shipped" },
              { n: 3, s: "", l: "years building" },
              { n: 5, s: "", l: "core platforms" },
            ].map((x, i) => (
              <StaggerItem key={i} variant="up" speed="fast" className="group">
                <Bezel
                  className={`h-full transition-transform ${spring} group-hover:-translate-y-1`}
                  innerClassName="flex h-full flex-col justify-center p-5"
                >
                  <div className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                    <NumberTicker value={x.n} className="text-foreground" />
                    <span className="text-brand">{x.s}</span>
                  </div>
                  <div className="mono mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {x.l}
                  </div>
                </Bezel>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal variant="slide-left" delay={0.1} className="group lg:col-span-4">
          <Bezel
            className={`h-full transition-transform ${spring} group-hover:-translate-y-1`}
            innerClassName="relative flex h-full flex-col p-7"
          >
            <BorderBeam size={140} duration={10} colorFrom="#5ef0ff" colorTo="#7c83ff" />
            <div className="mono mb-5 text-xs uppercase tracking-[0.25em] text-brand">
              Recognition
            </div>
            <ul className="space-y-4">
              {certifications.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mono text-brand">+</span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mono mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
              B.Sc. Computer Science
              <br />
              Al Hussein Technical University — 2025
            </div>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}
