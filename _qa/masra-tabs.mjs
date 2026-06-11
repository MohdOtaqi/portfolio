import { chromium } from "playwright";
import http from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { extname, join, normalize } from "path";
const MIME={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".wasm":"application/wasm",".ico":"image/x-icon",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf",".otf":"font/otf",".bin":"application/octet-stream",".symbols":"application/octet-stream"};
function serve(root,port){return new Promise(r=>{const s=http.createServer((req,res)=>{try{let p=decodeURIComponent(req.url.split("?")[0]);let fp=normalize(join(root,p));if(!fp.startsWith(normalize(root))){res.writeHead(403);return res.end();}if(!existsSync(fp)||statSync(fp).isDirectory()){fp=join(root,"index.html");}if(!existsSync(fp)){res.writeHead(404);return res.end();}res.writeHead(200,{"Content-Type":MIME[extname(fp)]||"application/octet-stream"});res.end(readFileSync(fp));}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,()=>r(s));});}

const ROOT="D:/Masra/mobile/build/web";
const PORT=8123;
const srv=await serve(ROOT,PORT);
const b=await chromium.launch();
const page=await b.newPage({viewport:{width:412,height:892},deviceScaleFactor:2});
try{await page.goto(`http://localhost:${PORT}/`,{waitUntil:"load",timeout:60000});}catch(e){}
await page.waitForTimeout(12000);
await page.mouse.click(50,33); await page.waitForTimeout(2500);
await page.mouse.click(206,472); await page.waitForTimeout(500);
await page.keyboard.type("admin@masra.com",{delay:35});
await page.mouse.click(206,534); await page.waitForTimeout(500);
await page.keyboard.type("MasraPassword123!",{delay:35});
await page.mouse.click(206,649); await page.waitForTimeout(6000);
console.log("logged in");

// bottom-nav tabs (logical): account 54, fatwa 126, admin 199, calendar 271, home 350  (all y=845)
const tabs=[
  {name:"fatwa",   x:126},
  {name:"calendar",x:271},
  {name:"account", x:54},
];
for(const t of tabs){
  await page.mouse.click(t.x,845); await page.waitForTimeout(3500);
  await page.screenshot({path:`_qa/real/masra-${t.name}.png`});
  console.log(t.name,"done");
}
await page.close(); await b.close(); srv.close();
console.log("DONE");
