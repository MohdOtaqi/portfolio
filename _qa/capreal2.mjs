import { chromium } from "playwright";
import http from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { extname, join, normalize } from "path";
const MIME={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".wasm":"application/wasm",".ico":"image/x-icon",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf",".otf":"font/otf",".bin":"application/octet-stream",".symbols":"application/octet-stream"};
function serve(root,port){return new Promise(r=>{const s=http.createServer((req,res)=>{try{let p=decodeURIComponent(req.url.split("?")[0]);let fp=normalize(join(root,p));if(!fp.startsWith(normalize(root))){res.writeHead(403);return res.end();}if(!existsSync(fp)||statSync(fp).isDirectory()){fp=join(root,"index.html");}if(!existsSync(fp)){res.writeHead(404);return res.end();}res.writeHead(200,{"Content-Type":MIME[extname(fp)]||"application/octet-stream"});res.end(readFileSync(fp));}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,()=>r(s));});}
const APPS=[{name:"masra",root:"D:/Masra/mobile/build/web",port:8112},{name:"sehleh",root:"D:/Sahleh/apps/mobile/build/web",port:8113}];
const b=await chromium.launch();
for(const app of APPS){
  const srv=await serve(app.root,app.port);
  const page=await b.newPage({viewport:{width:412,height:892},deviceScaleFactor:2});
  try{await page.goto(`http://localhost:${app.port}/`,{waitUntil:"load",timeout:60000});}catch(e){}
  // wait for boot
  for(let i=0;i<25;i++){await page.waitForTimeout(1000);const t=await page.evaluate(()=>document.body.innerText.length).catch(()=>0);if(i>=6&&t>0) break;}
  await page.waitForTimeout(2000);
  const swipe=async()=>{await page.mouse.move(360,450);await page.mouse.down();await page.mouse.move(60,450,{steps:12});await page.mouse.up();await page.waitForTimeout(1400);};
  await page.screenshot({path:`_qa/real/${app.name}-a.png`});
  await swipe(); await page.screenshot({path:`_qa/real/${app.name}-b.png`});
  await swipe(); await page.screenshot({path:`_qa/real/${app.name}-c.png`});
  // tap bottom CTA (Get Started / Next / login)
  await page.mouse.click(206,820); await page.waitForTimeout(1800);
  await page.screenshot({path:`_qa/real/${app.name}-d.png`});
  console.log(app.name,"done");
  await page.close(); srv.close();
}
await b.close(); console.log("DONE");
