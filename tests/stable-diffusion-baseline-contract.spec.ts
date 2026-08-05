import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';
const path = '/lab/blog/ai/stable-diffusion-open-models';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

async function visibleHeight(locator: ReturnType<import('@playwright/test').Page['locator']>) {
  return locator.evaluate((node) => node.getBoundingClientRect().height);
}

for (const viewport of viewports) {
  test(`Stable Diffusion minimum baseline contract at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole('heading', { name: /Stable Diffusion 내부 구현/, level: 1 })).toBeVisible();
    await expect(page.getByText('선택형 최소 구현 기준선')).toBeVisible();
    await expect(page.getByText('막힐 때만 · 수학 보강')).toBeVisible();
    await expect(page.locator('[data-math-fit]')).toHaveCount(10);
    await expect(page.locator('[data-formula-note]')).toHaveCount(10);

    const runtime = page.locator('[data-sd-runtime-lab]');
    const architecture = page.locator('[data-sd-architecture-lab]');
    await expect(runtime).toHaveAttribute('data-loop-visible', 'true');
    await expect(runtime.getByText('zₜ₋₁를 다음 입력으로 되돌려 N step 반복')).toBeVisible();
    await expect(architecture).toHaveAttribute('data-architecture', 'unet');
    await expect(runtime.locator('svg:not(.lucide)')).toHaveCount(0);
    await expect(architecture.locator('svg:not(.lucide)')).toHaveCount(0);

    const runtimeHeights: number[] = [];
    for (const phase of ['조건 만들기', '작업 공간 준비', 'Noise 예측', '한 단계 이동', '화면으로 복원']) {
      await runtime.getByRole('button', { name: phase }).click();
      runtimeHeights.push(await visibleHeight(runtime));
    }
    expect(Math.max(...runtimeHeights) - Math.min(...runtimeHeights)).toBeLessThanOrEqual(2);
    await expect(runtime).toHaveAttribute('data-phase', 'decode');
    await expect(runtime.getByText('VAE decoder').first()).toBeVisible();
    await expect(runtime.getByText('색·경계·작은 detail')).toBeVisible();

    const architectureHeights: number[] = [];
    for (const mode of ['U-Net · SDXL', 'MMDiT · SD3']) {
      await architecture.getByRole('button', { name: mode }).click();
      architectureHeights.push(await visibleHeight(architecture));
    }
    expect(Math.max(...architectureHeights) - Math.min(...architectureHeights)).toBeLessThanOrEqual(2);
    await expect(architecture).toHaveAttribute('data-architecture', 'mmdit');
    await expect(architecture.getByText('공동 어텐션', { exact: true })).toBeVisible();
    await expect(architecture.getByText(/attention·MLP target 재선정/)).toBeVisible();

    const geometry = await page.evaluate(() => {
      const labs = Array.from(document.querySelectorAll<HTMLElement>('[data-sd-runtime-lab], [data-sd-architecture-lab]'));
      const visible = (node: HTMLElement) => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      };
      const labels = labs.flatMap((lab) =>
        Array.from(lab.querySelectorAll<HTMLElement>('button, p, span, dt, dd')).filter(visible),
      );
      const controls = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>('button')).filter(visible));
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        labOverflow: labs.map((lab) => lab.scrollWidth - lab.clientWidth),
        minLabelFont: Math.min(...labels.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))),
        minControlHeight: Math.min(...controls.map((node) => node.getBoundingClientRect().height)),
        rawLatex: /\\(?:theta|underbrace|begin\{|frac\{|mathbb)/.test(document.body.innerText),
      };
    });

    expect(geometry.documentOverflow).toBeLessThanOrEqual(1);
    expect(geometry.labOverflow.every((value) => value <= 1)).toBe(true);
    expect(geometry.minLabelFont).toBeGreaterThanOrEqual(12);
    expect(geometry.minControlHeight).toBeGreaterThanOrEqual(44);
    expect(geometry.rawLatex).toBe(false);
  });
}
