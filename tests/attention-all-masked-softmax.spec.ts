import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4177';

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`all-masked attention row exposes the safe softmax guard at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/attention-theory`, { waitUntil: 'networkidle' });

    const explorer = page.locator('[data-attention-score-explorer]');
    await expect(explorer).toBeVisible();
    await explorer.getByRole('button', { name: '전체 row 차단' }).click();

    await expect(explorer).toHaveAttribute('data-mask-mode', 'all');
    await expect(explorer).toHaveAttribute('data-row-valid', 'false');
    await expect(explorer.locator('[data-attention-weight]')).toHaveText([
      'α 0.000',
      'α 0.000',
      'α 0.000',
    ]);
    await expect(explorer.locator('[data-attention-selected-key]')).toHaveText('없음 · invalid row');
    await expect(explorer.locator('[data-attention-output]')).toHaveText('[0.000, 0.000]');
    await expect(explorer.locator('[data-attention-weight-sum]')).toHaveText('0.000');
    await expect(explorer.locator('[data-attention-softmax-status]')).toContainText('safe softmax guard');
    await expect(explorer.locator('[data-attention-softmax-status]')).toContainText('유효한 확률분포가 아니다');
    await expect(explorer.locator('[data-attention-softmax-status]')).toContainText('NaN 전파');

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      explorer: (document.querySelector<HTMLElement>('[data-attention-score-explorer]')?.scrollWidth ?? 0)
        - (document.querySelector<HTMLElement>('[data-attention-score-explorer]')?.clientWidth ?? 0),
    }));
    expect(overflow.document).toBeLessThanOrEqual(1);
    expect(overflow.explorer).toBeLessThanOrEqual(1);

    await explorer.getByRole('button', { name: 'mask 없음' }).click();
    await expect(explorer).toHaveAttribute('data-row-valid', 'true');
    await expect(explorer.locator('[data-attention-weight-sum]')).toHaveText('1.000');
    await expect(explorer.locator('[data-attention-softmax-status]')).toContainText('정상 row');
    expect(errors).toEqual([]);
  });
}
