# Games and apps update, 2026-11-04

Added 8 games and 3 apps to the site, in English and Arabic, each with its own `/work/<slug>` page.

## Added

| Entry | Type | Status label | Source repo |
|---|---|---|---|
| Eishha | Game | In development | D:\NewGame\eishha |
| Shawarma Street | Game | In development | D:\NewGame\shawarma |
| Teta's Stall | Game | In development | D:\NewGame\teta |
| Hadaf | Game | In development | D:\NewGame\hadaf |
| Mundass | Game | Play closed testing, live web guest client | party_games/apps/imposter |
| Midad | Game | Play closed testing | arabic_daily |
| Jabeen | Game | Play closed testing | party_games/apps/charades |
| Laffa | Game | Play closed testing | party_games/apps/truth_dare |
| Owzy | App | Play closed testing | D:\MyMoney |
| Wird | App | Play closed testing | faith_lock |
| Ameno | App | Preparing for Play closed testing | wanas |

Word Oasis moved from Selected Work to the new Games section and gained an Arena highlight.

## Site changes

- New section `src/components/games.tsx` (`#games`), with a Games link in the top bar.
- `Project` gained `category: "game"` and `altName`.
- Selected Work now shows 12 products. Games shows 9.

## Screenshots

Real captures, converted to 620 px wide webp in `public/apps/`. Owzy's are cropped out of its store images, which frame real screens rendered with sample data. Ameno's are the 2026-11-02 shots with the new name; older Wanas shots were avoided.

## Checks

- `_qa/games-2026-11.mjs` in Edge: 9 games at desktop, tablet and phone in en and ar, no horizontal overflow, no broken images, all 12 project pages return 200 with no overflow at desktop and phone in both languages.
- `_qa/panel-heights.mjs`: 580 px on all 12 desktop panels.
- `lefthook run audit`: osv-scanner 0 Critical, 0 High, 3 Medium (no new dependencies added). knip and osv-scanner exit non-zero on findings that do not come from this change.

## Open

- Arabic copy needs Mohammad's proofread.
- Status labels need updating when a game reaches Play or Ameno is resubmitted.
- CVs were not changed.
