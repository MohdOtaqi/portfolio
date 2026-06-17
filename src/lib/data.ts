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
    "By day I'm a Software Engineer at ZagTrader, building post-trade and market-data infrastructure for capital markets: a SWIFT (ISO 15022) securities-settlement platform, FIX connectivity, exchange/market-data connectors, and cryptographic licensing — in C#/.NET, ASP.NET Core, SignalR and React.",
  // Night = the maker
  nightBlurb:
    "By night I design and ship my own products — mobile and full-stack apps built with Flutter, React, Node and Firebase. It's where I experiment, learn fast, and turn ideas into things people can actually use.",
  blurb:
    "Software Engineer building fintech infrastructure at ZagTrader by day — SWIFT & FIX messaging, market-data systems, cryptographic licensing — and shipping my own Flutter / React / Node apps by night.",
  stats: [
    { value: 12, suffix: "+", label: "apps & systems built" },
    { value: 3, suffix: "", label: "years building software" },
  ],
};

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["C#", "TypeScript", "JavaScript", "Dart", "Python", "Java", "SQL"],
  },
  {
    title: ".NET & Backend",
    items: [".NET 8–10", "ASP.NET Core", "SignalR", "Entity Framework Core", "Web APIs", "Background Services"],
  },
  {
    title: "Fintech & Protocols",
    items: ["SWIFT (ISO 15022 · MT540–548)", "FIX", "SoupBinTCP", "SOAP / CoreWCF", "SFTP", "Market data"],
  },
  {
    title: "Frontend & Mobile",
    items: ["React", "Next.js", "Flutter", "Tailwind CSS", "Material UI", "Vite"],
  },
  {
    title: "Security & Interop",
    items: ["Cryptography (AES · 3DES · HMAC · PBKDF2)", "JWT", "OTP / 2FA", "Azure Key Vault", "IKVM (Java↔.NET)", "Prowide"],
  },
  {
    title: "Data & Tooling",
    items: ["SQL Server", "MongoDB", "Firebase", "Git / GitHub", "MessagePack", "Inno Setup"],
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
      "Built the Swift Suite — Engine, Bridge & Monitor — an end-to-end SWIFT securities-settlement platform processing ISO 15022 MT540–MT548 and MT564 with a maker-checker approval workflow.",
      "Engineered the Swift Engine: an async task pipeline (reader → validator → builder → SWIFT validator → sender → archiver) that builds MT messages from SQL Server templates and validates them with Prowide via IKVM (Java↔.NET interop).",
      "Built the Swift Bridge gateway relaying messages between the engine (TCP / MessagePack) and external operators — Fineksus (SOAP/CoreWCF), Tadawul·Edaa (SoupBinTCP) and SFTP — with secrets in Azure Key Vault.",
      "Created WatchList dashboard (React + SignalR) for real-time market-data visualization; built the Swift Monitor dashboard (React 19 + TypeScript, SignalR) with audit trail, template versioning/diff, and OTP/2FA auth.",
      "Built ZagKeyGenWeb (hardware-bound licensing: TripleDES, HMAC-SHA256, AES-256/PBKDF2) and FixPortal (ASP.NET Core, EF Core, React, JWT) — a FIX portal with a 150+ tag dictionary, per-market rules and message diffing.",
      "Added CMC Markets FX reader (FIX SecurityList + level-1 bid/ask), IDC feed readers, and OKX exchange connector (WebSocket v5, HMAC-signed) to the market-data framework; packaged all apps via Inno Setup and batch scripts.",
      "Analyzed ZagTraderConnector integrations and database architecture to inform future middleware planning.",
    ],
    tags: ["C#", ".NET 10", "ASP.NET Core", "React", "SignalR", "SWIFT", "FIX", "SQL Server"],
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
};

