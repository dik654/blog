import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';

const articles = [
  {
    slug: 'qwen-korean-consistency',
    path: '/lab/blog/ai/qwen-korean-consistency',
    heading: /Qwen 한국어 일관성/,
    visualLabel: '한국어 일관성 문제의 진단과 개입 층',
    expectsKatex: true,
  },
  {
    slug: 'comfyui-edit-models-flux-qwen',
    path: '/lab/blog/ai/comfyui-edit-models-flux-qwen',
    heading: /ComfyUI 이미지 편집.*FLUX/,
    visualLabel: 'ComfyUI instruction image editing 실행 흐름',
    expectsKatex: false,
  },
  {
    slug: 'discrete-log',
    path: '/lab/blog/crypto/discrete-log',
    heading: /이산로그/,
    visualLabel: '3의 거듭제곱을 17로 나눈 순환',
    expectsKatex: true,
  },
  {
    slug: 'open-image-video-models',
    path: '/lab/blog/ai/open-image-video-models',
    heading: /오픈 이미지.*비디오 제작/,
    visualLabel: '2026 이미지와 비디오 모델을 선택하는 네 가지 제작 목표',
    expectsKatex: false,
  },
] as const;

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  for (const article of articles) {
    test(`${article.slug} is readable at ${viewport.name}`, async ({ page }) => {
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
      await expect(page.locator('[data-concept-primer]')).toBeVisible();
      await expect(page.getByLabel(article.visualLabel)).toBeVisible();

      const result = await page.evaluate((label) => {
        const question = document.querySelector('[data-learning-question]');
        const primer = document.querySelector('[data-concept-primer]');
        const visual = document.querySelector(`[aria-label="${label}"]`);
        const visible = (node: HTMLElement) => {
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
        };
        const offenders = Array.from(document.querySelectorAll<HTMLElement>('main *'))
          .filter((node) => visible(node)
            && !node.closest('[data-math-fit]')
            && !node.closest('svg')
            && !node.closest('.sr-only'))
          .flatMap((node) => {
            const box = node.getBoundingClientRect();
            return box.right > document.documentElement.clientWidth + 1 || box.left < -1
              ? [{ tag: node.tagName, text: node.textContent?.trim().slice(0, 80), left: box.left, right: box.right }]
              : [];
          });

        return {
          order: question && primer && visual ? {
            questionBeforePrimer: Boolean(question.compareDocumentPosition(primer) & Node.DOCUMENT_POSITION_FOLLOWING),
            primerBeforeVisual: Boolean(primer.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING),
          } : null,
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          offenders,
          rawLatex: /\\(?:underbrace|overbrace|frac|gamma|theta|sqrt|text\{|begin\{)/.test(document.body.innerText),
          katexCount: document.querySelectorAll('.katex').length,
          formulaScales: Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'))
            .map((node) => Number(node.dataset.mathScale ?? 1)),
          formulaOverflow: Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'))
            .map((node) => (node.firstElementChild?.getBoundingClientRect().width ?? 0) - node.clientWidth),
          visibleTables: Array.from(document.querySelectorAll<HTMLElement>('table')).filter(visible).length,
        };
      }, article.visualLabel);

      expect(result.order).toEqual({ questionBeforePrimer: true, primerBeforeVisual: true });
      expect(result.documentOverflow).toBeLessThanOrEqual(1);
      expect(result.offenders).toEqual([]);
      expect(result.rawLatex).toBe(false);
      expect(result.formulaOverflow.every((amount) => amount <= 1)).toBe(true);
      expect(result.formulaScales.every((scale) => scale >= 0.7)).toBe(true);
      if (article.expectsKatex) expect(result.katexCount).toBeGreaterThan(0);
      if (viewport.width < 1024) expect(result.visibleTables).toBe(0);
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);

      if (viewport.name !== 'tablet') {
        await page.screenshot({
          path: `test-results/learning-final-four-${article.slug}-${viewport.name}.png`,
          fullPage: true,
        });
      }
    });
  }
}
