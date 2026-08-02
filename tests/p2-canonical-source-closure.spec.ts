import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
test.setTimeout(90_000);

const routeSources = [
  ['ai-llm-interpretability', 'llm-interpretability', '/lab/blog/ai/paper-transformer-circuits-2021'],
  ['ai-open-models', 'open-image-video', '/lab/blog/ai/diffusion-models'],
  ['ai-vision', 'computer-vision', '/lab/blog/ai/deformable-detr'],
] as const;

test('P2 top-down tracks expose the accepted canonical source reconstruction', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [subcategory, trackId, href] of routeSources) {
    await page.goto(`${base}/lab/blog/ai?sub=${subcategory}`, { waitUntil: 'networkidle' });
    const route = page.locator(`[data-topdown-research-route="${trackId}"]`);
    const canonical = route
      .locator('[data-route-stage="evidence"] article')
      .filter({ hasText: '최소 기준점' });
    const actualHref = await canonical.getByRole('link', { name: /내부 해설 읽기/ }).getAttribute('href');
    expect(actualHref).toContain(href);
  }
});

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`P2 source reconstructions remain legible and interactive at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    await page.goto(`${base}/lab/blog/ai/paper-transformer-circuits-2021`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-transformer-circuit-virtual]')).toBeVisible();
    await expect(page.locator('[data-transformer-circuit-qkov]')).toBeVisible();
    await expect(page.locator('[data-transformer-circuit-induction]')).toBeVisible();
    const circuitControls = await page.locator(
      '[data-transformer-circuit-virtual] button, [data-transformer-circuit-qkov] button, [data-transformer-circuit-induction] button',
    ).evaluateAll((controls) => controls.map((control) => {
      const box = control.getBoundingClientRect();
      return { width: box.width, height: box.height };
    }));
    expect(circuitControls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();
    await page.getByRole('button', { name: '문장 역할', exact: true }).click();
    await expect(page.locator('[data-transformer-circuit-virtual]')).toContainText('행렬곱에서 계산');
    await expect(page.locator('[data-transformer-circuit-virtual]')).toContainText('C = W_I W_O');
    await page.getByRole('button', { name: 'OV · 무엇', exact: true }).click();
    await expect(page.locator('[data-transformer-circuit-qkov]')).toContainText('B logit +1.7');
    await page.getByRole('button', { name: /03.*\[X\]/ }).click();
    await expect(page.locator('[data-transformer-circuit-qkov]')).toContainText('attention 0.38 × OV 0.02 = 0.008');
    await page.getByRole('button', { name: '4. Induction OV', exact: true }).click();
    await expect(page.locator('[data-transformer-circuit-induction]')).toContainText('다음 token 복사');
    await page.getByRole('button', { name: 'Previous-token head ON', exact: true }).click();
    await expect(page.locator('[data-transformer-circuit-induction]')).toContainText('Previous-token head ablated');
    await expect(page.locator('[data-transformer-circuit-induction]')).toContainText('8%');
    await expect(page.locator('[data-transformer-circuit-induction]')).toContainText('+0.1');
    await assertSourceContracts(page, '[data-transformer-circuit-virtual], [data-transformer-circuit-qkov], [data-transformer-circuit-induction]');

    await page.goto(`${base}/lab/blog/ai/diffusion-models`, { waitUntil: 'networkidle' });
    await expect(page.locator('#training').getByRole('link', { name: '역전파와 최적화 글' }))
      .toHaveAttribute('href', '/lab/blog/ai/backprop-optimization');
    await expect(page.locator('#latent-diffusion-source')).toBeVisible();
    await expect(page.locator('[data-ldm-compression-lab]')).toBeVisible();
    await expect(page.locator('[data-ldm-evidence]')).toContainText('≥ 2.7×');
    await page.getByRole('tab', { name: 'f=16', exact: true }).click();
    await expect(page.locator('[data-ldm-compression-lab]')).toContainText('강한 압축');
    await assertSourceContracts(page, '[data-ldm-compression-lab], [data-ldm-evidence]');

    await page.goto(`${base}/lab/blog/ai/deformable-detr`, { waitUntil: 'networkidle' });
    await expect(page.locator('#detr-source-evidence')).toBeVisible();
    await expect(page.locator('[data-detr-assignment-lab]')).toBeVisible();
    await expect(page.locator('[data-detr-query-pipeline]')).toBeVisible();
    await expect(page.locator('[data-detr-evidence-lab]')).toBeVisible();
    await page.getByRole('tab', { name: '학습 loss', exact: true }).click();
    await expect(page.locator('[data-detr-assignment-lab]')).toContainText('0.1 × [−log p(∅)]');
    await page.getByRole('tab', { name: 'Loss ablation', exact: true }).click();
    await expect(page.locator('[data-detr-evidence-lab]')).toContainText('Class + L1 + GIoU');
    await assertSourceContracts(page, '[data-detr-assignment-lab], [data-detr-query-pipeline], [data-detr-evidence-lab]');
  });
}

test('Transformer circuit controls expose keyboard-operable state changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/paper-transformer-circuits-2021`, { waitUntil: 'networkidle' });

  const induction = page.locator('[data-transformer-circuit-induction]');
  await induction.getByRole('button', { name: /2\. 이전 token head/ }).focus();
  await page.keyboard.press('Enter');
  await expect(induction).toContainText('Key-side shift');

  const ablation = induction.getByRole('button', { name: 'Previous-token head ON', exact: true });
  await ablation.focus();
  await page.keyboard.press('Space');
  await expect(induction).toContainText('Previous-token head ablated');
  await expect(induction).toContainText('8%');
});

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
