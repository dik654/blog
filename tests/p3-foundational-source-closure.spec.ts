import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4177';
test.setTimeout(120_000);

const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

test('P3 top-down routes point canonical evidence at dedicated paper reconstructions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-data`, { waitUntil: 'networkidle' });
  const scalingRoute = page.locator('[data-topdown-research-route="llm-data-engine"]');
  await expect(scalingRoute.getByRole('link', { name: /내부 해설 읽기/ }).last()).toHaveAttribute(
    'href',
    '/lab/blog/ai/paper-chinchilla-2022?track=llm-data-engine',
  );

  await page.goto(`${base}/lab/blog/ai?sub=ai-world-models`, { waitUntil: 'networkidle' });
  const worldRoute = page.locator('[data-topdown-research-route="world-model-physical-ai"]');
  await expect(worldRoute.getByRole('link', { name: /내부 해설 읽기/ }).last()).toHaveAttribute(
    'href',
    '/lab/blog/ai/paper-vjepa2-2025?track=world-model-physical-ai',
  );
});

for (const viewport of viewports) {
  test(`P3 paper reconstructions stay legible and interactive at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);

    await page.goto(`${base}/lab/blog/ai/paper-transformer-2017`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-transformer-path-lab]')).toBeVisible();
    await expect(page.locator('[data-attention-shape-lab]')).toBeVisible();
    await expect(page.locator('[data-transformer-evidence-lab]')).toBeVisible();
    await page.locator('[data-attention-shape-lab]').getByRole('tab', { name: 'Cross attention' }).click();
    await page.locator('[data-attention-shape-lab] input[type="range"]').nth(0).fill('7');
    await page.locator('[data-attention-shape-lab] input[type="range"]').nth(1).fill('3');
    await expect(page.locator('[data-attention-shape-lab]')).toContainText('2×8×3×64');
    await expect(page.locator('[data-attention-shape-lab]')).toContainText('2×8×7×64');
    await expect(page.locator('[data-attention-shape-lab]')).toContainText('2×8×3×7');
    await page.locator('[data-attention-shape-lab]').getByRole('tab', { name: 'Masked decoder' }).click();
    const causalMask = page.locator('[data-causal-mask-grid]');
    await expect(causalMask.getByRole('gridcell', { name: 'Query 2, key 3: 미래 위치 차단' })).toHaveText('−∞');
    await expect(causalMask.getByRole('gridcell', { name: 'Query 2, key 2: 읽기 허용' })).toHaveText('0');
    await expect(page.locator('[data-attention-shape-lab]')).toContainText('미래를 가린 target prefix');
    await page.locator('[data-transformer-evidence-lab]').getByRole('tab', { name: 'Table 3' }).click();
    await expect(page.locator('[data-transformer-evidence-lab]')).toContainText('1 head 24.9');
    await assertPaperContracts(
      page,
      '[data-transformer-path-lab], [data-attention-shape-lab], [data-transformer-evidence-lab]',
    );

    await page.goto(`${base}/lab/blog/ai/paper-ppo-2017`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-ppo-clip-lab]')).toBeVisible();
    await expect(page.locator('[data-ppo-iteration-lab]')).toBeVisible();
    await expect(page.locator('[data-ppo-evidence-lab]')).toBeVisible();
    const clip = page.locator('[data-ppo-clip-lab]');
    await clip.getByRole('button', { name: 'A = −1' }).click();
    await clip.locator('input[aria-label="Policy ratio"]').fill('0.7');
    await expect(clip).toContainText('-0.80');
    await page.locator('[data-ppo-evidence-lab]').getByRole('tab', { name: 'Table 2' }).click();
    await expect(page.locator('[data-ppo-evidence-lab]')).toContainText('ACER 28 · PPO 19');
    await assertPaperContracts(page, '[data-ppo-clip-lab], [data-ppo-iteration-lab], [data-ppo-evidence-lab]');

    await page.goto(`${base}/lab/blog/ai/paper-chinchilla-2022`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-chinchilla-approach-lab]')).toBeVisible();
    await expect(page.locator('[data-compute-allocation-lab]')).toBeVisible();
    await expect(page.locator('[data-chinchilla-evidence-lab]')).toBeVisible();
    await page.locator('[data-chinchilla-approach-lab]').getByRole('tab', { name: /Parametric loss fit/ }).click();
    await expect(page.locator('[data-chinchilla-approach-lab]')).toContainText('α=.34 · β=.28');
    await page.locator('[data-compute-allocation-lab] input[type="range"]').fill('3');
    await expect(page.locator('[data-compute-allocation-lab]')).toContainText('각각 약 8.0×');
    await page.locator('[data-chinchilla-evidence-lab]').getByRole('tab', { name: 'Downstream' }).click();
    await expect(page.locator('[data-chinchilla-evidence-lab]')).toContainText('51/57 개선 · 4개 하락');
    await assertPaperContracts(
      page,
      '[data-chinchilla-approach-lab], [data-compute-allocation-lab], [data-chinchilla-evidence-lab]',
    );

    await page.goto(`${base}/lab/blog/ai/paper-vjepa2-2025`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-vjepa-stage-lab]')).toBeVisible();
    await expect(page.locator('[data-vjepa-training-lab]')).toBeVisible();
    await expect(page.locator('[data-vjepa-evidence-lab]')).toBeVisible();
    await page.locator('[data-vjepa-training-lab]').getByRole('tab', { name: 'Rollout · 실제 T=2' }).click();
    await expect(page.locator('[data-vjepa-training-lab]')).toContainText('predictor가 만든 ẑ');
    await page.locator('[data-vjepa-evidence-lab]').getByRole('tab', { name: 'Planner' }).click();
    await expect(page.locator('[data-vjepa-evidence-lab]')).toContainText('800 samples · 10 refinements');
    await expect(page.locator('[data-vjepa-evidence-lab]')).toContainText('4분/action');
    await assertPaperContracts(page, '[data-vjepa-stage-lab], [data-vjepa-training-lab], [data-vjepa-evidence-lab]');

    expect(errors).toEqual([]);
  });
}

async function assertPaperContracts(page: Page, labSelector: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  const audit = await page.evaluate((selector) => {
    const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
    const labs = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const labText = labs.flatMap((lab) => Array.from(
      lab.querySelectorAll<HTMLElement>('p, span, strong, button, label, dt, dd, output'),
    )).filter((node) => getComputedStyle(node).display !== 'none' && node.textContent?.trim());
    const formulaOverflows = formulas.filter((host) => {
      const math = host.querySelector<HTMLElement>('.katex-html');
      if (!math) return true;
      const hostRect = host.getBoundingClientRect();
      const mathRect = math.getBoundingClientRect();
      return mathRect.left < hostRect.left - 1 || mathRect.right > hostRect.right + 1;
    }).length;
    const proseBeforeViz = labs.every((lab) => {
      const section = lab.closest('section');
      if (!section) return false;
      const prose = section.querySelector('p');
      return prose != null && Boolean(prose.compareDocumentPosition(lab) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      labOverflows: labs.map((lab) => lab.scrollWidth - lab.clientWidth),
      formulaOverflows,
      minFormulaScale: formulas.length
        ? Math.min(...formulas.map((formula) => Number(formula.dataset.mathScale ?? '1')))
        : 1,
      minFormulaFont: formulas.length
        ? Math.min(...formulas.map((formula) => Number.parseFloat(
          getComputedStyle(formula.querySelector('.katex') as Element).fontSize,
        )))
        : 12,
      smallestLabText: labText.length
        ? Math.min(...labText.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)))
        : 12,
      rawLatex: /\\(?:theta|underbrace|operatorname|begin\{aligned\}|mathcal|frac)/.test(document.body.innerText),
      katexErrors: document.querySelectorAll('.katex-error').length,
      proseBeforeViz,
    };
  }, labSelector);

  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(Math.max(...audit.labOverflows, 0)).toBeLessThanOrEqual(1);
  expect(audit.formulaOverflows).toBe(0);
  expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.7);
  expect(audit.minFormulaFont).toBeGreaterThanOrEqual(12);
  expect(audit.smallestLabText).toBeGreaterThanOrEqual(12);
  expect(audit.rawLatex).toBe(false);
  expect(audit.katexErrors).toBe(0);
  expect(audit.proseBeforeViz).toBe(true);
}
