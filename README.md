# Mohammad Otaqi — Portfolio

A personal developer portfolio. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**. Glassmorphism + gradient aesthetic with a cyan/electric-blue accent.

## Run locally

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

## Edit your content (this is the important file)

All text — bio, skills, experience, projects, certifications — lives in **one file**:

```
src/lib/data.ts
```

Change the strings there and the whole site updates. No need to touch the components.

- **Add a personal project** → add an object to the `projects` array.
- **Add/replace your CV** → drop the PDF in `public/` and set `profile.resumeUrl`.
- **Change links** → `profile.socials` (GitHub, LinkedIn) and `profile.email`.

## Structure

```
src/app/layout.tsx     SEO metadata, fonts, background layers
src/app/page.tsx       Section order
src/app/globals.css    Design system (colors, glass, gradients, grain)
src/lib/data.ts        ← YOUR CONTENT
src/components/        Hero, About, Skills, Experience, Projects, Contact…
```

## Deploy (free, recommended: Vercel)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. Vercel auto-detects Next.js. Click Deploy. Done.
4. (Optional) Add a custom domain. Then update `SITE_URL` in `src/app/layout.tsx`.

## Notes

- Fonts: **Clash Display** + **Satoshi** via Fontshare, **JetBrains Mono** via next/font.
- Fully responsive, accessible, and SEO-ready (Open Graph + metadata).
- The ZagTrader work is described at a high level only (no confidential detail).
