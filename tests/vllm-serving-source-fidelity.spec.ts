import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4176';

test('vLLM serving exposes only vendored source with exact execution semantics', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('button', { name: /소스 코드 보기/ })).toHaveCount(0);

  await page.getByRole('button', { name: '{ } EngineCore.step', exact: true }).click();
  let source = await page.locator('aside').filter({ hasText: 'L378-407' }).innerText();
  expect(source).toContain('vllm/v1/engine/core.py');
  expect(source).toContain('L378-407');
  expect(source).toContain('return engine_core_outputs, scheduler_output.total_num_scheduled_tokens > 0');
  expect(source).not.toContain('return engine_core_outputs, True');

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '{ } EngineCore.__init__', exact: true }).click();
  source = await page.locator('aside').filter({ hasText: 'L85-148' }).innerText();
  expect(source).toContain('L85-148');
  expect(source).toContain('self.scheduler: SchedulerInterface = Scheduler(');

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '{ } GPU worker', exact: true }).click();
  source = await page.locator('aside').filter({ hasText: 'L759-820' }).innerText();
  expect(source).toContain('vllm/v1/worker/gpu_worker.py');
  expect(source).toContain('L759-820');
  expect(source).toContain('self.model_runner.execute_model(');

  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
