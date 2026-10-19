import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto("https://mohammadotaqi.com", { waitUntil: "networkidle" });
await p.evaluate(async () => { const t = document.getElementById("about").getBoundingClientRect().top + scrollY; while (scrollY < t) { scrollBy(0, 30); await new Promise(r => requestAnimationFrame(r)); } });
await p.waitForTimeout(2500);
console.log(await p.evaluate(() => { const h = document.querySelector("#about h2"); return h ? h.outerHTML.slice(0, 700) : "no h2"; }));
console.log(await p.evaluate(() => [...document.querySelectorAll("#about h2 span span span")].map(s => s.style.transform + " | " + getComputedStyle(s).transform)));
await b.close();
