export const profile = {
  name: "Mohammad Otaqi",
  role: "Software Engineer",
  location: "Amman, Jordan",
  email: "otaqi.mohammad11@gmail.com",
  resumeUrl: "/Mohammad-Otaqi-CV.pdf",
  socials: {
    github: "https://github.com/MohdOtaqi",
    linkedin: "https://jo.linkedin.com/in/mohammad-otaqi-ba5a17257",
  },
  // Day = the professional engineer
  dayBlurb:
    "By day I'm a Software Engineer at ZagTrader, building capital-markets infrastructure: a SWIFT (ISO 15022) securities-settlement platform and its public API, FIX connectivity, exchange and market-data connectors, cryptographic licensing, and an AI-driven test-automation platform — in C#/.NET, TypeScript, SQL Server and PostgreSQL.",
  // Night = the maker
  nightBlurb:
    "By night I design and ship my own products — mobile apps on Google Play and multi-tenant SaaS built with Flutter, React Native, Next.js, Django and Node. It's where I experiment, learn fast, and turn ideas into things people can actually use.",
  blurb:
    "Software Engineer building fintech infrastructure at ZagTrader by day — SWIFT & FIX messaging, exchange connectivity, an AI test-automation platform — and shipping my own mobile apps and SaaS products by night.",
};

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["C#", "TypeScript", "JavaScript", "Dart", "Python", "Java", "SQL"],
  },
  {
    title: ".NET & Backend",
    items: [".NET 8–10", "ASP.NET Core", "SignalR", "Entity Framework Core", "Web APIs", "Background Services", "Node.js · Fastify", "NestJS", "Django · DRF", "REST / OpenAPI", "Webhooks"],
  },
  {
    title: "Fintech & Protocols",
    items: ["SWIFT (ISO 15022 · MT540–548)", "FIX 4.4 / 5.0 SP2 (QuickFIX/n)", "SoupBinTCP", "ITCH", "SOAP / CoreWCF", "SFTP", "Market data", "JoFotara e-invoicing"],
  },
  {
    title: "Frontend & Mobile",
    items: ["React", "Next.js", "Flutter", "React Native · Expo", "TanStack Query", "Tailwind CSS", "Material UI", "Vite"],
  },
  {
    title: "Security & Interop",
    items: ["Cryptography (AES · 3DES · HMAC · PBKDF2)", "Ed25519 · TLS pinning", "JWT", "OAuth · Entra SSO", "OTP / 2FA", "RBAC", "Azure Key Vault", "HashiCorp Vault", "IKVM (Java↔.NET)", "Prowide"],
  },
  {
    title: "Data & Tooling",
    items: ["SQL Server", "PostgreSQL", "Supabase", "Valkey / Redis", "Prisma · Drizzle", "MongoDB", "Firebase", "Docker Compose", "CI/CD (GitHub · Gitea · EAS)", "Git / GitHub", "MessagePack", "Inno Setup"],
  },
  {
    title: "Testing & Automation",
    items: ["Playwright", "Vitest", "xUnit", "Jest", "Temporal workflows", "LLM test agents"],
  },
  {
    title: "Local LLMs & Hardware",
    items: ["Ollama · LM Studio · llama.cpp", "GGUF / K-quants", "GPU + VRAM sizing", "CUDA · layer offload", "Local OpenAI-compatible APIs · Open WebUI", "Hugging Face (Llama · Qwen · Mistral)", "PC / workstation builds"],
  },
  {
    title: "AI & Agentic Engineering",
    items: ["Prompt & context engineering", "Structured / JSON output", "Prompt caching", "Tool / function calling", "Agent harnesses", "MCP (Model Context Protocol)", "Claude Code · Cursor"],
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    company: "ZagTrader",
    period: "Sep 2025 — Present",
    summary:
      "Post-trade and market-data infrastructure for a capital-markets platform.",
    highlights: [
      "Built the Swift Suite — Engine, Bridge & Monitor — an end-to-end SWIFT securities-settlement platform processing ISO 15022 MT540–MT548, MT564 and MT598/599 with a maker-checker approval workflow.",
      "Engineered the Swift Engine: an async task pipeline (reader → validator → builder → SWIFT validator → sender → archiver) that builds MT messages from SQL Server templates and validates them with Prowide via IKVM (Java↔.NET interop).",
      "Built the Swift Bridge gateway relaying messages between the engine (TCP / MessagePack) and external operators — Fineksus (SOAP/CoreWCF), Tadawul·Edaa (SoupBinTCP) and SFTP — and rebuilt the Tadawul·Edaa templates from the ISO 15022 spec, fixing real network NAKs.",
      "Designed the platform's public REST API (55 OpenAPI operations): scoped, rotatable API keys with deprecation/sunset headers, idempotent submission, signed webhooks with an event outbox and RFC 7807 errors — 59/59 endpoints verified live.",
      "Added Azure Key Vault / HashiCorp Vault secrets management, an RBAC permission system with custom roles, and offline TOTP 2FA enrollment across the suite.",
      "Built the GUI and production release pipeline for ZT-AMTP, a multi-agent LLM platform that crawls web apps and generates, runs and certifies Playwright tests (Temporal, Fastify, Drizzle/PostgreSQL, React); raised the customer-app pass rate from 41% to 67.7%.",
      "Delivered FixPortal to production: FIX validation against QuickFIX/n dictionaries, per-market rules and message diffing — ASP.NET Core + EF Core + PostgreSQL + React, 170+ automated tests and CI/CD.",
      "Integrated exchange connectivity: Crypto.com FIX (HMAC logon, TLS pinning, market data + order entry), AIX FIX reference data, BVB SOAP reference data (845 instruments) and CoinMENA REST with Ed25519 signing — alongside CMC Markets FX and OKX (WebSocket v5) connectors.",
      "Built the IDC historical-data reader (.NET 10, WebSocket → SQL Server) that replaced a legacy PHP job and added intraday resolutions.",
      "Created WatchList dashboard (React + SignalR) for real-time market-data visualization; built the Swift Monitor dashboard (React 19 + TypeScript, SignalR) with audit trail, template versioning/diff, and OTP/2FA auth.",
      "Shipped ZagKeyGenWeb hardware-bound licensing (TripleDES, HMAC-SHA256, AES-256/PBKDF2) to production on Docker Compose with PostgreSQL, role-based access and an audit trail.",
      "Migrated five Swift/FIX repositories from SVN to Gitea; analyzed ZagTraderConnector integrations and database architecture to inform middleware planning; packaged apps via Inno Setup.",
    ],
    tags: ["C#", ".NET 10", "ASP.NET Core", "React", "TypeScript", "SignalR", "SWIFT", "FIX", "SQL Server", "PostgreSQL", "Docker", "Playwright"],
  },
  {
    role: "Flutter & Mobile Developer",
    company: "Lightning Gate (JPECO)",
    period: "Jul 2024 — Mar 2025",
    summary: "Built and shipped cross-platform mobile applications.",
    highlights: [
      "Developed mobile apps with Flutter & Firebase, focused on stability and scalability.",
      "Partnered with designers and developers to deliver features and fix bugs, improving UX and reliability.",
    ],
    tags: ["Flutter", "Dart", "Firebase"],
  },
  {
    role: "Esports Staff",
    company: "Jordan Esports Federation (JEF/JEG)",
    period: "Jul 2023 — May 2025",
    summary: "IT support and officiating for national esports tournaments.",
    highlights: [
      "Provided IT support and served as a referee during official esports tournaments.",
      "Ensured smooth execution of competitive events by managing technical infrastructure.",
    ],
    tags: ["IT Support", "Esports"],
  },
  {
    role: "Technical Support System Controller",
    company: "HTU Student Activities",
    period: "Nov 2021 — Jul 2024",
    summary: "Managed IT systems and coordinated technical support for student events.",
    highlights: [
      "Managed IT systems and coordinated technical support for student events and activities.",
      "Led technical operations for large-scale events, including MACH1 with AreoSquad at King's Academy.",
    ],
    tags: ["IT Support", "Event Tech"],
  },
  {
    role: "Technical Support & Web Development",
    company: "HTU Online Learning Center",
    period: "Jun 2023 — Oct 2023",
    summary: "Contributed to the HTUx platform and supported staff.",
    highlights: [
      "Drafted user manuals and technical documentation to streamline onboarding.",
      "Delivered IT support that cut issue-resolution time and improved workflow continuity.",
    ],
    tags: ["Web", "Docs", "Support"],
  },
];

