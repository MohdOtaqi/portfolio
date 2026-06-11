import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000/this-page-does-not-exist", { waitUntil: "networkidle", timeout: 30000 });
await p.waitForTimeout(900);
await p.screenshot({ path: "_qa/notfound.png" });
await b.close(); console.log("DONE");
