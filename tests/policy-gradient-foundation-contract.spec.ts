import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`policy-gradient foundation remains calculable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-policy-gradient-actor-critic`, {
      waitUntil: 'networkidle',
    });

    await expect(
      page.getByRole('heading', { name: 'Policy를 직접 학습하면 무엇이 달라질까?' }),
    ).toBeVisible();
    await expect(page.locator('[data-policy-gradient-bandit]')).toBeVisible();
    await expect(page.locator('[data-return-to-go]')).toBeVisible();
    await expect(page.locator('[data-gae-contribution]')).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(11);
    await expect(page.locator('[data-formula-note]')).toHaveCount(11);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);

    const bandit = page.locator('[data-policy-gradient-bandit]');
    await expect(bandit.locator('[data-exact-gradient]')).toHaveText('0.7500');
    await expect(bandit.locator('[data-expected-gradient]')).toHaveText('0.7500');
    await expect(bandit.locator('[data-sample-variance]')).toHaveText('0.0625');

    await bandit.getByRole('button', { name: 'b = b*', exact: true }).click();
    await expect(bandit.locator('[data-exact-gradient]')).toHaveText('0.7500');
    await expect(bandit.locator('[data-expected-gradient]')).toHaveText('0.7500');
    await expect(bandit.locator('[data-sample-variance]')).toHaveText('0.0000');

    await bandit.getByRole('button', { name: 'b = 2', exact: true }).click();
    await expect(bandit.locator('[data-exact-gradient]')).toHaveText('0.7500');
    await expect(bandit.locator('[data-expected-gradient]')).toHaveText('0.7500');
    await expect(bandit.locator('[data-sample-variance]')).toHaveText('0.5625');

    const causal = page.locator('[data-return-to-go]');
    await expect(causal.locator('[data-return-weight="0"]')).toHaveText('3');
    await expect(causal.locator('[data-return-weight="1"]')).toHaveText('2');
    await expect(causal.locator('[data-return-weight="2"]')).toHaveText('4');
    await causal.getByRole('button', { name: '전체 return', exact: true }).click();
    await expect(causal.locator('[data-return-weight="0"]')).toHaveText('3');
    await expect(causal.locator('[data-return-weight="1"]')).toHaveText('3');
    await expect(causal.locator('[data-return-weight="2"]')).toHaveText('3');

    await expect(page.locator('[data-gae-contribution]').getByText('Â₀ 1.368')).toBeVisible();
    await expect(page.locator('[data-gae-contribution]').getByText('Â₀ 1.434')).toBeVisible();

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-policy-gradient-bandit], [data-return-to-go], [data-gae-contribution]',
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
            scale: formula.dataset.mathScale,
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
