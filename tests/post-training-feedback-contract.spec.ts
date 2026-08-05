import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`post-training feedback contracts remain executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/post-training-rlvr`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '방법보다 먼저 “무엇이 부족한가”를 묻는다' })).toBeVisible();
    await expect(page.locator('[data-signal-decision]')).toBeVisible();
    await expect(page.locator('[data-feedback-contract]')).toBeVisible();
    await expect(page.locator('[data-signal-composition]')).toBeVisible();
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('article table')).toHaveCount(0);

    const contractBeforeDecision = await page.evaluate(() => {
      const contractNode = document.querySelector('[data-feedback-contract]');
      const decisionNode = document.querySelector('[data-signal-decision]');
      return Boolean(contractNode && decisionNode && (contractNode.compareDocumentPosition(decisionNode) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(contractBeforeDecision).toBe(true);

    const decision = page.locator('[data-signal-decision]');
    await expect(decision.getByText('RAG 또는 CPT')).toBeVisible();
    await decision.getByRole('button', { name: '정확한 JSON' }).click();
    await expect(decision.getByText('SFT', { exact: true })).toBeVisible();
    await decision.getByRole('button', { name: '도움되는 말투' }).click();
    await expect(decision.getByText('DPO 또는 RLHF')).toBeVisible();
    await decision.getByRole('button', { name: 'Hidden test 코드' }).click();
    await expect(decision.getByText('RLVR', { exact: true })).toBeVisible();
    await expect(decision.getByText(/sandbox/)).toBeVisible();

    const contract = page.locator('[data-feedback-contract]');
    await contract.getByRole('button', { name: 'CPT', exact: true }).click();
    await expect(contract.getByText('label 없는 domain corpus')).toBeVisible();
    await contract.getByRole('button', { name: 'DPO / RLHF', exact: true }).click();
    await expect(contract.getByText('DPO 학습 중에는 없음 · 고정 pair 사용')).toBeVisible();
    await contract.getByRole('button', { name: 'RLVR', exact: true }).click();
    await expect(contract.getByText('있음 · update마다 새 rollout 생성')).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('post-training foundation category exposes the decision article before the canonical RLHF floor', async ({ page }) => {
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
  await expect(page.getByText('Post-training 전체 지도', { exact: true })).toHaveCount(0);
});
