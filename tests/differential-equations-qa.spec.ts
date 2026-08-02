import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const slug = 'differential-equations-phase-plane-numerical-integration';
const route = `${base}/lab/blog/ai/${slug}`;
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function setRange(locator: Locator, value: number) {
  await locator.fill(String(value));
}

for (const viewport of viewports) {
  test(`${slug} ${viewport.name} keeps formulas and all eight labs readable`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(240);

    await expect(page.getByRole('heading', { name: '미분방정식과 Phase Plane: 변화 규칙에서 궤적 적분까지' })).toBeVisible();

    const audit = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const notes = Array.from(document.querySelectorAll<HTMLElement>('[data-formula-note]'));
      const labs = Array.from(document.querySelectorAll<HTMLElement>('[data-ode-lab]'));
      const sections = [
        'state-rate-ledger',
        'driven-state',
        'euler-step',
        'error-convergence',
        'stability-stiffness',
        'phase-portrait',
        'two-boundary-envelope',
        'events-tolerance',
        'return-to-upper-questions',
      ].filter((id) => document.getElementById(id));
      const formulaOverflow = formulas.flatMap((formula) => {
        const rendered = formula.firstElementChild as HTMLElement | null;
        if (!rendered) return [];
        const dx = rendered.getBoundingClientRect().width - formula.clientWidth;
        return dx > 2 ? [{ source: formula.dataset.mathSource, dx }] : [];
      });
      const koreanFormulaFailures = formulas.flatMap((formula) => {
        const source = formula.dataset.mathSource ?? '';
        return !source.includes('\\underbrace') || !/[가-힣]/.test(source)
          ? [{ source }]
          : [];
      });
      const visible = document.querySelector('article')?.cloneNode(true) as HTMLElement | undefined;
      visible?.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
      const rawLatex = (visible?.textContent ?? '').match(/\\(?:theta|ddot|dot|underbrace|frac|mathrm|Delta)\b/g) ?? [];
      const expectedPlainLabels = ['autonomous', 'driven', 'stiff', 'IVP / BVP', 'dense output'];
      const plainLabels = Array.from(document.querySelectorAll<HTMLElement>('[data-formula-label]'))
        .map((node) => node.textContent?.trim());
      const missingPlainLabels = expectedPlainLabels.filter((label) => !plainLabels.includes(label));
      const scales = formulas.map((formula) => Number(formula.dataset.mathScale ?? 1));
      const svgTextHeights = labs.flatMap((lab) => Array.from(lab.querySelectorAll<SVGTextElement>('svg text')).map((node) => ({
        text: node.textContent,
        height: node.getBoundingClientRect().height,
      })));
      const tooSmallSvgText = svgTextHeights.filter((item) => item.height < 8.8);
      const overlappingSvgText = labs.flatMap((lab) => {
        const nodes = Array.from(lab.querySelectorAll<SVGTextElement>('svg text'));
        return nodes.flatMap((node, index) => {
          const a = node.getBoundingClientRect();
          return nodes.slice(index + 1).flatMap((other) => {
            const b = other.getBoundingClientRect();
            const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            return overlapX > 1 && overlapY > 1
              ? [{ id: lab.dataset.odeLab, a: node.textContent, b: other.textContent, overlapX, overlapY }]
              : [];
          });
        });
      });
      const controls = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>('button,input[type="range"]')));
      const smallControls = controls.flatMap((control) => {
        const rect = control.getBoundingClientRect();
        return rect.height < 43.5 ? [{ tag: control.tagName, height: rect.height }] : [];
      });
      const figureOverflow = labs.flatMap((lab) => {
        const dx = lab.scrollWidth - lab.clientWidth;
        return dx > 1 ? [{ id: lab.dataset.odeLab, dx }] : [];
      });
      const collapsedCaptions = labs.flatMap((lab) => {
        const copy = lab.querySelector<HTMLElement>('[data-ode-caption-copy]');
        if (!copy) return [{ id: lab.dataset.odeLab, width: 0 }];
        const width = copy.getBoundingClientRect().width;
        return width < 220 ? [{ id: lab.dataset.odeLab, width }] : [];
      });
      return {
        formulas: formulas.length,
        notes: notes.length,
        labs: labs.length,
        sections: sections.length,
        formulaOverflow,
        koreanFormulaFailures,
        rawLatex,
        missingPlainLabels,
        minScale: Math.min(...scales),
        tooSmallSvgText,
        overlappingSvgText,
        smallControls,
        figureOverflow,
        collapsedCaptions,
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(audit.sections).toBe(9);
    expect(audit.formulas).toBe(21);
    expect(audit.notes).toBe(21);
    expect(audit.labs).toBe(8);
    expect(audit.formulaOverflow).toEqual([]);
    expect(audit.koreanFormulaFailures).toEqual([]);
    expect(audit.rawLatex).toEqual([]);
    expect(audit.missingPlainLabels).toEqual([]);
    expect(audit.minScale).toBeGreaterThanOrEqual(0.9);
    expect(audit.tooSmallSvgText).toEqual([]);
    expect(audit.overlappingSvgText).toEqual([]);
    expect(audit.smallControls).toEqual([]);
    expect(audit.figureOverflow).toEqual([]);
    expect(audit.collapsedCaptions).toEqual([]);
    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('rate ledger and driven state change numerical outcomes, not only color', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'networkidle' });

  const ledger = page.locator('[data-ode-lab="rate-ledger"]');
  const ledgerOutput = ledger.locator('output');
  const beforeFinal = await ledgerOutput.getAttribute('data-ode-rate-final');
  await setRange(ledger.locator('input[type="range"]').nth(1), 4.8);
  await expect.poll(() => ledgerOutput.getAttribute('data-ode-rate-final')).not.toBe(beforeFinal);

  const driven = page.locator('[data-ode-lab="driven-state"]');
  const drivenOutput = driven.locator('output');
  const beforeRate = await drivenOutput.getAttribute('data-ode-driven-rate-after');
  await setRange(driven.locator('input[type="range"]').nth(1), 1.2);
  await expect.poll(() => drivenOutput.getAttribute('data-ode-driven-rate-after')).not.toBe(beforeRate);
});

