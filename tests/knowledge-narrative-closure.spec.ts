import { expect, test, type Locator } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';

async function expectPrecedes(first: Locator, second: Locator) {
  await expect(first).toBeVisible();
  await expect(second).toBeVisible();
  expect(await first.evaluate((node, other) => Boolean(
    node.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING
  ), await second.elementHandle())).toBe(true);
}

test('Knowledge Compiler names every contract and its runtime watcher', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/knowledge-compiler`, { waitUntil: 'networkidle' });

  const contract = page.locator('#why-contracts');
  await expect(contract).toContainText('source는 원본을 잃지 않는 수집');
  await expect(contract).toContainText('structure는 문서 구조 복원');
  await expect(contract).toContainText('meaning은 claim·scope·evidence를 만드는 의미 IR');
  await expect(contract).toContainText('retrieval은 검색 가능한 context package');
  await expect(contract).toContainText('maintenance는 지속 갱신');
  await expect(contract).toContainText('claim과 evidence의 연결이 틀렸다면');

  const route = page.locator('#route');
  await expect(route).toContainText('Watcher, 즉 feed·sitemap·release event를 주기적으로 감시하는 수집기');
});

test('Knowledge IR separates value and scope cells and gives one writer revision ownership', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/knowledge-ir-evidence-lineage`, { waitUntil: 'networkidle' });

  const schema = page.locator('#ir-schema');
  await expect(page.getByText('table:7/row:8/cell:max_torque', { exact: true })).toBeVisible();
  await expect(schema.locator('pre')).toContainText('table:7/row:8/cell:temperature');
  await expect(schema).toContainText('explains');
  await expect(schema).toContainText('implements');
  await expect(schema).toContainText('verifies');
  await expect(schema).toContainText('source_locator_id');
  await expect(schema).toContainText('page_no · bbox · charspan · rotation');
  await expect(schema).not.toContainText('tests처럼 relation type');

  const revision = page.locator('#revision-impact');
  await expectPrecedes(
    revision.getByText('DocumentVersion', { exact: true }),
    revision.locator('[data-revision-impact]'),
  );
  await expect(revision).toContainText('IR revision coordinator');
  await expect(revision).toContainText('한 곳만');
  await expect(revision).toContainText('한 transaction과 outbox event');
  await expect(revision.getByText('Transaction', { exact: true })).toBeVisible();
  await expect(revision.getByText('Outbox event', { exact: true })).toBeVisible();
  await expect(revision.getByText('Diff / Rebuild worker', { exact: true })).toBeVisible();
  await expect(revision.getByText('Race condition', { exact: true })).toBeVisible();
});

test('RAG defines units, retrieval signals and release metrics before their labs', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/rag-pipeline`, { waitUntil: 'networkidle' });

  await expect(page.locator('#retrieval-units')).toContainText('검색 index에 넣는 retrieval unit');

  const search = page.locator('#search-signals');
  await expectPrecedes(
    search.getByText('Sparse · BM25', { exact: true }),
    search.locator('[data-retrieval-strategy]'),
  );
  await expect(search).toContainText('thermal derating');
  await expect(search).toContainText('TS-999');
  await expect(search).toContainText('서로 다른 표 행');

  const release = page.locator('#evaluation-release');
  await expectPrecedes(
    release.locator('dt').filter({ hasText: /^Recall@20$/ }),
    release.locator('[data-rag-release]'),
  );
  await expect(release.locator('dt').filter({ hasText: /^MRR$/ })).toBeVisible();
  await expect(release.locator('dt').filter({ hasText: /^nDCG$/ })).toBeVisible();
  await expect(release.locator('dt').filter({ hasText: /^Claim support$/ })).toBeVisible();
  await expect(release.locator('dt').filter({ hasText: /^Current-source ratio$/ })).toBeVisible();
  await expect(release.locator('dt').filter({ hasText: /^p95 latency$/ })).toBeVisible();
  const handoff = release.locator('[data-learning-handoff]');
  await expect(handoff.getByRole('link', { name: /Knowledge IR · Evidence Lineage/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/knowledge-ir-evidence-lineage',
  );
  await expect(handoff.getByRole('link', { name: /Research Watcher/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/knowledge-research-watcher',
  );
  await expect(page.getByRole('link', { name: /CoDaR \/ Lost in Decomposition/ })).toBeVisible();
});

test('Research Watcher reuses the ingestion identity and IR invalidation model', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/knowledge-research-watcher`, { waitUntil: 'networkidle' });

  const identity = page.locator('#source-identity');
  await expect(identity).toContainText('Work는 여러 revision을 묶는 Source의 논리 identity');
  await expect(identity).toContainText('WorkVersion은 불변 DocumentVersion');
  await expect(identity).toContainText('SourceEvent는 새 snapshot을 ingestion하게 만든 관측 trigger');

  const invalidation = page.locator('#invalidation');
  await expect(invalidation).toContainText('I(e)');
  await expect(invalidation).toContainText('I(ΔS)');
  await expect(invalidation).toContainText('같은 provenance graph 계산');

  const handoff = page.locator('[data-learning-handoff]').last();
  await expect(handoff.getByRole('link', { name: /RAG 파이프라인/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/rag-pipeline',
  );
});

