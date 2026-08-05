import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const route = '/lab/blog/ai/llm-architecture-dense-transformers';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`dense architecture keeps one compact lab and readable formulas on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-dense-decision-lab]')).toHaveCount(1);
    await expect(page.locator('[data-dense-viz]')).toHaveCount(0);
    await expect(page.locator('[data-dense-core-chapter]')).toHaveCount(5);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('[data-architecture-figure-viewer] [role="tab"]')).toHaveCount(5);

    const formulaCount = await page.locator('[data-math-fit]').count();
    await expect(page.locator('[data-formula-note]')).toHaveCount(formulaCount);
    const minFormulaFont = await page.locator('[data-math-fit]').evaluateAll((elements) => (
      Math.min(...elements.map((element) => {
        const renderedMath = element.firstElementChild;
        return Number.parseFloat(getComputedStyle(renderedMath ?? element).fontSize);
      }))
    ));
    expect(minFormulaFont).toBeGreaterThanOrEqual(12);

    const formulaOverflow = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.some((element) => (
      element.scrollWidth - element.clientWidth > 1
    )));
    expect(formulaOverflow).toBe(false);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);

    const maxChapterHeight = await page.locator('[data-dense-core-chapter]').evaluateAll((elements) => (
      Math.max(...elements.map((element) => element.getBoundingClientRect().height))
    ));
    expect(maxChapterHeight).toBeLessThan(viewport.width < 640 ? 1450 : viewport.width < 1024 ? 1100 : 900);
  });
}

test('projection budgets and QK-Norm behavior match the written equations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-dense-decision-lab]');

  await lab.getByRole('tab', { name: /GPT-2 XL/ }).click();
  await expect(lab.locator('[data-dense-attention-parameters]')).toHaveAttribute('data-dense-attention-parameters', '10.24M');
  await expect(lab.locator('[data-dense-ffn-parameters]')).toHaveAttribute('data-dense-ffn-parameters', '20.48M');

  await lab.getByRole('tab', { name: /Qwen3 8B/ }).click();
  await expect(lab.locator('[data-dense-attention-parameters]')).toHaveAttribute('data-dense-attention-parameters', '41.94M');
  await expect(lab.locator('[data-dense-ffn-parameters]')).toHaveAttribute('data-dense-ffn-parameters', '150.99M');

  await lab.getByRole('tab', { name: /Gemma 3 27B/ }).click();
  await expect(lab.locator('[data-dense-attention-parameters]')).toHaveAttribute('data-dense-attention-parameters', '66.06M');
  await expect(lab.locator('[data-dense-ffn-parameters]')).toHaveAttribute('data-dense-ffn-parameters', '346.82M');

  await lab.getByRole('tab', { name: /OLMo 3 7B/ }).click();
  await expect(lab.locator('[data-dense-attention-parameters]')).toHaveAttribute('data-dense-attention-parameters', '67.11M');
  await expect(lab.locator('[data-dense-ffn-parameters]')).toHaveAttribute('data-dense-ffn-parameters', '135.27M');

  const normalizedBefore = await lab.locator('[data-dense-normalized-score]').getAttribute('data-dense-normalized-score');
  expect(normalizedBefore).toBe('1.358');
  const rawBefore = await lab.locator('[data-dense-raw-score]').getAttribute('data-dense-raw-score');
  await lab.getByLabel('QK query scale').fill('2');
  await expect(lab.locator('[data-dense-normalized-score]')).toHaveAttribute('data-dense-normalized-score', normalizedBefore ?? '');
  await expect.poll(async () => lab.locator('[data-dense-raw-score]').getAttribute('data-dense-raw-score')).not.toBe(rawBefore);
});

test('dense source viewer and next learning handoff remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const viewer = page.locator('[data-architecture-figure-viewer]');
  await viewer.getByRole('tab', { name: /Gemma 3 27B/ }).click();
  await expect(viewer.locator('img')).toHaveAttribute('alt', /Gemma 3 27B/);
  await expect.poll(async () => viewer.locator('img').evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(viewer.getByLabel('시각화 전체화면으로 보기')).toBeVisible();

  await expect(page.getByRole('link', { name: 'KV Cache와 Long Context' }).first()).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-kv-long-context');
  await expect(page.getByRole('link', { name: /Qwen Team · Qwen3 Technical Report/ })).toHaveAttribute('target', '_blank');
});
