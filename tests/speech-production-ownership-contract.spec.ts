import { expect, test } from '@playwright/test';

const BASE_URL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';

test('media ownership lab separates route, transport, model epoch, and playback evidence', async ({ page }) => {
  await page.goto(`${BASE_URL}/lab/blog/ai/realtime-duplex-voice-systems`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-media-ownership]');
  await expect(lab).toHaveAttribute('data-media-scenario', 'steady');
  await expect(lab).toHaveAttribute('data-transceiver-state', 'connected');
  await expect(lab).toHaveAttribute('data-tool-result', 'accepted');
  await expect(lab.getByText('Global Relay', { exact: true })).toBeVisible();
  await expect(lab.getByText('Transceiver', { exact: true })).toBeVisible();

  await lab.getByRole('button', { name: 'ICE 경로 변경', exact: true }).click();
  await expect(lab).toHaveAttribute('data-media-scenario', 'reroute');
  await expect(lab).toHaveAttribute('data-transceiver-state', 'checking → connected');
  await expect(lab).toHaveAttribute('data-tool-result', 'accepted');

  await lab.getByRole('button', { name: '경로 변경 + 낡은 결과', exact: true }).click();
  await expect(lab).toHaveAttribute('data-media-scenario', 'stale');
  await expect(lab).toHaveAttribute('data-response-epoch', '43');
  await expect(lab).toHaveAttribute('data-tool-result', 'discarded');
  await expect(lab.getByText('epoch 43 · result 42 폐기', { exact: true })).toBeVisible();
});

test('human handoff and finite next-step choices expose explicit ownership transfer', async ({ page }) => {
  await page.goto(`${BASE_URL}/lab/blog/ai/realtime-duplex-voice-systems`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: '사람에게 넘기는 순간도 하나의 상태 전이로 기록한다', exact: true })).toBeVisible();
  await expect(page.getByText(/human owner·accept timestamp/)).toBeVisible();

  const handoff = page.locator('[data-learning-handoff]');
  await expect(handoff.getByRole('link', { name: 'Moshi 원문 복원', exact: true })).toHaveAttribute('href', /paper-moshi-2024/);
  await expect(handoff.getByRole('link', { name: 'On-device Inference', exact: true })).toHaveAttribute('href', /efficient-inference-on-device/);
});

test('media ownership lab and route-change formula stay readable at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/lab/blog/ai/realtime-duplex-voice-systems`, { waitUntil: 'networkidle' });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  const lab = page.locator('[data-media-ownership]');
  const box = await lab.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(391);

  await expect(page.locator('mtext').filter({ hasText: '경로 변경 때만 재연결' }).first()).toBeVisible();
});
