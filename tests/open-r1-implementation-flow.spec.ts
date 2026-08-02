import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`Open-R1 reconstructs one training batch on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/open-r1`, { waitUntil: 'networkidle' });

    await expect(page.getByText('SOURCE SNAPSHOT · 2026-04-02')).toBeVisible();
    await expect(page.getByRole('heading', { name: '한 문제 행이 policy update가 되기까지' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GRPO는 한 답을 채점하지 않고 같은 문제의 답들을 비교한다' })).toBeVisible();
    await expect(page.locator('[data-open-r1-lifecycle]')).toBeVisible();
    await expect(page.locator('[data-sft-token-contract]')).toBeVisible();
    await expect(page.locator('[data-grpo-ledger]')).toBeVisible();
    await expect(page.locator('[data-reward-contract]')).toBeVisible();
    await expect(page.locator('[data-open-r1-data-loop]')).toBeVisible();
    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('[data-formula-note]')).toHaveCount(6);
    await expect(page.getByText('구현 함정:', { exact: true })).toBeVisible();
    await expect(page.getByText(/fullmatch.*adversarial fixture/)).toBeVisible();

    const ledger = page.locator('[data-grpo-ledger]');
    await expect(ledger.getByText('+1.0')).toHaveCount(2);
    await expect(ledger.getByText('-1.0')).toHaveCount(2);
    await expect(ledger.getByText('262,144 tokens')).toBeVisible();

    await ledger.getByRole('button', { name: '전부 정답' }).click();
    await expect(ledger.getByText('A = 0.0')).toHaveCount(4);
    await expect(ledger.getByText('서로의 차이는 만들지 못한다')).toBeVisible();

    await ledger.getByRole('button', { name: '전부 오답' }).click();
    await expect(ledger.getByText('탐색·curriculum 문제가 된다')).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('LLM navigation starts at the current reasoning problem and then descends', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-post-training-implementation`, { waitUntil: 'networkidle' });

  const labels = [
    '00 · 현재 병목',
    '01 · Feedback 계약',
    '02 · 구현 · 검산',
  ];
  const positions = await Promise.all(labels.map(async (label) => {
    const item = page.getByText(label, { exact: true }).first();
    await expect(item).toBeVisible();
    return item.evaluate((element) => element.getBoundingClientRect().top);
  }));
  expect(positions).toEqual([...positions].sort((a, b) => a - b));

  const pathLabels = await page
    .getByLabel('LLM Post-training · 현재 병목에서 구현까지 학습 경로')
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('data-learning-step-label')));
  expect(pathLabels).toEqual([
    '1. 현재 프런티어',
    '2. 피드백 계약',
    '3. RLHF 실행 기준점',
    '4. Policy optimization',
    '5. Open-R1 구현',
  ]);
  await expect(page.getByText('Open-R1 구현: 한 문제에서 GRPO 업데이트까지').first()).toBeVisible();
});
