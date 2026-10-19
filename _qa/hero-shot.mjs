import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge" });
for (const [l, vp, m] of [["m", { width: 390, height: 844 }, true], ["s", { width: 360, height: 740 }, true], ["d", { width: 1440, height: 900 }, false]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: m ? 2 : 1, isMobile: m, hasTouch: m });
  await p.goto(process.env.QA_URL || "http://localhost:3123", { waitUntil: "networkidle" });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `_qa/hero-${l}.png` });
  await p.close();
}
await b.close();
