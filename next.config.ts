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
    ];
  },
};

export default nextConfig;
