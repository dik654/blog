import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const route = '/lab/blog/ai/llm-architecture-kv-long-context';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`KV and long-context article keeps formulas, labs and lineage readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-kv-layout-lab]')).toHaveCount(1);
    await expect(page.locator('[data-long-context-lab]')).toHaveCount(1);
    await expect(page.locator('[data-kv-core-chapter]')).toHaveCount(4);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('[data-architecture-figure-viewer] [role="tab"]')).toHaveCount(3);
    await expect(page.getByText('CURRENT TARGET · 2026-06까지 공개된 구조')).toBeVisible();

    const formulaCount = await page.locator('[data-math-fit]').count();
    expect(formulaCount).toBe(11);
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

    const maxChapterHeight = await page.locator('[data-kv-core-chapter]').evaluateAll((elements) => (
      Math.max(...elements.map((element) => element.getBoundingClientRect().height))
    ));
    expect(maxChapterHeight).toBeLessThan(viewport.width < 640 ? 1450 : viewport.width < 1024 ? 1100 : 900);
  });
}

test('cache layout lab separates head sharing from latent storage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-kv-layout-lab]');

  await expect(lab.locator('[data-kv-layout-total]')).toHaveAttribute('data-kv-layout-total', '4.22 GiB');
  await expect(lab.locator('[data-kv-layout-saving]')).toHaveAttribute('data-kv-layout-saving', '98.24%');
  await expect(lab).toContainText('latent 512 + RoPE 64');

  await lab.getByRole('button', { name: 'GQA', exact: true }).first().click();
  await expect(lab.locator('[data-kv-layout-total]')).toHaveAttribute('data-kv-layout-total', '15.00 GiB');
  await expect(lab.locator('[data-kv-layout-saving]')).toHaveAttribute('data-kv-layout-saving', '93.75%');
  await expect(lab).toContainText('Q 16개씩 공동 조회');

  await lab.getByRole('button', { name: 'MHA', exact: true }).first().click();
  await expect(lab.locator('[data-kv-layout-total]')).toHaveAttribute('data-kv-layout-total', '240.00 GiB');
  await expect(lab.locator('[data-kv-layout-saving]')).toHaveAttribute('data-kv-layout-saving', '0.00%');

  await lab.getByRole('button', { name: 'MLA', exact: true }).first().click();
  await lab.getByLabel('KV cache batch size').fill('1');
  await expect(lab.locator('[data-kv-layout-total]')).toHaveAttribute('data-kv-layout-total', '2.11 GiB');
  await lab.getByRole('button', { name: '128K' }).click();
  await expect(lab.locator('[data-kv-layout-total]')).toHaveAttribute('data-kv-layout-total', '8.44 GiB');
});

test('local and global lab calculates memory, prefill, decode and visibility separately', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-long-context-lab]');

  await expect(lab.locator('[data-full-kv]')).toHaveAttribute('data-full-kv', '31.00 GiB');
  await expect(lab.locator('[data-mixed-kv]')).toHaveAttribute('data-mixed-kv', '5.81 GiB');
  await expect(lab.locator('[data-mixed-kv-saving]')).toHaveAttribute('data-mixed-kv-saving', '81.25%');
  await expect(lab.locator('[data-prefill-saving]')).toHaveAttribute('data-prefill-saving', '78.71%');
  await expect(lab.locator('[data-decode-read-positions]')).toHaveAttribute('data-decode-read-positions', '2031616:380928');
  await expect(lab.locator('[data-direct-visible]')).toHaveAttribute('data-direct-visible', '4 / 24');
  await expect(lab.locator('[data-reachable-visible]')).toHaveAttribute('data-reachable-visible', '24 / 24');

  await lab.getByLabel('Visibility layer depth').fill('4');
  await expect(lab.locator('[data-reachable-visible]')).toHaveAttribute('data-reachable-visible', '13 / 24');
  await lab.getByLabel('Visibility layer depth').fill('6');
  await expect(lab.locator('[data-direct-visible]')).toHaveAttribute('data-direct-visible', '24 / 24');
  await lab.getByLabel('Visibility layer depth').fill('7');
  await expect(lab.locator('[data-direct-visible]')).toHaveAttribute('data-direct-visible', '4 / 24');

  await lab.getByRole('button', { name: '128K' }).click();
  await lab.getByRole('button', { name: '4K' }).click();
  await expect(lab.locator('[data-mixed-kv]')).toHaveAttribute('data-mixed-kv', '23.25 GiB');
});

test('source figures and learning handoff remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const viewer = page.locator('[data-architecture-figure-viewer]');
  await viewer.getByRole('tab', { name: /DeepSeek V4 Pro/ }).click();
  await expect(viewer.locator('img')).toHaveAttribute('alt', /DeepSeek V4 Pro/);
  await expect.poll(async () => viewer.locator('img').evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(viewer.getByLabel('시각화 전체화면으로 보기')).toBeVisible();

  await expect(page.getByRole('link', { name: 'Dense Transformer' }).first()).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-dense-transformers');
  await expect(page.getByRole('link', { name: 'Sparse MoE', exact: true })).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-sparse-moe');
  await expect(page.getByRole('link', { name: 'DeepSeek-AI · DeepSeek-V2' }).last()).toHaveAttribute('target', '_blank');
});
