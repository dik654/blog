import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const categoryNodeCounts = [
  ['ai', 20],
  ['blockchain', 8],
  ['tee', 6],
  ['systems', 2],
  ['gpu', 5],
  ['crypto', 3],
  ['p2p', 3],
  ['ops', 5],
  ['isms-aml', 6],
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`home and every category use the same top-down map at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '탑다운 학습 경로' })).toBeVisible();
    const route = page.getByRole('heading', { name: '탑다운 학습 경로' }).locator('xpath=ancestor::section[1]');
    await expect(route.getByRole('link')).toHaveCount(4);
    await expect(route).toContainText('00읽는 방법');
    await expect(route).toContainText('01목표 분야');
    await expect(route).toContainText('02필요한 기반');
    await expect(route).toContainText('03구현 · 운영');

    for (const [category, expectedNodes] of categoryNodeCounts) {
      await page.goto(`${base}/lab/blog/${category}`, { waitUntil: 'domcontentloaded' });
      const roadmap = page.locator('main [data-curriculum-roadmap]');
      await expect(roadmap).toBeVisible();
      await expect(roadmap.locator('[data-learning-node]')).toHaveCount(expectedNodes);
      const roles = await roadmap.locator('[data-category-stage]').evaluateAll((stages) =>
        stages.map((stage) => stage.getAttribute('data-stage-role')),
      );
      expect(roles.every((role) => ['orient', 'map', 'target', 'foundation', 'build'].includes(role ?? ''))).toBeTruthy();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
  });
}

test('direct article breadcrumb includes its category stage and leaf path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/image-rag-defect-retrieval`, { waitUntil: 'domcontentloaded' });

  const breadcrumb = page.getByRole('navigation', { name: '현재 위치', exact: true });
  await expect(breadcrumb).toContainText('AI');
  await expect(breadcrumb).toContainText('03');
  await expect(breadcrumb).toContainText('공통 구현 허브');
  await expect(breadcrumb.getByRole('link', { name: '임베딩 검색 · 적응' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('internal Scene Engine pilot is not a public AI article', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/scene-engine-test`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('글을 찾을 수 없습니다.', { exact: true })).toBeVisible();
});
