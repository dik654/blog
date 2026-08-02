import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`one training-step ledger preserves values and layout on ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/foundation-training-step`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const ledger = page.locator('[data-foundation-training-ledger="true"]');
    await expect(ledger).toBeVisible();
    await expect(ledger).toHaveAttribute('data-training-stage', 'input');
    await expect(ledger).toHaveAttribute('data-training-loss-before', '0.644397');
    await expect(ledger).toHaveAttribute('data-training-loss-after', '0.519057');

    const inputTab = ledger.getByRole('tab', { name: /01 입력 고정/ });
    const forwardTab = ledger.getByRole('tab', { name: /02 순전파/ });
    const verifyTab = ledger.getByRole('tab', { name: /06 재검산/ });
    await inputTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(forwardTab).toBeFocused();
    await expect(ledger).toHaveAttribute('data-training-stage', 'forward');
    await page.keyboard.press('End');
    await expect(verifyTab).toBeFocused();
    await page.keyboard.press('Home');
    await expect(inputTab).toBeFocused();

    await ledger.getByRole('tab', { name: /04 역전파/ }).click();
    await expect(ledger).toHaveAttribute('data-training-stage', 'backward');
    await expect(ledger.getByText('∇w=[-0.475021, -0.950042]', { exact: false })).toBeVisible();

    const slider = ledger.getByRole('slider', { name: /학습률 η/ });
    await slider.evaluate((element) => {
      const input = element as HTMLInputElement;
      input.value = '0.20';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(ledger).toHaveAttribute('data-training-loss-after', '0.413232');
    await ledger.getByRole('tab', { name: /06 재검산/ }).click();
    await expect(ledger.locator('p').filter({ hasText: 'L′=0.413232' }).first()).toBeVisible();

    const audit = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const formulaOverflow = formulas.flatMap((formula) => {
        const rendered = formula.firstElementChild as HTMLElement | null;
        if (!rendered) return [];
        const amount = rendered.getBoundingClientRect().width - formula.clientWidth;
        return amount > 1 ? [{ amount, source: formula.dataset.mathSource?.slice(0, 120) }] : [];
      });
      const interactive = document.querySelector<HTMLElement>('[data-foundation-training-ledger="true"]');
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ledgerOverflow: interactive ? interactive.scrollWidth - interactive.clientWidth : -1,
        formulaOverflow,
        minFormulaScale: Math.min(...formulas.map((formula) => Number(formula.dataset.mathScale ?? 1))),
        formulaCount: formulas.length,
        formulaNoteCount: document.querySelectorAll('[data-formula-note]').length,
      };
    });

    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.ledgerOverflow).toBeLessThanOrEqual(1);
    expect(audit.formulaOverflow).toEqual([]);
    expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.7);
    expect(audit.formulaCount).toBeGreaterThanOrEqual(7);
    expect(audit.formulaNoteCount).toBeGreaterThanOrEqual(7);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}
