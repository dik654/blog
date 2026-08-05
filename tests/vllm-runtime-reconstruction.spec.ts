import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4176';

const articles = [
  { slug: 'vllm-paged-attention', formulas: 1, oracle: '6,144 block' },
  { slug: 'vllm-scheduler', formulas: 1, oracle: '896-token prefill chunk' },
  { slug: 'vllm-spec-decode', formulas: 2, oracle: '3.0508' },
  { slug: 'vllm-vlm-serving', formulas: 1, oracle: '4.5 MiB' },
];

test('request-runtime prose preserves every forward handoff and field-guide anchor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/llm-disaggregated-serving`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: 'Speculative Decoding', exact: true })).toHaveAttribute('href', '/lab/blog/ai/vllm-spec-decode');
  await expect(page.getByRole('link', { name: 'VLM Serving', exact: true })).toHaveAttribute('href', '/lab/blog/ai/vllm-vlm-serving');

  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: 'vLLM PagedAttention', exact: true })).toHaveAttribute('href', '/lab/blog/ai/vllm-paged-attention');

  for (const [slug, anchor] of [
    ['vllm-serving', 'vllm-serving-field-guide'],
    ['vllm-paged-attention', 'paged-attention-field-guide'],
    ['vllm-scheduler', 'scheduler-field-guide'],
    ['vllm-spec-decode', 'spec-decode-field-guide'],
    ['vllm-vlm-serving', 'vlm-serving-field-guide'],
  ] as const) {
    await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
    await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  }
});

test('vLLM serving keeps paper claims scoped and every referenced source tree file reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  await expect(page.locator('body')).toContainText('GPT-2 3×');
  await expect(page.locator('body')).toContainText('LLaMA2-Chat 70B에서 latency 2.7×–3.5×');
  await expect(page.locator('body')).not.toContainText('2.13x-3.06x');
  await expect(page.locator('body')).not.toContainText('20x less memory');

  await page.getByRole('button', { name: 'KVCacheManager' }).click();
  await page.getByRole('button', { name: /파일 열기/ }).click();
  await expect(page.getByRole('button', { name: 'block_pool.py' })).toBeEnabled();
  await page.getByRole('button', { name: 'v1/spec_decode' }).click();
  await expect(page.getByRole('button', { name: 'eagle.py' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'draft_model.py' })).toBeEnabled();
});

