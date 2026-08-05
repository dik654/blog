import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`safe and constrained RL contracts remain executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-safe-constrained-learning`, {
      waitUntil: 'networkidle',
    });

    await expect(page.getByRole('heading', { name: '위험을 예산으로 다루기: Safe & Constrained RL' })).toBeVisible();
    await expect(page.locator('[data-safety-budget]')).toBeVisible();
    await expect(page.locator('[data-dual-pressure]')).toBeVisible();
    await expect(page.locator('[data-cpo-step]')).toBeVisible();
    await expect(page.locator('[data-lyapunov-slack]')).toBeVisible();
    await expect(page.locator('[data-recovery-timing]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(10);
    await expect(page.locator('[data-formula-note]')).toHaveCount(10);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);

    const budget = page.locator('[data-safety-budget]');
    await expect(budget.locator('[data-safety-expected]')).toHaveText('1.00');
    await expect(budget.locator('[data-safety-any]')).toHaveText('63.4%');
    await expect(budget.locator('[data-safety-margin]')).toHaveText('0.00');
    await budget.getByLabel('Safety step violation probability').fill('0.002');
    await expect(budget.locator('[data-safety-expected]')).toHaveText('0.20');
    await expect(budget.locator('[data-safety-any]')).toHaveText('18.1%');
    await expect(budget.locator('[data-safety-margin]')).toHaveText('0.80');
    await budget.getByLabel('Safety expected cost budget').fill('0.1');
    await expect(budget.locator('[data-safety-budget-status]')).toHaveText('OVER BUDGET');

    const dual = page.locator('[data-dual-pressure]');
    await expect(dual.locator('[data-dual-selected]')).toHaveText('고속 통과');
    await dual.getByLabel('Constraint multiplier lambda').fill('20');
    await expect(dual.locator('[data-dual-selected]')).toHaveText('감속 통과');
    await dual.getByLabel('Constraint multiplier lambda').fill('150');
    await expect(dual.locator('[data-dual-selected]')).toHaveText('정지·재계획');

    const cpo = page.locator('[data-cpo-step]');
    await expect(cpo.locator('[data-cpo-trust]')).toHaveText('±0.400');
    await expect(cpo.locator('[data-cpo-safety]')).toHaveText('-0.067');
    await expect(cpo.locator('[data-cpo-selected]')).toHaveText('-0.067');
    await expect(cpo.locator('[data-cpo-gap]')).toHaveText('0.000');
    await cpo.getByRole('button', { name: 'CPO delta 0.001', exact: true }).click();
    await expect(cpo.locator('[data-cpo-status]')).toHaveText('LOCAL INFEASIBLE');
    await expect(cpo.locator('[data-cpo-selected]')).toHaveText('없음');
    await cpo.getByRole('button', { name: 'CPO delta 0.08', exact: true }).click();
    await cpo.getByRole('button', { name: /예산 안쪽/ }).click();
    await expect(cpo.locator('[data-cpo-selected]')).toHaveText('0.167');
    await expect(cpo.locator('[data-cpo-status]')).toHaveText('REWARD STEP');

    const lyapunov = page.locator('[data-lyapunov-slack]');
    await expect(lyapunov.locator('[data-lyapunov-backup]')).toHaveText('1.165');
    await expect(lyapunov.locator('[data-lyapunov-slack-value]')).toHaveText('+0.035');
    await lyapunov.getByLabel('Lyapunov fast probability').fill('0.6');
    await expect(lyapunov.locator('[data-lyapunov-backup]')).toHaveText('1.228');
    await expect(lyapunov.locator('[data-lyapunov-slack-value]')).toHaveText('-0.028');
    await expect(lyapunov.locator('[data-lyapunov-status]')).toHaveText('LOCAL VIOLATION');

    const recovery = page.locator('[data-recovery-timing]');
    await expect(recovery.locator('[data-recovery-gate]')).toHaveText('RECOVERY');
    await expect(recovery.locator('[data-recovery-required]')).toHaveText('500ms');
    await expect(recovery.locator('[data-recovery-margin]')).toHaveText('-200ms');
    await expect(recovery.locator('[data-recovery-outcome]')).toHaveText('TOO LATE');
    await recovery.getByLabel('Recovery time to collision').fill('700');
    await expect(recovery.locator('[data-recovery-margin]')).toHaveText('+200ms');
    await expect(recovery.locator('[data-recovery-outcome]')).toHaveText('RECOVERABLE');
    await recovery.getByLabel('Recovery predicted risk').fill('0.18');
    await expect(recovery.locator('[data-recovery-gate]')).toHaveText('TASK ACTION');
    await expect(recovery.locator('[data-recovery-outcome]')).toHaveText('RISK MISSED');

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-safety-budget], [data-dual-pressure], [data-cpo-step], [data-lyapunov-slack], [data-recovery-timing], [data-step-viz]',
        ),
      );
      return {
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
        formulaMetrics: formulas.map((formula) => {
          const rendered = formula.querySelector<HTMLElement>('.katex-display') ?? (formula.firstElementChild as HTMLElement);
          return {
            fontSize: Number.parseFloat(getComputedStyle(rendered).fontSize),
            overflow: formula.scrollWidth - formula.clientWidth,
          };
        }),
        vizOverflow: visualizations.map((visualization) => visualization.scrollWidth - visualization.clientWidth),
      };
    });

    expect(layout.documentOverflow).toBeLessThanOrEqual(1);
    expect(Math.min(...layout.formulaMetrics.map((metric) => metric.fontSize))).toBeGreaterThanOrEqual(12);
    expect(Math.max(...layout.formulaMetrics.map((metric) => metric.overflow))).toBeLessThanOrEqual(1);
    expect(Math.max(...layout.vizOverflow)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
