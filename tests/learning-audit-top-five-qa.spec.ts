import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const pages = [
  {
    slug: 'fm-boundary-practice',
    path: '/lab/core/verification-practice/fm-boundary-practice',
    heading: /FM 경계 절단 실천 노트/,
    visualSelector: '[aria-label="경계를 검증 증거로 바꾸는 네 단계"]',
  },
  {
    slug: 'geth-blob-tx-fm',
    path: '/lab/core/verification-practice/geth-blob-tx-fm',
    heading: /geth Blob 트랜잭션을 정적으로 검증하는 부분/,
    visualSelector: '[aria-label="Blob transaction 검증 비용 순서"]',
  },
  {
    slug: 'stable-diffusion-open-models',
    path: '/lab/blog/ai/stable-diffusion-open-models',
    heading: /Stable Diffusion 내부 구현/,
    visualSelector: '[data-sd-runtime-lab]',
  },
  {
    slug: 'geth-test-units',
    path: '/lab/core/verification-practice/geth-test-units',
    heading: /go-ethereum 기능별 코드 해설과 검증 단위/,
    visualSelector: '[aria-label="go-ethereum 검증 레지스트리 사용 순서"]',
  },
  {
    slug: 'vllm-test-units',
    path: '/lab/core/ai-systems/vllm-test-units',
    heading: /vLLM 기능별 코드 해설과 검증 단위/,
    visualSelector: '[aria-label="vLLM request 검증 경계 순서"]',
  },
] as const;

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  for (const article of pages) {
    test(`${article.slug} learning flow at ${viewport.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.setViewportSize(viewport);
      await page.goto(`${base}${article.path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByRole('heading', { name: article.heading, level: 1 })).toBeVisible();
      await expect(page.locator('[data-learning-question]')).toBeVisible();
      await expect(page.locator(article.visualSelector).first()).toBeVisible();

      const order = await page.evaluate((visualSelector) => {
        const question = document.querySelector('[data-learning-question]');
        const primer = document.querySelector('[data-concept-primer]');
        const visual = document.querySelector(visualSelector);
        if (!question || !primer || !visual) return null;
        const relation = question.compareDocumentPosition(primer);
        const visualRelation = primer.compareDocumentPosition(visual);
        return {
          questionBeforePrimer: Boolean(relation & Node.DOCUMENT_POSITION_FOLLOWING),
          primerBeforeVisual: Boolean(visualRelation & Node.DOCUMENT_POSITION_FOLLOWING),
        };
      }, article.visualSelector);
      expect(order).toEqual({ questionBeforePrimer: true, primerBeforeVisual: true });

      const layout = await page.evaluate(() => {
        const visible = (node: HTMLElement) => {
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
        };
        const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]')).filter(visible);
        const visuals = Array.from(document.querySelectorAll<HTMLElement>('[aria-label]')).filter((node) =>
          visible(node) && /검증|Stable Diffusion/.test(node.getAttribute('aria-label') ?? ''),
        );
        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          rawLatex: /\\(?:theta|underbrace|begin\{|frac\{|mathbb)/.test(document.body.innerText),
          formulaOverflow: formulas.map((node) => {
            const rendered = node.firstElementChild as HTMLElement | null;
            return rendered ? rendered.getBoundingClientRect().width - node.clientWidth : 0;
          }),
          hasKatex: formulas.every((node) => Boolean(node.querySelector('.katex'))),
          visualOverflow: visuals.map((node) => node.scrollWidth - node.clientWidth),
          visibleTables: Array.from(document.querySelectorAll<HTMLElement>('table')).filter(visible).length,
        };
      });

      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.rawLatex).toBe(false);
      expect(layout.formulaOverflow.every((value) => value <= 1)).toBe(true);
      expect(layout.hasKatex).toBe(true);
      expect(layout.visualOverflow.every((value) => value <= 1)).toBe(true);
      if (viewport.width < 1024) expect(layout.visibleTables).toBe(0);
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);

      const shouldCapture =
        (article.slug === 'stable-diffusion-open-models' && viewport.name !== 'tablet') ||
        (article.slug === 'geth-test-units' && viewport.name === 'mobile');
      if (shouldCapture) {
        await page.screenshot({
          path: `test-results/learning-top-five-${article.slug}-${viewport.name}.png`,
          fullPage: true,
        });
      }
    });
  }
}
