import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`model-based RL and world-model contracts remain executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-model-based-world-models`, {
      waitUntil: 'networkidle',
    });

    await expect(
      page.getByRole('heading', {
        name: '상상으로 계획하기: Model-based RL과 World Models',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-dyna-staleness]')).toBeVisible();
    await expect(page.locator('[data-model-bias]')).toBeVisible();
    await expect(page.locator('[data-muzero-target]')).toBeVisible();
    await expect(page.locator('[data-dreamer-return]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(10);
    await expect(page.locator('[data-formula-note]')).toHaveCount(10);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.getByText(/Mixture Density Network RNN\(MDN-RNN, 혼합 밀도 순환 신경망\)/)).toBeVisible();
    await expect(page.getByText(/Monte Carlo Tree Search\(MCTS, 몬테카를로 트리 탐색\)/)).toBeVisible();
    await expect(page.getByText(/Recurrent State-Space Model\(RSSM, 순환 상태공간 모델\)/)).toBeVisible();

    const dyna = page.locator('[data-dyna-staleness]');
    await expect(dyna.locator('[data-dyna-q]')).toHaveText('Q 4.67');
    await dyna.getByRole('button', { name: 'planning updates 50' }).click();
    await expect(dyna.locator('[data-dyna-q]')).toHaveText('Q 5.00');
    await dyna.getByRole('button', { name: 'Model 교정 후', exact: true }).click();
    await expect(dyna.locator('[data-dyna-target]')).toHaveText('0.00');
    await expect(dyna.locator('[data-dyna-q]')).toHaveText('Q 0.00');
    await dyna.getByRole('button', { name: 'planning updates 5', exact: true }).click();
    await expect(dyna.locator('[data-dyna-q]')).toHaveText('Q 1.31');
    await dyna.getByRole('button', { name: '변경 전', exact: true }).click();
    await expect(dyna.locator('[data-dyna-q]')).toHaveText('Q 3.36');

    const bias = page.locator('[data-model-bias]');
    await expect(bias.locator('[data-model-one-step]')).toHaveText('0.020m');
    await expect(bias.getByText(/Δt=1초/)).toBeVisible();
    await expect(bias.locator('[data-model-horizon-error]')).toHaveText('2.88m');
    await expect(bias.locator('[data-model-amplification]')).toHaveText('144x');
    await bias.getByLabel('world model planning horizon').fill('20');
    await expect(bias.locator('[data-model-horizon-error]')).toHaveText('8.00m');
    await expect(bias.locator('[data-model-amplification]')).toHaveText('400x');

    const muzero = page.locator('[data-muzero-target]');
    await expect(muzero.locator('[data-muzero-action]')).toHaveText('RIGHT');
    await expect(muzero.locator('[data-muzero-reward]')).toHaveText('1.0');
    await expect(muzero.locator('[data-muzero-prior]')).toHaveText('[.30, .45, .25]');
    await expect(muzero.locator('[data-muzero-policy]')).toHaveText('[.20, .70, .10]');
    await muzero.getByRole('button', { name: 'MuZero depth 3' }).click();
    await expect(muzero.locator('[data-muzero-action]')).toHaveText('BRAKE');
    await expect(muzero.locator('[data-muzero-reward]')).toHaveText('-0.2');
    await expect(muzero.locator('[data-muzero-prior]')).toHaveText('[.60, .20, .20]');
    await expect(muzero.locator('[data-muzero-value]')).toHaveText('1.10');

    const dreamer = page.locator('[data-dreamer-return]');
    await expect(dreamer.locator('[data-dreamer-r0]')).toHaveText('R0 5.59');
    await expect(dreamer.locator('[data-dreamer-return-step="2"]')).toHaveText('R 5.00');
    await dreamer.getByRole('button', { name: 'Dreamer terminal toggle' }).click();
    await expect(dreamer.locator('[data-dreamer-r0]')).toHaveText('R0 7.17');
    await dreamer.getByRole('button', { name: 'Dreamer lambda 0', exact: true }).click();
    await expect(dreamer.locator('[data-dreamer-r0]')).toHaveText('R0 2.80');

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-dyna-staleness], [data-model-bias], [data-muzero-target], [data-dreamer-return], [data-step-viz]',
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
