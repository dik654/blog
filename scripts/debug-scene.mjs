import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const errs = [];
page.on('pageerror', e => errs.push({ kind: 'pageerror', msg: e.message, stack: e.stack?.slice(0, 400) }));
page.on('console', m => {
  if (m.type() === 'error' || m.type() === 'warning') errs.push({ kind: m.type(), msg: m.text() });
});
page.on('response', r => {
  if (r.status() >= 400) errs.push({ kind: 'http', status: r.status(), url: r.url() });
});

const url = 'https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/scene-engine-test';
console.log(`loading ${url}`);
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const title = await page.title();
const h1 = await page.locator('h1').first().textContent().catch(() => '(no h1)');
const bodyHasContent = await page.evaluate(() => document.body.textContent?.length ?? 0);
const sceneCount = await page.locator('article > div.not-prose').count();
const articleHtml = await page.evaluate(() => document.querySelector('article')?.outerHTML?.slice(0, 600) ?? '(no article)');

console.log({ title, h1, bodyHasContent, sceneCount });
console.log('--- article snippet ---');
console.log(articleHtml);
console.log('--- errors ---');
errs.forEach(e => console.log(JSON.stringify(e)));

await browser.close();
