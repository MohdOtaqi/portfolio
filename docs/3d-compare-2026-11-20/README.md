# 3D enhancement: 6-model design comparison (2026-11-20)

Every model got the same brief, the same 3 skills (`frontend-design`, `threejs-skills`, `fixing-motion-performance`) and effort **high**. Each worked in its own worktree off `main` 56a8f3c. The brief was an interactive, animated 3D enhancement that keeps the day/night identity, lazy-loads, falls back to static under reduced motion, has a lighter phone mode, pauses off-screen, and supports `/ar`.

- Claude models ran as subagents: sonnet, opus, fable, haiku.
- Gemini models ran through `agy`: `gemini-4-neon-high` and `gemini-4-hydrogen-high`.

All screenshots and FPS below come from one harness run by the orchestrator: Edge, 1440x900 and 390x844, a 165 Hz display, rAF counted over 3 s. The contact sheets are in this folder.

| Model | Branch | Concept | Where | Hero FPS | Dusk FPS | Score /10 |
|---|---|---|---|---|---|---|
| Fable | `design/3d-fable` | Armillary sphere, brass by day and steel by night, split on the seam; unfolds on load, scroll turns it | Hero | 165 | 165 | **8.5** |
| Opus | `design/3d-opus` | Low-poly Amman at dusk: office lights off, home lights, streetlights and cars on; cursor lights windows | Dusk | 165 | 98 | **8.5** |
| Sonnet | `design/3d-sonnet` | Planet on the seam (day side and night side with city lights), moon, cursor sun, drag spin | Hero | 98 | 163 | 7 |
| Hydrogen | `design/3d-hydrogen` | Thin brass/silver armillary rings in the hero plus a topographic contour horizon at dusk | Hero + Dusk | 103 | 86 | 6.5 |
| Haiku | `design/3d-haiku` | The Dusk horizon line becomes a planet limb; scroll sweeps the terminator | Dusk | 165 | 150 | 6 |
| Neon | `design/3d-neon` | Armillary plus orbs in the hero; sun and moon on large rings at dusk | Hero + Dusk | 119 | 139 | 5.5 |

## Notes per model

- **Fable:** the most finished 3D object, with real metal shading. It solves name readability (a solid copy of the name sits above the canvas, so the blend doesn't tint the letters). The axis is tilted to Amman's latitude. It is mirrored on `/ar`, fixes the pre-existing React #418 under reduced motion, and has the lightest bundle (141 KB gzip, raw three.js). Weaknesses: busy behind the name, cluttered on phones, and it changed one `/ar` text alignment (`ms-auto`/`text-end`).
- **Opus:** the most original and personal idea. "When the markets close, the building begins" becomes Amman switching from office lights to home lights. It is calm and doesn't cover any text. Weaknesses: not on the first screen, not mirrored for `/ar`, a 237 KB chunk, and it made the Dusk section taller.
- **Sonnet:** a strong concept that fits the seam. Weaknesses: the planet is cut off with a hard edge at the bottom of the hero, the moon crosses "OTAQI", the planet sits under the Arabic text on `/ar`, and the reduced-motion poster is crude.
- **Hydrogen:** elegant and restrained, and the contour horizon is a nice touch. Weaknesses: the rings read as a flat wireframe, and they cross the night text on `/ar`.
- **Haiku:** safe and clean, and it also fixed #418. Weaknesses: nothing on the first screen, a visibly faceted planet edge, and a muddy sunset stage.
- **Neon:** the busiest. The orbs and dots compete with the name, the large flat pink ring at dusk looks pasted on, and the hero overlaps the Arabic text.

**Neon and Hydrogen** came up with nearly the same idea (armillary + dusk orrery). Fable also chose an armillary.

## Recommendation

Fable (hero) and Opus (dusk) live in different sections, so they can be combined: the armillary on the first screen and Amman at dusk. Both chunks are lazy and load separately. The pre-existing reduced-motion #418 fix (Fable/Haiku `use-reduced-motion` hook) is worth keeping either way.
