import { expect, test } from '@playwright/test';
import { getArticle } from '../src/content';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

test('ROS 2 runtime metadata exposes qualification after the end-to-end deadline', () => {
  const article = getArticle('ai', 'robot-ros2-runtime-communication')?.article;
  expect(article).toBeDefined();
  expect(article!.sections?.at(-2)?.id).toBe('end-to-end-deadline');
  expect(article!.sections?.at(-1)?.id).toBe('qualification');
  expect(article!.summary).toContain('fault-injection release gate');
});

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`${viewport.name} qualifies ROS 2 faults without overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/robot-ros2-runtime-communication`, { waitUntil: 'networkidle' });

    const section = page.locator('#qualification');
    const lab = section.locator('[data-ros2-qualification-lab]');
    await expect(section).toBeVisible();
    await expect(lab).toBeVisible();
    await expect(section.locator('.katex-display')).toHaveCount(2);
    await expect(section.getByText('BASELINE PASS · SUITE NO-GO', { exact: true })).toHaveClass(/text-red-/);
    await expect(lab.getByText('61 ms', { exact: true })).toBeVisible();

    await lab.getByRole('button', { name: 'DDS burst' }).click();
    await expect(section.getByText('NO-GO · DEGRADE', { exact: true })).toBeVisible();
    await expect(lab.getByText('83 ms', { exact: true })).toBeVisible();
    await expect(lab).toContainText('21/12 ms');

    await lab.getByRole('button', { name: 'Clock jump' }).click();
    await expect(section.getByText('NO-GO · CANCEL · STOP', { exact: true })).toBeVisible();
    await expect(lab.getByText('TIME CLOSED', { exact: true })).toBeVisible();

    await lab.getByRole('button', { name: 'Priority inversion' }).click();
    await expect(lab).toContainText('47/30 ms');
    await expect(lab).toContainText('R_stop = 12 ms + B_H = 47 ms > 30 ms');

    await lab.getByRole('button', { name: 'Restart history' }).click();
    await expect(lab.getByText('EPOCH CLOSED', { exact: true })).toBeVisible();

    await lab.getByRole('button', { name: 'Inactive node' }).click();
    await expect(lab.getByText('LIFECYCLE CLOSED', { exact: true })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const clipping = await lab.evaluate((root) => {
      const bounds = root.getBoundingClientRect();
      return [...root.querySelectorAll<HTMLElement>('button, p, span, strong')].filter((node) => {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = node.getBoundingClientRect();
        return rect.right > bounds.right + 1 || rect.left < bounds.left - 1;
      }).length;
    });
    expect(clipping).toBe(0);

    const formulas = section.locator('[data-math-fit]');
    for (let index = 0; index < await formulas.count(); index += 1) {
      const audit = await formulas.nth(index).evaluate((node) => ({
        overflow: node.scrollWidth - node.clientWidth,
        scale: Number(node.dataset.mathScale ?? '1'),
      }));
      expect(audit.overflow).toBeLessThanOrEqual(1);
      expect(audit.scale).toBeGreaterThanOrEqual(0.75);
    }
  });
}

test('ROS queue and bound worksheet expose their assumptions instead of hidden safety claims', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-ros2-runtime-communication`, { waitUntil: 'networkidle' });

  const queue = page.locator('#queue-overload figure');
  await expect(queue).toContainText('5/8');
  await expect(queue).toContainText('1292 ms');
  await queue.getByLabel(/Observation window/).fill('2000');
  await expect(queue.getByText('PUBLISHER BLOCKED', { exact: true })).toBeVisible();
  await expect(queue).toContainText('8/8');

  const worksheet = page.locator('#end-to-end-deadline figure');
  await expect(worksheet.getByText('ILLUSTRATIVE · NOT A RELEASE GATE', { exact: true })).toBeVisible();
  await worksheet.getByLabel(/입력이 분석·측정된 상한인가/).check();
  await expect(worksheet.getByText('DECLARED BOUNDS FIT', { exact: true })).toBeVisible();
  await worksheet.getByRole('button', { name: 'Time-driven', exact: true }).click();
  await expect(worksheet.getByText('BOUND EXCEEDS ALLOCATION', { exact: true })).toBeVisible();
});

test('ROS formula annotations explain operations in Korean', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(`${base}/lab/blog/ai/robot-ros2-runtime-communication`, { waitUntil: 'networkidle' });

  const articleMath = await page.locator('main .katex-display').allTextContents();
  const rendered = articleMath.join(' ');
  for (const staleLabel of [
    'queue utilization',
    'nominal period',
    'window와 source jitter',
    'high-priority blocking',
    'stage allocation',
  ]) {
    expect(rendered).not.toContain(staleLabel);
  }
  expect(rendered).toContain('처리 용량 사용률');
  expect(rendered).toContain('관찰 중 늘어난 대기 수');
  expect(rendered).toContain('관찰 구간에 도착 흔들림을 더함');
  expect(rendered).toContain('각 단계가 자기 예산 안에 있음');

  const formulas = page.locator('main [data-math-fit]');
  for (let index = 0; index < await formulas.count(); index += 1) {
    expect(Number(await formulas.nth(index).getAttribute('data-math-scale'))).toBeGreaterThanOrEqual(0.75);
  }
});

test('ROS lifecycle keeps keyboard focus and executor labels remain readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/robot-ros2-runtime-communication`, { waitUntil: 'networkidle' });

  const lifecycle = page.locator('#lifecycle-supervision figure');
  await lifecycle.getByRole('button', { name: '→ inactive', exact: true }).click();
  await expect(lifecycle.getByRole('button', { name: '• inactive', exact: true })).toBeFocused();
  await lifecycle.getByRole('button', { name: '→ active', exact: true }).click();
  await expect(lifecycle.getByRole('button', { name: '• active', exact: true })).toBeFocused();
  await lifecycle.getByRole('button', { name: 'Fault 주입', exact: true }).click();
  await expect(lifecycle.getByRole('button', { name: 'Fault 주입', exact: true })).toBeFocused();

  const timeline = page.locator('#executor-callbacks figure');
  const taskFonts = await timeline.locator('[aria-label="image"], [aria-label="IMU"], [aria-label="watchdog"], [aria-label="service done"]').evaluateAll(
    (nodes) => nodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
  );
  expect(taskFonts.length).toBeGreaterThan(0);
  expect(taskFonts.every((size) => size >= 10)).toBe(true);
});