export const projects: Project[] = [
  // ---- DAY · ZagTrader ----
  {
    name: "Swift Suite",
    year: "2025—26",
    internal: true,
    blurb: "SWIFT securities-settlement platform (Engine · Bridge · Monitor).",
    description:
      "End-to-end platform processing ISO 15022 MT540–548 / MT564 settlement messages. Async .NET engine builds & validates messages (Prowide via IKVM); a bridge relays to Fineksus / Tadawul·Edaa / SFTP; a React + SignalR monitor adds real-time status, audit, maker-checker approval and 2FA.",
    tags: ["C#", ".NET 10", "React", "SignalR", "IKVM", "SQL Server"],
  },
  {
    name: "FixPortal",
    year: "2025",
    internal: true,
    blurb: "FIX-protocol administration portal.",
    description:
      "Parses, validates and diffs FIX messages against a 150+ tag dictionary with per-market rules; manages customers, markets, billing and sessions. ASP.NET Core + EF Core API with a React front end and JWT auth.",
    tags: ["ASP.NET Core", "EF Core", "React", "JWT"],
  },
  {
    name: "ZagKeyGenWeb",
    year: "2025",
    internal: true,
    blurb: "Cryptographic, hardware-bound licensing.",
    description:
      "Generates and validates software licenses bound to host, database and operator limits, with tamper detection — TripleDES + HMAC-SHA256 integrity and AES-256/PBKDF2 secure-config decryption.",
    tags: ["ASP.NET Core", "TripleDES", "HMAC", "AES"],
  },
  {
    name: "Market-data connectors",
    year: "2025",
    internal: true,
    blurb: "CMC Markets (FX/FIX), IDC historical & OKX.",
    description:
      "A CMC Markets FX reader (FIX SecurityList + level-1 bid/ask) for the market-data framework, an IDC historical-bar importer (WebSocket → SQL Server), and an OKX exchange connector (WebSocket v5, HMAC-signed) for order routing.",
    tags: ["C#", "FIX", "WebSocket", "SQL Server"],
  },
  // ---- NIGHT · personal ----
  {
    name: "Odispear",
    year: "2025",
    internal: false,
    blurb: "Discord-style community platform with real-time voice & video.",
    description:
      "A full-stack community platform — servers, channels, roles and DMs — with real-time messaging (Socket.IO) and LiveKit voice/video, including RNNoise/Krisp noise filtering. Node/Express + PostgreSQL (AWS RDS) + Redis backend, React + TypeScript front end, Stripe billing and Google OAuth, deployed on AWS EC2 behind nginx.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "Socket.IO", "LiveKit", "AWS"],
    device: "browser",
    demoUrl: "https://n0tmot.com",
    media: ["/apps/odispear-1.png", "/apps/odispear-2.png"],
    links: [
      { label: "Live · n0tmot.com", href: "https://n0tmot.com" },
      { label: "GitHub", href: "https://github.com/MohdOtaqi/Odispear" },
    ],
  },
  {
    name: "MedGuard",
    year: "2025",
    internal: false,
    blurb: "Real-time health-vitals companion (graduation project).",
    description:
      "A mobile app that lets a care receiver share live vitals (heart rate, SpO₂, stress) with a carer in real time via Firestore — role-based views, optional BLE heart-rate reading (GATT), an AI health-analysis Cloud Function (Gemini), and a GPS emergency-alert pipeline that pushes critical alerts to the carer over FCM.",
    tags: ["Flutter", "Firebase", "BLE", "Gemini", "Provider"],
    device: "phone",
    media: ["/apps/medguard-1.png", "/apps/medguard-2.png", "/apps/medguard-3.png"],
    links: [{ label: "GitHub", href: "https://github.com/Mo-Otaqi/Graduation-Project-MedGuard" }],
  },
  {
    name: "MOT",
    year: "2025",
    internal: false,
    blurb: "Gamer social network & LFG matchmaking.",
    description:
      "A cross-platform app for gamers to find teammates and connect — profiles, look-for-group matchmaking by game/platform/playstyle, real-time 1:1 chat, a gaming-news feed (RAWG + RSS) and content moderation. Flutter + Firebase (Firestore, Auth, Cloud Functions, FCM) with Riverpod state and RevenueCat premium tiers.",
    tags: ["Flutter", "Firebase", "Riverpod", "RevenueCat"],
    device: "phone",
    media: ["/apps/mot-1.png", "/apps/mot-2.png", "/apps/mot-3.png"],
    links: [{ label: "GitHub", href: "https://github.com/MohdOtaqi/MOT" }],
  },
  {
    name: "Masra",
    year: "2025",
    internal: false,
    blurb: "Islamic education platform — Flutter app + Node/Prisma API.",
    description:
      "An educational platform around Al-Aqsa & Jerusalem: curated news, fatwa search, courses and gamified 30-day challenges. A Flutter client with offline-first caching and AR/EN localization, backed by a Node.js/Express + Prisma API on PostgreSQL (Supabase) with row-level security, a 12-panel admin CMS and GitHub Actions CI/CD.",
    tags: ["Flutter", "Node.js", "Prisma", "Supabase", "PostgreSQL"],
    device: "phone",
    media: ["/apps/masra-1.png", "/apps/masra-2.png", "/apps/masra-3.png"],
    links: [{ label: "GitHub", href: "https://github.com/MasraAppJo/masra-platform" }],
  },
  {
    name: "Sehleh",
    year: "2025",
    internal: false,
    blurb: "On-demand local-services marketplace.",
    description:
      "A services marketplace connecting customers with local providers — geolocation discovery (PostGIS), booking with live provider tracking, in-app chat, ratings, and Stripe + Tap payments. Flutter (BLoC) customer & provider apps, a Next.js admin dashboard, and a Supabase backend with Edge Functions and KYC verification.",
    tags: ["Flutter", "BLoC", "Supabase", "PostGIS", "Next.js", "Stripe"],
    device: "phone",
    media: ["/apps/sehleh-1.png", "/apps/sehleh-2.png"],
  },
  {
    name: "Sabaq",
    year: "2025",
    internal: false,
    blurb: "Quran-memorization app with AI audio grading.",
    description:
      "A Hifz companion with a gesture-based Mushaf reader, verse-by-verse audio and AI recitation grading (Whisper STT + fuzzy matching against riwaya text). Built with a 3-developer team where I owned the Django/DRF backend and the OAuth2 proxy + MCP integration to the Quran Foundation API; React Native / Expo front end.",
    tags: ["React Native", "Expo", "Django", "DRF", "PostgreSQL", "Whisper"],
    device: "phone",
    media: ["/apps/sabaq-1.png", "/apps/sabaq-2.png"],
    links: [{ label: "GitHub", href: "https://github.com/aboodjq/SabaqHackathon" }],
  },
  {
    name: "Tabayyun",
    year: "2025",
    internal: false,
    blurb: "AI Arabic news & image-tampering verifier.",
    description:
      "An Arabic-first web tool that scores news credibility and flags manipulation — it pulls article content and runs LLM analysis (OpenAI) plus keyword/sentiment heuristics, and checks images with EXIF metadata, Error-Level Analysis and Sightengine AI-image detection. React 19 + Vite + Tailwind.",
    tags: ["React", "Vite", "OpenAI", "Sightengine", "Tailwind"],
    device: "browser",
    media: ["/apps/tabayyun-1.png", "/apps/tabayyun-2.png"],
  },
  {
    name: "FactQuest",
    year: "2025",
    internal: false,
    blurb: "Gamified media-literacy trainer.",
    description:
      "An interactive web app that teaches people to spot misinformation, deepfakes and bias through gamified challenges across eight modules — XP, streaks and guided lessons with a friendly mascot. React + Vite + Tailwind.",
    tags: ["React", "Vite", "Tailwind"],
    device: "browser",
    media: ["/apps/factquest-1.png", "/apps/factquest-2.png"],
  },
];

/** Events / highlights — drop images in /public/events/ and list the path here. */
export type EventItem = { title: string; caption: string; image?: string };
export const events: EventItem[] = [
  { title: "Ahli Fintech Hackathon", caption: "Top 24 Finalist · 2025", image: "/events/ahli-fintech.jpg" },
  { title: "Tech 3arabi Hackathon", caption: "7th Place · 2025", image: "/events/tech-3arabi.jpg" },
  { title: "GDVC", caption: "Best Member Award · 2024", image: "/events/gdvc.jpg" },
  { title: "ACM @ HTU", caption: "Treasurer & IT Support", image: "/events/acm.jpg" },
];

export const certifications: string[] = [
  "Google — IT Support (2023)",
  "Google — Project Management (2023)",
  "DataCamp — Python, NumPy & pandas",
  "Top 24 Finalist — Ahli Fintech Hackathon (2025)",
  "Best Member — GDVC (2024)",
];
