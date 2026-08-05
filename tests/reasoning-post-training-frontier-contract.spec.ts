import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`reasoning frontier remains readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/reasoning-post-training-frontier`, { waitUntil: 'networkidle' });

    const map = page.locator('[data-step-viz]').filter({ has: page.locator('[data-reasoning-frontier-map]') });
    await expect(map).toHaveCount(1);
    await expect(map).toContainText('Training compute와 test-time compute를 다른 장부');
    for (let step = 0; step < 4; step += 1) {
      await map.getByRole('button', { name: '다음 장면' }).click();
    }
    await expect(map).toContainText('정답, hidden test, visible CoT의 증거를 분리');

    const audit = await page.evaluate(() => ({
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      stageOverflow: [...document.querySelectorAll<HTMLElement>('[data-step-viz-stage]')]
        .map((stage) => stage.scrollWidth - stage.clientWidth)
        .filter((amount) => amount > 1),
      stepMetaFontSizes: [
        ...document.querySelectorAll<HTMLElement>('[data-step-viz] .step-viz__index > span, [data-step-viz] [data-step-viz-narrative] > div'),
      ].map((label) => Number.parseFloat(getComputedStyle(label).fontSize)),
      stepControlSizes: [
        ...document.querySelectorAll<HTMLElement>('[data-step-viz] .step-viz__controls button'),
      ].map((button) => {
        const box = button.getBoundingClientRect();
        return { width: box.width, height: box.height };
      }),
      formulas: [...document.querySelectorAll<HTMLElement>('[data-math-fit]')].map((formula) => {
        const katex = formula.querySelector<HTMLElement>('.katex');
        return {
          overflow: formula.scrollWidth - formula.clientWidth,
          scale: Number(formula.dataset.mathScale ?? '1'),
          fontSize: katex ? Number.parseFloat(getComputedStyle(katex).fontSize) : 0,
          annotated: /\\text\{[^}]*[가-힣][^}]*\}/.test(formula.dataset.mathSource ?? ''),
        };
      }),
    }));
    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.stageOverflow).toEqual([]);
    expect(Math.min(...audit.stepMetaFontSizes)).toBeGreaterThanOrEqual(11);
    for (const control of audit.stepControlSizes) {
      expect(control.width).toBeGreaterThanOrEqual(44);
      expect(control.height).toBeGreaterThanOrEqual(44);
    }
    expect(audit.formulas).toHaveLength(7);
    for (const formula of audit.formulas) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.annotated).toBe(true);
    }
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await expect(page.getByText('초기 구조 오류와 늦은 계산 오류')).toBeVisible();
    await expect(page.getByText('감시 회피가 학습됐다')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('reasoning frontier labs preserve separate compute, entropy, and evidence contracts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/reasoning-post-training-frontier`, { waitUntil: 'domcontentloaded' });

  await page.locator('#reasoning-step-budget').fill('10');
  await page.locator('#reasoning-candidate-count').fill('4');
  await expect(page.locator('body')).toContainText('40');
  await expect(page.locator('body')).toContainText('overthinking 가능성');

  await page.getByRole('button', { name: '분포 붕괴' }).click();
  await expect(page.locator('body')).toContainText('H = 0.35');
  await expect(page.locator('body')).toContainText('유효 전략 수 ≈ 1.4');

  await page.getByRole('button', { name: 'Hidden test' }).click();
  await page.getByRole('button', { name: 'Checker 편법' }).click();
  await expect(page.locator('body')).toContainText('reward = 0');
  await expect(page.locator('body')).toContainText('VQA reasoning에서');
});
