import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = [
  'image-rag-defect-retrieval',
  'contrastive-learning',
  'domain-finetuning',
  'sentence-embeddings',
];

for (const target of [
  {
    slug: 'image-rag-defect-retrieval',
    path: '이미지 검색 · 현장 근거에서 필요한 학습으로',
    count: 3,
    current: 0,
  },
  {
    slug: 'contrastive-learning',
    path: '이미지 검색 · 현장 근거에서 필요한 학습으로',
    count: 3,
    current: 1,
  },
  {
    slug: 'domain-finetuning',
    path: '이미지 검색 · 현장 근거에서 필요한 학습으로',
    count: 3,
    current: 2,
  },
  {
    slug: 'sentence-embeddings',
    path: '텍스트 검색 · Query 계약에서 도메인 적응으로',
    count: 2,
    current: 0,
  },
]) {
  test(`${target.slug} exposes its retrieval path`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(target.count);
    await expect(rail.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [390, 768, 1440]) {
  test(`embedding and retrieval articles remain readable at ${width}px`, async ({ page }) => {
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
        const rawLatex = /\\(?:theta|phi|frac|sum|mathcal|begin|operatorname|underbrace)\b/;
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

test('image relevance lab changes positives only after the split contract is safe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/image-rag-defect-retrieval`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="relevance-contract"]');
  await expect(lab.getByText('평가가 같은 생산 계보를 다시 볼 수 있다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'Lot', exact: true }).click();
  await expect(lab.getByText('원인이 같은 사례 일반화를 시험한다', { exact: true })).toBeVisible();
});

test('retrieval stack fixes the layer that caused the observed failure', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/image-rag-defect-retrieval`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="retrieval-stack"]');
  await expect(lab.getByText('Exact search에서 false neighbor를 먼저 고친다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'ANN 누락', exact: true }).click();
  await expect(lab.getByText('Exact Top-K 대비 ANN recall을 측정한다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '순서', exact: true }).click();
  await expect(lab.getByText('High-recall 후보를 pairwise model로 재정렬한다', { exact: true })).toBeVisible();
});

test('pair mining surfaces and removes a false negative', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/contrastive-learning`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="pair-mining"]');
  await expect(lab.getByText('1개의 false negative가 있다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '계보 분리', exact: true }).click();
  await expect(lab.getByText('현재 batch label은 목표와 일치한다', { exact: true })).toBeVisible();
});

test('domain adaptation gate follows shift type and label access', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/domain-finetuning`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="domain-shift-gate"]');
  await expect(lab.getByText('전처리·unlabeled continued pretraining을 비교한다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '가까움 정의', exact: true }).click();
  await expect(lab.getByText('먼저 relevance label을 수집한다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '있음', exact: true }).click();
  await expect(lab.getByText('Supervised contrastive·ranking tuning 후보', { exact: true })).toBeVisible();
});

test('text retrieval separates pooling and reranking contracts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/sentence-embeddings`, { waitUntil: 'networkidle' });

  const pooling = page.locator('[data-lab="pooling-mask"]');
  await expect(pooling.getByText('Padding이 문장 표현을 희석한다', { exact: true })).toBeVisible();
  await pooling.getByRole('button', { name: '제외', exact: true }).click();
  await expect(pooling.getByText('Attention mask로 실제 token만 평균한다', { exact: true })).toBeVisible();

  const retrieval = page.locator('[data-lab="text-retrieval-contract"]');
  await expect(retrieval.getByText('모델 비교 전에 input contract를 고친다', { exact: true })).toBeVisible();
  await retrieval.getByRole('button', { name: '정확함', exact: true }).click();
  await expect(retrieval.getByText('Bi-encoder retrieval baseline', { exact: true })).toBeVisible();
  await retrieval.getByRole('button', { name: '사용', exact: true }).click();
  await expect(retrieval.getByText('Bi-encoder 후보 + reranker 순서 검증', { exact: true })).toBeVisible();
});

test('text adaptation link preserves the text retrieval path context', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/sentence-embeddings`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'domain adaptation과 reindex migration', exact: true }).click();

  await expect(page).toHaveURL(/\/lab\/blog\/ai\/domain-finetuning\?path=ai-practical-text-embedding$/);
  const rail = page.locator('[aria-label="텍스트 검색 · Query 계약에서 도메인 적응으로 학습 경로"]');
  await expect(rail.getByRole('link')).toHaveCount(2);
  await expect(rail.getByRole('link').nth(1)).toHaveAttribute('aria-current', 'step');

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('main h1')).toHaveText('Domain Adaptation: Shift 진단에서 Reindex까지');
  const restoredRail = page.locator('[aria-label="텍스트 검색 · Query 계약에서 도메인 적응으로 학습 경로"]');
  await expect(restoredRail.getByRole('link').nth(1)).toHaveAttribute('aria-current', 'step');
});
