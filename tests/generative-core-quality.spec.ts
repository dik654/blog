import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

const tabbedArticles = [
  ['generative-theory', 2],
  ['vae', 1],
  ['gan', 1],
  ['diffusion-models', 2],
] as const;

test('generative category exposes current-first and core paths from the shared registry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-generative`, { waitUntil: 'networkidle' });

  const paths = page.locator('[data-authored-learning-path]');
  await expect(paths).toHaveCount(2);
  await expect(paths.nth(0)).toHaveAttribute('data-authored-learning-path', 'ai-generative-current-first');
  await expect(paths.nth(0).getByRole('link')).toHaveCount(5);
  await expect(paths.nth(0).getByText('1. 현재 구조 해부', { exact: true })).toBeVisible();
  await expect(paths.nth(1)).toHaveAttribute('data-authored-learning-path', 'ai-generative-core');
  await expect(paths.nth(1).getByRole('link')).toHaveCount(4);
  await expect(paths.nth(1).getByText('1. 분포의 네 경로', { exact: true })).toBeVisible();
  await expect(page.locator('[data-unassigned-articles]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

for (const [slug, expectedTablists] of tabbedArticles) {
  test(`${slug} exposes complete keyboard tab contracts`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });

    const tablists = page.getByRole('tablist');
    await expect(tablists).toHaveCount(expectedTablists);

    for (let listIndex = 0; listIndex < expectedTablists; listIndex += 1) {
      const tablist = tablists.nth(listIndex);
      const tabs = tablist.getByRole('tab');
      const tabCount = await tabs.count();
      expect(tabCount).toBeGreaterThan(1);

      const first = tabs.first();
      const second = tabs.nth(1);
      const panelId = await first.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();

      const panel = page.locator(`#${panelId}`);
      await expect(panel).toHaveAttribute('role', 'tabpanel');
      await expect(panel).toHaveAttribute('tabindex', '0');

      await first.focus();
      await page.keyboard.press('ArrowRight');
      await expect(second).toBeFocused();
      await expect(second).toHaveAttribute('aria-selected', 'true');
      await expect(panel).toHaveAttribute('aria-labelledby', await second.getAttribute('id') ?? '');

      await page.keyboard.press('Home');
      await expect(first).toBeFocused();
      await expect(first).toHaveAttribute('aria-selected', 'true');
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}

test('DiT visual controls keep readable dynamic layouts on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/dit-flow-matching-evaluation`, { waitUntil: 'networkidle' });

  const tokenExplorer = page.locator('[data-dit-token-explorer]');
  const vaeFactorControl = tokenExplorer.getByText('VAE factor f', { exact: true }).locator('..');
  const vaeButtons = vaeFactorControl.getByRole('button');
  await expect(vaeButtons).toHaveCount(2);

  const widths = await vaeButtons.evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().width));
  expect(Math.abs(widths[0] - widths[1])).toBeLessThanOrEqual(1);

  const evaluation = page.locator('[data-generative-eval]');
  await expect(evaluation.getByText('통과', { exact: true })).toHaveCount(2);
  await expect(evaluation.getByText('실패', { exact: true })).toHaveCount(2);
  await expect(evaluation.getByText('주의', { exact: true })).toHaveCount(1);

  await evaluation.getByRole('button', { name: '평가 gate 범위 전환' }).click();
  await expect(evaluation.getByRole('button', { name: '평가 gate 범위 전환' })).toContainText('FID만');
  await expect(evaluation.getByText('Fidelity', { exact: true })).toBeVisible();
  await expect(evaluation.getByText('Coverage', { exact: true })).toHaveCount(0);

  const minimumTextSize = await page.locator(
    '[data-five-contracts], [data-dit-token-explorer], [data-flow-path], [data-solver-step], [data-generative-eval]',
  ).evaluateAll((roots) => {
    const sizes = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>('p, span, strong, dt, button'))
      .filter((element) => element.textContent?.trim() && element.getClientRects().length > 0)
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    return Math.min(...sizes);
  });

  expect(minimumTextSize).toBeGreaterThanOrEqual(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
