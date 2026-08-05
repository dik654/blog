import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = ['eda-workflow', 'feature-engineering', 'data-augmentation', 'imbalanced-data'];

for (const target of [
  { slug: 'eda-workflow', path: '실전 ML · 데이터 감사의 공통 뿌리', steps: 1, current: 0 },
  { slug: 'feature-engineering', path: '실전 ML · 감사에서 Point-in-time 피처로', steps: 2, current: 1 },
  { slug: 'data-augmentation', path: '실전 ML · 감사에서 증강 계약으로', steps: 2, current: 1 },
  { slug: 'imbalanced-data', path: '실전 ML · 감사에서 희귀 사건 정책으로', steps: 3, current: 2 },
]) {
  test(`${target.slug} exposes its audit-root handoff`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(target.steps);
    await expect(rail.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [390, 768, 1440]) {
  test(`practical data branch is readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });

    for (const slug of slugs) {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

      const formulaScales = await page.locator('[data-math-fit]').evaluateAll((items) => (
        items.map((item) => Number((item as HTMLElement).dataset.mathScale ?? '1'))
      ));
      if (formulaScales.length > 0) {
        expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.68);
      }
      await expect(page.locator('[data-formula-pair]')).toHaveCount(await page.locator('[data-formula-note]').count());
      expect(errors).toEqual([]);
    }
  });
}

test('data audit labs change evidence rather than only color', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/eda-workflow`, { waitUntil: 'networkidle' });

  const contract = page.locator('[data-data-contract-lab]');
  await contract.getByRole('button', { name: '미래 운영', exact: true }).click();
  await expect(contract.getByText('시간 순 forward validation', { exact: true })).toBeVisible();

  const missing = page.locator('[data-missingness-shift-lab]');
  await missing.getByRole('button', { name: '고장 직전 집중', exact: true }).click();
  await expect(missing.getByText('68% missing', { exact: true })).toBeVisible();
  await expect(missing.getByText('사건이 가까워질수록 결측률이 증가한다.', { exact: true })).toBeVisible();
});

test('feature cutoff changes availability verdicts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/feature-engineering`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-feature-cutoff-lab]');
  await lab.getByLabel('예측 시점').fill('7');
  await expect(lab.getByText('평가용 label', { exact: true })).toBeVisible();
  await expect(lab.getByText('fold train에서 다시 계산', { exact: true })).toHaveCount(1);
});

test('augmentation contract updates the target responsibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/data-augmentation`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-augmentation-contract-lab]');
  await lab.getByRole('button', { name: '문자 인식', exact: true }).click();
  await lab.getByRole('button', { name: '좌우 반전', exact: true }).click();
  await expect(lab.getByText('변환 거부', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '결함 위치 탐지', exact: true }).click();
  await expect(lab.getByText('Target 동기화', { exact: true })).toBeVisible();
});

test('rare-event labs separate resampling and policy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/imbalanced-data`, { waitUntil: 'networkidle' });

  const boundary = page.locator('[data-resampling-boundary-lab]');
  await expect(boundary.getByText('운영 분포 아님', { exact: true })).toBeVisible();
  await boundary.getByRole('button', { name: 'Fold train 안에서 적용', exact: true }).click();
  await expect(boundary.getByText('자연 양성률 1%', { exact: true })).toBeVisible();

  const decision = page.locator('[data-rare-event-decision-lab]');
  await decision.getByLabel('하루 검토 용량').fill('200');
  await expect(decision.getByText('AP + Recall@200', { exact: true })).toBeVisible();
});