export type Project = {
  name: string;
  blurb: string;
  description: string;
  tags: string[];
  year: string;
  internal?: boolean; // true = ZagTrader (Day), false = personal (Night)
  links?: { label: string; href: string }[];
  /** screenshots for the demo mockup — drop files in /public/apps/ and list paths here */
  media?: string[];
  /** "phone" = mobile mockup, "browser" = desktop mockup */
  device?: "phone" | "browser";
  demoUrl?: string;
  /** honest release state shown next to the year, e.g. "Play closed testing" */
  status?: string;
  /** URL segment of the project's own page (/work/<slug>); night projects only */
  slug?: string;
  /** "What I built" bullets for the project page (from the verified CV bullets) */
  highlights?: string[];
  /** a second visual layered beside the main mockup: the phone app of a web product,
   *  or renders of a physical device */
  companion?: { kind: "phone" | "render"; media: string[]; caption?: string };
};

export const projects: Project[] = [
  // ---- DAY · ZagTrader ----
  {
    name: "Swift Suite",
    year: "2025—26",
    internal: true,
    blurb: "SWIFT securities-settlement platform (Engine · Bridge · Monitor) and its public API.",
    description:
      "End-to-end platform processing ISO 15022 MT540–548, MT564 and MT598/599 settlement messages. An async .NET engine builds & validates messages (Prowide via IKVM); a bridge relays to Fineksus / Tadawul·Edaa / SFTP; a React + SignalR monitor adds real-time status, audit, maker-checker approval, RBAC and TOTP 2FA. A public REST API (55 operations) exposes it to clients with scoped API keys, idempotent submission and signed webhooks; secrets load from Azure Key Vault or HashiCorp Vault.",
    tags: ["C#", ".NET 10", "React", "SignalR", "IKVM", "SQL Server", "OpenAPI"],
  },
  {
    name: "ZT-AMTP",
    year: "2026",
    internal: true,
    blurb: "AI-driven test-automation platform.",
    description:
      "A multi-agent platform that crawls a web app, generates test cases with LLMs, writes Playwright tests and runs and certifies them, orchestrated with Temporal. I built the GUI — a Fastify + Zod + Drizzle API on PostgreSQL and a React + TanStack Query front end with live run updates (LISTEN/NOTIFY → SSE), per-project RBAC, GitHub / Entra SSO and LLM token accounting — and the production release pipeline. Raised the customer-app pass rate from 41% to 67.7%.",
    tags: ["TypeScript", "Fastify", "Drizzle", "PostgreSQL", "React", "Temporal", "Playwright"],
  },
  {
    name: "FixPortal",
    year: "2025—26",
    internal: true,
    blurb: "FIX-protocol administration portal — in production.",
    description:
      "Validates FIX messages against QuickFIX/n dictionaries (standard, engine and uploaded), with per-market rules, saved messages, diffing and a file catalog; manages customers, markets, billing and sessions. ASP.NET Core + EF Core on PostgreSQL with a React front end, JWT token versioning and login rate limiting; 170+ automated tests and push-to-main CI/CD.",
    tags: ["ASP.NET Core", "EF Core", "PostgreSQL", "React", "QuickFIX/n"],
  },
  {
    name: "ZagKeyGenWeb",
    year: "2025—26",
    internal: true,
    blurb: "Cryptographic, hardware-bound licensing — in production.",
    description:
      "Generates and validates software licenses bound to host, database and operator limits, with tamper detection — TripleDES + HMAC-SHA256 integrity and AES-256/PBKDF2 secure-config decryption. Runs in production on Docker Compose with PostgreSQL, Admin/Operator roles and an audit trail.",
    tags: ["ASP.NET Core", "PostgreSQL", "Docker", "TripleDES", "HMAC", "AES"],
  },
  {
    name: "Exchange & market-data connectors",
    year: "2025—26",
    internal: true,
    blurb: "Crypto.com, AIX, BVB, CoinMENA, CMC Markets, OKX & IDC.",
    description:
      "Crypto.com FIX end to end (HMAC-signed logon, TLS certificate pinning, market data and order entry), AIX FIX 5.0 SP2 reference data, BVB SOAP reference data across 845 instruments, a CoinMENA FIX ↔ REST order bridge with Ed25519 signing, a CMC Markets FX reader, an OKX connector (WebSocket v5) and an IDC historical reader (WebSocket → SQL Server) that replaced a legacy PHP job.",
    tags: ["C#", "FIX", "WebSocket", "SOAP", "Ed25519", "SQL Server"],
  },
  // ---- NIGHT · personal ----
  {
    name: "Sudur",
    slug: "sudur",
    year: "2026",
    internal: false,
    status: "Play closed testing",
    blurb: "Quran-memorization app with AI recitation grading.",
    description:
      "A Hifz companion with a gesture-based Mushaf reader, AI recitation grading (Whisper), prayer times with adhan and home-screen widgets, in Arabic and English. It grew out of Sabaq, a 3-dev hackathon project where I owned the Django backend; I took it to release — Expo client, Django + PostgreSQL API, RevenueCat, AdMob and push-to-store CI.",
    tags: ["React Native", "Expo", "Django", "PostgreSQL", "Whisper", "RevenueCat"],
    device: "phone",
    media: ["/apps/sudur-1.webp", "/apps/sudur-2.webp", "/apps/sudur-3.webp"],
    links: [
      { label: "sudur.app", href: "https://sudur.app" },
      { label: "Hackathon repo", href: "https://github.com/aboodjq/SabaqHackathon" },
    ],
    highlights: [
      "Started as Sabaq with a 3-developer hackathon team; I owned the Django/DRF backend, the OAuth2 proxy and the MCP integration to the Quran Foundation API.",
      "Built AI recitation grading — Whisper speech-to-text fuzzy-matched against the riwaya-correct text, with diff feedback.",
      "Led the release as Sudur: Google Play closed testing and App Store submission, in Arabic and English, with its website at sudur.app.",
      "Gesture-based Mushaf reader, verse-by-verse audio, prayer times with adhan, revision scheduling and Android home-screen widgets.",
      "Release pipeline: push to main, 229 Jest tests, a signed build and a Play testing track with release notes; RevenueCat subscription and AdMob with UMP consent."
    ],
  },
  {
    name: "Mabsim",
    slug: "mabsim",
    year: "2026",
    internal: false,
    status: "Pre-launch",
    blurb: "Multi-tenant clinic management SaaS.",
    description:
      "Clinic software for MENA practices — online booking, patient records, a dental odontogram and orthopedic charts, JoFotara e-invoicing, insurance and lab cases, and WhatsApp reminders. Next.js 16 on Supabase PostgreSQL with per-clinic row-level security and database constraints that block double-bookings and overpayment. Arabic-first.",
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "RLS", "WhatsApp API"],
    device: "browser",
    media: ["/apps/mabsim-1.webp", "/apps/mabsim-2.webp"],
    highlights: [
      "Built a clinic platform for MENA practices: appointments, online booking with phone verification, patient records, invoices, recalls and a waitlist.",
      "Specialty records: a dental odontogram and a 44-point orthopedic chart, plus insurance claims, lab cases, prescriptions and consent letters.",
      "Integrated JoFotara (Jordan's national e-invoicing) and WhatsApp reminders over the Meta Cloud API behind a per-clinic sending gate.",
      "Tenant isolation with PostgreSQL row-level security; an exclusion constraint blocks overlapping bookings, a unique index double invoices and a trigger overpayment.",
      "Owner console with subscription warnings and one-click suspension; encrypted backups with a tested restore drill."
    ],
  },
  {
    name: "Wared",
    slug: "wared",
    year: "2026",
    internal: false,
    status: "Pre-launch",
    blurb: "Inventory & warehouse system for distributors.",
    description:
      "Inventory and warehouse management for Jordanian distributors — purchasing, sales, put-away, stock counts, FEFO expiry, serials, landed cost and JoFotara e-invoicing. Django 5 + DRF on PostgreSQL with schema-per-tenant isolation, an append-only stock ledger with exact decimal money, and an Arabic-first React PWA with barcode scanning.",
    tags: ["Django", "DRF", "PostgreSQL", "django-tenants", "React", "TypeScript", "PWA"],
    device: "browser",
    media: ["/apps/wared-1.webp", "/apps/wared-2.webp"],
    highlights: [
      "Built a schema-per-tenant SaaS for Jordanian distributors and wholesalers, with an Arabic-first RTL React PWA and barcode scanning.",
      "Append-only stock ledger with exact decimal money (JOD, 3 dp) and row-locked balances; weighted-average costing, FEFO expiry, serials and landed cost.",
      "Purchasing, sales, put-away, stocktakes, supplier returns and proof of delivery; JoFotara e-invoicing with credit notes.",
      "Plan tiers, an owner console, per-tenant subdomains with on-demand TLS, and backups proven by a real restore.",
      "All 45 Phase-1 “must” requirements implemented and tested; dedicated review agents gate tenant isolation, permissions, money arithmetic and migrations."
    ],
  },
  {
    name: "Word Oasis",
    slug: "word-oasis",
    year: "2026",
    internal: false,
    status: "Play closed testing",
    blurb: "Arabic letter-wheel crossword game.",
    description:
      "واحة الكلمات — an Arabic word game with 827 levels across 18 landmark chapters, generated from a 50,000-word Arabic list by my own Python level builder. Daily challenges, a lucky wheel, hints and a coin economy; AdMob (banner, interstitial, rewarded, app-open) with UMP consent, and RevenueCat in-app purchases. Built in Flutter.",
    tags: ["Flutter", "Dart", "AdMob", "RevenueCat", "Python"],
    device: "phone",
    media: ["/apps/wordoasis-1.webp", "/apps/wordoasis-2.webp", "/apps/wordoasis-3.webp"],
    highlights: [
      "Built an Arabic letter-wheel crossword with 827 levels across 18 landmark chapters.",
      "Wrote a Python level builder that generates the levels from a 50,000-word Arabic list.",
      "Daily challenge, lucky wheel, daily gift, chapter treasures, hints and a coin economy.",
      "Monetization: AdMob banner, interstitial, rewarded and app-open ads with UMP consent; RevenueCat in-app purchases.",
      "Prepared the store release (signing, listing, graphics, content rating) and submitted it to Google Play closed testing."
    ],
  },
  {
    name: "VitalGuard",
    slug: "vitalguard",
    year: "2025—26",
    internal: false,
    status: "In development",
    blurb: "Health wearable + companion app (grew from MedGuard).",
    description:
      "A health wristband and companion app, rebuilt from my MedGuard graduation project. The app tracks vitals against personal baselines, alerts carers on falls and critical readings, and walks through first aid step by step, in Arabic and English. The case is modelled in code (build123d), 3D-printable, and rendered in Blender.",
    tags: ["Flutter", "Fastify", "PostgreSQL", "Valkey", "build123d", "Blender"],
    device: "phone",
    media: ["/apps/vitalguard-1.webp", "/apps/vitalguard-2.webp", "/apps/vitalguard-3.webp", "/apps/vitalguard-4.webp"],
    companion: {
      kind: "render",
      caption: "Printable case · Blender",
      media: ["/apps/vitalguard-case-front.webp", "/apps/vitalguard-case-back.webp", "/apps/vitalguard-case-exploded.webp"],
    },
    links: [
      { label: "3D case viewer", href: "/vitalguard/wristband-viewer.html" },
      { label: "MedGuard (v1) repo", href: "https://github.com/Mo-Otaqi/Graduation-Project-MedGuard" },
    ],
    highlights: [
      "Rebuilding my MedGuard graduation project (Flutter + Firebase, BLE heart rate, Gemini health analysis, GPS emergency alerts) as a wearable product.",
      "The companion app tracks vitals against personal baselines, alerts carers on falls and critical readings, and guides first aid step by step, in Arabic and English.",
      "New backend on Fastify, PostgreSQL and Valkey, replacing Firebase.",
      "Designed the wristband case in code (build123d to STL/STEP), 3D-printable for fit-and-feel testing, with Blender renders and an interactive web 3D viewer.",
      "Wrote the device specification: sensors, display and buttons, connectivity, battery and materials."
    ],
  },
  {
    name: "MOT",
    slug: "mot",
    year: "2025—26",
    internal: false,
    status: "App on Play internal testing",
    blurb: "Gaming community platform — mobile app + n0tmot.com.",
    description:
      "One gaming platform on mobile and web. The Flutter + Firebase app does LFG matchmaking, real-time chat, a gaming-news feed and RevenueCat subscriptions; n0tmot.com (formerly Odispear) adds Discord-style servers, channels and roles with Socket.IO messaging and LiveKit voice/video, on Node/Express, PostgreSQL and Redis.",
    tags: ["Flutter", "Firebase", "React", "TypeScript", "Node.js", "PostgreSQL", "LiveKit"],
    device: "browser",
    demoUrl: "https://n0tmot.com",
    media: ["/apps/odispear-1.webp", "/apps/odispear-2.webp"],
    companion: { kind: "phone", media: ["/apps/mot-1.webp", "/apps/mot-2.webp", "/apps/mot-3.webp"] },
    links: [
      { label: "App repo", href: "https://github.com/MohdOtaqi/MOT" },
      { label: "Web repo", href: "https://github.com/MohdOtaqi/Odispear" },
    ],
    highlights: [
      "One gaming platform across a Flutter mobile app and the n0tmot.com web app (formerly Odispear), under the MOT brand.",
      "Mobile: profiles and look-for-group matchmaking by game, platform and playstyle; real-time 1:1 chat with typing/seen indicators and FCM push.",
      "A live gaming-news feed and a 300+ game database via the RAWG API; content moderation (toxicity filtering, reporting, age-gating) and Cloud Functions for feed fan-out.",
      "Web: Discord-style servers, channels, roles and DMs over Socket.IO, with LiveKit voice/video, RNNoise/Krisp noise filtering and push-to-talk.",
      "JWT + Google OAuth, premium tiers with RevenueCat and Stripe, and S3 media on a PostgreSQL + Redis backend; deployed with Docker Compose behind Caddy."
    ],
  },
  {
    name: "Masra",
    slug: "masra",
    year: "2025",
    internal: false,
    blurb: "Islamic education platform — Flutter app + Node/Prisma API.",
    description:
      "An educational platform around Al-Aqsa & Jerusalem: curated news, fatwa search, courses and gamified 30-day challenges. A Flutter client with offline-first caching and AR/EN localization, backed by a Node.js/Express + Prisma API on PostgreSQL (Supabase) with row-level security, a 12-panel admin CMS and GitHub Actions CI/CD.",
    tags: ["Flutter", "Node.js", "Prisma", "Supabase", "PostgreSQL"],
    device: "phone",
    media: ["/apps/masra-1.webp", "/apps/masra-2.webp", "/apps/masra-3.webp"],
    links: [{ label: "GitHub", href: "https://github.com/MasraAppJo/masra-platform" }],
    highlights: [
      "Built a Flutter app with offline-first caching and Arabic/English localization for news, fatwa search, courses and gamified 30-day challenges.",
      "Developed a Node.js/Express + Prisma API on PostgreSQL (Supabase) with row-level security and a secure points RPC.",
      "Created a 12-panel admin CMS for news, fatwas, courses, challenges and users.",
      "Set up GitHub Actions CI/CD for linting, builds and automated APK releases."
    ],
  },
  {
    name: "Sehleh",
    slug: "sehleh",
    year: "2025",
    internal: false,
    blurb: "On-demand local-services marketplace.",
    description:
      "A services marketplace connecting customers with local providers — geolocation discovery (PostGIS), booking with live provider tracking, in-app chat, ratings, and Stripe + Tap payments. Flutter (BLoC) customer & provider apps, a Next.js admin dashboard, and a Supabase backend with Edge Functions and KYC verification.",
    tags: ["Flutter", "BLoC", "Supabase", "PostGIS", "Next.js", "Stripe"],
    device: "phone",
    media: ["/apps/sehleh-1.webp", "/apps/sehleh-2.webp"],
    highlights: [
      "Built customer and provider Flutter apps (BLoC) for booking local services, with live provider GPS tracking and in-app chat.",
      "Geolocation discovery with PostGIS spatial queries and multi-role access (customer / provider / admin).",
      "Stripe and Tap payments via Supabase Edge Functions, FCM push notifications and KYC verification.",
      "A Next.js admin dashboard for users, providers, bookings and promotions."
    ],
  },
  {
    name: "Tabayyun",
    slug: "tabayyun",
    year: "2025",
    internal: false,
    blurb: "AI Arabic news & image-tampering verifier.",
    description:
      "An Arabic-first web tool that scores news credibility and flags manipulation — it pulls article content and runs LLM analysis (OpenAI) plus keyword/sentiment heuristics, and checks images with EXIF metadata, Error-Level Analysis and Sightengine AI-image detection. React 19 + Vite + Tailwind.",
    tags: ["React", "Vite", "OpenAI", "Sightengine", "Tailwind"],
    device: "browser",
    media: ["/apps/tabayyun-1.webp", "/apps/tabayyun-2.webp"],
    highlights: [
      "Scores news credibility from a URL or text using LLM analysis plus keyword and sentiment heuristics.",
      "Image forensics: EXIF metadata, Error-Level Analysis and Sightengine AI-generated-image detection.",
      "A trusted-source database and reverse-image-search links, in a fully right-to-left, animated UI.",
      "Hackathon project (Tech 3arabi)."
    ],
  },
  {
    name: "FactQuest",
    slug: "factquest",
    year: "2025",
    internal: false,
    blurb: "Gamified media-literacy trainer.",
    description:
      "An interactive web app that teaches people to spot misinformation, deepfakes and bias through gamified challenges across eight modules — XP, streaks and guided lessons with a friendly mascot. React + Vite + Tailwind.",
    tags: ["React", "Vite", "Tailwind"],
    device: "browser",
    media: ["/apps/factquest-1.webp", "/apps/factquest-2.webp"],
    highlights: [
      "Teaches people to spot misinformation, deepfakes and bias through gamified challenges.",
      "Eight challenge modules — deepfake, clickbait, bias, sponsored, satire, image and source verification — with guided lessons.",
      "XP, streaks and level progression with an animated mascot for feedback.",
      "Hackathon project."
    ],
  },
];

