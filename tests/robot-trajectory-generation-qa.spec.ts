import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const slug = 'robot-trajectory-generation';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`${slug} ${viewport.name} keeps formulas and visual labs inside the article`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(180);

    await expect(page.getByRole('heading', { name: 'Torque limit은 path 위치와 속도에 따라 허용 가능한 가속도를 바꾼다' })).toBeVisible();
    await expect(page.locator('[data-dynamic-retiming-lab]')).toBeVisible();
    await expect(page.locator('[data-dynamic-retiming-release-gate]')).toBeVisible();

    const audit = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const figures = Array.from(document.querySelectorAll<HTMLElement>('figure.foundation-viz-explorer'));
      const article = document.querySelector<HTMLElement>('article');
      const releaseGate = document.querySelector<HTMLElement>('[data-dynamic-retiming-release-gate]');
      const articleRect = article?.getBoundingClientRect();

      const formulaOverflow = formulas.flatMap((formula) => {
        const rendered = formula.firstElementChild as HTMLElement | null;
        if (!rendered) return [];
        const dx = rendered.getBoundingClientRect().width - formula.clientWidth;
        return dx > 2 ? [{ source: formula.dataset.mathSource, dx }] : [];
      });
      const annotationFailures = formulas.flatMap((formula) => {
        const text = formula.textContent ?? '';
        return !/[가-힣]/.test(text) || formula.dataset.mathAnnotationMissing === 'true'
          ? [{ source: formula.dataset.mathSource, text: text.slice(0, 120) }]
          : [];
      });
      const figureOverflow = figures.flatMap((figure, index) => {
        const rect = figure.getBoundingClientRect();
        if (!articleRect || (rect.left >= articleRect.left - 1 && rect.right <= articleRect.right + 1)) return [];
        return [{ index, left: rect.left - articleRect.left, right: rect.right - articleRect.right }];
      });
      const visible = article?.cloneNode(true) as HTMLElement | undefined;
      visible?.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
      const rawLatex = (visible?.textContent ?? '').match(/\\(?:ddot|dot|underbrace|frac|operatorname|varepsilon|tau)\b/g) ?? [];
      const scales = formulas.map((formula) => Number(formula.dataset.mathScale ?? 1));
      const releaseGateRect = releaseGate?.getBoundingClientRect();
      const releaseGateOverflow = !articleRect || !releaseGateRect
        ? null
        : Math.max(articleRect.left - releaseGateRect.left, releaseGateRect.right - articleRect.right, 0);
      const releaseRowOverflow = Array.from(releaseGate?.querySelectorAll<HTMLElement>('li') ?? []).flatMap((row, index) => {
        const rowRect = row.getBoundingClientRect();
        const overflow = Math.max(
          row.scrollWidth - row.clientWidth,
          ...Array.from(row.children).map((child) => {
            const rect = child.getBoundingClientRect();
            return Math.max(rowRect.left - rect.left, rect.right - rowRect.right, 0);
          }),
        );
        return overflow > 1 ? [{ index, overflow }] : [];
      });

      return {
        formulas: formulas.length,
        figures: figures.length,
        formulaOverflow,
        annotationFailures,
        figureOverflow,
        rawLatex,
        minScale: Math.min(...scales),
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        releaseGateOverflow,
        releaseGateInternalOverflow: releaseGate ? releaseGate.scrollWidth - releaseGate.clientWidth : null,
        releaseRowOverflow,
      };
    });

    expect(audit.formulas).toBeGreaterThanOrEqual(25);
    expect(audit.figures).toBe(6);
    expect(audit.formulaOverflow).toEqual([]);
    expect(audit.annotationFailures).toEqual([]);
    expect(audit.figureOverflow).toEqual([]);
    expect(audit.rawLatex).toEqual([]);
    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.releaseGateOverflow).toBe(0);
    expect(audit.releaseGateInternalOverflow).toBe(0);
    expect(audit.releaseRowOverflow).toEqual([]);
    expect(audit.minScale).toBeGreaterThanOrEqual(viewport.width <= 390 ? 0.78 : 0.88);
    expect(errors).toEqual([]);

    await page.screenshot({
      path: `.codex-tmp/robot-trajectory-generation-${viewport.name}-2026-07-28.png`,
      fullPage: true,
    });
  });
}

