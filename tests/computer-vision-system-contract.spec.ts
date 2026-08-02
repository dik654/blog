import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function expectHitAreasAtLeast44(locator: import('@playwright/test').Locator) {
  const sizes = await locator.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(sizes.length).toBeGreaterThan(0);
  expect(sizes.every((height) => height >= 44)).toBeTruthy();
}

async function expectResponsiveMath(page: import('@playwright/test').Page, expected: number) {
  await expect(page.locator('[data-math-fit]')).toHaveCount(expected);
  await expect(page.locator('[data-formula-note]')).toHaveCount(expected);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  const audit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
    overflow: element.scrollWidth - element.clientWidth,
    scale: Number(element.getAttribute('data-math-scale') ?? '1'),
    fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
    rawLatex: /\\(?:underbrace|overbrace|operatorname|begin|frac)/.test((element as HTMLElement).innerText ?? ''),
  })));
  for (const formula of audit) {
    expect(formula.overflow).toBeLessThanOrEqual(1);
    expect(formula.scale).toBeGreaterThanOrEqual(0.7);
    expect(formula.fontSize).toBeGreaterThanOrEqual(12);
    expect(formula.rawLatex).toBe(false);
  }
}

async function expectAllMathFits(page: import('@playwright/test').Page) {
  await expect(page.locator('.katex-error')).toHaveCount(0);
  const audit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
    overflow: element.scrollWidth - element.clientWidth,
    scale: Number(element.getAttribute('data-math-scale') ?? '1'),
    fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
    rawLatex: /\\(?:underbrace|operatorname|begin|frac)/.test((element as HTMLElement).innerText ?? ''),
  })));
  expect(audit.length).toBeGreaterThan(0);
  for (const formula of audit) {
    expect(formula.overflow).toBeLessThanOrEqual(1);
    expect(formula.scale).toBeGreaterThanOrEqual(0.7);
    expect(formula.fontSize).toBeGreaterThanOrEqual(12);
    expect(formula.rawLatex).toBe(false);
  }
}

