import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

const routes = [
  'time-series-forecasting-evaluation',
  'arima',
  'lstm-timeseries',
  'time-series-anomaly-detection',
  'ecod',
] as const;

async function expectPageContract(page: Page, slug: string, width: number) {
  await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'networkidle' });

  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )).toBeLessThanOrEqual(1);

  const rawLatex = await page.locator('main').evaluate((main) => {
    const text = (main as HTMLElement).innerText;
    return /\\(?:theta|tau|partial|begin|frac|underbrace|mathrm)\b/.test(text);
  });
  expect(rawLatex).toBe(false);

  const mathScales = await page.locator('[data-math-scale]').evaluateAll((nodes) =>
    nodes
      .filter((node) => node.getClientRects().length > 0)
      .map((node) => Number(node.getAttribute('data-math-scale') ?? '1')),
  );
  expect(Math.min(...mathScales)).toBeGreaterThanOrEqual(0.72);
}

for (const width of [390, 1440]) {
  for (const slug of routes) {
    test(`${slug} keeps article, KaTeX, and width contracts at ${width}px`, async ({ page }) => {
      await expectPageContract(page, slug, width);
    });
  }
}

test('forecast evaluation labs remain readable and interactive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/time-series-forecasting-evaluation`, { waitUntil: 'networkidle' });

  const contract = page.locator('[data-forecast-contract]');
  await contract.getByRole('button', { name: /실측 날씨/ }).click();
  await expect(contract).toContainText('그대로는 누출');
  await expect(contract).toContainText('기상 예보 snapshot');

  const rolling = page.locator('[data-rolling-origin]');
  await rolling.getByLabel('평가 origin 수').fill('8');
  await expect(rolling.locator('[data-rolling-fold]')).toHaveCount(8);
  await expect(page.locator('[data-weight-normalization-contract]')).toContainText('Weight를 10, 30으로 모두 10배해도');

  const minimumTextSize = await page.locator(
    '[data-forecast-contract], [data-rolling-origin]',
  ).evaluateAll((roots) => {
    const sizes = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(
      'p, span, strong, dt, dd, button, label',
    ))
      .filter((element) => element.textContent?.trim() && element.getClientRects().length > 0)
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    return Math.min(...sizes);
  });
  expect(minimumTextSize).toBeGreaterThanOrEqual(12);
  expect(await rolling.locator('input[type="range"]').evaluateAll((inputs) =>
    Math.min(...inputs.map((input) => input.getBoundingClientRect().height)),
  )).toBeGreaterThanOrEqual(44);
});

