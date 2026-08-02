import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';
const path = `${base}/lab/blog/ai/claw-overview`;

test.describe('claw overview evidence boundary', () => {
  test('separates production, simulation, manifest, and e2e evidence', async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '먼저 실행 코드와 검증 코드를 떼어 놓는다' })).toBeVisible();
    await expect(page.locator('[data-overview-boundary-lab]')).toBeVisible();
    await expect(page.getByText('route_tool_call()', { exact: true })).toHaveCount(1);
    await expect(page.getByText('query(path)', { exact: true })).toHaveCount(1);
    await expect(page.getByText('token_cost_reporting', { exact: false })).toBeVisible();
  });

  test('interactive layer boundary remains readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-overview-boundary-lab]');
    await page.getByRole('button', { name: 'Python port' }).click();
    await expect(lab.locator('[data-boundary-result="python"]')).toContainText('실제 provider나 Rust dispatch');

    await page.getByRole('button', { name: '표면 추출' }).click();
    await expect(lab.locator('[data-boundary-result="manifest"]')).toContainText('실행 정확성');

    await page.getByRole('button', { name: 'Mock E2E' }).click();
    await expect(lab.locator('[data-boundary-result="e2e"]')).toContainText('목록 밖 행동 전체');

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      lab: (() => {
        const el = document.querySelector<HTMLElement>('[data-overview-boundary-lab]');
        return el ? el.scrollWidth - el.clientWidth : -1;
      })(),
    }));
    expect(overflow.document).toBeLessThanOrEqual(0);
    expect(overflow.lab).toBeLessThanOrEqual(0);
  });
});
