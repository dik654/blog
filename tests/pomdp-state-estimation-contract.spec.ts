import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`POMDP state-estimation contracts remain calculable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-pomdp-state-estimation`, {
      waitUntil: 'networkidle',
    });

    await expect(
      page.getByRole('heading', {
        name: '부분 관측 실행 계약: POMDP·Belief·State Estimation',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-belief-filter]')).toBeVisible();
    await expect(page.locator('[data-active-sensing]')).toBeVisible();
    await expect(page.locator('[data-kalman-trust]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(12);
    await expect(page.locator('[data-formula-note]')).toHaveCount(12);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.getByText('Normalized Innovation Squared(NIS, 정규화 혁신 제곱)')).toBeVisible();
    await expect(page.getByText(/Extended Kalman Filter\(EKF, 확장 칼만 필터\)/)).toBeVisible();
    await expect(page.getByText(/Recurrent State-Space Model\(RSSM\)/)).toBeVisible();

    const belief = page.locator('[data-belief-filter]');
    await expect(belief.locator('[data-belief-predicted]')).toHaveText('0.500');
    await expect(belief.locator('[data-belief-evidence]')).toHaveText('0.500');
    await expect(belief.getByText('정규화 상수 Zₜ₊₁ = P(oₜ₊₁ | bₜ,aₜ)')).toBeVisible();
    await expect(belief.locator('[data-belief-posterior]')).toHaveText('P(blocked) 85.0%');
    await belief.getByLabel('Belief prior blocked').fill('0.7');
    await expect(belief.locator('[data-belief-predicted]')).toHaveText('0.660');
    await expect(belief.locator('[data-belief-evidence]')).toHaveText('0.612');
    await expect(belief.locator('[data-belief-posterior]')).toHaveText('P(blocked) 91.7%');
    await belief.getByRole('button', { name: '이동 · slip 전이', exact: true }).click();
    await expect(belief.locator('[data-belief-predicted]')).toHaveText('0.560');
    await expect(belief.locator('[data-belief-evidence]')).toHaveText('0.542');
    await expect(belief.locator('[data-belief-posterior]')).toHaveText('P(blocked) 87.8%');
    await belief.getByRole('button', { name: '비어 있음 관측', exact: true }).click();
    await expect(belief.locator('[data-belief-evidence]')).toHaveText('0.458');
    await expect(belief.locator('[data-belief-posterior]')).toHaveText('P(blocked) 18.3%');

    const sensing = page.locator('[data-active-sensing]');
    await expect(sensing.locator('[data-act-now-value]')).toHaveText('-2.00');
    await expect(sensing.locator('[data-probe-value]')).toHaveText('1.70');
    await expect(sensing.locator('[data-sensing-choice]')).toHaveText('PROBE FIRST');
    await sensing.getByRole('button', { name: 'p(left) 90%', exact: true }).click();
    await expect(sensing.locator('[data-act-now-value]')).toHaveText('2.80');
    await expect(sensing.locator('[data-probe-value]')).toHaveText('2.30');
    await expect(sensing.locator('[data-sensing-choice]')).toHaveText('ACT NOW');

    const kalman = page.locator('[data-kalman-trust]');
    await expect(kalman.locator('[data-kalman-predicted-variance]')).toHaveText('2.00');
    await expect(kalman.locator('[data-kalman-gain]')).toHaveText('K 0.667');
    await expect(kalman.locator('[data-kalman-posterior]')).toHaveText('5.33');
    await expect(kalman.locator('[data-kalman-posterior-variance]')).toHaveText('0.67');
    await kalman.getByLabel('Kalman sensor variance R').fill('4');
    await expect(kalman.locator('[data-kalman-gain]')).toHaveText('K 0.333');
    await expect(kalman.locator('[data-kalman-posterior]')).toHaveText('4.67');
    await expect(kalman.locator('[data-kalman-posterior-variance]')).toHaveText('1.33');

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-belief-filter], [data-active-sensing], [data-kalman-trust], [data-step-viz]',
        ),
      );
      return {
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
        formulaMetrics: formulas.map((formula) => {
          const rendered =
            formula.querySelector<HTMLElement>('.katex-display') ??
            (formula.firstElementChild as HTMLElement);
          return {
            fontSize: Number.parseFloat(getComputedStyle(rendered).fontSize),
            overflow: formula.scrollWidth - formula.clientWidth,
          };
        }),
        vizOverflow: visualizations.map(
          (visualization) => visualization.scrollWidth - visualization.clientWidth,
        ),
      };
    });

    expect(layout.documentOverflow).toBeLessThanOrEqual(1);
    expect(Math.min(...layout.formulaMetrics.map((metric) => metric.fontSize))).toBeGreaterThanOrEqual(12);
    expect(Math.max(...layout.formulaMetrics.map((metric) => metric.overflow))).toBeLessThanOrEqual(1);
    expect(Math.max(...layout.vizOverflow)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
