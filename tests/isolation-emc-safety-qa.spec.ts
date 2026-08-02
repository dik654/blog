import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const articles = [
  { slug: 'robot-drive-isolation-emc-functional-safety', formulas: 16, notes: 16, labs: 10 },
  { slug: 'reference-ti-tida-01599-sto-2022', formulas: 6, notes: 6, labs: 2 },
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const article of articles) {
  for (const viewport of viewports) {
    test(`${article.slug} ${viewport.name} preserves readable formulas and bounded visual evidence`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('article')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);

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
        const rawLatex = (visibleClone?.textContent ?? '').match(/\\(?:theta|Delta|partial|underbrace|frac|lambda|mathrm|approx)\b/g) ?? [];
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
      expect(audit.minScale).toBeGreaterThanOrEqual(viewport.width === 360 ? 0.72 : viewport.width === 390 ? 0.8 : 0.99);
      expect(errors).toEqual([]);
    });
  }
}

test('all ten safety labs and all six TIDA evidence views expose causal state changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/robot-drive-isolation-emc-functional-safety`, { waitUntil: 'networkidle' });
  const labs = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'SAFETY LAB' });
  await expect(labs).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    const lab = labs.nth(index);
    const before = await lab.innerText();
    const range = lab.locator('input[type="range"]').first();
    if (await range.count()) {
      await range.focus();
      await range.press('ArrowRight');
    } else {
      await lab.locator('button:not([aria-label="시각화 전체화면으로 보기"])').last().click();
    }
    await expect.poll(async () => lab.innerText()).not.toBe(before);
  }

  await page.goto(`${base}/lab/blog/ai/reference-ti-tida-01599-sto-2022`, { waitUntil: 'networkidle' });
  const reference = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'TIDA-01599 LAB' });
  await expect(reference).toHaveCount(1);
  for (const label of ['Architecture', 'Assumptions', 'Diagnostics', 'Timing', 'Revision', 'TÜV scope']) {
    await reference.getByRole('button', { name: label, exact: true }).click();
    await expect(reference).toContainText(label === 'TÜV scope' ? 'CONCEPT, NOT MACHINE CERT' : label === 'Revision' ? 'REVISION PROVENANCE ON' : label === 'Timing' ? 'BOARD-SPECIFIC OBSERVATION' : label === 'Diagnostics' ? 'HFT1 BOUNDARY VISIBLE' : label === 'Assumptions' ? 'ASSUMPTIONS EXPOSED' : 'FUNCTIONAL ARCHITECTURE');
  }
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`robotics listing exposes isolation while keeping TIDA opt-in at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-robotics-actuation-power`, { waitUntil: 'networkidle' });
    await expect(page.locator('a[href="/lab/blog/ai/robot-drive-isolation-emc-functional-safety"]').first()).toBeVisible();
    const source = page.locator('a[href="/lab/blog/ai/reference-ti-tida-01599-sto-2022"]').first();
    await expect(source).toBeHidden();
    await page.locator('details').filter({ hasText: '선택 원문 근거' }).first().locator('summary').click();
    await expect(source).toBeVisible();
  });
}

test('braking, isolation and company evidence form a navigable sequence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-drive-energy-braking-safety`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-drive-isolation-emc-functional-safety"]').first()).toBeVisible();
  await page.goto(`${base}/lab/blog/ai/robot-drive-isolation-emc-functional-safety`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-drive-energy-braking-safety"]').first()).toBeVisible();
  await expect(page.locator('a[href="/lab/blog/ai/reference-ti-tida-01599-sto-2022"]').first()).toBeVisible();
});
