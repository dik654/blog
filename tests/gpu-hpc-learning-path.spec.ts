import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const pathTitle = 'GPU HPC · 분산 계산에서 물리 경로와 운영까지';

test('GPU HPC category exposes a bounded current-first route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/gpu?sub=gpu-cluster-hpc`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 1, name: 'GPU Cluster & HPC' })).toBeVisible();
  await expect(page.getByText(pathTitle, { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /GPU HPC 바닥부터/ })).toHaveAttribute(
    'href',
    '/lab/blog/gpu/gpu-hpc-from-scratch',
  );
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`GPU HPC article keeps the cross-category route visible on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(
      `${base}/lab/blog/gpu/gpu-hpc-from-scratch?path=gpu-hpc-current-first`,
      { waitUntil: 'networkidle' },
    );

    const route = page.getByLabel(`${pathTitle} 학습 경로`);
    await expect(route).toBeVisible();
    await expect(route.getByRole('link')).toHaveCount(5);
    await expect(route.getByRole('link', { name: '1. HPC 목표 판정' })).toHaveAttribute('aria-current', 'step');
    await expect(route.getByRole('link', { name: '2. 물리 Network' })).toHaveAttribute(
      'href',
      '/lab/blog/gpu/hw-network?path=gpu-hpc-current-first',
    );
    await expect(route.getByRole('link', { name: '5. Cluster 제어면' })).toHaveAttribute(
      'href',
      '/lab/blog/ai/k8s-gpu-fleet?path=gpu-hpc-current-first',
    );

    await expect(page.getByRole('heading', { level: 2, name: '두 노드 학습 작업은 어떤 순서로 살아날까?' })).toBeVisible();
    await expect(page.getByText('RANK=0…7', { exact: false })).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(4);
    await expect(page.locator('[data-formula-note]')).toHaveCount(3);
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

for (const viewport of [
  { name: 'narrow', width: 360, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`GPU HPC scenes remain readable and operable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/gpu/gpu-hpc-from-scratch#two-node-job`, { waitUntil: 'networkidle' });

    const section = page.locator('#two-node-job');
    await expect(section).toBeVisible();
    await expect(page.locator('[data-testid="hpc-scale-scene"]')).toBeVisible();
    await expect(page.locator('[data-testid="hpc-transport-scene"]')).toBeVisible();
    await expect(page.locator('[data-testid="hpc-stack-scene"]')).toBeVisible();
    await expect(page.locator('[data-testid="hpc-job-scene"]')).toBeVisible();

    const visualMetrics = await page.evaluate(() => {
      const roots = [...document.querySelectorAll<HTMLElement>('[data-testid^="hpc-"][data-testid$="-scene"]')];
      const visibleText = roots.flatMap((root) => [...root.querySelectorAll<HTMLElement>('p, span')]).filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden';
      });
      const controls = [...document.querySelectorAll<HTMLElement>('[data-hpc-multinode-viz] button')].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      return {
        minFontSize: Math.min(...visibleText.map((element) => Number.parseFloat(getComputedStyle(element).fontSize))),
        minControlHeight: Math.min(...controls.map((element) => element.getBoundingClientRect().height)),
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
        clippedSceneCount: roots.filter((root) => root.scrollWidth - root.clientWidth > 1).length,
        svgTextCount: roots.reduce((sum, root) => sum + root.querySelectorAll('svg text').length, 0),
      };
    });

    expect(visualMetrics.minFontSize).toBeGreaterThanOrEqual(12);
    expect(visualMetrics.minControlHeight).toBeGreaterThanOrEqual(44);
    expect(visualMetrics.documentOverflow).toBeLessThanOrEqual(1);
    expect(visualMetrics.clippedSceneCount).toBe(0);
    expect(visualMetrics.svgTextCount).toBe(0);

  });
}

test('multi-node job lab distinguishes correctness, transport, and membership failures', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/lab/blog/gpu/gpu-hpc-from-scratch#two-node-job`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-hpc-multinode-viz]');

  await lab.getByRole('button', { name: 'step 4' }).click();
  await expect(lab.getByText('Using network IB', { exact: false })).toBeVisible();

  await lab.getByRole('button', { name: 'Socket fallback' }).click();
  await expect(lab.getByText('via NET/Socket/0', { exact: false })).toBeVisible();
  await expect(lab.getByText('fallback', { exact: true })).toBeVisible();

  await lab.getByRole('button', { name: 'Rank 누락' }).click();
  await expect(lab.getByText('waiting for rank 7', { exact: false })).toBeVisible();

  await lab.getByRole('button', { name: 'step 5' }).click();
  await expect(lab.getByText('8 / 8 ranks joined', { exact: true })).toBeVisible();
  await expect(lab.getByText('fail', { exact: true })).toBeVisible();

  const rawText = await page.locator('main').innerText();
  expect(rawText).not.toMatch(/\\(?:theta|frac|ge|mathrm)\b/);
  await expect(page.locator('.katex-error')).toHaveCount(0);
});
