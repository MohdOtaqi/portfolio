import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge" });
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto("http://localhost:3123", { waitUntil: "networkidle" });
  const tabs = await p.$$('[role="tab"]');
  const out = [];
  for (const t of tabs) {
    await t.click(); await p.waitForTimeout(700);
    out.push(`${(await t.innerText()).replace(/\s+/g, " ")}=${await p.evaluate(() => Math.round(document.getElementById("sw-panel").getBoundingClientRect().height))}`);
  }
  console.log(vp.width, out.join(" | "));
  await p.close();
}
await b.close();
