// QA for the 2026-10 content update: day systems index, new night projects,
// workshop list, rail auto-scroll, overflow + console errors at desktop and mobile.
import { chromium } from "playwright";

const URL = process.env.QA_URL || "http://localhost:3123";
const b = await chromium.launch({ channel: "msedge" });

async function scrollToId(p, id, off = 30) {
  await p.evaluate(([id, off]) => {
    const el = document.getElementById(id);
    const y = el ? el.getBoundingClientRect().top + window.scrollY - off : 0;
    const l = window.__lenis;
    if (l && l.scrollTo) l.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, [id, off]);
  await p.waitForTimeout(1300);
}

for (const [label, vp] of [["d", { width: 1440, height: 900 }], ["m", { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  const bad = [];
  p.on("response", (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  await p.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await p.waitForTimeout(1500);

  // walk the whole page so every Reveal fires, then measure overflow
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) {
    await p.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true, force: true }), y);
    await p.waitForTimeout(120);
  }
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);

  await scrollToId(p, "systems");
  await p.screenshot({ path: `_qa/u-${label}-systems.png` });

  await scrollToId(p, "work");
  if (label === "m") {
    // phones get a plain list instead of the tab rail
    const items = await p.$$eval("#work ol > li a", (as) => as.map((a) => a.getAttribute("href")));
    await p.screenshot({ path: `_qa/u-${label}-worklist.png` });
    console.log(JSON.stringify({ label, sw: await p.evaluate(() => document.documentElement.scrollWidth), list: items.length, errs, bad }));
    await p.close();
    continue;
  }
  const tabs = await p.$$('[role="tab"]');
  const names = await Promise.all(tabs.map((t) => t.innerText()));
  for (const want of ["Sudur", "Mabsim", "Wared", "Word Oasis", "VitalGuard", "MOT"]) {
    const i = names.findIndex((n) => n.includes(want));
    await tabs[i].click();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `_qa/u-${label}-${want.replace(/\s/g, "").toLowerCase()}.png` });
  }
  // last tab: is it inside the rail's visible box after selecting it?
  await tabs[tabs.length - 1].click();
  await p.waitForTimeout(900);
  const vis = await p.evaluate(() => {
    const rail = document.querySelector('[role="tablist"]');
    const t = document.querySelector('[role="tab"][aria-selected="true"]');
    const r = rail.getBoundingClientRect(), a = t.getBoundingClientRect();
    return a.left >= r.left - 1 && a.right <= r.right + 1;
  });
  // autoplay advance from first → does the rail follow? select 0 then press End/Home via keyboard
  await p.screenshot({ path: `_qa/u-${label}-lasttab.png` });

  const ws = await p.$('text=Also on the bench');
  if (ws) { await ws.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200); await p.screenshot({ path: `_qa/u-${label}-workshop.png` }); }

  console.log(JSON.stringify({ label, scrollWidth: sw, viewport: vp.width, tabs: names.length, lastTabVisible: vis, workshop: !!ws, errs, bad }, null, 0));
  await p.close();
}
// the 3D case viewer: canvas renders, STLs parse, no errors
{
  const v = await b.newPage({ viewport: { width: 1280, height: 860 } });
  const verrs = [];
  v.on("pageerror", (e) => verrs.push(String(e)));
  v.on("console", (m) => { if (m.type() === "error") verrs.push(m.text()); });
  await v.goto(URL + "/vitalguard/wristband-viewer.html", { waitUntil: "networkidle" });
  await v.waitForTimeout(2500);
  const ok = await v.evaluate(() => ({ canvas: !!document.querySelector("#stage canvas"), loadingHidden: document.getElementById("loading")?.hidden, foot: document.getElementById("d-foot")?.textContent }));
  await v.screenshot({ path: "_qa/u-viewer.png" });
  console.log(JSON.stringify({ viewer: ok, verrs }));
}
await b.close();
