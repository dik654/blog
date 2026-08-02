import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4176';

const articles = [
  { slug: 'animation-production-workflow', formulas: 1, visuals: 2 },
  { slug: 'animation-video-dataset', formulas: 2, visuals: 1 },
  { slug: 'animation-captioning', formulas: 2, visuals: 1 },
  { slug: 'animation-lora-training', formulas: 3, visuals: 1 },
  { slug: 'animation-fps-vfi', formulas: 3, visuals: 1 },
  { slug: 'animation-video-evaluation', formulas: 2, visuals: 1 },
];

test('animation category starts from a model-independent production contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-open-models-animation`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-open-model-animation"]');
  await expect(path.getByRole('link')).toHaveCount(6);
  await expect(path.getByRole('link').first()).toHaveAttribute('href', /animation-production-workflow$/);
  await expect(path.getByRole('link', { name: /LTX 기반/ })).toHaveCount(0);
  await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('animation production map includes temporal finishing before release', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/animation-production-workflow`, { waitUntil: 'networkidle' });

  const map = page.locator('[data-animation-viz]').first();
  await expect(map.getByText('시간 표현', { exact: true })).toBeVisible();
  await expect(map.getByText('Release 증거', { exact: true })).toBeVisible();
  await expect(map.locator('.step-viz__progress > button')).toHaveCount(7);
});

for (const article of articles) {
  test(`${article.slug} keeps formulas, Korean notes, evidence and responsive visual together`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-animation-viz]')).toHaveCount(article.visuals);
    await expect(page.locator('[data-animation-viz] [data-step-viz]')).toHaveCount(article.visuals);
    await expect(page.locator('[data-math-fit]')).toHaveCount(article.formulas);
    await expect(page.locator('[data-formula-note]')).toHaveCount(article.formulas);
    await expect(page.getByText('여기까지 오면', { exact: true })).toBeVisible();
    await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();

    const audit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => {
      const node = element as HTMLElement;
      const pair = node.parentElement;
      const content = node.firstElementChild?.getBoundingClientRect();
      const frame = node.getBoundingClientRect();
      return {
        scale: Number(node.dataset.mathScale ?? '1'),
        overflow: content ? content.width - frame.width : 0,
        koreanNote: /[가-힣]/.test(pair?.querySelector<HTMLElement>('[data-formula-note]')?.innerText ?? ''),
      };
    }));
    expect(audit.every((item) => item.scale >= 0.68 && item.overflow <= 1 && item.koreanNote)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

for (const viewport of [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  for (const article of articles) {
    test(`${article.slug} stays legible at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('[data-animation-viz]').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      const formulaScales = await page.locator('[data-math-fit]').evaluateAll((nodes) => nodes.map((node) => Number((node as HTMLElement).dataset.mathScale ?? '1')));
      expect(formulaScales.every((scale) => scale >= 0.8)).toBeTruthy();
    });
  }
}
