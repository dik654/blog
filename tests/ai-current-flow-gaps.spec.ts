import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const pages = [
  { path: '/lab/blog/ai/llm-data-engine', title: 'LLM 데이터 엔진', minFormulas: 5, lab: 'DATA ENGINE LAB' },
  { path: '/lab/blog/ai/efficient-inference-on-device', title: '효율 추론과 On-device AI', minFormulas: 6, lab: 'DEVICE BUDGET LAB' },
  { path: '/lab/blog/ai/realtime-duplex-voice-systems', title: 'Realtime Duplex Voice Systems', minFormulas: 4, lab: 'DUPLEX INTERACTION LAB' },
  { path: '/lab/blog/ai/native-speech-generation', title: 'Native Speech Generation', minFormulas: 3, lab: 'SPEECH GENERATION LAB' },
  { path: '/lab/blog/ai/speech-recognition-objectives', title: 'Speech Recognition Objectives', minFormulas: 4, lab: 'ALIGNMENT OBJECTIVE LAB' },
  { path: '/lab/blog/ai/audio-representation-neural-codecs', title: 'Audio Representation · Neural Codec', minFormulas: 5, lab: 'AUDIO REPRESENTATION LAB' },
  { path: '/lab/blog/ai/predictive-world-representations', title: 'Predictive World Representations', minFormulas: 4, lab: 'PREDICTIVE REPRESENTATION LAB' },
  { path: '/lab/blog/ai/action-conditioned-world-dynamics', title: 'Action-Conditioned World Dynamics', minFormulas: 6, lab: 'ACTION DYNAMICS LAB' },
  { path: '/lab/blog/ai/world-model-planning-closed-loop', title: 'World Model Planning · Closed Loop', minFormulas: 5, lab: 'CLOSED-LOOP PLANNING LAB' },
  { path: '/lab/blog/ai/knowledge-source-ingestion', title: 'Source Ingestion · Structure Recovery', minFormulas: 3, lab: 'SOURCE INGESTION LAB' },
  { path: '/lab/blog/ai/knowledge-ir-evidence-lineage', title: 'Knowledge IR · Evidence Lineage', minFormulas: 3, lab: 'KNOWLEDGE IR LAB' },
  { path: '/lab/blog/ai/rag-pipeline', title: 'RAG Pipeline', minFormulas: 7, lab: 'RETRIEVAL LAB' },
  { path: '/lab/blog/ai/image-model-runtime', title: '오픈 이미지 모델 Runtime', minFormulas: 6, lab: 'RUNTIME INHERITANCE LAB' },
  { path: '/lab/blog/ai/video-model-runtime', title: '오픈 비디오 모델 Runtime', minFormulas: 7, lab: 'RUNTIME INHERITANCE LAB' },
  { path: '/lab/blog/ai/open-model-community-workflows', title: 'ComfyUI·Diffusers Workflow 감사', minFormulas: 2, lab: 'WORKFLOW MANIFEST LAB' },
  { path: '/lab/blog/ai/open-model-workflow-parameters', title: '워크플로우 수치와 생성 모델 이론', minFormulas: 5, lab: 'PARAMETER BUDGET LAB' },
  { path: '/lab/blog/ai/open-model-finetuning-theory', title: '오픈 이미지·비디오 모델 적응', minFormulas: 4, lab: 'ADAPTATION DECISION LAB' },
] as const;