test('RAG 2020 keeps its latent-document contract and artifact discrepancy source-locked', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/paper-rag-2020`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-rag-latent-document]')).toBeVisible();
  await expect(page.locator('#sequence-token')).toContainText('RAG-Sequence');
  await expect(page.locator('#sequence-token')).toContainText('RAG-Token');
  await expect(page.locator('[data-formula-pair]')).toHaveCount(3);
  await expect(page.locator('[data-formula-note]')).toHaveCount(3);

  const evidence = page.locator('#evidence-boundary');
  await expect(evidence).toContainText('부록 G');
  await expect(evidence).toContainText('728차원');
  await expect(evidence).toContainText('768차원');
  await expect(evidence.getByRole('link', { name: /Meta RAG checkpoint config/ })).toHaveAttribute(
    'href',
    'https://huggingface.co/facebook/rag-token-nq/blob/main/config.json',
  );

  const audit = await page.evaluate(() => ({
    documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    formulaOverflow: [...document.querySelectorAll<HTMLElement>('[data-math-fit]')]
      .filter((formula) => formula.scrollWidth - formula.clientWidth > 1)
      .length,
    rawLatex: /\\(?:operatorname|underbrace|frac|sum|prod)\b/.test(document.body.innerText),
  }));
  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(audit.formulaOverflow).toBe(0);
  expect(audit.rawLatex).toBe(false);
});

test('CoDaR exposes real chunk dependencies and separates paper routing from product ownership', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/research-codar-2026`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-context-dependency-routing]');
  await expect(lab).toContainText('모터의 연속 허용 토크는 42 N·m다');
  await expect(lab.locator('[data-context-score]')).toContainText('DCDS 0.89');
  await expect(lab.locator('[data-context-route]')).toHaveText('Full-Context');
  await expect(lab.locator('[data-dependency-kind="논리"]')).toBeVisible();

  await lab.getByRole('button', { name: '독립 사양 묶음', exact: true }).click();
  await expect(lab.locator('[data-context-score]')).toContainText('DCDS 0.11');
  await expect(lab.locator('[data-context-route]')).toHaveText('분해형 방법');
  await lab.getByRole('button', { name: 'c5', exact: true }).click();
  await expect(lab.locator('[data-active-chunk="c5"]')).toContainText('이 switch는 64개의 physical port');
  await expect(lab.locator('[data-dependency-kind="지시어"]')).toContainText('세 칸 앞의 Switch B');

  await lab.getByRole('button', { name: '연속 안전 문서', exact: true }).click();
  await lab.getByLabel('CoDaR routing threshold').fill('0.95');
  await expect(lab.locator('[data-context-route]')).toHaveText('분해형 방법');

  const transfer = page.locator('#production-transfer');
  await expect(transfer).toContainText('정확도 84.6%');
  await expect(transfer).toContainText('Cohen');
  await expect(transfer).toContainText('critical relation guard');
  await expect(transfer.locator('[data-knowledge-owner-handoff]')).toContainText('Manual 1.3');
  await expect(transfer.getByRole('link', { name: 'Source Ingestion', exact: true })).toHaveAttribute(
    'href',
    '/lab/blog/ai/knowledge-source-ingestion',
  );
  await expect(transfer.getByRole('link', { name: 'Knowledge IR', exact: true })).toHaveAttribute(
    'href',
    '/lab/blog/ai/knowledge-ir-evidence-lineage',
  );
  await expect(transfer.getByRole('link', { name: 'Research Watcher', exact: true })).toHaveAttribute(
    'href',
    '/lab/blog/ai/knowledge-research-watcher',
  );
  await expect(page.locator('[data-formula-pair]')).toHaveCount(6);
  await expect(page.locator('[data-formula-note]')).toHaveCount(6);

  const audit = await page.evaluate(() => {
    const viz = document.querySelector<HTMLElement>('[data-context-dependency-routing]')!;
    const undersized = [...viz.querySelectorAll<HTMLElement>('p, span, button, strong, label')]
      .filter((node) => node.innerText.trim() && Number.parseFloat(getComputedStyle(node).fontSize) < 12)
      .map((node) => ({ text: node.innerText.trim(), size: getComputedStyle(node).fontSize }));
    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      vizOverflow: viz.scrollWidth - viz.clientWidth,
      formulaOverflow: [...document.querySelectorAll<HTMLElement>('[data-math-fit]')]
        .filter((formula) => formula.scrollWidth - formula.clientWidth > 1)
        .length,
      rawLatex: /\\(?:operatorname|underbrace|frac|sum|prod|mathbb)\b/.test(document.body.innerText),
      undersized,
    };
  });
  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(audit.vizOverflow).toBeLessThanOrEqual(1);
  expect(audit.formulaOverflow).toBe(0);
  expect(audit.rawLatex).toBe(false);
  expect(audit.undersized).toEqual([]);
});

