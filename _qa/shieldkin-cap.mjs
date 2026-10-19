// Captures shieldkin.com for the portfolio browser mockup.
import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
await p.goto("https://shieldkin.com/", { waitUntil: "networkidle" });
await p.waitForTimeout(3500);
await p.screenshot({ path: "_qa/sk-0.png" });
for (const [i, id] of ["band", "sensors", "app", "ring"].entries()) {
  await p.evaluate(async (id) => {
    const el = document.getElementById(id); if (!el) return;
    const target = el.getBoundingClientRect().top + scrollY;
    while (scrollY < target - 5) { scrollBy(0, 60); await new Promise((r) => requestAnimationFrame(r)); }
  }, id);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `_qa/sk-${i + 1}.png` });
}
await b.close();
