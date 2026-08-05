import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`on-device runtime keeps export, delegation and release evidence executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/on-device-llm-runtime`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '왜 데스크톱 성공이 device release는 아닐까?' })).toBeVisible();
    await expect(page.locator('[data-edge-export-pipeline]')).toBeVisible();
    await expect(page.locator('[data-delegation-coverage]')).toBeVisible();
    await expect(page.locator('[data-device-release-lab]')).toBeVisible();
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('[data-math-fit]')).toHaveCount(4);
    await expect(page.locator('article table')).toHaveCount(0);

    const pipeline = page.locator('[data-edge-export-pipeline]');
    await expect(pipeline).toHaveAttribute('data-backend', 'qnn');
    await pipeline.getByRole('button', { name: 'Serialize', exact: false }).click();
    await expect(pipeline.getByText('llama4b-qnn.pte', { exact: true }).first()).toBeVisible();
    await pipeline.getByRole('button', { name: 'Core ML', exact: true }).click();
    await expect(pipeline).toHaveAttribute('data-backend', 'coreml');
    await expect(pipeline.getByText('llama4b-coreml.pte', { exact: true }).first()).toBeVisible();

    const coverage = page.locator('[data-delegation-coverage]');
    await expect(coverage).toHaveAttribute('data-scenario', 'attention');
    await expect(coverage.getByText('94.2%', { exact: true })).toBeVisible();
    await expect(coverage.getByText('50.3%', { exact: true })).toBeVisible();
    await expect(coverage.getByText('768 MiB', { exact: true })).toBeVisible();
    await coverage.getByRole('button', { name: 'Shape fallback', exact: true }).click();
    await expect(coverage.getByText('42.6%', { exact: true })).toBeVisible();
    await expect(coverage.getByText('85.7%', { exact: true })).toBeVisible();

    const release = page.locator('[data-device-release-lab]');
    await expect(release).toHaveAttribute('data-release', 'reject');
    await expect(release.getByText('4.10 GiB', { exact: true })).toBeVisible();
    await expect(release.getByText('6.24 s', { exact: true })).toBeVisible();
    await expect(release.getByText('5.8 tok/s', { exact: true })).toBeVisible();
    await expect(release.getByText('62 mJ', { exact: true })).toBeVisible();
    await release.getByRole('button', { name: 'Full delegate', exact: true }).click();
    await release.getByRole('button', { name: 'Cold', exact: true }).click();
    await expect(release).toHaveAttribute('data-release', 'approve');
    await expect(release.getByText('2.80 s', { exact: true })).toBeVisible();
    await expect(release.getByText('14.8 tok/s', { exact: true })).toBeVisible();
    await expect(release.getByText('42 mJ', { exact: true })).toBeVisible();

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
      rawLatex: /\\\\(?:underbrace|operatorname|begin)/.test((element as HTMLElement).innerText ?? ''),
    })));
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.rawLatex).toBe(false);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('On-device sidebar and category expose runtime before the budget foundation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-efficiency`, { waitUntil: 'networkidle' });

  const route = page.locator('[data-topdown-research-route="efficient-inference-on-device"]');
  await expect(route).toBeVisible();
  await expect(route.locator('[data-route-stage="current"]').getByText('ExecuTorch 1.3 · Exporting LLMs', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /00 · Device Runtime/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /01 · Memory·속도 예산/ }).first()).toBeVisible();

  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  const branches = page.locator('[data-subcategory-branches]');
  expect(await branches.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai?sub=ai-llm-efficiency-runtime',
    '/lab/blog/ai?sub=ai-llm-efficiency-budget',
  ]);

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-efficiency-runtime`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: '00 · Device Runtime' })).toBeVisible();
  await expect(page.getByRole('link', { name: /On-device LLM Runtime/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /효율 추론과 On-device AI/ })).toHaveCount(0);

  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-efficiency-budget`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: '01 · Memory·속도 예산' })).toBeVisible();
  await expect(page.getByRole('link', { name: /효율 추론과 On-device AI/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /On-device LLM Runtime/ })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('The budget article uses scan-friendly decision cells without horizontal tables', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/efficient-inference-on-device`, { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText('token 하나의 최소 생성 시간');
  await expect(page.locator('body')).toContainText('전체 MTP 학습 손실');
  await expect(page.locator('body')).toContainText('speculative decoding의 근사 speedup');
  await expect(page.getByText('Low-bit를 넣는 네 경로', { exact: true })).toBeVisible();
  await expect(page.getByText('Device 자원에 일을 배치하는 기준', { exact: true })).toBeVisible();
  await expect(page.locator('article table')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
