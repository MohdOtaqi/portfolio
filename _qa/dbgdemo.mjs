import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
p.on("pageerror", e => errs.push(String(e)));
p.on("console", m => { if (m.type()==="error") errs.push("console:"+m.text()); });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
// scroll to first phone demo (MedGuard ~0.46)
await p.evaluate(() => { const l=window.__lenis; const max=document.documentElement.scrollHeight-window.innerHeight; if(l)l.scrollTo(Math.round(max*0.46),{immediate:true,force:true}); });
await p.waitForTimeout(3500);
const info = await p.evaluate(() => {
  // find Remotion player containers (they render a div with a data attr or just imgs)
  const imgs = [...document.querySelectorAll("img")].filter(im => im.src.includes("/apps/"));
  const players = document.querySelectorAll("[class*='__remotion'], .remotion-player");
  return {
    appImgCount: imgs.length,
    appImgs: imgs.slice(0,6).map(im => ({ src: im.src.split("/apps/")[1], complete: im.complete, nw: im.naturalWidth, w: im.clientWidth, h: im.clientHeight, op: getComputedStyle(im).opacity })),
    playerNodes: players.length,
  };
});
console.log(JSON.stringify(info, null, 2));
console.log(errs.length ? "ERRORS:\n"+[...new Set(errs)].slice(0,8).join("\n") : "no errors");
await p.screenshot({ path: "_qa/demo-check.png" });
await b.close();
