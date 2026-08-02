import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`pre-training scaling keeps budget, formulas and run gate executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/llm-pretraining-scaling`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '문장을 이어 쓰는 LLM은 처음에 어떻게 배울까?' })).toBeVisible();
    const opening = page.locator('[data-beginner-opening]');
    await expect(opening).toBeVisible();
    await expect(opening).toContainText('Pre-training은 아주 많은 문장');
    await expect(opening).toContainText('다음 조각 맞히기');
    const narrativeOrder = await page.locator('#deployment-first').evaluate((section) => {
      const beginner = section.querySelector('[data-beginner-opening]');
      const primer = section.querySelector('[data-concept-primer]');
      const question = section.querySelector('[data-learning-question]');
      return beginner && primer && question
        ? [beginner, primer, question].map((node) => [...section.children].indexOf(node))
        : [];
    });
    expect(narrativeOrder).toHaveLength(3);
    expect(narrativeOrder[0]).toBeLessThan(narrativeOrder[1]);
    expect(narrativeOrder[1]).toBeLessThan(narrativeOrder[2]);
    await expect(page.locator('[data-pretraining-budget-lab]')).toBeVisible();
    await expect(page.locator('[data-isoflop-pilot-lab]')).toBeVisible();
    await expect(page.locator('[data-pretraining-run-gate]')).toBeVisible();
    await expect(page.locator('[data-formula-note]')).toHaveCount(5);
    await expect(page.locator('[data-math-fit]')).toHaveCount(5);
    await expect(page.locator('article table')).toHaveCount(0);

    const budget = page.locator('[data-pretraining-budget-lab]');
    await expect(budget.getByText('4.00 ZFLOPs')).toBeVisible();
    await expect(budget.getByText('40.0')).toBeVisible();
    await expect(budget.getByText('1.3×')).toBeVisible();
    await budget.getByRole('button', { name: '100B', exact: true }).click();
    await budget.getByRole('button', { name: '16×', exact: true }).click();
    await expect(budget.getByText('배포 비용 우세').first()).toBeVisible();
    await expect(budget.getByText('16.72 ZFLOPs')).toBeVisible();
    await budget.locator('input[aria-label="학습 token"]').fill('720');
    await budget.locator('input[aria-label="고유 token"]').fill('20');
    await expect(budget.getByText('36.0×')).toBeVisible();
    await expect(budget.getByText('반복 검증 필요').first()).toBeVisible();

    const pilot = page.locator('[data-isoflop-pilot-lab]');
    await expect(pilot.getByText('demo optimum · 9B')).toBeVisible();
    await pilot.getByRole('button', { name: '2 ZF', exact: true }).click();
    await expect(pilot.getByText('demo optimum · 4B')).toBeVisible();
    await pilot.getByRole('button', { name: '32 ZF', exact: true }).click();
    await expect(pilot.getByText('demo optimum · 18B')).toBeVisible();

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
      rawLatex: /\\\\(?:underbrace|operatorname|approx)/.test((element as HTMLElement).innerText ?? ''),
    })));
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.72);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.rawLatex).toBe(false);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test(`LLM pre-training run closes batch, sharding and resume evidence on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/llm-pretraining-run`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '좋은 model과 data가 있어도 왜 run은 실패할까?' })).toBeVisible();
    const ledger = page.locator('[data-pretraining-run-ledger]');
    const budget = page.locator('[data-pretraining-budget-ledger]');
    await expect(ledger).toBeVisible();
    await expect(budget).toBeVisible();
    await ledger.getByRole('tab', { name: /Checkpoint/ }).click();
    await expect(ledger.getByText('manifest · shard checksum · save/load smoke test · retained fallback')).toBeVisible();

    await expect(budget.getByText('262,144')).toBeVisible();
    await expect(budget.getByText('9.0 GB')).toBeVisible();
    await budget.getByRole('button', { name: '9B' }).click();
    await budget.getByRole('button', { name: '복제 DDP' }).click();
    await expect(budget.getByText('162.0 GB')).toBeVisible();
    await budget.locator('#run-ranks').fill('32');
    await budget.locator('#run-accumulation').fill('16');
    await expect(budget.getByText('2,097,152')).toBeVisible();

    await expect(page.locator('[data-formula-note]')).toHaveCount(6);
    await expect(page.locator('[data-math-fit]')).toHaveCount(6);
    await expect(page.locator('article table')).toHaveCount(0);
    const formulaScales = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => Number(element.getAttribute('data-math-scale') ?? '1')));
    for (const scale of formulaScales) expect(scale).toBeGreaterThanOrEqual(0.72);

    const pathLabels = await page.getByLabel('LLM Pre-training · 첫 학습에서 실행까지 학습 경로').getByRole('link').allTextContents();
    expect(pathLabels.map((label) => label.trim())).toEqual([
      '1. Pre-training과 학습 예산',
      '2. 기준 원문 · Chinchilla',
      '3. 데이터 신호',
      '4. 학습 실행',
    ]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('Data · Pre-training branch exposes one bounded route from budget to execution', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-data`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 1, name: '데이터 · Pre-training' })).toBeVisible();
  await expect(page.locator('[data-topdown-research-route="llm-data-engine"]')).toBeVisible();
  for (const step of ['00 · Pre-training은 무엇인가', '01 · 데이터 신호', '02 · 학습 실행']) {
    await expect(page.getByRole('link', { name: new RegExp(step) }).first()).toBeVisible();
  }
  await expect(page.getByText('Test-Time Scaling Makes Overtraining Compute-Optimal', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Training Compute-Optimal Large Language Models', { exact: true }).first()).toBeVisible();
  const sequence = page.locator('[data-subcategory-branches][data-child-navigation-mode="sequence"]');
  await expect(sequence).toBeVisible();
  const childLinks = sequence.locator('[data-child-navigation-item] a');
  expect(await childLinks.evaluateAll((links) => links.map((link) => ({
    text: link.textContent?.replace(/\s+/g, ' ').trim(),
    href: link.getAttribute('href'),
  })))).toEqual([
    { text: expect.stringContaining('Pre-training은 무엇인가'), href: '/lab/blog/ai?sub=ai-llm-data-scaling' },
    { text: expect.stringContaining('데이터 신호'), href: '/lab/blog/ai?sub=ai-llm-data-pipeline' },
    { text: expect.stringContaining('학습 실행'), href: '/lab/blog/ai?sub=ai-llm-data-training' },
  ]);

  await page.goto(`${base}/lab/blog/ai/llm-data-engine`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-data-audit-rail]')).toBeVisible();
  await expect(page.getByRole('link', { name: /다음 · 학습 실행/ })).toHaveAttribute('href', '/lab/blog/ai/llm-pretraining-run');
  await expect(page.locator('article table')).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