test('data engine keeps raw partition and synthetic verification on separate ledgers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/llm-data-engine`, { waitUntil: 'networkidle' });
  await page.getByLabel('품질 필터 강도').fill('100');
  await page.getByLabel('합성 후보 비율').fill('50');

  const ledger = page.locator('[data-data-mixture-ledger]');
  await expect(ledger.getByLabel('원문 corpus 분할')).toBeVisible();
  await expect(ledger.getByLabel('합성 후보 검증 퍼널')).toContainText('합산하지 않음');
  const values = await ledger.evaluate((node) => ({
    retained: Number((node as HTMLElement).dataset.retained),
    removed: Number((node as HTMLElement).dataset.removed),
    candidate: Number((node as HTMLElement).dataset.syntheticCandidate),
    verified: Number((node as HTMLElement).dataset.syntheticVerified),
  }));
  expect(values.retained + values.removed).toBeCloseTo(100, 8);
  expect(values.verified).toBeLessThanOrEqual(values.candidate);
});

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of pages) {
    test(`${article.title} renders deep formulas and interactive viz at ${viewport.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(`${base}${article.path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('heading', { name: new RegExp(article.title), level: 1 })).toBeVisible();
      await expect(page.getByText(article.lab, { exact: true })).toBeVisible();

      const formulas = page.locator('[data-math-fit]');
      expect(await formulas.count()).toBeGreaterThanOrEqual(article.minFormulas);
      const notes = page.locator('[data-formula-note]');
      expect(await notes.count()).toBeGreaterThanOrEqual(article.minFormulas);

      await expect.poll(async () => formulas.evaluateAll((nodes) => nodes.every((node) => {
        const rendered = node.firstElementChild as HTMLElement | null;
        return rendered !== null && rendered.getBoundingClientRect().width - node.clientWidth <= 1;
      }))).toBe(true);
      const formulaAudit = await formulas.evaluateAll((nodes) => nodes.map((node) => {
        const rendered = node.firstElementChild as HTMLElement;
        return {
          // The visually hidden MathML accessibility tree can enlarge scrollWidth
          // without changing the rendered KaTeX box. Measure what the reader sees.
          overflow: rendered.getBoundingClientRect().width - node.clientWidth,
          hasKatex: Boolean(node.querySelector('.katex')),
          fontSize: Number.parseFloat(globalThis.getComputedStyle(rendered).fontSize),
          raw: /\\(?:underbrace|theta|operatorname|mathcal)/.test(((node as HTMLElement).innerText ?? '').trim()),
        };
      }));
      for (const formula of formulaAudit) {
        expect(formula.overflow).toBeLessThanOrEqual(1);
        expect(formula.hasKatex).toBe(true);
        expect(formula.fontSize).toBeGreaterThanOrEqual(9.5);
        expect(formula.raw).toBe(false);
      }

      const layout = await page.evaluate(() => ({
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        vizOverflows: Array.from(document.querySelectorAll<HTMLElement>('figure.foundation-viz-explorer')).map((node) => node.scrollWidth - node.clientWidth),
        clippedControls: Array.from(document.querySelectorAll<HTMLElement>('figure button, figure label')).flatMap((node) => node.scrollWidth - node.clientWidth > 2 ? [node.textContent?.trim().slice(0, 80)] : []),
      }));
      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.vizOverflows.every((value) => value <= 1)).toBe(true);
      expect(layout.clippedControls).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
}

test('LLM subcategory contains data and efficiency routes without promoting the source video', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: '모델 만들기 · 검증', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '실행 · 배포', exact: true })).toBeVisible();
  await expect(page.getByText('2026 AI 기술 지형 · LLM에서 World Model까지', { exact: true })).toHaveCount(0);
});

test('retired transcript synthesis redirects to the reconstructed architecture route', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/research-honglab-ai-landscape-2026`, { waitUntil: 'networkidle' });
  await expect(page).toHaveURL(/\/lab\/blog\/ai\?sub=ai-llm-architectures$/);
  await expect(page.getByRole('heading', { name: '02 · LLM 아키텍처', exact: true })).toBeVisible();
  await expect(page.getByText('2026 AI 기술 지형 · LLM에서 World Model까지', { exact: true })).toHaveCount(0);
});

test('LTX animation case hands off to the production contract route', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/ltx-animation-project`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: '2D 애니메이션 제작 계약', exact: true })).toHaveAttribute('href', '/lab/blog/ai/animation-production-workflow');
});

test('duplex timeline removes the interruption decision in turn-based mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/realtime-duplex-voice-systems`, { waitUntil: 'networkidle' });
  await expect(page.getByText(/VAD\(Voice Activity Detection, 음성 활동 감지\)/)).toBeVisible();
  await expect(page.getByText(/ASR\(Automatic Speech Recognition, 자동 음성 인식\)/)).toBeVisible();
  await expect(page.getByText(/PII\(Personally Identifiable Information, 개인 식별 정보\)/)).toBeVisible();
  const timeline = page.locator('[data-duplex-timeline]');
  await expect(timeline.getByText('중단', { exact: true })).toHaveCount(1);
  await timeline.getByRole('button', { name: 'Turn', exact: true }).click();
  await expect(timeline.getByText('중단', { exact: true })).toHaveCount(0);
  await expect(timeline.getByText('640 ms', { exact: true })).toBeVisible();
  const release = page.locator('[data-voice-release]');
  await expect(release.getByText('575 ms', { exact: true })).toBeVisible();
  await expect(release.getByText('Packet loss · 1%', { exact: false })).toBeVisible();
});

