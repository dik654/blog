import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const route = '/lab/blog/ai/linear-algebra-tensors';

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
          text: (element.textContent ?? '').trim().slice(0, 60),
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
  expect(result.formulas.every((formula) => formula.scale >= 0.8)).toBeTruthy();
}

test('article builds coordinates into tensor runtime without exposing raw LaTeX', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  for (const title of [
    '대상, 축, 좌표를 먼저 분리한다',
    '행렬은 direction을 섞는 규칙이다',
    '길이와 방향을 분해해 읽는다',
    '행렬곱은 한 축을 합쳐 없애는 계산이다',
    '축에 이름을 붙이면 attention도 한 줄로 읽힌다',
    'Broadcastable과 의미상 올바름은 다르다',
    'Shape 다음에는 stride, dtype, byte를 본다',
  ]) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }

  await expect(page.locator('[data-coordinate-frame-lab]')).toHaveCount(1);
  await expect(page.locator('[data-similarity-projection-lab]')).toHaveCount(1);
  await expect(page.locator('[data-shape-contraction-lab]')).toHaveCount(1);
  await expect(page.locator('[data-tensor-layout-memory-lab]')).toHaveCount(1);
  await expect(page.locator('[data-formula-note]')).toHaveCount(10);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('연산 성공 · sample 의도는 실패');
  expect(bodyText).toContain('PyTorch nn.Linear 저장 규약');
  expect(bodyText).not.toContain(String.raw`\underbrace`);
  expect(bodyText).not.toContain(String.raw`\theta`);
  expect(bodyText).not.toContain(String.raw`\frac`);

  for (const slug of [
    'linear-algebra-decompositions',
    'attention-theory',
    'robot-kinematics-coordinate-frames',
    'quantization',
    'llm-disaggregated-serving',
    'video-model-runtime',
    'llm-interpretability-readouts',
    'vision-system-contracts',
    'efficient-inference-on-device',
  ]) {
    await expect(page.locator(`a[href$="/${slug}"]`).first()).toBeVisible();
  }
});

test('coordinate and similarity labs change the intended quantity only', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const coordinates = page.locator('[data-coordinate-frame-lab]');
  const initialWorld = [
    await coordinates.getAttribute('data-world-x'),
    await coordinates.getAttribute('data-world-y'),
  ];
  const initialCoordinate = [
    await coordinates.getAttribute('data-coordinate-x'),
    await coordinates.getAttribute('data-coordinate-y'),
  ];
  await coordinates.locator('#coordinate-frame-angle').fill('65');
  await expect(coordinates).toHaveAttribute('data-world-x', initialWorld[0] ?? '');
  await expect(coordinates).toHaveAttribute('data-world-y', initialWorld[1] ?? '');
  expect([
    await coordinates.getAttribute('data-coordinate-x'),
    await coordinates.getAttribute('data-coordinate-y'),
  ]).not.toEqual(initialCoordinate);

  await coordinates.getByRole('button', { name: '벡터를 회전', exact: true }).click();
  await expect(coordinates).toHaveAttribute('data-coordinate-mode', 'vector');
  expect(await coordinates.getAttribute('data-world-x')).not.toBe(initialWorld[0]);

  const similarity = page.locator('[data-similarity-projection-lab]');
  const initialDot = await similarity.getAttribute('data-dot');
  const initialCosine = await similarity.getAttribute('data-cosine');
  await expect(similarity).toContainText('vector projection');
  await expect(similarity).toContainText('compₐ(b)·a');
  await similarity.locator('#similarity-length').fill('2');
  expect(await similarity.getAttribute('data-dot')).not.toBe(initialDot);
  await expect(similarity).toHaveAttribute('data-cosine', initialCosine ?? '');
  await similarity.locator('#similarity-length').fill('0');
  await expect(similarity).toHaveAttribute('data-cosine', 'undefined');
});

test('contraction and layout labs expose real index and memory transitions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const contraction = page.locator('[data-shape-contraction-lab]');
  const linearIndex = await contraction.getAttribute('data-contraction-index');
  await contraction.getByRole('button', { name: 'Attention', exact: true }).click();
  await expect(contraction).toHaveAttribute('data-contraction-mode', 'attention');
  expect(await contraction.getAttribute('data-contraction-index')).not.toBe(linearIndex);
  const firstTotal = await contraction.getAttribute('data-contraction-total');
  await contraction.getByRole('button', { name: /key s=/ }).click();
  expect(await contraction.getAttribute('data-contraction-total')).not.toBe(firstTotal);

  const layout = page.locator('[data-tensor-layout-memory-lab]');
  await layout.getByRole('button', { name: '축 교환', exact: true }).click();
  await expect(layout).toHaveAttribute('data-layout-stage', 'permuted');
  await expect(layout).toContainText('[10,1,5]');
  await expect(layout).toContainText('원본과 공유');
  await layout.getByRole('button', { name: '평탄화', exact: true }).click();
  await expect(layout).toHaveAttribute('data-layout-stage', 'reshaped');
  await expect(layout).toContainText('이 예제는 copy');

  const bf16Bytes = await layout.getAttribute('data-kv-bytes');
  await layout.getByRole('button', { name: 'INT8 · 1B', exact: true }).click();
  expect(Number(await layout.getAttribute('data-kv-bytes'))).toBe(Number(bf16Bytes) / 2);
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
      '[data-coordinate-frame-lab] button, [data-coordinate-frame-lab] input, '
      + '[data-similarity-projection-lab] button, [data-similarity-projection-lab] input, '
      + '[data-shape-contraction-lab] button, '
      + '[data-tensor-layout-memory-lab] button, [data-tensor-layout-memory-lab] input',
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
