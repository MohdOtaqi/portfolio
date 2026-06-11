import { chromium } from "playwright";
import http from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { extname, join, normalize } from "path";

const MIME = { ".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".wasm":"application/wasm",".ico":"image/x-icon",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf",".otf":"font/otf",".symbols":"application/octet-stream",".bin":"application/octet-stream" };

function serve(root, port) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      try {
        let p = decodeURIComponent(req.url.split("?")[0]);
        let fp = normalize(join(root, p));
        if (!fp.startsWith(normalize(root))) { res.writeHead(403); return res.end(); }
        if (!existsSync(fp) || statSync(fp).isDirectory()) {
          const idx = join(fp, "index.html");
          fp = existsSync(idx) && statSync(fp).isDirectory() ? idx : join(root, "index.html"); // SPA fallback
        }
        if (!existsSync(fp)) { res.writeHead(404); return res.end("nf"); }
        const data = readFileSync(fp);
        res.writeHead(200, { "Content-Type": MIME[extname(fp)] || "application/octet-stream", "Cross-Origin-Embedder-Policy":"require-corp","Cross-Origin-Opener-Policy":"same-origin" });
        res.end(data);
      } catch (e) { res.writeHead(500); res.end(String(e)); }
    });
    srv.listen(port, () => resolve(srv));
  });
}

const APPS = [
  { name: "mot", root: "C:/MOT/MOT/mot1/build/web", port: 8101 },
  { name: "masra", root: "D:/Masra/mobile/build/web", port: 8102 },
  { name: "sehleh", root: "D:/Sahleh/apps/mobile/build/web", port: 8103 },
];

const b = await chromium.launch();
for (const app of APPS) {
  const srv = await serve(app.root, app.port);
  const page = await b.newPage({ viewport: { width: 412, height: 892 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  try {
    await page.goto(`http://localhost:${app.port}/`, { waitUntil: "load", timeout: 60000 });
  } catch (e) { console.log(app.name, "goto err", e.message); }
  // wait for Flutter to boot: poll for glass pane / canvas, up to 30s
  for (let i=0;i<30;i++){ await page.waitForTimeout(1000);
    const ready = await page.evaluate(()=>!!document.querySelector("flt-glass-pane, flutter-view, canvas") && document.body.innerText.length+document.querySelectorAll('canvas').length>0).catch(()=>false);
    if (ready && i>=4) break;
  }
  const shots = [3000, 5000];
  await page.screenshot({ path: `_qa/real/${app.name}-1.png` });
  for (let k=0;k<shots.length;k++){ await page.waitForTimeout(shots[k]); await page.screenshot({ path: `_qa/real/${app.name}-${k+2}.png` }); }
  console.log(app.name, "captured. pageerrors:", errs.slice(0,2).join(" | ").slice(0,160));
  await page.close(); srv.close();
}
await b.close();
console.log("DONE");