test('speech generation and recognition keep controls and formulas semantically aligned', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/native-speech-generation`, { waitUntil: 'networkidle' });
  const generation = page.locator('[data-speech-generation]');
  await generation.getByLabel('acoustic codebooks').fill('12');
  await expect(generation.getByText('RVQ 12', { exact: true })).toBeVisible();
  await expect(generation.getByText('150/s', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Audio Representation · Neural Codec', exact: true })).toHaveAttribute('href', '/lab/blog/ai/audio-representation-neural-codecs');

  await page.goto(`${base}/lab/blog/ai/speech-recognition-objectives`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: 'Audio Representation · Neural Codec', exact: true })).toHaveAttribute('href', '/lab/blog/ai/audio-representation-neural-codecs');
  const scales = await page.locator('[data-math-fit]').evaluateAll((nodes) => nodes.map((node) => Number(node.getAttribute('data-math-scale') ?? '1')));
  expect(Math.min(...scales)).toBeGreaterThanOrEqual(0.8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('audio representation hands off to its signal foundation', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/audio-representation-neural-codecs`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: '신호와 시스템', exact: true })).toHaveAttribute('href', '/lab/blog/ai/signals-systems-convolution');
});

test('World Model labs change the actual contract, rollout, and release decision', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/world-model-physical-ai`, { waitUntil: 'networkidle' });
  const contract = page.locator('[data-world-contract]');
  await contract.getByRole('button', { name: 'Interactive world', exact: true }).click();
  await expect(contract.getByText('다음 visual frame', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/predictive-world-representations`, { waitUntil: 'networkidle' });
  const representation = page.locator('[data-predictive-representation]');
  await representation.getByRole('button', { name: 'Pixel reconstruction', exact: true }).click();
  await expect(representation.getByText('RGB target patch', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/action-conditioned-world-dynamics`, { waitUntil: 'networkidle' });
  const dynamics = page.locator('[data-action-dynamics]');
  await dynamics.getByRole('button', { name: 'Inverse', exact: true }).click();
  await expect(dynamics.getByText('이 변화는 어떤 action으로 생겼을까?', { exact: true })).toBeVisible();
  await dynamics.getByRole('button', { name: 'Camera', exact: true }).click();
  await expect(dynamics.getByText('Δu=+31 px · Δv=-8 px', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/world-model-planning-closed-loop`, { waitUntil: 'networkidle' });
  const planner = page.locator('[data-closed-loop-planner]');
  await planner.getByLabel('planning horizon').fill('8');
  await planner.getByLabel('candidate count').fill('800');
  await planner.getByLabel('refinement count').fill('10');
  await planner.getByLabel('effective batch').fill('50');
  await expect(planner.getByText('1560 ms', { exact: true })).toBeVisible();
  await expect(planner.getByText('설계 수정', { exact: true })).toBeVisible();

  const release = page.locator('[data-world-release]');
  await release.getByLabel('closed loop task success').fill('96');
  await expect(release.getByText('hold', { exact: true })).toBeVisible();
  await release.getByLabel('closed loop trial count').fill('120');
  await release.getByLabel('calibration measurement receipt').check();
  await release.getByLabel('constraint measurement receipt').check();
  await release.getByLabel('latency measurement receipt').check();
  await release.getByLabel('closed loop measurement receipt').check();
  await expect(release.getByText('release', { exact: true })).toBeVisible();
});

