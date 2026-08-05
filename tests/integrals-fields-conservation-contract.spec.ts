import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const route = '/lab/blog/ai/integrals-fields-conservation';

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const result = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const escaped = [...document.querySelectorAll<HTMLElement>('main *')]
      .filter((element) => !element.closest('[data-math-fit]'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          text: (element.textContent ?? '').trim().slice(0, 64),
        };
      })
      .filter((item) => item.width > 1 && (item.left < -1 || item.right > viewportWidth + 1));

    return {
      documentOverflow: document.documentElement.scrollWidth - viewportWidth,
      escaped,
      figureOverflow: [...document.querySelectorAll<HTMLElement>('figure')].map((figure) => (
        figure.scrollWidth - figure.clientWidth
      )),
      formulas: [...document.querySelectorAll<HTMLElement>('[data-math-fit]')].map((formula) => ({
        overflow: formula.scrollWidth - formula.clientWidth,
        scale: Number(formula.dataset.mathScale ?? '0'),
      })),
    };
  });

  expect(result.documentOverflow).toBeLessThanOrEqual(1);
  expect(result.escaped).toEqual([]);
  expect(result.figureOverflow.every((value) => value <= 1)).toBeTruthy();
  expect(result.formulas.length).toBeGreaterThanOrEqual(15);
  expect(result.formulas.every((formula) => formula.overflow <= 1)).toBeTruthy();
  expect(result.formulas.every((formula) => formula.scale >= 0.9)).toBeTruthy();
}

test('article climbs from accumulation to discrete conservation and returns upward', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  for (const title of [
    'Point value가 아니라 작은 조각의 기여를 모은다',
    'Density × measure의 합을 연속 적분으로 좁힌다',
    'Domain geometry와 field의 output shape를 먼저 고른다',
    '합력과 기준점 모멘트를 함께 맞춘다',
    'Normal projection과 orientation으로 signed flux를 만든다',
    'Divergence의 local ledger를 바깥 경계 flux로 합친다',
    'Storage, boundary flux와 source를 한 식에 둔다',
    'Cell measure와 shared numerical flux로 보존을 유지한다',
    '분포량의 domain, direction과 balance를 고정하고 위로 돌아간다',
  ]) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }

  for (const selector of [
    '[data-partition-refinement-lab]',
    '[data-domain-measure-lab]',
    '[data-resultant-line-lab]',
    '[data-flux-orientation-lab]',
    '[data-divergence-field-lab]',
    '[data-internal-face-cancellation-lab]',
    '[data-control-volume-ledger-lab]',
    '[data-conservative-grid-lab]',
  ]) {
    await expect(page.locator(selector)).toHaveCount(1);
  }

  await expect(page.locator('[data-formula-note]')).toHaveCount(17);
  expect(await page.locator('.katex').count()).toBeGreaterThanOrEqual(25);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('한 physical face flux 값을 두 cell이 공유');
  expect(bodyText).toContain('fixed control volume');
  expect(bodyText).not.toContain(String.raw`\underbrace`);
  expect(bodyText).not.toContain(String.raw`\theta`);
  expect(bodyText).not.toContain(String.raw`\frac`);

  for (const slug of [
    'robot-structural-mechanics-materials-fatigue-thermal',
    'robot-fracture-mechanics-damage-tolerance',
    'robot-contact-tribology-lubrication-wear',
    'differential-equations-phase-plane-numerical-integration',
  ]) {
    await expect(page.locator(`a[href$="/${slug}"]`).first()).toBeVisible();
  }
});

test('partition refinement and domain measure change the accumulated total', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const partition = page.locator('[data-partition-refinement-lab]');
  await partition.getByRole('button', { name: '오른쪽으로 증가', exact: true }).click();
  await partition.locator('#integrals-partitions').fill('2');
  const coarseError = Math.abs(Number(await partition.getAttribute('data-error')));
  await partition.locator('#integrals-partitions').fill('12');
  const fineError = Math.abs(Number(await partition.getAttribute('data-error')));
  expect(fineError).toBeLessThan(coarseError);

  const domain = page.locator('[data-domain-measure-lab]');
  const surfaceTotal = await domain.getAttribute('data-total');
  await domain.getByRole('button', { name: '부피 · dV', exact: true }).click();
  expect(await domain.getAttribute('data-total')).not.toBe(surfaceTotal);
  await expect(domain).toHaveAttribute('data-domain', 'volume');
  await domain.getByRole('button', { name: 'Vector field', exact: true }).click();
  await expect(domain).toHaveAttribute('data-field-shape', 'vector');
  expect((await domain.getAttribute('data-total'))?.split(',')).toHaveLength(2);
});

test('resultant preserves both force and moment only at the correct line of action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-resultant-line-lab]');
  await lab.getByRole('button', { name: '삼각형', exact: true }).click();
  await lab.getByRole('button', { name: '힘 + 모멘트 일치', exact: true }).click();
  expect(Math.abs(Number(await lab.getAttribute('data-moment-residual')))).toBeLessThan(1e-8);
  const triangularLine = await lab.getAttribute('data-line-of-action');

  await lab.getByRole('button', { name: '균일', exact: true }).click();
  expect(await lab.getAttribute('data-line-of-action')).not.toBe(triangularLine);
  await lab.getByRole('button', { name: '힘만 일치', exact: true }).click();
  expect(Math.abs(Number(await lab.getAttribute('data-moment-residual')))).toBeGreaterThan(0.1);
});

