import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';

async function auditFoundationWidth(page: Page) {
  return page.evaluate(() => {
    const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
    const explicitOverflowContainers = Array.from(
      document.querySelectorAll<HTMLElement>('.overflow-x-auto'),
    );

    return {
      documentOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      formulaOverflow: formulas.flatMap((formula) => {
        const rendered = formula.firstElementChild as HTMLElement | null;
        if (!rendered) return [];
        const amount = rendered.getBoundingClientRect().width - formula.clientWidth;
        return amount > 1 ? [{ amount, source: formula.dataset.mathSource }] : [];
      }),
      escapedOverflowContainers: explicitOverflowContainers.flatMap((container) => {
        const rect = container.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1
          ? [{ right: rect.right, viewport: document.documentElement.clientWidth }]
          : [];
      }),
    };
  });
}

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]) {
  test(`foundation math and explicit overflow stay inside the document at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const slug of [
      'robot-dynamics-feedback-control',
      'transformer-architecture',
    ]) {
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('[data-math-fit]').first()).toBeVisible();

      const audit = await auditFoundationWidth(page);
      expect(audit.documentOverflow, slug).toBeLessThanOrEqual(1);
      expect(audit.formulaOverflow, slug).toEqual([]);
      expect(audit.escapedOverflowContainers, slug).toEqual([]);
    }
  });
}
