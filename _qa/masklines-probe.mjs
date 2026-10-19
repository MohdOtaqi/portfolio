import { chromium } from "playwright";
const URL = process.env.QA_URL || "https://mohammadotaqi.com";
const b = await chromium.launch({ channel: "msedge" });
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto(URL, { waitUntil: "networkidle" });
  const out = {};
  for (const id of ["about", "contact"]) {
    // scroll gradually so in-view triggers fire like a real user
    await p.evaluate(async (id) => {
      const target = document.getElementById(id).getBoundingClientRect().top + scrollY - 100;
      while (Math.abs(scrollY - target) > 30) { window.scrollBy(0, Math.sign(target - scrollY) * 30); await new Promise(r => requestAnimationFrame(r)); }
    }, id);
    await p.waitForTimeout(2200);
    out[id] = await p.evaluate((id) => [...document.querySelectorAll(`#${id} h2 span.block.overflow-hidden > span`)].map(s => getComputedStyle(s).transform));
  }
  console.log(vp.width, JSON.stringify(out));
  await p.close();
}
await b.close();