test('Knowledge System labs expose structure loss, revision impact and evidence-budget failure', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/knowledge-compiler`, { waitUntil: 'networkidle' });
  const contract = page.locator('[data-knowledge-contract]');
  await contract.getByRole('button', { name: 'Retrieval', exact: true }).click();
  await expect(contract.getByText('RAG Pipeline', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/knowledge-source-ingestion`, { waitUntil: 'networkidle' });
  const ingestion = page.locator('[data-ingestion-structure]');
  await ingestion.getByRole('button', { name: 'Structure recovery on', exact: true }).click();
  await expect(ingestion.getByText('63%', { exact: true })).toBeVisible();
  await expect(ingestion.getByText('읽을 수 있지만 검증 불가', { exact: true })).toBeVisible();

  const structureGate = page.locator('[data-structure-gate]');
  await structureGate.getByRole('button', { name: /Formula \+ qualifier/ }).click();
  await expect(structureGate.getByText('review queue', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/knowledge-ir-evidence-lineage`, { waitUntil: 'networkidle' });
  const revision = page.locator('[data-revision-impact]');
  await revision.getByRole('button', { name: 'rev 1.2', exact: true }).click();
  await expect(revision.getByText('rebuild', { exact: true })).toHaveCount(0);
  await revision.getByRole('button', { name: 'rev 1.3 corrected', exact: true }).click();
  await expect(revision.getByText('rebuild', { exact: true })).toBeVisible();
  await expect(revision.getByText('unrelated claim C-22', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/rag-pipeline`, { waitUntil: 'networkidle' });
  const retrieval = page.locator('[data-retrieval-strategy]');
  await retrieval.getByRole('button', { name: 'Late interaction', exact: true }).click();
  await expect(retrieval.getByText('MaxSim 7.4', { exact: true })).toBeVisible();

  const packing = page.locator('[data-context-packing]');
  await expect(packing.getByText('2/3', { exact: true })).toBeVisible();
  await expect(packing.getByText('abstain', { exact: true })).toBeVisible();
  await packing.getByLabel('context token budget').fill('1100');
  await expect(packing.getByText('3/3', { exact: true })).toBeVisible();
  await expect(packing.getByText('answer', { exact: true })).toBeVisible();
  await packing.getByRole('button', { name: 'No redundant context', exact: true }).click();
  await expect(packing.getByText('2/3', { exact: true })).toBeVisible();
  await expect(packing.getByText('abstain', { exact: true })).toBeVisible();

  await expect(page.locator('[data-rag-release]').getByText('release', { exact: true })).toBeVisible();
});

