import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`LLM serving separates runtime and control-plane paths at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-topdown-research-route="llm-disaggregated-serving"]')).toBeVisible();
    await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);

    const branches = page.locator('[data-subcategory-branches]');
    await expect(branches.getByRole('link')).toHaveCount(2);
    expect(await branches.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
      '/lab/blog/ai?sub=ai-llm-serving-runtime',
      '/lab/blog/ai?sub=ai-llm-serving-operations',
    ]);

    const overflow = await branches.evaluate((element) => ({
      own: element.scrollWidth - element.clientWidth,
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(overflow.own).toBeLessThanOrEqual(1);
    expect(overflow.document).toBeLessThanOrEqual(1);
  });
}

test('Rust from-scratch articles expose the authored implementation order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-from-scratch`, { waitUntil: 'networkidle' });
  const path = page.locator('[data-authored-learning-path="ai-from-scratch-rust"]');
  await expect(path.getByRole('link')).toHaveCount(3);
  expect(await path.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/dezero-autodiff',
    '/lab/blog/ai/dezero-nn',
    '/lab/blog/ai/dezero-advanced',
  ]);
});

test('direct serving article keeps the authored path context', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-scheduler`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-learning-continuity]')).toContainText('SLO에서 시작해');
  await expect(page.getByRole('navigation', { name: '학습 경로 이동' })).toBeVisible();
});

test('agent hub selects a responsibility branch without repeating one long article chain', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-authored-learning-path="ai-agent-system-core"]')).toHaveCount(0);
  await expect(page.locator('[data-branching-learning-hub]')).toContainText('한 줄로 모든 Agent 글을 읽지 않습니다');
  await expect(page.locator('[data-subcategory-branches]').getByRole('link')).toHaveCount(6);

  const route = page.locator('[data-topdown-research-route="ai-agents"]');
  await expect(route).toHaveAttribute('data-route-usage', 'shared-reference');
  await expect(route.getByText('분기에서 막힐 때만 여는 공통 참조', { exact: true })).toBeVisible();
  const internalHrefs = await route.locator('a[href^="/lab/blog/ai/"]').evaluateAll(
    (links) => links.map((link) => link.getAttribute('href')),
  );
  expect(new Set(internalHrefs).size).toBe(internalHrefs.length);
});

test('speech and audio selects one responsibility branch before opening shared foundations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-speech-audio`, { waitUntil: 'networkidle' });

  const branches = page.locator('[data-subcategory-branches]');
  await expect(branches.getByRole('link')).toHaveCount(4);
  expect(await branches.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai?sub=ai-speech-audio-interaction',
    '/lab/blog/ai?sub=ai-speech-audio-generation',
    '/lab/blog/ai?sub=ai-speech-audio-recognition',
    '/lab/blog/ai?sub=ai-speech-audio-representation',
  ]);
  await expect(page.locator('[data-topdown-research-route="speech-audio"]')).toBeVisible();
  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
  await expect(
    page
      .locator('[data-topdown-research-route="speech-audio"] [data-route-stage="current"]')
      .getByRole('heading', { name: 'OpenAI Presence: production voice agent의 정책·승인·개선 loop', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`speech route hub changes responsibility and stays readable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/speech-audio-models`, { waitUntil: 'networkidle' });
    const lab = page.locator('[data-speech-route-lab]');
    await expect(lab).toBeVisible();
    await lab.getByRole('tab', { name: /음성 인식/ }).click();
    await expect(lab.getByText('부분 전사 수정률 · commit delay · 최종 오류율', { exact: true })).toBeVisible();
    await expect(lab.getByRole('link', { name: /음성 인식에서 진단 시작/ })).toHaveAttribute(
      'href',
      '/lab/blog/ai/speech-recognition-objectives?path=ai-speech-audio-recognition',
    );
    await lab.getByRole('tab', { name: /오디오 표현/ }).click();
    await expect(lab.getByText('frame rate · bitrate · reconstruction error', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

for (const branch of [
  { sub: 'ai-speech-audio-interaction', path: 'ai-speech-audio-current-first', count: 1 },
  { sub: 'ai-speech-audio-generation', path: 'ai-speech-audio-generation', count: 1 },
  { sub: 'ai-speech-audio-recognition', path: 'ai-speech-audio-recognition', count: 1 },
  { sub: 'ai-speech-audio-representation', path: 'ai-speech-audio-representation', count: 1 },
]) {
  test(`${branch.sub} keeps only its owned article`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai?sub=${branch.sub}`, { waitUntil: 'networkidle' });
    const path = page.locator(`[data-authored-learning-path="${branch.path}"]`);
    await expect(path.getByRole('link')).toHaveCount(branch.count);
    await expect(page.locator('[data-parent-learning-route]')).toBeVisible();
    await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
  });
}

test('a registered research-track branch returns to the current evidence origin', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-foundations`, { waitUntil: 'networkidle' });

  const origin = page.locator('[data-parent-learning-route]');
  await expect(origin).toContainText('TRACK ORIGIN');
  await expect(origin).toContainText('현재 근거와 최소 기준점 확인');
  await expect(origin).toHaveAttribute('href', '/lab/blog/ai?sub=ai-agents');
});

test('agent evaluation article closes outcome, trace, reliability and regression', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/agent-evaluation-trace`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-agent-eval-workbench]')).toBeVisible();
  await expect(page.locator('[data-reliability-explorer]')).toBeVisible();
  await expect(page.locator('[data-formula-note]')).toHaveCount(3);
  await expect(page.getByText('최초 원인: harness fail-open')).toBeVisible();
  await expect(page.getByText('pass@k', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('pass^k', { exact: false }).first()).toBeVisible();
  const workbenchLabels = await page.locator('[data-agent-eval-workbench] span').evaluateAll((nodes) =>
    nodes
      .filter((node) => ['기준', '후보', 'INPUT', 'TOOL 01', 'TOOL 02', 'TOOL 03', 'OUTPUT'].includes(node.textContent?.trim() ?? ''))
      .map((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
  );
  expect(workbenchLabels.length).toBeGreaterThan(0);
  expect(workbenchLabels.every((size) => size >= 10)).toBe(true);
  const releaseFormula = page.locator('#graders [data-math-fit]').first();
  expect(Number(await releaseFormula.getAttribute('data-math-scale'))).toBeGreaterThanOrEqual(0.75);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('knowledge and time-series entries expose goal-specific paths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-knowledge-systems`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-topdown-research-route="knowledge-systems"]')).toBeVisible();
  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  expect(await page.locator('[data-learning-path-directory] a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/knowledge-compiler?path=ai-knowledge-system-core',
  ]);

  await page.goto(`${base}/lab/blog/ai?sub=ai-timeseries`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-topdown-research-route]')).toHaveCount(0);
  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /01 · Forecasting/ })).toHaveAttribute('href', '/lab/blog/ai?sub=ai-timeseries-forecast');
  await expect(page.getByRole('link', { name: /02 · Anomaly · Incident/ })).toHaveAttribute('href', '/lab/blog/ai?sub=ai-timeseries-anomaly');
  await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
});

