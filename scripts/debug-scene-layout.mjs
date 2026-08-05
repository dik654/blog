import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/attention-theory', { waitUntil: 'networkidle' });
await page.evaluate(() => document.getElementById('additive')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(700);

const info = await page.evaluate(() => {
  const sceneWrap = document.querySelector('section#additive .not-prose');
  const svg = document.querySelector('section#additive svg');
  if (!sceneWrap || !svg) return null;
  return {
    wrapW: sceneWrap.getBoundingClientRect().width,
    svgW: svg.getBoundingClientRect().width,
    svgH: svg.getBoundingClientRect().height,
    viewBox: svg.getAttribute('viewBox'),
  };
});
console.log(info);
await browser.close();
