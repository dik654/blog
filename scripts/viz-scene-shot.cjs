// 저장소 루트에서 실행합니다. 사용법: node scripts/viz-scene-shot.cjs <publicPath> <outDir> [Viz 제목 일부...]
// 지정한 Viz를 390px·1440px에서 장면별로 찍고, 조작부 흔들림·넘침·콘솔 오류를 출력합니다.
const { createRequire } = require("module");
const fs = require("fs");
const r = createRequire(process.cwd() + "/package.json");
const { chromium } = r("playwright");
const [publicPath, outDir, ...titles] = process.argv.slice(2);
const base = process.env.BASE || "http://127.0.0.1:5206";
fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
  for (const [w, h] of [[390, 844], [1440, 1000]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    // 다른 편집으로 개발 서버가 다시 불러오면 측정이 끊기므로 HMR 연결을 막습니다.
    if (p.routeWebSocket) await p.routeWebSocket(/.*/, () => {});
    const errs = [];
    p.on("console", (m) => {
      if (m.type() === "error" && !/favicon|404/.test(m.text())) errs.push(m.text().slice(0, 200));
    });
    p.on("pageerror", (e) => errs.push("PAGEERR " + String(e).slice(0, 240)));
    await p.goto(`${base}/${publicPath.replace(/^\//, "")}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForSelector("[data-article-body], figure[data-viz]", { timeout: 120000 });
    await p.waitForTimeout(1500);
    const names = await p.$$eval("figure[data-viz-name]", (els) => els.map((e) => e.getAttribute("data-viz-name")));
    console.log(`@${w} docScrollW=${await p.evaluate(() => document.documentElement.scrollWidth)} figures=${names.length}`);
    for (let i = 0; i < names.length; i++) {
      const title = names[i] || "";
      if (titles.length && !titles.some((t) => title.includes(t))) continue;
      const f = (await p.$$("figure[data-viz-name]"))[i];
      await f.scrollIntoViewIfNeeded();
      await p.waitForTimeout(titles.length ? 1800 : 300);
      const group = await f.$('[role="group"][tabindex="0"]');
      const sceneLog = [];
      for (let s = 0; s < 8; s++) {
        const ctl = await f.$("[data-viz-controls]");
        const cb = ctl ? await ctl.boundingBox() : null;
        const fb = await f.boundingBox();
        const canvasOverflow = await f.evaluate((el) => {
          const c = el.querySelector("[data-viz-canvas]");
          return c ? c.scrollWidth - c.clientWidth : 0;
        });
        sceneLog.push([cb ? Math.round(cb.y - fb.y) : null, Math.round(fb.height), canvasOverflow]);
        const safe = title.replace(/[^가-힣a-zA-Z0-9]+/g, "-").slice(0, 28);
        await f.screenshot({ path: `${outDir}/${w}-${i}-${safe}-s${s}.png` });
        if (!group || !ctl) break;
        const before = await f.evaluate((el) => el.innerText);
        await group.press("ArrowRight");
        await p.waitForTimeout(650);
        if ((await f.evaluate((el) => el.innerText)) === before) break;
      }
      console.log(`  [${i}] ${title}: controlY/frameH/overflow per scene ${JSON.stringify(sceneLog)}`);
    }
    console.log(`  console errors: ${errs.length} ${errs.slice(0, 4).join(" | ")}`);
    await ctx.close();
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
