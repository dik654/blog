import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`document assembly preserves evidence, abstention and responsive math on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/document-structure-assembly`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Page가 맞아도 document는 틀릴 수 있다' })).toBeVisible();
    await expect(page.locator('[data-document-assembly-lab]')).toHaveAttribute('data-mode', 'pages');
    await expect(page.locator('[data-cross-page-relation]')).toHaveAttribute('data-relation', 'table');
    await expect(page.locator('[data-cross-page-relation]')).toHaveAttribute('data-decision', 'review');
    await expect(page.locator('[data-overlap-sync]')).toHaveAttribute('data-scenario', 'conflict');
    await expect(page.locator('[data-overlap-sync]')).toHaveAttribute('data-result', 'review');
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('[data-math-fit]')).toHaveCount(4);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('article pre')).toHaveCount(0);
    await expect(page.locator('[data-formula-note]').nth(1)).toContainText('τ');
    await expect(page.locator('[data-formula-note]').nth(1)).toContainText('δ');
    await expect(page.locator('[data-formula-note]').nth(1)).toContainText('1위와 2위');
    await expect(page.getByText('TEDS(Tree-Edit-Distance-based Similarity)', { exact: false })).toBeVisible();

    const typedBlock = page.locator('[data-typed-block-strip]');
    await typedBlock.getByRole('button', { name: 'Heading', exact: true }).click();
    await expect(typedBlock.getByText('level · typography · heading_path', { exact: true })).toBeVisible();
    await typedBlock.getByRole('button', { name: 'Table', exact: true }).click();
    await expect(typedBlock.getByText('html · cells · column_signature', { exact: true })).toBeVisible();

    const assembly = page.locator('[data-document-assembly-lab]');
    await assembly.getByRole('button', { name: '조립된 문서', exact: true }).click();
    await expect(assembly).toHaveAttribute('data-mode', 'assembled');
    await expect(assembly.getByText('table continues', { exact: true })).toBeVisible();
    await expect(assembly.getByText('caption describes', { exact: true })).toBeVisible();

    const relation = page.locator('[data-cross-page-relation]');
    await relation.getByRole('button', { name: '문단 이어짐', exact: true }).click();
    await expect(relation).toHaveAttribute('data-decision', 'accept');
    await expect(relation.getByText('자동 연결', { exact: true })).toBeVisible();
    await relation.getByRole('button', { name: '그림·캡션', exact: true }).click();
    await expect(relation).toHaveAttribute('data-decision', 'reject');
    await expect(relation.getByText('연결 거절', { exact: true })).toBeVisible();

    const sync = page.locator('[data-overlap-sync]');
    await sync.getByRole('button', { name: '일치', exact: true }).click();
    await expect(sync).toHaveAttribute('data-result', 'merge');
    await sync.getByRole('button', { name: '겹침 없음', exact: true }).click();
    await expect(sync).toHaveAttribute('data-result', 'reject');

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
      rawLatex: /\\(?:underbrace|operatorname|begin|cases)/.test((element as HTMLElement).innerText ?? ''),
    })));
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.rawLatex).toBe(false);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('Document AI exposes the current-first route before its sequential execution layers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-ocr`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 1, name: 'OCR · 문서 AI' })).toBeVisible();
  await expect(page.getByRole('link', { name: /00 · 문서 계약/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /01 · Page Parser/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /02 · Document Assembly/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /03 · Release · RAG/ }).first()).toBeVisible();

  const branches = page.locator('[data-subcategory-branches]');
  await expect(branches).toBeVisible();
  await expect(branches.getByRole('link')).toHaveCount(4);
  await expect(branches).toHaveAttribute('data-child-navigation-mode', 'sequence');
  await expect(branches).toHaveAttribute('data-child-navigation-placement', 'after-track');

  const route = page.locator('[data-topdown-research-route="document-ai"]');
  await expect(route).toHaveAttribute('data-route-usage', 'primary-path');
  await expect(route.locator('[data-route-stage]')).toHaveCount(5);
  await expect(route.locator('a[href^="/lab/blog/ai/ocr-document-ai-map"]').first()).toBeVisible();
  await expect(route.locator('a[href^="/lab/blog/ai/document-structure-assembly"]').first()).toBeVisible();
  expect(await route.evaluate((node, childNavigation) => (
    Boolean(node.compareDocumentPosition(childNavigation as Node) & Node.DOCUMENT_POSITION_FOLLOWING)
  ), await branches.elementHandle())).toBe(true);

  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('Document map and PaddleOCR page use scan-friendly tools without raw tables', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/ocr-document-ai-map`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-document-execution-path]')).toBeVisible();
  const executionPath = page.locator('[data-document-execution-path]');
  await executionPath.getByRole('button', { name: /Document assembly/ }).click();
  await expect(executionPath.getByText('Document tree + relation', { exact: true })).toBeVisible();
  await expect(page.locator('[data-document-assembly-lab]')).toBeVisible();
  const parserBoundary = page.locator('[data-parser-boundary-lab]');
  await parserBoundary.getByRole('button', { name: 'olmOCR 2', exact: true }).click();
  await expect(parserBoundary.getByText('검증 가능한 training signal 사례', { exact: true })).toBeVisible();
  const releaseQuestions = page.locator('[data-document-release-questions]');
  await releaseQuestions.getByRole('button', { name: '근거', exact: true }).click();
  await expect(releaseQuestions.getByText(/document·page·bbox/)).toBeVisible();
  await expect(page.locator('article table')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

  await page.goto(`${base}/lab/blog/ai/paddleocr-vl`, { waitUntil: 'networkidle' });
  const parser = page.locator('[data-paddle-page-parser]');
  const parserStepViz = page.locator('[data-step-viz]').filter({ has: parser });
  await expect(parser).toBeVisible();
  await parserStepViz.getByRole('button', { name: 'step 2', exact: true }).click();
  await expect(parser).toHaveAttribute('data-step', '1');
  await expect(parser.getByText('PP-DocLayoutV2', { exact: true })).toBeVisible();
  await parserStepViz.getByRole('button', { name: 'step 4', exact: true }).click();
  await expect(parser).toHaveAttribute('data-step', '3');
  await expect(parser.getByText('Element output', { exact: true })).toBeVisible();
  await parserStepViz.getByRole('button', { name: 'step 6', exact: true }).click();
  await expect(parser).toHaveAttribute('data-step', '5');
  await expect(parser.getByText('Verified page packet', { exact: true })).toBeVisible();
  await expect(page.locator('article pre')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '1.6은 무엇이 달라졌나', exact: true })).toBeVisible();
  await expect(page.locator('article table')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('Document AI interactive surfaces keep readable labels and direct-entry spacing on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const auditSurface = async (selector: string) => {
    const surface = page.locator(selector).first();
    await expect(surface).toBeVisible();
    await page.evaluate(() => document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important'));
    await surface.evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(80);

    const metrics = await surface.evaluate((element) => {
      const visible = (node: Element) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const textNodes = Array.from(element.querySelectorAll('p, span, strong, code, button, dt, dd, li'))
        .filter((node) => visible(node) && (node.textContent ?? '').trim().length > 0);
      const buttons = Array.from(element.querySelectorAll('button')).filter(visible);
      return {
        top: element.getBoundingClientRect().top,
        overflow: element.scrollWidth - element.clientWidth,
        minFont: Math.min(...textNodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))),
        minButton: buttons.length ? Math.min(...buttons.map((button) => button.getBoundingClientRect().height)) : 44,
      };
    });

    expect(metrics.top).toBeGreaterThanOrEqual(70);
    expect(metrics.top).toBeLessThanOrEqual(90);
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.minFont).toBeGreaterThanOrEqual(12);
    expect(metrics.minButton).toBeGreaterThanOrEqual(44);
  };

  await page.goto(`${base}/lab/blog/ai/ocr-document-ai-map`, { waitUntil: 'networkidle' });
  for (const selector of [
    '[data-document-execution-path]',
    '[data-parser-boundary-lab]',
    '[data-document-release-questions]',
    '[data-document-assembly-lab]',
    '[data-typed-block-strip]',
  ]) {
    await auditSurface(selector);
  }

  await page.goto(`${base}/lab/blog/ai/document-structure-assembly`, { waitUntil: 'networkidle' });
  for (const selector of [
    '[data-cross-page-relation]',
    '[data-overlap-sync]',
    '[data-document-release-gate]',
  ]) {
    await auditSurface(selector);
  }

  await page.goto(`${base}/lab/blog/ai/paddleocr-vl`, { waitUntil: 'networkidle' });
  await auditSurface('[data-step-viz]');

  await page.goto(`${base}/lab/blog/ai/ocr-runtime-evaluation`, { waitUntil: 'networkidle' });
  await auditSurface('[data-step-viz]');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

for (const viewport of viewports) {
  test(`HTML table reconstruction keeps source, grid and formulas aligned on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/html-table-structure-reconstruction`, { waitUntil: 'networkidle' });

    const tableLab = page.getByRole('group', { name: '표 구조 오류 선택' }).locator('..');
    await tableLab.getByRole('button', { name: '셀 누락', exact: true }).click();
    await expect(tableLab.getByText(/마지막 열에 확정/)).toBeVisible();
    await tableLab.getByRole('button', { name: 'slot 충돌', exact: true }).click();
    await expect(tableLab.getByText(/text:"매출"/)).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(3);
    await expect(page.locator('[data-formula-note]')).toHaveCount(3);

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
    })));
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('Table reconstruction and runtime release keep collision, overflow and provenance failures distinct', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/html-table-structure-reconstruction`, { waitUntil: 'networkidle' });
  const tableLab = page.getByRole('group', { name: '표 구조 오류 선택' }).locator('..');
  await tableLab.getByRole('button', { name: 'slot 충돌', exact: true }).click();
  await expect(tableLab.getByText(/같은 slot을 두 origin cell/)).toBeVisible();
  await tableLab.getByRole('button', { name: '열 초과', exact: true }).click();
  await expect(tableLab.getByText(/slot 충돌과는 다른 오류/)).toBeVisible();
  await expect(tableLab.getByText(/Q1 2칸 \+ Q2 1칸 = 3칸/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'OCR 런타임과 평가', exact: true })).toHaveAttribute('href', '/lab/blog/ai/ocr-runtime-evaluation');

  await page.goto(`${base}/lab/blog/ai/ocr-runtime-evaluation`, { waitUntil: 'networkidle' });
  const release = page.locator('[data-ocr-release-lab]');
  const releaseStepViz = page.locator('[data-step-viz]').filter({ has: release });
  await releaseStepViz.getByRole('button', { name: 'step 5', exact: true }).click();
  await expect(release).toHaveAttribute('data-step', '4');
  await expect(release.getByText('검토', { exact: true })).toBeVisible();
  await releaseStepViz.getByRole('button', { name: '출처 좌표 누락', exact: true }).click();
  await expect(release.getByText('차단', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'HTML 표 구조 복원', exact: true })).toHaveAttribute('href', '/lab/blog/ai/html-table-structure-reconstruction');
  await expect(page.getByRole('link', { name: '앞 단계인 Document Assembly', exact: true })).toHaveAttribute('href', '/lab/blog/ai/document-structure-assembly');
  await expect(page.locator('[data-math-fit]')).toHaveCount(1);
  await expect(page.locator('[data-formula-note]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

for (const viewport of viewports) {
  test(`olmOCR reconstructs correctness, reward and development causality on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/olmocr-2`, { waitUntil: 'networkidle' });

    const overview = page.locator('[data-olmocr-overview]');
    const trace = page.locator('[data-olmocr-trace]');
    const verifier = page.locator('[data-olmocr-verifier]');
    const development = page.locator('[data-olmocr-development]');
    await expect(overview).toBeVisible();
    await expect(trace).toBeVisible();
    await expect(verifier).toBeVisible();
    await expect(development).toBeVisible();

    await overview.getByRole('button', { name: '가까워도 오답', exact: true }).click();
    await expect(overview.getByText('FAIL', { exact: true })).toBeVisible();
    await expect(overview.getByText(/문자 상당수가 맞아도/)).toBeVisible();
    await overview.getByRole('button', { name: '수식 렌더링', exact: true }).click();
    await expect(overview.getByText(/문자열은 더 멀어도 정답/)).toBeVisible();
    await expect(overview.getByText('PASS', { exact: true })).toBeVisible();

    await expect(verifier.locator('[data-page-reward]')).toContainText('4 / 6 = 0.67');
    await verifier.getByRole('switch', { name: /표 관계/ }).click();
    await expect(verifier.locator('[data-page-reward]')).toContainText('5 / 6 = 0.83');
    await verifier.getByRole('switch', { name: /기본 안정성/ }).click();
    await expect(verifier.locator('[data-page-reward]')).toContainText('6 / 6 = 1.00');
    await expect(verifier.getByText(/공개되지 않은 결합 가중치/)).toBeVisible();

    await development.getByRole('button', { name: /78.5 빈 페이지/ }).click();
    await expect(development.getByText(/점수는 그대로여도 실제 hallucination 버그/)).toBeVisible();
    await development.getByRole('button', { name: /82.4 RLVR/ }).click();
    await expect(development.getByText(/RLVR 하나의 고립된 효과/)).toBeVisible();

    await expect(trace.getByText('Semantic HTML 생성', { exact: true })).toBeVisible();
    await expect(trace.getByText(/같은 synthetic page의 여러 completion/)).toBeVisible();
    await expect(page.locator('[data-learning-question]')).toHaveCount(1);
    await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
    await expect(page.locator('[data-math-fit]')).toHaveCount(1);
    await expect(page.locator('[data-formula-note]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Post-training RLVR', exact: true })).toHaveAttribute('href', /post-training-rlvr/);
    await expect(page.getByRole('link', { name: 'Document AI 실행 지도', exact: true })).toHaveAttribute('href', /ocr-document-ai-map/);
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('article pre')).toHaveCount(0);

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
      rawLatex: /\\(?:underbrace|mathbf|sum|text)/.test((element as HTMLElement).innerText ?? ''),
    })));
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.rawLatex).toBe(false);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
