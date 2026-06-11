import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1800);
// step through the whole page in ~0.07 increments for contiguous coverage
const steps = 15;
for (let i = 0; i <= steps; i++) {
  const f = i / steps;
  await p.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const l = window.__lenis;
    const t = Math.round(max * frac);
    if (l && l.scrollTo) l.scrollTo(t, { immediate: true, force: true });
    else window.scrollTo(0, t);
  }, f);
  await p.waitForTimeout(750);
  await p.screenshot({ path: `_qa/film-${String(i).padStart(2, "0")}.png` });
}
console.log(errs.length ? "ERR:" + errs.slice(0, 5).join(" | ") : "no page errors");
await b.close();
console.log("DONE");
