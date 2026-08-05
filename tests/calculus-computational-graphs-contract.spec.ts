import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const route = '/lab/blog/ai/calculus-computational-graphs';

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const result = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const escaped = [...document.querySelectorAll<HTMLElement>('main *')]
      .filter((element) => !element.closest('[data-math-fit]'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          text: (element.textContent ?? '').trim().slice(0, 64),
        };
      })
      .filter((item) => item.width > 1 && (item.left < -1 || item.right > viewportWidth + 1));

    return {
      documentOverflow: document.documentElement.scrollWidth - viewportWidth,
      escaped,
      figureOverflow: [...document.querySelectorAll<HTMLElement>('figure')].map((figure) => (
        figure.scrollWidth - figure.clientWidth
      )),
      formulas: [...document.querySelectorAll<HTMLElement>('[data-math-fit]')].map((formula) => ({
        overflow: formula.scrollWidth - formula.clientWidth,
        scale: Number(formula.dataset.mathScale ?? '0'),
      })),
    };
  });

  expect(result.documentOverflow).toBeLessThanOrEqual(1);
  expect(result.escaped).toEqual([]);
  expect(result.figureOverflow.every((value) => value <= 1)).toBeTruthy();
  expect(result.formulas.length).toBeGreaterThanOrEqual(10);
  expect(result.formulas.every((formula) => formula.overflow <= 1)).toBeTruthy();
  expect(result.formulas.every((formula) => formula.scale >= 0.9)).toBeTruthy();
}

test('article climbs from sensitivity to runtime and returns to upper systems', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  for (const title of [
    '결과의 변화량을 원인의 책임으로 되돌린다',
    'Derivative를 local linear map으로 읽는다',
    'Partial, gradient와 directional derivative를 분리한다',
    '경로 안에서는 곱하고 같은 원인으로 돌아오면 더한다',
    'Jacobian은 개념으로 두고 필요한 product만 계산한다',
    'Graph, saved value와 leaf accumulation을 따로 추적한다',
    'Finite difference의 오차가 가장 작아지는 구간을 찾는다',
    '두 번째 chain rule에서 path 곡률과 clock 가속을 분리한다',
    '같은 sensitivity 뼈대로 상위 시스템에 돌아간다',
  ]) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }

  for (const selector of [
    '[data-local-linearization-lab]',
    '[data-directional-derivative-lab]',
    '[data-gradient-flow-lab]',
    '[data-jacobian-product-lab]',
    '[data-autograd-tape-lab]',
    '[data-gradcheck-path-lab]',
  ]) {
    await expect(page.locator(selector)).toHaveCount(1);
  }

  await expect(page.locator('[data-formula-note]')).toHaveCount(17);
  expect(await page.locator('.katex').count()).toBeGreaterThanOrEqual(30);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('Broadcast도 같은 값을 여러 위치에 복제한 분기');
  expect(bodyText).toContain('path 곡률과 clock 가속');
  expect(bodyText).not.toContain(String.raw`\underbrace`);
  expect(bodyText).not.toContain(String.raw`\theta`);
  expect(bodyText).not.toContain(String.raw`\frac`);

  for (const slug of [
    'optimization-geometry',
    'differential-equations-phase-plane-numerical-integration',
    'robot-trajectory-generation',
    'backprop-optimization',
    'llm-architecture-dense-transformers',
    'diffusion-models',
    'rl-policy-gradient-actor-critic',
    'robot-kinematics-coordinate-frames',
  ]) {
    await expect(page.locator(`a[href$="/${slug}"]`).first()).toBeVisible();
  }
});

test('local and directional labs expose the linear prediction boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const local = page.locator('[data-local-linearization-lab]');
  const firstResidual = Number(await local.getAttribute('data-residual'));
  await local.locator('#calculus-linearization-delta').fill('0.05');
  const smallResidual = Number(await local.getAttribute('data-residual'));
  expect(Math.abs(smallResidual)).toBeLessThan(Math.abs(firstResidual));
  const exact = Number(await local.getAttribute('data-exact-delta'));
  const linear = Number(await local.getAttribute('data-linear-delta'));
  const residual = Number(await local.getAttribute('data-residual'));
  expect(Math.abs(exact - linear - residual)).toBeLessThan(1e-4);

  const direction = page.locator('[data-directional-derivative-lab]');
  await direction.locator('#calculus-direction-angle').fill('0');
  const atZero = Number(await direction.getAttribute('data-directional'));
  await direction.locator('#calculus-direction-angle').fill('180');
  const atOpposite = Number(await direction.getAttribute('data-directional'));
  expect(atZero * atOpposite).toBeLessThan(0);
  await expect(direction).toHaveAttribute('data-decision', /증가|감소/);
});

