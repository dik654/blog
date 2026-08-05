import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const articles = [
  { slug: 'robot-structural-mechanics-materials-fatigue-thermal', formulas: 30, notes: 30, labs: 11 },
  { slug: 'research-nasa-preloaded-bolt-load-introduction-2025', formulas: 6, notes: 6, labs: 2 },
  { slug: 'paper-manson-double-linear-fatigue-1967', formulas: 6, notes: 6, labs: 2 },
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const article of articles) {
  for (const viewport of viewports) {
    test(`${article.slug} ${viewport.name} preserves readable formulas and causal labs`, async ({ page }) => {
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
          return !intentionalGeometry && !hidden && outside
            ? [{ tag: element.tagName, text: (element.textContent ?? '').trim().slice(0, 90), left: rect.left, right: rect.right, viewportWidth }]
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
            ? [{ source: formula.dataset.mathSource?.slice(0, 100), text: text.slice(0, 100) }]
            : [];
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
      expect(audit.minScale).toBeGreaterThanOrEqual(viewport.width === 360 ? 0.82 : viewport.width === 390 ? 0.86 : 0.99);
      expect(errors).toEqual([]);
    });
  }
}

test('all eleven structural labs expose a causal state change', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/robot-structural-mechanics-materials-fatigue-thermal`, { waitUntil: 'networkidle' });
  const labs = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'STRUCTURE LAB' });
  await expect(labs).toHaveCount(11);
  for (let index = 0; index < 11; index += 1) {
    const lab = labs.nth(index);
    const before = await lab.innerText();
    const range = lab.locator('input[type="range"]').first();
    if (await range.count()) {
      const current = Number(await range.inputValue());
      const maximum = Number(await range.getAttribute('max'));
      await range.focus();
      await range.press(current < maximum ? 'ArrowRight' : 'ArrowLeft');
    } else {
      await lab.locator('button').last().evaluate((button) => (button as HTMLButtonElement).click());
    }
    await expect.poll(async () => lab.innerText()).not.toBe(before);
  }
});

test('NASA and Manson reconstructions preserve source-specific evidence states', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/research-nasa-preloaded-bolt-load-introduction-2025`, { waitUntil: 'networkidle' });
  const nasa = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'NASA TM 2025' });
  await expect(nasa).toHaveCount(1);
  const nasaBefore = await nasa.innerText();
  await nasa.locator('input[type="range"]').first().press('ArrowRight');
  await expect.poll(async () => nasa.innerText()).not.toBe(nasaBefore);
  const nasaEvidence = page.getByRole('group', { name: 'Paper evidence slice' });
  for (const label of ['유도', 'GLIF 비교', 'FEA 비교', '실험 비교', 'Thermal', '비선형 단서', '저자 결론']) {
    await nasaEvidence.getByRole('button', { name: label, exact: true }).click();
    await expect(nasaEvidence.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }

  await page.goto(`${base}/lab/blog/ai/paper-manson-double-linear-fatigue-1967`, { waitUntil: 'networkidle' });
  const manson = page.locator('figure.foundation-viz-explorer').filter({ hasText: 'NASA TN D-3839' });
  await expect(manson).toHaveCount(1);
  for (const label of ['Conventional linear', 'Double linear', 'High → low', 'Low → high']) {
    await manson.getByRole('button', { name: label, exact: true }).click();
    await expect(manson.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  const mansonEvidence = page.getByRole('group', { name: 'Paper evidence slice' });
  for (const label of ['기준선 실패', '초기 계수', 'Maraging 확장', '4130 steel', 'Phase 재해석', '교대 블록', '저자의 경계']) {
    await mansonEvidence.getByRole('button', { name: label, exact: true }).click();
    await expect(mansonEvidence.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`robotics listing keeps structural sources opt-in at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-robotics-mechanics-qualification`, { waitUntil: 'networkidle' });
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

test('actuator, structural concept and primary sources form a navigable chain', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-actuator-mechanics-transmission-holding-brake`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-structural-mechanics-materials-fatigue-thermal"]').first()).toBeVisible();
  await page.goto(`${base}/lab/blog/ai/robot-structural-mechanics-materials-fatigue-thermal`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/research-nasa-preloaded-bolt-load-introduction-2025"]').first()).toBeVisible();
  await expect(page.locator('a[href="/lab/blog/ai/paper-manson-double-linear-fatigue-1967"]').first()).toBeVisible();
  await page.goto(`${base}/lab/blog/ai/research-nasa-preloaded-bolt-load-introduction-2025`, { waitUntil: 'networkidle' });
  await expect(page.locator('a[href="/lab/blog/ai/robot-structural-mechanics-materials-fatigue-thermal"]').first()).toBeVisible();
});
