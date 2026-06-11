import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1600);
for (const f of [0.45, 0.95, 1.0]) {
  await p.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const l = window.__lenis;
    const t = Math.round(max * frac);
    if (l && l.scrollTo) l.scrollTo(t, { immediate: true, force: true }); else window.scrollTo(0, t);
  }, f);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `_qa/tail-${Math.round(f*100)}.png` });
}
await b.close(); console.log("DONE");
