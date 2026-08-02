import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  ).toBeLessThanOrEqual(1);
}

test('ODE foundation hands the recurrence intuition to hybrid linear LLMs', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/differential-equations-phase-plane-numerical-integration`, {
    waitUntil: 'networkidle',
  });

  const bridge = page.getByRole('link', { name: /Hybrid·linear LLM에서 이 recurrence/ });
  await expect(bridge).toHaveAttribute('href', '/lab/blog/ai/llm-architecture-hybrid-linear');
  await expect(page.getByText('데이터에서 학습한 압축 기억', { exact: false })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('RLHF links beta and KL back to the probability foundation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/rlhf`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('link', { name: '확률·정보이론 최소 기반' })).toHaveAttribute(
    'href',
    '/lab/blog/ai/probability-information-theory',
  );
  await expect(page.getByText('reward와 reference 이탈 비용의 단위를 맞추는 교환 계수', { exact: false })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('ECOD specifies a versioned fixed-reference scoring contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/ecod`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: '고정 ECDF를 배포하려면 reference를 version으로 만든다' })).toBeVisible();
  await expect(page.getByText('01 · Fit', { exact: true })).toBeVisible();
  await expect(page.getByText('batch-composition invariance', { exact: false })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('vLLM release decisions carry their workload and SLO boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  await expect(page.getByText('p95 TTFT ≤ 800 ms + p95 TPOT ≤ 50 ms를 만족한 goodput', { exact: true })).toBeVisible();
  await expect(page.getByText('교육용 fixture이며 vLLM benchmark가 아니다', { exact: false })).toBeVisible();
  await expect(page.getByText('model·GPU·precision·version', { exact: false })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('최대 24x');
  await expectNoHorizontalOverflow(page);
});

test('tool dispatch is a readable five-scene interactive pipeline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-tool-system`, { waitUntil: 'networkidle' });

  const dispatch = page.locator('[data-step-viz]').filter({ hasText: 'Enforcer.check(call)' });
  await expect(dispatch).toBeVisible();
  await expect(dispatch.getByText('권한 게이트가 실행 가능 여부를 먼저 판정한다', { exact: true })).toBeVisible();

  for (let index = 0; index < 4; index += 1) {
    await dispatch.getByRole('button', { name: '다음 장면' }).click();
  }
  await expect(dispatch.getByText('세션 로그가 원인과 결과를 다음 turn의 증거로 남긴다', { exact: true })).toBeVisible();
  await expect(dispatch.getByText('Deny:', { exact: false })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('fine-tuning memory formula has a concrete lower-bound calculation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/open-model-finetuning-theory`, { waitUntil: 'networkidle' });

  await expect(page.getByText('계산 감각을 위한 가상 예시', { exact: true })).toBeVisible();
  await expect(page.getByText('fixed lower bound는 약 12 GB', { exact: false })).toBeVisible();
  await expect(page.getByText('실제 예약량은 반드시 profiler로 다시 잰다', { exact: false })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
