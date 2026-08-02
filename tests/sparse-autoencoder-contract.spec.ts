import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`SAE evidence remains readable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/sparse-autoencoder`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole('heading', { name: '왜 뉴런 하나보다 feature direction을 찾을까?' })).toBeVisible();
    await expect(page.getByText('Golden Gate Claude', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Anthropic · Golden Gate Claude/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Google DeepMind · Gemma Scope 2/ })).toBeVisible();
    await expect(page.locator('#limitations')).toContainText('Matryoshka SAE');
    await expect(page.locator('[data-sae-reconstruction]')).toBeVisible();
    await expect(page.locator('[data-sae-evidence-stage]')).toBeVisible();

    const layout = await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>('[data-sae-evidence-stage]');
      const labels = Array.from(stage?.querySelectorAll<HTMLElement>('ol p, [aria-live] > div > p:first-child') ?? []);
      const controls = Array.from(document.querySelectorAll<HTMLElement>('[data-step-viz] button, #sae-top-k'));
      return {
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
        stageOverflow: stage ? stage.scrollWidth - stage.clientWidth : 999,
        labelFontFloor: Math.min(...labels.map((label) => Number.parseFloat(getComputedStyle(label).fontSize))),
        controlFloor: Math.min(...controls.map((control) => {
          const box = control.getBoundingClientRect();
          return Math.min(box.width, box.height);
        })),
        evidenceColumns: stage
          ? getComputedStyle(stage.querySelector('ol') as HTMLElement).gridTemplateColumns.split(' ').length
          : 0,
      };
    });

    expect(layout.documentOverflow).toBeLessThanOrEqual(1);
    expect(layout.stageOverflow).toBeLessThanOrEqual(1);
    expect(layout.labelFontFloor).toBeGreaterThanOrEqual(12);
    expect(layout.controlFloor).toBeGreaterThanOrEqual(44);
    expect(layout.evidenceColumns).toBe(viewport.width < 640 ? 2 : 5);
    expect(errors).toEqual([]);
  });
}

test('SAE controls announce reconstruction error and advance evidence state', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(`${base}/lab/blog/ai/sparse-autoencoder`, { waitUntil: 'networkidle' });

  const reconstruction = page.locator('[data-sae-reconstruction]');
  const error = reconstruction.locator('[data-sae-relative-error]');
  await expect(error).toHaveAttribute('aria-live', 'polite');
  const before = await error.textContent();
  await reconstruction.getByLabel('남길 feature 수').fill('5');
  await expect(error).not.toHaveText(before ?? '');

  const stepper = page.locator('[data-step-viz]').filter({
    has: page.locator('[data-sae-evidence-stage]'),
  });
  await expect(stepper.locator('[data-sae-evidence-stage]')).toHaveAttribute('data-sae-evidence-stage', '0');
  await stepper.getByRole('button', { name: '다음 장면' }).click();
  await expect(stepper.locator('[data-sae-evidence-stage]')).toHaveAttribute('data-sae-evidence-stage', '1');
  await expect(stepper.locator('[aria-live="polite"]')).toContainText('Feature 의미의 후보');
});
