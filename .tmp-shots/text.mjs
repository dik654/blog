import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
const ROOT="dist";
const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2"};
const server=createServer(async(req,res)=>{let p=decodeURIComponent(req.url.split("?")[0]).replace(/^\/blog/,"")||"/";let f=join(ROOT,p);
try{if((await stat(f)).isDirectory())f=join(f,"index.html");}catch{f=join(ROOT,p,"index.html");try{await stat(f);}catch{f=join(ROOT,"404.html");}}
try{const b=await readFile(f);res.writeHead(200,{"content-type":T[extname(f)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404);res.end("nf");}});
await new Promise(r=>server.listen(4610,r));
const b=await chromium.launch();
const page=await b.newPage({viewport:{width:1440,height:1000}});
await page.goto("http://localhost:4610/blog"+process.argv[2],{waitUntil:"networkidle",timeout:60000});
await page.waitForTimeout(900);
console.log((await page.locator("main").innerText()).slice(0,Number(process.argv[3]??2500)));
await b.close();server.close();
