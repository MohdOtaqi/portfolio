import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
await p.goto("http://localhost:5191", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: "public/apps/factquest-1.png" });
console.log("shot factquest-1");
// try to enter a challenge for a 2nd, different view
try {
  const candidates = ["text=Deepfake", "text=Challenge", "text=Start", "button", "[class*=card]"];
  for (const sel of candidates) {
    const el = p.locator(sel).first();
    if (await el.count() && await el.isVisible()) { await el.click({ timeout: 2000 }); break; }
  }
  await p.waitForTimeout(1200);
} catch (e) { console.log("no click", e.message); }
await p.screenshot({ path: "public/apps/factquest-2.png" });
console.log("shot factquest-2");
await b.close();
