import { chromium } from "playwright";
import { pathToFileURL } from "url";
import { readdirSync } from "fs";
const b = await chromium.launch();
const dir = "_qa/mockups";
const files = readdirSync(dir).filter(f => f.endsWith(".html"));
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
for (const f of files) {
  const url = pathToFileURL(`${process.cwd()}/${dir}/${f}`).href;
  await p.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await p.waitForTimeout(500);
  const out = `public/apps/${f.replace(".html", ".png")}`;
  await p.screenshot({ path: out });
  console.log("shot", out);
}
await b.close();
console.log("DONE");
