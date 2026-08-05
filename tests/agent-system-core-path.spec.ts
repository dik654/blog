import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const articles = [
  { slug: 'agent-runtime-current-first', lab: '[data-agent-runtime-stack]' },
  { slug: 'computer-use-agent-runtime', lab: '[data-computer-use-loop]' },
  { slug: 'agentic-patterns', lab: '[data-agent-loop-lab]' },
  { slug: 'context-engineering', lab: '[data-context-packet-lab]' },
  { slug: 'mcp-protocol', lab: '[data-mcp-round-trip-lab]' },
  { slug: 'llm-harness', lab: '[data-harness-control-lab]' },
] as const;

for (const viewport of viewports) {
  for (const article of articles) {
    test(`${article.slug} preserves the agent-system contract on ${viewport.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));

      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('article')).toBeVisible();
      await expect(page.locator(article.lab)).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      const layout = await page.evaluate((labSelector) => {
        const article = document.querySelector<HTMLElement>('article');
        const lab = document.querySelector<HTMLElement>(labSelector);
        const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
        const visible = article?.cloneNode(true) as HTMLElement | undefined;
        visible?.querySelectorAll('.katex-mathml').forEach((node) => node.remove());

        return {
          documentOverflow: document.documentElement.scrollWidth - innerWidth,
          articleOverflow: article ? article.scrollWidth - article.clientWidth : 999,
          labOverflow: lab ? lab.scrollWidth - lab.clientWidth : 999,
          rawLatex: /\\(?:theta|tau|frac|sum|prod|partial|underbrace|operatorname)\b/.test(visible?.innerText ?? ''),
          formulaOverflow: formulas.map((formula) => formula.scrollWidth - formula.clientWidth),
          formulaScales: formulas.map((formula) => Number(formula.dataset.mathScale ?? '1')),
          formulaHasKorean: formulas.map((formula) => /[가-힣]/.test(formula.innerText)),
          unpairedFormulaCount: formulas.filter((formula) => {
            const pair = formula.closest('[data-formula-pair]');
            return !pair?.querySelector('[data-formula-note]');
          }).length,
        };
      }, article.lab);

      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.articleOverflow).toBeLessThanOrEqual(1);
      expect(layout.labOverflow).toBeLessThanOrEqual(1);
      expect(layout.rawLatex).toBe(false);
      expect(layout.formulaOverflow.every((overflow) => overflow <= 1)).toBe(true);
      expect(layout.formulaScales.every((scale) => scale >= 0.68)).toBe(true);
      expect(layout.formulaHasKorean.every(Boolean)).toBe(true);
      expect(layout.unpairedFormulaCount).toBe(0);
      expect(errors).toEqual([]);
    });
  }
}

test('the current-first labs expose causal state changes and MCP keyboard navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/agent-runtime-current-first`, { waitUntil: 'networkidle' });
  const runtime = page.locator('[data-agent-runtime-stack]');
  await runtime.getByRole('button', { name: '한 번 답하기', exact: true }).click();
  await expect(runtime.getByText('선택', { exact: true })).toHaveCount(3);
  await runtime.getByRole('button', { name: 'GUI 작업', exact: true }).click();
  await expect(runtime.getByText('필수', { exact: true })).toHaveCount(4);
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  for (const selector of [
    '[data-agent-runtime-stack]',
    '[data-action-surface-lab]',
    '[data-protocol-boundary-lab]',
    '[data-agent-route-chooser]',
  ]) {
    const lab = page.locator(selector);
    await lab.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    const box = await lab.boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(70);
    expect(box?.y).toBeLessThanOrEqual(90);
  }

  await page.goto(`${base}/lab/blog/ai/computer-use-agent-runtime`, { waitUntil: 'networkidle' });
  const computer = page.locator('[data-computer-use-loop]');
  await computer.getByRole('button', { name: '결제 제출', exact: true }).click();
  await computer.getByRole('button', { name: /Gate/ }).click();
  await expect(computer).toContainText('금액·대상·action hash');
  const retry = page.locator('[data-retry-safety-lab]');
  await expect(retry.getByText('VERIFY FIRST', { exact: true })).toBeVisible();
  await retry.getByLabel('내역 조회로 effect 없음 확인').check();
  await expect(retry.getByText('RETRY ONCE', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/agentic-patterns`, { waitUntil: 'networkidle' });
  const agent = page.locator('[data-agent-loop-lab]');
  await agent.getByRole('button', { name: '코드 수정', exact: true }).click();
  await expect(agent.getByText('Harnessed agent', { exact: true })).toBeVisible();
  await expect(agent.getByText('checkpoint', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/context-engineering`, { waitUntil: 'networkidle' });
  const context = page.locator('[data-context-packet-lab]');
  await context.getByRole('button', { name: '전부 넣기', exact: true }).click();
  await context.getByRole('button', { name: '4k', exact: true }).click();
  await expect(context.getByText('Admission 실패', { exact: true })).toBeVisible();
  await expect(context.getByText('14,650 / 4,000', { exact: true })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/mcp-protocol`, { waitUntil: 'networkidle' });
  const mcp = page.locator('[data-mcp-round-trip-lab]');
  await mcp.getByRole('button', { name: 'Tool 오류', exact: true }).click();
  const firstTab = mcp.getByRole('tab', { name: /요청 기술/ });
  await firstTab.focus();
  await firstTab.press('End');
  await expect(mcp.getByRole('tab', { name: /결과/ })).toBeFocused();
  await expect(mcp).toContainText('"isError":true');
  await expect(mcp.getByText('Tool 실행 실패', { exact: false })).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/llm-harness`, { waitUntil: 'networkidle' });
  const harness = page.locator('[data-harness-control-lab]');
  await harness.getByRole('button', { name: 'Policy gate', exact: true }).click();
  await expect(harness.getByText('무단 변경', { exact: true })).toBeVisible();
  await expect(harness.getByText('BLOCK', { exact: true })).toBeVisible();
});

test('the agent hub branches first and each branch keeps only its owned order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-authored-learning-path="ai-agent-system-core"]')).toHaveCount(0);
  const branches = page.locator('[data-branching-learning-hub]');
  await expect(branches).toBeVisible();
  expect(await branches.evaluate((node) => node.compareDocumentPosition(document.querySelector('[data-topdown-research-route="ai-agents"]')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  await expect(branches).toContainText('6개 분기');
  await expect(branches.locator('[data-target-route-contract]')).toHaveCount(0);

  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-foundations`, { waitUntil: 'networkidle' });
  const foundationPath = page.locator('[data-authored-learning-path="ai-agent-system-core"]');
  const hrefs = await foundationPath.getByRole('link').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  );
  expect(hrefs).toEqual([
    '/lab/blog/ai/agentic-patterns',
    '/lab/blog/ai/context-engineering',
  ]);
});
