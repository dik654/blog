import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const route = '/lab/blog/ai/statistics-generalization';

async function expectNoOverflow(page: import('@playwright/test').Page) {
  expect(await page.evaluate(() => (
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  ))).toBeLessThanOrEqual(1);

  const escaped = await page.locator('main').evaluate((main) => {
    const viewportWidth = document.documentElement.clientWidth;
    return [main, ...Array.from(main.querySelectorAll('*'))]
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
      .filter((node) => !node.closest('[data-math-fit]'))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          className: typeof node.className === 'string' ? node.className : '',
        };
      })
      .filter((item) => item.width > 1 && (item.left < -1 || item.right > viewportWidth + 1));
  });
  expect(escaped).toEqual([]);
}

test('statistics article establishes the target, unit, selection and deployment contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-paired-difference-lab]')).toHaveCount(1);
  await expect(page.locator('[data-generalization-claim-lab]')).toHaveCount(1);
  await expect(page.locator('svg[aria-label*="reliability"]')).toHaveCount(0);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('deployment population');
  expect(bodyText).toContain('resampling boundary');
  expect(bodyText).toContain('adaptive selection bias');
  expect(bodyText).toContain('calibration은');
  expect(bodyText).toContain('희귀 subgroup에서 -8%p');
  expect(bodyText).not.toContain(String.raw`\underbrace`);
  expect(bodyText).not.toContain(String.raw`\widehat`);
  expect(bodyText).not.toContain(String.raw`\frac`);

  for (const slug of [
    'evaluation-metrics',
    'cross-validation',
    'experiment-tracking',
    'probability-information-theory',
  ]) {
    await expect(page.locator(`a[href$="/${slug}"]`).first()).toBeVisible();
  }

  await expect(page.getByText('여기서 멈춘다.', { exact: true })).toHaveCount(3);
  await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();
  await expectNoOverflow(page);
});

test('paired lab computes the exact same-case difference and preserves the group boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-paired-difference-lab]');
  await expect(lab).toHaveAttribute('data-paired-mode', 'scores');
  await expect(lab).toHaveAttribute('data-a-accuracy', '91.000');
  await expect(lab).toHaveAttribute('data-b-accuracy', '91.583');
  await expect(lab).toHaveAttribute('data-paired-delta-pp', '0.583');

  await expect(lab.locator('[data-paired-cell="both-correct"]')).toContainText('1040');
  await expect(lab.locator('[data-paired-cell="a-only"]')).toContainText('52');
  await expect(lab.locator('[data-paired-cell="b-only"]')).toContainText('59');
  await expect(lab.locator('[data-paired-cell="both-wrong"]')).toContainText('49');

  await lab.getByRole('button', { name: 'Paired 차이', exact: true }).click();
  await expect(lab).toHaveAttribute('data-paired-mode', 'paired');
  await expect(lab.locator('[data-paired-summary]')).toContainText('순이득은 7행');
  await expect(lab.locator('[data-paired-summary]')).toContainText('+0.583%p');

  await lab.getByRole('button', { name: '사용자 재표본', exact: true }).click();
  await expect(lab).toHaveAttribute('data-paired-mode', 'cluster');
  await expect(lab.locator('[data-paired-summary]')).toContainText('사용자 80개');
  await expect(lab).toContainText('numeric confidence interval을 만들 수 없다');
  await expectNoOverflow(page);
});