/** Night projects still in the workshop — no screenshots yet, shown as a text index under Selected work. */
export type WorkshopItem = { name: string; kind: string; description: string; tags: string[] };
export const workshop: WorkshopItem[] = [
  {
    name: "onecli",
    kind: "Developer tool",
    description:
      "My multi-model AI coding CLI: one streaming REPL over the Claude, Codex, Gemini and Qwen CLIs with mid-chat model switching, a shared project “brain” that syncs context files, a planner → workers → auditor pipeline, and a council mode where several models answer and one judges.",
    tags: ["Node.js", "Zero dependencies", "LLM orchestration"],
  },
  {
    name: "Rental marketplace",
    kind: "Two-sided marketplace · in progress",
    description:
      "Apartment rentals with long-term leases and nightly stays over one inventory — building stack diagrams, 2D floor plans and 360° tours, and a double-entry ledger with commission at lease origination.",
    tags: ["NestJS", "Prisma", "PostGIS", "Flutter", "Next.js"],
  },
  {
    name: "QrBooking",
    kind: "SaaS for cafés · in progress",
    description:
      "A QR code per table opens the menu and reveals the Wi-Fi password once the café's ordering rule is met; an on-site router agent rotates passwords nightly. Multi-tenant with PostgreSQL row-level security.",
    tags: ["Next.js", "PostgreSQL", "RLS", "WebSockets"],
  },
];

/** Events / highlights — drop a photo in /public/events/ (e.g. ahli-fintech.jpg,
 *  tech-3arabi.jpg, gdvc.jpg, acm.jpg) and add `image: "/events/<file>"`. Without an
 *  image the card shows its designed cover; listing a missing file just 404s. */
export type EventItem = { title: string; caption: string; image?: string };
export const events: EventItem[] = [
  { title: "Ahli Fintech Hackathon", caption: "Top 24 Finalist · 2025" },
  { title: "Tech 3arabi Hackathon", caption: "7th Place · 2025" },
  { title: "GDVC", caption: "Best Member Award · 2024" },
  { title: "ACM @ HTU", caption: "Treasurer & IT Support" },
];

export const certifications: string[] = [
  "Google — IT Support (2023)",
  "Google — Project Management (2023)",
  "DataCamp — Python, NumPy & pandas",
  "Top 24 Finalist — Ahli Fintech Hackathon (2025)",
  "Best Member — GDVC (2024)",
];