test('branch, broadcast and detach change gradient responsibility without changing the rule', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const flow = page.locator('[data-gradient-flow-lab]');
  await flow.locator('#calculus-flow-u').fill('2');
  await expect(flow).toHaveAttribute('data-flow-total', '7');

  await flow.getByRole('button', { name: 'Detach branch', exact: true }).click();
  await expect(flow).toHaveAttribute('data-flow-mode', 'detach');
  await expect(flow).toHaveAttribute('data-flow-total', '4');

  await flow.getByRole('button', { name: 'Broadcast bias', exact: true }).click();
  await expect(flow).toHaveAttribute('data-flow-mode', 'broadcast');
  const firstSum = await flow.getAttribute('data-flow-total');
  await flow.locator('#calculus-flow-batch').fill('4');
  expect(await flow.getAttribute('data-flow-total')).not.toBe(firstSum);
  await expect(flow).toContainText('원래 bias shape로 되돌리는 합');
});

test('JVP, VJP and autograd tape keep seed direction and state lifetime explicit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const products = page.locator('[data-jacobian-product-lab]');
  await expect(products).toHaveAttribute('data-product-mode', 'vjp');
  await expect(products).toHaveAttribute('data-product-result', /,/);
  await products.getByRole('button', { name: '2 → 4', exact: true }).click();
  await expect(products).toHaveAttribute('data-input-dimension', '2');
  await expect(products).toHaveAttribute('data-output-dimension', '4');
  await products.getByRole('button', { name: 'JVP · Jv', exact: true }).click();
  await expect(products).toHaveAttribute('data-product-mode', 'jvp');
  expect((await products.getAttribute('data-product-result'))?.split(',')).toHaveLength(4);
  await products.getByRole('button', { name: 'VJP · Jᵀc', exact: true }).click();
  expect((await products.getAttribute('data-product-result'))?.split(',')).toHaveLength(2);

  const tape = page.locator('[data-autograd-tape-lab]');
  await expect(tape).toHaveAttribute('data-leaf-grad', 'none');
  await tape.getByRole('button', { name: 'Backward 1회', exact: true }).click();
  const connectedGrad = Number(await tape.getAttribute('data-leaf-grad'));
  await tape.getByRole('button', { name: /3u branch gradient 연결됨/ }).click();
  await expect(tape).toHaveAttribute('data-detached', 'true');
  expect(Number(await tape.getAttribute('data-leaf-grad'))).toBeLessThan(connectedGrad);
  await tape.getByRole('button', { name: '다음 iteration', exact: true }).click();
  await expect(tape).toHaveAttribute('data-graph-generation', '2');
  await tape.getByRole('button', { name: 'zero_grad', exact: true }).click();
  await expect(tape).toHaveAttribute('data-leaf-grad', '0');
  await expect(tape).toHaveAttribute('data-graph-generation', '2');
});

test('gradcheck and second chain rule expose independent numerical and physical causes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-gradcheck-path-lab]');
  await lab.locator('#calculus-gradcheck-epsilon').fill('-2');
  const middleError = Number(await lab.getAttribute('data-check-error'));
  await lab.locator('#calculus-gradcheck-epsilon').fill('-8');
  const tinyError = Number(await lab.getAttribute('data-check-error'));
  expect(tinyError).toBeGreaterThan(middleError);

  await lab.getByRole('button', { name: 'q(s(t)) 2차 미분', exact: true }).click();
  await expect(lab).toHaveAttribute('data-check-tab', 'path');
  const firstAcceleration = await lab.getAttribute('data-path-acceleration');
  await lab.locator('#calculus-path-sdot').fill('2.2');
  const speedAcceleration = await lab.getAttribute('data-path-acceleration');
  expect(speedAcceleration).not.toBe(firstAcceleration);
  await lab.locator('#calculus-path-sddot').fill('0.8');
  expect(await lab.getAttribute('data-path-acceleration')).not.toBe(speedAcceleration);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`formulas, controls and visualizations remain readable at ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);

    const controlSizes = await page.locator(
      '[data-local-linearization-lab] button, [data-local-linearization-lab] input, '
      + '[data-directional-derivative-lab] button, [data-directional-derivative-lab] input, '
      + '[data-gradient-flow-lab] button, [data-gradient-flow-lab] input, '
      + '[data-jacobian-product-lab] button, [data-jacobian-product-lab] input, '
      + '[data-autograd-tape-lab] button, [data-autograd-tape-lab] input, '
      + '[data-gradcheck-path-lab] button, [data-gradcheck-path-lab] input',
    ).evaluateAll((controls) => controls.map((control) => {
      const rect = control.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));

    expect(controlSizes.length).toBeGreaterThan(0);
    expect(controlSizes.every((size) => size.width >= 44 && size.height >= 44)).toBeTruthy();
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
}
