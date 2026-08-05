import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = [
  'gradient-boosting',
  'tabular-deep-learning',
  'time-features',
  'sequence-modeling-tabular',
];

for (const target of [
  { slug: 'gradient-boosting', path: '정적 표 · 감사에서 Foundation Model 승격까지', steps: 5, current: 3 },
  { slug: 'tabular-deep-learning', path: '정적 표 · 감사에서 Foundation Model 승격까지', steps: 5, current: 4 },
  { slug: 'time-features', path: '시간축 표 · Point-in-time에서 Event Sequence까지', steps: 4, current: 1 },
  { slug: 'sequence-modeling-tabular', path: '시간축 표 · Point-in-time에서 Event Sequence까지', steps: 4, current: 3 },
]) {
  test(`${target.slug} exposes the prerequisite handoff`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(target.steps);
    await expect(rail.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [390, 768, 1440]) {
  test(`tabular routes remain readable at ${width}px`, async ({ page }) => {
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
      if (formulaScales.length > 0) expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.8);

      await expect(page.locator('[data-formula-pair]')).toHaveCount(await page.locator('[data-formula-note]').count());
      expect(await page.locator('article svg text').count()).toBe(0);
      expect(await page.locator('article').evaluate((article) => {
        const rawLatex = /\\(?:partial|frac|sum|sqrt|operatorname|mathbf|mathbb)\b/;
        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const parent = node.parentElement;
          if (parent && !parent.closest('.katex, pre, code, svg') && rawLatex.test(node.textContent ?? '')) return true;
          node = walker.nextNode();
        }
        return false;
      })).toBe(false);
      expect(errors).toEqual([]);
    }
  });
}

test('boosting labs change residual evidence and comparison candidates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/gradient-boosting`, { waitUntil: 'networkidle' });

  const residual = page.locator('[data-boosting-residual-lab]');
  await residual.getByLabel('부스팅 라운드').fill('3');
  await expect(residual.getByText('0.42', { exact: true })).toBeVisible();
  await expect(residual.getByText('세 번째 stump가 오른쪽 끝의 남은 오차를 줄인다.', { exact: true })).toBeVisible();

  const system = page.locator('[data-tree-system-choice-lab]');
  await system.getByRole('button', { name: '행이 매우 많음', exact: true }).click();
  await expect(system.getByText('LightGBM', { exact: true })).toBeVisible();
  await expect(system.getByText('동일한 wall-clock·메모리 예산에서 histogram 구현을 비교한다.', { exact: true })).toBeVisible();
});

test('neural escalation labs separate tokenization, pretraining and inference', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/tabular-deep-learning`, { waitUntil: 'networkidle' });

  const escalation = page.locator('[data-tabular-escalation-lab]');
  await escalation.getByRole('button', { name: '작은 표', exact: true }).click();
  await expect(escalation.getByText('TabPFN-3 · CatBoost', { exact: true })).toBeVisible();

  const token = page.locator('[data-feature-token-lab]');
  await token.getByRole('button', { name: '범주형', exact: true }).click();
  await expect(token.getByText('장치 = B-17', { exact: true })).toBeVisible();
  await expect(token.getByText(/Unknown category와 vocabulary version/)).toBeVisible();

  const prior = page.locator('[data-prior-dataset-lab]');
  await prior.getByRole('button', { name: '새 표 추론', exact: true }).click();
  await expect(prior.getByText('새 표 query', { exact: true })).toBeVisible();
  await expect(prior.getByText('새 표에서 하는 것', { exact: true })).toBeVisible();
});

test('temporal labs enforce arrival time and half-open windows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/time-features`, { waitUntil: 'networkidle' });

  const cutoff = page.locator('[data-temporal-cutoff-lab]');
  await cutoff.getByLabel('예측 cutoff').fill('3');
  await expect(cutoff.getByText('사용 가능', { exact: true })).toHaveCount(1);
  await expect(cutoff.getByText('제외', { exact: true })).toHaveCount(4);

  const rolling = page.locator('[data-rolling-window-lab]');
  await rolling.getByRole('button', { name: '2칸', exact: true }).click();
  await expect(rolling.getByText('46.0', { exact: true })).toBeVisible();
  await expect(rolling.getByText('46', { exact: true }).first()).toBeVisible();
});

test('sequence labs expose order loss, truncation and padding', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/sequence-modeling-tabular`, { waitUntil: 'networkidle' });

  const order = page.locator('[data-order-loss-lab]');
  await expect(order.getByText('두 history를 구분하지 못함', { exact: true })).toHaveCount(2);
  await order.getByRole('button', { name: '순서 보존', exact: true }).click();
  await expect(order.getByText('재구매 신호', { exact: true })).toBeVisible();
  await expect(order.getByText('이탈·오류 신호', { exact: true })).toBeVisible();

  const input = page.locator('[data-sequence-input-lab]');
  await input.getByRole('button', { name: '3 event', exact: true }).click();
  await input.getByRole('button', { name: '초기 우선', exact: true }).click();
  await expect(input.getByText('로그인', { exact: true })).toBeVisible();
  await expect(input.getByText('초기 event 보존', { exact: true })).toBeVisible();
  await input.getByRole('button', { name: '7 event', exact: true }).click();
  await expect(input.getByText('2 token', { exact: true })).toBeVisible();
  await expect(input.getByText('m=0', { exact: true })).toHaveCount(2);
});
