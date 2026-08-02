import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4176';

test('agent safety branch exposes source-to-sink containment before eval', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-safety`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-agent-system-core"]');
  await expect(path).toBeVisible();
  const hrefs = await path.getByRole('link').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  expect(hrefs).toEqual([
    '/lab/blog/ai/prompt-injection-defense',
    '/lab/blog/ai/agent-evaluation-trace',
  ]);
  await expect(path.getByRole('heading', { name: 'Prompt Injection 방어: source에서 forbidden commit까지' })).toBeVisible();
});

test('prompt injection article teaches deterministic containment with numeric oracle', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/prompt-injection-defense`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-learning-question]')).toHaveCount(1);
  await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
  await expect(page.locator('[data-agent-security-viz]')).toHaveCount(3);
  await expect(page.locator('[data-math-fit]')).toHaveCount(1);
  await expect(page.locator('[data-formula-note]')).toHaveCount(1);
  await expect(page.getByText('Fan-in · 세 source의 lineage를 섞지 않는다', { exact: true })).toBeVisible();
  await expect(page.getByText('Fan-out · sink마다 별도 gate를 적용한다', { exact: true })).toBeVisible();
  await expect(page.getByText('5 proposal = 2 allow + 3 deny', { exact: false })).toBeVisible();
  await expect(page.getByText('0 external writes', { exact: true })).toBeVisible();
  await expect(page.getByText('commit 직전에 destination과 resource를 다시 resolve', { exact: false })).toBeVisible();
  await expect(page.getByText('두 행동을 합치면 confidential data가 외부로 흐른다', { exact: false })).toBeVisible();
  await expect(page.getByText('여기까지 오면', { exact: true })).toBeVisible();
  await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'MCP' }).first()).toHaveAttribute('href', '/lab/blog/ai/mcp-protocol');
  await expect(page.getByRole('link', { name: 'Agent Evaluation & Trace' }).first()).toHaveAttribute('href', '/lab/blog/ai/agent-evaluation-trace');

  const math = await page.locator('[data-math-fit]').evaluate((element) => {
    const node = element as HTMLElement;
    const frame = node.getBoundingClientRect();
    const content = node.firstElementChild?.getBoundingClientRect();
    return {
      scale: Number(node.dataset.mathScale ?? '1'),
      overflow: content ? content.width - frame.width : 0,
      korean: /[가-힣]/.test(node.innerText),
    };
  });
  expect(math.scale).toBeGreaterThanOrEqual(0.68);
  expect(math.overflow).toBeLessThanOrEqual(1);
  expect(math.korean).toBeTruthy();

  const vizOverflow = await page.locator('[data-agent-security-viz]').evaluateAll((nodes) => nodes.map((node) => node.scrollWidth - node.clientWidth));
  expect(vizOverflow.every((value) => value <= 1)).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`prompt injection containment preserves reading order at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}/lab/blog/ai/prompt-injection-defense`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-agent-security-viz]')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}
