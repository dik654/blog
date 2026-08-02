import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';

for (const viewport of [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`compaction keeps its source contract readable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/claw-compaction`, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-compaction-contract-lab]');
    await expect(lab).toBeVisible();
    await expect(page.getByRole('heading', { name: /SummaryCompressor/ })).toHaveCount(0);
    await expect(page.getByText('UTF-8 byte 길이', { exact: false })).toBeVisible();

    await lab.getByRole('button', { name: /도구 경계/ }).click();
    await lab.getByLabel('preserve recent messages').selectOption('3');
    await expect(lab).toContainText('raw 4 → safe 3');
    await expect(lab).toContainText('tool pair 보존');
    await expect(lab.locator('[data-compaction-result]')).toHaveAttribute('data-compaction-result', 'compacted');
    await expect(lab.locator('[data-runtime-state]')).toHaveAttribute('data-runtime-state', 'not-installed');

    await lab.getByRole('button', { name: '자동 설치' }).click();
    await expect(lab.locator('[data-runtime-state]')).toHaveAttribute('data-runtime-state', 'installed');

    await lab.getByRole('button', { name: /일반 대화/ }).click();
    await lab.getByRole('button', { name: '수동 결과' }).click();
    await lab.getByLabel('manual token threshold').selectOption('14000');
    await expect(lab.locator('[data-compaction-result]')).toHaveAttribute('data-compaction-result', 'unchanged');
    await expect(lab).toContainText('원본 Session clone');

    const overflow = await page.evaluate(() => {
      const element = document.querySelector('[data-compaction-contract-lab]');
      return {
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        lab: element ? element.scrollWidth - element.clientWidth : null,
      };
    });
    expect(overflow.document).toBeLessThanOrEqual(1);
    expect(overflow.lab).toBeLessThanOrEqual(1);
  });
}
