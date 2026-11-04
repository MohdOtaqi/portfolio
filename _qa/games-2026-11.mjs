import { chromium } from "playwright";
const U = "http://localhost:3123", OUT = "_qa/shots-games";
import fs from "fs"; fs.mkdirSync(OUT, { recursive: true });
const SLUGS = ["eishha","shawarma-street","tetas-stall","hadaf","word-oasis","mundass","midad","jabeen","laffa","owzy","wird","ameno"];
const b = await chromium.launch({ channel: "msedge" });
let bad = 0;
for (const [name, vp, mobile] of [["desk",{width:1440,height:900},false],["tablet",{width:820,height:1100},false],["phone",{width:390,height:844},true]]) {
  for (const [loc, base] of [["en",""],["ar","/ar"]]) {
    const c = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    const p = await c.newPage(); const errs = [];
    p.on("console", m => { if (m.type()==="error" && !/_vercel/.test(m.text())) errs.push(m.text().slice(0,120)); });
    p.on("pageerror", e => errs.push(String(e).slice(0,120)));
    p.on("response", r => { if (r.status()>=400 && !/_vercel/.test(r.url())) errs.push(r.status()+" "+r.url()); });
    await p.goto(U+base+"/", { waitUntil: "networkidle" });
    const n = await p.$$eval("#games ol > li", l => l.length);
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await p.evaluate(() => { const y=document.getElementById("games"); window.__lenis?.scrollTo?.(y,{immediate:true}); y.scrollIntoView(); });
    await p.waitForTimeout(1600);
    // walk the section so lazy images and reveals fire
    const h = await p.$eval("#games", e => e.getBoundingClientRect().height);
    for (let y=0;y<h;y+=500){ await p.mouse.wheel(0,500); await p.waitForTimeout(250);}
    await p.evaluate(() => document.getElementById("games").scrollIntoView()); await p.waitForTimeout(900);
    const broken = await p.$$eval("#games img", l => l.filter(i=>i.complete&&!i.naturalWidth).length);
    await p.locator("#games").screenshot({ path: `${OUT}/${name}-${loc}-games.png` });
    console.log(name, loc, "games", n, "overflowX", over, "broken", broken, "errs", errs.length, errs.slice(0,2).join(" | "));
    if (name!=="tablet") for (const s of SLUGS) {
      const r = await p.goto(`${U}${base}/work/${s}`, { waitUntil: "load" });
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const h1 = await p.$eval("h1", e=>e.innerText);
      if (r.status()!==200 || ov>0) { bad++; console.log("  BAD", s, r.status(), ov); }
      if (name==="phone" && loc==="ar" && s==="eishha" || name==="desk" && loc==="en" && (s==="owzy"||s==="mundass")) { await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/${name}-${loc}-${s}.png` }); }
      if (loc==="ar" && name==="desk") console.log("  ", s, "h1 cp", [...h1].slice(0,3).map(x=>x.codePointAt(0).toString(16)).join(","));
    }
    await c.close();
  }
}
console.log("bad pages", bad);
await b.close();
