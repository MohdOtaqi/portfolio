import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
await p.evaluate(() => { const l=window.__lenis; const max=document.documentElement.scrollHeight-window.innerHeight; if(l)l.scrollTo(Math.round(max*0.8),{immediate:true,force:true}); });
await p.waitForTimeout(1200);
const info = await p.evaluate(() => {
  const arts = [...document.querySelectorAll("article")];
  return arts.slice(0,3).map(a => {
    const img = a.querySelector("img");
    const cover = a.querySelector("div > div"); // first inner div of the image wrapper
    const fb = a.querySelector("span[aria-hidden]");
    return {
      hasImg: !!img,
      imgSrc: img ? img.getAttribute("src") : null,
      imgComplete: img ? img.complete && img.naturalWidth > 0 : null,
      fallbackMonogram: fb ? fb.textContent : null,
    };
  });
});
console.log(JSON.stringify(info, null, 2));
await b.close();
