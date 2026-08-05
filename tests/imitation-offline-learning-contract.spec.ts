import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`imitation and offline-learning contracts remain executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-imitation-offline-learning`, {
      waitUntil: 'networkidle',
    });

    await expect(
      page.getByRole('heading', {
        name: 'Demonstration에서 학습하기: 모방 학습과 Offline RL',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-compounding-error]')).toBeVisible();
    await expect(page.locator('[data-cql-gradient]')).toBeVisible();
    await expect(page.locator('[data-ope-lab]')).toBeVisible();
    await expect(page.locator('[data-offline-choice-contract]')).toContainText('Expert query');
    await expect(page.locator('[data-offline-choice-contract]')).toContainText('Environment query');
    await expect(page.locator('[data-offline-choice-contract]')).toContainText('Coverage');
    await expect(page.locator('[data-offline-choice-contract]')).toContainText('Evaluation');
    await expect(page.locator('[data-offline-choice-contract]')).toContainText('Stop gate');
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(12);
    await expect(page.locator('[data-formula-note]')).toHaveCount(12);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);

    const compounding = page.locator('[data-compounding-error]');
    await expect(compounding.locator('[data-any-error-value]')).toHaveText('86.7%');
    await expect(compounding.locator('[data-expected-errors]')).toHaveText('2.00');
    await compounding.getByLabel('Imitation horizon').fill('150');
    await compounding.getByLabel('Imitation one-step error').fill('0.01');
    await expect(compounding.locator('[data-any-error-value]')).toHaveText('77.9%');
    await expect(compounding.locator('[data-expected-errors]')).toHaveText('1.50');

    const cql = page.locator('[data-cql-gradient]');
    await expect(cql.locator('[data-cql-regularizer]')).toHaveText('R(Q) 3.518');
    const lane = cql.locator('[data-cql-action="차선 유지"]');
    const brake = cql.locator('[data-cql-action="감속"]');
    const shortcut = cql.locator('[data-cql-action="급한 지름길"]');
    await expect(lane.locator('[data-cql-gradient-value]')).toHaveText('-0.684');
    await expect(brake.locator('[data-cql-gradient-value]')).toHaveText('-0.246');
    await expect(shortcut.locator('[data-cql-gradient-value]')).toHaveText('0.930');
    await expect(lane.locator('[data-cql-updated]')).toHaveText('3.51');
    await expect(brake.locator('[data-cql-updated]')).toHaveText('3.75');
    await expect(shortcut.locator('[data-cql-updated]')).toHaveText('6.14');
    await cql.getByRole('button', { name: 'α 0.0', exact: true }).click();
    await expect(lane.locator('[data-cql-updated]')).toHaveText('3.10');
    await expect(shortcut.locator('[data-cql-updated]')).toHaveText('6.70');
    await cql.getByRole('button', { name: 'α 2.4', exact: true }).click();
    await expect(lane.locator('[data-cql-updated]')).toHaveText('3.92');
    await expect(brake.locator('[data-cql-updated]')).toHaveText('3.90');
    await expect(shortcut.locator('[data-cql-updated]')).toHaveText('5.58');

    const ope = page.locator('[data-ope-lab]');
    await expect(ope.locator('[data-ope-status]')).toHaveText('평가 가능');
    await expect(ope.locator('[data-ope-is]')).toHaveText('10.67');
    await expect(ope.locator('[data-ope-wis]')).toHaveText('9.14');
    await expect(ope.locator('[data-ope-ess]')).toHaveText('2.58 / 3');
    await ope.getByRole('button', { name: 'Target-only 행동', exact: true }).click();
    await expect(ope.locator('[data-ope-status]')).toHaveText('식별 불가');
    await expect(ope.getByText('지원 조건 위반', { exact: true })).toBeVisible();

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-compounding-error], [data-cql-gradient], [data-ope-lab], [data-step-viz]',
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
