import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 412, height: 892 }, deviceScaleFactor: 2 });
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
try { await p.goto("http://localhost:8114", { waitUntil: "domcontentloaded", timeout: 120000 }); } catch(e){ console.log("goto:",e.message); }
// expo web bundles on first load; wait for real content
let ok=false;
for (let i=0;i<60;i++){ await p.waitForTimeout(2000);
  const t = await p.evaluate(()=>document.body && document.body.innerText ? document.body.innerText.length : 0).catch(()=>0);
  if (t>40){ ok=true; break; }
}
await p.waitForTimeout(3000);
await p.screenshot({ path: "_qa/real/sabaq-a.png" });
await p.mouse.click(206, 840); await p.waitForTimeout(2000); // bottom nav
await p.screenshot({ path: "_qa/real/sabaq-b.png" });
console.log("sabaq ok:", ok, "errs:", errs.slice(0,2).join(" | ").slice(0,160));
await b.close();
