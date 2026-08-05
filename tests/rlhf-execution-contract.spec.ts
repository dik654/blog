import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`RLHF ranking and PPO contracts remain executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rlhf`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '한 prompt가 세 종류의 학습 데이터로 갈라진다' })).toBeVisible();
    await expect(page.locator('[data-rlhf-data-contract]')).toBeVisible();
    await expect(page.locator('[data-ranking-batch]')).toBeVisible();
    await expect(page.locator('[data-ppo-update-lab]')).toBeVisible();
    await expect(page.locator('[data-two-distance]')).toBeVisible();
    await expect(page.locator('[data-preference-scope]')).toBeVisible();
    await expect(page.locator('[data-formula-note]')).toHaveCount(9);
    await expect(page.getByText('Policy gradient', { exact: true })).toBeVisible();
    await expect(page.getByText('Critic', { exact: true })).toBeVisible();
    await expect(page.getByText('Importance ratio', { exact: true })).toBeVisible();
    await expect(page.locator('article table')).toHaveCount(0);

    const ranking = page.locator('[data-ranking-batch]');
    await expect(ranking.locator('[data-pair-count]')).toHaveText('6');
    const baseLoss = await ranking.locator('[data-rm-loss]').textContent();
    await ranking.getByRole('button', { name: '모두 +100' }).click();
    await expect(ranking.locator('[data-rm-loss]')).toHaveText(baseLoss ?? '');
    await expect(ranking.getByText('101.2', { exact: true })).toBeVisible();
    await ranking.getByRole('button', { name: 'K = 5' }).click();
    await expect(ranking.locator('[data-pair-count]')).toHaveText('10');
    await expect(ranking.getByText('A > E', { exact: true })).toBeVisible();

    const ppo = page.locator('[data-ppo-update-lab]');
    await expect(ppo.locator('[data-ppo-objective]')).toHaveText('2.40');
    await expect(ppo.getByText('CLIPPED', { exact: true })).toBeVisible();
    await ppo.getByRole('button', { name: '나쁜 token을 너무 내림' }).click();
    await expect(ppo.locator('[data-ppo-objective]')).toHaveText('-1.60');
    await expect(ppo.getByText('CLIPPED', { exact: true })).toBeVisible();
    await ppo.getByRole('button', { name: '허용 범위 안의 이동' }).click();
    await expect(ppo.locator('[data-ppo-objective]')).toHaveText('1.65');
    await expect(ppo.getByText('IN RANGE', { exact: true })).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('post-training foundation keeps signal selection before the RLHF execution floor', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-post-training-foundation`, { waitUntil: 'networkidle' });

  const decision = page.getByText('Post-training 신호 선택: RAG·CPT에서 SFT·DPO·RLVR까지').first();
  const canonical = page.getByText('InstructGPT와 RLHF 실행 계약: 비교 한 줄에서 PPO update까지').first();
  await expect(decision).toBeVisible();
  await expect(canonical).toBeVisible();
  const decisionComesFirst = await decision.evaluate((element, otherText) => {
    const other = [...document.querySelectorAll('*')].find((candidate) => candidate.textContent?.trim() === otherText);
    return Boolean(other && (element.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING));
  }, 'InstructGPT와 RLHF 실행 계약: 비교 한 줄에서 PPO update까지');
  expect(decisionComesFirst).toBe(true);
});
