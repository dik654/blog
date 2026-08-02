import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/attention-theory', { waitUntil: 'networkidle' });
await page.evaluate(() => document.getElementById('overview')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/overview.png', clip: { x: 0, y: 0, width: 1400, height: 900 } });
await browser.close();
