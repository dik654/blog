import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

const cases = [
  {
    slug: 'z-image',
    heading: /Z-Image 내부 구조/,
    pathTitle: 'Z-Image · 현재 Image Runtime에서 효율형 S3-DiT까지 학습 경로',
    steps: ['1. 공통 Runtime', '2. Z-Image 사례', '3. 재현 검증'],
  },
  {
    slug: 'illustrious-xl',
    heading: /Illustrious XL/,
    pathTitle: 'Illustrious XL · SDXL 기준선에서 캐릭터 적응까지 학습 경로',
    steps: ['1. SDXL 기준선', '2. Illustrious 사례', '3. 적응 판단'],
  },
  {
    slug: 'wan22',
    heading: /Wan2.2 내부 구조/,
    pathTitle: 'Wan2.2 · Video Runtime에서 noise-regime MoE까지 학습 경로',
    steps: ['1. 공통 Runtime', '2. Wan2.2 사례', '3. 재현 검증'],
  },
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of cases) {
    test(`${article.slug} exposes its current-first case route at ${viewport.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { level: 1, name: article.heading })).toBeVisible();
      const route = page.getByLabel(article.pathTitle);
      await expect(route).toBeVisible();
      for (const step of article.steps) {
        await expect(route.getByRole('link', { name: step, exact: true })).toBeVisible();
      }

      await expect(page.getByText('난이도', { exact: true })).toBeVisible();
      await expect(page.getByText(/약 \d+분/)).toBeVisible();
      await expect(page.getByText('먼저 알면 좋은 것', { exact: true })).toBeVisible();

      const layout = await page.evaluate(() => ({
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        clippedFigures: Array.from(document.querySelectorAll<HTMLElement>('figure')).filter(
          (figure) => figure.scrollWidth - figure.clientWidth > 1,
        ).length,
      }));
      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.clippedFigures).toBe(0);
      expect(consoleErrors).toEqual([]);
    });
  }
}
