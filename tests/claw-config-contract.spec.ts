import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';
const path = `${base}/lab/blog/ai/claw-config`;

test.describe('claw config source contract', () => {
  test('teaches five-file precedence and rejects invented layers', async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '최종 값과 읽힌 파일은 보이지만, 모든 key의 출처가 남는 것은 아니다' })).toBeVisible();
    await expect(page.locator('[data-config-contract-lab]')).toBeVisible();
    await expect(page.getByText('/etc/claw/config.json', { exact: true })).toHaveCount(1);
    await expect(page.getByText('CLAW_MODEL', { exact: true })).toHaveCount(1);
    await expect(page.getByText('LoadingConfig', { exact: true })).toHaveCount(0);
    await expect(page.getByText('MainRuntime', { exact: true })).toBeVisible();
  });

  test('interactive scenarios expose merge and failure semantics without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-config-contract-lab]');
    await page.getByRole('button', { name: 'local 없음' }).click();
    await expect(lab.locator('[data-config-result="without-local"]')).toContainText('project-compat');
    await expect(lab.locator('[data-config-result="without-local"]')).toContainText('ReadOnly');

    await page.getByRole('button', { name: 'current 오류' }).click();
    await expect(lab.locator('[data-file-state="error"]')).toContainText('./.claw/settings.json');
    await expect(lab.locator('[data-config-result="invalid-current"]')).toContainText('ConfigError::Parse');

    await page.getByRole('button', { name: 'legacy 오류' }).click();
    await expect(lab.locator('[data-file-state="ignored"]')).toContainText('~/.claw.json');
    await expect(lab.locator('[data-config-result="invalid-legacy"]')).toContainText('A2 · B · C');

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      lab: (() => {
        const el = document.querySelector<HTMLElement>('[data-config-contract-lab]');
        return el ? el.scrollWidth - el.clientWidth : -1;
      })(),
    }));
    expect(overflow.document).toBeLessThanOrEqual(0);
    expect(overflow.lab).toBeLessThanOrEqual(0);
  });
});
