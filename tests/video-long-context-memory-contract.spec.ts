import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const slug = 'video-long-context-memory';
const pathTitle = '통합 멀티모달 · 현재 계약에서 공식 Code까지';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`long-video memory article keeps formulas and Viz readable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/${slug}?path=ai-multimodal-current-first`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 2, name: '30분 영상은 image 5만 장의 목록이 아니다' })).toBeVisible();
    await expect(page.locator('[data-temporal-token-budget-lab]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-formula-pair]')).toHaveCount(3);
    await expect(page.locator('[data-formula-note]')).toHaveCount(3);
    await expect(page.locator('.katex-error')).toHaveCount(0);

    const route = page.getByLabel(`${pathTitle} 학습 경로`);
    await expect(route).toBeVisible();
    await expect(route.getByRole('link')).toHaveCount(7);
    await expect(route.getByRole('link', { name: '3. 긴 Video Memory' })).toHaveAttribute('aria-current', 'step');

    const audit = await page.evaluate(() => {
      const rawLatex = [...document.querySelectorAll<HTMLElement>('article p, article li, article h2, article h3')]
        .some((element) => /\\(?:underbrace|frac|sum|theta|tau|mathrm)\b/.test(element.textContent ?? ''));
      const formulaOverflow = [...document.querySelectorAll<HTMLElement>('[data-math-fit]')]
        .map((element) => {
          const child = element.firstElementChild as HTMLElement | null;
          return child ? child.getBoundingClientRect().width - element.getBoundingClientRect().width : 0;
        });
      const controls = [...document.querySelectorAll<HTMLElement>('[data-temporal-token-budget-lab] button')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return Math.min(rect.width, rect.height);
        });
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        rawLatex,
        formulaOverflow,
        minimumControl: Math.min(...controls),
      };
    });

    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.rawLatex).toBe(false);
    expect(Math.max(0, ...audit.formulaOverflow)).toBeLessThanOrEqual(1);
    expect(audit.minimumControl).toBeGreaterThanOrEqual(44);
  });
}

test('token ledger exposes stable numeric state changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-temporal-token-budget-lab]');
  await expect(lab.locator('[data-budget-value="전체 visual token"]')).toHaveAttribute('data-raw-value', '307200');
  await expect(lab.locator('[data-budget-value="현재 활성 token"]')).toHaveAttribute('data-raw-value', '16221');

  await lab.getByRole('button', { name: '30분' }).click();
  await expect(lab.locator('[data-budget-value="전체 visual token"]')).toHaveAttribute('data-raw-value', '921600');

  const tieredKv = Number(await lab.locator('[data-budget-value="32-layer KV"]').getAttribute('data-raw-value'));
  await lab.getByRole('button', { name: '전체 문맥' }).click();
  await expect(lab.locator('[data-budget-value="현재 활성 token"]')).toHaveAttribute('data-raw-value', '921600');
  const fullKv = Number(await lab.locator('[data-budget-value="32-layer KV"]').getAttribute('data-raw-value'));
  expect(fullKv).toBeGreaterThan(tieredKv);

  const flow = page.locator('[data-step-viz]');
  await flow.getByRole('button', { name: '다음 장면' }).click();
  await expect(flow.locator('[data-step-viz-narrative]')).toContainText('Chunk는 계산을 제한');
  await flow.getByRole('button', { name: 'step 4' }).click();
  await expect(flow.locator('[data-step-viz-narrative]')).toContainText('이해와 생성');
});

test('recent claims stay linked to primary sources and neighboring foundations', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });

  for (const href of [
    'https://arxiv.org/abs/2603.29252',
    'https://arxiv.org/abs/2606.07577',
    'https://arxiv.org/abs/2607.00712',
    'https://research.nvidia.com/labs/eai/publication/longlive/',
    'https://research.nvidia.com/labs/eai/publication/sana-video/',
    'https://research.nvidia.com/labs/sil/projects/horizonrelight/',
  ]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  await expect(page.getByRole('link', { name: 'GPU HPC 바닥부터' })).toHaveAttribute(
    'href',
    '/lab/blog/gpu/gpu-hpc-from-scratch',
  );
  await expect(page.getByRole('link', { name: 'Video Model Runtime' })).toHaveAttribute(
    'href',
    '/lab/blog/ai/video-model-runtime',
  );
});