test('ARIMA labs change arithmetic, statistical bands, and release decisions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/arima`, { waitUntil: 'networkidle' });

  const components = page.locator('[data-arima-components-lab]');
  await expect(components.locator('[data-arima-next-level]')).toContainText('123.40');
  await components.getByRole('slider', { name: 'AR 계수 φ₁' }).fill('0.2');
  await expect(components.locator('[data-arima-next-level]')).toContainText('121.00');

  const pipeline = page.locator('[data-arima-pipeline-lab]');
  await pipeline.getByRole('button', { name: 'step 2' }).click();
  const treatment = pipeline.locator('[data-arima-treatment-lab]');
  await expect(treatment.locator('[data-arima-treatment-result]')).toContainText('step 변수');
  await treatment.getByRole('button', { name: /영구 level shift/ }).click();
  await expect(treatment.locator('[data-arima-treatment-result]')).not.toContainText('step 변수');

  await pipeline.getByRole('button', { name: 'step 3' }).click();
  const correlations = pipeline.locator('[data-arima-correlation-lab]');
  await correlations.getByRole('slider', { name: 'ACF 표본 수' }).fill('64');
  await expect(correlations.locator('[data-arima-band]')).toContainText('±0.245');
  await correlations.getByRole('button', { name: 'MA형' }).click();
  await pipeline.getByRole('button', { name: 'step 4' }).click();
  await expect(pipeline.locator('[data-arima-candidates]')).toContainText('ARIMA(0,d,1)');

  await pipeline.getByRole('button', { name: 'step 5' }).click();
  await pipeline.getByRole('button', { name: '백색잡음형' }).click();
  await expect(pipeline.locator('[data-arima-residual-next]')).toContainText('바깥 24-step 검증');
  await pipeline.getByRole('button', { name: 'step 6' }).click();
  await pipeline.getByRole('button', { name: 'h = 1' }).click();
  await expect(pipeline.locator('[data-diagnostic-decision]')).toHaveText('선택한 h=1 진단 · 통과');
  await expect(pipeline.locator('[data-release-decision]')).toHaveText('출시 보류');
  await expect(pipeline).toContainText('production H=24');
  await expect(pipeline).toContainText('교육용 고정 fixture');
  await pipeline.getByRole('button', { name: 'step 5' }).click();
  await pipeline.getByRole('button', { name: '자기상관' }).click();
  await pipeline.getByRole('button', { name: 'step 6' }).click();
  await expect(pipeline.locator('[data-release-decision]')).toHaveText('출시 보류');
  await expect(pipeline).toContainText('lag 구조가 남음');
  await pipeline.getByRole('button', { name: 'step 5' }).click();
  await pipeline.getByRole('button', { name: '백색잡음형' }).click();
  await pipeline.getByRole('button', { name: 'step 6' }).click();
  await pipeline.getByRole('button', { name: 'h = 24' }).click();
  await expect(pipeline.locator('[data-release-decision]')).toHaveText('출시 보류');

  const audit = await page.locator(
    '[data-arima-components-lab], [data-arima-pipeline-lab]',
  ).evaluateAll((roots) => {
    const elements = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(
      'p, span, strong, button, label, output',
    )).filter((element) => element.textContent?.trim() && element.getClientRects().length > 0));
    const controlHeights = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(
      'button, input',
    )).filter((element) => element.getClientRects().length > 0)
      .map((element) => element.getBoundingClientRect().height));
    return {
      minText: Math.min(...elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize))),
      minControl: Math.min(...controlHeights),
      overflow: roots.map((root) => root.scrollWidth - root.clientWidth),
    };
  });
  expect(audit.minText).toBeGreaterThanOrEqual(12);
  expect(audit.minControl).toBeGreaterThanOrEqual(44);
  expect(audit.overflow.every((amount) => amount <= 1)).toBe(true);
});

for (const width of [360, 768]) {
  test(`ARIMA all visual stages fit the ${width}px responsive boundary`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 800 : 1024 });
    await page.goto(`${base}/lab/blog/ai/arima`, { waitUntil: 'networkidle' });

    const visualizations = page.locator('[data-step-viz]');
    for (let viz = 0; viz < await visualizations.count(); viz += 1) {
      const root = visualizations.nth(viz);
      const steps = root.getByRole('button', { name: /step \d/ });
      for (let step = 0; step < await steps.count(); step += 1) {
        await steps.nth(step).click();
        const overflow = await root.locator('[data-step-viz-stage]').evaluate(
          (stage) => stage.scrollWidth - stage.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
      }
    }

    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )).toBeLessThanOrEqual(1);
  });
}

test('LSTM labs expose cell arithmetic, causal windows, and readable labels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/lstm-timeseries`, { waitUntil: 'networkidle' });

  const gradient = page.locator('[data-memory-gradient-lab]');
  await gradient.getByLabel('역전파 거리').fill('12');
  await gradient.getByLabel('LSTM forget gate 유지율').fill('0.99');
  await expect(gradient).toContainText('8.86e-1');

  const cell = page.locator('[data-lstm-cell-lab]');
  await cell.getByLabel('Forget gate 값').fill('0.5');
  await cell.getByLabel('Input gate 값').fill('0.5');
  await cell.getByRole('button', { name: /Cell 갱신/ }).click();
  await expect(cell).toContainText('0.70');

  const window = page.locator('[data-window-sliding]');
  await expect(window).toContainText('X = [12, 15, 13, 18] → y = 20');
  await window.getByRole('button', { name: '윈도우를 한 칸 다음으로 이동' }).click();
  await expect(window).toContainText('X = [15, 13, 18, 20] → y = 22');

  const minimumTextSize = await page.locator(
    '[data-memory-gradient-lab], [data-lstm-cell-lab], [data-window-sliding], [data-lstm-training-flow], [data-sequence-model-choice]',
  ).evaluateAll((roots) => {
    const sizes = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(
      'p, span, strong, code, button, label',
    ))
      .filter((element) => element.textContent?.trim() && element.getClientRects().length > 0)
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    return Math.min(...sizes);
  });
  expect(minimumTextSize).toBeGreaterThanOrEqual(12);
  expect(await page.locator(
    '[data-memory-gradient-lab] input[type="range"], [data-lstm-cell-lab] input[type="range"]',
  ).evaluateAll((inputs) => Math.min(...inputs.map((input) => input.getBoundingClientRect().height))))
    .toBeGreaterThanOrEqual(44);
  await expect(page.locator('[data-lstm-gate-equations] .katex-error')).toHaveCount(0);
});

