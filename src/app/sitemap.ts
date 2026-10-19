import type { MetadataRoute } from "next";
import { workProjects } from "@/lib/content";

const SITE_URL = "https://mohammadotaqi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
    alternates: { languages: { en: `${SITE_URL}${path || "/"}`, ar: `${SITE_URL}/ar${path}` } },
  });
  return [
    pair("", 1),
    { ...pair("", 0.9), url: `${SITE_URL}/ar` },
    ...workProjects("en").flatMap((p) => [
      pair(`/work/${p.slug}`, 0.7),
      { ...pair(`/work/${p.slug}`, 0.6), url: `${SITE_URL}/ar/work/${p.slug}` },
    ]),
  ];
}
