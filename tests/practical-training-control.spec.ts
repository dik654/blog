import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4179';
const slugs = [
  'training-pipeline',
  'transfer-learning-practice',
  'lr-scheduling',
  'regularization-practice',
];

for (const target of [
  { slug: 'training-pipeline', path: 'Training Run · 중단되어도 같은 실험으로 돌아오기', steps: 1, current: 0 },
  { slug: 'transfer-learning-practice', path: 'Pretrained Model · 가장 작은 충분한 적응', steps: 2, current: 1 },
  { slug: 'lr-scheduling', path: 'Optimizer Update · 시간축과 크기 제어', steps: 2, current: 1 },
  { slug: 'regularization-practice', path: 'Generalization · 실패 모드에서 개입 선택', steps: 2, current: 1 },
]) {
  test(`${target.slug} exposes its goal path`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'networkidle' });
    const rail = page.locator(`[aria-label="${target.path} 학습 경로"]`);
    await expect(rail.getByRole('link')).toHaveCount(target.steps);
    await expect(rail.getByRole('link').nth(target.current)).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [390, 768, 1440]) {
  test(`training-control routes remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });

    for (const slug of slugs) {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(() => (
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      ))).toBeLessThanOrEqual(1);

      const formulaScales = await page.locator('[data-math-fit]').evaluateAll((items) => (
        items.map((item) => Number((item as HTMLElement).dataset.mathScale ?? '1'))
      ));
      if (formulaScales.length > 0) expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.8);

      await expect(page.locator('[data-formula-pair]')).toHaveCount(await page.locator('[data-formula-note]').count());
      expect(await page.locator('article svg text').count()).toBe(0);
      expect(await page.locator('article').evaluate((article) => {
        const rawLatex = /\\(?:theta|eta|lambda|frac|sum|nabla|sqrt|begin|operatorname)\b/;
        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const parent = node.parentElement;
          if (parent && !parent.closest('.katex, pre, code, svg') && rawLatex.test(node.textContent ?? '')) return true;
          node = walker.nextNode();
        }
        return false;
      })).toBe(false);
      expect(errors).toEqual([]);
    }
  });
}

test('run labs separate microsteps, update boundaries and resume state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/training-pipeline`, { waitUntil: 'networkidle' });

  const step = page.locator('[data-lab="training-step"]');
  await step.getByRole('button', { name: '2회 누적', exact: true }).click();
  await expect(step.getByText('16 sample', { exact: true })).toBeVisible();
  await expect(step.getByText('지금 1회', { exact: true })).toBeVisible();
  await step.getByRole('button', { name: '4회 누적', exact: true }).click();
  await expect(step.getByText('32 sample', { exact: true })).toBeVisible();
  await expect(step.getByText('아직 0회', { exact: true })).toBeVisible();

  const resume = page.locator('[data-lab="resume-contract"]');
  await resume.getByRole('button', { name: '전체 계약', exact: true }).click();
  await resume.getByRole('button', { name: 'update 직후', exact: true }).click();
  await expect(resume.getByText('논리적으로 같은 run을 재개할 준비 완료', { exact: true })).toBeVisible();
  await expect(resume.getByText('RNG·sampler', { exact: true })).toBeVisible();
});

test('transfer lab chooses the smallest evidence-driven adaptation candidate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/transfer-learning-practice`, { waitUntil: 'networkidle' });

  const gate = page.locator('[data-lab="transfer-gate"]');
  await gate.getByRole('button', { name: '목표 충족', exact: true }).click();
  await expect(gate.getByText('Linear probe 유지', { exact: true })).toBeVisible();
  await gate.getByRole('button', { name: '성능 간극', exact: true }).click();
  await gate.getByRole('button', { name: '멀음', exact: true }).click();
  await expect(gate.getByText('Domain-adaptive pretraining 후보', { exact: true })).toBeVisible();
});

test('schedule lab uses optimizer updates and metric events as different clocks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/lr-scheduling`, { waitUntil: 'networkidle' });

  const clock = page.locator('[data-lab="update-clock"]');
  await expect(clock.getByText('1,000', { exact: true })).toBeVisible();
  await clock.getByRole('button', { name: '1회', exact: true }).click();
  await expect(clock.getByText('8,000', { exact: true }).last()).toBeVisible();
  await clock.getByRole('button', { name: '정체 기반', exact: true }).click();
  await expect(clock.getByText('ReduceLROnPlateau 후보', { exact: true })).toBeVisible();
  await expect(clock.getByText('validate() 뒤 scheduler.step(val_metric)', { exact: true })).toBeVisible();
});

test('generalization lab changes intervention with the observed failure mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/regularization-practice`, { waitUntil: 'networkidle' });

  const gate = page.locator('[data-lab="generalization-gate"]');
  await gate.getByRole('button', { name: '둘 다 높음', exact: true }).click();
  await expect(gate.getByText('정규화를 더 넣지 않는다', { exact: true })).toBeVisible();
  await gate.getByRole('button', { name: '확률 과신', exact: true }).click();
  await expect(gate.getByText(/Label smoothing은 후보일 뿐이다/)).toBeVisible();
  await expect(gate.getByText('Calibration', { exact: true })).toBeVisible();
});
