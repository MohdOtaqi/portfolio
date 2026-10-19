@AGENTS.md

# Mohammad's portfolio (Next.js)

Personal portfolio — this folder is the app root (src/, public/, components.json), deployed via Vercel, shadcn-style components.

Session memory: `~/.claude/projects/D--New-folder/memory/` — includes verified facts for all 8 personal projects + 8 ZagTrader work projects (`personal-projects.md`, `zagtrader-projects.md`), CV state, and portfolio decisions. **Use those files as the source of truth for project descriptions.**

## Rules
- **Never invent metrics or achievements.** Verified facts only — this is his public professional face.
- Add, don't replace, when editing CV/portfolio content.
- Project screenshots are REAL captured app screens (mot-1/2/3.png, masra-1/2/3.png) — don't swap for mockups.
- MOT is ONE product: the Flutter app + the n0tmot.com web platform (formerly Odispear), one entry on the site and CV (corrected by Mohammad 2026-10-19).
- Use **VitalGuard**, not MedGuard (MedGuard = its graduation-project origin). Its card shows app screens + the 3D-printable case renders; the interactive viewer is `public/vitalguard/wristband-viewer.html`, copied from `D:\VitalGuard\hardware\wristband\enclosureiewer\` (re-copy after the case changes).
- Solo authorship on everything except Sabaq (3-dev team; he owned the Django backend + MCP). Sabaq is now **Sudur** — always keep the team-origin line when describing it.
- **CVs are HTML in `cv/`** → `node cv/build.mjs` writes all three PDFs into `public/`: `cv.html` (master, 4 pages, compact ZagTrader section), `cv-app-backend.html` and `cv-app-fullstack.html` (2 pages each, shared `app.css`). Fonts MUST be the static per-weight Inter files in `cv/fonts` (a variable font embeds as Type3 and looks blurry vs Canva). Header icons in `cv/icons/` were extracted from the original Canva PDF.
- Status labels (`status` in data.ts) must match reality: Play closed/internal testing ≠ public release.
- QA: `node _qa/update-2026-10.mjs` against `npx next start -p 3123` (Edge channel; bundled Chromium isn't installed).

## Structure (2026-10-19)
- Two languages: `/` (en) and `/ar` (Arabic, RTL). UI strings live in `src/lib/i18n.ts`; content is `src/lib/data.ts` (en) with an Arabic overlay in `src/lib/data.ar.ts` keyed by English name/title, merged by `getContent(locale)` in `src/lib/content.ts`. **Any content change must be made in BOTH data.ts and data.ar.ts.**
- Every section component takes `locale`; the page itself is `src/components/home-page.tsx`.
- Project pages: `/work/<slug>` and `/ar/work/<slug>` (`src/components/project-page.tsx`). They use the `slug` and `highlights` fields.
- The top bar (`nav.tsx`) has the 3-CV Résumé menu and the language switch. On phones, Selected Work is a list (the tab rail is desktop-only).
- Vercel Web Analytics + Speed Insights are mounted in the root layout. They need enabling in the Vercel dashboard; until then `/_vercel/*` returns 404.
