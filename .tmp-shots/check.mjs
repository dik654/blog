import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
const ROOT="dist";
const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2"};
const server=createServer(async(req,res)=>{let p=decodeURIComponent(req.url.split("?")[0]).replace(/^\/blog/,"")||"/";let f=join(ROOT,p);
try{if((await stat(f)).isDirectory())f=join(f,"index.html");}catch{f=join(ROOT,p,"index.html");try{await stat(f);}catch{f=join(ROOT,"404.html");}}
try{const b=await readFile(f);res.writeHead(200,{"content-type":T[extname(f)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404);res.end("nf");}});
await new Promise(r=>server.listen(4612,r));
const routes=process.argv.slice(3), out=process.argv[2];
const b=await chromium.launch();
for (const [label,w,h] of [["desktop",1440,1000],["mobile",390,844]]) {
  for (const r of routes) {
    const page=await b.newPage({viewport:{width:w,height:h}});
    const errs=[],cons=[];
    page.on("pageerror",e=>errs.push(String(e)));
    page.on("console",m=>{if(m.type()==="error")cons.push(m.text().slice(0,120));});
    await page.goto("http://localhost:4612/blog"+r,{waitUntil:"networkidle",timeout:60000});
    await page.waitForTimeout(900);
    const res=await page.evaluate(()=>{
      const narrow=[];
      document.querySelectorAll("main *").forEach(el=>{
        const rc=el.getBoundingClientRect(), t=(el.innerText||"").trim();
        if(t.length>40&&rc.width>0&&rc.width<160&&rc.height>300) narrow.push({w:Math.round(rc.width),h:Math.round(rc.height),t:t.slice(0,22)});
      });
      const fo=[...document.querySelectorAll("[data-formula-explained]")].map(f=>{
        const kids=[...f.querySelectorAll("*")];
        const k=kids.findIndex(e=>e.classList.contains("katex"));
        const q=kids.findIndex(e=>(e.textContent||"").trim()==="이 식이 답하는 질문");
        const ops=kids.findIndex(e=>e.hasAttribute&&e.hasAttribute("data-formula-operations"));
        const mode=f.querySelector("[data-formula-annotation-mode]")?.getAttribute("data-formula-annotation-mode");
        return q>=0&&k>=0&&q<k&&ops>k&&mode==="explicit";
      });
      return {narrow,fo,scrollW:document.documentElement.scrollWidth,vw:window.innerWidth,
        katexErr:document.querySelectorAll(".katex-error").length};
    });
    const flag=res.narrow.length||res.katexErr||res.scrollW>res.vw+1||res.fo.some(x=>!x);
    console.log(`${flag?"FLAG":"ok  "} ${label} ${r} narrow=${res.narrow.length} katexErr=${res.katexErr} scroll=${res.scrollW}/${res.vw} formulas=${JSON.stringify(res.fo)} pageerr=${errs.length} consoleerr=${cons.length}`);
    if(res.narrow.length) console.log("   ",JSON.stringify(res.narrow).slice(0,260));
    if(errs.length) console.log("   pageerror:",errs[0].slice(0,180));
    await page.screenshot({path:`${out}-${label}-${r.replace(/\//g,"_")}.png`,fullPage:true});
    await page.close();
  }
}
await b.close();server.close();
