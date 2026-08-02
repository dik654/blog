import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';
const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`multilingual data and failed-run recovery remain executable at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);

    await page.goto(`${base}/lab/blog/ai/llm-data-engine`, { waitUntil: 'networkidle' });
    const dedup = page.locator('[data-dedup-unit-contract]');
    await expect(dedup).toContainText('n-gram의 단위도 recipe다');
    await expect(dedup).toContainText('character 또는 byte n-gram');
    await expect(dedup).toContainText('Jaccard 0.8은 같은 판정이 아니다');
    await expect(page.getByRole('link', { name: 'LREC · C4Corpus' })).toBeVisible();

    await page.goto(`${base}/lab/blog/ai/tokenizer`, { waitUntil: 'networkidle' });
    const expansion = page.locator('[data-tokenizer-expansion-contract]');
    await expect(expansion).toContainText('기존 ID와 merge를 보존');
    await expect(expansion).toContainText('새 model version');
    await expect(expansion).toContainText('BPE-dropout');
    await expect(expansion.locator('[data-formula-note]')).toHaveCount(1);
    await expect(page.locator('.katex-error')).toHaveCount(0);

    await page.goto(`${base}/lab/blog/ai/llm-pretraining-run`, { waitUntil: 'networkidle' });
    const recovery = page.locator('[data-run-recovery-contract]');
    await expect(recovery).toContainText('마지막으로 검증된 상태');
    await expect(recovery).toContainText('해당 shard를 격리');
    await expect(recovery).toContainText('Optimizer state reset은 자동 복구가 아니라 새 학습 궤적');
    await expect(recovery).toContainText('새 run branch');
    await expect(page.getByRole('link', { name: 'NVIDIA NeMo · Resiliency Features' })).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
