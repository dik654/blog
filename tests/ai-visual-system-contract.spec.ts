import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'compact', width: 360, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const routes = [
  { slug: 'diffusion-models', minimumSurfaces: 7, foundation: false },
  { slug: 'llm-architecture-gallery', minimumSurfaces: 3, foundation: false },
  { slug: 'agent-runtime-current-first', minimumSurfaces: 3, foundation: false },
  { slug: 'agent-evaluation-trace', minimumSurfaces: 3, foundation: false },
  { slug: 'perceptron', minimumSurfaces: 3, foundation: true },
  { slug: 'neural-network', minimumSurfaces: 3, foundation: true },
  { slug: 'backprop-optimization', minimumSurfaces: 5, foundation: true },
];

for (const viewport of viewports) {
  test(`technical Viz trait is independent from curriculum chrome on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of routes) {
      await page.goto(`${base}/lab/blog/ai/${route.slug}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      const article = page.locator('article[data-article-viz-system]');
      await expect(article).toHaveAttribute('data-article-viz-system', 'technical');
      if (route.foundation) await expect(article).toHaveClass(/foundation-article/);
      else await expect(article).not.toHaveClass(/foundation-article/);

      const surfaces = page.locator('[data-article-viz="true"]');
      const surfaceCount = await surfaces.count();
      expect(surfaceCount).toBeGreaterThanOrEqual(route.minimumSurfaces);
      await expect(surfaces.locator(':scope > .article-viz-inline-tool')).toHaveCount(surfaceCount);

      const metrics = await page.evaluate(() => {
        const panels = [...document.querySelectorAll<HTMLElement>('[data-article-viz="true"]')];
        const labels = panels.flatMap((panel) => (
          [...panel.querySelectorAll<HTMLElement>('p, span, dt, dd, th, td, label, code, h3, svg text')]
        )).filter((element) => {
          if (element.closest('.katex, .article-viz-inline-tool')) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none'
            && style.visibility !== 'hidden'
            && rect.width > 0
            && rect.height > 0
            && (element.textContent?.trim().length ?? 0) > 0;
        });
        const tools = [...document.querySelectorAll<HTMLElement>(
          '[data-article-viz="true"] > .article-viz-inline-tool button',
        )].map((button) => button.getBoundingClientRect());
        const articleRect = document.querySelector('article[data-article-viz-system]')?.getBoundingClientRect();

        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          panelOverflow: Math.max(0, ...panels.map((panel) => panel.scrollWidth - panel.clientWidth)),
          minimumLabel: Math.min(...labels.map((label) => Number.parseFloat(getComputedStyle(label).fontSize))),
          minimumTouchTarget: Math.min(...tools.map((rect) => Math.min(rect.width, rect.height))),
          widestPanelRatio: articleRect
            ? Math.max(...panels.map((panel) => panel.getBoundingClientRect().width / articleRect.width))
            : 0,
        };
      });

      expect(metrics.documentOverflow).toBeLessThanOrEqual(1);
      expect(metrics.panelOverflow).toBeLessThanOrEqual(1);
      expect(metrics.minimumLabel).toBeGreaterThanOrEqual(12);
      expect(metrics.minimumTouchTarget).toBeGreaterThanOrEqual(44);
      if (viewport.width === 1440) expect(metrics.widestPanelRatio).toBeGreaterThanOrEqual(0.75);
    }

    await page.goto(`${base}/lab/blog/ai/diffusion-models`, { waitUntil: 'networkidle' });
    const firstFigure = page.locator('[data-article-viz="true"]').first();
    await expect(firstFigure.locator(':scope > figcaption')).toHaveCount(1);
    const pseudoContent = await firstFigure.evaluate((element) => getComputedStyle(element, '::before').content);
    expect(pseudoContent).toBe('none');
    await firstFigure.getByLabel('시각화 전체화면으로 보기').click();
    await expect(firstFigure).toHaveClass(/article-viz-expanded/);
    await firstFigure.getByLabel('전체화면 닫기').click();
    await expect(firstFigure).not.toHaveClass(/article-viz-expanded/);
  });
}
