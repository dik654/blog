import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = [
  'compression-pipeline',
  'quantization',
  'pruning',
  'knowledge-distillation',
];

for (const target of [
  {
    slug: 'compression-pipeline',
    path: '경량화 공통 뿌리 · 배포 계약과 출시 루프',
    count: 1,
    current: 0,
  },
  {
    slug: 'quantization',
    path: '표현 정밀도 경로 · Quantization',
    count: 2,
    current: 1,
  },
  {
    slug: 'pruning',
    path: '구조 제거 경로 · Pruning',
    count: 2,
    current: 1,
  },
  {
    slug: 'knowledge-distillation',
    path: '새 Student 경로 · Knowledge Distillation',
    count: 2,
    current: 1,
  },
]) {
  test(`${target.slug} exposes its compression branch`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(target.count);
    await expect(rail.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [390, 768, 1440]) {
  test(`compression articles remain readable at ${width}px`, async ({ page }) => {
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

test('memory envelope reveals KV pressure after weight compression', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/compression-pipeline`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="memory-envelope"]');
  await expect(lab.getByText('가중치 압축만으로는 들어오지 않는다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'INT4 예시', exact: true }).click();
  await lab.getByRole('button', { name: '2K', exact: true }).click();
  await lab.getByRole('button', { name: '1', exact: true }).click();
  await expect(lab.getByText('이 가정에서는 메모리 envelope 안에 들어온다', { exact: true })).toBeVisible();
});

test('compression gate follows the observed bottleneck', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/compression-pipeline`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="compression-gate"]');
  await expect(lab.getByText('Weight-only PTQ를 첫 후보로', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'KV', exact: true }).click();
  await expect(lab.getByText('KV 정책과 KV quantization 경로', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '품질', exact: true }).click();
  await expect(lab.getByText('압축보다 모델·데이터 선택을 재검토', { exact: true })).toBeVisible();
});

test('quantization labs separate range error from kernel realization', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/quantization`, { waitUntil: 'networkidle' });

  const range = page.locator('[data-lab="range-outlier"]');
  await expect(range.getByText('작은 값들의 rounding 오차가 커지는 조건', { exact: true })).toBeVisible();
  await range.getByRole('button', { name: 'INT8', exact: true }).click();
  await range.getByRole('button', { name: 'Channel', exact: true }).click();
  await expect(range.getByText('이 예시에서는 눈금이 충분히 촘촘하다', { exact: true })).toBeVisible();

  const kernel = page.locator('[data-lab="kernel-realization"]');
  await expect(kernel.getByText('파일은 작아져도 실행 이득은 미확정', { exact: true })).toBeVisible();
  await kernel.getByRole('button', { name: '지원 kernel', exact: true }).click();
  await expect(kernel.getByText('실현 가능한 low-bit 실행 후보', { exact: true })).toBeVisible();
});

test('pruning lab distinguishes zeros from skipped work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/pruning`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="sparsity-realization"]');
  await expect(lab.getByText('0이 생겼지만 dense kernel은 여전히 모든 위치를 계산한다', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '2:4', exact: true }).click();
  await lab.getByRole('button', { name: 'Sparse 지원', exact: true }).click();
  await expect(lab.getByText('지원되는 2:4 sparse kernel의 후보', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '채널 제거', exact: true }).click();
  await expect(lab.getByText('더 작은 dense shape로 재구성할 수 있다', { exact: true })).toBeVisible();
});

test('distillation lab enforces the tokenizer contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/knowledge-distillation`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-lab="distillation-signal"]');
  await expect(lab.getByText('Vocabulary alignment 또는 sequence-level KD', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '같음', exact: true }).click();
  await expect(lab.getByText('Token-level KL + hard-label loss', { exact: true })).toBeVisible();
  await lab.getByRole('button', { name: '출력만', exact: true }).click();
  await expect(lab.getByText('Sequence/data distillation', { exact: true })).toBeVisible();
});
