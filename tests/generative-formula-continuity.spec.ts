import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4178';
const articles = [
  ['stable-diffusion-open-models', 10],
  ['illustrious-xl', 5],
  ['open-model-workflow-parameters', 5],
  ['open-model-finetuning-theory', 4],
  ['image-model-runtime', 6],
  ['video-model-runtime', 7],
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const [slug, expectedFormulaCount] of articles) {
    test(`${slug} keeps formulas readable and connected on ${viewport.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.katex-display')).toHaveCount(expectedFormulaCount);
      await expect(page.locator('[data-formula-note]')).toHaveCount(expectedFormulaCount);
      await expect(page.locator('[data-learning-continuity]')).toBeVisible();

      const audit = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        rawLatex: /\\(?:theta|tau|frac|sum|prod|dot|ddot)\b/.test(document.body.innerText),
        minFormulaScale: Math.min(...Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'))
          .map((element) => Number(element.dataset.mathScale ?? 1))),
        hangulFonts: Array.from(document.querySelectorAll<HTMLElement>('.katex-display .hangul_fallback'))
          .map((element) => getComputedStyle(element).fontFamily),
      }));
      expect(audit.overflow).toBeLessThanOrEqual(1);
      expect(audit.rawLatex).toBe(false);
      expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.8);
      expect(audit.hangulFonts.length).toBeGreaterThan(0);
      expect(audit.hangulFonts.every((font) => !font.startsWith('KaTeX_Main'))).toBe(true);
      expect(consoleErrors).toEqual([]);
    });
  }
}
