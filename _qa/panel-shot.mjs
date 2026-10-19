import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge" });
for (const [l, vp] of [["d", { width: 1440, height: 900 }]]) { // phones show a list, not tabs
  const p = await b.newPage({ viewport: vp });
  await p.goto("http://localhost:3123", { waitUntil: "networkidle" });
  for (const name of process.argv.slice(2)) {
    const tabs = await p.$$('[role="tab"]');
    for (const t of tabs) if ((await t.innerText()).includes(name)) await t.click();
    await p.waitForTimeout(1400);
    await (await p.$("#sw-panel")).screenshot({ path: `_qa/panel-${l}-${name.toLowerCase()}.png` });
  }
  await p.close();
}
await b.close();
