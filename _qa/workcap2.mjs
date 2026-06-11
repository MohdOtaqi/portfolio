import { chromium } from "playwright";

const b = await chromium.launch();

async function gotoWork(p) {
  await p.evaluate(() => {
    const el = document.getElementById("work");
    const y = el ? el.getBoundingClientRect().top + window.scrollY - 30 : 0;
    const l = window.__lenis;
    if (l && l.scrollTo) l.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  });
  await p.waitForTimeout(1100);
}

const panelH = (p) =>
  p.evaluate(() => Math.round(document.getElementById("sw-panel")?.getBoundingClientRect().height || 0));

// ---- DESKTOP ----
const d = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
d.on("pageerror", (e) => errs.push(String(e)));
d.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await d.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
await d.waitForTimeout(1600);
await gotoWork(d);

const tabs = await d.$$('[role="tab"]');
// Odispear (browser, idx0) is active by default
const hBrowser = await panelH(d);
await d.screenshot({ path: "_qa/w2-d-odispear.png" });

// switch to MedGuard (phone, idx1) — measure after settle
await tabs[1].click();
await d.waitForTimeout(900);
const hPhone = await panelH(d);
await d.screenshot({ path: "_qa/w2-d-medguard.png" });

// keyboard focus ring test: focus the active tab, press ArrowRight, screenshot focus state
await d.$eval('[role="tab"][aria-selected="true"]', (el) => el.focus());
await d.waitForTimeout(150);
await d.keyboard.press("ArrowRight");
await d.waitForTimeout(700);
await d.screenshot({ path: "_qa/w2-d-focusring.png" });

// pause button state
const pauseLabel = await d.$eval('button[aria-pressed]', (el) => el.getAttribute("aria-label"));

console.log(`panelH browser=${hBrowser}  phone=${hPhone}  delta=${Math.abs(hBrowser - hPhone)}`);
console.log(`pause button label after interaction: ${pauseLabel}`);

// ---- MOBILE overflow hunt ----
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await m.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 20000 });
await m.waitForTimeout(1600);

const overflow = await m.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const offenders = [];
  const inScrollAncestor = (el) => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === "auto" || ox === "scroll" || ox === "hidden") return true;
      n = n.parentElement;
    }
    return false;
  };
  document.querySelectorAll("body *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && r.width <= vw + 60 && !inScrollAncestor(el)) {
      offenders.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 70),
        right: Math.round(r.right),
        left: Math.round(r.left),
        w: Math.round(r.width),
      });
    }
  });
  // de-dup by signature, keep widest-right first
  const seen = new Set();
  const uniq = offenders
    .sort((a, b) => b.right - a.right)
    .filter((o) => {
      const k = o.tag + o.cls + o.right;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 12);
  return { vw, sw, overflow: sw - vw, offenders: uniq };
});
console.log("OVERFLOW PROBE @390:", JSON.stringify(overflow, null, 2));

await gotoWork(m);
await m.screenshot({ path: "_qa/w2-m-work.png" });

if (errs.length) console.log("ERRORS:\n" + [...new Set(errs)].slice(0, 10).join("\n"));
else console.log("no console/page errors");
await b.close();
console.log("DONE");
