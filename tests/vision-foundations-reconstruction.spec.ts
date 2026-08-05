import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function expectArticleContract(page: import('@playwright/test').Page, formulas: number) {
  await expect(page.locator('[data-math-fit]')).toHaveCount(formulas);
  await expect(page.locator('[data-formula-note]')).toHaveCount(formulas);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.locator('article table')).toHaveCount(0);
  const result = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => {
    const katex = element.querySelector<HTMLElement>('.katex');
    const source = (element as HTMLElement).dataset.mathSource ?? '';
    const pair = element.closest<HTMLElement>('[data-formula-pair]');
    return {
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number((element as HTMLElement).dataset.mathScale ?? '1'),
      fontSize: katex ? Number.parseFloat(getComputedStyle(katex).fontSize) : 0,
      koreanAnnotation: /\\text\{[^}]*[가-힣][^}]*\}/.test(source),
      note: pair?.querySelector<HTMLElement>('[data-formula-note]')?.innerText ?? '',
    };
  }));
  for (const formula of result) {
    expect(formula.overflow).toBeLessThanOrEqual(1);
    expect(formula.scale).toBeGreaterThanOrEqual(0.7);
    expect(formula.fontSize).toBeGreaterThanOrEqual(12);
    expect(formula.koreanAnnotation).toBe(true);
    expect(formula.note.trim().length).toBeGreaterThan(20);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
}

for (const viewport of viewports) {
  test(`CNN reconstructs local operation and geometry on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/cnn`, { waitUntil: 'networkidle' });
    const probe = page.locator('[data-convolution-probe]');
    await expect(probe).toHaveAttribute('data-kernel', 'edge');
    await probe.getByRole('button', { name: '평균 내기', exact: true }).click();
    await expect(probe).toHaveAttribute('data-kernel', 'blur');
    const geometry = page.locator('[data-convolution-geometry]');
    await geometry.getByRole('button', { name: 'Depthwise', exact: true }).click();
    await expect(geometry).toHaveAttribute('data-mode', 'depthwise');
    await expectArticleContract(page, 4);
    const equivarianceNote = page.locator('[data-formula-note]').nth(1);
    await expect(equivarianceNote).toContainText('Tδ');
    await expect(equivarianceNote).toContainText('K⋆X');
    await expect(equivarianceNote).toContainText('δ');
    expect(errors).toEqual([]);
  });

  test(`ResNet separates identity and projection paths on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/resnet`, { waitUntil: 'networkidle' });
    const path = page.locator('[data-residual-path]');
    await path.getByRole('button', { name: 'Projection', exact: true }).click();
    await expect(path).toHaveAttribute('data-mode', 'projection');
    const stage = page.locator('[data-residual-stage]');
    await stage.getByRole('button', { name: 'Stage 전환', exact: true }).click();
    await expect(stage).toHaveAttribute('data-stage', 'downsample');
    await expect(stage.getByText('1×1, s=2 → 28×28×128', { exact: true })).toBeVisible();
    const cost = page.locator('[data-bottleneck-cost]');
    await cost.getByRole('button', { name: 'Wide 3×3', exact: true }).click();
    await expect(cost).toHaveAttribute('data-kind', 'wide3x3');
    await expect(cost.getByText('4d → 4d → 4d', { exact: true })).toBeVisible();
    await expect(cost.getByText('288·H·W·d²', { exact: true })).toBeVisible();
    await expect(cost.getByText('3,699,376,128', { exact: true })).toBeVisible();
    await expectArticleContract(page, 7);
    expect(errors).toEqual([]);
  });

  test(`ViT exposes patch cost and backbone branches on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/vision-transformer`, { waitUntil: 'networkidle' });
    await expect(page.getByText('Normalize', { exact: true })).toHaveCount(2);
    await expect(page.getByText('MLP에 넣기 전 feature scale을 다시 정리한다.', { exact: true })).toBeVisible();
    const patch = page.locator('[data-patch-budget]');
    await patch.getByRole('button', { name: 'P = 8', exact: true }).click();
    await expect(patch).toHaveAttribute('data-patch', '8');
    await expect(patch.getByText('784', { exact: true })).toBeVisible();
    const shape = page.locator('[data-vit-shape-readout]');
    await shape.getByRole('button', { name: 'Patch만', exact: true }).click();
    await expect(shape).toHaveAttribute('data-token-contract', 'patch-only');
    await expect(shape).toHaveAttribute('data-readout', 'cls');
    await expect(shape).toHaveAttribute('data-readout-valid', 'false');
    await expect(shape.getByText('사용 불가', { exact: true })).toBeVisible();
    await shape.getByRole('button', { name: '평균', exact: true }).click();
    await expect(shape).toHaveAttribute('data-token-contract', 'patch-only');
    await expect(shape).toHaveAttribute('data-readout-valid', 'true');
    await expect(shape.getByText('[2, 768]', { exact: true })).toBeVisible();
    const branch = page.locator('[data-vision-backbone]');
    await branch.getByRole('button', { name: '계층형 stage · OFF', exact: true }).click();
    await expect(branch).toHaveAttribute('data-hierarchy', 'on');
    await expect(branch.getByText('Stage마다 grid를 줄인 multi-scale feature', { exact: true })).toBeVisible();
    await expectArticleContract(page, 6);
    expect(errors).toEqual([]);
  });
}
