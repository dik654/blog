import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const pages = [
  { slug: 'robot-drive-energy-braking-safety', formulas: 25, notes: 25, labs: 10 },
  { slug: 'reference-abb-electrical-braking-2018', formulas: 8, notes: 8, labs: 2 },
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const article of pages) {
  for (const viewport of viewports) {
    test(`${article.slug} ${viewport.name} keeps formulas and visual evidence inside the reading surface`, async ({ page }) => {
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
          return !intentionalGeometry && !hidden && outside
            ? [{ tag: element.tagName, text: (element.textContent ?? '').trim().slice(0, 80), left: rect.left, right: rect.right, viewportWidth }]
            : [];
        });
        const innerScroll = Array.from(document.querySelectorAll<HTMLElement>('.foundation-viz-explorer *')).flatMap((element) => {
          const style = getComputedStyle(element);
          return /(auto|scroll)/.test(style.overflowX + style.overflowY)
            ? [{ tag: element.tagName, className: element.className.toString() }]
            : [];
        });
        const annotationFailures = formulas.flatMap((formula) => {
          const text = formula.textContent ?? '';
          return !/[가-힣]/.test(text) || formula.dataset.mathAnnotationMissing === 'true'
            ? [{ source: formula.dataset.mathSource?.slice(0, 80), text: text.slice(0, 80) }]
            : [];
        });
        const sourceAnnotationFailures = formulas.flatMap((formula) => {
          const source = formula.dataset.mathSource ?? '';
          const labels = Array.from(source.matchAll(/\\text\{([^}]*)\}/g), (match) => match[1]);
          return labels.filter((label) => !/[가-힣]/.test(label)).map((label) => ({ source: source.slice(0, 80), label }));
        });
        const formulaOverflow = formulas.flatMap((formula) => {
          const rendered = formula.firstElementChild as HTMLElement | null;
          if (!rendered) return [];
          const dx = rendered.getBoundingClientRect().width - formula.clientWidth;
          return dx > 2 ? [{ source: formula.dataset.mathSource?.slice(0, 80), dx }] : [];
        });
        const svgLabelOverflow = Array.from(document.querySelectorAll<SVGTextElement>('.foundation-viz-explorer svg text')).flatMap((label) => {
          const svg = label.ownerSVGElement;
          const box = label.getBBox();
          const viewBox = svg?.viewBox.baseVal;
          if (!viewBox) return [];
          const outside = box.x < viewBox.x - 1 || box.y < viewBox.y - 1 || box.x + box.width > viewBox.x + viewBox.width + 1 || box.y + box.height > viewBox.y + viewBox.height + 1;
          return outside ? [{ text: label.textContent, box: { x: box.x, y: box.y, width: box.width, height: box.height }, viewBox: { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height } }] : [];
        });
        const visibleClone = document.querySelector('article')?.cloneNode(true) as HTMLElement | undefined;
        visibleClone?.querySelectorAll('.katex-mathml').forEach((hiddenMath) => hiddenMath.remove());
        const rawLatex = (visibleClone?.textContent ?? '').match(/\\(?:theta|Delta|partial|underbrace|frac|omega|approx)\b/g) ?? [];
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
          svgLabelOverflow,
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
      expect(audit.svgLabelOverflow).toEqual([]);
      expect(audit.rawLatex).toEqual([]);
      expect(audit.minScale).toBeGreaterThanOrEqual(viewport.width === 360 ? 0.75 : viewport.width === 390 ? 0.85 : 0.99);
      expect(errors).toEqual([]);
    });
  }
}

test('all ten braking labs and the ABB evidence selector change visible state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/robot-drive-energy-braking-safety`, { waitUntil: 'networkidle' });
  const labs = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'ENERGY LAB' });
  await expect(labs).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    const lab = labs.nth(index);
    const before = await lab.innerText();
    const range = lab.locator('input[type="range"]').first();
    if (await range.count()) {
      await range.focus();
      await range.press('ArrowRight');
    } else {
      await lab.locator('button').last().click();
    }
    await expect.poll(async () => lab.innerText()).not.toBe(before);
  }

  await page.goto(`${base}/lab/blog/ai/reference-abb-electrical-braking-2018`, { waitUntil: 'networkidle' });
  const reference = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'ABB GUIDE LAB' });
  await expect(reference).toHaveCount(1);
  const before = await reference.innerText();
  await reference.getByRole('button', { name: 'Alternatives' }).first().click();
  await expect.poll(async () => reference.innerText()).not.toBe(before);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`robotics curriculum keeps the braking concept visible and its source opt-in on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-robotics-actuation-power`, { waitUntil: 'networkidle' });
    await expect(page.locator('a[href="/lab/blog/ai/robot-drive-energy-braking-safety"]').first()).toBeVisible();
    const source = page.locator('a[href="/lab/blog/ai/reference-abb-electrical-braking-2018"]').first();
    await expect(source).toBeHidden();
    await page.locator('details').filter({ hasText: '선택 원문 근거' }).first().locator('summary').click();
    await expect(source).toBeVisible();
  });
}

test('power electronics, braking, and ABB form a navigable source-aware sequence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-power-electronics-motor-driver`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-drive-energy-braking-safety"]').first()).toBeVisible();

  await page.goto(`${base}/lab/blog/ai/robot-drive-energy-braking-safety`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/reference-abb-electrical-braking-2018"]').first()).toBeVisible();
});