test('claim lab changes the allowed claim instead of only changing colors', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-generalization-claim-lab]');
  await expect(lab).toHaveAttribute('data-split-design', 'rows');
  await expect(lab).toHaveAttribute('data-selection-evidence', 'reused');
  await expect(lab).toHaveAttribute('data-guardrail-evidence', 'average');
  await expect(lab).toHaveAttribute('data-claim-status', '기각');
  await expect(lab.locator('[data-claim-forbidden]')).toContainText('새 사용자');
  await expect(lab.locator('[data-claim-dominant-boundary]')).toContainText('사용자 leakage');
  await expect(lab.locator('[data-claim-evidence-chain]')).toContainText(
    '행 무작위 → 같은 validation 재사용 → 전체 평균만',
  );

  await lab.getByRole('button', { name: '사용자 분리', exact: true }).click();
  await lab.getByRole('button', { name: '손대지 않은 audit', exact: true }).click();
  await lab.getByRole('button', { name: 'Subgroup · calibration', exact: true }).click();
  await expect(lab).toHaveAttribute('data-claim-status', '범위 제한');
  await expect(lab.locator('[data-claim-forbidden]')).toContainText('새 병원');
  await expect(lab.locator('[data-claim-dominant-boundary]')).toContainText('병원·시간 경계');
  await expect(lab.locator('[data-claim-evidence-chain]')).toContainText(
    '사용자 분리 → 손대지 않은 audit → Subgroup · calibration',
  );

  await lab.getByRole('button', { name: '미래 병원 · 사용자 분리', exact: true }).click();
  await lab.getByRole('button', { name: '전체 평균만', exact: true }).click();
  await expect(lab).toHaveAttribute('data-claim-status', '보류');
  await expect(lab.locator('[data-claim-alternative]')).toContainText('희귀 subgroup');

  await lab.getByRole('button', { name: 'Subgroup · calibration', exact: true }).click();
  await expect(lab).toHaveAttribute('data-claim-status', '조건부 주장 가능');
  await expect(lab.locator('[data-claim-allowed]')).toContainText('future-site/group audit');
  await expect(lab.locator('[data-claim-allowed]')).toContainText('numeric interval은 아직 없다');
  await expect(lab.locator('[data-claim-forbidden]')).toContainText('보편적으로 우월');
  await expect(lab.locator('[data-claim-dominant-boundary]')).toContainText('audit 밖의 새 분포');

  await lab.getByRole('button', { name: '같은 validation 재사용', exact: true }).click();
  await expect(lab).toHaveAttribute('data-claim-status', '기각');
  await expect(lab.locator('[data-claim-alternative]')).toContainText('40번 중');
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`statistics equations and evidence labs remain readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await expect(page.locator('[data-paired-difference-lab]')).toBeVisible();
    await expect(page.locator('[data-generalization-claim-lab]')).toBeVisible();
    await page.waitForTimeout(600);

    const controls = await page.locator(
      '[data-paired-difference-lab] button, [data-generalization-claim-lab] button',
    ).evaluateAll((buttons) => (
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    ));
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();

    const scales = await page.locator('[data-math-fit]').evaluateAll((nodes) => (
      nodes.map((node) => Number((node as HTMLElement).dataset.mathScale ?? '0'))
    ));
    expect(scales.length).toBeGreaterThanOrEqual(10);
    expect(scales.every((scale) => scale >= 0.86)).toBeTruthy();

    const labWidths = await page.locator(
      '[data-paired-difference-lab], [data-generalization-claim-lab]',
    ).evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    }));
    expect(labWidths.every((lab) => lab.left >= -1 && lab.right <= viewport.width + 1)).toBeTruthy();

    if (viewport.name === 'tablet') {
      const tabletLayout = await page.evaluate(() => {
        const matrix = document.querySelector('[data-paired-matrix]')?.getBoundingClientRect();
        const explanation = document.querySelector('[data-paired-explanation]')?.getBoundingClientRect();
        const groups = [...document.querySelectorAll('[data-claim-control-group]')]
          .map((node) => node.getBoundingClientRect());
        return {
          pairedSameRow: Boolean(
            matrix
            && explanation
            && Math.abs(matrix.top - explanation.top) <= 2
            && matrix.right <= explanation.left + 1,
          ),
          claimSameRow: groups.length === 3
            && Math.max(...groups.map((rect) => rect.top))
              - Math.min(...groups.map((rect) => rect.top)) <= 2,
        };
      });
      expect(tabletLayout.pairedSameRow).toBeTruthy();
      expect(tabletLayout.claimSameRow).toBeTruthy();
    }
    await expectNoOverflow(page);
  });
}

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 900 },
]) {
  test(`direct scroll keeps the claim title below the sticky header at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    });

    const lab = page.locator('[data-generalization-claim-lab]');
    await lab.evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(100);
    const geometry = await page.evaluate(() => {
      const header = document.querySelector('header')?.getBoundingClientRect();
      const target = document.querySelector('[data-generalization-claim-lab]')?.getBoundingClientRect();
      const title = document.querySelector('[data-claim-lab-title]')?.getBoundingClientRect();
      return {
        headerBottom: header?.bottom ?? 0,
        targetTop: target?.top ?? -1,
        titleTop: title?.top ?? -1,
        titleBottom: title?.bottom ?? -1,
      };
    });

    expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.headerBottom);
    expect(geometry.targetTop).toBeLessThanOrEqual(geometry.headerBottom + 48);
    expect(geometry.titleTop).toBeGreaterThanOrEqual(geometry.headerBottom);
    expect(geometry.titleBottom).toBeLessThanOrEqual(viewport.height);
    await expect(page.locator('[data-claim-lab-title]')).toBeVisible();
    await expect(lab.getByRole('button', { name: '행 무작위', exact: true })).toBeVisible();
  });
}
