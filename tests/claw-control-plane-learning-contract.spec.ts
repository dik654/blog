import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

test('Claw sidebar paths preserve causal reading order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-claw-core`, { waitUntil: 'networkidle' });
  const core = page.locator('[data-authored-learning-path="ai-claw-core"]');
  await expect(core).toBeVisible();
  expect(await core.getByRole('link').evaluateAll((links) => (
    links.map((link) => link.getAttribute('href'))
  ))).toEqual([
    '/lab/blog/ai/claw-overview',
    '/lab/blog/ai/claw-session',
    '/lab/blog/ai/claw-compaction',
    '/lab/blog/ai/claw-tool-system',
  ]);

  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-claw-ops`, { waitUntil: 'networkidle' });
  const operations = page.locator('[data-authored-learning-path="ai-claw-ops"]');
  await expect(operations).toBeVisible();
  expect(await operations.getByRole('link').evaluateAll((links) => (
    links.map((link) => link.getAttribute('href'))
  ))).toEqual([
    '/lab/blog/ai/claw-task-team',
    '/lab/blog/ai/claw-subagent-orchestration',
    '/lab/blog/ai/claw-policy-engine',
    '/lab/blog/ai/claw-telemetry',
    '/lab/blog/ai/claw-recovery',
  ]);
});

test('task control article separates records from execution evidence', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/claw-task-team`, { waitUntil: 'networkidle' });
  const body = page.locator('body');

  await expect(page.getByRole('heading', { name: '먼저 레코드 생성과 실행을 떼어 놓는다' })).toBeVisible();
  await expect(body).toContainText('Arc<Mutex<HashMap<String, Task>>>');
  await expect(body).toContainText('TeamCreate는 schema와 executor가 다른 필드를 본다');
  await expect(body).toContainText('task_id를 더 넣는 것 자체는 JSON Schema상 허용');
  await expect(body).toContainText('disable_matching_crons');
  await expect(body).toContainText('parser, next-run 계산, clock loop, task spawn, lease와 record_run 호출이 없다');
  await expect(body).not.toContainText('CronScheduler');
  await expect(body).not.toContainText('resolve_scope');
  await expect(body).not.toContainText('check_completion');

  const lab = page.locator('[data-task-control-plane-lab]');
  await page.getByRole('tab', { name: 'Task' }).click();
  await expect(lab).toHaveAttribute('data-active-tab', 'task');
  await expect(lab).toContainText('worker spawn');

  await page.getByRole('tab', { name: 'Team' }).click();
  await expect(lab).toHaveAttribute('data-active-tab', 'team');
  await expect(lab).toContainText('task_ids = []');

  await page.getByRole('tab', { name: 'Cron' }).click();
  await expect(lab).toHaveAttribute('data-active-tab', 'cron');
  await expect(lab).toContainText('lease·중복 실행 방지');
});

test('session lab distinguishes saved conversation from external effects', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/claw-session`, { waitUntil: 'networkidle' });
  const lab = page.locator('[data-session-state-lab]');
  await expect(lab).toBeVisible();

  await page.getByRole('tab', { name: 'Forked' }).click();
  await expect(lab).toHaveAttribute('data-active-state', 'forked');
  await expect(lab).toContainText('side effect rollback');

  await page.getByRole('tab', { name: 'Effect' }).click();
  await expect(lab).toHaveAttribute('data-active-state', 'effect');
  await expect(lab).toContainText('실제 상태를 다시 읽기 전에는 완료가 아니다');
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`new Claw labs remain readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of ['claw-overview', 'claw-session', 'claw-task-team']) {
      await page.goto(`${base}/lab/blog/ai/${route}`, { waitUntil: 'networkidle' });
      await expect(page.locator('.katex-error')).toHaveCount(0);

      const layout = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const lab = document.querySelector<HTMLElement>(
          '[data-overview-boundary-lab], [data-session-state-lab], [data-task-control-plane-lab]',
        );
        const controls = lab
          ? [...lab.querySelectorAll<HTMLElement>('button, [role="tab"]')].map((element) => {
            const rect = element.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
          })
          : [];
        return {
          documentOverflow: document.documentElement.scrollWidth - viewportWidth,
          labOverflow: lab ? lab.scrollWidth - lab.clientWidth : -1,
          labBounds: lab ? lab.getBoundingClientRect().right - viewportWidth : -1,
          controls,
          svgTextCount: lab?.querySelectorAll('svg text').length ?? -1,
        };
      });

      expect(layout.documentOverflow, route).toBeLessThanOrEqual(1);
      expect(layout.labOverflow, route).toBeLessThanOrEqual(1);
      expect(layout.labBounds, route).toBeLessThanOrEqual(2);
      expect(layout.svgTextCount, route).toBe(0);
      for (const control of layout.controls) {
        expect(control.height, `${route} control height`).toBeGreaterThanOrEqual(44);
      }
    }
  });
}
