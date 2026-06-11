import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
await p.waitForTimeout(1500);
await p.evaluate(() => {
  const el = document.getElementById("work");
  const y = el ? el.getBoundingClientRect().top + window.scrollY - 30 : 0;
  const l = window.__lenis;
  if (l && l.scrollTo) l.scrollTo(y, { immediate: true, force: true });
});
await p.waitForTimeout(1000);
// select tab 3 so the indicator has moved, then crop the rail + baseline region
const tabs = await p.$$('[role="tab"]');
await tabs[2].click();
await p.waitForTimeout(700);
// bounding box of the control row's parent (rail) — crop a band around it
const box = await p.evaluate(() => {
  const rail = document.querySelector('[role="tablist"]');
  const r = rail.getBoundingClientRect();
  return { x: Math.max(0, r.left - 60), y: r.top - 10, width: Math.min(900, r.width + 120), height: r.height + 26 };
});
await p.screenshot({ path: "_qa/rail-crop.png", clip: box });
console.log("rail box", JSON.stringify(box));
await b.close();
console.log("DONE");