test('research watcher separates discovery, identity, promotion and targeted invalidation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/knowledge-research-watcher`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-source-lineage]')).toBeVisible();
  await expect(page.locator('[data-promotion-workbench]')).toBeVisible();
  const watcherFormulaCount = await page.locator('[data-formula-pair]').count();
  expect(watcherFormulaCount).toBeGreaterThanOrEqual(3);
  await expect(page.locator('[data-formula-note]')).toHaveCount(watcherFormulaCount);
  await expect(page.locator('.katex-error')).toHaveCount(0);

  await page.getByRole('button', { name: '정정 알림', exact: false }).click();
  await expect(page.getByText('A-7 공개를 차단하고 P-4만 재작성·재검증')).toBeVisible();

  await page.getByRole('button', { name: '점수만 상승', exact: true }).click();
  await expect(page.locator('[data-promotion-outcome="benchmark"]')).toContainText('현재 글의 비교 근거만 갱신');
  await expect(page.locator('[data-promotion-workbench]').getByText('변경', { exact: true })).toHaveCount(0);
  await expect(page.locator('[data-promotion-workbench]').getByText('동일', { exact: true })).toHaveCount(5);
  await page.getByRole('button', { name: '기반 추가', exact: true }).click();
  await expect(page.locator('[data-promotion-outcome="foundation"]')).toContainText('현재 top 교체 + 최소 기반 1개 추가');

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('time-series current-first article exposes leakage, rolling origin and calibration evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/time-series-forecasting-evaluation`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-forecast-contract]')).toBeVisible();
  await expect(page.locator('[data-rolling-origin]')).toBeVisible();
  await expect(page.locator('[data-formula-note]')).toHaveCount(4);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'TimesFM 2.5', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chronos-2', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Moirai 2.0', exact: true })).toBeVisible();
  expect(await page.locator('[data-rolling-fold]').evaluateAll((folds) => folds.map((fold) => fold.querySelectorAll('[data-segment="target"]').length))).toEqual([2, 2, 2, 2, 2]);
  await page.getByLabel('예측 horizon').fill('48');
  expect(await page.locator('[data-rolling-fold]').evaluateAll((folds) => folds.map((fold) => fold.querySelectorAll('[data-segment="target"]').length))).toEqual([4, 4, 4, 4, 4]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('promptable vision separates prompt contract, temporal identity and multiplex runtime', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vision-promptable-segmentation-tracking`, { waitUntil: 'networkidle' });

  const path = page.locator('[aria-label="Promptable Vision · Concept에서 Video Identity까지 학습 경로"]');
  await expect(path.getByRole('link')).toHaveCount(2);
  await expect(path.getByRole('link').first()).toHaveAttribute('aria-current', 'step');
  await expect(path.getByRole('link').last()).toHaveAttribute('href', '/lab/blog/ai/vision-system-contracts?path=ai-vision-promptable-current-first');

  await path.getByRole('link', { name: /공통 작업 계약/ }).click();
  const retainedPath = page.locator('[aria-label="Promptable Vision · Concept에서 Video Identity까지 학습 경로"]');
  await expect(retainedPath.getByRole('link')).toHaveCount(2);
  await expect(retainedPath.getByRole('link').nth(1)).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('[data-learning-continuity]').getByRole('link', { name: /SAM 3.1 전체 흐름/ })).toHaveAttribute('href', '/lab/blog/ai/vision-promptable-segmentation-tracking?path=ai-vision-promptable-current-first');

  await page.goto(`${base}/lab/blog/ai/vision-promptable-segmentation-tracking`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-prompt-contract]')).toBeVisible();
  await expect(page.locator('[data-vision-lineage]')).toBeVisible();
  await expect(page.locator('[data-tracking-memory]')).toBeVisible();
  await expect(page.locator('[data-object-multiplex]')).toBeVisible();
  await expect(page.locator('[data-formula-note]')).toHaveCount(4);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  const taskPrimer = page.locator('#task-contract');
  await expect(taskPrimer.getByText('Object identity', { exact: true })).toBeVisible();
  await expect(taskPrimer.getByText('Embedding', { exact: true })).toBeVisible();
  await expect(taskPrimer.getByText('Attention', { exact: true })).toBeVisible();
  await expect(taskPrimer.getByText('Spatial memory', { exact: true })).toBeVisible();
  await expect(taskPrimer.getByText('Object pointer', { exact: true })).toBeVisible();
  expect(await page.locator('#task-contract .prose').evaluate((prose) => {
    const explorer = document.querySelector('[data-prompt-contract]');
    return Boolean(explorer && (prose.compareDocumentPosition(explorer) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  expect(await page.locator('#video-memory .prose').first().evaluate((prose) => {
    const explorer = document.querySelector('[data-tracking-memory]');
    return Boolean(explorer && (prose.compareDocumentPosition(explorer) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  await expect(page.locator('#video-memory')).toContainText('아래 timeline 탭에서 정상·가림·distractor·교정 상태가 어떻게 달라지는지 확인한다');
  await expect(page.getByRole('link', { name: 'Video tracking multiplex source' })).toHaveAttribute(
    'href',
    /video_tracking_multiplex\.py$/,
  );
  expect(await page.locator('[data-vision-lineage]').evaluate((viz) => {
    const prose = viz.previousElementSibling;
    return prose?.matches('.prose') ?? false;
  })).toBe(true);

  await page.getByRole('button', { name: 'Point PVS', exact: true }).click();
  await expect(page.getByText('1 selected mask', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Text PCS', exact: true }).click();
  await expect(page.getByText('3 concept masks', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /t4/ }).click();
  await expect(page.getByText('고신뢰 detection으로 re-prompt', { exact: true })).toBeVisible();
  await page.getByLabel('추적 object 수').fill('37');
  await expect(page.getByText('3 passes', { exact: true })).toBeVisible();

  const formulaScales = await page.locator('[data-math-fit]').evaluateAll((items) =>
    items.map((item) => Number((item as HTMLElement).dataset.mathScale ?? '1')),
  );
  expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('generative curriculum connects the current research top to the authored minimum-foundation path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-generative`, { waitUntil: 'networkidle' });

  const topdown = page.locator('[data-topdown-research-route="generative-models"]');
  await expect(topdown.getByRole('link', { name: /내부 해설 읽기/ }).first()).toHaveAttribute(
    'href',
    '/lab/blog/ai/dit-flow-matching-evaluation?track=generative-models',
  );
  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  expect(await page.locator('[data-learning-path-directory] a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/dit-flow-matching-evaluation?path=ai-generative-current-first',
    '/lab/blog/ai/generative-theory?path=ai-generative-core',
  ]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('DiT and Flow article separates model contracts, numerical path and release evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/dit-flow-matching-evaluation`, { waitUntil: 'networkidle' });

  for (const selector of ['[data-five-contracts]', '[data-dit-token-explorer]', '[data-flow-path]', '[data-solver-step]', '[data-generative-eval]']) {
    await expect(page.locator(selector)).toBeVisible();
  }
  await expect(page.locator('[data-formula-note]')).toHaveCount(5);
  await expect(page.locator('.katex-error')).toHaveCount(0);

  await page.locator('[data-five-contracts]').getByRole('button', { name: /C · Few-step student/ }).click();
  await expect(page.locator('[data-five-contracts] [data-changed-count]')).toHaveAttribute('data-changed-count', '5');

  const tokens = page.locator('[data-dit-token-explorer]');
  await tokens.getByRole('button', { name: '1', exact: true }).click();
  await expect(tokens.getByText('16.4K', { exact: true })).toBeVisible();
  await expect(tokens.getByText('268.4M', { exact: true })).toBeVisible();

  await page.locator('[data-flow-path]').getByRole('button', { name: '교차 쌍', exact: true }).click();
  await expect(page.locator('[data-flow-path]').getByText('높음', { exact: true })).toBeVisible();
  await page.locator('[data-generative-eval]').getByLabel('candidate count').fill('9');
  await expect(page.locator('[data-generative-eval]').getByText('9× budget', { exact: true })).toBeVisible();

  const formulaScales = await page.locator('[data-math-fit]').evaluateAll((items) => (
    items.map((item) => Number((item as HTMLElement).dataset.mathScale ?? '1'))
  ));
  expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.68);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

for (const target of [
  { slug: 'speech-audio-models', path: 'Speech · Audio · 동시 대화 제품 진단', steps: 3, current: 0 },
  { slug: 'realtime-duplex-voice-systems', path: 'Speech · Audio · 동시 대화 제품 진단', steps: 3, current: 1 },
  { slug: 'world-model-physical-ai', path: 'World Model · 관측에서 행동과 폐루프까지', steps: 4, current: 0 },
]) {
  test(`${target.slug} starts from the current target and exposes its just-in-time foundations`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const route = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(route.getByRole('link')).toHaveCount(target.steps);
    await expect(route.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
    const overflow = await route.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

for (const leaf of [
  {
    sub: 'ai-open-models-overview',
    paths: ['ai-open-image-current-first', 'ai-open-video-current-first'],
    counts: [5, 5],
  },
  { sub: 'ai-open-models-comfyui', paths: ['ai-open-model-comfyui'], counts: [8] },
  { sub: 'ai-open-models-ltx', paths: ['ai-open-model-ltx'], counts: [4] },
  { sub: 'ai-open-models-animation', paths: ['ai-open-model-animation'], counts: [6] },
  {
    sub: 'ai-practical-data',
    paths: [
      'ai-practical-data-audit',
      'ai-practical-feature-signals',
      'ai-practical-augmentation-contract',
      'ai-practical-rare-event-decision',
    ],
    counts: [1, 1, 1, 1],
  },
  {
    sub: 'ai-practical-tabular',
    paths: [
      'ai-practical-tabular-static',
      'ai-timeseries-anomaly',
      'ai-practical-tabular-temporal',
      'ai-timeseries-anomaly-ecod',
      'ai-timeseries-forecast-point-in-time',
    ],
    counts: [2, 1, 2, 1, 1],
  },
  {
    sub: 'ai-practical-pipeline',
    paths: [
      'ai-practical-training-run',
      'ai-practical-transfer-adaptation',
      'ai-practical-update-control',
      'ai-practical-generalization-control',
    ],
    counts: [1, 1, 1, 1],
  },
  { sub: 'ai-practical-cv', paths: ['ai-practical-cv-classification', 'ai-practical-cv-video'], counts: [2, 2] },
  { sub: 'ai-practical-embedding', paths: ['ai-practical-image-retrieval', 'ai-practical-text-embedding'], counts: [3, 1] },
  {
    sub: 'ai-practical-compression',
    paths: [
      'ai-practical-compression-budget',
      'ai-practical-compression-quantization',
      'ai-practical-compression-pruning',
      'ai-practical-compression-distillation',
    ],
    counts: [1, 1, 1, 1],
  },
  { sub: 'ai-practical-llm', paths: ['ai-practical-llm-adaptation'], counts: [1] },
  { sub: 'ai-practical-strategy', paths: ['ai-practical-competition'], counts: [6] },
  { sub: 'ai-agents-claw-core', paths: ['ai-claw-core'], counts: [4] },
  { sub: 'ai-agents-claw-security', paths: ['ai-claw-security'], counts: [3] },
  { sub: 'ai-agents-claw-lifecycle', paths: ['ai-claw-lifecycle'], counts: [3] },
  { sub: 'ai-agents-claw-infra', paths: ['ai-claw-infra'], counts: [4] },
  { sub: 'ai-agents-claw-ops', paths: ['ai-claw-ops'], counts: [5] },
]) {
  test(`${leaf.sub} exposes only authored goal paths`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai?sub=${leaf.sub}`, { waitUntil: 'networkidle' });
    const paths = page.locator('[data-authored-learning-path]');
    expect(await paths.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-authored-learning-path')))).toEqual(leaf.paths);
    for (let index = 0; index < leaf.paths.length; index += 1) {
      await expect(page.locator(`[data-authored-learning-path="${leaf.paths[index]}"]`).getByRole('link')).toHaveCount(leaf.counts[index]);
    }
    await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
    const overflow = await page.locator('[data-authored-article-sequences]').evaluate(() => (
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    ));
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
