import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4176';

const articles = [
  { slug: 'llm-serving-ops', title: 'LLM Serving Control Plane: release에서 복구까지', formulas: 0, oracle: '5 / 8 Ready' },
  { slug: 'serving-deployment', title: 'LLM Release: manifest에서 rollback-ready endpoint까지', formulas: 1, oracle: '3,200' },
  { slug: 'k8s-gpu-fleet', title: 'GPU Fleet: resource claim에서 Ready capacity까지', formulas: 1, oracle: '6 GPUs' },
  { slug: 'litellm-gateway', title: 'LLM Gateway: 인증된 요청에서 route evidence까지', formulas: 2, oracle: '$0.0026 / request' },
  { slug: 'observability-aiops', title: 'LLM Observability: 증상에서 검증된 복구까지', formulas: 2, oracle: 'decode kernel 1순위 아님' },
];

test('control-plane path follows artifact ownership from release to verified recovery', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving-operations`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-llm-serving-control-plane"]');
  await expect(path).toBeVisible();
  const hrefs = await path.getByRole('link').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  expect(hrefs).toEqual(articles.map(({ slug }) => `/lab/blog/ai/${slug}`));
  for (const article of articles) await expect(path.getByRole('heading', { name: article.title })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('serving lifecycle and DRA version boundaries remain explicit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/serving-deployment`, { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText('startup 단계만 센 하한');
  await page.locator('[data-serving-fixture]').getByRole('tab', { name: /Startup/ }).click();
  await expect(page.locator('[data-serving-fixture]')).toContainText('Readiness warmup은 그 뒤의 별도 gate');
  await expect(page.locator('body')).not.toContainText('weight load부터 readiness까지의 fixture');

  await page.goto(`${base}/lab/blog/ai/k8s-gpu-fleet`, { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText('DRA core는 Kubernetes 1.34에서 GA');
  await expect(page.locator('body')).toContainText('1.35부터는 항상 활성화');
  await expect(page.locator('a[href="https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/"]')).toHaveCount(1);

  await page.goto(`${base}/lab/blog/ai/observability-aiops`, { waitUntil: 'networkidle' });
  await expect(page.getByText('KV / preemption', { exact: true })).toBeVisible();
  await expect(page.getByText('Canary', { exact: true })).toBeVisible();
});

for (const article of articles) {
  test(`${article.slug} owns one control-plane artifact without mobile overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-learning-question]')).toHaveCount(1);
    await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
    await expect(page.locator('[data-serving-control-viz]')).toHaveCount(1);
    await expect(page.locator('[data-serving-control-viz] [data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-serving-control-viz]').getByRole('button', { name: '다음 장면' })).toBeVisible();
    await expect(page.getByText('오해 방지.', { exact: true })).toBeVisible();
    await expect(page.getByText('여기까지 오면', { exact: true })).toBeVisible();
    await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();
    await expect(page.getByText(article.oracle, { exact: false }).first()).toBeVisible();
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
        koreanEquation: /[가-힣]/.test(node.innerText),
        koreanNote: /[가-힣]/.test(note?.innerText ?? ''),
      };
    }));
    expect(math.every((item) => item.scale >= 0.68 && item.overflow <= 1 && item.koreanEquation && item.koreanNote)).toBeTruthy();

    const viz = await page.locator('[data-serving-control-viz]').evaluate((node) => ({
      width: node.clientWidth,
      scrollWidth: node.scrollWidth,
      rect: node.getBoundingClientRect().toJSON(),
    }));
    expect(viz.scrollWidth - viz.width).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

for (const viewport of [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`control-plane visuals preserve reading order at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const slug of ['serving-deployment', 'k8s-gpu-fleet', 'observability-aiops']) {
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('[data-serving-control-viz]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
  });
}
