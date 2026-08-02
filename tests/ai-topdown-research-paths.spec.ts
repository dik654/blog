import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const tracks = [
  ['ai-knowledge-systems', 'knowledge-systems'],
  ['ai-robotics', 'robot-ai'],
  ['ai-llm-architectures', 'llm-architecture'],
  ['ai-multimodal', 'multimodal-foundation-models'],
  ['ai-llm-post-training', 'llm-post-training'],
  ['ai-llm-interpretability', 'llm-interpretability'],
  ['ai-generative', 'generative-models'],
  ['ai-open-models', 'open-image-video'],
  ['ai-vision', 'computer-vision'],
  ['ai-ocr', 'document-ai'],
  ['ai-nlp', 'nlp-attention'],
  ['ai-reinforcement-learning', 'reinforcement-learning'],
  ['ai-timeseries-forecast', 'time-series'],
  ['ai-timeseries-anomaly', 'time-series-anomaly'],
  ['ai-llm-data', 'llm-data-engine'],
  ['ai-llm-efficiency', 'efficient-inference-on-device'],
  ['ai-llm-serving', 'llm-disaggregated-serving'],
  ['ai-speech-audio', 'speech-audio'],
  ['ai-world-models', 'world-model-physical-ai'],
  ['ai-agents', 'ai-agents'],
] as const;

