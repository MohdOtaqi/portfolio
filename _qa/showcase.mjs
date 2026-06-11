import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
const h = await p.evaluate(() => document.body.scrollHeight);
const fracs = [0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.90];
for (const f of fracs) {
  await p.evaluate(y => window.scrollTo(0, y), Math.round((h-900)*f));
  await p.waitForTimeout(1400); // let carousel show first slide + reveal
  await p.screenshot({ path: `_qa/show-${Math.round(f*100)}.png` });
  console.log("shot show-"+Math.round(f*100));
}
await b.close(); console.log("DONE");
