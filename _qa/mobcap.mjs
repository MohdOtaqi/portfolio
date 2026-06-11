import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1800);
const steps = 16;
for (let i = 0; i <= steps; i++) {
  const f = i / steps;
  await p.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const l = window.__lenis; const t = Math.round(max * frac);
    if (l && l.scrollTo) l.scrollTo(t, { immediate: true, force: true }); else window.scrollTo(0, t);
  }, f);
  await p.waitForTimeout(650);
  await p.screenshot({ path: `_qa/mob-${String(i).padStart(2,"0")}.png` });
}
console.log(errs.length ? "ERR:"+errs.slice(0,4).join(" | ") : "no page errors");
await b.close(); console.log("DONE");
