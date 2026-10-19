// Phone runtime audit: scroll smoothness under 4x CPU throttle, tiny text, small tap targets,
// overflowing text, and a screenshot per section. Usage: QA_URL=... node _qa/mobile-audit.mjs <tag>
import { chromium } from "playwright";

const URL = process.env.QA_URL || "http://localhost:3123";
const tag = process.argv[2] || "run";
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36" });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await p.goto(URL, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

// scroll the whole page like a thumb would (native scroll; Lenis leaves touch alone) and record frame gaps
const frames = await p.evaluate(async () => {
  const gaps = [];
  let last = performance.now(), run = true;
  const tick = (t) => { gaps.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const H = document.documentElement.scrollHeight - innerHeight;
  const t0 = performance.now();
  while (scrollY < H - 2 && performance.now() - t0 < 20000) {
    window.scrollBy(0, 24);
    await new Promise((r) => requestAnimationFrame(r));
  }
  run = false;
  return gaps.slice(2);
});
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
const avg = frames.reduce((a, c) => a + c, 0) / frames.length;
const janky = frames.filter((g) => g > 50).length;

// static checks (after everything has revealed)
const checks = await p.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && +s.opacity > 0.05; };
  const tiny = new Map();
  for (const el of document.querySelectorAll("body *")) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12 && vis(el)) { const k = `${fs}px`; tiny.set(k, (tiny.get(k) || 0) + 1); }
  }
  const small = [];
  for (const el of document.querySelectorAll("a, button, [role=tab]")) {
    const r = el.getBoundingClientRect();
    if (r.width && (r.width < 40 || r.height < 40)) small.push(`${Math.round(r.width)}x${Math.round(r.height)} ${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28)}`);
  }
  const overflow = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,a,span")) {
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === "visible" && el.clientWidth > 0) overflow.push(el.textContent.trim().slice(0, 40));
  }
  return { dom: document.querySelectorAll("*").length, tiny: Object.fromEntries(tiny), small: small.slice(0, 40), smallCount: small.length, overflow: overflow.slice(0, 10), docW: document.documentElement.scrollWidth };
});

// screenshot each major section on the phone
for (const id of ["top", "about", "systems", "work", "contact"]) {
  await p.evaluate((id) => { const el = document.getElementById(id); if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY); }, id);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `_qa/m-${tag}-${id}.png` });
}
console.log(JSON.stringify({ tag, frames: frames.length, avgFrameMs: +avg.toFixed(1), approxFps: +(1000 / avg).toFixed(0), framesOver50ms: janky, ...checks }, null, 1));
await b.close();
