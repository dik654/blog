import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const url = 'https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/scene-engine-test';
const errs = [];
page.on('pageerror', e => errs.push({ kind: 'pageerror', msg: e.message }));
page.on('console', m => { if (m.type() === 'error') errs.push({ kind: 'console', msg: m.text() }); });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// each Scene block screenshot separately
const blocks = await page.locator('article > div.not-prose').all();
console.log(`found ${blocks.length} scene blocks`);

for (let i = 0; i < blocks.length; i++) {
  await blocks[i].screenshot({ path: `/tmp/scene-${i + 1}.png` });
  const bbox = await blocks[i].boundingBox();
  console.log(`scene #${i + 1}: ${JSON.stringify(bbox)} → /tmp/scene-${i + 1}.png`);
}

// horizontal overflow check
const doc = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
}));
console.log(`overflow check: scrollW=${doc.scrollW} clientW=${doc.clientW}`);
if (doc.scrollW > doc.clientW + 1) errs.push({ kind: 'overflow-x', ...doc });

// object label clipping check
const clips = await page.evaluate(() => {
  const arr = [];
  document.querySelectorAll('.not-prose foreignObject > div, .not-prose svg text').forEach((el) => {
    if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
      arr.push({ tag: el.tagName, text: el.textContent?.slice(0, 60) });
    }
  });
  return arr;
});
if (clips.length) clips.forEach(c => errs.push({ kind: 'clip', ...c }));

await browser.close();

if (errs.length) {
  console.log('\n=== ERRORS ===');
  errs.forEach(e => console.log(JSON.stringify(e)));
  process.exitCode = 1;
} else {
  console.log('\nno errors. inspect /tmp/scene-*.png');
}
