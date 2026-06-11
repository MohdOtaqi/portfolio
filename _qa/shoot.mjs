import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = new URL("./", import.meta.url).pathname.replace(/^\//, "");
mkdirSync("_qa", { recursive: true });

const VIEW = { width: 1440, height: 900 };
const browser = await chromium.launch();

async function shootPage(path, label, fracs) {
  const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (const f of fracs) {
    const y = Math.round((h - VIEW.height) * f);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(900);
    const name = `_qa/${label}-${String(Math.round(f * 100)).padStart(3, "0")}.png`;
    await page.screenshot({ path: name });
    console.log("shot", name, "scrollY", y, "of", h);
  }
  await page.close();
}

// mobile viewport check too
async function shootMobile(path, label) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `_qa/${label}-mobile-top.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `_qa/${label}-mobile-mid.png` });
  console.log("shot mobile", label);
  await page.close();
}

await shootPage("/", "scroll", [0, 0.18, 0.32, 0.45, 0.55, 0.7, 0.85, 1]);
await shootPage("/split", "split", [0, 0.3, 0.6, 1]);
await shootMobile("/", "scroll");
await browser.close();
console.log("DONE");
