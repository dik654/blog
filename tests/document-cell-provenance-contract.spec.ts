import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]) {
  test(`document table cells retain source evidence at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/html-table-structure-reconstruction`, {
      waitUntil: 'domcontentloaded',
    });
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole('heading', {
      name: '논리 slot과 원본 pixel은 같은 좌표가 아니다',
    })).toBeVisible();
    await expect(page.getByText(/origin_cell_id.*source_bbox.*crop_ref/).first()).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);

    const ledger = page.locator('[data-cell-evidence-ledger]');
    await expect(ledger).toContainText('cell:p48:r1:c1');
    await expect(ledger).toContainText('page 48');
    await expect(ledger).toContainText('crop://report/p48/cell-r1-c1');

    await page.getByRole('button', { name: 'slot 충돌' }).click();
    await expect(ledger).toContainText('cell:p48:r1:c0');
    await expect(ledger).toContainText('[88, 146, 184, 192]');

    const tableAudit = await page.evaluate(() => ({
      documentOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ledgerOverflow: (() => {
        const element = document.querySelector<HTMLElement>('[data-cell-evidence-ledger]');
        return element ? element.scrollWidth - element.clientWidth : 999;
      })(),
      rawLatex: /\\(?:underbrace|mathrm|text)/.test(document.body.innerText),
    }));
    expect(tableAudit.documentOverflow).toBeLessThanOrEqual(1);
    expect(tableAudit.ledgerOverflow).toBeLessThanOrEqual(1);
    expect(tableAudit.rawLatex).toBe(false);

    await page.goto(`${base}/lab/blog/ai/document-structure-assembly`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByText(/origin_cell_id \+ source_bbox \+ crop_ref/)).toBeVisible();

    await page.goto(`${base}/lab/blog/ai/ocr-runtime-evaluation`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByText(/실패 receipt에는/)).toBeVisible();
    await expect(page.getByText(/문제 cell의 원본 영역을 바로 열 수 있게 한다/)).toBeVisible();
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )).toBeLessThanOrEqual(1);
  });
}
