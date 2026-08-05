import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

test('RNN decoding example names its deterministic choice correctly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/rnn`, { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: '생성' }).click();
  await expect(page.locator('body')).toContainText('greedy pick');
  await expect(page.locator('body')).toContainText('temperature는 분포의 뾰족함만 바꾸고 선택 token은 바꾸지 않는다');
  await expect(page.locator('body')).toContainText('실제 sampling은 이 분포를 가중치로 무작위 추출');
  await expect(page.locator('body')).toContainText('이 scalar 예제는 b=0');
});

test('LSTM public fixture remains separate and fused shapes recompute', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/lstm`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('body')).toContainText('0.92³⁰');
  await expect(page.locator('body')).toContainText('8.20%');
  await expect(page.locator('body')).not.toContainText('1.48%');

  await page.locator('#lstm-shape-batch').fill('8');
  await page.locator('#lstm-shape-sequence').fill('12');
  await page.locator('#lstm-shape-input').fill('64');
  await page.locator('#lstm-shape-hidden').fill('128');
  await expect(page.locator('body')).toContainText('x [8, 12, 64]');
  await expect(page.locator('body')).toContainText('Wₓx [8, 12, 512]');
  await expect(page.locator('body')).toContainText('[512, 192]');
  await expect(page.locator('body')).toContainText('[8, 12, 4×128]');

  await page.getByRole('button', { name: '기억 소실' }).click();
  const outputGate = page.locator('[data-bar-value="0.61"]');
  await expect.poll(async () => outputGate.evaluate((bar) => {
    const track = bar.parentElement;
    return track ? bar.getBoundingClientRect().width / track.getBoundingClientRect().width : 0;
  })).toBeGreaterThan(0.58);
  expect(await outputGate.evaluate((bar) => {
    const track = bar.parentElement;
    return track ? bar.getBoundingClientRect().width / track.getBoundingClientRect().width : 0;
  })).toBeLessThan(0.64);

  const paperLink = page.getByRole('link', { name: 'LSTM 기반 논문 글' });
  await expect(paperLink).toHaveAttribute('href', /paper-lstm-1997/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
