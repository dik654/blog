import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const route = '/lab/blog/ai/llm-interpretability-readouts';

async function expectNoOverflow(page: import('@playwright/test').Page) {
  expect(await page.evaluate(() => (
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  ))).toBeLessThanOrEqual(1);

  const offenders = await page.locator('main').evaluate((main) => (
    [main, ...Array.from(main.querySelectorAll<HTMLElement>('*'))]
      .filter((node) => node.scrollWidth - node.clientWidth > 2)
      .filter((node) => {
        const style = getComputedStyle(node);
        return style.overflowX === 'auto' || style.overflowX === 'scroll';
      })
      .map((node) => ({
        tag: node.tagName,
        delta: node.scrollWidth - node.clientWidth,
        className: node.className,
      }))
  ));
  expect(offenders).toEqual([]);
}

test('readout article separates diagnostic distributions from the model output', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-layer-readout-explorer]')).toHaveCount(1);
  await expect(page.locator('[data-attention-contribution-lab]')).toHaveCount(1);
  await expect(page.locator('[data-readout-claim-lab]')).toHaveCount(1);
  await expect(page.getByText('여기서 멈춘다.', { exact: true })).toBeVisible();
  await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('실제 next-token 확률');
  expect(bodyText).toContain('원 모델의 p_model과 중간 lens의 q');
  expect(bodyText).toContain('Attention is not Explanation');
  expect(bodyText).toContain('Attention is not not Explanation');
  expect(bodyText).toContain('Pythia-410M layer 18');
  expect(bodyText).toContain('penultimate residual');
  expect(bodyText).not.toContain('34%');
  expect(bodyText).not.toContain('58%');
  expect(bodyText).not.toContain('83%');
  expect(bodyText).not.toContain(String.raw`\theta`);
  expect(bodyText).not.toContain(String.raw`\operatorname`);

  await expect(page.locator('a[href$="/llm-interpretability-frontier"]').first()).toBeVisible();
  await expect(page.locator('a[href$="/llm-circuit-analysis"]').first()).toBeVisible();
  await expect(page.locator('a[href$="/sparse-autoencoder"]').first()).toBeVisible();
  await expectNoOverflow(page);
});

test('attention teaching fixture separates weights from projected value contribution', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-attention-contribution-lab]');
  await expect(lab).toHaveAttribute('data-attention-case', 'same-output-a');
  await expect(lab.getByText('0.8', { exact: true })).toBeVisible();

  await lab.getByRole('button', { name: /^B · 둘째 key/ }).click();
  await expect(lab).toHaveAttribute('data-attention-case', 'same-output-b');
  await expect(lab.locator('[data-attention-allowed]')).toContainText('같은 projected contribution 0.8');
  await expect(lab.getByText('0.8', { exact: true })).toBeVisible();

  await lab.getByRole('button', { name: /^C · weight 같고 내용/ }).click();
  await expect(lab).toHaveAttribute('data-attention-case', 'same-weight-new-value');
  await expect(lab.locator('[data-attention-allowed]')).toContainText('0.4로 바뀐다');
  await expect(lab.getByText('0.4', { exact: true })).toBeVisible();
  await expectNoOverflow(page);
});

test('claim lab keeps null effects, single effects and controlled evidence bounded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-readout-claim-lab]');
  await expect(lab).toHaveAttribute('data-readout-method', 'attention');
  await expect(lab).toHaveAttribute('data-readout-evidence', 'readout');
  await expect(lab.locator('[data-readout-forbidden]')).toContainText('원인이라고 단정');

  await lab.getByRole('button', { name: 'J-lens', exact: true }).click();
  await lab.getByRole('button', { name: /변화 없음/ }).click();
  await expect(lab).toHaveAttribute('data-readout-method', 'jacobian');
  await expect(lab).toHaveAttribute('data-readout-evidence', 'no-effect');
  await expect(lab.locator('[data-readout-allowed]')).toContainText('필요성을 확인하지 못');
  await expect(lab.locator('[data-readout-forbidden]')).toContainText('표현이 없거나');
  await expect(lab.locator('[data-readout-next]')).toContainText('backup path');
  await expect(lab.locator('[data-readout-next]')).toContainText('self-repair');
  await expect(lab.locator('[data-readout-next-route]')).toContainText('Causal Circuit 검증');

  await lab.getByRole('button', { name: /변화 있음/ }).click();
  await expect(lab).toHaveAttribute('data-readout-evidence', 'single-effect');
  await expect(lab.locator('[data-readout-allowed]')).toContainText('causal relevance');
  await expect(lab.locator('[data-readout-forbidden]')).toContainText('충분하거나 유일');

  await lab.getByRole('button', { name: /holdout 통과/ }).click();
  await expect(lab).toHaveAttribute('data-readout-evidence', 'controlled');
  await expect(lab.locator('[data-readout-allowed]')).toContainText('검증된 mechanism component');
  await expect(lab.locator('[data-readout-forbidden]')).toContainText('완전한 설명');

  await lab.getByRole('button', { name: '읽기만', exact: true }).click();
  await expect(lab).toHaveAttribute('data-readout-evidence', 'readout');
  await expect(lab.locator('[data-readout-allowed]')).toContainText('평균한 문맥 범위');
  await expect(lab.locator('[data-readout-next-route]')).toContainText('J-space 실험');
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`readout labs and equations remain readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

    const controls = await page.locator(
      '[data-layer-readout-explorer] button, [data-attention-contribution-lab] button, [data-readout-claim-lab] button',
    ).evaluateAll((buttons) => (
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    ));
    expect(controls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();

    const formulaScale = await page.locator('.katex-display').evaluateAll((nodes) => (
      nodes.map((node) => Number(getComputedStyle(node).getPropertyValue('--math-scale') || '1'))
    ));
    expect(formulaScale.length).toBeGreaterThan(0);
    expect(formulaScale.every((scale) => scale >= 1)).toBeTruthy();

    const labWidth = await page.locator('[data-readout-claim-lab]').evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.right - rect.left;
    });
    expect(labWidth).toBeLessThanOrEqual(viewport.width);
    await expectNoOverflow(page);
  });
}

test('direct scroll keeps the claim lab below the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });

  const lab = page.locator('[data-readout-claim-lab]');
  await lab.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.waitForFunction(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const target = document.querySelector('[data-readout-claim-lab]')?.getBoundingClientRect();
    return Boolean(header && target && target.top <= header.bottom + 40);
  });
  const geometry = await page.evaluate(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const target = document.querySelector('[data-readout-claim-lab]')?.getBoundingClientRect();
    return {
      headerBottom: header?.bottom ?? 0,
      targetTop: target?.top ?? -1,
    };
  });

  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.headerBottom);
  expect(geometry.targetTop).toBeLessThanOrEqual(geometry.headerBottom + 40);
  await expect(lab.getByRole('button', { name: 'J-lens', exact: true })).toBeVisible();
});
