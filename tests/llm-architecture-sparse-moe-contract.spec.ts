import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const route = '/lab/blog/ai/llm-architecture-sparse-moe';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`Sparse MoE article keeps formulas, labs and lineage readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-moe-ledger-lab]')).toHaveCount(1);
    await expect(page.locator('[data-moe-routing-lab]')).toHaveCount(1);
    await expect(page.locator('[data-moe-core-chapter]')).toHaveCount(5);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('[data-architecture-figure-viewer] [role="tab"]')).toHaveCount(3);
    await expect(page.getByText('CURRENT TARGET · 최신 구조를 세 축으로 분해')).toBeVisible();

    const formulaCount = await page.locator('[data-math-fit]').count();
    expect(formulaCount).toBe(12);
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

    const maxChapterHeight = await page.locator('[data-moe-core-chapter]').evaluateAll((elements) => (
      Math.max(...elements.map((element) => element.getBoundingClientRect().height))
    ));
    expect(maxChapterHeight).toBeLessThan(viewport.width < 640 ? 1400 : viewport.width < 1024 ? 1000 : 820);
  });
}

test('expert parameter lab separates bank activation from model-wide activation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-moe-ledger-lab]');

  await expect(lab.locator('[data-expert-params]')).toHaveAttribute('data-expert-params', '44.04M');
  await expect(lab.locator('[data-total-bank-layer]')).toHaveAttribute('data-total-bank-layer', '11.32B');
  await expect(lab.locator('[data-active-bank-layer]')).toHaveAttribute('data-active-bank-layer', '396.36M');
  await expect(lab.locator('[data-bank-active-ratio]')).toHaveAttribute('data-bank-active-ratio', '3.50');
  await expect(lab.locator('[data-reconstructed-total-bank]')).toHaveAttribute('data-reconstructed-total-bank', '656.46B');
  await expect(lab.locator('[data-reconstructed-active-bank]')).toHaveAttribute('data-reconstructed-active-bank', '22.99B');
  await expect(lab.locator('[data-reported-ratio]')).toHaveAttribute('data-reported-ratio', '5.51');

  await lab.getByRole('button', { name: 'Qwen3-A22B', exact: true }).click();
  await expect(lab.locator('[data-expert-params]')).toHaveAttribute('data-expert-params', '18.87M');
  await expect(lab.locator('[data-total-bank-layer]')).toHaveAttribute('data-total-bank-layer', '2.42B');
  await expect(lab.locator('[data-active-bank-layer]')).toHaveAttribute('data-active-bank-layer', '150.99M');
  await expect(lab.locator('[data-bank-active-ratio]')).toHaveAttribute('data-bank-active-ratio', '6.25');
  await expect(lab.locator('[data-reconstructed-total-bank]')).toHaveAttribute('data-reconstructed-total-bank', '227.10B');
  await expect(lab.locator('[data-reconstructed-active-bank]')).toHaveAttribute('data-reconstructed-active-bank', '14.19B');
  await expect(lab.locator('[data-reported-ratio]')).toHaveAttribute('data-reported-ratio', '9.36');
});

test('routing lab keeps capacity overflow, no-drop straggler and network bytes distinct', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-moe-routing-lab]');

  await expect(lab.locator('[data-expert-capacity]')).toHaveAttribute('data-expert-capacity', '8');
  await expect(lab.locator('[data-admitted-assignments]')).toHaveAttribute('data-admitted-assignments', '22 / 32');
  await expect(lab.locator('[data-routing-overflow]')).toHaveAttribute('data-routing-overflow', '10 · 31.25%');
  await expect(lab.locator('[data-routing-straggler]')).toHaveAttribute('data-routing-straggler', '2.00x');
  await expect(lab.locator('[data-dispatch-roundtrip]')).toHaveAttribute('data-dispatch-roundtrip', '896 MiB');

  await lab.getByRole('button', { name: '균형', exact: true }).click();
  await expect(lab.locator('[data-admitted-assignments]')).toHaveAttribute('data-admitted-assignments', '32 / 32');
  await expect(lab.locator('[data-routing-overflow]')).toHaveAttribute('data-routing-overflow', '0 · 0.00%');
  await expect(lab.locator('[data-routing-straggler]')).toHaveAttribute('data-routing-straggler', '1.00x');

  await lab.getByRole('button', { name: '쏠림', exact: true }).click();
  await lab.getByRole('button', { name: '1.50', exact: true }).click();
  await expect(lab.locator('[data-expert-capacity]')).toHaveAttribute('data-expert-capacity', '12');
  await expect(lab.locator('[data-admitted-assignments]')).toHaveAttribute('data-admitted-assignments', '28 / 32');
  await expect(lab.locator('[data-routing-overflow]')).toHaveAttribute('data-routing-overflow', '4 · 12.50%');

  await lab.getByRole('button', { name: 'No-drop', exact: true }).click();
  await expect(lab.locator('[data-admitted-assignments]')).toHaveAttribute('data-admitted-assignments', '32 / 32');
  await expect(lab.locator('[data-routing-overflow]')).toHaveAttribute('data-routing-overflow', '0 · 0.00%');
  await expect(lab.locator('[data-routing-straggler]')).toHaveAttribute('data-routing-straggler', '2.00x');
});

test('source figures and dense-to-hybrid handoff remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const viewer = page.locator('[data-architecture-figure-viewer]');
  await viewer.getByRole('tab', { name: /Qwen3 235B-A22B/ }).click();
  await expect(viewer.locator('img')).toHaveAttribute('alt', /Qwen3 235B-A22B/);
  await expect.poll(async () => viewer.locator('img').evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(viewer.getByLabel('시각화 전체화면으로 보기')).toBeVisible();

  await expect(page.getByRole('link', { name: 'KV·Long Context' })).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-kv-long-context');
  await expect(page.getByRole('link', { name: 'Dense Transformer' })).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-dense-transformers');
  await expect(page.getByRole('link', { name: 'Hybrid·Linear Attention' }).last()).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-hybrid-linear');
  await expect(page.getByRole('link', { name: 'DeepSeek-AI · DeepSeek-V3 Technical Report' }).last()).toHaveAttribute('target', '_blank');
});
