import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

for (const slug of ['transformer-architecture', 'bert'] as const) {
  test(`${slug} remains readable at the tablet breakpoint`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);

    const audit = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        formulaOverflow: formulas.filter((formula) => {
          const rendered = formula.firstElementChild as HTMLElement | null;
          return rendered && rendered.getBoundingClientRect().width - formula.clientWidth > 1;
        }).length,
        minFormulaScale: Math.min(...formulas.map((formula) => Number(formula.dataset.mathScale ?? 1))),
      };
    });

    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.formulaOverflow).toBe(0);
    expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.8);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}

test('Transformer examples preserve position, shape, mask, and KV-cache contracts', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/transformer-architecture`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);

  await page.getByRole('button', { name: 'Position 더함' }).click();
  await expect(page.locator('body')).toContainText('E(개가)+P0 ≠ E(개가)+P1');

  await page.locator('#shape-batch').fill('2');
  await page.locator('#shape-token').fill('8');
  await page.locator('#shape-head').selectOption('8');
  await expect(page.locator('body')).toContainText('1024 score cells');
  await expect(page.locator('body')).toContainText(/score elements\s*1,024/);
  await expect(page.locator('body')).toContainText('16,384');

  await page.locator('#mask-row').fill('3');
  await expect(page.locator('body')).toContainText('0…3의 4개 key');
  await expect(page.locator('body')).toContainText('6×6 score cell');

  await page.locator('#kv-batch').fill('2');
  await page.locator('#kv-layers').fill('24');
  await page.locator('#kv-context').fill('4096');
  await page.locator('#kv-heads').selectOption('8');
  await expect(page.locator('body')).toContainText('0.75 GiB');
  await expect(page.locator('body')).toContainText('GQA');
  await expect(page.locator('body')).toContainText(/query per KV group\s*4/);
  await expect(page.locator('body')).toContainText(/cache vs MHA\s*25%/);
});

test('BERT examples preserve MLM, NSP, and sentence-embedding contracts', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/bert`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);

  await expect(page.locator('body')).toContainText('90 / 600');
  const outcomes = page.getByLabel('MLM token outcomes');
  await expect(outcomes).toContainText('72');
  await expect(outcomes).toContainText('9');
  await expect(outcomes).toContainText('510');
  await expect(outcomes).not.toContainText('9.000');
  await expect(page.locator('body')).not.toContainText('1,000개라면');

  const pipeline = page.locator('[data-step-viz]').filter({ has: page.locator('[data-bert-pretraining-step-viz]') });
  await expect(pipeline).toHaveCount(1);
  await pipeline.getByRole('button', { name: '다음 장면' }).click();
  await pipeline.getByRole('button', { name: '다음 장면' }).click();
  await pipeline.getByRole('button', { name: '다음 장면' }).click();
  await expect(pipeline).toContainText('loss mask는 선택 집합을 따른다');

  await page.getByRole('button', { name: '무작위 문장' }).click();
  await expect(page.locator('body')).toContainText('고래는 포유류에 속한다.');
  await expect(page.locator('body')).toContainText('NotNext');
  await expect(page.locator('body')).toContainText('별도 pretraining task');

  await page.getByRole('button', { name: 'Embedding' }).click();
  await expect(page.locator('body')).toContainText('contrastive objective');
  await expect(page.locator('body')).toContainText('cosine distance로 바로 비교하도록 보장된');
});
