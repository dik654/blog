import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
const ROOT="dist";
const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2"};
const server=createServer(async(req,res)=>{let p=decodeURIComponent(req.url.split("?")[0]).replace(/^\/blog/,"")||"/";let f=join(ROOT,p);
try{if((await stat(f)).isDirectory())f=join(f,"index.html");}catch{f=join(ROOT,p,"index.html");try{await stat(f);}catch{f=join(ROOT,"404.html");}}
try{const b=await readFile(f);res.writeHead(200,{"content-type":T[extname(f)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404);res.end("nf");}});
await new Promise(r=>server.listen(4611,r));
const out=process.argv[2], url="http://localhost:4611"+process.argv[3], figIdx=Number(process.argv[4]??0);
const b=await chromium.launch();
const page=await b.newPage({viewport:{width:1440,height:1000}});
const errs=[];page.on("pageerror",e=>errs.push(String(e)));
await page.goto(url,{waitUntil:"networkidle",timeout:60000});
await page.waitForTimeout(800);
const figs=await page.locator('figure[data-viz="modern"]').all();
const fig=figs[figIdx];
await fig.scrollIntoViewIfNeeded();
const btns=await fig.locator('[data-viz-controls] button').all();
for (let i=0;i<btns.length;i++){
  const label=(await btns[i].innerText()).slice(0,40).replace(/\s+/g," ");
  if(!/^0\d/.test(label)) continue;
  await btns[i].click(); await page.waitForTimeout(600);
  await fig.screenshot({path:`${out}-s${i}.png`});
}
console.log("figs:",figs.length,"pageerr:",errs.length?errs:"none");
await b.close();server.close();
