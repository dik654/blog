import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';

async function expectNoOverflow(page: import('@playwright/test').Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  const offenders = await page.locator('main').evaluate((main) => [main, ...Array.from(main.querySelectorAll<HTMLElement>('*'))]
    .filter((node) => node.scrollWidth - node.clientWidth > 2)
    .filter((node) => {
      const style = getComputedStyle(node);
      return style.overflowX === 'auto' || style.overflowX === 'scroll';
    })
    .map((node) => ({ tag: node.tagName, delta: node.scrollWidth - node.clientWidth, className: node.className })));
  expect(offenders).toEqual([]);
}

test('vLLM entry article separates current docs, historical results and pinned excerpts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-learning-question]')).toHaveCount(1);
  await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
  await expect(page.locator('[data-serving-control-lab]')).toHaveCount(1);
  await expect(page.getByText('여기까지 오면', { exact: true })).toBeVisible();
  await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();
  await expect(page.locator('body')).toContainText('v0.26.0');
  await expect(page.locator('body')).toContainText('RECOMPUTE');
  await expect(page.locator('body')).toContainText('서로 다른 commit에 고정');
  await expect(page.locator('body')).not.toContainText('자동 스왑');
  await expect(page.locator('body')).not.toContainText('최대 24x');
  await expect(page.locator('body')).not.toContainText('V0 대비 약 1.7x');

  const vllmSourceLinks = await page.locator('a[href*="github.com/vllm-project/vllm/blob/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
  expect(vllmSourceLinks.length).toBeGreaterThan(0);
  expect(vllmSourceLinks.every((href) => /\/blob\/[0-9a-f]{40}\//.test(href))).toBeTruthy();
  expect(vllmSourceLinks.every((href) => !href.includes('/blob/main/'))).toBeTruthy();

  for (const name of ['vLLM PagedAttention', 'vLLM Scheduler', 'vLLM Speculative Decoding', 'vLLM VLM Serving']) {
    await expect(page.getByRole('link', { name, exact: true }).first()).toBeVisible();
  }
  await expectNoOverflow(page);
});

test('serving control lab changes the metric, scheduler plan and release decision', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-serving-control-lab]');
  await expect(lab.getByRole('button', { name: /혼재/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-serving-latency]')).toHaveText('590 / 46 ms');
  await expect(lab.locator('[data-serving-throughput]')).toHaveText('1000 token/s');
  await expect(lab.locator('[data-serving-release]')).toHaveAttribute('data-release-state', 'pass');
  await expect(lab).toContainText('진행 중 decode 320 token 우선 → 남은 budget을 신규 prompt와 반복 batch의 prefill 896 token에 분배');

  await lab.getByRole('switch', { name: /Chunked prefill/ }).click();
  await expect(lab.locator('[data-serving-latency]')).toHaveText('1160 / 65 ms');
  await expect(lab.locator('[data-serving-release]')).toHaveAttribute('data-release-state', 'hold');
  await expect(lab).toContainText('진행 중 decode와 prefill 3,072 token이 한 step budget을 두고 경합');

  await lab.getByRole('button', { name: /배치 단독/ }).click();
  await expect(lab).toContainText('total token throughput ≥ 950 token/s');
  await expect(lab.locator('[data-serving-throughput]')).toHaveText('1285 token/s');
  await expect(lab.locator('[data-serving-release]')).toHaveAttribute('data-release-state', 'pass');

  await lab.getByRole('button', { name: /KV 압박/ }).click();
  await expect(lab.locator('[data-serving-headroom]')).toHaveText('8 block');
  await expect(lab.locator('[data-serving-release]')).toHaveAttribute('data-release-state', 'hold');
  await expect(lab).toContainText('free pool 고갈 시 recompute preemption');
  await expectNoOverflow(page);
});

test('request lifecycle reveals process ownership rather than a tiny decorative SVG', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  const lifecycle = page.locator('[data-request-lifecycle]');
  await expect(lifecycle.locator('svg:not(.lucide)')).toHaveCount(0);
  await expect(lifecycle.locator('[data-lifecycle-current-owner]')).toHaveText('API process');
  await lifecycle.getByRole('button', { name: 'step 3' }).click();
  await expect(lifecycle.locator('[data-lifecycle-current-owner]')).toHaveText('EngineCore');
  await lifecycle.getByRole('button', { name: 'step 4' }).click();
  await expect(lifecycle.locator('[data-lifecycle-current-owner]')).toHaveText('GPU worker');
  await expectNoOverflow(page);
});

test('sticky navigation leaves the serving lab visible after direct scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });

  const lab = page.locator('[data-serving-control-lab]');
  await lab.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  const geometry = await page.evaluate(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const target = document.querySelector('[data-serving-control-lab]')?.getBoundingClientRect();
    return {
      headerBottom: header?.bottom ?? 0,
      targetTop: target?.top ?? -1,
    };
  });

  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.headerBottom);
  await expect(lab.getByRole('button', { name: /혼재/ })).toBeVisible();
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`vLLM controls and diagrams remain readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-serving-control-lab]');
    const controls = await lab.locator('button').evaluateAll((buttons) => buttons.map((button) => {
      const rect = button.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    expect(controls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();
    await expect(page.locator('#vllm-serving-field-guide')).toBeVisible();
    await expectNoOverflow(page);
  });
}
