import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated lockfile
  // higher up in the home directory.
  turbopack: {
    root: path.join(__dirname),
  },
  // VitalGuard was renamed ShieldKin (2026-10-19) — keep old links working
  async redirects() {
    return [
      { source: "/work/vitalguard", destination: "/work/shieldkin", permanent: true },
      { source: "/ar/work/vitalguard", destination: "/ar/work/shieldkin", permanent: true },
      { source: "/vitalguard/:path*", destination: "/shieldkin/:path*", permanent: true },
      // Hosted landing pages (static copies in public/demos). Their assets are
      // relative, so the short URL has to land on the file itself.
      { source: "/demos/wared", destination: "/demos/wared/index.html", permanent: false },
      { source: "/demos/zaffa", destination: "/demos/zaffa/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
