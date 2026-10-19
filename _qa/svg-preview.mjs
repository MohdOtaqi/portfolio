import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const names = ["portfolio", "phone", "mail", "pin", "github"];
const html = `<body style="margin:0;background:#fff">${names.map((n) => `<img src="data:image/svg+xml;base64,${Buffer.from(readFileSync(`cv/icons/${n}.svg`)).toString("base64")}" style="height:120px;margin:10px">`).join("")}<img src="data:image/png;base64,${readFileSync("cv/icons/linkedin.png").toString("base64")}" style="height:120px;margin:10px"></body>`;
const b = await chromium.launch({ channel: "msedge" }); const p = await b.newPage({ viewport: { width: 1100, height: 150 } });
await p.setContent(html); await p.screenshot({ path: process.argv[2] }); await b.close();
