import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1200);
// scroll to the "Local LLMs & Hardware" heading if present
const found = await p.evaluate(() => {
  const el = [...document.querySelectorAll("*")].find(n => n.children.length===0 && /Local LLMs & Hardware/.test(n.textContent||""));
  if (el) { el.scrollIntoView({block:"center"}); return true; }
  return false;
});
console.log("heading found:", found);
await p.waitForTimeout(1000);
await p.screenshot({ path: "_qa/cap-ai.png" });
console.log("DONE");
await b.close();
