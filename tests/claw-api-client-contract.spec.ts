import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';
const path = `${base}/lab/blog/ai/claw-api-client`;

test.describe('claw api client source contract', () => {
  test('teaches enum routing and rejects invented provider contracts', async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '같은 질문을 보내도 서비스마다 길이 다르다' })).toBeVisible();
    await expect(page.locator('[data-provider-contract-lab]')).toBeVisible();
    await expect(page.getByText(/Azure variant도 없다/)).toBeVisible();
    await expect(page.getByText('ProviderClient::OpenAi', { exact: true })).toBeVisible();
    await expect(page.locator('#stream-contract').getByText('MessageStop', { exact: true }).first()).toBeVisible();
    await expect(page.locator('#prompt-cache').getByText('30초 completion TTL', { exact: true })).toBeVisible();
  });

  test('model scenarios expose concrete endpoint rules without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-provider-contract-lab]');

    await page.getByRole('button', { name: 'qwen-plus' }).click();
    await expect(lab.locator('[data-route-result="qwen-plus"]')).toContainText('DASHSCOPE_API_KEY');
    await expect(lab.locator('[data-route-result="qwen-plus"]')).toContainText('6 MiB');

    await page.getByRole('button', { name: 'kimi' }).click();
    await expect(lab.locator('[data-route-result="kimi"]')).toContainText('is_error 생략');

    await page.getByRole('button', { name: 'openai/gpt-5' }).click();
    await expect(lab.locator('[data-route-result="openai/gpt-5"]')).toContainText('max_completion_tokens');

    await page.getByRole('button', { name: 'custom-model' }).click();
    await expect(lab.locator('[data-route-result="custom-model"]')).toContainText('OPENAI_BASE_URL + OPENAI_API_KEY');
    await lab.getByLabel('unknown model environment').selectOption('openai-base-only');
    await expect(lab.locator('[data-env-profile="openai-base-only"]')).toContainText('request 전 실패');
    await expect(lab.locator('[data-env-profile="openai-base-only"]')).toContainText('kind는 OpenAi');

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      lab: (() => {
        const el = document.querySelector<HTMLElement>('[data-provider-contract-lab]');
        return el ? el.scrollWidth - el.clientWidth : -1;
      })(),
    }));
    expect(overflow.document).toBeLessThanOrEqual(0);
    expect(overflow.lab).toBeLessThanOrEqual(0);
  });
});
