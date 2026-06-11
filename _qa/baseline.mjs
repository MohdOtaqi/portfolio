import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
const h = await p.evaluate(() => document.documentElement.scrollHeight);
const fracs = [0, 0.12, 0.24, 0.36, 0.48, 0.60];
for (const f of fracs) {
  await p.evaluate(y => window.scrollTo(0, y), Math.round((h - 900) * f));
  await p.waitForTimeout(1100);
  await p.screenshot({ path: `_qa/base-${String(Math.round(f * 100)).padStart(2, "0")}.png` });
  console.log("base-" + Math.round(f * 100));
}
await b.close();
console.log("DONE");