test('dynamic retiming lab exposes signed, zero-inertia, robust, and state-dependent results', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-dynamic-retiming-lab]');
  await expect(lab.getByText('J2 · 팔꿈치', { exact: false })).toBeVisible();
  await expect(lab.getByText('부등호 반전', { exact: false })).toBeVisible();
  await expect(lab.getByText('나누지 않음', { exact: false })).toBeVisible();

  const before = await lab.innerText();
  await lab.getByRole('button', { name: '명목 한계' }).click();
  await expect.poll(async () => lab.innerText()).not.toBe(before);

  const sliders = lab.locator('input[type="range"]');
  await expect(sliders).toHaveCount(3);
  const stateBefore = await lab.innerText();
  await sliders.nth(1).focus();
  await sliders.nth(1).press('End');
  await expect.poll(async () => lab.innerText()).not.toBe(stateBefore);
  await expect(lab).toHaveAttribute('data-feasible', /true|false/);
  await expect(lab).toHaveAttribute('data-state-controllable', /true|false/);
  await expect(lab).toHaveAttribute('data-profile-status', /feasible|infeasible/);

  await sliders.nth(1).fill('20');
  await sliders.nth(0).focus();
  await sliders.nth(0).press('End');
  await expect(lab).toHaveAttribute('data-state-controllable', 'false');
  await expect(lab.getByText('종점 정지는 불가', { exact: false })).toBeVisible();
});

test('release evidence switches from recorded NO-GO to revalidated GO', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });

  const gate = page.locator('[data-dynamic-retiming-release-gate]');
  const convergenceValue = async (metric: string) => {
    const row = gate.locator('li').filter({ hasText: metric });
    await expect(row).toHaveCount(1);
    const text = await row.locator(':scope > p').first().innerText();
    const value = Number.parseFloat(text.replace(/[^0-9.+-]/g, ''));
    expect(Number.isFinite(value)).toBe(true);
    return { row, value };
  };

  await expect(gate).toHaveAttribute('data-release', 'no-go');
  await expect(gate).toHaveAttribute('data-coarse-failure', 'none');
  await expect(gate).toHaveAttribute('data-fine-failure', 'none');
  await expect(gate.getByText('NO-GO', { exact: false })).toBeVisible();
  await expect(gate.getByText('격자 총시간 변화 · 21 → 41', { exact: true })).toBeVisible();

  const recordedTime = await convergenceValue('격자 총시간 변화');
  const recordedSwitch = await convergenceValue('모든 전환 위치의 최대 변화');
  const recordedTorque = await convergenceValue('최대 토크 변화');
  expect(recordedTime.value).toBeLessThanOrEqual(1);
  expect(recordedSwitch.value).toBeGreaterThan(0.005);
  expect(recordedTorque.value).toBeLessThanOrEqual(0.1);
  await expect(recordedSwitch.row).toContainText('SWITCH_NOT_CONVERGED');
  await expect(recordedSwitch.row).toContainText('FAIL');

  await gate.getByRole('button', { name: '재검증 기록' }).click();
  await expect(gate).toHaveAttribute('data-release', 'go');
  await expect(gate).toHaveAttribute('data-coarse-failure', 'none');
  await expect(gate).toHaveAttribute('data-fine-failure', 'none');
  await expect(gate.getByText('격자 총시간 변화 · 201 → 401', { exact: true })).toBeVisible();

  const revalidatedTime = await convergenceValue('격자 총시간 변화');
  const revalidatedSwitch = await convergenceValue('모든 전환 위치의 최대 변화');
  const revalidatedTorque = await convergenceValue('최대 토크 변화');
  expect(revalidatedTime.value).toBeLessThan(recordedTime.value);
  expect(revalidatedTime.value).toBeLessThanOrEqual(1);
  expect(revalidatedSwitch.value).toBeLessThan(recordedSwitch.value);
  expect(revalidatedSwitch.value).toBeLessThanOrEqual(0.005);
  expect(revalidatedTorque.value).toBeLessThanOrEqual(0.1);
  await expect(gate.locator('li').filter({ hasText: '모델 재계산' })).toHaveCount(3);
  await expect(gate.locator('li').filter({ hasText: '모델 재계산' }).filter({ hasText: 'PASS' })).toHaveCount(3);
  expect(await gate.innerText()).not.toMatch(/\b(?:Infinity|NaN)\b/);
  await expect(gate.getByText('모든 전환 위치의 최대 변화', { exact: true })).toBeVisible();
  await expect(gate.getByText('GO', { exact: false })).toBeVisible();
});
