import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/attention-theory', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Bahdanau Attention');
await page.evaluate(() => document.getElementById('additive')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(700);

// helper: get bounding rect of the scene SVG
const sceneRect = async () => page.evaluate(() => {
  const svg = document.querySelector('section#additive svg');
  if (!svg) return null;
  const r = svg.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
});

const r0 = await sceneRect();
console.log('step 0 SVG:', r0);
await page.screenshot({ path: '/tmp/zoom-step0.png', clip: { x: 0, y: 0, width: 1400, height: 900 } });

// next 2x → step 2
const next = page.locator('section#additive button').nth(1);
await next.click(); await page.waitForTimeout(700);
await next.click(); await page.waitForTimeout(1500);
const r2 = await sceneRect();
console.log('step 2 SVG:', r2);
await page.screenshot({ path: '/tmp/zoom-step2.png', clip: { x: 0, y: 0, width: 1400, height: 900 } });

// click on the first cell rect of e
const eHandle = await page.evaluate(() => {
  const svg = document.querySelector('section#additive svg');
  if (!svg) return null;
  const texts = svg.querySelectorAll('text');
  for (const t of texts) {
    if (t.textContent && t.textContent.trim() === 'e') {
      const g = t.parentElement;
      if (g) {
        const rect = g.querySelector('rect');
        if (rect) {
          const r = rect.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
      }
    }
  }
  return null;
});
console.log('e cell center:', eHandle);
const vb = async () => page.evaluate(() => {
  const svg = document.querySelector('section#additive svg');
  return svg ? svg.getAttribute('viewBox') : null;
});
console.log('viewBox before zoom:', await vb());

if (eHandle) {
  await page.mouse.dblclick(eHandle.x, eHandle.y);
  await page.waitForTimeout(1500);
  const rz = await sceneRect();
  console.log('zoom SVG:', rz);
  console.log('viewBox after zoom:', await vb());
  await page.screenshot({ path: '/tmp/zoom-e.png', clip: { x: 0, y: 0, width: 1400, height: 900 } });
}
await browser.close();