test('normal reversal flips flux while shared internal faces cancel globally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const flux = page.locator('[data-flux-orientation-lab]');
  const outward = Number(await flux.getAttribute('data-total-flux'));
  await flux.getByRole('button', { name: '안쪽 법선', exact: true }).click();
  const inward = Number(await flux.getAttribute('data-total-flux'));
  expect(Math.abs(outward + inward)).toBeLessThan(1e-6);

  const divergence = page.locator('[data-divergence-field-lab]');
  expect(
    Math.abs(
      Number(await divergence.getAttribute('data-boundary-net'))
      - Number(await divergence.getAttribute('data-volume-integral')),
    ),
  ).toBeLessThan(1e-8);
  await divergence.getByRole('button', { name: '순상쇄', exact: true }).click();
  const faceFluxes = (await divergence.getAttribute('data-face-fluxes'))
    ?.split(',')
    .map(Number) ?? [];
  expect(faceFluxes.some((value) => value > 0.1)).toBeTruthy();
  expect(faceFluxes.some((value) => value < -0.1)).toBeTruthy();
  expect(Math.abs(Number(await divergence.getAttribute('data-boundary-net')))).toBeLessThan(1e-8);
  expect(Math.abs(Number(await divergence.getAttribute('data-residual')))).toBeLessThan(1e-8);

  const cancellation = page.locator('[data-internal-face-cancellation-lab]');
  expect(
    Math.abs(
      Number(await cancellation.getAttribute('data-unweighted-divergence-sum'))
      - Number(await cancellation.getAttribute('data-boundary-total')),
    ),
  ).toBeGreaterThan(0.01);
  const initialGlobal = await cancellation.getAttribute('data-global-total');
  await cancellation.locator('#integrals-cancellation-flux').fill('3.25');
  await expect(cancellation).toHaveAttribute('data-global-total', initialGlobal ?? '');
  expect(Math.abs(Number(await cancellation.getAttribute('data-residual')))).toBeLessThan(1e-8);
  await cancellation.getByRole('button', { name: '같은 법선 · 오류', exact: true }).click();
  expect(Math.abs(Number(await cancellation.getAttribute('data-residual')))).toBeGreaterThan(0.1);
});

test('storage and conservative-grid controls expose missing terms as residuals', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const ledger = page.locator('[data-control-volume-ledger-lab]');
  const firstRate = await ledger.getAttribute('data-storage-rate');
  const amountAtFourSeconds = Number(await ledger.getAttribute('data-amount'));
  await ledger.locator('#integrals-ledger-time').fill('6');
  const amountAtSixSeconds = Number(await ledger.getAttribute('data-amount'));
  expect(
    Math.abs(
      (amountAtSixSeconds - amountAtFourSeconds)
      - Number(firstRate) * 2,
    ),
  ).toBeLessThan(1e-8);
  await ledger.locator('#integrals-ledger-source').fill('1.25');
  expect(await ledger.getAttribute('data-storage-rate')).not.toBe(firstRate);
  expect(Math.abs(Number(await ledger.getAttribute('data-residual')))).toBeLessThan(1e-8);
  await ledger.getByRole('button', { name: 'Storage를 지움', exact: true }).click();
  expect(Math.abs(Number(await ledger.getAttribute('data-residual')))).toBeGreaterThan(0.1);

  const grid = page.locator('[data-conservative-grid-lab]');
  expect(Math.abs(Number(await grid.getAttribute('data-ghost-source')))).toBeLessThan(1e-8);
  await grid.getByRole('button', { name: '양쪽이 다른 값', exact: true }).click();
  const firstGhost = Number(await grid.getAttribute('data-ghost-source'));
  expect(Math.abs(firstGhost)).toBeGreaterThan(0.01);
  await grid.getByRole('button', { name: 'Cell 2 ↔ 3', exact: true }).click();
  expect(Number(await grid.getAttribute('data-ghost-source'))).not.toBe(firstGhost);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`formulas, controls and visualizations remain readable at ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);

    const controlSizes = await page.locator(
      '[data-partition-refinement-lab] button, [data-partition-refinement-lab] input, '
      + '[data-domain-measure-lab] button, [data-domain-measure-lab] input, '
      + '[data-resultant-line-lab] button, [data-resultant-line-lab] input, '
      + '[data-flux-orientation-lab] button, [data-flux-orientation-lab] input, '
      + '[data-divergence-field-lab] button, [data-divergence-field-lab] input, '
      + '[data-internal-face-cancellation-lab] button, [data-internal-face-cancellation-lab] input, '
      + '[data-control-volume-ledger-lab] button, [data-control-volume-ledger-lab] input, '
      + '[data-conservative-grid-lab] button, [data-conservative-grid-lab] input',
    ).evaluateAll((controls) => controls.map((control) => {
      const rect = control.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));

    expect(controlSizes.length).toBeGreaterThan(0);
    expect(controlSizes.every((size) => size.width >= 44 && size.height >= 44)).toBeTruthy();
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
}
