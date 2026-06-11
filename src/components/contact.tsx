"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { MaskLines, Reveal } from "./reveal";
import { Magnetic } from "./magnetic";
import { GithubIcon, LinkedinIcon } from "./icons";
import { Bezel, CtaLink } from "@/components/ui/bezel";
import { profile } from "@/lib/data";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-[1400px] px-5 pt-28 pb-12 sm:px-10 sm:pt-36"
    >
      <Reveal className="eyebrow mb-10 flex items-center gap-3" variant="slide-right" speed="fast">
        <span className="h-px w-10 bg-brand" /> Contact
      </Reveal>

      <h2 className="display-hero text-foreground text-h1">
        <MaskLines
          lines={[
            <Fragment key="1">Let&apos;s build</Fragment>,
            <Fragment key="2">
              something that <span className="font-serif-it text-brand">holds</span>.
            </Fragment>,
          ]}
        />
      </h2>

      {/* Climax: a rule that draws in, then the monospace email beneath it */}
      <div className="mt-16 sm:mt-20">
        <motion.span
          aria-hidden
          className="block h-px w-full origin-left bg-border"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 1.1, ease: EXPO }}
        />

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          {/* Primary panel — machined bezel holding the monospace email + CTAs */}
          <Reveal variant="blur" speed="slow" className="w-full lg:max-w-xl">
            <Bezel innerClassName="flex h-full flex-col gap-8 p-8 sm:p-10">
              <div>
                <div className="mono mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Reach out
                </div>
                <Magnetic strength={0.18}>
                  <a
                    href={`mailto:${profile.email}`}
                    data-cursor="hover"
                    className="group relative inline-block mono break-all text-sm font-medium uppercase tracking-[0.08em] text-foreground transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none sm:text-xl sm:tracking-[0.12em] md:text-2xl"
                  >
                    {profile.email}
                    {/* left→right growing underline */}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </a>
                </Magnetic>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <CtaLink href={`mailto:${profile.email}`} variant="solid">
                  Get in touch
                </CtaLink>
                <CtaLink href={profile.resumeUrl} variant="ghost">
                  Résumé
                </CtaLink>
              </div>
            </Bezel>
          </Reveal>

          <Reveal variant="slide-left" speed="fast" className="flex items-center gap-3">
            <Magnetic>
              <a
                aria-label="GitHub"
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="grid h-12 w-12 place-items-center rounded-full border border-border text-muted-foreground transition-[transform,color,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand focus-visible:outline-none"
              >
                <GithubIcon size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                aria-label="LinkedIn"
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="grid h-12 w-12 place-items-center rounded-full border border-border text-muted-foreground transition-[transform,color,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand focus-visible:outline-none"
              >
                <LinkedinIcon size={18} />
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>

      {/* Small authored credit — deliberately quiet, not a hero echo */}
      <footer className="mono mt-20 flex items-center justify-between border-t border-border pt-5 text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
        <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full border border-border text-[0.6rem] tracking-normal text-foreground">
          MO
        </span>
        <span>MO · Amman</span>
        <span className="hidden sm:inline">© 2026</span>
      </footer>
    </section>
  );
}
