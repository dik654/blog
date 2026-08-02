import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/attention-theory', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Bahdanau Attention');
// Scroll to Additive section
await page.evaluate(() => document.getElementById('additive')?.scrollIntoView());
await page.waitForTimeout(800);
// click next step twice to reach step 2 (MLP score)
const next = await page.locator('section#additive button').nth(1);
await next.click();
await page.waitForTimeout(1500);
await next.click();
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/bahdanau-step2.png', fullPage: false, clip: { x: 0, y: 0, width: 1400, height: 900 } });
// Count flow arrows in the current step
const arrowCount = await page.evaluate(() => {
  const svgs = document.querySelectorAll('section#additive svg');
  let count = 0;
  for (const svg of svgs) {
    count += svg.querySelectorAll('path[marker-end]').length;
  }
  return count;
});
console.log('flow arrows:', arrowCount);
await browser.close();
