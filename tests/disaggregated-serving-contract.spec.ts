import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`disaggregated serving keeps the SLO, KV and release trace executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/llm-disaggregated-serving`, { waitUntil: 'networkidle' });
    await expect(page.getByText('GQA · Grouped-Query Attention', { exact: true })).toBeVisible();
    await expect(page.getByText('MLA · Multi-head Latent Attention', { exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { name: '왜 평균 tokens/s로는 사용자를 설명할 수 없을까?' })).toBeVisible();
    await expect(page.locator('[data-serving-pressure-lab]')).toBeVisible();
    await expect(page.locator('[data-disaggregated-flow]')).toBeVisible();
    await expect(page.locator('[data-serving-release-gate]')).toBeVisible();
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('[data-math-fit]')).toHaveCount(4);
    await expect(page.locator('article table')).toHaveCount(0);

    const pressure = page.locator('[data-serving-pressure-lab]');
    await expect(pressure.getByText('128 KiB', { exact: true })).toBeVisible();
    await expect(pressure.getByText('1.00 GiB', { exact: true })).toBeVisible();
    await expect(pressure.getByText('107 ms', { exact: true })).toBeVisible();
    await expect(pressure.getByText('25.5 GiB', { exact: true })).toBeVisible();
    await pressure.getByRole('button', { name: '32K', exact: true }).click();
    await expect(pressure.getByText('4.00 GiB', { exact: true })).toBeVisible();
    await expect(pressure.getByText('429 ms', { exact: true })).toBeVisible();
    await pressure.getByRole('button', { name: '400G', exact: true }).click();
    await expect(pressure.getByText('107 ms', { exact: true })).toBeVisible();

    const flow = page.locator('[data-disaggregated-flow]');
    await expect(flow).toHaveAttribute('data-flow-mode', 'disaggregated');
    await flow.getByRole('button', { name: 'KV handoff', exact: false }).click();
    await expect(flow.getByText('TCP fallback·topology mismatch가 TTFT를 지배', { exact: true })).toBeVisible();
    await flow.getByRole('button', { name: '한 pool', exact: true }).click();
    await expect(flow).toHaveAttribute('data-flow-mode', 'aggregated');
    await expect(flow.getByRole('button', { name: 'Shared worker', exact: false })).toBeVisible();

    const gate = page.locator('[data-serving-release-gate]');
    await gate.getByRole('button', { name: 'Failure · SLO gate', exact: false }).click();
    await expect(gate.getByText('fail-closed release evidence', { exact: false })).toBeVisible();

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
      rawLatex: /\\\\(?:underbrace|operatorname|approx)/.test((element as HTMLElement).innerText ?? ''),
    })));
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.rawLatex).toBe(false);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('Serving sidebar and category expose current runtime before the control plane', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-topdown-research-route="llm-disaggregated-serving"]')).toBeVisible();
  await expect(page.getByText('NVIDIA Dynamo · Disaggregated Serving', { exact: true })).toBeVisible();
  await expect(page.getByText('Mooncake: A KVCache-centric Disaggregated Architecture', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /00 · Request Runtime/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /01 · 운영 제어면/ }).first()).toBeVisible();

  const runtime = page.locator('[data-authored-learning-path="ai-llm-serving-engine"]');
  await expect(runtime.getByRole('link')).toHaveCount(6);
  await expect(runtime.getByRole('link').first()).toHaveAttribute('href', '/lab/blog/ai/llm-disaggregated-serving');

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving-runtime`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: '00 · Request Runtime' })).toBeVisible();
  await expect(page.locator('[data-authored-learning-path="ai-llm-serving-engine"]')).toBeVisible();
  await expect(page.locator('[data-authored-learning-path="ai-llm-serving-control-plane"]')).toHaveCount(0);

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving-operations`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: '01 · 운영 제어면' })).toBeVisible();
  await expect(page.locator('[data-authored-learning-path="ai-llm-serving-control-plane"]')).toBeVisible();
  await expect(page.locator('[data-authored-learning-path="ai-llm-serving-engine"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
