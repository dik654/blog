import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`LLM architecture overview teaches a lineage instead of a fact table on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/llm-architecture-gallery`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '최소 다섯 구조로 기준 계보 잡기' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '최신 구조는 이제 token 안쪽만 바꾸지 않는다' })).toBeVisible();
    await expect(page.getByText('CURRENT QUESTION · 2026-06까지 공개된 근거')).toBeVisible();
    await expect(page.getByRole('link', { name: 'DeepSeek — DeepSeek-V4 technical report' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Moonshot AI — Attention Residuals' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Google DeepMind — Gemma 4 12B' })).toBeVisible();
    await expect(page.getByText('Extracted fact sheet')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('[data-formula-note]')).toHaveCount(5);
    await expect(page.locator('#foundation-contract .katex-error')).toHaveCount(0);
    await expect(page.locator('#foundation-contract')).not.toContainText('□');
    await expect(page.locator('[data-architecture-fingerprint]')).toBeVisible();
    await expect(page.locator('[data-learning-continuity]')).toBeVisible();
    await expect(page.getByRole('link', { name: /KV Cache와 Long Context/ }).first()).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-kv-long-context');
    await expect(page.getByRole('link', { name: /실제 보고서 검산 · DeepSeek-V3.2/ })).toHaveAttribute('href', '/lab/blog/ai/research-deepseek-v3-2-2025');

    const compass = page.locator('[data-current-architecture-compass]');
    await expect(compass).toBeVisible();
    await expect(compass.getByRole('tab')).toHaveCount(3);
    await expect(compass.locator('[data-axis-active="true"]')).toHaveCount(3);
    await compass.getByRole('tab', { name: /Attention Residuals/ }).click();
    await expect(compass.getByRole('tabpanel')).toContainText('layer 깊이 방향');
    await expect(compass.locator('[data-axis-active="true"]')).toHaveCount(1);
    await compass.getByRole('tab', { name: /Gemma 4 12B/ }).click();
    await expect(compass.getByRole('tabpanel')).toContainText('얕은 embedding·projection');
    await expect(compass.locator('[data-axis-active="true"]')).toContainText('입력 경계');

    const sequence = page.locator('[data-architecture-milestone-sequence]');
    const milestoneDiagrams = sequence.locator('[data-architecture-native-diagram]');
    await expect(sequence.getByRole('tab')).toHaveCount(5);
    await expect(milestoneDiagrams).toHaveCount(1);
    await expect(page.locator('#five-milestones img')).toHaveCount(0);
    await expect(page.locator('#five-milestones a[aria-label$="구조도 원본 크기로 열기"]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'GPT-2 XL · dense 기준점 구조도 원본 크기로 열기' })).toHaveAttribute('target', '_blank');
    await expect(sequence.locator('[data-architecture-kind="gpt2"]')).toContainText('48개 block');

    const lineageChecks = [
      { tab: /Llama 3/, kind: 'llama3', text: '공유 K/V 묶음' },
      { tab: /Gemma 3/, kind: 'gemma3', text: 'GLOBAL 6' },
      { tab: /DeepSeek V3/, kind: 'deepseek-v3', text: 'Router score' },
      { tab: /Kimi Linear/, kind: 'kimi-linear', text: 'KDA state' },
    ];
    for (const check of lineageChecks) {
      await sequence.getByRole('tab', { name: check.tab }).click();
      await expect(sequence.locator(`[data-architecture-kind="${check.kind}"]`)).toContainText(check.text);
      await expect(milestoneDiagrams).toHaveCount(1);
    }
    await expect(sequence.locator('[data-architecture-kind="kimi-linear"]').getByText('KDA state', { exact: true })).toHaveCount(3);

    const diagramTextSize = await milestoneDiagrams.locator('p').evaluateAll((elements) => (
      Math.min(...elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)))
    ));
    expect(diagramTextSize).toBeGreaterThanOrEqual(12);
    const clippedDiagramCount = await milestoneDiagrams.evaluateAll((diagrams) => diagrams.filter(
      (diagram) => diagram.scrollWidth > diagram.clientWidth + 1,
    ).length);
    expect(clippedDiagramCount).toBe(0);

    const fingerprint = page.locator('[data-architecture-fingerprint]');
    await expect(fingerprint.locator('[data-architecture-kv]')).toContainText('1.50 GiB');
    await expect(fingerprint.locator('[data-architecture-kv]')).toContainText('8:1 공유');
    await expect(fingerprint.locator('[data-architecture-layer-mix]')).toContainText('39 / 9');
    await expect(fingerprint.locator('[data-architecture-layer-mix]')).toContainText('4.33:1');
    await expect(fingerprint.locator('[data-architecture-active-ratio]')).toContainText('3.125%');
    await expect(fingerprint.locator('[data-architecture-depth]')).toContainText('6 → 2');

    await fingerprint.getByLabel('Architecture batch size').fill('1');
    await expect(fingerprint.locator('[data-architecture-kv]')).toContainText('0.75 GiB');
    await fingerprint.getByLabel('Architecture batch size').fill('2');
    await fingerprint.getByRole('button', { name: 'Architecture context 16384' }).click();
    await expect(fingerprint.locator('[data-architecture-kv]')).toContainText('3.00 GiB');
    await fingerprint.getByRole('button', { name: 'Architecture context 8192' }).click();
    await fingerprint.getByRole('button', { name: 'Architecture KV heads 32' }).click();
    await expect(fingerprint.locator('[data-architecture-kv]')).toContainText('12.00 GiB');
    await expect(fingerprint.locator('[data-architecture-kv]')).toContainText('1:1 공유');
    await expect(fingerprint.locator('[data-architecture-kv-saving]')).toHaveText('0.0%');
    await fingerprint.getByLabel('Architecture routed top k').fill('16');
    await expect(fingerprint.locator('[data-architecture-active-ratio]')).toContainText('6.250%');
    await fingerprint.getByLabel('Architecture layer count').fill('50');
    await expect(fingerprint.locator('[data-architecture-layer-mix]')).toContainText('40 / 10');
    await expect(fingerprint.locator('[data-architecture-layer-mix]')).toContainText('4.00:1');

    const minFormulaFont = await page.locator('[data-math-fit]').evaluateAll((elements) => Math.min(...elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize))));
    expect(minFormulaFont).toBeGreaterThanOrEqual(12);
    const minFormulaScale = await page.locator('#foundation-contract [data-math-fit]').evaluateAll((elements) => (
      Math.min(...elements.map((element) => Number.parseFloat(element.getAttribute('data-math-scale') ?? '1')))
    ));
    expect(minFormulaScale).toBeGreaterThanOrEqual(0.8);
    const minKatexFont = await page.locator('#foundation-contract [data-math-fit] .katex').evaluateAll((elements) => (
      Math.min(...elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)))
    ));
    expect(minKatexFont).toBeGreaterThanOrEqual(viewport.width === 390 ? 14 : viewport.width === 768 ? 16 : 18);
    await expect(page.locator('#foundation-contract [data-math-annotated="true"]')).toHaveCount(18);
    await expect(page.locator('#foundation-contract [data-math-annotation-missing="true"]')).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  for (const slug of [
    'llm-architecture-dense-transformers',
    'llm-architecture-kv-long-context',
    'llm-architecture-sparse-moe',
    'llm-architecture-hybrid-linear',
  ]) {
    test(`${slug} keeps explanation before verification data on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'domcontentloaded' });

      await expect(page.getByText('Extracted fact sheet')).toHaveCount(0);
      await expect(page.locator('article table')).toHaveCount(0);
      await expect(page.locator('[data-formula-note]').first()).toBeVisible();
      await expect(page.locator('[data-learning-continuity]')).toBeVisible();
      const viewer = page.locator('[data-architecture-figure-viewer]').first();
      await expect(viewer).toBeVisible();
      await expect(viewer.getByRole('tab')).toHaveCount(slug === 'llm-architecture-dense-transformers' ? 5 : 3);
      const firstSource = await viewer.locator('img').getAttribute('src');
      await viewer.getByRole('tab').nth(1).click();
      await expect(viewer.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
      await expect.poll(async () => viewer.locator('img').getAttribute('src')).not.toBe(firstSource);
      await expect.poll(async () => viewer.locator('img').evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(viewer.getByLabel('시각화 전체화면으로 보기')).toBeVisible();
      await viewer.getByLabel('시각화 전체화면으로 보기').click();
      await expect(viewer).toHaveClass(/article-viz-expanded/);
      await viewer.getByLabel('전체화면 닫기').click();
      await expect(viewer).not.toHaveClass(/article-viz-expanded/);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

test('learning continuity explains transitions for articles outside the LLM architecture family', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ['/lab/blog/ai/perceptron', '/lab/blog/blockchain/reth-db']) {
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
    const continuity = page.locator('[data-learning-continuity]');
    await expect(continuity).toBeVisible();
    await expect(continuity).toContainText('앞에서 가져올 것');
    await expect(continuity).toContainText('이번 글에서 도달할 것');
    await expect(continuity).toContainText('이후에 확장할 것');
  }
});

test('LLM architecture category exposes one ordered starting route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-architectures-overview`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 1, name: '00 · 구조 읽는 출발점' })).toBeVisible();
  await expect(page.getByText('LLM 아키텍처 · 2026 변화에서 최소 기준으로 내려가는 경로', { exact: true })).toBeVisible();
  await expect(page.getByText('00 · 구조 전체 지도', { exact: true })).toHaveCount(0);

  const labels = ['00 · 구조 읽는 출발점', '01 · Dense 기준점', '02 · KV와 긴 문맥', '03 · Sparse MoE', '04 · Hybrid와 상태', '05 · 실제 보고서 검산'];
  const positions = await Promise.all(labels.map(async (label) => {
    const item = page.getByText(label, { exact: true }).first();
    await expect(item).toBeVisible();
    return item.evaluate((element) => element.getBoundingClientRect().top);
  }));
  expect(positions).toEqual([...positions].sort((a, b) => a - b));

  const pathLabels = await page.getByLabel('LLM 아키텍처 · 2026 변화에서 최소 기준으로 내려가는 경로 학습 경로').getByRole('link').evaluateAll(
    (links) => links.map((link) => link.getAttribute('data-learning-step-label')),
  );
  expect(pathLabels).toEqual([
    '1. 현재 구조 질문',
    '2. Dense 기준점',
    '3. KV·문맥',
    '4. Sparse MoE',
    '5. 선택 분기 · Hybrid·State',
    '6. 통합 보고서',
  ]);

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-architectures-case-study`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: '05 · 실제 보고서 검산' })).toBeVisible();
  await expect(page.getByRole('link', { name: /실전 보고서 검산 · DeepSeek-V3.2/ })).toHaveAttribute('href', '/lab/blog/ai/research-deepseek-v3-2-2025');
});
