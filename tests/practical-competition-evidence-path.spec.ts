import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';
const articles = [
  { slug: 'competition-workflow', lab: '[data-competition-contract-lab]' },
  { slug: 'evaluation-metrics', lab: '[data-metric-decision-lab]' },
  { slug: 'cross-validation', lab: '[data-split-contract-lab]' },
  { slug: 'experiment-tracking', lab: '[data-evidence-ledger-lab]' },
  { slug: 'hyperparameter-tuning', lab: '[data-search-gate-lab]' },
  { slug: 'ensemble-methods', lab: '[data-ensemble-gate-lab]' },
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of articles) {
    test(`${article.slug} keeps the evidence contract at ${viewport.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));

      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('article')).toBeVisible();
      await expect(page.locator(article.lab)).toBeVisible();

      const audit = await page.evaluate((labSelector) => {
        const articleNode = document.querySelector<HTMLElement>('article');
        const lab = document.querySelector<HTMLElement>(labSelector);
        const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
        const visible = articleNode?.cloneNode(true) as HTMLElement | undefined;
        visible?.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          articleOverflow: articleNode ? articleNode.scrollWidth - articleNode.clientWidth : 999,
          labOverflow: lab ? lab.scrollWidth - lab.clientWidth : 999,
          formulaOverflow: formulas.map((node) => {
            const rendered = node.firstElementChild as HTMLElement | null;
            return rendered ? rendered.getBoundingClientRect().width - node.clientWidth : 999;
          }),
          formulaScales: formulas.map((node) => Number(node.dataset.mathScale ?? 1)),
          unpaired: formulas.filter((node) => {
            const pair = node.closest('[data-formula-pair]');
            return !pair || !pair.querySelector('[data-formula-note]');
          }).length,
          rawLatex: /\\(?:theta|tau|frac|sum|underbrace|operatorname)\b/.test(visible?.innerText ?? ''),
        };
      }, article.lab);

      expect(audit.documentOverflow).toBeLessThanOrEqual(1);
      expect(audit.articleOverflow).toBeLessThanOrEqual(1);
      expect(audit.labOverflow).toBeLessThanOrEqual(1);
      expect(audit.formulaOverflow.every((value) => value <= 1)).toBe(true);
      expect(audit.formulaScales.every((value) => value >= 0.52)).toBe(true);
      expect(audit.unpaired).toBe(0);
      expect(audit.rawLatex).toBe(false);
      expect(errors).toEqual([]);
    });
  }
}

test('all six labs expose a visible causal state change', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/competition-workflow`, { waitUntil: 'networkidle' });
  const contract = page.locator('[data-competition-contract-lab]');
  await contract.getByRole('button', { name: '미래 예측', exact: true }).click();
  await expect(contract.getByText('시간 순 forward validation', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/evaluation-metrics`, { waitUntil: 'networkidle' });
  const metric = page.locator('[data-metric-decision-lab]');
  await metric.getByLabel('양성률').fill('10');
  await expect(metric.getByText('ROC AUC', { exact: true })).toBeVisible();
  await metric.getByLabel('하루 검토 용량').fill('3000');
  await expect(metric.getByText('Fβ at policy threshold', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/cross-validation`, { waitUntil: 'networkidle' });
  const split = page.locator('[data-split-contract-lab]');
  await expect(split.getByText('학습 제외', { exact: true })).toHaveCount(2);
  await expect(split.getByText('증거 사용 가능', { exact: true })).toBeVisible();
  await split.getByRole('button', { name: '독립 표본', exact: true }).click();
  await expect(split.getByText('생성 과정 재검토', { exact: true })).toBeVisible();
  await split.getByRole('button', { name: '미래 예측', exact: true }).click();
  await expect(split.getByText('고객 overlap', { exact: true })).toBeVisible();
  await expect(split.getByText('기존 고객 허용', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/experiment-tracking`, { waitUntil: 'networkidle' });
  const ledger = page.locator('[data-evidence-ledger-lab]');
  for (const label of ['Split manifest', 'OOF predictions', 'Model + feature schema']) {
    await ledger.getByRole('button', { name: label, exact: true }).click();
  }
  await expect(ledger.getByText('재현 evidence 완성', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/hyperparameter-tuning`, { waitUntil: 'networkidle' });
  const search = page.locator('[data-search-gate-lab]');
  await search.getByLabel('Baseline 대비 관측 개선').fill('40');
  await search.getByLabel('반복·fold noise').fill('0');
  await expect(search.getByText('반복 검증으로 진행', { exact: true })).toBeVisible();
  const pruning = page.locator('[data-pruning-evidence-lab]');
  await pruning.getByRole('button', { name: '늦은 개선', exact: true }).click();
  await pruning.getByLabel('관측 step').fill('3');
  await expect(pruning.getByText('판정 보류', { exact: true })).toBeVisible();
  await pruning.getByLabel('관측 step').fill('4');
  await expect(pruning.getByText('Prune 후보', { exact: true })).toBeVisible();
  await pruning.getByLabel('관측 step').fill('8');
  await expect(pruning.getByText('계속 학습', { exact: true })).toBeVisible();
  const pareto = page.locator('[data-pareto-budget-lab]');
  await pareto.getByLabel('p95 latency budget').fill('25');
  await expect(pareto.getByText('예산 통과', { exact: true })).toHaveCount(1);

  await page.goto(`${base}/lab/blog/ai/ensemble-methods`, { waitUntil: 'networkidle' });
  const ensemble = page.locator('[data-ensemble-gate-lab]');
  await ensemble.getByLabel('현재 조합과 OOF 오류 상관').fill('20');
  await expect(ensemble.getByText('OOF 조합 검증으로 진행', { exact: true })).toBeVisible();
  await ensemble.getByLabel('Calibration gap').fill('20');
  await expect(ensemble.getByText('복잡도 추가를 멈춤', { exact: true })).toBeVisible();
});

test('the strategy leaf exposes one ordered evidence spine', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-practical-strategy`, { waitUntil: 'networkidle' });
  const path = page.locator('[data-authored-learning-path="ai-practical-competition"]');
  await expect(path.getByRole('link')).toHaveCount(6);
  await expect(path).toContainText('Prediction cutoff');
  const hrefs = await path.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs).toEqual(articles.map(({ slug }) => `/lab/blog/ai/${slug}`));
});
