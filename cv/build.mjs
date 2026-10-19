// Renders the CV pages to PDF with Edge (selectable text, ATS-friendly; static Inter embeds as TrueType).
// Usage: node cv/build.mjs                       → all CVs into public/ (the site's downloads)
//        node cv/build.mjs <src.html> <out.pdf>  → one page, e.g. a draft
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, "..", "public");
const [srcArg, outArg] = process.argv.slice(2);
const jobs = srcArg
  ? [[path.resolve(srcArg), path.resolve(outArg)]]
  : [
      [path.join(here, "cv.html"), path.join(pub, "Mohammad-Otaqi-CV.pdf")],
      [path.join(here, "cv-app-backend.html"), path.join(pub, "Mohammad-Otaqi-CV-Backend.pdf")],
      [path.join(here, "cv-app-fullstack.html"), path.join(pub, "Mohammad-Otaqi-CV-FullStack-Mobile.pdf")],
    ];

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage();
for (const [src, out] of jobs) {
  await p.goto(pathToFileURL(src).href, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: out, format: "A4", preferCSSPageSize: true, printBackground: true });
  console.log("wrote", out);
}
await b.close();
