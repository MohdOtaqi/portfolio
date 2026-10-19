// One entry point for localized content: English from data.ts, Arabic overlaid from data.ar.ts.
import * as en from "./data";
import * as arData from "./data.ar";
import type { Locale } from "./i18n";

export type { Project, Experience, WorkshopItem, EventItem } from "./data";

export function getContent(locale: Locale) {
  if (locale === "en") {
    return {
      profile: en.profile,
      skillGroups: en.skillGroups,
      experience: en.experience,
      projects: en.projects,
      workshop: en.workshop,
      events: en.events,
      certifications: en.certifications,
    };
  }
  return {
    profile: { ...en.profile, blurb: arData.profileAr.blurb },
    skillGroups: en.skillGroups.map((g) => ({ ...g, title: arData.skillTitlesAr[g.title] ?? g.title })),
    experience: en.experience.map((x) => {
      const t = arData.experienceAr[x.company];
      return t ? { ...x, role: t.role, company: t.company ?? x.company, period: t.period, summary: t.summary, highlights: t.highlights } : x;
    }),
    projects: en.projects.map((p) => {
      const t = arData.projectsAr[p.name];
      if (!t) return p;
      return {
        ...p,
        name: t.name ?? p.name,
        blurb: t.blurb,
        description: t.description,
        status: t.status ?? p.status,
        highlights: t.highlights ?? p.highlights,
        links: p.links?.map((l) => ({ ...l, label: t.links?.[l.label] ?? l.label })),
        companion: p.companion && { ...p.companion, caption: t.caption ?? p.companion.caption },
      };
    }),
    workshop: en.workshop.map((w) => {
      const t = arData.workshopAr[w.name];
      return t ? { ...w, name: t.name ?? w.name, kind: t.kind, description: t.description, tags: t.tags ?? w.tags } : w;
    }),
    events: en.events.map((e) => ({ ...e, ...(arData.eventsAr[e.title] ?? {}) })),
    certifications: en.certifications.map((c) => arData.certificationsAr[c] ?? c),
  };
}

export type Content = ReturnType<typeof getContent>;

/** Night projects that have their own page, in display order. */
export function workProjects(locale: Locale) {
  return getContent(locale).projects.filter((p) => !p.internal && p.slug);
}
