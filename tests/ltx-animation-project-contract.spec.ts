import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';
const path = '/lab/blog/ai/ltx-animation-project';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

async function height(locator: ReturnType<import('@playwright/test').Page['locator']>) {
  return locator.evaluate((node) => node.getBoundingClientRect().height);
}

for (const viewport of viewports) {
  test(`LTX animation implementation contract at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole('heading', { level: 1, name: 'LTX 기반 2D 애니메이션 적응: 구현 사례' })).toBeVisible();
    await expect(page.locator('[data-learning-question]')).toContainText('현재 LTX-2.3 weight');
    await expect(page.locator('[data-concept-primer]')).toContainText('paired validation');
    await expect(page.locator('body')).toContainText('9377758131b1');
    await expect(page.locator('body')).toContainText('연 매출 1,000만 달러');
    await expect(page.getByRole('link', { name: '2D 애니메이션 제작 계약', exact: true }))
      .toHaveAttribute('href', '/lab/blog/ai/animation-production-workflow');

    await expect(page.locator('[data-formula-pair]')).toHaveCount(4);
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('[data-math-annotation-missing="true"]')).toHaveCount(0);
    await expect(page.locator('.katex-error')).toHaveCount(0);

    const run = page.locator('[data-ltx-run-lab]');
    const evaluation = page.locator('[data-ltx-eval-lab]');
    await expect(run).toHaveAttribute('data-ltx-profile', 'smoke');
    await expect(run).toContainText('2,268 token');
    await expect(run.locator('svg:not(.lucide)')).toHaveCount(0);
    await expect(evaluation.locator('svg:not(.lucide)')).toHaveCount(0);

    await run.getByRole('button', { name: '89 frame · 표준 예제', exact: true }).click();
    await expect(run).toHaveAttribute('data-ltx-profile', 'standard');
    await expect(run).toContainText('3,888 token');
    await expect(run).toContainText('rank 32 · alpha 32');

    const runHeights: number[] = [];
    const tabs = run.getByRole('tab');
    for (let index = 0; index < 6; index += 1) {
      await tabs.nth(index).click();
      runHeights.push(await height(run));
    }
    expect(Math.max(...runHeights) - Math.min(...runHeights)).toBeLessThanOrEqual(2);
    await expect(run).toHaveAttribute('data-ltx-stage', 'release');
    await expect(run).toContainText('target 개선이 retention·runtime·rights 실패를 덮지 않는다.');
    await expect(run).toContainText('재현 bundle 또는 blocked failure ledger');

    const evaluationHeights: number[] = [];
    for (const fixture of ['선화 개선', '외운 듯한 결과', '오디오 회귀']) {
      await evaluation.getByRole('button', { name: fixture, exact: true }).click();
      evaluationHeights.push(await height(evaluation));
    }
    expect(Math.max(...evaluationHeights) - Math.min(...evaluationHeights)).toBeLessThanOrEqual(2);
    await expect(evaluation).toHaveAttribute('data-ltx-fixture', 'audio');
    await expect(evaluation).toContainText('오디오 정렬 · 보존');
    await expect(evaluation).toContainText('-26 · gate 68');
    await expect(evaluation).toContainText('릴리스 차단');
    await expect(evaluation).toContainText('target-module pattern');

    const geometry = await page.evaluate(() => {
      const labs = Array.from(document.querySelectorAll<HTMLElement>('[data-ltx-run-lab], [data-ltx-eval-lab]'));
      const labels = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>('button, p, span, h3')));
      const controls = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>('button')));
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-formula-pair] [data-math-fit]'));
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        labOverflowX: labs.map((lab) => lab.scrollWidth - lab.clientWidth),
        labOverflowY: labs.map((lab) => lab.scrollHeight - lab.clientHeight),
        minLabelFont: Math.min(...labels.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))),
        minControlHeight: Math.min(...controls.map((node) => node.getBoundingClientRect().height)),
        minFormulaScale: Math.min(...formulas.map((node) => Number(node.dataset.mathScale ?? '1'))),
        formulaOverflow: formulas.map((node) => node.scrollWidth - node.clientWidth),
        rawLatex: /\\(?:underbrace|begin\{|frac\{|alpha|Delta)/.test(document.body.innerText),
      };
    });

    expect(geometry.documentOverflow).toBeLessThanOrEqual(1);
    expect(geometry.labOverflowX.every((value) => value <= 1)).toBe(true);
    expect(geometry.labOverflowY.every((value) => value <= 1)).toBe(true);
    expect(geometry.minLabelFont).toBeGreaterThanOrEqual(12);
    expect(geometry.minControlHeight).toBeGreaterThanOrEqual(44);
    expect(geometry.minFormulaScale).toBeGreaterThanOrEqual(0.7);
    expect(geometry.formulaOverflow.every((value) => value <= 1)).toBe(true);
    expect(geometry.rawLatex).toBe(false);
  });
}
