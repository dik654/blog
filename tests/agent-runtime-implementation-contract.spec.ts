import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const;

async function overflow(page: import('@playwright/test').Page, selector: string) {
  return page.evaluate((target) => {
    const element = document.querySelector<HTMLElement>(target);
    return {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      element: element ? element.scrollWidth - element.clientWidth : Number.POSITIVE_INFINITY,
    };
  }, selector);
}

for (const viewport of viewports) {
  test(`policy article exposes all-match intent semantics at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/claw-policy-engine`, { waitUntil: 'networkidle' });

    const article = page.locator('article');
    const lab = page.locator('[data-policy-evaluation-lab]');
    await expect(lab).toBeVisible();
    await expect(article).toContainText('상태 머신이 아니라 상태에서 action을 계산하는 함수');
    await expect(article).toContainText('first-match break가 없다');
    await expect(article).toContainText('raw u8');
    await expect(article).not.toContainText('30초 간격으로 무한 반복');
    await expect(lab).toHaveAttribute('data-matched-rule-count', '2');
    await expect(lab.locator('[data-policy-rule-priority]')).toHaveText(['p5', 'p20', 'p40', 'p60']);
    await expect(lab).toContainText('Chain[MergeToDev, Chain[Notify(review)]]');
    await expect(lab.locator('[data-policy-action]')).toHaveText([
      '1. MergeToDev',
      '2. Notify(review)',
      '3. RecoverOnce',
    ]);
    await expect(lab.locator('[data-policy-actions]')).toContainText('MergeToDev');
    await expect(lab.locator('[data-policy-actions]')).toContainText('RecoverOnce');

    await lab.getByLabel('green level').selectOption('0');
    await expect(lab).toHaveAttribute('data-matched-rule-count', '1');
    await expect(lab.locator('[data-policy-actions]')).not.toContainText('MergeToDev');

    await lab.getByLabel('branch age').selectOption('15');
    await expect(lab).toHaveAttribute('data-matched-rule-count', '0');
    await expect(lab.locator('[data-policy-actions]')).toContainText('빈 Vec');

    await lab.getByText('already reconciled').click();
    await expect(lab).toHaveAttribute('data-matched-rule-count', '1');
    await expect(lab.locator('[data-policy-actions]')).toContainText('CloseoutLane');
    await expect(lab.locator('[data-policy-actions]')).toContainText('CleanupSession');

    const size = await overflow(page, '[data-policy-evaluation-lab]');
    expect(size.document).toBeLessThanOrEqual(1);
    expect(size.element).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test(`tool article separates visible, authorized, dispatched, observed at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/claw-tool-system`, { waitUntil: 'networkidle' });

    const article = page.locator('article');
    const lab = page.locator('[data-tool-runtime-lab]');
    await expect(lab).toBeVisible();
    await expect(article).toContainText('schema 노출, permission 판정, executor dispatch, effect observation');
    await expect(article).toContainText('runtime definition을 직접 dispatch하지 않는다');
    await expect(article).toContainText('Prompt라는 이유만으로 매번 질문하지 않는다');
    await expect(lab).toHaveAttribute('data-tool-result', 'observed');

    await lab.getByLabel('호출 후보').selectOption('bash-write');
    await expect(lab).toHaveAttribute('data-tool-result', 'denied');
    await expect(lab).toContainText('permission denied');

    await lab.getByLabel('active permission mode').selectOption('prompt');
    await expect(lab).toHaveAttribute('data-tool-result', 'observed');
    await expect(lab).toContainText('plain requirement는 mode 순서 비교로 허용 가능');
    await lab.getByText('ask rule 또는 hook Ask').click();
    await expect(lab).toHaveAttribute('data-tool-result', 'approval');
    await expect(lab).toContainText('명시적 ask가 사용자 결정을 기다림');
    await lab.getByText('사용자 승인').click();
    await expect(lab).toHaveAttribute('data-tool-result', 'observed');
    await lab.getByText('ask rule 또는 hook Ask').click();

    await lab.getByLabel('active permission mode').selectOption('danger-full-access');
    await expect(lab).toHaveAttribute('data-tool-result', 'observed');
    await expect(lab).toContainText('삭제 결과와 exit status');

    await lab.getByText('이 도구를 model request의 definitions에 포함').click();
    await expect(lab).toHaveAttribute('data-tool-result', 'hidden');
    await expect(lab).toContainText('model 선택 공간에서 제거됨');
    await lab.getByText('숨긴 이름의 ToolUse를 강제 주입').click();
    await expect(lab).toHaveAttribute('data-tool-result', 'observed');
    await lab.getByText('executor allowlist 통과').click();
    await expect(lab).toHaveAttribute('data-tool-result', 'executor-blocked');

    await lab.getByText('이 도구를 model request의 definitions에 포함').click();
    await lab.getByText('executor allowlist 통과').click();
    await lab.getByLabel('호출 후보').selectOption('runtime');
    await lab.getByLabel('active permission mode').selectOption('read-only');
    await expect(lab).toHaveAttribute('data-tool-result', 'unwired');
    await expect(lab).toContainText('definition은 보이지만 executor가 없음');
    await expect(lab).toContainText('executor 미배선');
    await lab.getByLabel('higher-level runtime executor 연결').check();
    await expect(lab).toHaveAttribute('data-tool-result', 'observed');
    await expect(lab).toContainText('higher-level runtime/MCP executor');
    await expect(lab).toContainText('registry execute와 별도 배선');

    const size = await overflow(page, '[data-tool-runtime-lab]');
    expect(size.document).toBeLessThanOrEqual(1);
    expect(size.element).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
