import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`MDP and Bellman contracts stay calculable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-mdp-bellman`, {
      waitUntil: 'networkidle',
    });

    await expect(
      page.getByRole('heading', {
        name: '강화학습은 왜 정답표가 없는 supervised learning이 아닐까?',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-markov-state]')).toBeVisible();
    await expect(page.locator('[data-return-explorer]')).toBeVisible();
    await expect(page.locator('[data-value-conditioning]')).toBeVisible();
    await expect(page.locator('[data-bellman-explorer]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(9);
    await expect(page.locator('[data-formula-note]')).toHaveCount(6);
    await expect(page.getByText('terminal에서 끝나는 유한 episode의 return을 직접 합산한다')).toBeVisible();
    await expect(
      page.locator('[data-math-fit] mtext').filter({
        hasText: '시간 제한: 과정이 계속될 수 있어 bootstrap 유지',
      }),
    ).toBeVisible();
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);

    const markov = page.locator('[data-markov-state]');
    await expect(markov.locator('[data-markov-verdict]')).toHaveText('STATE 부족');
    await expect(markov.locator('[data-markov-explanation]')).toContainText(
      '다음 위치는 +1과 -1로 갈린다',
    );
    await markov.getByRole('button', { name: '위치 + 속도', exact: true }).click();
    await expect(markov.locator('[data-markov-verdict]')).toHaveText('MARKOV PASS');
    await expect(markov.locator('[data-markov-explanation]')).toContainText(
      '서로 다른 state key로 분리된다',
    );

    const returnLab = page.locator('[data-return-explorer]');
    await expect(returnLab.locator('[data-return-total]')).toHaveText('G0 = 3.452');
    await returnLab.getByLabel('Return start step').fill('2');
    await expect(returnLab.locator('[data-return-total]')).toHaveText('G2 = 3.150');
    await returnLab.getByLabel('Discount gamma').fill('0');
    await expect(returnLab.locator('[data-return-total]')).toHaveText('G2 = 0.000');

    const value = page.locator('[data-value-conditioning]');
    await expect(value.locator('[data-policy-value]')).toHaveText('Vπ = 1.783');
    await expect(value.locator('[data-safe-advantage]')).toHaveText('A = 1.018');
    await expect(value.locator('[data-risk-advantage]')).toHaveText('A = -1.018');
    await expect(value.locator('[data-weighted-advantage]')).toHaveText('Eπ[A] = 0.000');
    await value.getByRole('button', { name: 'πsafe 75%', exact: true }).click();
    await expect(value.locator('[data-policy-value]')).toHaveText('Vπ = 2.291');
    await expect(value.locator('[data-safe-advantage]')).toHaveText('A = 0.509');
    await expect(value.locator('[data-risk-advantage]')).toHaveText('A = -1.526');
    await expect(value.locator('[data-weighted-advantage]')).toHaveText('Eπ[A] = 0.000');

    const bellman = page.locator('[data-bellman-explorer]');
    await expect(bellman.locator('[data-safe-backup]')).toHaveText('2.80');
    await expect(bellman.locator('[data-risk-backup]')).toHaveText('0.77');
    await expect(bellman.locator('[data-bellman-expectation]')).toHaveText('1.78');
    await expect(bellman.locator('[data-bellman-optimal]')).toHaveText('2.80');
    await bellman.getByLabel('Risk success probability').fill('0.65');
    await expect(bellman.locator('[data-risk-backup]')).toHaveText('3.14');
    await expect(bellman.locator('[data-bellman-expectation]')).toHaveText('2.97');
    await expect(bellman.locator('[data-bellman-optimal]')).toHaveText('3.14');

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-markov-state], [data-return-explorer], [data-value-conditioning], [data-bellman-explorer], [data-step-viz]',
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
