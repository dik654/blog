import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';
const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`KV handoff joins block ownership and RDMA evidence at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);

    await page.goto(`${base}/lab/blog/ai/vllm-paged-attention`, { waitUntil: 'networkidle' });
    const registration = page.locator('[data-kv-handoff-registration]');
    await expect(registration).toContainText('BlockPool에서 목적 physical block을 예약');
    await expect(registration).toContainText('transfer completion');
    await expect(registration).toContainText('computed state로 공개');
    await expect(registration.getByRole('link', { name: '분리형 prefill' })).toHaveAttribute('href', '/lab/blog/ai/llm-disaggregated-serving');
    await expect(page.getByRole('link', { name: 'vLLM · Disaggregated Prefilling' })).toBeVisible();

    await page.goto(`${base}/lab/blog/gpu/gpu-hpc-from-scratch`, { waitUntil: 'networkidle' });
    const handoff = page.locator('[data-hpc-kv-handoff-link]');
    await expect(handoff).toContainText('GPU→NIC→fabric→NIC→GPU');
    await expect(handoff).toContainText('TCP fallback');
    await expect(handoff.getByRole('link', { name: '분리형 LLM Serving' })).toHaveAttribute('href', '/lab/blog/ai/llm-disaggregated-serving');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
