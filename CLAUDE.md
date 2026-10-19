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
- **CV source is `cv/cv.html`** → `node cv/build.mjs` writes `public/Mohammad-Otaqi-CV.pdf` (Edge via Playwright, Inter bundled in `cv/fonts`). The Canva copy is no longer the master.
- Status labels (`status` in data.ts) must match reality: Play closed/internal testing ≠ public release.
- QA: `node _qa/update-2026-10.mjs` against `npx next start -p 3123` (Edge channel; bundled Chromium isn't installed).
