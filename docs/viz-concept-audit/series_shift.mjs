// node series_shift.mjs <baseUrl> <slug...>  → per Viz: frameΔ/ctrlΔ at 390 & 1440, canvas overflow at 1440x900
import { chromium } from "/Users/dylan/code/projects/blog/node_modules/playwright/index.mjs";
const [base, ...slugs] = process.argv.slice(2);
const b = await chromium.launch();
const rows = [];
for (const slug of slugs) for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on("pageerror", e => errs.push(String(e)));
  try { await p.goto(`${base}/cs/ai/${slug}`, { waitUntil: "networkidle", timeout: 60000 }); } catch { rows.push([slug, w, "LOAD-FAIL"]); await p.close(); continue; }
  await p.waitForTimeout(1200);
  const figs = await p.locator("figure:has([data-viz-canvas])").all();
  for (let i = 0; i < figs.length; i++) {
    const fig = figs[i];
    if (!(await fig.isVisible())) continue;
    await fig.scrollIntoViewIfNeeded().catch(() => {});
    const title = ((await fig.locator("figcaption h3").first().textContent().catch(() => "")) || "").slice(0, 26);
    const pause = fig.locator('button[aria-label*="정지"], button[aria-label*="일시"]').first();
    if (await pause.count()) await pause.click().catch(() => {});
    const next = fig.getByRole("button", { name: /다음/ }).filter({ visible: true }).first();
    const tabs = fig.locator("button").filter({ hasText: /^\d\d · / });
    const total = await tabs.count();
    const over = w === 1440 ? await fig.evaluate(f => { const c = f.querySelector(":scope > [data-viz-canvas]"); return c ? c.scrollHeight - c.clientHeight : 0; }) : 0;
    if (!total) { rows.push([slug, w, i, title, "static", 0, 0, over]); continue; }
    const useNext = (await next.count()) > 0;
    const prev = fig.getByRole("button", { name: /이전/ }).filter({ visible: true }).first();
    if (useNext && (await prev.count())) for (let k = 0; k < total; k++) if (await prev.isEnabled().catch(() => false)) await prev.click();
    const hs = [], cs = [];
    for (let s = 0; s < total; s++) {
      if (useNext) { if (s > 0) await next.click().catch(() => {}); } else await tabs.nth(s).click().catch(() => {});
      await p.waitForTimeout(1600);
      const ctrl = useNext ? next : tabs.first();
      const fb = await fig.boundingBox(), nb = await ctrl.boundingBox();
      if (fb && nb) { hs.push(Math.round(fb.height)); cs.push(Math.round(nb.y - fb.y)); }
    }
    rows.push([slug, w, i, title, total, Math.max(...hs) - Math.min(...hs), Math.max(...cs) - Math.min(...cs), over]);
  }
  if (errs.length) rows.push([slug, w, "PAGEERR", errs[0].slice(0, 80)]);
  await p.close();
}
await b.close();
for (const r of rows) console.log(r.join("\t"));
