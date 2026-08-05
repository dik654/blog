import { expect, test, type Locator } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function setRange(locator: Locator, value: number) {
  await locator.fill(String(value));
}

for (const viewport of viewports) {
  test(`PPO foundation contracts remain executable on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-ppo-continuous-control`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'PPO clipping은 어느 방향의 과도한 개선만 잘라내는가?' })).toBeVisible();
    await expect(page.locator('[data-ppo-clip]')).toBeVisible();
    await expect(page.locator('[data-gae-credit]')).toBeVisible();
    await expect(page.locator('[data-algorithm-chooser]')).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(7);
    await expect(page.locator('[data-formula-note]')).toHaveCount(6);
    await expect(page.locator('article table')).toHaveCount(0);

    const gae = page.locator('[data-gae-credit]');
    await expect(gae.locator('[data-gae-a0]')).toContainText('λ=0.95 · Â0=0.292');
    await gae.getByRole('button', { name: 'λ 0', exact: true }).click();
    await expect(gae.locator('[data-gae-a0]')).toContainText('λ=0 · Â0=0.280');
    await gae.getByRole('button', { name: 'λ 1', exact: true }).click();
    await expect(gae.locator('[data-gae-a0]')).toContainText('λ=1 · Â0=0.334');
    await gae.getByRole('button', { name: '시간 제한', exact: true }).click();
    await expect(gae.locator('[data-gae-boundary="truncation"]')).toContainText('terminal=0, V(s4)=0.35');
    await expect(gae.getByText('1.000 + 0.9·0.350 − 0.500', { exact: true })).toBeVisible();
    await expect(gae.getByText('rollout 경계라 GAE tail은 0 · V(s4)=0.35가 δ3에 반영', { exact: true })).toBeVisible();
    await expect(gae.locator('[data-gae-a0]')).toContainText('λ=1 · Â0=0.564');
    await gae.getByRole('button', { name: '환경 terminal', exact: true }).click();
    await expect(gae.locator('[data-gae-boundary="terminal"]')).toContainText('terminal=1');

    const clip = page.locator('[data-ppo-clip]');
    await expect(clip.getByText('ACTIVE', { exact: true })).toBeVisible();
    await setRange(clip.locator('input[type="range"]').first(), 1.4);
    await expect(clip.getByText('CLIPPED', { exact: true })).toBeVisible();
    await clip.getByRole('button', { name: 'Â -1' }).click();
    await setRange(clip.locator('input[type="range"]').first(), 0.6);
    await expect(clip.getByText('CLIPPED', { exact: true })).toBeVisible();

    const chooser = page.locator('[data-algorithm-chooser]');
    await expect(chooser.getByText('SAC', { exact: true }).last()).toBeVisible();
    await chooser.getByRole('checkbox', { name: 'Stochastic exploration' }).uncheck();
    await expect(chooser.getByText('TD3 / DDPG', { exact: true }).last()).toBeVisible();
    await chooser.getByRole('checkbox', { name: 'Replay 재사용 필요' }).uncheck();
    await expect(chooser.getByText('PPO', { exact: true }).last()).toBeVisible();
    await chooser.getByRole('checkbox', { name: 'Replay 재사용 필요' }).check();
    await chooser.getByRole('button', { name: 'Discrete', exact: true }).click();
    await expect(chooser.getByText('DQN 계열', { exact: true }).last()).toBeVisible();

    const layout = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const visualizations = Array.from(
        document.querySelectorAll<HTMLElement>('[data-ppo-clip], [data-gae-credit], [data-algorithm-chooser]'),
      );
      return {
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
        formulaMetrics: formulas.map((formula) => {
          const rendered = formula.querySelector<HTMLElement>('.katex-display') ?? formula.firstElementChild as HTMLElement;
          return {
            fontSize: Number.parseFloat(getComputedStyle(rendered).fontSize),
            overflow: formula.scrollWidth - formula.clientWidth,
            scale: formula.dataset.mathScale,
          };
        }),
        vizOverflow: visualizations.map((visualization) => visualization.scrollWidth - visualization.clientWidth),
      };
    });

    expect(layout.documentOverflow).toBeLessThanOrEqual(1);
    expect(Math.min(...layout.formulaMetrics.map((metric) => metric.fontSize))).toBeGreaterThanOrEqual(12);
    expect(Math.max(...layout.formulaMetrics.map((metric) => metric.overflow))).toBeLessThanOrEqual(1);
    expect(Math.max(...layout.vizOverflow)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