test('anomaly labs distinguish anomaly type and alert incidents', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/time-series-anomaly-detection`, { waitUntil: 'networkidle' });

  const types = page.locator('[data-anomaly-type-lab]');
  await types.getByRole('button', { name: /맥락 이상/ }).click();
  await expect(types).toContainText('새벽 기대값 20 근처에서는 이상');
  await types.getByRole('button', { name: /구간 이상/ }).click();
  await expect(types).toContainText('여섯 시점 동안 기대값보다 계속 높다');

  const events = page.locator('[data-alert-event-lab]');
  const threshold = events.getByLabel('이상 점수 threshold');
  await threshold.fill('2.5');
  await events.getByRole('button', { name: '연속만' }).click();
  await expect(events).toContainText('기각 후보1건');
  await expect(events).toContainText('운영 사건2건');
  await expect(events.locator('[data-point-state="rejected"]')).toHaveCount(1);
  await expect(events.locator('[data-point-state="incident"]')).toHaveCount(5);
  await threshold.focus();
  for (let step = 0; step < 5; step += 1) await page.keyboard.press('ArrowRight');
  await events.getByRole('button', { name: '1칸 허용' }).click();
  await expect(events).toContainText('점 알람');
  await expect(events).toContainText('운영 사건');

  const minimumTextSize = await page.locator(
    '[data-anomaly-type-lab], [data-alert-event-lab]',
  ).evaluateAll((roots) => {
    const sizes = roots.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(
      'p, span, strong, button, label',
    ))
      .filter((element) => element.textContent?.trim() && element.getClientRects().length > 0)
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    return Math.min(...sizes);
  });
  expect(minimumTextSize).toBeGreaterThanOrEqual(12);
  expect(await events.locator('input[type="range"], button').evaluateAll((controls) =>
    Math.min(...controls.map((control) => control.getBoundingClientRect().height)),
  )).toBeGreaterThanOrEqual(44);
});

test('ECOD uses a readable mobile HTML visualization instead of scaled SVG text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/ecod`, { waitUntil: 'networkidle' });

  const pipeline = page.getByRole('img', {
    name: '관측값의 순위에서 ECDF 꼬리확률과 이상치 점수를 계산하는 과정',
  }).filter({ visible: true }).first();
  await expect(pipeline).toBeVisible();
  await expect(pipeline).toContainText('정렬된 관측값');
  const stepViz = page.locator('[data-step-viz]').first();
  for (let step = 0; step < 3; step += 1) await stepViz.getByRole('button', { name: '다음 장면' }).click();
  await expect(pipeline).toContainText('작은 오른쪽 꼬리확률 1/13');

  const minimumTextSize = await pipeline.locator('p, span, strong').evaluateAll((elements) =>
    Math.min(...elements
      .filter((element) => element.textContent?.trim() && element.getClientRects().length > 0)
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize))),
  );
  expect(minimumTextSize).toBeGreaterThanOrEqual(12);
});

test('time-series category branches before the forecasting and anomaly tracks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-timeseries`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-topdown-research-route]')).toHaveCount(0);
  await expect(page.locator('[data-authored-article-sequences]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 2, name: '먼저 운영 결정을 하나 고릅니다' })).toBeVisible();
  await expect(page.locator('[data-child-navigation-item="ai-timeseries-forecast"] a')).toHaveAttribute(
    'href',
    '/lab/blog/ai?sub=ai-timeseries-forecast',
  );
  await expect(page.locator('[data-child-navigation-item="ai-timeseries-anomaly"] a')).toHaveAttribute(
    'href',
    '/lab/blog/ai?sub=ai-timeseries-anomaly',
  );
});
