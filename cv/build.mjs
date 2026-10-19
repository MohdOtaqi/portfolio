// Renders cv/cv.html → public/Mohammad-Otaqi-CV.pdf with Edge (selectable text, ATS-friendly).
// Usage: node cv/build.mjs
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = pathToFileURL(path.join(here, "cv.html")).href;
const out = path.join(here, "..", "public", "Mohammad-Otaqi-CV.pdf");

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage();
await p.goto(src, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: out, format: "A4", preferCSSPageSize: true, printBackground: true });
await b.close();
console.log("wrote", out);
