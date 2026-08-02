import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`J-space evidence remains readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/llm-interpretability-frontier`, {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);

    await expect(
      page.getByRole('heading', { name: '모델 내부를 읽으면 실제 생각을 본 것일까?' }),
    ).toBeVisible();
    await expect(page.locator('[data-evidence-ladder]')).toBeVisible();
    await expect(page.locator('[data-jacobian-pipeline]')).toBeVisible();
    await expect(page.locator('[data-jspace-decomposition]')).toBeVisible();
    await expect(page.locator('[data-jspace-evidence]')).toBeVisible();
    await expect(page.locator('[data-layer-regime]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(4);
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('[data-math-annotation-missing]')).toHaveCount(0);
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('#bounded-route a[href$="/statistics-generalization"]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: /Natural Language Autoencoders/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Weight-Sparse Transformers/ })).toBeVisible();
    await expect(page.locator('#jacobian-lens')).toContainText('penultimate residual');
    await expect(page.locator('#j-space')).toContainText('전역적으로 가장 가까운 해나 유일한 해를 보장');

    const layout = await page.evaluate(() => {
      const article = document.querySelector<HTMLElement>('article');
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-evidence-ladder], [data-jacobian-pipeline], [data-jspace-decomposition], [data-jspace-evidence], [data-layer-regime]',
        ),
      );
      const visible = article?.cloneNode(true) as HTMLElement | undefined;
      visible?.querySelectorAll('.katex-mathml, code, pre, script, style').forEach((node) => node.remove());

      return {
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
        articleOverflow: article ? article.scrollWidth - article.clientWidth : 999,
        rawLatex: /\\(?:theta|tau|frac|sum|prod|partial|underbrace|operatorname|mathbb|mathcal)\b/.test(
          visible?.innerText ?? '',
        ),
        formulaMetrics: formulas.map((formula) => {
          const rendered =
            formula.querySelector<HTMLElement>('.katex-display') ??
            (formula.firstElementChild as HTMLElement);
          return {
            fontSize: Number.parseFloat(getComputedStyle(rendered).fontSize),
            overflow: formula.scrollWidth - formula.clientWidth,
            scale: Number(formula.dataset.mathScale ?? '1'),
          };
        }),
        vizOverflow: visualizations.map(
          (visualization) => visualization.scrollWidth - visualization.clientWidth,
        ),
      };
    });

    expect(layout.documentOverflow).toBeLessThanOrEqual(1);
    expect(layout.articleOverflow).toBeLessThanOrEqual(1);
    expect(layout.rawLatex).toBe(false);
    expect(Math.max(...layout.formulaMetrics.map((metric) => metric.overflow))).toBeLessThanOrEqual(1);
    expect(Math.min(...layout.formulaMetrics.map((metric) => metric.fontSize))).toBeGreaterThanOrEqual(12);
    expect(Math.min(...layout.formulaMetrics.map((metric) => metric.scale))).toBeGreaterThanOrEqual(0.68);
    expect(Math.max(...layout.vizOverflow)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('J-space labs expose causal comparisons instead of static decoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/llm-interpretability-frontier`, {
    waitUntil: 'networkidle',
  });

  const evidence = page.locator('[data-evidence-ladder]');
  await evidence.getByRole('button', { name: /Activation patch/ }).click();
  await expect(evidence).toHaveAttribute('data-selected-method', 'patching');
  await expect(evidence).toContainText('선택한 내부 상태를 바꾸자 target behavior가 변했다.');

  const decomposition = page.locator('[data-jspace-decomposition]');
  const coverageBefore = await decomposition.locator('[data-jspace-coverage]').textContent();
  const ambiguityBefore = await decomposition.locator('[data-jspace-ambiguity]').textContent();
  await decomposition.getByLabel('최대 direction 수 k').fill('4');
  await expect(decomposition.locator('[data-jspace-coverage]')).not.toHaveText(coverageBefore ?? '');
  await expect(decomposition.locator('[data-jspace-ambiguity]')).not.toHaveText(ambiguityBefore ?? '');

  const jspace = page.locator('[data-jspace-evidence]');
  await jspace.getByRole('button', { name: /여러 계산에 재사용/ }).click();
  await expect(jspace).toHaveAttribute('data-selected-experiment', 'broadcast');
  await expect(jspace).toContainText('France→China');
  await expect(jspace).toContainText('Beijing·Chinese·Asia');

  const layer = page.locator('[data-layer-regime]');
  await layer.getByLabel('상대 layer 깊이').fill('95');
  await expect(layer).toHaveAttribute('data-current-regime', 'late');
  await expect(layer).toContainText('Late · motor');
  await layer.getByLabel('상대 layer 깊이').fill('10');
  await expect(layer).toHaveAttribute('data-current-regime', 'early');
  await expect(layer).toContainText('Early · sensory');
});
