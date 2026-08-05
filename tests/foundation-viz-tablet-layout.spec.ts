import { expect, test, type Locator, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

async function boxes(locator: Locator) {
  return locator.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right };
  }));
}

async function assertNoOverflow(page: Page, figure: Locator) {
  const audit = await figure.evaluate((element) => ({
    figure: element.scrollWidth - element.clientWidth,
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(audit.figure).toBeLessThanOrEqual(2);
  expect(audit.document).toBeLessThanOrEqual(1);
}

test('768px keeps XOR input and hidden representations in one comparison frame', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/lab/blog/ai/perceptron`, { waitUntil: 'networkidle' });

  const figure = page.locator('[data-xor-representation]');
  const panels = await boxes(figure.locator('[data-xor-panel]'));
  expect(panels).toHaveLength(2);
  expect(Math.abs(panels[0].y - panels[1].y)).toBeLessThanOrEqual(2);
  expect(panels[0].width).toBeGreaterThanOrEqual(320);
  expect(panels[1].width).toBeGreaterThanOrEqual(320);
  expect((await figure.boundingBox())?.height ?? Infinity).toBeLessThanOrEqual(520);
  await expect(figure.locator('[data-arrow-right]')).toBeVisible();
  await expect(figure.locator('[data-arrow-down]')).toBeHidden();
  await expect(figure.getByText('후보 직선 · 두 class가 양쪽에 섞임', { exact: true })).toBeVisible();
  await assertNoOverflow(page, figure);
});

test('768px keeps all five neural-network stages on one readable flow line', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/lab/blog/ai/neural-network`, { waitUntil: 'networkidle' });

  const figure = page.locator('[data-nn-composition]');
  const stages = figure.locator('[data-nn-stage]');
  const stageBoxes = await boxes(stages);
  expect(stageBoxes).toHaveLength(5);
  expect(Math.max(...stageBoxes.map((box) => box.y)) - Math.min(...stageBoxes.map((box) => box.y))).toBeLessThanOrEqual(2);
  expect(stageBoxes.every((box) => box.width >= 108)).toBe(true);
  expect(stageBoxes.map((box) => box.x)).toEqual([...stageBoxes.map((box) => box.x)].sort((a, b) => a - b));
  expect((await figure.boundingBox())?.height ?? Infinity).toBeLessThanOrEqual(420);
  await expect(figure.locator('[data-arrow-right]').first()).toBeVisible();
  await expect(figure.locator('[data-arrow-down]').first()).toBeHidden();
  await expect(figure.getByRole('tab', { name: 'Batch B개' })).toHaveAttribute('aria-selected', 'true');
  await expect(figure.getByText('A¹ [B,3]', { exact: true })).toBeVisible();
  await figure.getByRole('tab', { name: '샘플 1개' }).click();
  await expect(figure.getByText('a¹ [3]', { exact: true })).toBeVisible();
  await figure.getByRole('tab', { name: 'Batch B개' }).click();

  const styleAudit = await stages.evaluateAll((elements) => ({
    accentColors: new Set(elements.map((element) => getComputedStyle(element).borderLeftColor)).size,
    maxRail: Math.max(...elements.map((element) => Number.parseFloat(getComputedStyle(element).borderLeftWidth))),
    minText: Math.min(...elements.flatMap((element) => Array.from(element.querySelectorAll('span,p')).map((child) => Number.parseFloat(getComputedStyle(child).fontSize)))),
  }));
  expect(styleAudit.accentColors).toBeLessThanOrEqual(3);
  expect(styleAudit.maxRail).toBeLessThanOrEqual(2);
  expect(styleAudit.minText).toBeGreaterThanOrEqual(12);
  await assertNoOverflow(page, figure);
});

test('neural-network shape debugger exposes the B=1 trap and the batch-safe repair', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/neural-network`, { waitUntil: 'networkidle' });

  const figure = page.locator('[data-batch-shape-debugger]');
  await expect(figure.getByText('두 식 모두 계산됩니다.', { exact: true })).toBeVisible();
  await figure.getByRole('tab', { name: 'Batch B개' }).click();
  await expect(figure.getByText('취약 코드는 안쪽 차원 B와 2가 맞지 않습니다.', { exact: true })).toBeVisible();
  await expect(figure.locator('[data-shape-case="fragile"] [data-math-fit]')).toHaveCount(1);
  await expect(figure.locator('[data-shape-case="safe"] [data-math-fit]')).toHaveCount(1);
  await assertNoOverflow(page, figure);
});

test('neural-network numeric trace reveals five readable KaTeX stages without mobile overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/neural-network`, { waitUntil: 'networkidle' });

  const figure = page.locator('[data-numeric-forward-trace]');
  const tabs = figure.getByRole('tab');
  await expect(tabs).toHaveCount(5);
  await expect(figure.locator('.katex')).toHaveCount(1);
  await expect(figure.getByRole('tab', { name: '1. 입력' })).toHaveAttribute('aria-selected', 'true');

  for (const label of ['2. 은닉 선형', '3. ReLU', '4. 출력 선형', '5. 확률']) {
    await figure.getByRole('tab', { name: label }).click();
    await expect(figure.getByRole('tab', { name: label })).toHaveAttribute('aria-selected', 'true');
    await expect(figure.locator('.katex')).toHaveCount(label === '4. 출력 선형' ? 2 : 1);
  }
  await expect(figure.getByText('양성 클래스일 확률을 약 37.8%로 예측한다.', { exact: true })).toBeVisible();
  await assertNoOverflow(page, figure);
});

