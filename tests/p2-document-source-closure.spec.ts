import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
test.setTimeout(90_000);

test('Document AI track and current-first route expose Donut as the canonical source', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-ocr`, { waitUntil: 'networkidle' });

  const route = page.locator('[data-topdown-research-route="document-ai"]');
  const canonical = route.locator('[data-route-stage="evidence"] article').last();
  await expect(canonical.getByRole('link', { name: /내부 해설 읽기/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/paper-donut-2021?track=document-ai',
  );

  await page.goto(`${base}/lab/blog/ai/ocr-document-ai-map`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: /Donut \(2021\)/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/paper-donut-2021',
  );
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Donut source reconstruction stays readable and interactive at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/paper-donut-2021`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-donut-pipeline-lab]')).toBeVisible();
    await expect(page.locator('[data-donut-sequence-lab]')).toBeVisible();
    await expect(page.locator('[data-donut-evidence-lab]')).toBeVisible();

    await page.getByRole('tab', { name: 'Donut', exact: true }).click();
    await expect(page.locator('[data-donut-pipeline-lab]')).toContainText('외부 OCR 출력은 추론 입력이 아니다');

    await page.getByLabel('END token 누락').check();
    await expect(page.locator('[data-donut-sequence-lab]')).toContainText('field lost');
    await page.locator('[data-donut-sequence-lab]').getByRole('tab', { name: 'DocVQA', exact: true }).click();
    await expect(page.locator('[data-donut-sequence-lab]')).toContainText('Q: 승객 이름은?');

    await page.locator('[data-donut-evidence-lab]').getByRole('tab', { name: 'DocVQA', exact: true }).click();
    await expect(page.locator('[data-donut-evidence-lab]')).toContainText('전체 ANLS 78.1');
    await expect(page.locator('[data-donut-evidence-lab]')).toContainText('전체 67.5 · 필기 72.1');

    await assertSourceContracts(
      page,
      '[data-donut-pipeline-lab], [data-donut-sequence-lab], [data-donut-evidence-lab]',
    );
  });
}

async function assertSourceContracts(page: Page, labSelector: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);

  const audit = await page.evaluate((selector) => {
    const formulaHosts = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
    const visibleFormulaOverflows = formulaHosts.filter((host) => {
      const visibleMath = host.querySelector<HTMLElement>('.katex-html');
      if (!visibleMath) return true;
      const hostRect = host.getBoundingClientRect();
      const mathRect = visibleMath.getBoundingClientRect();
      return mathRect.left < hostRect.left - 1 || mathRect.right > hostRect.right + 1;
    }).length;
    const labText = Array.from(document.querySelectorAll<HTMLElement>(
      `${selector} p, ${selector} span, ${selector} strong, ${selector} button, ${selector} label`,
    ));

    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      visibleFormulaOverflows,
      minFormulaScale: formulaHosts.length
        ? Math.min(...formulaHosts.map((host) => Number(host.dataset.mathScale ?? '1')))
        : 1,
      minFormulaFont: formulaHosts.length
        ? Math.min(...formulaHosts.map((host) => Number.parseFloat(
          getComputedStyle(host.querySelector('.katex') as Element).fontSize,
        )))
        : 12,
      smallestLabText: labText.length
        ? Math.min(...labText.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)))
        : 12,
      rawLatex: /\\(?:theta|underbrace|operatorname|begin\{aligned\}|mathcal)/.test(document.body.innerText),
      katexErrors: document.querySelectorAll('.katex-error').length,
    };
  }, labSelector);

  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(audit.visibleFormulaOverflows).toBe(0);
  expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.7);
  expect(audit.minFormulaFont).toBeGreaterThanOrEqual(12);
  expect(audit.smallestLabText).toBeGreaterThanOrEqual(12);
  expect(audit.rawLatex).toBe(false);
  expect(audit.katexErrors).toBe(0);
}
