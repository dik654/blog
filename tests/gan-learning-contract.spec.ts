import { expect, test } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';

async function expectNoOverflow(page: import('@playwright/test').Page) {
  expect(await page.evaluate(() => (
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  ))).toBeLessThanOrEqual(1);

  const offenders = await page.locator('main').evaluate((main) => (
    [main, ...Array.from(main.querySelectorAll<HTMLElement>('*'))]
      .filter((node) => node.scrollWidth - node.clientWidth > 2)
      .filter((node) => {
        const style = getComputedStyle(node);
        return style.overflowX === 'auto' || style.overflowX === 'scroll';
      })
      .map((node) => ({
        tag: node.tagName,
        delta: node.scrollWidth - node.clientWidth,
        className: node.className,
      }))
  ));
  expect(offenders).toEqual([]);
}

test('GAN article separates optimizer saturation, coverage and the next model contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/gan`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-learning-question]')).toHaveCount(4);
  await expect(page.locator('[data-concept-primer]')).toHaveCount(1);
  await expect(page.locator('[data-gan-signal-lab]')).toHaveCount(1);
  await expect(page.getByText('WGAN-GP · critic 입력 기울기 penalty', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '왜 여기서 Diffusion이 등장하는가', exact: true })).toBeVisible();
  await expect(page.getByText('여기서 멈춘다.', { exact: true })).toBeVisible();
  await expect(page.getByText('근거와 더 읽을 자료', { exact: true })).toBeVisible();

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toContain(String.raw`\nabla`);
  expect(bodyText).not.toContain(String.raw`\mathbb`);
  expect(bodyText).toContain('sampled path의 soft penalty');
  await expectNoOverflow(page);
});

test('signal contract lab changes diagnosis, cost and next article causally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/gan`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-gan-signal-lab]');
  await expect(lab.getByRole('button', { name: /^Support가 떨어짐/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.getByRole('button', { name: /^반복 sampling 허용/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-gan-diagnosis]')).toContainText('두 실패를 분리한다');
  await expect(lab.locator('[data-gan-cost]')).toContainText('denoiser를 여러 번 평가');
  await expect(lab.locator('[data-gan-decision]')).toHaveAttribute('data-gan-decision', 'compare-diffusion');
  await expect(lab.getByRole('link', { name: /Diffusion의 고정 noise target/ })).toBeVisible();

  await lab.getByRole('button', { name: /^한 번의 forward 필요/ }).click();
  await expect(lab.locator('[data-gan-decision]')).toHaveAttribute('data-gan-decision', 'repair-gan');
  await expect(lab.locator('[data-gan-cost]')).toContainText('샘플은 G 한 번');
  await expect(lab.getByRole('link', { name: /생성 모델의 네 가지 분포 학습 계약/ })).toBeVisible();

  await lab.getByRole('button', { name: /^일부 겹침/ }).click();
  await expect(lab.locator('[data-gan-diagnosis]')).toContainText('판별 경계의 신호는 남아 있다');
  await expect(lab.locator('[data-gan-repair]')).toContainText('고정 latent grid');
  await expectNoOverflow(page);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 },
]) {
  test(`GAN causal lab and equations remain readable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}/lab/blog/ai/gan`, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-gan-signal-lab]');
    const controls = await lab.locator('button').evaluateAll((buttons) => (
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
    ));
    expect(controls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();

    const formulaScale = await page.locator('.katex-display').evaluateAll((nodes) => (
      nodes.map((node) => Number(getComputedStyle(node).getPropertyValue('--math-scale') || '1'))
    ));
    expect(formulaScale.every((scale) => scale >= 1)).toBeTruthy();
    await expectNoOverflow(page);
  });
}

test('direct scroll keeps the GAN decision lab below the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/gan`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });

  const lab = page.locator('[data-gan-signal-lab]');
  await lab.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.waitForFunction(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const target = document.querySelector('[data-gan-signal-lab]')?.getBoundingClientRect();
    return Boolean(header && target && target.top <= header.bottom + 40);
  });
  const geometry = await page.evaluate(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const target = document.querySelector('[data-gan-signal-lab]')?.getBoundingClientRect();
    return {
      headerBottom: header?.bottom ?? 0,
      targetTop: target?.top ?? -1,
    };
  });

  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.headerBottom);
  expect(geometry.targetTop).toBeLessThanOrEqual(geometry.headerBottom + 40);
  await expect(lab.getByRole('button', { name: /^Support가 떨어짐/ })).toBeVisible();
});
