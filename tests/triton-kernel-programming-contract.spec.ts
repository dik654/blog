import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const slug = 'triton-kernel-programming';
const pathTitle = 'ML 커널 · FlashAttention에서 CUDA 바닥까지';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Triton contract stays readable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/gpu/${slug}?path=gpu-ml-kernel-current-first`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 2, name: 'Triton Program은 CUDA Thread 하나가 아니다' })).toBeVisible();
    await expect(page.locator('[data-triton-program-lab]')).toBeVisible();
    await expect(page.locator('[data-step-viz]')).toHaveCount(1);
    await expect(page.locator('[data-formula-pair]')).toHaveCount(4);
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('.katex-error')).toHaveCount(0);

    const route = page.getByLabel(`${pathTitle} 학습 경로`);
    await expect(route).toBeVisible();
    await expect(route.getByRole('link')).toHaveCount(5);
    await expect(route.getByRole('link', { name: '2. Triton 실행 계약' })).toHaveAttribute('aria-current', 'step');

    const audit = await page.evaluate(() => {
      const rawLatex = [...document.querySelectorAll<HTMLElement>('article p, article li, article h2, article h3')]
        .some((element) => /\\(?:underbrace|frac|arg|min|mathrm|operatorname)\b/.test(element.textContent ?? ''));
      const controls = [...document.querySelectorAll<HTMLElement>('[data-triton-program-lab] button')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return Math.min(rect.width, rect.height);
        });
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        rawLatex,
        minimumControl: Math.min(...controls),
      };
    });

    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.rawLatex).toBe(false);
    expect(audit.minimumControl).toBeGreaterThanOrEqual(44);
  });
}

test('program mapping exposes exact grid and tail state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/gpu/${slug}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-triton-program-lab]');
  await expect(lab).toHaveAttribute('data-length', '17');
  await expect(lab).toHaveAttribute('data-block-size', '8');
  await expect(lab).toHaveAttribute('data-program-count', '3');
  await expect(lab).toHaveAttribute('data-masked-count', '7');
  await expect(lab.locator('[data-valid="true"]')).toHaveCount(17);
  await expect(lab.locator('[data-valid="false"]')).toHaveCount(7);

  await lab.getByRole('button', { name: '32' }).click();
  await lab.getByRole('button', { name: '16' }).click();
  await expect(lab).toHaveAttribute('data-program-count', '2');
  await expect(lab).toHaveAttribute('data-masked-count', '0');
  await expect(lab.locator('[data-valid="true"]')).toHaveCount(32);

  const flow = page.locator('[data-step-viz]');
  await flow.getByRole('button', { name: 'step 3' }).click();
  await expect(flow.locator('[data-step-viz-narrative]')).toContainText('HBM 왕복');
  await flow.getByRole('button', { name: 'step 5' }).click();
  await expect(flow.locator('[data-step-viz-narrative]')).toContainText('Compiler lowering');
});

test('official sources and neighboring kernel layers are linked', async ({ page }) => {
  await page.goto(`${base}/lab/blog/gpu/${slug}`, { waitUntil: 'networkidle' });

  for (const href of [
    'https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html',
    'https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html',
    'https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html',
    'https://triton-lang.org/main/programming-guide/chapter-3/debugging.html',
    'https://github.com/triton-lang/triton',
  ]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  await expect(page.getByRole('link', { name: '상위 사례 · FlashAttention IO schedule' })).toHaveAttribute(
    'href',
    '/lab/blog/gpu/flashattention-io-triton',
  );
  await expect(page.getByRole('link', { name: '계산 바닥 · CUDA tiled matmul' })).toHaveAttribute(
    'href',
    '/lab/blog/gpu/cuda-matrix-multiply',
  );
});