test('Euler and convergence labs expose step-sensitive error', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'networkidle' });

  const euler = page.locator('[data-ode-lab="euler-step"]');
  const eulerOutput = euler.locator('output');
  const beforeError = await eulerOutput.getAttribute('data-ode-euler-error');
  await setRange(euler.locator('input[type="range"]').nth(2), 1.05);
  await expect.poll(() => eulerOutput.getAttribute('data-ode-euler-error')).not.toBe(beforeError);

  const convergence = page.locator('[data-ode-lab="error-convergence"]');
  const convergenceOutput = convergence.locator('output');
  const beforeRatio = await convergenceOutput.getAttribute('data-ode-euler-ratio');
  await setRange(convergence.locator('input[type="range"]'), 0.2);
  await expect.poll(() => convergenceOutput.getAttribute('data-ode-euler-ratio')).not.toBe(beforeRatio);
  expect(Number(await convergenceOutput.getAttribute('data-ode-rk4-ratio'))).toBeGreaterThan(8);
});

test('stability lab crosses from decay to explicit Euler divergence', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-ode-lab="stability-stiffness"]');
  const output = lab.locator('output');
  await expect(output).toHaveAttribute('data-ode-stability', 'stable');
  await setRange(lab.locator('input[type="range"]').nth(0), -40);
  await setRange(lab.locator('input[type="range"]').nth(1), 0.2);
  await expect(output).toHaveAttribute('data-ode-stability', 'unstable');
  expect(Number(await output.getAttribute('data-ode-multiplier'))).toBeLessThan(-1);
  expect(Number(await output.getAttribute('data-ode-slow-multiplier'))).toBeGreaterThan(0);
  expect(Number(await output.getAttribute('data-ode-time-scale-ratio'))).toBe(40);
});

test('phase portrait changes state geometry and dissipated energy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-ode-lab="phase-portrait"]');
  const output = lab.locator('output');
  const beforeQ = await output.getAttribute('data-ode-phase-final-q');
  const beforeEnergy = await output.getAttribute('data-ode-phase-energy-drop');
  await setRange(lab.locator('input[type="range"]').nth(0), 2.4);
  await expect.poll(() => output.getAttribute('data-ode-phase-final-q')).not.toBe(beforeQ);
  await expect.poll(() => output.getAttribute('data-ode-phase-energy-drop')).not.toBe(beforeEnergy);
});

test('speed cap creates two boundary switches and removing it restores one', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-ode-lab="boundary-envelope"]');
  const output = lab.locator('output');
  await expect(output).toHaveAttribute('data-ode-boundary-mode', 'accelerate-cruise-brake');
  await expect(output).toHaveAttribute('data-ode-boundary-switch-count', '2');
  const cappedSwitches = (await output.getAttribute('data-ode-boundary-switches'))?.split(',').map(Number) ?? [];
  expect(cappedSwitches[0]).toBeLessThan(cappedSwitches[1]);

  await setRange(lab.locator('input[type="range"]').nth(2), 4.2);
  await expect(output).toHaveAttribute('data-ode-boundary-mode', 'accelerate-brake');
  await expect(output).toHaveAttribute('data-ode-boundary-switch-count', '1');
});

test('coarse endpoint signs miss two roots that fine sampling exposes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-ode-lab="event-detection"]');
  const output = lab.locator('output');
  await expect(output).toHaveAttribute('data-ode-event-sampling', 'coarse');
  await expect(output).toHaveAttribute('data-ode-event-detected', '0');
  await expect(output).toHaveAttribute('data-ode-event-roots', '0.65,1.35');
  await expect(output).toHaveAttribute('data-ode-event-window', '0.2,1.8');
  await lab.getByRole('button', { name: '촘촘한 h = 0.20' }).click();
  await expect(output).toHaveAttribute('data-ode-event-sampling', 'fine');
  await expect(output).toHaveAttribute('data-ode-event-detected', '2');
});

test('upper articles link down at the first ODE need point', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const upperSlugs = [
    'diffusion-models',
    'robot-contact-tribology-lubrication-wear',
    'robot-trajectory-generation',
    'llm-architecture-hybrid-linear',
  ];
  for (const upperSlug of upperSlugs) {
    await page.goto(`${base}/lab/blog/ai/${upperSlug}`, { waitUntil: 'networkidle' });
    await expect(page.locator(`article a[href="/lab/blog/ai/${slug}"]`).first()).toBeVisible();
  }
});

test('the source paper keeps the bounded prerequisite ladder', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/paper-shin-mckay-time-optimal-1985`, { waitUntil: 'networkidle' });
  await expect(page.getByText('PREREQUISITE LADDER · 필요한 만큼만 내려간다', { exact: true })).toBeVisible();
  await expect(page.locator(`a[href="/lab/blog/ai/${slug}"]`).first()).toBeVisible();
  await expect(page.getByText('더 오래된 논문으로 내려갈 필요는 없다.', { exact: false })).toBeVisible();
});
