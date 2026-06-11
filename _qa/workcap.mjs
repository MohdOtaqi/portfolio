import { chromium } from "playwright";

const b = await chromium.launch();

async function waitReady(p) {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 4000 });
      if (r && r.ok()) return true;
    } catch {}
    await p.waitForTimeout(1000);
  }
  return false;
}

async function gotoWork(p) {
  // scroll the #work section into view via Lenis
  await p.evaluate(() => {
    const el = document.getElementById("work");
    const y = el ? el.getBoundingClientRect().top + window.scrollY - 40 : 0;
    const l = window.__lenis;
    if (l && l.scrollTo) l.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  });
  await p.waitForTimeout(1200);
}

// ---- DESKTOP ----
const d = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
d.on("pageerror", (e) => errs.push(String(e)));
d.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
if (!(await waitReady(d))) { console.log("DEV NOT READY"); process.exit(1); }
await d.waitForTimeout(1500);
await gotoWork(d);
await d.screenshot({ path: "_qa/work-d-01.png" });

// click tab 04 (Masra) and capture mid + settled
const tabs = await d.$$('[role="tab"]');
console.log("tabs found:", tabs.length);
if (tabs[3]) {
  await tabs[3].click();
  await d.waitForTimeout(180);
  await d.screenshot({ path: "_qa/work-d-02mid.png" });
  await d.waitForTimeout(700);
  await d.screenshot({ path: "_qa/work-d-03masra.png" });
}
// click tab 07 (Tabayyun, browser device) to test browser mockup swap
if (tabs[6]) {
  await tabs[6].click();
  await d.waitForTimeout(850);
  await d.screenshot({ path: "_qa/work-d-04tabayyun.png" });
}

// ---- MOBILE ----
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await m.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 20000 });
await m.waitForTimeout(1800);
await gotoWork(m);
await m.screenshot({ path: "_qa/work-m-01.png" });
const mtabs = await m.$$('[role="tab"]');
if (mtabs[2]) { await mtabs[2].click(); await m.waitForTimeout(850); await m.screenshot({ path: "_qa/work-m-02.png" }); }
// scroll a touch to see the rail under the panel
await m.evaluate(() => { const l = window.__lenis; if (l) l.scrollTo(window.scrollY + 320, { immediate: true }); });
await m.waitForTimeout(700);
await m.screenshot({ path: "_qa/work-m-03rail.png" });

if (errs.length) console.log("ERRORS:\n" + [...new Set(errs)].slice(0, 10).join("\n"));
else console.log("no console/page errors");
await b.close();
console.log("DONE");