const conceptEyebrowByTrack: Partial<Record<(typeof tracks)[number][1], string>> = {
  'reinforcement-learning': '03 · CHOOSE ONE BRANCH',
};

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`current-first research routes are complete and fit at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const [subcategory, trackId] of tracks) {
      await page.goto(`${base}/lab/blog/ai?sub=${subcategory}`, { waitUntil: 'domcontentloaded' });
      const route = page.locator(`[data-topdown-research-route="${trackId}"]`);
      await expect(route).toHaveCount(1);
      await expect(route).toBeVisible();
      await expect(route).toHaveAttribute('data-presentation-owner', 'research-track');
      await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
      const directory = page.locator('[data-learning-path-directory]');
      if (await directory.count()) {
        await expect(directory).toHaveAttribute('data-presentation-role', 'navigation-handoff');
      }
      await expect(page.locator('#nlp-path-title')).toHaveCount(0);
      await expect(route.getByText('01 · CURRENT TARGET', { exact: true })).toBeVisible();
      await expect(route.getByText('02 · PRIMARY SOURCE CHECKPOINTS', { exact: true })).toBeVisible();
      const routeUsage = await route.getAttribute('data-route-usage');
      const isSharedReference = routeUsage === 'shared-reference';
      await expect(
        route.getByText(
          isSharedReference ? '03 · SHARED REFERENCES' : (conceptEyebrowByTrack[trackId] ?? '03 · KEY CONCEPTS'),
          { exact: true },
        ),
      ).toBeVisible();
      expect(routeUsage).toMatch(/^(shared-reference|primary-path)$/);
      await expect(route.getByText('04 · JUST-IN-TIME FOUNDATION', { exact: true })).toBeVisible();
      await expect(route.getByText('05 · IMPLEMENT & VERIFY', { exact: true })).toBeVisible();
      await expect(route.getByText('여기서 과거 탐색을 멈춘다', { exact: true })).toBeVisible();
      await expect(route.locator('[data-route-stage]')).toHaveCount(5);
      expect(await route.locator('[data-route-stage]').evaluateAll((items) => items.map((item) => item.getAttribute('data-route-stage')))).toEqual([
        'current',
        'evidence',
        'concepts',
        'foundations',
        'implementation',
      ]);
      await expect(route.locator('[data-route-stage="current"] a')).toHaveCount(0);
      expect(await route.locator('[data-route-stage="evidence"] article').count()).toBeGreaterThanOrEqual(2);
      await expect(route.locator('[data-route-stage="evidence"]').getByText('현재 근거', { exact: true })).toBeVisible();
      await expect(route.locator('[data-route-stage="evidence"]').getByText('최소 기준점', { exact: true })).toBeVisible();
      for (const stage of ['concepts', 'foundations', 'implementation']) {
        const list = route.locator(`[data-route-stage="${stage}"] > div`).last().locator('ul');
        await expect(list).toHaveCount(1);
        await expect(list.locator('li')).not.toHaveCount(0);
      }

      const audit = await route.evaluate((element) => ({
        route: element.scrollWidth - element.clientWidth,
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clipped: Array.from(element.querySelectorAll<HTMLElement>('h2, h3, p, a, span')).flatMap((node) => {
          const style = getComputedStyle(node);
          if (style.overflow === 'hidden' || style.textOverflow === 'ellipsis') return [];
          return node.scrollWidth - node.clientWidth > 2 ? [node.textContent?.trim().slice(0, 80)] : [];
        }),
      }));
      expect(audit.route).toBeLessThanOrEqual(1);
      expect(audit.document).toBeLessThanOrEqual(1);
      expect(audit.clipped).toEqual([]);
    }
  });
}

test('a current mechanism delta is explicit and links to the stable foundation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-architectures`, { waitUntil: 'networkidle' });
  const route = page.locator('[data-topdown-research-route="llm-architecture"]');
  await expect(route.getByText('새 델타', { exact: true }).first()).toBeVisible();
  await expect(route.getByRole('link', { name: /KV와 Long Context/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/llm-architecture-kv-long-context?track=llm-architecture',
  );
  await expect(route.getByText(/이름이나 성능만 달라진 연구는 기반을 늘리지 않는다/)).toBeVisible();
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`the research map opens one selected route beside its owning cluster at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/map`, { waitUntil: 'networkidle' });

    const card = page.locator('[data-research-track-card="knowledge-systems"]');
    await card.click();

    const detail = page.locator('[data-selected-track-detail="knowledge-systems"]');
    await expect(detail).toHaveCount(1);
    await expect(detail).toBeVisible();
    expect(await detail.evaluate((node) =>
      node.closest('section[aria-labelledby]')?.contains(
        document.querySelector('[data-research-track-card="knowledge-systems"]'),
      ),
    )).toBe(true);
    await expect.poll(async () => detail.evaluate((node) => Math.round(node.getBoundingClientRect().top)))
      .toBeGreaterThanOrEqual(0);
    await expect.poll(async () => detail.evaluate((node) => Math.round(node.getBoundingClientRect().top)))
      .toBeLessThan(160);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('LLM hub presents independent branches and scopes the post-training route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-topdown-research-route="llm-post-training"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 2, name: '지금 다룰 lifecycle을 먼저 고릅니다' })).toBeVisible();
  await expect(page.getByRole('link', { name: /모델 만들기 · 검증/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai?sub=ai-llm-model-building',
  );
  await expect(page.getByRole('link', { name: /실행 · 배포/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai?sub=ai-llm-runtime-release',
  );

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-post-training`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-topdown-research-route="llm-post-training"]')).toBeVisible();
  for (const [number, step] of [['00', '현재 병목'], ['01', 'Feedback 계약'], ['02', '구현 · 검산']]) {
    const link = page.getByRole('link', { name: new RegExp(step) }).first();
    await expect(link).toBeVisible();
    await expect(link.getByText(`실행 단계 ${number}`, { exact: true })).toBeVisible();
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('current-first links distinguish internal reconstruction from official sources', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-vision`, { waitUntil: 'networkidle' });
  const route = page.locator('[data-topdown-research-route="computer-vision"]');
  await expect(route.getByRole('link', { name: /공식 원문/ }).first()).toHaveAttribute('target', '_blank');
  const internalLinks = route.getByRole('link', { name: /내부 해설 읽기/ });
  await expect(internalLinks).toHaveCount(5);
  expect(await internalLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/vision-system-contracts?track=computer-vision',
    '/lab/blog/ai/deformable-detr?track=computer-vision',
    '/lab/blog/ai/object-detection-systems?track=computer-vision#open-vocabulary',
    '/lab/blog/ai/object-detection-systems?track=computer-vision#open-vocabulary',
    '/lab/blog/ai/vision-representation-encoders-current?track=computer-vision',
  ]);
});

test('a research-route entry remains the only active article navigation owner', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/knowledge-compiler?track=knowledge-systems`, { waitUntil: 'networkidle' });

  const article = page.locator('article[data-article-slug="knowledge-compiler"]');
  await expect(article).toHaveAttribute('data-active-route-owner', 'research-track');
  await expect(article.locator('[data-research-track-context="knowledge-systems"]')).toBeVisible();
  await expect(article.locator('[data-learning-path-id]')).toHaveCount(0);
  await expect(article.locator('[data-article-route-context]')).toHaveCount(0);
  await expect(article.locator('[data-learning-continuity]')).toHaveCount(0);
  await expect(article.getByRole('navigation', { name: /학습 경로 이동|주제 안에서 이어 읽기/ })).toHaveCount(0);

  await page.goto(`${base}/lab/blog/ai/knowledge-compiler`, { waitUntil: 'networkidle' });
  await expect(article).toHaveAttribute('data-active-route-owner', 'learning-path');
  await expect(article.locator('[data-research-track-context]')).toHaveCount(0);
  await expect(article.locator('[data-learning-path-id]').first()).toBeVisible();
  await expect(article.locator('[data-learning-continuity]')).toBeVisible();
});

test('integrated evidence links open distinct owned sections instead of duplicating one route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving`, { waitUntil: 'networkidle' });
  const route = page.locator('[data-topdown-research-route="llm-disaggregated-serving"]');
  await expect(route.getByRole('link', { name: '통합 해설의 현재 변화 절' })).toHaveAttribute(
    'href',
    '/lab/blog/ai/llm-disaggregated-serving?track=llm-disaggregated-serving#kv-handoff',
  );
  await expect(route.getByRole('link', { name: '통합 해설의 최소 기준점 절' })).toHaveAttribute(
    'href',
    '/lab/blog/ai/llm-disaggregated-serving?track=llm-disaggregated-serving#routing-state',
  );
  await expect(route.getByText(/Mooncake 2024의 phase 분리/)).toBeVisible();
  await expect(route.getByText(/Orca.*직접 요구할 때만 연다/)).toBeVisible();
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Knowledge Systems source spine is reconstructed and readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-knowledge-systems`, { waitUntil: 'networkidle' });
    const route = page.locator('[data-topdown-research-route="knowledge-systems"]');
    const internalSources = route.locator('[data-route-stage="evidence"]').getByRole('link', { name: /내부 해설 읽기/ });
    await expect(internalSources).toHaveCount(2);
    await expect(internalSources.nth(0)).toHaveAttribute('href', '/lab/blog/ai/research-codar-2026?track=knowledge-systems');
    await expect(internalSources.nth(1)).toHaveAttribute('href', '/lab/blog/ai/paper-rag-2020?track=knowledge-systems');

    await page.goto(`${base}/lab/blog/ai/research-codar-2026`, { waitUntil: 'networkidle' });
    await expect(page.getByText('논문 재구성 · CoDaR: 긴 문서를 언제 나누면 안 되는가', { exact: true })).toBeVisible();
    await expect(page.locator('[data-context-dependency-routing]')).toBeVisible();
    const codarFormulaCount = await page.locator('[data-formula-pair]').count();
    expect(codarFormulaCount).toBeGreaterThanOrEqual(6);
    await expect(page.locator('[data-formula-note]')).toHaveCount(codarFormulaCount);
    await page.getByRole('button', { name: '독립 사양 묶음', exact: true }).click();
    await expect(page.locator('[data-context-dependency-routing]')).toContainText('분해형 방법');

    await page.goto(`${base}/lab/blog/ai/paper-rag-2020`, { waitUntil: 'networkidle' });
    await expect(page.getByText('논문 재구성 · RAG: 검색 문서를 생성 확률에 넣는 법', { exact: true })).toBeVisible();
    await expect(page.locator('[data-rag-latent-document]')).toBeVisible();
    await expect(page.locator('[data-formula-pair]')).toHaveCount(3);
    await expect(page.locator('[data-formula-note]')).toHaveCount(3);
    await expect(page.locator('#evidence-boundary')).toContainText('부록 G');
    await expect(page.locator('#evidence-boundary')).toContainText('부록 C');
    await page.getByRole('button', { name: 'RAG-Token', exact: true }).click();
    await expect(page.locator('[data-rag-latent-document]')).toContainText('다시 결합');

    const audit = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rawLatex: /\\(?:operatorname|underbrace|begin\{cases\}|mid)/.test(document.body.innerText),
      clippedMath: Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'))
        .filter((node) => node.scrollWidth - node.clientWidth > 1)
        .length,
    }));
    expect(audit.document).toBeLessThanOrEqual(1);
    expect(audit.rawLatex).toBe(false);
    expect(audit.clippedMath).toBe(0);
  });
}

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Robot VLA source spine keeps contracts, formulas and labs readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-robotics`, { waitUntil: 'networkidle' });
    const route = page.locator('[data-topdown-research-route="robot-ai"]');
    const internalSources = route.locator('[data-route-stage="evidence"]').getByRole('link', { name: /내부 해설 읽기/ });
    await expect(internalSources).toHaveCount(2);
    await expect(internalSources.nth(0)).toHaveAttribute('href', '/lab/blog/ai/research-pi07-2026?track=robot-ai');
    await expect(internalSources.nth(1)).toHaveAttribute('href', '/lab/blog/ai/paper-openvla-2024?track=robot-ai');

    await page.goto(`${base}/lab/blog/ai/research-pi07-2026`, { waitUntil: 'networkidle' });
    await expect(page.getByText('연구 재구성 · π0.7: 서로 다른 Robot 경험을 하나의 Policy로 묶는 법', { exact: true })).toBeVisible();
    await expect(page.locator('[data-formula-pair]')).toHaveCount(3);
    await expect(page.locator('[data-formula-note]')).toHaveCount(3);
    await expect(page.locator('[data-pi07-prompt-lab]')).toBeVisible();
    await expect(page.locator('[data-pi07-runtime-lab]')).toBeVisible();
    await expect(page.locator('[data-pi07-evidence-lab]')).toBeVisible();
    await expect(page.locator('[data-formula-label]')).toHaveCount(5);
    await expect(page.locator('[data-formula-label]')).toHaveText([
      '조건부 학습',
      '두 score의 차이',
      '실패 경계',
      '역수',
      '배포 경계',
    ]);
    await page.getByRole('switch', { name: /Episode metadata/ }).click();
    await expect(page.locator('[data-pi07-prompt-lab]')).toContainText('더 많은 data가 오히려 평균 행동을 흐릴 수 있다');
    await page.getByRole('button', { name: '80 ms', exact: true }).click();
    await expect(page.locator('[data-pi07-runtime-lab]')).toContainText('4.0 control ticks');
    const pi07MinScale = await page.locator('[data-math-fit]').evaluateAll((nodes) => Math.min(
      ...nodes.map((node) => Number(node.getAttribute('data-math-scale') ?? '1')),
    ));
    expect(pi07MinScale).toBeGreaterThanOrEqual(0.8);

    await page.goto(`${base}/lab/blog/ai/paper-openvla-2024`, { waitUntil: 'networkidle' });
    await expect(page.getByText('논문 재구성 · OpenVLA: Image와 언어를 Robot Action Token으로 바꾸는 법', { exact: true })).toBeVisible();
    await expect(page.locator('[data-formula-pair]')).toHaveCount(3);
    await expect(page.locator('[data-formula-note]')).toHaveCount(3);
    await expect(page.locator('[data-openvla-action-lab]')).toBeVisible();
    await expect(page.locator('[data-openvla-cadence-lab]')).toBeVisible();
    await expect(page.locator('[data-openvla-evidence-lab]')).toBeVisible();
    for (const label of ['digitize와 clip', '합', 'Non-blocking', 'Blocking control']) {
      await expect(page.locator('[data-formula-label]', { hasText: label })).toHaveCount(1);
    }
    await page.getByRole('button', { name: 'int8', exact: true }).click();
    await expect(page.locator('[data-openvla-cadence-lab]')).toContainText('Cadence confounded');
    await page.getByRole('button', { name: 'Blocking · 부록 D.4', exact: true }).click();
    await expect(page.locator('[data-openvla-cadence-lab]')).toContainText('Policy quality isolated');

    const audit = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rawLatex: /\\(?:theta|underbrace|operatorname|begin\{aligned\}|middle)/.test(document.body.innerText),
      clippedMath: Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'))
        .filter((node) => node.scrollWidth - node.clientWidth > 1)
        .length,
      minMathScale: Math.min(
        ...Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'))
          .map((node) => Number(node.getAttribute('data-math-scale') ?? '1')),
      ),
      smallestLabText: Math.min(
        ...Array.from(document.querySelectorAll<HTMLElement>('figure p, figure span, figure strong, figure button'))
          .map((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
      ),
    }));
    expect(audit.document).toBeLessThanOrEqual(1);
    expect(audit.rawLatex).toBe(false);
    expect(audit.clippedMath).toBe(0);
    expect(audit.minMathScale).toBeGreaterThanOrEqual(0.8);
    expect(audit.smallestLabText).toBeGreaterThanOrEqual(12);
  });
}

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`DeepSeek V3.2 reconstruction keeps formulas and viz readable at ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/research-deepseek-v3-2-2025`, { waitUntil: 'networkidle' });
    await expect(page.getByText('SOURCE DEEP DIVE', { exact: true })).toBeVisible();

    const formulas = page.locator('[data-math-fit]');
    await expect(formulas).toHaveCount(5);
    await expect(page.locator('[data-formula-note]')).toHaveCount(5);
    await expect(page.locator('article table')).toHaveCount(0);
    for (let index = 0; index < 5; index += 1) {
      const formula = formulas.nth(index);
      await expect(formula.locator('.katex')).toBeVisible();
      const fit = await formula.evaluate((element) => ({
        overflow: element.scrollWidth - element.clientWidth,
        scale: Number(element.getAttribute('data-math-scale') ?? '1'),
        fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
        rawLatex: /\\\\(?:theta|underbrace|operatorname|mathrm)/.test((element as HTMLElement).innerText ?? ''),
      }));
      expect(fit.overflow).toBeLessThanOrEqual(1);
      expect(fit.scale).toBeGreaterThanOrEqual(0.75);
      expect(fit.fontSize).toBeGreaterThanOrEqual(12);
      expect(fit.rawLatex).toBe(false);
    }

    const viz = page.locator('[data-deepseek-study-viz]');
    await expect(viz).toBeVisible();
    const modeChecks = [
      ['Sparse Attention', /128K 문맥에서/, '1 / 64'],
      ['Stable RL', /policy mismatch/, 'log p · route · mask'],
      ['Agent Synthesis', /실제 사용자 로그 없이도/, '2.42'],
      ['Context Runtime', /128K를 넘는 agent trajectory/, '+6.8 point'],
    ] as const;
    for (const [label, question, metric] of modeChecks) {
      await viz.getByRole('button', { name: label, exact: true }).click();
      await expect(viz.getByText(question)).toBeVisible();
      await expect(viz.locator('[data-study-stage]')).toHaveCount(4);
      await expect(viz.locator('[data-study-stage]').first()).toHaveAttribute('aria-pressed', 'true');
      await viz.locator('[data-study-stage]').nth(2).click();
      await expect(viz.locator('[data-study-stage]').nth(2)).toHaveAttribute('aria-pressed', 'true');
      await expect(viz.locator('[data-study-stage-detail]')).toContainText('다음 handoff');
      await expect(viz.locator('[data-study-metrics]')).toContainText(metric);
      const vizFit = await viz.evaluate((element) => ({
        overflow: element.scrollWidth - element.clientWidth,
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      expect(vizFit.overflow).toBeLessThanOrEqual(1);
      expect(vizFit.document).toBeLessThanOrEqual(1);
    }

    await expect(page.getByRole('link', { name: 'Hybrid·Linear Attention' })).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-hybrid-linear');
    await expect(page.getByRole('link', { name: 'Post-Training RL과 RLVR' })).toHaveAttribute('href', '/lab/blog/ai/post-training-rlvr');
    await expect(page.getByRole('link', { name: 'Agent loop와 tool use' })).toHaveAttribute('href', '/lab/blog/ai/agentic-patterns');

    expect(consoleErrors).toEqual([]);
  });
}
