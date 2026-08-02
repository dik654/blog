import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`TD and DQN targets stay calculable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-temporal-difference-dqn`, {
      waitUntil: 'networkidle',
    });

    await expect(
      page.getByRole('heading', { name: 'Value를 학습할 정답은 어디에서 오는가?' }),
    ).toBeVisible();
    await expect(page.locator('[data-lambda-return]')).toBeVisible();
    await expect(page.locator('[data-control-target]')).toBeVisible();
    await expect(page.locator('[data-dqn-backup]')).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(8);
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);

    const lambda = page.locator('[data-lambda-return]');
    await expect(lambda.locator('[data-lambda-target]')).toHaveText('Gλ = 5.568');
    await lambda.getByRole('button', { name: 'λ 0', exact: true }).click();
    await expect(lambda.locator('[data-lambda-target]')).toHaveText('Gλ = 5.500');
    await lambda.getByRole('button', { name: 'λ 1', exact: true }).click();
    await expect(lambda.locator('[data-lambda-target]')).toHaveText('Gλ = 6.040');

    const control = page.locator('[data-control-target]');
    await expect(control.locator('[data-sarsa-target]')).toHaveText('2.80');
    await expect(control.locator('[data-q-target]')).toHaveText('6.40');
    await expect(control.locator('[data-boundary-mask]')).toHaveText('1');
    await control.getByRole('button', { name: '진짜 종료', exact: true }).click();
    await expect(control.locator('[data-sarsa-target]')).toHaveText('1.00');
    await expect(control.locator('[data-q-target]')).toHaveText('1.00');
    await expect(control.locator('[data-boundary-mask]')).toHaveText('0');
    await control.getByRole('button', { name: '시간 제한', exact: true }).click();
    await expect(control.locator('[data-sarsa-target]')).toHaveText('2.80');
    await expect(control.locator('[data-q-target]')).toHaveText('6.40');
    await expect(control.locator('[data-boundary-mask]')).toHaveText('1');

    const backup = page.locator('[data-dqn-backup]');
    await expect(backup.locator('[data-selected-action]')).toHaveText('a0');
    await expect(backup.locator('[data-dqn-target]')).toHaveText('Y = 2.89');
    await expect(backup.locator('[data-dqn-residual]')).toHaveText('δ = 1.49');
    await expect(backup.locator('[data-dqn-loss]')).toHaveText('δ² = 2.2201');
    await backup.getByRole('button', { name: 'Double DQN', exact: true }).click();
    await expect(backup.locator('[data-selected-action]')).toHaveText('a1');
    await expect(backup.locator('[data-dqn-target]')).toHaveText('Y = 2.44');
    await expect(backup.locator('[data-dqn-residual]')).toHaveText('δ = 1.04');
    await expect(backup.locator('[data-dqn-loss]')).toHaveText('δ² = 1.0816');
    await backup.getByRole('checkbox', { name: '이 transition은 진짜 terminal' }).check();
    await expect(backup.locator('[data-dqn-target]')).toHaveText('Y = 1.00');
    await expect(backup.locator('[data-dqn-residual]')).toHaveText('δ = -0.40');
    await expect(backup.locator('[data-dqn-loss]')).toHaveText('δ² = 0.1600');

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-lambda-return], [data-control-target], [data-dqn-backup], [data-step-viz]',
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
