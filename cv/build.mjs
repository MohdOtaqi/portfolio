// Renders a CV page to PDF with Edge (selectable text, ATS-friendly).
// Usage: node cv/build.mjs                         → cv/cv.html → public/Mohammad-Otaqi-CV.pdf (the live CV)
//        node cv/build.mjs <src.html> <out.pdf>    → any draft, e.g. cv/cv-compact.html → cv/drafts/…
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const [srcArg, outArg] = process.argv.slice(2);
const src = pathToFileURL(path.resolve(srcArg ?? path.join(here, "cv.html"))).href;
const out = path.resolve(outArg ?? path.join(here, "..", "public", "Mohammad-Otaqi-CV.pdf"));

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage();
await p.goto(src, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: out, format: "A4", preferCSSPageSize: true, printBackground: true });
await b.close();
console.log("wrote", out);
