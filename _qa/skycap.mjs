import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1800);
const fracs = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.65, 0.85];
for (const f of fracs) {
  await p.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.round(max * frac);
    const l = window.__lenis;
    if (l && l.scrollTo) l.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, f);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `_qa/sky-${String(Math.round(f * 100)).padStart(2, "0")}.png` });
  console.log("sky-" + Math.round(f * 100));
}
if (errs.length) { console.log("ERRORS:\n" + [...new Set(errs)].slice(0, 12).join("\n")); }
else console.log("no console/page errors");
await b.close();
console.log("DONE");
