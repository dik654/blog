import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
test.setTimeout(90_000);

test('Time-series route exposes DeepAR as the canonical source', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-timeseries-forecast`, { waitUntil: 'networkidle' });

  const route = page.locator('[data-topdown-research-route="time-series"]');
  const canonical = route.locator('[data-route-stage="evidence"] article').last();
  await expect(canonical.getByRole('link', { name: /내부 해설 읽기/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/paper-deepar-2017?track=time-series',
  );
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`DeepAR source reconstruction stays readable and interactive at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/paper-deepar-2017`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-deepar-global-lab]')).toBeVisible();
    await expect(page.locator('[data-deepar-trace-lab]')).toBeVisible();
    await expect(page.locator('[data-deepar-scale-lab]')).toBeVisible();
    await expect(page.locator('[data-deepar-evidence-lab]')).toBeVisible();

    const globalLab = page.locator('[data-deepar-global-lab]');
    const highVelocityTab = globalLab.getByRole('tab', { name: '고판매 상품', exact: true });
    await highVelocityTab.click();
    await expect(globalLab).toContainText('νᵢ로 수치 범위');
    await expect(highVelocityTab).toHaveAttribute('aria-controls', 'deepar-series-panel');
    await highVelocityTab.press('Home');
    await expect(globalLab.getByRole('tab', { name: '신상품', exact: true })).toBeFocused();
    await expect(globalLab.getByRole('tab', { name: '신상품', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(globalLab.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'deepar-series-tab-new');

    await page.locator('[data-deepar-trace-lab]').getByRole('tab', { name: '예측', exact: true }).click();
    await page.locator('[data-deepar-trace-lab]').getByRole('button', { name: 't+3', exact: true }).click();
    await expect(page.locator('[data-deepar-trace-lab]')).toContainText('직전 step에서 뽑은');

    await page.locator('[data-deepar-scale-lab]').getByRole('tab', { name: '저판매', exact: true }).click();
    await expect(page.locator('[data-deepar-scale-lab]')).toContainText('νᵢ = 1 + 평균 = 2');

    await page.locator('[data-deepar-evidence-lab]').getByRole('tab', { name: 'Path 상관', exact: true }).click();
    await expect(page.locator('[data-deepar-evidence-lab]')).toContainText('0.9-risk가 10% 높아졌다');
    await page.locator('[data-deepar-evidence-lab]').getByRole('tab', { name: '결측값', exact: true }).click();
    await expect(page.locator('[data-deepar-evidence-lab]')).toContainText('실험 결과 없음');

    await assertSourceContracts(
      page,
      '[data-deepar-global-lab], [data-deepar-trace-lab], [data-deepar-scale-lab], [data-deepar-evidence-lab]',
    );
  });
}

async function assertSourceContracts(page: Page, labSelector: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);

  const audit = await page.evaluate((selector) => {
    const formulaHosts = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
    const labRoots = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const tabs = labRoots.flatMap((root) => Array.from(
      root.querySelectorAll<HTMLElement>('[role="tab"]'),
    ));
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
      smallestTabTarget: Math.min(...tabs.map((tab) => tab.getBoundingClientRect().height)),
      tabsWithoutRovingIndex: tabs.filter((tab) =>
        !['0', '-1'].includes(tab.getAttribute('tabindex') ?? '')).length,
      tabsWithoutControls: tabs.filter((tab) => !tab.getAttribute('aria-controls')).length,
      rawLatex: /\\(?:theta|underbrace|operatorname|begin\{aligned\}|mathcal)/.test(document.body.innerText),
      katexErrors: document.querySelectorAll('.katex-error').length,
    };
  }, labSelector);

  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(audit.visibleFormulaOverflows).toBe(0);
  expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.7);
  expect(audit.minFormulaFont).toBeGreaterThanOrEqual(12);
  expect(audit.smallestLabText).toBeGreaterThanOrEqual(12);
  expect(audit.smallestTabTarget).toBeGreaterThanOrEqual(44);
  expect(audit.tabsWithoutRovingIndex).toBe(0);
  expect(audit.tabsWithoutControls).toBe(0);
  expect(audit.rawLatex).toBe(false);
  expect(audit.katexErrors).toBe(0);
}
