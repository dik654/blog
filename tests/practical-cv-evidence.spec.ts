import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = [
  'image-classification-pipeline',
  'multiview-fusion',
  'video-understanding',
  'deepfake-detection',
];

for (const target of [
  { slug: 'image-classification-pipeline', path: 'Image Evidence · 한 장에서 View Set까지', current: 0 },
  { slug: 'multiview-fusion', path: 'Image Evidence · 한 장에서 View Set까지', current: 1 },
  { slug: 'video-understanding', path: 'Temporal Evidence · Video에서 Open-world Forensics까지', current: 0 },
  { slug: 'deepfake-detection', path: 'Temporal Evidence · Video에서 Open-world Forensics까지', current: 1 },
]) {
  test(`${target.slug} exposes its evidence path`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(2);
    await expect(rail.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [390, 768, 1440]) {
  test(`practical CV routes remain readable at ${width}px`, async ({ page }) => {
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
      if (formulaScales.length > 0) expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.8);

      await expect(page.locator('[data-formula-pair]')).toHaveCount(await page.locator('[data-formula-note]').count());
      expect(await page.locator('article svg text').count()).toBe(0);
      expect(await page.locator('article').evaluate((article) => {
        const rawLatex = /\\(?:theta|psi|frac|sum|Delta|mathcal|begin|operatorname)\b/;
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

test('image labs reveal group leakage and invalid augmentation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/image-classification-pipeline`, { waitUntil: 'networkidle' });

  const split = page.locator('[data-lab="split-contract"]');
  await expect(split.getByText('점수는 높아도 새 대상을 평가한 것이 아니다', { exact: true })).toBeVisible();
  await split.getByRole('button', { name: '대상별', exact: true }).click();
  await expect(split.getByText('새 대상을 만나는 질문과 split이 맞았다', { exact: true })).toBeVisible();

  const augmentation = page.locator('[data-lab="augmentation-contract"]');
  await expect(augmentation.getByText('현재 계약에서는 금지', { exact: true })).toBeVisible();
  await augmentation.getByRole('button', { name: '종 분류', exact: true }).click();
  await expect(augmentation.getByText('Label-preserving 후보', { exact: true })).toBeVisible();
});

test('view lab changes the fusion gate with semantics and missingness', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/multiview-fusion`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="view-set"]');
  await expect(lab.getByText('Shared encoder + masked set pooling', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '카메라 고정', exact: true }).click();
  await lab.getByRole('button', { name: '없음', exact: true }).click();
  await expect(lab.getByText('Camera token + cross-view interaction 후보', { exact: true })).toBeVisible();
});

test('video labs separate sampling coverage from temporal evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/video-understanding`, { waitUntil: 'networkidle' });

  const sampling = page.locator('[data-lab="temporal-sampling"]');
  await expect(sampling.getByText('중요 전환을 놓칠 가능성', { exact: true })).toBeVisible();
  await sampling.getByRole('button', { name: '촘촘', exact: true }).click();
  await expect(sampling.getByText('사건을 구분할 표본 후보', { exact: true })).toBeVisible();

  const evidence = page.locator('[data-lab="temporal-evidence"]');
  await evidence.getByRole('button', { name: 'Frame shuffle', exact: true }).click();
  await expect(evidence.getByText('순서를 섞음', { exact: true })).toBeVisible();
  await expect(evidence.getByText('0.80', { exact: true })).toBeVisible();
});

test('forensic lab exposes the open-domain collapse', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/deepfake-detection`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="forensic-generalization"]');
  await expect(lab.getByText('0.96', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '생성기', exact: true }).click();
  await expect(lab.getByText('0.68', { exact: true })).toBeVisible();
  await expect(lab.getByText('미지 생성기에서 탐지 규칙이 무너졌다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '유통 과정', exact: true }).click();
  await expect(lab.getByText('0.57', { exact: true })).toBeVisible();
});
