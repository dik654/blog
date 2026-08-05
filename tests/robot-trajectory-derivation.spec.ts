import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';
const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`trajectory article derives the four-term path dynamics at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/robot-trajectory-generation`, { waitUntil: 'networkidle' });

    const section = page.locator('#dynamic-retiming');
    await expect(section).toContainText('점성 마찰');
    await expect(section).toContainText('frictionless 축약');
    const sources = await section.locator('[data-math-source]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-math-source') ?? ''));
    expect(sources.some((source) => source.includes(String.raw`R\dot q`))).toBe(true);
    expect(sources.some((source) => source.includes(String.raw`d(s)\dot s`))).toBe(true);
    expect(sources.some((source) => source.includes(String.raw`-3\le\ddot s\le1`))).toBe(true);
    await expect(section).toContainText('최대가속 U=1');
    await expect(section).toContainText('velocity ceiling');

    const releaseGate = page.locator('[data-dynamic-retiming-release-gate]');
    await expect(releaseGate).toBeVisible();
    await expect(releaseGate.getByRole('listitem')).toHaveCount(6);
    await expect(releaseGate).toContainText('a_i가 0에 가까우면');
    await expect(releaseGate).toContainText('Controller replay');

    await expect(page.locator('article .katex-error')).toHaveCount(0);
    const missingAnnotations = await section.locator('[data-math-annotation-missing="true"]').count();
    expect(missingAnnotations).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`Shin-McKay reconstruction preserves viscous friction at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/paper-shin-mckay-time-optimal-1985`, { waitUntil: 'networkidle' });

    await expect(page.getByText('점성 마찰', { exact: false }).first()).toBeVisible();
    const sources = await page.locator('article [data-math-source]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-math-source') ?? ''));
    expect(sources.some((source) => source.includes(String.raw`\underbrace{d(s)}`) && source.includes(String.raw`\dot s`))).toBe(true);
    expect(sources.some((source) => source.includes(String.raw`R_{ij}`))).toBe(true);
    await expect(page.getByText('d=0을 명시할 때만', { exact: false }).first()).toBeVisible();
    expect(sources.some((source) => source.includes(String.raw`\underbrace{-3}_{L}`))).toBe(true);

    await expect(page.locator('article .katex-error')).toHaveCount(0);
    const missingAnnotations = await page.locator('article [data-math-annotation-missing="true"]').count();
    expect(missingAnnotations).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