test('Open media labs fork by goal and close reproducibility, budget and adaptation contracts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/open-image-video-models?path=ai-open-video-current-first`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-open-goal-router]').getByRole('button', { name: '5초 제품 영상', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.goto(`${base}/lab/blog/ai/open-image-video-models`, { waitUntil: 'networkidle' });
  const goals = page.locator('[data-open-goal-router]');
  await goals.getByRole('button', { name: '5초 제품 영상', exact: true }).click();
  await expect(goals.getByText('Wan2.2 task variants · LTX-2.3 joint audio-video', { exact: true })).toBeVisible();
  const videoRoute = goals.getByRole('link', { name: 'Video 제작 경로 시작', exact: true });
  await expect(videoRoute).toHaveAttribute('href', '/lab/blog/ai/video-model-runtime?path=ai-open-video-current-first');
  await videoRoute.click();
  const videoPath = page.getByLabel('오픈 미디어 · Video 제작 경로 학습 경로');
  await expect(videoPath.getByRole('link')).toHaveCount(5);
  await expect(videoPath.locator('a[href*="/image-model-runtime"]')).toHaveCount(0);
  await expect(videoPath.locator('a[href*="/open-model-community-workflows"]')).toHaveCount(1);

  await page.goto(`${base}/lab/blog/ai/image-model-runtime`, { waitUntil: 'networkidle' });
  const runtime = page.locator('[data-media-runtime]');
  await runtime.getByRole('button', { name: 'Video', exact: true }).click();
  await runtime.getByRole('button', { name: /Spatiotemporal latent/ }).click();
  await expect(runtime.getByText('C × T′ × H′ × W′', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/open-model-community-workflows`, { waitUntil: 'networkidle' });
  const manifest = page.locator('[data-workflow-manifest]');
  await expect(manifest.getByText('evidence missing', { exact: true })).toBeVisible();
  await manifest.getByRole('button', { name: /Runtime state/ }).click();
  await manifest.getByRole('button', { name: /Input transform/ }).click();
  await expect(manifest.getByText('replay ready', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/open-model-workflow-parameters`, { waitUntil: 'networkidle' });
  const budget = page.locator('[data-parameter-budget]');
  await expect(budget.getByText('128 × 128', { exact: true })).toBeVisible();
  await expect(budget.getByText('SDXL-like · 공간 8×', { exact: true })).toBeVisible();
  await budget.getByRole('button', { name: 'video', exact: true }).click();
  await expect(budget.getByText('Wan2.2-VAE-like · 시간 4× · 공간 16×', { exact: true })).toBeVisible();
  await budget.getByRole('slider', { name: 'frames', exact: true }).fill('241');
  await expect(budget.getByText('249.9K', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/open-model-finetuning-theory`, { waitUntil: 'networkidle' });
  const adaptation = page.locator('[data-adaptation-decision]');
  await adaptation.getByRole('button', { name: '새 도메인', exact: true }).click();
  await expect(adaptation.getByText('design incomplete', { exact: true })).toBeVisible();
  await adaptation.getByRole('slider', { name: 'curated examples', exact: true }).fill('1200');
  await expect(adaptation.getByText('experiment ready', { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/lab/blog/ai/comfyui-edit-models-flux-qwen"]').first()).toBeVisible();
});

test('Image edit lab changes condition ownership without shifting its comparison frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/comfyui-edit-models-flux-qwen`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole('heading', { name: /Qwen-Image-Edit-2511/, level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Qwen-Image-Edit-2511', level: 2 })).toBeVisible();
  await expect(page.getByText('Qwen-Image-2.0', { exact: true })).toBeVisible();
  await expect(page.locator('[data-formula-note]')).toHaveCount(2);

  const lab = page.locator('[data-edit-contract-lab]');
  await expect(lab.getByText('제품', { exact: true })).toBeVisible();
  await expect(lab.getByText('변경 영역', { exact: true })).toBeVisible();
  await expect(lab.getByText('배경', { exact: true })).toBeVisible();
  const modeButtons = lab.getByRole('group', { name: '편집 방식' }).getByRole('button');
  const sizes = await modeButtons.evaluateAll((buttons) => buttons.map((button) => {
    const box = button.getBoundingClientRect();
    return { width: box.width, height: box.height };
  }));
  expect(sizes.every((size) => size.width >= 44 && size.height >= 44)).toBe(true);

  const heights: number[] = [];
  for (const label of ['Latent img2img', 'Mask repair', 'Instruction edit', 'Multi-reference']) {
    await lab.getByRole('button', { name: new RegExp(label) }).click();
    heights.push(await lab.evaluate((node) => node.getBoundingClientRect().height));
  }
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(2);

  await lab.getByRole('button', { name: /Latent img2img/ }).click();
  await expect(lab.getByText('전체 frame', { exact: true })).toBeVisible();
  await expect(lab.getByLabel('reference 1개')).toBeVisible();
  await expect(lab.getByText('identity 보존 주의', { exact: true })).toHaveClass(/text-amber-700/);
  const initialFillWidth = await lab.locator('[data-edit-change-fill]').evaluate((node) => Number.parseFloat((node as HTMLElement).style.width));
  await lab.getByRole('slider', { name: 'edit strength' }).fill('75');
  const strongerFillWidth = await lab.locator('[data-edit-change-fill]').evaluate((node) => Number.parseFloat((node as HTMLElement).style.width));
  expect(strongerFillWidth).toBeGreaterThan(initialFillWidth);
  const latent = await lab.evaluate((node) => ({
    identity: Number((node as HTMLElement).dataset.identity),
    background: Number((node as HTMLElement).dataset.background),
    spill: Number((node as HTMLElement).dataset.spill),
  }));

  await lab.getByRole('button', { name: /Mask repair/ }).click();
  await expect(lab.getByText('mask 안쪽', { exact: true })).toBeVisible();
  await expect(lab.getByText('공간 제한', { exact: true })).toBeVisible();
  await expect(lab.getByText('identity 보존 통과', { exact: true })).toHaveClass(/text-emerald-700/);
  const mask = await lab.evaluate((node) => ({
    identity: Number((node as HTMLElement).dataset.identity),
    background: Number((node as HTMLElement).dataset.background),
    spill: Number((node as HTMLElement).dataset.spill),
  }));
  expect(mask.identity).toBeGreaterThan(latent.identity);
  expect(mask.background).toBeGreaterThan(latent.background);
  expect(mask.spill).toBeLessThan(latent.spill);

  await lab.getByRole('button', { name: /Multi-reference/ }).click();
  await expect(lab.getByText('참조 조합', { exact: true })).toBeVisible();
  const referenceStrip = lab.getByLabel('reference 3개');
  await expect(referenceStrip).toBeVisible();
  const geometry = await lab.evaluate((node) => {
    const text = Array.from(node.querySelectorAll<HTMLElement>('button, p, span, strong, label'));
    const slider = node.querySelector<HTMLInputElement>('input[type="range"]');
    return {
      minFont: Math.min(...text.map((item) => Number.parseFloat(getComputedStyle(item).fontSize))),
      sliderHeight: slider?.getBoundingClientRect().height ?? 0,
      overflowX: node.scrollWidth - node.clientWidth,
    };
  });
  const referencesFit = await referenceStrip.evaluate((node) => {
    const frame = node.getBoundingClientRect();
    return Array.from(node.children).every((child) => {
      const item = child.getBoundingClientRect();
      return item.left >= frame.left - 1 && item.right <= frame.right + 1;
    });
  });
  expect(geometry.minFont).toBeGreaterThanOrEqual(12);
  expect(geometry.sliderHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.overflowX).toBeLessThanOrEqual(1);
  expect(referencesFit).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
