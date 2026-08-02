import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = ['lora-finetuning', 'multi-agent-implementation'];

for (const target of [
  {
    slug: 'lora-finetuning',
    path: '모델 적응 · Behavior Contract에서 Adapter Release까지',
    steps: 1,
  },
  {
    slug: 'multi-agent-implementation',
    path: 'Agent Systems · 현재 좌표에서 실행 검증까지',
    steps: 9,
  },
]) {
  test(`${target.slug} exposes its independent learning path`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(target.steps);
    await expect(rail.locator('a[aria-current="step"]')).toHaveCount(1);
  });
}

for (const width of [390, 768, 1440]) {
  test(`adaptation and agent runtime articles remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });

    for (const slug of slugs) {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('main h1')).toBeVisible();

      expect(await page.evaluate(() => (
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      ))).toBeLessThanOrEqual(1);

      const formulaScales = await page.locator('[data-math-fit]').evaluateAll((items) => (
        items.map((item) => Number((item as HTMLElement).dataset.mathScale ?? '1'))
      ));
      expect(formulaScales.length).toBeGreaterThan(0);
      expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.8);

      await expect(page.locator('[data-formula-pair]')).toHaveCount(await page.locator('[data-formula-note]').count());
      expect(await page.locator('article svg text').count()).toBe(0);
      expect(await page.locator('article').evaluate((article) => {
        const rawLatex = /\\(?:theta|phi|frac|sum|mathcal|begin|operatorname|underbrace|Delta)\b/;
        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const parent = node.parentElement;
          if (parent && !parent.closest('.katex, pre, code, svg') && rawLatex.test(node.textContent ?? '')) return true;
          node = walker.nextNode();
        }
        return false;
      })).toBe(false);
      expect(errors).toEqual([]);
    }
  });
}

test('LoRA labs preserve scale, precision, mask, and release distinctions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/lora-finetuning`, { waitUntil: 'networkidle' });

  const gate = page.locator('[data-lab="adaptation-gate"]');
  await expect(gate.getByText('Supervised adapter 후보', { exact: true })).toBeVisible();
  await gate.getByRole('button', { name: '최신 사실', exact: true }).click();
  await expect(gate.getByText('Retrieval·tool baseline을 먼저 고친다', { exact: true })).toBeVisible();

  const geometry = page.locator('[data-lab="lora-geometry"]');
  await expect(geometry.getByText('131,072', { exact: true })).toBeVisible();
  await expect(geometry.getByText('2.00', { exact: true }).first()).toBeVisible();
  await geometry.getByRole('slider', { name: 'LoRA rank' }).fill('4');
  await expect(geometry.getByText('524,288', { exact: true })).toBeVisible();
  await expect(geometry.getByText('0.50', { exact: true }).first()).toBeVisible();

  const precision = page.locator('[data-lab="qlora-precision"]');
  await precision.getByRole('button', { name: '기울기', exact: true }).click();
  await expect(precision.getByText('Frozen과 no-gradient는 같은 말이 아니다', { exact: true })).toBeVisible();

  const mask = page.locator('[data-lab="sft-loss-mask"]');
  await expect(mask.getByText('-100 mask', { exact: true })).toHaveCount(2);
  await mask.getByRole('button', { name: '전체 sequence', exact: true }).click();
  await expect(mask.getByText('-100 mask', { exact: true })).toHaveCount(0);

  const release = page.locator('[data-lab="adapter-release"]');
  await expect(release.getByText('먼저 호환되는 높은 정밀도 base를 확인한다', { exact: true })).toBeVisible();
  await release.getByRole('button', { name: 'FP16/BF16', exact: true }).click();
  await expect(release.getByText('Adapter serving 후보', { exact: true })).toBeVisible();
});

test('agent runtime labs make decomposition and safety semantics observable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/multi-agent-implementation`, { waitUntil: 'networkidle' });

  const split = page.locator('[data-lab="agent-split-gate"]');
  await expect(split.getByText('Single-agent·deterministic baseline 유지', { exact: true })).toBeVisible();
  await split.getByRole('button', { name: '독립 병렬', exact: true }).click();
  await split.getByRole('button', { name: '분리 가능', exact: true }).click();
  await split.getByRole('button', { name: '이득 확인', exact: true }).click();
  await expect(split.getByText('Bounded multi-agent 후보', { exact: true })).toBeVisible();

  const reducer = page.locator('[data-lab="reducer-trace"]');
  await expect(reducer.getByText('나중 update가 앞의 evidence를 대체했다', { exact: true })).toBeVisible();
  await reducer.getByRole('button', { name: '명시적 append', exact: true }).click();
  await expect(reducer.getByText('두 update를 reducer가 누적했다', { exact: true })).toBeVisible();

  const safety = page.locator('[data-lab="execution-safety"]');
  await expect(safety.getByText('중복 side effect 위험', { exact: true })).toBeVisible();
  await safety.getByRole('button', { name: 'Run+action 고정', exact: true }).click();
  await expect(safety.getByText('재실행 가능한 action boundary', { exact: true })).toBeVisible();

  const trace = page.locator('[data-lab="agent-trace-eval"]');
  await expect(trace.getByText('누락·충돌·stale read', { exact: true })).toBeVisible();
  await trace.getByRole('button', { name: 'Tool', exact: true }).click();
  await expect(trace.getByText('Timeout·retry·side-effect 중복', { exact: true })).toBeVisible();
});
