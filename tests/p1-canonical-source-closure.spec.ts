import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
test.setTimeout(60_000);

const routeSources = [
  ['ai-llm-post-training', 'llm-post-training', '/lab/blog/ai/rlhf'],
  ['ai-generative', 'generative-models', '/lab/blog/ai/diffusion-models'],
  ['ai-agents', 'ai-agents', '/lab/blog/ai/paper-react-2022'],
] as const;

test('P1 canonical tracks link to the accepted internal source reconstruction', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [subcategory, trackId, href] of routeSources) {
    await page.goto(`${base}/lab/blog/ai?sub=${subcategory}`, { waitUntil: 'networkidle' });
    const route = page.locator(`[data-topdown-research-route="${trackId}"]`);
    const canonical = route.locator('[data-route-stage="evidence"] article').last();
    await expect(canonical.getByRole('link', { name: /내부 해설 읽기/ })).toHaveAttribute('href', href);
  }
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`DDPM and ReAct source contracts fit at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    await page.goto(`${base}/lab/blog/ai/diffusion-models`, { waitUntil: 'networkidle' });
    await expect(page.getByText('Diffusion Models: 노이즈에서 이미지까지', { exact: true })).toBeVisible();
    await expect(page.locator('[data-ddpm-posterior-lab]')).toBeVisible();
    await expect(page.locator('[data-ddpm-objective-lab]')).toBeVisible();
    await expect(page.locator('[data-ddpm-sampler-lab]')).toBeVisible();
    await expect(page.locator('[data-formula-pair]')).toHaveCount(8);
    await expect(page.locator('[data-formula-note]')).toHaveCount(9);
    await page.getByRole('button', { name: 't=1 · 마지막', exact: true }).click();
    await expect(page.locator('[data-ddpm-sampler-lab]')).toContainText('강제로 0');
    await page.getByRole('tab', { name: 'Variational bound · codelength', exact: true }).click();
    await expect(page.locator('[data-ddpm-objective-lab]')).toContainText('NLL 3.70 bits/dim');
    await expect(page.locator('[data-ddpm-objective-lab]')).toContainText('σₜ²=βₜ');
    await expect(page.locator('[data-ddpm-sampler-lab]')).toContainText('σₜ²=β̃ₜ');
    await assertVisualContracts(page, '[data-ddpm-posterior-lab], [data-ddpm-objective-lab], [data-ddpm-sampler-lab]');

    await page.goto(`${base}/lab/blog/ai/paper-react-2022`, { waitUntil: 'networkidle' });
    await expect(page.getByText('논문 재구성 · ReAct: 생각과 행동을 하나의 Loop로 묶는 법', { exact: true })).toBeVisible();
    await expect(page.locator('[data-react-transition-lab]')).toBeVisible();
    await expect(page.locator('[data-react-wikipedia-trace]')).toBeVisible();
    await expect(page.locator('[data-react-evidence-lab]')).toHaveCount(2);
    await expect(page.locator('[data-react-failure-lab]')).toBeVisible();
    await expect(page.locator('[data-formula-pair]')).toHaveCount(1);
    await expect(page.locator('[data-formula-note]')).toHaveCount(1);
    await page.getByRole('tab', { name: 'Action · search[entity]', exact: true }).click();
    await expect(page.locator('[data-react-transition-lab]')).toContainText('Wikipedia API를 호출함');
    await page.getByRole('tab', { name: 'WebShop', exact: true }).first().click();
    await expect(page.locator('[data-react-evidence-lab]').first()).toContainText('66.6 / 40.0%');
    await expect(page.locator('[data-react-failure-lab]')).toContainText('HotpotQA의 성공·실패 trajectory');
    await expect(page.getByText(/이 오류 분포를 FEVER에도 그대로 일반화할 근거는 논문에 없다/)).toBeVisible();
    await assertVisualContracts(page, '[data-react-transition-lab], [data-react-wikipedia-trace], [data-react-evidence-lab], [data-react-failure-lab]');
  });
}

test('InstructGPT article states the accepted undiscounted critic contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/rlhf`, { waitUntil: 'networkidle' });
  await expect(page.getByText(/value function을 reward model에서 초기화/)).toBeVisible();
  await expect(page.getByText(/InstructGPT는 discount를 쓰지 않아 1로 둔다/)).toBeVisible();
  await expect(page.locator('[data-formula-note]')).toHaveCount(9);
  const audit = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    rawLatex: /\\(?:theta|underbrace|begin\{aligned\}|operatorname)/.test(document.body.innerText),
  }));
  expect(audit.document).toBeLessThanOrEqual(1);
  expect(audit.rawLatex).toBe(false);
});

async function assertVisualContracts(page: import('@playwright/test').Page, labSelector: string) {
  const audit = await page.evaluate((selector) => {
    const math = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
    const labText = Array.from(document.querySelectorAll<HTMLElement>(`${selector} p, ${selector} span, ${selector} strong, ${selector} button, ${selector} label`));
    return {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rawLatex: /\\(?:theta|underbrace|operatorname|begin\{aligned\}|begin\{cases\}|mid)/.test(document.body.innerText),
      clippedMath: math.filter((node) => node.scrollWidth - node.clientWidth > 1).length,
      minMathScale: math.length ? Math.min(...math.map((node) => Number(node.getAttribute('data-math-scale') ?? '1'))) : 1,
      smallestLabText: labText.length ? Math.min(...labText.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))) : 12,
    };
  }, labSelector);
  expect(audit.document).toBeLessThanOrEqual(1);
  expect(audit.rawLatex).toBe(false);
  expect(audit.clippedMath).toBe(0);
  expect(audit.minMathScale).toBeGreaterThanOrEqual(0.8);
  expect(audit.smallestLabText).toBeGreaterThanOrEqual(12);
}