test('perceptron redraws the boundary after both required updates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/perceptron`, { waitUntil: 'networkidle' });

  const figure = page.locator('[data-boundary-redraw]');
  await expect(figure.locator('[data-boundary-line]')).toHaveCount(3);
  await expect(figure.getByRole('tab', { name: '0. 시작' })).toHaveAttribute('aria-selected', 'true');
  await expect(figure.getByText('오분류 · update 필요', { exact: true })).toBeVisible();

  await figure.getByRole('tab', { name: '1. Update' }).click();
  await expect(figure.getByText('-0.3', { exact: true })).toBeVisible();
  await expect(figure.getByText('아직 오분류 · 한 번 더', { exact: true })).toBeVisible();

  await figure.getByRole('tab', { name: '2. Update' }).click();
  await expect(figure.getByText('정답 · 이 샘플은 종료', { exact: true })).toBeVisible();
  await expect(figure.locator('[data-boundary-line="update-2"]')).toHaveAttribute('stroke-width', '3');
  await assertNoOverflow(page, figure);
});

test('768px keeps forward and backward computational nodes on one line', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/lab/blog/ai/backprop-optimization`, { waitUntil: 'networkidle' });

  const figure = page.locator('[data-computational-graph]');
  for (const tab of ['순전파 값', '역전파 gradient']) {
    await figure.getByRole('tab', { name: tab }).click();
    const nodes = figure.locator('[data-computational-node]');
    const nodeBoxes = await boxes(nodes);
    expect(nodeBoxes).toHaveLength(4);
    expect(Math.max(...nodeBoxes.map((box) => box.y)) - Math.min(...nodeBoxes.map((box) => box.y))).toBeLessThanOrEqual(2);
    expect(nodeBoxes.every((box) => box.width >= 150)).toBe(true);
    const clippedFormulaCount = await nodes.evaluateAll((elements) => elements.filter((element) => {
      const formula = element.querySelector<HTMLElement>('.katex');
      if (!formula) return false;
      return formula.getBoundingClientRect().right > element.getBoundingClientRect().right - 7;
    }).length);
    expect(clippedFormulaCount).toBe(0);
  }
  expect((await figure.boundingBox())?.height ?? Infinity).toBeLessThanOrEqual(360);
  await expect(figure.locator('[data-arrow-right]').first()).toBeVisible();
  await expect(figure.locator('[data-arrow-down]').first()).toBeHidden();
  await assertNoOverflow(page, figure);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
]) {
  test(`${viewport.name} exposes U-Net skip dataflow and the LDM compression trade-off`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/diffusion-models`, { waitUntil: 'networkidle' });

    const skipFlow = page.locator('[data-unet-resolution-flow]');
    await expect(skipFlow.locator('[data-unet-skip-level]')).toHaveCount(2);
    await expect(skipFlow.getByText('E₆₄ [B,C_enc,64,64]', { exact: true })).toBeVisible();
    await expect(skipFlow.getByText('Up(D₃₂) [B,C_dec,64,64]', { exact: true })).toBeVisible();
    await expect(skipFlow.getByText('D̃₆₄ [B,C_dec+C_enc,64,64]', { exact: true })).toBeVisible();
    await assertNoOverflow(page, skipFlow);

    const compression = page.locator('[data-ldm-compression-lab]');
    await compression.getByRole('tab', { name: 'f=32', exact: true }).click();
    await expect(compression.getByText('64 positions · 1024× fewer', { exact: true })).toBeVisible();
    await expect(compression).toContainText('VQ R-FID 31.83 · PSNR 17.45');
    await expect(compression).toContainText('KL 변형 R-FID 2.04 · PSNR 22.27');

    await compression.getByRole('tab', { name: 'f=1', exact: true }).click();
    await expect(compression).toContainText('autoencoder가 없는 identity 기준');
    await assertNoOverflow(page, compression);
  });
}

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`${viewport.name} preserves the intended responsive direction for the three foundation visualizations`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const cases = [
      { route: 'perceptron', figure: '[data-xor-representation]', nodes: '[data-xor-panel]', maxDesktopHeight: 540 },
      { route: 'neural-network', figure: '[data-nn-composition]', nodes: '[data-nn-stage]', maxDesktopHeight: 380 },
      { route: 'backprop-optimization', figure: '[data-computational-graph]', nodes: '[data-computational-node]', maxDesktopHeight: 330 },
    ];

    for (const item of cases) {
      await page.goto(`${base}/lab/blog/ai/${item.route}`, { waitUntil: 'networkidle' });
      const figure = page.locator(item.figure);
      const nodeBoxes = await boxes(figure.locator(item.nodes));
      if (viewport.width === 390) {
        expect(Math.max(...nodeBoxes.map((box) => box.x)) - Math.min(...nodeBoxes.map((box) => box.x))).toBeLessThanOrEqual(2);
        await expect(figure.locator('[data-arrow-down]').first()).toBeVisible();
        await expect(figure.locator('[data-arrow-right]').first()).toBeHidden();
      } else {
        expect(Math.max(...nodeBoxes.map((box) => box.y)) - Math.min(...nodeBoxes.map((box) => box.y))).toBeLessThanOrEqual(2);
        expect((await figure.boundingBox())?.height ?? Infinity).toBeLessThanOrEqual(item.maxDesktopHeight);
        await expect(figure.locator('[data-arrow-right]').first()).toBeVisible();
        await expect(figure.locator('[data-arrow-down]').first()).toBeHidden();
      }
      await assertNoOverflow(page, figure);
    }
  });
}
