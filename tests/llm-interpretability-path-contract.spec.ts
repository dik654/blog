import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';
const pathId = 'ai-llm-interpretability-current-first';
const pathLabel = 'LLM 해석 · 관찰에서 인과 회로까지 학습 경로';

test('direct entry exposes the complete current-to-circuit path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/llm-interpretability-frontier`, { waitUntil: 'networkidle' });

  const rail = page.getByLabel(pathLabel);
  await expect(rail).toBeVisible();
  await expect(rail.locator(`[data-learning-path-id="${pathId}"]`)).toHaveCount(6);
  await expect(rail.getByRole('link', { name: '1. 현재 증거 지도', exact: true })).toHaveAttribute('aria-current', 'step');
  await expect(rail.getByRole('link', { name: '2. 인과 검증 문해력', exact: true })).toBeVisible();
  await expect(rail.getByRole('link', { name: '3. Layer Readout', exact: true })).toBeVisible();
  await expect(rail.getByRole('link', { name: '4. 기준 원문 · Transformer Circuits', exact: true })).toBeVisible();
  await expect(rail.getByRole('link', { name: '5. Sparse Feature', exact: true })).toBeVisible();
  await expect(rail.getByRole('link', { name: '6. Causal Circuit', exact: true })).toBeVisible();
});

test('the selected interpretability path survives foundation and source handoffs', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/llm-interpretability-frontier`, { waitUntil: 'networkidle' });

  await page.getByLabel(pathLabel).getByRole('link', { name: '2. 인과 검증 문해력', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/statistics-generalization\\?path=${pathId}$`));
  await expect(page.getByLabel(pathLabel).getByRole('link', { name: '2. 인과 검증 문해력', exact: true })).toHaveAttribute('aria-current', 'step');

  await page.getByLabel(pathLabel).getByRole('link', { name: '3. Layer Readout', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/llm-interpretability-readouts\\?path=${pathId}$`));
  await expect(page.getByLabel(pathLabel).getByRole('link', { name: '3. Layer Readout', exact: true })).toHaveAttribute('aria-current', 'step');

  await page.goto(`${base}/lab/blog/ai/paper-transformer-circuits-2021`, { waitUntil: 'networkidle' });
  await expect(page.getByLabel(pathLabel).getByRole('link', { name: '4. 기준 원문 · Transformer Circuits', exact: true })).toHaveAttribute('aria-current', 'step');
});
