import { expect, test } from '@playwright/test';
import {
  logForEntropy,
  negativeLogQ,
} from '../src/pages/articles/ai/probability-information-theory/viz/ProbabilityLabs';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const route = '/lab/blog/ai/probability-information-theory';

async function expectNoOverflow(page: import('@playwright/test').Page) {
  const result = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const escaped = [...document.querySelectorAll<HTMLElement>('main *')]
      .filter((element) => !element.closest('[data-math-fit]'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          width: rect.width,
          left: rect.left,
          right: rect.right,
          text: (element.textContent ?? '').trim().slice(0, 60),
        };
      })
      .filter((item) => item.width > 1 && (item.left < -1 || item.right > viewportWidth + 1));
    return {
      document: document.documentElement.scrollWidth - viewportWidth,
      escaped,
      figures: [...document.querySelectorAll<HTMLElement>('figure')].map((figure) => (
        figure.scrollWidth - figure.clientWidth
      )),
      formulas: [...document.querySelectorAll<HTMLElement>('[data-math-fit]')].map((formula) => ({
        scale: Number(formula.dataset.mathScale ?? '0'),
        overflow: formula.scrollWidth - formula.clientWidth,
      })),
    };
  });

  expect(result.document).toBeLessThanOrEqual(1);
  expect(result.escaped).toEqual([]);
  expect(result.figures.every((overflow) => overflow <= 1)).toBeTruthy();
  expect(result.formulas.length).toBeGreaterThanOrEqual(15);
  expect(result.formulas.every((formula) => formula.overflow <= 1)).toBeTruthy();
  expect(result.formulas.every((formula) => formula.scale >= 0.8)).toBeTruthy();
}

test('probability foundation follows score to distribution to loss and preserves the evidence boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-distribution-moment-lab]')).toHaveCount(1);
  await expect(page.locator('[data-bayes-evidence-lab]')).toHaveCount(1);
  await expect(page.locator('[data-score-to-loss-lab]')).toHaveCount(1);
  await expect(page.locator('[data-formula-note]')).toHaveCount(13);

  for (const title of [
    '점수 2, 1, -1에서 무엇을 더 정해야 확률이 될까?',
    '함께 일어날 확률에서, 알고 난 뒤의 확률을 어떻게 꺼낼까?',
    '같은 식이 probability였다가 likelihood가 되는 순간',
    'Logit은 어떻게 probability가 되고, 정답은 어떻게 loss가 될까?',
    'Surprisal, entropy, cross-entropy, KL은 서로 어떤 비용인가?',
    'Softmax 0.9와 낮은 NLL이 보장하지 않는 것',
  ]) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('순서를 무시한 count 사건');
  expect(bodyText).toContain('P 기준 self-information -log P(x)는 유한하다');
  expect(bodyText).toContain('집단 조건부 빈도');
  expect(bodyText).toContain('오해를 부르는 loss');
  expect(bodyText).not.toContain(String.raw`\underbrace`);
  expect(bodyText).not.toContain(String.raw`\theta`);
  expect(bodyText).not.toContain(String.raw`\frac`);

  for (const slug of [
    'cross-entropy',
    'statistics-generalization',
    'rl-mdp-bellman',
    'generative-theory',
  ]) {
    await expect(page.locator(`a[href$="/${slug}"]`).first()).toBeVisible();
  }
});

test('distribution and Bayes labs update the calculation rather than only the color', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const distribution = page.locator('[data-distribution-moment-lab]');
  await expect(distribution.locator('[data-distribution-expectation]')).toHaveText('0.600');
  await distribution.getByRole('button', { name: '균등', exact: true }).click();
  await expect(distribution.locator('[data-distribution-expectation]')).toHaveText('1.000');
  await expect(distribution.locator('[data-distribution-variance]')).toHaveText('0.667');
  await expect(distribution.locator('[data-distribution-entropy]')).toContainText('1.585');
  await distribution.locator('#distribution-weight-A').fill('0');
  await distribution.locator('#distribution-weight-B').fill('5');
  await distribution.locator('#distribution-weight-C').fill('5');
  await expect(distribution.locator('[data-distribution-entropy]')).toContainText('1.000');

  const bayes = page.locator('[data-bayes-evidence-lab]');
  await expect(bayes.locator('[data-bayes-posterior-output]')).toContainText('16.7%');
  await bayes.locator('#bayes-prevalence').fill('10');
  await expect(bayes.locator('[data-bayes-posterior-output]')).toContainText('68.8%');
  await expect(bayes).toHaveAttribute('data-bayes-posterior', '0.687500');
});

test('score lab preserves softmax under a common shift and changes NLL with the target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-score-to-loss-lab]');
  await expect(lab).toHaveAttribute('data-softmax-values', '0.705385,0.259496,0.035119');
  await expect(lab).toHaveAttribute('data-nll', '1.349012');

  const before = await lab.getAttribute('data-softmax-values');
  await lab.getByRole('button', { name: 'z + 5', exact: true }).click();
  await expect(lab).toHaveAttribute('data-softmax-values', before ?? '');
  await expect(lab).toHaveAttribute('data-nll', '1.349012');

  await lab.getByRole('button', { name: 'A', exact: true }).click();
  await expect(lab).toHaveAttribute('data-nll', '0.349012');
  await expect(lab.locator('[data-score-nll-output]')).toContainText('0.349');
});

test('score loss keeps entropy zero terms separate from Q support failure', () => {
  expect(logForEntropy(0)).toBe(0);
  expect(logForEntropy(0.5)).toBeCloseTo(Math.log(0.5), 12);
  expect(negativeLogQ(0)).toBe(Number.POSITIVE_INFINITY);
  expect(negativeLogQ(1e-12)).toBeCloseTo(-Math.log(1e-12), 12);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`probability formulas and labs remain legible at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);

    const buttonSizes = await page.locator(
      '[data-distribution-moment-lab] button, [data-score-to-loss-lab] button',
    ).evaluateAll((buttons) => buttons.map((button) => {
      const rect = button.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    expect(buttonSizes.length).toBeGreaterThan(0);
    expect(buttonSizes.every((size) => size.width >= 44 && size.height >= 44)).toBeTruthy();

    await expectNoOverflow(page);
  });
}
