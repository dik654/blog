import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/attention-theory', { waitUntil: 'networkidle' });
await page.evaluate(() => document.getElementById('additive')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(800);

const info = await page.evaluate(() => {
  const svg = document.querySelector('section#additive svg');
  if (!svg) return null;
  // find all foreignObject (caption blocks) and their x+width
  const fos = svg.querySelectorAll('foreignObject');
  const blocks = [];
  for (const f of fos) {
    blocks.push({
      x: parseFloat(f.getAttribute('x')),
      y: parseFloat(f.getAttribute('y')),
      w: parseFloat(f.getAttribute('width')),
      h: parseFloat(f.getAttribute('height')),
    });
  }
  blocks.sort((a,b) => a.x - b.x);
  return { viewBox: svg.getAttribute('viewBox'), blocks };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
