// Main-thread breakdown while thumb-scrolling the page on a throttled phone profile.
import { chromium } from "playwright";
const URL = process.env.QA_URL || "http://localhost:3123";
const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await p.goto(URL, { waitUntil: "networkidle" });
if (process.env.QA_CSS) await p.addStyleTag({ content: process.env.QA_CSS });
await p.waitForTimeout(1500);
await cdp.send("Performance.enable");
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
const m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
await p.evaluate(async () => { const H = document.documentElement.scrollHeight - innerHeight; while (scrollY < H - 2) { scrollBy(0, 24); await new Promise((r) => requestAnimationFrame(r)); } });
const m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
const d = (k) => +(m1[k] - m0[k]).toFixed(2);
console.log(JSON.stringify({ TaskDuration: d("TaskDuration"), ScriptDuration: d("ScriptDuration"), RecalcStyleDuration: d("RecalcStyleDuration"), LayoutDuration: d("LayoutDuration"), RecalcStyleCount: d("RecalcStyleCount"), LayoutCount: d("LayoutCount") }));
await b.close();
