// Desktop sky at fixed scroll fractions — compare before/after the composited-sky refactor.
import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.QA_URL || "http://localhost:3123", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
for (const f of [0.08, 0.2, 0.3, 0.38, 0.5]) {
  await p.evaluate((f) => { const H = document.documentElement.scrollHeight - innerHeight; window.__lenis?.scrollTo(H * f, { immediate: true, force: true }); }, f);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `_qa/sky-${process.argv[2]}-${Math.round(f * 100)}.png` });
}
await b.close();
