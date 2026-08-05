import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const articles = [
  { slug: 'robot-actuator-mechanics-transmission-holding-brake', formulas: 21, notes: 21, labs: 12 },
  { slug: 'reference-harmonic-drive-mechatronics-2026', formulas: 7, notes: 7, labs: 1 },
  { slug: 'paper-williamson-series-elastic-actuators-1995', formulas: 6, notes: 6, labs: 2 },
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const article of articles) {
  for (const viewport of viewports) {
    test(`${article.slug} ${viewport.name} keeps formulas, labels and labs inside the reading width`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('article')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(180);

      const audit = await page.evaluate(() => {
        const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
        const notes = Array.from(document.querySelectorAll<HTMLElement>('[data-formula-note]'));
        const viewportWidth = document.documentElement.clientWidth;
        const materialOverflow = Array.from(document.querySelectorAll<HTMLElement>('article *')).flatMap((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const hidden = rect.width < 3 || rect.height < 3 || style.display === 'none' || style.visibility === 'hidden';
          const intentionalGeometry = Boolean(element.closest('.katex, svg, [data-math-fit]'));
          const outside = rect.left < -2 || rect.right > viewportWidth + 2;
          return !intentionalGeometry && !hidden && outside ? [{ tag: element.tagName, text: (element.textContent ?? '').trim().slice(0, 90), left: rect.left, right: rect.right, viewportWidth }] : [];
        });
        const innerScroll = Array.from(document.querySelectorAll<HTMLElement>('.foundation-viz-explorer *')).flatMap((element) => {
          const style = getComputedStyle(element);
          return /(auto|scroll)/.test(style.overflowX + style.overflowY) ? [{ tag: element.tagName, className: element.className.toString() }] : [];
        });
        const annotationFailures = formulas.flatMap((formula) => {
          const text = formula.textContent ?? '';
          return !/[가-힣]/.test(text) || formula.dataset.mathAnnotationMissing === 'true' ? [{ source: formula.dataset.mathSource?.slice(0, 100), text: text.slice(0, 100) }] : [];
        });
        const sourceAnnotationFailures = formulas.flatMap((formula) => {
          const source = formula.dataset.mathSource ?? '';
          const labels = Array.from(source.matchAll(/\\text\{([^}]*)\}/g), (match) => match[1]);
          return labels.filter((label) => !/[가-힣]/.test(label)).map((label) => ({ source: source.slice(0, 100), label }));
        });
        const formulaOverflow = formulas.flatMap((formula) => {
          const rendered = formula.firstElementChild as HTMLElement | null;
          if (!rendered) return [];
          const dx = rendered.getBoundingClientRect().width - formula.clientWidth;
          return dx > 2 ? [{ source: formula.dataset.mathSource?.slice(0, 100), dx }] : [];
        });
        const visibleClone = document.querySelector('article')?.cloneNode(true) as HTMLElement | undefined;
        visibleClone?.querySelectorAll('.katex-mathml').forEach((hiddenMath) => hiddenMath.remove());
        const rawLatex = (visibleClone?.textContent ?? '').match(/\\(?:theta|omega|tau|Delta|partial|underbrace|frac|lambda|varphi|mathrm|approx)\b/g) ?? [];
        const scales = formulas.map((formula) => Number(formula.dataset.mathScale ?? 1));
        return {
          formulaCount: formulas.length,
          noteCount: notes.length,
          labCount: document.querySelectorAll('.foundation-viz-explorer').length,
          materialOverflow,
          innerScroll,
          annotationFailures,
          sourceAnnotationFailures,
          formulaOverflow,
          rawLatex,
          minScale: Math.min(...scales),
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(audit.formulaCount).toBe(article.formulas);
      expect(audit.noteCount).toBe(article.notes);
      expect(audit.labCount).toBe(article.labs);
      expect(audit.materialOverflow).toEqual([]);
      expect(audit.innerScroll).toEqual([]);
      expect(audit.annotationFailures).toEqual([]);
      expect(audit.sourceAnnotationFailures).toEqual([]);
      expect(audit.formulaOverflow).toEqual([]);
      expect(audit.rawLatex).toEqual([]);
      expect(audit.documentOverflow).toBeLessThanOrEqual(1);
      expect(audit.minScale).toBeGreaterThanOrEqual(viewport.width === 360 ? 0.7 : viewport.width === 390 ? 0.78 : 0.99);
      expect(errors).toEqual([]);
    });
  }
}

test('all twelve joint labs expose a causal state change', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/robot-actuator-mechanics-transmission-holding-brake`, { waitUntil: 'networkidle' });
  const labs = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'JOINT LAB' });
  await expect(labs).toHaveCount(12);
  for (let index = 0; index < 12; index += 1) {
    const lab = labs.nth(index);
    const before = await lab.innerText();
    const range = lab.locator('input[type="range"]').first();
    if (await range.count()) {
      await range.focus();
      await range.press('ArrowRight');
    } else {
      await lab.locator('button').last().evaluate((button) => (button as HTMLButtonElement).click());
    }
    await expect.poll(async () => lab.innerText()).not.toBe(before);
  }
});

test('catalog and thesis explorers preserve source-specific states', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/reference-harmonic-drive-mechatronics-2026`, { waitUntil: 'networkidle' });
  const catalog = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'SOURCE EXPLORER' });
  await expect(catalog).toHaveCount(1);
  for (const [label, expected] of [
    ['Selection', 'PDF pp. 158–159'],
    ['Duty / life', 'PDF p. 159'],
    ['Stiffness', 'PDF pp. 160–161'],
    ['Accuracy', 'PDF pp. 166–167'],
    ['Bearing', 'Output bearing'],
    ['Brake / feedback', 'holding/fail-safe'],
    ['Disclaimer', '1053524 · 05/2026'],
  ] as const) {
    await catalog.getByRole('button', { name: label, exact: true }).evaluate((button) => (button as HTMLButtonElement).click());
    await expect(catalog).toContainText(expected);
  }

  await page.goto(`${base}/lab/blog/ai/paper-williamson-series-elastic-actuators-1995`, { waitUntil: 'networkidle' });
  const sea = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'SEA RECONSTRUCTION' });
  await expect(sea).toHaveCount(1);
  for (const label of ['Ideal clamped', 'Hard contact', 'Soft contact', 'Moving output']) {
    await sea.getByRole('button', { name: label, exact: true }).evaluate((button) => (button as HTMLButtonElement).click());
    await expect(sea.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  const evidence = page.getByRole('group', { name: 'Paper evidence slice' });
  for (const label of ['이상 모델', '성능 한계', '식별 불일치', '과한 feedforward', 'Contact 실험', '저자의 한계']) {
    await evidence.getByRole('button', { name: label, exact: true }).evaluate((button) => (button as HTMLButtonElement).click());
    await expect(evidence.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`robotics listing keeps actuator sources opt-in at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-robotics-actuation-power`, { waitUntil: 'networkidle' });
    const details = page.locator('details').filter({ hasText: '선택 원문 근거' }).first();
    await expect(page.locator(`a[href="/lab/blog/ai/${articles[0].slug}"]`).first()).toBeVisible();
    for (const slug of articles.slice(1).map((article) => article.slug)) {
      await expect(page.locator(`a[href="/lab/blog/ai/${slug}"]`).first()).toBeHidden();
    }
    await details.locator('summary').click();
    for (const slug of articles.slice(1).map((article) => article.slug)) {
      await expect(page.locator(`a[href="/lab/blog/ai/${slug}"]`).first()).toBeVisible();
    }
  });
}

test('isolation, actuator concept, catalog and thesis form a navigable evidence chain', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-drive-isolation-emc-functional-safety`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-actuator-mechanics-transmission-holding-brake"]').first()).toBeVisible();
  await page.goto(`${base}/lab/blog/ai/robot-actuator-mechanics-transmission-holding-brake`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/reference-harmonic-drive-mechatronics-2026"]').first()).toBeVisible();
  await expect(page.locator('a[href="/lab/blog/ai/paper-williamson-series-elastic-actuators-1995"]').first()).toBeVisible();
  await page.goto(`${base}/lab/blog/ai/reference-harmonic-drive-mechatronics-2026`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-actuator-mechanics-transmission-holding-brake"]').first()).toBeVisible();
  await expect(page.locator('a[href="/lab/blog/ai/paper-williamson-series-elastic-actuators-1995"]').first()).toBeVisible();
});
