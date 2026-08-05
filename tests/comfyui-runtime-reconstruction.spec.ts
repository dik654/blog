import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4176';

const articles = [
  { slug: 'comfyui-workflow-map', formulas: 0, visual: 'step' },
  { slug: 'comfyui-core-graph', formulas: 0, visual: 'step' },
  { slug: 'comfyui-loaders-gguf', formulas: 1, visual: 'step' },
  { slug: 'comfyui-ksampler-parameters', formulas: 1, visual: 'step' },
  { slug: 'comfyui-lora-control-conditioning', formulas: 1, visual: 'step' },
  { slug: 'comfyui-edit-models-flux-qwen', formulas: 2, visual: 'edit-contract' },
  { slug: 'comfyui-upscale-postprocess', formulas: 1, visual: 'step' },
  { slug: 'comfyui-custom-nodes-ops', formulas: 0, visual: 'step' },
];

test('ComfyUI category presents one reproducible execution route in dependency order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-open-models-comfyui`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-open-model-comfyui"]');
  const links = path.getByRole('link');
  await expect(links).toHaveCount(8);
  const hrefs = await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  expect(hrefs).toEqual(articles.map(({ slug }) => `/lab/blog/ai/${slug}`));
  await expect(page.getByText('ComfyUI · 타입 그래프에서 재현 가능한 실행까지', { exact: true })).toBeVisible();
  await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('core graph visual traces the target closure before producer-first execution', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/comfyui-core-graph`, { waitUntil: 'networkidle' });

  const visual = page.locator('[data-comfy-runtime-viz]');
  await expect(visual.locator('[data-dependency-closure]')).toContainText('Save Image');
  await expect(visual.locator('.step-viz__progress > button')).toHaveCount(5);
  for (let step = 0; step < 4; step += 1) {
    await visual.getByRole('button', { name: '다음 장면' }).click();
  }
  await expect(visual).toContainText('Loader → Text encode · Latent source → Sampler → Decode → Save Image');
});

for (const article of articles) {
  test(`${article.slug} keeps the learning contract, sources and responsive runtime visual together`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-learning-question]')).toHaveCount(1);
    await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
    await expect(page.locator('[data-comfy-runtime-viz]')).toHaveCount(1);
    if (article.visual === 'step') {
      await expect(page.locator('[data-comfy-runtime-viz] [data-step-viz]')).toHaveCount(1);
    } else {
      await expect(page.locator('[data-comfy-runtime-viz][data-edit-contract-lab]')).toHaveCount(1);
    }
    await expect(page.getByText('오해 방지.', { exact: true })).toBeVisible();
    await expect(page.getByText('여기까지 오면', { exact: true })).toBeVisible();
    await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(article.formulas);
    await expect(page.locator('[data-formula-note]')).toHaveCount(article.formulas);

    const math = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => {
      const node = element as HTMLElement;
      const content = node.firstElementChild?.getBoundingClientRect();
      const frame = node.getBoundingClientRect();
      const note = node.parentElement?.querySelector<HTMLElement>('[data-formula-note]');
      return {
        scale: Number(node.dataset.mathScale ?? '1'),
        overflow: content ? content.width - frame.width : 0,
        koreanNote: /[가-힣]/.test(note?.innerText ?? ''),
      };
    }));
    expect(math.every((item) => item.scale >= 0.68 && item.overflow <= 1 && item.koreanNote)).toBeTruthy();

    const overflow = await page.locator('main').evaluate((main) => {
      const offenders = [main, ...Array.from(main.querySelectorAll<HTMLElement>('*'))]
        .filter((node) => node.scrollWidth - node.clientWidth > 2)
        .filter((node) => {
          const style = getComputedStyle(node);
          return style.overflowX === 'auto' || style.overflowX === 'scroll';
        });
      return offenders.map((node) => ({ tag: node.tagName, className: node.className, delta: node.scrollWidth - node.clientWidth }));
    });
    expect(overflow).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

for (const viewport of [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  for (const article of articles) {
    test(`${article.slug} stays legible at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('[data-comfy-runtime-viz]')).toBeVisible();
      if (article.visual === 'step') {
        await expect(page.locator('[data-comfy-runtime-viz] [data-step-viz]')).toHaveCount(1);
      } else {
        await expect(page.locator('[data-comfy-runtime-viz][data-edit-contract-lab]')).toHaveCount(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      const formulaScales = await page.locator('[data-math-fit]').evaluateAll((nodes) => nodes.map((node) => Number((node as HTMLElement).dataset.mathScale ?? '1')));
      expect(formulaScales.every((scale) => scale >= 0.8)).toBeTruthy();
    });
  }
}
