// QA for nav + project pages + phone list + Arabic. Usage: QA_URL=... node _qa/site-v2.mjs
import { chromium } from "playwright";

const URL = process.env.QA_URL || "http://localhost:3123";
const b = await chromium.launch({ channel: "msedge" });
const report = [];

async function visit(path, vp, mobile, shots = async () => {}) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  const errs = [], bad = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
  p.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("/_vercel/")) bad.push(`${r.status()} ${r.url()}`); });
  await p.goto(URL + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  // walk the page so reveals fire and lazy images load
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 800) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(90); }
  const docW = await p.evaluate(() => document.documentElement.scrollWidth);
  const dir = await p.evaluate(() => [document.documentElement.lang, document.documentElement.dir]);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await shots(p);
  report.push({ path, w: vp.width, docW, dir: dir.join("/"), errs, bad });
  await ctx.close();
}

const D = { width: 1440, height: 900 }, M = { width: 390, height: 844 };
const tag = (path, w) => path.replace(/\W+/g, "_") + "-" + w;

for (const path of ["/", "/ar"]) {
  await visit(path, D, false, async (p) => {
    await p.screenshot({ path: `_qa/v2-${tag(path, "d")}-top.png` });
    const btn = p.locator("header button[aria-haspopup=menu]");
    await btn.click(); await p.waitForTimeout(400);
    await p.screenshot({ path: `_qa/v2-${tag(path, "d")}-cvmenu.png`, clip: { x: 900, y: 0, width: 540, height: 360 } });
    await btn.click();
    await p.evaluate(() => document.getElementById("work").scrollIntoView());
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `_qa/v2-${tag(path, "d")}-work.png` });
  });
  await visit(path, M, true, async (p) => {
    await p.screenshot({ path: `_qa/v2-${tag(path, "m")}-top.png` });
    await p.evaluate(() => document.getElementById("work").scrollIntoView());
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `_qa/v2-${tag(path, "m")}-work.png` });
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    await p.locator("header button[aria-controls=site-menu]").click(); await p.waitForTimeout(700);
    await p.screenshot({ path: `_qa/v2-${tag(path, "m")}-menu.png` });
  });
}
for (const path of ["/work/vitalguard", "/work/mot", "/ar/work/sudur", "/work/wared"]) {
  await visit(path, D, false, async (p) => {
    await p.screenshot({ path: `_qa/v2-${tag(path, "d")}-top.png` });
    await p.evaluate(() => [...document.querySelectorAll("h2")].find((h) => /What I built|ما بنيته/.test(h.textContent))?.scrollIntoView({ block: "start" }));
    await p.waitForTimeout(900);
    await p.screenshot({ path: `_qa/v2-${tag(path, "d")}-built.png` });
    if (path.includes("vitalguard")) {
      await p.evaluate(() => document.querySelector("iframe")?.scrollIntoView({ block: "center" }));
      await p.waitForTimeout(3500);
      await p.screenshot({ path: `_qa/v2-${tag(path, "d")}-3d.png` });
    }
  });
  await visit(path, M, true, async (p) => { await p.screenshot({ path: `_qa/v2-${tag(path, "m")}-top.png` }); });
}
for (const r of report) console.log(JSON.stringify(r));
await b.close();
