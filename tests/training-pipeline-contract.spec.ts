import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`training pipeline preserves selection and held-out evaluation on ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/training-pipeline`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const logging = page.locator('[data-training-logging-viz] > [data-step-viz]');
    await expect(logging).toHaveCount(1);
    for (let step = 0; step < 4; step += 1) {
      await logging.getByRole('button', { name: '다음 장면' }).click();
    }
    await expect(logging).toContainText('Untouched test');
    await expect(logging).toContainText('Test를 보고 설정을 바꾸면 누수');

    const audit = await page.evaluate(() => ({
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      stageOverflow: [...document.querySelectorAll<HTMLElement>('[data-step-viz-stage]')]
        .map((stage) => stage.scrollWidth - stage.clientWidth)
        .filter((amount) => amount > 1),
      svgFontFloor: Math.min(...[...document.querySelectorAll<SVGTextElement>('[data-step-viz] svg text')]
        .map((node) => Number(node.getAttribute('font-size') ?? node.style.fontSize.replace('px', '') ?? 0))
        .filter((value) => Number.isFinite(value) && value > 0)),
    }));
    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.stageOverflow).toEqual([]);
    expect(audit.svgFontFloor).toBeGreaterThanOrEqual(9);
    expect(consoleErrors).toEqual([]);
  });
}

test('training pipeline avoids universal performance claims and deprecated AMP guidance', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/training-pipeline`, { waitUntil: 'domcontentloaded' });

  const body = page.locator('body');
  await expect(body).toContainText('GPU 하나당 2~4개를 출발점');
  await expect(body).toContainText('torch.amp.autocast("cuda")');
  await expect(body).toContainText('기본 initial scale은 65,536');
  await expect(body).toContainText('untouched test set을 한 번만 평가');
  await expect(body).toContainText('autocast가 op별로 dtype을 선택');
  await expect(body).toContainText('epoch_loss = loss_sum / sample_count');
  await expect(body).toContainText('Scheduler는 설정한 호출 주기(batch 또는 epoch)');
  await expect(body).not.toContainText('FP16 계산');
  await expect(body).not.toContainText('epoch_loss = running_loss / len(loader)');
  await expect(body).not.toContainText('CPU 코어 수의 2~4배');
  await expect(body).not.toContainText('2.5x 빠름');
  await expect(body).not.toContainText('44% 절약');
  await expect(body).not.toContainText('40~50% 절약');
  await expect(body).not.toContainText('1.5~2배');
  await expect(body).not.toContainText('loss * 1024');

  for (const href of [
    'https://docs.pytorch.org/docs/stable/amp',
    'https://docs.pytorch.org/tutorials/intermediate/intermediate_data_loading_tutorial.html',
    'https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html',
    'https://docs.pytorch.org/docs/main/generated/torch.use_deterministic_algorithms.html',
  ]) {
    await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
  }
});
