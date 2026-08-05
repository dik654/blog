import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';
const path = `${base}/lab/blog/ai/claw-mcp`;

test.describe('claw MCP source contract', () => {
  test('separates descriptor, stdio runtime, lifecycle validator, and server direction', async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '같은 프로토콜에서 화살표가 두 번 뒤집힌다' })).toBeVisible();
    await expect(page.locator('[data-mcp-runtime-lab]')).toBeVisible();
    await expect(page.getByText(/McpLifecycleValidator.*실제 subprocess/, { exact: false })).toBeVisible();
    await expect(page.locator('#transport-boundary').getByText('ManagedProxy', { exact: true })).toBeVisible();
    await expect(page.locator('#server-direction').getByText('2025-03-26', { exact: true })).toBeVisible();
  });

  test('interactive failure scenarios preserve exact recovery claims without mobile overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-mcp-runtime-lab]');

    await page.getByRole('button', { name: 'HTTP 설정' }).click();
    await expect(lab.locator('[data-mcp-scenario="remote"]')).toContainText('no HTTP call');

    await page.getByRole('button', { name: '부분 실패' }).click();
    await expect(lab.locator('[data-mcp-scenario="degraded"]')).toContainText('qualified tools 유지');

    await page.getByRole('button', { name: 'tool timeout' }).click();
    await expect(lab.locator('[data-mcp-scenario="timeout"]')).toContainText('즉시 재실행하지 않는다');

    await page.getByRole('button', { name: 'Claw를 서버로' }).click();
    await expect(lab.locator('[data-mcp-scenario="serve"]')).toContainText('initialize · tools/list · tools/call');

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      lab: (() => {
        const el = document.querySelector<HTMLElement>('[data-mcp-runtime-lab]');
        return el ? el.scrollWidth - el.clientWidth : -1;
      })(),
    }));
    expect(overflow.document).toBeLessThanOrEqual(0);
    expect(overflow.lab).toBeLessThanOrEqual(0);
  });
});
