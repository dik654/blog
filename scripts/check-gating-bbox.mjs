import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/claw-permissions', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const result = await page.evaluate(() => {
  // find gating pipeline svg by header text
  const headers = [...document.querySelectorAll('.not-prose')].filter(d =>
    d.textContent.includes('7-stage early-exit pipeline')
  );
  if (!headers.length) return { error: 'not found' };
  const svg = headers[0].querySelector('svg');
  const rects = [...svg.querySelectorAll('rect')]
    .filter(r => r.getAttribute('fill') !== 'url(#pt-grid)' && r.getAttribute('fill') !== 'url(#cp-grid)')
    .map(r => ({ tag: 'rect', x: +r.getAttribute('x'), y: +r.getAttribute('y'), w: +r.getAttribute('width'), h: +r.getAttribute('height') }));
  const polys = [...svg.querySelectorAll('polygon')].map(p => {
    const pts = p.getAttribute('points').split(' ').map(s => s.split(',').map(Number));
    const xs = pts.map(p => p[0]); const ys = pts.map(p => p[1]);
    return { tag: 'polygon', x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  });
  return { rects, polys };
});

// req is the rect at x=16..76, G1 diamond is the first polygon
const req = result.rects.find(r => r.x === 16);
const g1 = result.polys[0];
console.log('req:', req);
console.log('G1 :', g1);
const reqRight = req.x + req.w;
const g1Left = g1.x;
console.log(`req right edge: ${reqRight}, G1 left edge: ${g1Left}, gap: ${g1Left - reqRight}`);
if (g1Left < reqRight) console.log('!! OVERLAP !!');
else console.log('ok — no overlap');

// also verify every subsequent gate pair has no overlap
for (let i = 0; i < result.polys.length - 1; i++) {
  const a = result.polys[i], b = result.polys[i + 1];
  const aRight = a.x + a.w, bLeft = b.x;
  const gap = bLeft - aRight;
  if (gap < 0) console.log(`!! G${i+1}↔G${i+2} OVERLAP gap=${gap}`);
}

// check last gate vs DENY rect
const lastGate = result.polys[result.polys.length - 1];
const denyRect = result.rects.find(r => r.x > 400 && r.x < 600 && r.w > 70 && r.w < 90);
if (denyRect) {
  const lastRight = lastGate.x + lastGate.w;
  console.log(`last gate right: ${lastRight}, DENY left: ${denyRect.x}, gap: ${denyRect.x - lastRight}`);
}

await browser.close();
