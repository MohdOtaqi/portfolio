import { chromium } from "playwright";
import http from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { extname, join, normalize } from "path";
const MIME={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".wasm":"application/wasm",".ico":"image/x-icon",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf",".otf":"font/otf",".bin":"application/octet-stream",".symbols":"application/octet-stream"};
function serve(root,port){return new Promise(r=>{const s=http.createServer((req,res)=>{try{let p=decodeURIComponent(req.url.split("?")[0]);let fp=normalize(join(root,p));if(!fp.startsWith(normalize(root))){res.writeHead(403);return res.end();}if(!existsSync(fp)||statSync(fp).isDirectory()){fp=join(root,"index.html");}if(!existsSync(fp)){res.writeHead(404);return res.end();}res.writeHead(200,{"Content-Type":MIME[extname(fp)]||"application/octet-stream"});res.end(readFileSync(fp));}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,()=>r(s));});}

const ROOT="D:/Masra/mobile/build/web";
const PORT=8120;
const srv=await serve(ROOT,PORT);
const b=await chromium.launch();
const page=await b.newPage({viewport:{width:412,height:892},deviceScaleFactor:2});
page.on("console",m=>{const t=m.text();if(/error|fail|exception|supabase|auth/i.test(t))console.log("PAGE:",t.slice(0,200));});
try{await page.goto(`http://localhost:${PORT}/`,{waitUntil:"load",timeout:60000});}catch(e){console.log("goto:",e.message);}
// wait for Flutter boot
await page.waitForTimeout(12000);
await page.screenshot({path:"_qa/real/masra-landing.png"});
console.log("landing captured");
// tap Skip (تخطى) top-left to reach login
await page.mouse.click(50,33);
await page.waitForTimeout(3000);
await page.screenshot({path:"_qa/real/masra-login.png"});
console.log("login captured");

// fill credentials (logical coords; viewport 412 wide)
await page.mouse.click(206,472); await page.waitForTimeout(600);
await page.keyboard.type("admin@masra.com",{delay:40});
await page.waitForTimeout(500);
await page.mouse.click(206,534); await page.waitForTimeout(600);
await page.keyboard.type("MasraPassword123!",{delay:40});
await page.waitForTimeout(500);
await page.screenshot({path:"_qa/real/masra-filled.png"});
// submit
await page.mouse.click(206,649);
await page.waitForTimeout(6000);
await page.screenshot({path:"_qa/real/masra-home.png"});
console.log("home captured");
await page.waitForTimeout(2000);
await page.screenshot({path:"_qa/real/masra-home2.png"});
await page.close(); await b.close(); srv.close();
console.log("DONE");
