import { expect, test } from '@playwright/test';

const BASE_URL = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';

test('activation patching controls change the measured restoration', async ({ page }) => {
  await page.goto(`${BASE_URL}/lab/blog/ai/llm-circuit-analysis`);

  const lab = page.locator('[data-activation-patching-lab]');
  await expect(lab.locator('[data-restoration-value]')).toHaveAttribute('data-restoration-value', '81');
  await expect(page.locator('#replacement-graph [data-concept-primer]')).toContainText('Replacement model · 대체 모델');
  await expect(page.locator('#replacement-graph [data-concept-primer]')).toContainText('Mechanistic faithfulness');

  await lab.locator('[data-patch-layer="12"]').click();
  await lab.locator('[data-patch-position="last"]').click();

  await expect(lab).toHaveAttribute('data-selected-layer', '12');
  await expect(lab).toHaveAttribute('data-selected-position', 'last');
  await expect(lab.locator('[data-restoration-value]')).toHaveAttribute('data-restoration-value', '18');
});

test('graph threshold changes shown mass without changing replacement fidelity', async ({ page }) => {
  await page.goto(`${BASE_URL}/lab/blog/ai/llm-circuit-analysis`);

  const graph = page.locator('[data-attribution-graph]');
  await expect(graph.locator('[data-fidelity]')).toHaveAttribute('data-fidelity', '84');
  await expect(graph.locator('[data-shown-mass]')).toHaveAttribute('data-shown-mass', '55');
  await expect(graph.locator('[data-omitted-mass]')).toHaveAttribute('data-omitted-mass', '45');

  await graph.locator('[data-graph-threshold]').fill('25');

  await expect(graph.locator('[data-fidelity]')).toHaveAttribute('data-fidelity', '84');
  await expect(graph.locator('[data-shown-mass]')).toHaveAttribute('data-shown-mass', '31');
  await expect(graph.locator('[data-omitted-mass]')).toHaveAttribute('data-omitted-mass', '69');
});

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`circuit controls and labels remain operable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/lab/blog/ai/llm-circuit-analysis`, { waitUntil: 'networkidle' });

    const audit = await page.evaluate(() => {
      const labs = Array.from(document.querySelectorAll<HTMLElement>(
        '[data-activation-patching-lab], [data-attribution-graph]',
      ));
      const controls = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>('button, input[type="range"]')));
      const labels = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>('p, legend, label > span')));
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        labOverflow: labs.map((lab) => lab.scrollWidth - lab.clientWidth),
        controlFloor: Math.min(...controls.map((control) => {
          const box = control.getBoundingClientRect();
          return Math.min(box.width, box.height);
        })),
        labelFloor: Math.min(...labels.map((label) => Number.parseFloat(getComputedStyle(label).fontSize))),
      };
    });

    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(Math.max(...audit.labOverflow)).toBeLessThanOrEqual(1);
    expect(audit.controlFloor).toBeGreaterThanOrEqual(44);
    expect(audit.labelFloor).toBeGreaterThanOrEqual(12);
    await expect(page.locator('[data-activation-patching-lab] [role="status"]')).toHaveAttribute('aria-live', 'polite');
    await expect(page.locator('[data-attribution-graph] [role="status"]')).toHaveAttribute('aria-live', 'polite');
  });
}

test('circuit labs support keyboard state changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/lab/blog/ai/llm-circuit-analysis`, { waitUntil: 'networkidle' });

  const patching = page.locator('[data-activation-patching-lab]');
  await patching.locator('[data-patch-layer="12"]').focus();
  await page.keyboard.press('Enter');
  await patching.locator('[data-patch-position="last"]').focus();
  await page.keyboard.press('Space');
  await expect(patching).toHaveAttribute('data-selected-layer', '12');
  await expect(patching).toHaveAttribute('data-selected-position', 'last');

  const graph = page.locator('[data-attribution-graph]');
  const threshold = graph.locator('[data-graph-threshold]');
  await threshold.focus();
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press('ArrowRight');
  }
  await expect(threshold).toHaveValue('25');
  await expect(graph.locator('[data-shown-mass]')).toHaveAttribute('data-shown-mass', '31');
});
