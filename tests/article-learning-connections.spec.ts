import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`parent topics remain branches instead of flattening descendant articles on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-llm`, { waitUntil: 'domcontentloaded' });

    const branches = page.locator('main [data-subcategory-branches]');
    await expect(branches).toBeVisible();
    await expect(branches.getByRole('heading', { name: '이제 세부 경로 하나를 선택합니다' })).toBeVisible();
    await expect(branches.getByRole('link')).toHaveCount(2);
    await expect(page.locator('main [data-article-card]')).toHaveCount(0);
    await expect(page.locator('main')).toContainText('하나를 선택한 뒤 그 안의 핵심 글 순서만 따라갑니다');
  });

  test(`large leaf topics expose numbered start-to-finish flow on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/blockchain?sub=eth-reth`, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main [data-article-sequence]')).toContainText('22');
    await expect(page.locator('main [data-article-card]')).toHaveCount(22);
    await expect(page.locator('[data-article-card="reth"]')).toContainText('01');
    await expect(page.locator('[data-article-card="reth-mev"]')).toContainText('22');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`ordinary articles receive subcategory breadcrumb and previous-current-next context on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/blockchain/reth-db`, { waitUntil: 'domcontentloaded' });

    const route = page.locator('[data-article-route-context="subcategory"]');
    await expect(route).toBeVisible();
    await expect(route).toContainText('08 / 22');
    await expect(route.getByRole('link', { name: '전체 흐름' })).toHaveAttribute('href', /\?sub=eth-reth$/);
    await expect(page.getByRole('navigation', { name: '현재 위치', exact: true }).getByRole('link').last()).toHaveAttribute('href', /\?sub=eth-reth$/);
    await expect(page.getByRole('navigation', { name: '주제 안에서 이어 읽기' })).toBeVisible();
  });
}

test('declared foundation and paper routes remain explicit learning paths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${base}/lab/blog/ai/perceptron`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-article-route-context="subcategory"]')).toHaveCount(0);
  await expect(page.getByLabel('신경망 학습 핵심 경로 학습 경로')).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/paper-transformer-2017`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByLabel('NLP 원 논문 선택 경로 학습 경로')).toBeVisible();
  await expect(page.getByRole('link', { name: '6. Transformer' })).toHaveAttribute('aria-current', 'step');
});

test('a parent topic keeps its own articles next to its child branches', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/isms-aml?sub=aml-cft`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('main [data-subcategory-branches]')).toBeVisible();
  await expect(page.locator('main [data-article-card]')).toHaveCount(1);
  await expect(page.locator('main [data-article-sequence]')).toContainText('01');
});