test('request runtime path hands one request through four explicit state contracts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving-runtime`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-llm-serving-engine"]');
  await expect(path).toBeVisible();
  const hrefs = await path.getByRole('link').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  expect(hrefs.slice(-4)).toEqual(articles.map(({ slug }) => `/lab/blog/ai/${slug}`));
  await expect(path.getByRole('heading', { name: 'vLLM PagedAttention: token에서 물리 KV block까지' })).toBeVisible();
  await expect(path.getByRole('heading', { name: 'vLLM Scheduler: 한 GPU step의 token·KV 장부' })).toBeVisible();
  await expect(path.getByRole('heading', { name: 'vLLM Speculative Decoding: 제안에서 검증된 commit까지' })).toBeVisible();
  await expect(path.getByRole('heading', { name: 'vLLM VLM Serving: media 입구에서 decoder state까지' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('scheduler CodeSidebar annotations stay aligned with the vendored vLLM source', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-scheduler`, { waitUntil: 'networkidle' });
  await expect(page.getByText('Output placeholder', { exact: true })).toBeVisible();
  await expect(page.locator('body')).toContainText('num_tokens_with_spec + num_output_placeholders - num_computed_tokens');

  await page.getByRole('button', { name: /_preempt_request\(\)/ }).click();
  await expect(page.getByText('L929-949', { exact: false })).toBeVisible();
  await expect(page.getByText('L929–937', { exact: true })).toBeVisible();
  await expect(page.getByText('L938–944', { exact: true })).toBeVisible();
  await expect(page.getByText('L948–949', { exact: true })).toBeVisible();

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /update_from_output\(\)/ }).click();
  await expect(page.getByText('L1275-1420', { exact: false })).toBeVisible();
  await expect(page.getByText('L1312–1336', { exact: true })).toBeVisible();
  await expect(page.getByText('L1338–1362', { exact: true })).toBeVisible();
  await expect(page.getByText('L1371–1391', { exact: true })).toBeVisible();
  await expect(page.getByText('L1406–1416', { exact: true })).toBeVisible();
});

test('PagedAttention and speculative decoding expose the corrected source contracts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-paged-attention`, { waitUntil: 'networkidle' });
  await expect(page.getByText('free_block_queue.popleft_n(num_blocks)', { exact: true })).toBeVisible();
  await expect(page.locator('body')).toContainText('ASCII 다이어그램(L250-282)');
  await page.getByRole('button', { name: 'allocate_slots()' }).click();
  await expect(page.getByText('L218-388', { exact: false })).toBeVisible();
  await expect(page.getByText('L250–282', { exact: true })).toBeVisible();
  await expect(page.getByText('L288–295', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.goto(`${base}/lab/blog/ai/vllm-spec-decode`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-spec-draft-pipeline]')).toBeVisible();
  await expect(page.getByText('MTP(Multi-Token Prediction)', { exact: false })).toBeVisible();
  await expect(page.getByText('n-gram proposer', { exact: false })).toBeVisible();
  await expect(page.getByText('spec_token_ids', { exact: true })).toBeVisible();
  await expect(page.locator('[data-step-viz]')).toHaveCount(1);
  await page.getByRole('button', { name: 'EAGLE slots' }).click();
  await expect(page.getByText('L60-118', { exact: false })).toBeVisible();
  await expect(page.getByText('L81–96', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

for (const article of articles) {
  test(`${article.slug} contains one learning contract, responsive Viz and numeric oracle`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-learning-question]')).toHaveCount(1);
    await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
    await expect(page.locator('[data-vllm-runtime-viz]')).toHaveCount(1);
    await expect(page.getByText('오해 방지.', { exact: true })).toBeVisible();
    await expect(page.getByText('여기까지 오면', { exact: true })).toBeVisible();
    await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();
    await expect(page.getByText(article.oracle, { exact: false }).first()).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(article.formulas);
    await expect(page.locator('[data-formula-note]')).toHaveCount(article.formulas);
    if (article.slug === 'vllm-vlm-serving') {
      await expect(page.locator('[data-vllm-runtime-viz] [data-step-viz]')).toHaveCount(1);
      await expect(page.locator('[data-vllm-runtime-viz]').getByRole('button', { name: '다음 장면' })).toBeVisible();
    }

    const math = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => {
      const node = element as HTMLElement;
      const content = node.firstElementChild?.getBoundingClientRect();
      const frame = node.getBoundingClientRect();
      const note = node.parentElement?.querySelector<HTMLElement>('[data-formula-note]');
      return {
        scale: Number(node.dataset.mathScale ?? '1'),
        overflow: content ? content.width - frame.width : 0,
        koreanEquation: /[가-힣]/.test(node.innerText),
        koreanNote: /[가-힣]/.test(note?.innerText ?? ''),
      };
    }));
    expect(math.every((item) => item.scale >= 0.68 && item.overflow <= 1 && item.koreanEquation && item.koreanNote)).toBeTruthy();

    const innerScroll = await page.locator('main').evaluate((main) => [main, ...Array.from(main.querySelectorAll<HTMLElement>('*'))]
      .filter((node) => node.scrollWidth - node.clientWidth > 2)
      .filter((node) => {
        const style = getComputedStyle(node);
        return style.overflowX === 'auto' || style.overflowX === 'scroll';
      })
      .map((node) => ({ tag: node.tagName, className: node.className, delta: node.scrollWidth - node.clientWidth })));
    expect(innerScroll).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

for (const viewport of [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`request runtime visuals preserve reading order at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const slug of ['vllm-paged-attention', 'vllm-vlm-serving']) {
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('[data-vllm-runtime-viz]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
  });
}
