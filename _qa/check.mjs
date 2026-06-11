import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const want = ["odispear-1.png","odispear-2.png","masra-1.png","masra-2.png","masra-3.png"];
const status = {};
p.on("response", r => { const u=r.url(); for (const w of want) if (u.includes(w)) status[w]=r.status(); });
await p.goto("http://localhost:3000", { waitUntil:"networkidle", timeout:60000 });
// scroll through whole page to trigger lazy images
for (let i=0;i<=20;i++){ await p.evaluate(y=>window.scrollTo(0,document.body.scrollHeight*y/20), i); await p.waitForTimeout(250); }
await p.waitForTimeout(800);
const imgs = await p.evaluate(() => [...document.querySelectorAll("img")].filter(i=>/apps\//.test(i.src)).map(i=>({src:i.src.split("/apps/")[1], nat:i.naturalWidth})));
console.log("HTTP status:", JSON.stringify(status));
console.log("IMG naturalWidth:", JSON.stringify(imgs));
await b.close();
