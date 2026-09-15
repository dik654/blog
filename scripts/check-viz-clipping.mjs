#!/usr/bin/env node
/**
 * 장면 Viz 가 좁은 화면에서 잘리지 않는지 브라우저로 확인한다.
 *
 * `overflow-x: auto` 는 브라우저가 `overflow-y` 도 auto 로 올리게 만들고,
 * 그 칸이 flex 로 줄어들면 그림이 세로로 잘린다. 이 결함은 소스만 봐서는
 * 보이지 않고 tsc·eslint·기존 감사 8종에도 걸리지 않아 실제 렌더로만 잡힌다.
 *
 *   npm run build && node scripts/check-viz-clipping.mjs <route 목록 파일>
 *
 * 목록 파일은 한 줄에 `<카테고리>/<글 slug>` 하나씩 적는다.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
const ROOT="dist";
const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2"};
const server=createServer(async(req,res)=>{let p=decodeURIComponent(req.url.split("?")[0]).replace(/^\/blog/,"")||"/";let f=join(ROOT,p);
try{if((await stat(f)).isDirectory())f=join(f,"index.html");}catch{f=join(ROOT,p,"index.html");try{await stat(f);}catch{f=join(ROOT,"404.html");}}
try{const b=await readFile(f);res.writeHead(200,{"content-type":T[extname(f)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404);res.end("nf");}});
await new Promise(r=>server.listen(4604,r));
const DOM={ai:"cs",gpu:"cs",blockchain:"cs",crypto:"cs",p2p:"cs",tee:"cs","isms-aml":"cs",saas:"cs",hw:"cs",
 scarcity:"economics",prices:"economics","market-failure":"economics",macro:"economics",
 money:"finance",banking:"finance",markets:"finance",risk:"finance",
 polity:"politics",constitution:"politics",elections:"politics",governance:"politics",
 "legal-system":"law","private-law":"law","criminal-law":"law","dispute-resolution":"law"};
const listArg=process.argv[2];
const routes=listArg
  ? (await readFile(listArg,"utf8")).trim().split("\n").filter(Boolean)
  : (() => { throw new Error("사용법: node scripts/check-viz-clipping.mjs <route 목록 파일>"); })();
const b=await chromium.launch();
let bad=0, checked=0;
for (const [label,w,h] of [["mobile",390,844],["desktop",1440,900]]) {
  for (const r of routes) {
    const cat=r.split("/")[0];
    const url=`http://localhost:4604/blog/${DOM[cat]??"cs"}/${r}`;
    const page=await b.newPage({viewport:{width:w,height:h}});
    const errs=[];
    page.on("pageerror",e=>errs.push(String(e)));
    let ok=true;
    try{ await page.goto(url,{waitUntil:"networkidle",timeout:45000}); }catch{ ok=false; }
    await page.waitForTimeout(350);
    const res = ok ? await page.evaluate(() => {
      const figs=[...document.querySelectorAll('figure[data-viz="modern"]')].filter(f=>f.querySelector("[data-viz-controls]"));
      let clipped=0, unreachable=0, n=0;
      for (const f of figs) {
        const svg=f.querySelector("svg"); if(!svg) continue; n++;
        const wrap=svg.parentElement;
        if (svg.getBoundingClientRect().height > wrap.getBoundingClientRect().height + 1) clipped++;
        const inner=[...f.querySelectorAll("[data-viz-canvas]")].pop();
        const content=[...(inner?.children??[])].find(c=>c.getBoundingClientRect().height>0);
        if (content && inner && inner.scrollTop===0 &&
            content.getBoundingClientRect().top < inner.getBoundingClientRect().top - 1) unreachable++;
      }
      const notFound=/페이지를 찾을 수 없습니다/.test(document.body.innerText);
      return {n, clipped, unreachable, notFound};
    }) : {n:0,clipped:-1,unreachable:-1,notFound:true};
    checked++;
    if (res.clipped>0 || res.unreachable>0 || res.notFound || errs.length) {
      bad++;
      console.log(`  BAD ${label} ${r} viz=${res.n} 잘림=${res.clipped} 위쪽=${res.unreachable} 404=${res.notFound} err=${errs.length}`);
    }
    await page.close();
  }
  console.log(`${label} 완료`);
}
console.log(`\n검사 ${checked}건 · 문제 ${bad}건`);
await b.close(); server.close();
