import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';

const routes = {
  permissions: `${base}/lab/blog/ai/claw-permissions`,
  fileOps: `${base}/lab/blog/ai/claw-file-ops`,
  bash: `${base}/lab/blog/ai/claw-bash`,
} as const;

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page, selector: string) {
  const overflow = await page.evaluate((target) => {
    const element = document.querySelector<HTMLElement>(target);
    return {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      element: element ? element.scrollWidth - element.clientWidth : -1,
    };
  }, selector);

  expect(overflow.document).toBeLessThanOrEqual(0);
  expect(overflow.element).toBeLessThanOrEqual(0);
}

test.describe('Claw security boundary teaching contracts', () => {
  test('permission conflict lab preserves precedence and Prompt handoff', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routes.permissions, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-permission-decision-lab]');
    await expect(lab).toBeVisible();
    await expect(lab.locator('[data-permission-scenario="unknown"]')).toContainText('기본값 DangerFullAccess');
    await expectNoHorizontalOverflow(page, '[data-permission-decision-lab]');

    await lab.getByRole('button', { name: 'Deny + Hook Allow' }).click();
    await expect(lab.locator('[data-permission-scenario="deny-override"]')).toContainText('즉시 Deny');
    await expect(lab.locator('[data-permission-scenario="deny-override"]')).toContainText('Allow는 평가되지 않음');
    await expectNoHorizontalOverflow(page, '[data-permission-decision-lab]');

    await lab.getByRole('button', { name: 'Ask + UI 없음' }).click();
    await expect(lab.locator('[data-permission-scenario="headless-ask"]')).toContainText('fail-closed Deny');
    await expectNoHorizontalOverflow(page, '[data-permission-decision-lab]');

    await lab.getByRole('button', { name: 'Hook Allow + Ask' }).click();
    await expect(lab.locator('[data-permission-scenario="allow-ask"]')).toContainText('사용자에게 질문');
    await expect(lab.locator('[data-permission-scenario="allow-ask"]')).toContainText('Allow guidance');
    await expectNoHorizontalOverflow(page, '[data-permission-decision-lab]');

    await lab.getByRole('button', { name: 'Prompt policy' }).click();
    await expect(lab.locator('[data-permission-scenario="prompt-policy"]')).toContainText('mode comparison → Allow');
    await expect(lab.locator('[data-permission-scenario="prompt-policy"]')).toContainText('enum-order 결함');
    await expectNoHorizontalOverflow(page, '[data-permission-decision-lab]');

    await lab.getByRole('button', { name: 'Prompt enforcer' }).click();
    await expect(lab.locator('[data-permission-scenario="prompt-handoff"]')).toContainText('최종 사용자 승인 증거가 아니다');
    await expectNoHorizontalOverflow(page, '[data-permission-decision-lab]');

    await page.getByRole('button', { name: 'permission 호출 그래프 보기' }).click();
    await expect(page.getByText('L1-77', { exact: false })).toBeVisible();
    await expect(page.locator('body')).toContainText('self.permission_policy.authorize_with_context');
    await expect(page.locator('body')).toContainText('execute_tool_with_enforcer(None, name, input)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });

  test('file lab separates current helpers from open-time target design', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routes.fileOps, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-file-boundary-lab]');
    await expect(lab).toBeVisible();
    await expect(lab.locator('[data-file-scenario="read"]')).toContainText('CURRENT TEXT CONTRACT');
    await expectNoHorizontalOverflow(page, '[data-file-boundary-lab]');

    await lab.getByRole('button', { name: '직접 쓰기' }).click();
    await expect(lab.locator('[data-file-scenario="direct-write"]')).toContainText('NON-ATOMIC');
    await expectNoHorizontalOverflow(page, '[data-file-boundary-lab]');

    await lab.getByRole('button', { name: '외부 심링크' }).click();
    await expect(lab.locator('[data-file-scenario="symlink"]')).toContainText('production 경로에 없음');
    await expectNoHorizontalOverflow(page, '[data-file-boundary-lab]');

    await lab.getByRole('button', { name: '검사 후 교체' }).click();
    await expect(lab.locator('[data-file-scenario="swap-race"]')).toContainText('TOCTOU');
    await expectNoHorizontalOverflow(page, '[data-file-boundary-lab]');

    await lab.getByRole('button', { name: '강한 목표 설계' }).click();
    await expect(lab.locator('[data-file-scenario="open-time"]')).toContainText('현재 Claw 구현이 아니라');
    await expectNoHorizontalOverflow(page, '[data-file-boundary-lab]');

    await page.getByRole('button', { name: 'production file dispatch 보기' }).click();
    await expect(page.getByText('L1-52', { exact: false })).toBeVisible();
    await expect(page.locator('body')).toContainText('from_value::<ReadFileInput>(input).and_then(run_read_file)');
    await expect(page.locator('body')).toContainText('from_value::<GrepSearchInput>(input).and_then(run_grep_search)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });

  test('shell lab exposes unwired validation, fail-open fallback, and process gaps', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(routes.bash, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-shell-boundary-lab]');
    await expect(lab).toBeVisible();
    await expect(page.locator('#validation-pipeline')).toBeVisible();
    await expect(lab.locator('[data-shell-scenario="permission"]')).toContainText('branch 상태에 따라 조기 반환');
    await expectNoHorizontalOverflow(page, '[data-shell-boundary-lab]');

    await lab.getByRole('button', { name: '검증 미연결' }).click();
    await expect(lab.locator('[data-shell-scenario="unwired"]')).toContainText('동일 파일 tests뿐');
    await expectNoHorizontalOverflow(page, '[data-shell-boundary-lab]');

    await lab.getByRole('button', { name: 'launcher 없음' }).click();
    await expect(lab.locator('[data-shell-scenario="fallback"]')).toContainText('host sh -lc');
    await expect(lab.locator('[data-shell-scenario="fallback"]')).toContainText('격리 둘 다 비활성');
    await expectNoHorizontalOverflow(page, '[data-shell-boundary-lab]');

    await lab.getByRole('button', { name: 'workspace-only' }).click();
    await expect(lab.locator('[data-shell-scenario="filesystem"]')).toContainText('실제 bind enforcement 없음');
    await expectNoHorizontalOverflow(page, '[data-shell-boundary-lab]');

    await lab.getByRole('button', { name: 'timeout', exact: true }).click();
    await expect(lab.locator('[data-shell-scenario="timeout"]')).toContainText('kill / wait 증거 없음');
    await expectNoHorizontalOverflow(page, '[data-shell-boundary-lab]');

    await lab.getByRole('button', { name: 'background', exact: true }).click();
    await expect(lab.locator('[data-shell-scenario="background"]')).toContainText('registry · logs · cancel 없음');
    await expectNoHorizontalOverflow(page, '[data-shell-boundary-lab]');
  });
});