test('Document AI route defines its IR and sends table, formula and release checks to exact owners', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/ocr-document-ai-map`, { waitUntil: 'networkidle' });

  const contract = page.locator('#document-contract');
  await expect(contract.getByText('Reading order', { exact: true })).toBeVisible();
  await expect(contract).toContainText('사람이 읽어야 할 순서');
  await expect(contract.getByText('IR · Intermediate Representation', { exact: true })).toBeVisible();

  const route = page.locator('#route');
  await expect(route.getByRole('link', { name: /HTML Table Grid/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/html-table-structure-reconstruction',
  );
  await expect(route.getByRole('link', { name: /Formula · LaTeX Verify/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/ocr-runtime-evaluation#verification',
  );
  await expect(route.getByRole('link', { name: /Runtime · Release · RAG/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/ocr-runtime-evaluation#quality-gates',
  );
  await expect(route).toContainText('수식이 있는 논문은 03B에서 LaTeX parse와 허용 symbol set을 통과해야 한다');
});

test('Robot timing introduces DoF and connects trapezoidal acceleration jumps to S-curves', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-trajectory-generation`, { waitUntil: 'networkidle' });

  await expect(page.locator('#limit-retiming')).toContainText('자유도(Degree of Freedom, DoF)');
  const jerk = page.locator('#jerk-online');
  await expect(jerk).toContainText('trapezoidal velocity profile');
  await expect(jerk).toContainText('acceleration이 계단처럼 바뀌어');
  await expect(jerk).toContainText('S-curve');
  await expect(jerk).toContainText('유한한 jerk 구간');

  const corner = page.locator('[data-corner-blend-lab]');
  await expect(corner.locator('svg.sm\\:hidden').getByText('obstacle', { exact: true })).toBeVisible();

  const profiles = page.locator('[data-time-scaling-profiles]');
  await profiles.getByRole('button', { name: 'Cubic', exact: true }).click();
  const accelerationMargin = await profiles.locator('[data-profile-key="a"] svg').evaluate((svg) => {
    const rect = svg.getBoundingClientRect();
    const curve = svg.querySelector('path')!.getBoundingClientRect();
    return { top: curve.top - rect.top, bottom: rect.bottom - curve.bottom };
  });
  expect(accelerationMargin.top).toBeGreaterThan(2);
  expect(accelerationMargin.bottom).toBeGreaterThan(2);

  const retarget = page.locator('[data-retarget-lab]');
  await expect(retarget.locator('[data-retarget-panel="j"]')).toBeVisible();
  await expect(retarget.locator('[data-jerk-peak]')).toBeVisible();
  await expect(retarget).toContainText('retarget 경계 · 점선은 ±j limit');
});
