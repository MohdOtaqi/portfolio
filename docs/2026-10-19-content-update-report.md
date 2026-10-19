# Portfolio + CV update — 2026-10-19

## What changed

**Portfolio (`src/lib/data.ts` + components)**
- Night work: added **Sudur** (replaces the Sabaq card, keeps the 3-dev hackathon origin), **Mabsim** (clinic SaaS), **Wared** (inventory/warehouse SaaS), **Word Oasis** (Arabic word game). Real screenshots from each repo's own captures (store shots, UX-walkthrough and design screenshots) are in `public/apps/`.
- New "Also on the bench" text index under Selected work: onecli, VitalGuard, rental marketplace, QrBooking. These have no screenshots yet.
- Day: the ZagTrader project entries existed in `data.ts` but were never rendered. The new `DayWork` component (`#systems`) lists them: Swift Suite + public API, ZT-AMTP, FixPortal, ZagKeyGenWeb, exchange/market-data connectors.
- Experience bullets updated from the 2026-10-19 work summary. WatchList, ZagTraderConnector and Inno Setup lines are kept.
- Skills: added backend, Postgres/Docker, security and testing items, plus a new "Testing & Automation" group.
- Odispear copy: removed the stale AWS deploy wording, since the site now runs on Hetzner Docker Compose.
- SEO metadata and JSON-LD descriptions refreshed.

**Fixes found while checking**
- About stats were hardcoded and unverified ("7+ systems shipped", "5 core platforms"). They are now "platforms built" (derived from the listed Day systems), "7 venue & feed integrations" (CMC FX, IDC, OKX, Crypto.com, AIX, BVB, CoinMENA) and "3 years building".
- The "NN projects · shipped" label was untrue for hackathon MVPs and pre-launch apps. It now reads "NN projects", and each project carries an honest `status`.
- With 11 tabs, autoplay walked the active tab off-screen in the rail. The rail now scrolls itself to keep the active tab visible.
- Four event photos were referenced but missing, which produced four 404s in every visitor's console. The paths are removed and the designed covers show instead.
- New descriptions were trimmed so the featured panel stays at 580px for every project, so switching tabs doesn't reflow the page.

**CV**
- Rebuilt from `cv/cv.html` and printed with Edge (`node cv/build.mjs`). Same Inter layout as the Canva version, now 4 pages: 2 for the CV, 2 for projects. No existing content was removed.
- Fixed: "Technical Support System Controller" now has its organisation (HTU Student Activities); the summary leads with the current .NET/fintech role.

## Verified
- `next build` is clean. Lint shows the same 22 pre-existing findings as before (in cursor/network/dead scene code); there are none in the changed files.
- `_qa/update-2026-10.mjs` in Edge at 1440 and 390 px: no horizontal overflow, 0 console errors, 0 failed requests, 11 tabs, the last tab stays visible, and the workshop list renders.
- `_qa/panel-heights.mjs`: the desktop panel is 580px for all 11 projects.
- CV PDF text extracts with pdftotext (1,900+ words).

## Open
- Confirm with ZagTrader that the venue names (Crypto.com, AIX, BVB, CoinMENA, Tadawul/Edaa) can be public. If not, genericise them in `data.ts` and `cv/cv.html`.
- Real event photos for `public/events/`.
- `nav.tsx` exists but has never been mounted, so the site has no top nav. The CV link is only in the Contact section.
- Flip statuses when apps go public: Sudur, Word Oasis and MOT are currently on Play testing tracks.