for (const viewport of viewports) {
  test(`vision contracts keep task, coordinates and release gates readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/vision-system-contracts`, { waitUntil: 'networkidle' });
    const task = page.locator('[data-vision-task-lab]');
    await expect(task).toHaveAttribute('data-task', 'detect');
    await task.getByRole('button', { name: 'Tracking', exact: true }).click();
    await expect(task).toHaveAttribute('data-task', 'track');
    await expect(task.getByText('frame 128 · memory active', { exact: true })).toBeVisible();
    const transform = page.locator('[data-coordinate-transform-lab]');
    await transform.getByRole('button', { name: '중앙 crop', exact: true }).click();
    await expect(transform).toHaveAttribute('data-transform', 'crop');
    const release = page.locator('[data-vision-release-gate]');
    await expect(release).toHaveAttribute('data-decision', 'blocked');
    await expect(release).toHaveAttribute('data-evidence-status', 'missing');
    await expect(release.getByText('미연결', { exact: true })).toHaveCount(4);
    await release.getByRole('button', { name: '통과 예시', exact: true }).click();
    await expect(release).toHaveAttribute('data-decision', 'release');
    await expect(release).toHaveAttribute('data-evidence-status', 'illustrative-fixture');
    await expectHitAreasAtLeast44(task.getByRole('button'));
    await expectHitAreasAtLeast44(transform.getByRole('button'));
    await expectHitAreasAtLeast44(release.getByRole('button'));
    await expect(page.getByRole('link', { name: '선형대수와 Tensor Shape', exact: true })).toHaveAttribute('href', '/lab/blog/ai/linear-algebra-tensors');
    await expect(page.getByRole('link', { name: '통계와 일반화', exact: true })).toHaveAttribute('href', '/lab/blog/ai/statistics-generalization');
    await expectResponsiveMath(page, 4);
    await expect(page.locator('article table')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test(`detector branches keep vocabulary, duplicate and manifest failures distinct on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/object-detection-systems`, { waitUntil: 'networkidle' });
    const branch = page.locator('[data-detection-branch-lab]');
    await branch.getByRole('button', { name: 'Open vocabulary', exact: true }).click();
    await expect(branch).toHaveAttribute('data-branch', 'open');
    await expect(branch.getByText('phrase-grounded boxes', { exact: true })).toBeVisible();
    const decision = page.locator('[data-detection-decision-lab]');
    await decision.getByRole('button', { name: '좌표 오류', exact: true }).click();
    await expect(decision).toHaveAttribute('data-result', 'blocked');
    const release = page.locator('[data-detection-release-gate]');
    await expect(release).toHaveAttribute('data-decision', 'blocked');
    await expect(release).toHaveAttribute('data-evidence-status', 'missing');
    await release.getByRole('button', { name: 'Manifest', exact: true }).click();
    await expect(release).toHaveAttribute('data-decision', 'blocked');
    await expect(release.getByText('postprocess revision 없음', { exact: true })).toBeVisible();
    await expectHitAreasAtLeast44(branch.getByRole('button'));
    await expectHitAreasAtLeast44(decision.getByRole('button'));
    await expectHitAreasAtLeast44(release.getByRole('button'));
    const thresholdSymbols = await page.locator('#postprocess [data-formula-note] .katex-html').allTextContents();
    expect(thresholdSymbols.some((symbol) => symbol.includes('τ'))).toBeTruthy();
    await expectResponsiveMath(page, 4);
    await expect(page.locator('article table')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test(`CLIP alignment exposes batch, grounding boundary and retrieval failures on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/clip-vision-language-model`, { waitUntil: 'networkidle' });
    const alignment = page.locator('[data-clip-alignment-lab]');
    await expect(alignment).toHaveAttribute('data-step', 'pairs');
    await alignment.getByRole('button', { name: 'Zero-shot', exact: true }).click();
    await expect(alignment).toHaveAttribute('data-step', 'use');
    await expect(alignment.getByText(/Global CLIP score만으로/)).toBeVisible();
    const retrieval = page.locator('[data-clip-retrieval-lab]');
    await retrieval.getByRole('button', { name: 'Prompt 이동', exact: true }).click();
    await expect(retrieval).toHaveAttribute('data-fixture', 'prompt-shift');
    await expect(retrieval.getByText('P@3 0.33 · MRR 0.33', { exact: true })).toBeVisible();
    await expect(retrieval).toHaveAttribute('data-evidence-status', 'illustrative-fixture');
    await expect(retrieval.getByText(/release evidence로 사용할 수 없다/)).toBeVisible();
    await expectHitAreasAtLeast44(alignment.getByRole('button'));
    await expectHitAreasAtLeast44(retrieval.getByRole('button'));
    await expectResponsiveMath(page, 4);
    await expect(page.locator('article table')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test(`Deformable DETR keeps sparse sampling and metric diagnosis readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/deformable-detr`, { waitUntil: 'networkidle' });
    const lab = page.locator('[data-deformable-detr-lab]');
    await expect(lab).toContainText('교육용 좌표');
    await lab.getByRole('button', { name: '큰 객체', exact: true }).click();
    await lab.locator('#detr-levels').fill('2');
    await expect(lab.getByText('19,200', { exact: true })).toBeVisible();
    await expectHitAreasAtLeast44(lab.getByRole('button'));
    await expectHitAreasAtLeast44(lab.locator('input[type="range"]'));
    const assignmentTabs = page.locator('[data-detr-assignment-lab]');
    const rawTab = assignmentTabs.getByRole('tab', { name: '예측 집합', exact: true });
    await rawTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(assignmentTabs.getByRole('tab', { name: '일대일 배정', exact: true })).toBeFocused();
    await expect(assignmentTabs.getByRole('tab', { name: '일대일 배정', exact: true })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(assignmentTabs.getByRole('tab', { name: '학습 loss', exact: true })).toBeFocused();
    const evidenceTabs = page.locator('[data-detr-evidence-lab]');
    await evidenceTabs.getByRole('tab', { name: '수렴 비용', exact: true }).focus();
    await page.keyboard.press('Home');
    await expect(evidenceTabs.getByRole('tab', { name: '객체 크기', exact: true })).toBeFocused();
    await expectHitAreasAtLeast44(evidenceTabs.getByRole('tab'));
    await expectAllMathFits(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('computer vision parent exposes four ordered branches without duplicating authored paths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-vision`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-topdown-research-route="computer-vision"]')).toBeVisible();
  for (const branch of ['00 · 작업 계약', '01 · Promptable · Tracking', '02 · Object Detection', '03 · 표현 · Backbone 기반']) {
    await expect(page.getByRole('link', { name: new RegExp(branch) }).first()).toBeVisible();
  }
  const branches = page.locator('[data-subcategory-branches]');
  expect(await branches.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai?sub=ai-vision-overview',
    '/lab/blog/ai?sub=ai-vision-promptable',
    '/lab/blog/ai?sub=ai-vision-detection',
    '/lab/blog/ai?sub=ai-vision-foundations',
  ]);
  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  await page.goto(`${base}/lab/blog/ai/vision-system-contracts`, { waitUntil: 'networkidle' });
  const articlePath = page.locator('[aria-label="Vision 작업 계약 · 제품 질문에서 측정까지 학습 경로"]');
  expect(await articlePath.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/vision-system-contracts?path=ai-vision-contract-current-first',
    '/lab/blog/ai/linear-algebra-tensors?path=ai-vision-contract-current-first',
    '/lab/blog/ai/statistics-generalization?path=ai-vision-contract-current-first',
  ]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('tensor foundation exposes the object axis promised by the vision contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/linear-algebra-tensors`, { waitUntil: 'networkidle' });
  await expect(page.getByText('Detection output', { exact: true })).toBeVisible();
  await expect(page.getByText('[batch, objects, 4 + classes]', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
