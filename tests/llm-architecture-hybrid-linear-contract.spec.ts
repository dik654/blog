import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const route = '/lab/blog/ai/llm-architecture-hybrid-linear';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`Hybrid Linear article keeps formulas, labs and lineage readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-state-memory-lab]')).toHaveCount(1);
    await expect(page.locator('[data-delta-rule-lab]')).toHaveCount(1);
    await expect(page.locator('[data-linear-execution-explorer]')).toHaveCount(1);
    await expect(page.locator('[data-hybrid-core-chapter]')).toHaveCount(5);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('[data-architecture-figure-viewer] [role="tab"]')).toHaveCount(3);
    await expect(page.getByText('CURRENT TARGET · QWEN3.6 + FLASHQLA · 2026-07')).toBeVisible();

    const formulaCount = await page.locator('[data-math-fit]').count();
    expect(formulaCount).toBe(14);
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
    const documentOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(documentOverflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);

    const maxChapterHeight = await page.locator('[data-hybrid-core-chapter]').evaluateAll((elements) => (
      Math.max(...elements.map((element) => element.getBoundingClientRect().height))
    ));
    expect(maxChapterHeight).toBeLessThan(viewport.width < 640 ? 1750 : viewport.width < 1024 ? 1150 : 900);
  });
}

test('state ledger computes 3:1 hybrid persistent memory at 32K and 128K', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-state-memory-lab]');

  await expect(lab.locator('[data-state-layer-bytes]')).toHaveAttribute('data-state-layer-bytes', '0.25 MiB');
  await expect(lab.locator('[data-attention-layer-bytes]')).toHaveAttribute('data-attention-layer-bytes', '128 MiB');
  await expect(lab.locator('[data-hybrid-memory]')).toHaveAttribute('data-hybrid-memory', '1,545 MiB');
  await expect(lab.locator('[data-all-attention-memory]')).toHaveAttribute('data-all-attention-memory', '6,144 MiB');
  await expect(lab.locator('[data-memory-reduction]')).toHaveAttribute('data-memory-reduction', '74.85%');
  await expect(lab.locator('[data-layer-cadence] > *')).toHaveCount(48);
  const cadence = await lab.locator('[data-layer-cadence] > *').allTextContents();
  expect(cadence).toEqual(Array.from({ length: 48 }, (_, index) => ((index + 1) % 4 === 0 ? 'A' : 'S')));
  expect(cadence.filter((layer) => layer === 'S')).toHaveLength(36);
  expect(cadence.filter((layer) => layer === 'A')).toHaveLength(12);

  await lab.getByRole('button', { name: '128K tokens', exact: true }).click();
  await expect(lab.locator('[data-attention-layer-bytes]')).toHaveAttribute('data-attention-layer-bytes', '512 MiB');
  await expect(lab.locator('[data-hybrid-memory]')).toHaveAttribute('data-hybrid-memory', '6,153 MiB');
  await expect(lab.locator('[data-all-attention-memory]')).toHaveAttribute('data-all-attention-memory', '24,576 MiB');
  await expect(lab.locator('[data-memory-reduction]')).toHaveAttribute('data-memory-reduction', '74.96%');
});

test('delta lab separates additive collision, exact overwrite and global decay', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-delta-rule-lab]');

  await expect(lab.locator('[data-read-result]')).toHaveAttribute('data-read-result', '(0,1)');
  await expect(lab.locator('[data-retention]')).toHaveAttribute('data-retention', '10.74%');

  await lab.getByRole('button', { name: '단순 더하기', exact: true }).click();
  await expect(lab.locator('[data-read-result]')).toHaveAttribute('data-read-result', '(1,1)');

  await lab.getByRole('button', { name: 'Delta rule', exact: true }).click();
  await lab.getByRole('button', { name: /01.*v=\(1,0\)/ }).click();
  await expect(lab.locator('[data-read-result]')).toHaveAttribute('data-read-result', '(1,0)');
  await lab.getByRole('button', { name: '20 step', exact: true }).click();
  await expect(lab.locator('[data-retention]')).toHaveAttribute('data-retention', '1.15%');
});

test('execution modes and source handoff remain explicit', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const explorer = page.locator('[data-linear-execution-explorer]');
  await expect(explorer.getByText('Token t의 critical path')).toBeVisible();
  await explorer.getByRole('button', { name: 'Chunkwise 학습', exact: true }).click();
  await expect(explorer.getByText('길이 N을 C-token chunk로 나눈 실행')).toBeVisible();

  const viewer = page.locator('[data-architecture-figure-viewer]');
  await viewer.getByRole('tab', { name: /Kimi Linear 48B-A3B/ }).click();
  await expect(viewer.locator('img')).toHaveAttribute('alt', /Kimi Linear 48B-A3B/);
  await expect.poll(async () => viewer.locator('img').evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

  await expect(page.getByRole('link', { name: 'KV·Long Context' })).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-kv-long-context');
  await expect(page.getByRole('link', { name: 'Sparse MoE', exact: true })).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-sparse-moe');
  await expect(page.getByRole('link', { name: /신호와 시스템의 state·memory 설명/ })).toHaveAttribute('href', '/lab/blog/ai/signals-systems-convolution');
  await expect(page.getByRole('link', { name: /미분방정식과 수치 적분/ })).toHaveAttribute('href', '/lab/blog/ai/differential-equations-phase-plane-numerical-integration');
  await expect(page.getByRole('link', { name: 'Qwen Team · FlashQLA' }).last()).toHaveAttribute('target', '_blank');
});
