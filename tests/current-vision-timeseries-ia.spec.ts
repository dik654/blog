import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';

test('time-series parent branches before either research track', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-timeseries`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 2, name: '먼저 운영 결정을 하나 고릅니다' })).toBeVisible();
  await expect(page.locator('[data-topdown-research-route]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /01 · Forecasting/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai?sub=ai-timeseries-forecast',
  );
  await expect(page.getByRole('link', { name: /02 · Anomaly · Incident/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai?sub=ai-timeseries-anomaly',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('forecast and anomaly children expose separate current-first tracks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${base}/lab/blog/ai?sub=ai-timeseries-forecast`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-topdown-research-route="time-series"]')).toBeVisible();
  await expect(page.locator('[data-topdown-research-route="time-series-anomaly"]')).toHaveCount(0);
  await expect(page.locator('[data-learning-path-directory] a').first()).toHaveAttribute(
    'href',
    '/lab/blog/ai/time-series-forecasting-evaluation?path=ai-timeseries-forecasting',
  );

  await page.goto(`${base}/lab/blog/ai?sub=ai-timeseries-anomaly`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-topdown-research-route="time-series-anomaly"]')).toBeVisible();
  await expect(page.locator('[data-topdown-research-route="time-series"]')).toHaveCount(0);
  await expect(page.locator('[data-learning-path-directory] a').first()).toHaveAttribute(
    'href',
    '/lab/blog/ai/time-series-anomaly-detection?path=ai-timeseries-anomaly',
  );
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`current vision encoder decision stays legible and keeps independent task axes on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/vision-representation-encoders-current`, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-encoder-decision-lab]');
    await expect(lab).toBeVisible();
    await lab.getByRole('button', { name: '다국어 의미' }).click();
    await expect(lab.getByRole('status')).toContainText('SigLIP 2 multilingual checkpoint');
    await lab.getByRole('button', { name: '검출 · 추적 · 깊이' }).click();
    await expect(lab.getByRole('status')).toContainText('PE intermediate layer 또는 DINOv3 dense feature');
    expect(await lab.getByRole('button').evaluateAll((buttons) => Math.min(
      ...buttons.map((button) => button.getBoundingClientRect().height),
    ))).toBeGreaterThanOrEqual(44);
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
