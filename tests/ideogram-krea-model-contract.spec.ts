import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const articles = [
  {
    slug: 'ideogram-4-typography-layout',
    heading: /Ideogram 4 내부 구조/,
    pathTitle: 'Ideogram 4 · 공통 Runtime에서 Typography·Layout 계약까지 학습 경로',
    currentStep: '2. Ideogram 4 사례',
    formulaCount: 3,
    viz: '[data-ideogram-control-flow]',
  },
  {
    slug: 'krea-2-foundation-model',
    heading: /Krea 2 내부 구조/,
    pathTitle: 'Krea 2 · 공통 Runtime에서 RAW→Turbo Lifecycle까지 학습 경로',
    currentStep: '2. Krea 2 사례',
    formulaCount: 2,
    viz: '[data-krea-lifecycle]',
  },
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of articles) {
    test(`${article.slug} keeps its learning and visual contract on ${viewport.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

      await expect(page.getByRole('heading', { level: 1, name: article.heading })).toBeVisible();
      await expect(page.locator(article.viz)).toBeVisible();
      await expect(page.locator('[data-step-viz]')).toHaveCount(1);
      await expect(page.locator('[data-formula-pair]')).toHaveCount(article.formulaCount);
      await expect(page.locator('[data-formula-note]')).toHaveCount(article.formulaCount);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(async () => page.locator('[data-math-fit]').evaluateAll((nodes) => nodes.every((node) => {
        const rendered = node.firstElementChild as HTMLElement | null;
        return rendered !== null && rendered.getBoundingClientRect().width - node.clientWidth <= 1;
      }))).toBe(true);

      const route = page.getByLabel(article.pathTitle);
      await expect(route).toBeVisible();
      await expect(route.getByRole('link')).toHaveCount(3);
      await expect(route.getByRole('link', { name: article.currentStep, exact: true }))
        .toHaveAttribute('aria-current', 'step');

      const audit = await page.evaluate(() => {
        const rawLatex = [...document.querySelectorAll<HTMLElement>('article p, article li, article h2, article h3')]
          .some((element) => /\\(?:underbrace|frac|sum|theta|tau|mathrm|hat)\b/.test(element.textContent ?? ''));
        const formulaOverflow = [...document.querySelectorAll<HTMLElement>('[data-math-fit]')]
          .map((element) => {
            const child = element.firstElementChild as HTMLElement | null;
            return child ? child.getBoundingClientRect().width - element.getBoundingClientRect().width : 0;
          });
        const vizOverflow = [...document.querySelectorAll<HTMLElement>('[data-step-viz], [data-step-viz-stage], [data-viz-canvas]')]
          .map((element) => element.scrollWidth - element.clientWidth);
        const clippedText = [...document.querySelectorAll<HTMLElement>('[data-step-viz-stage] p')]
          .filter((element) => {
            const style = getComputedStyle(element);
            return style.textOverflow !== 'ellipsis' && element.scrollWidth - element.clientWidth > 1;
          }).length;
        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          rawLatex,
          formulaOverflow,
          vizOverflow,
          clippedText,
        };
      });

      expect(audit.documentOverflow).toBeLessThanOrEqual(1);
      expect(audit.rawLatex).toBe(false);
      expect(Math.max(0, ...audit.formulaOverflow)).toBeLessThanOrEqual(1);
      expect(Math.max(0, ...audit.vizOverflow)).toBeLessThanOrEqual(1);
      expect(audit.clippedText).toBe(0);
      expect(consoleErrors).toEqual([]);
    });
  }
}

test('Ideogram trace closes on pixel, replay, and license evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/ideogram-4-typography-layout`, { waitUntil: 'networkidle' });

  const flow = page.locator('[data-ideogram-control-flow]');
  const controlsOffset = () => flow.locator('[data-step-viz]').evaluate((viz) => {
    const controls = viz.querySelector('.step-viz__controls');
    if (!(controls instanceof HTMLElement)) return Number.NaN;
    return controls.getBoundingClientRect().top - viz.getBoundingClientRect().top;
  });
  const controlsBefore = await controlsOffset();
  await flow.getByRole('button', { name: 'step 5', exact: true }).click();
  await expect(flow.locator('[data-step-viz-narrative]').last()).toContainText('Sampler와 VAE 뒤');
  await expect(flow.locator('[data-ideogram-stage="4"]').last()).toHaveAttribute('data-active', 'true');
  await expect(flow).toContainText('pixel · replay · license');
  await page.waitForTimeout(300);
  const controlsAfter = await controlsOffset();
  expect(Math.abs(controlsAfter - controlsBefore)).toBeLessThanOrEqual(2);

  const lab = flow.locator('[data-ideogram-contract-lab]');
  await expect(lab.locator('[data-contract-status]')).toHaveAttribute('data-contract-status', 'check');
  await lab.getByRole('button', { name: 'Structured JSON' }).click();
  await expect(lab.locator('[data-contract-status]')).toHaveAttribute('data-contract-status', 'pass');
  await lab.getByRole('button', { name: 'x축 역전' }).click();
  await expect(lab).toContainText('y-first box에서 시작 좌표가 끝 좌표보다 큽니다');
  await lab.getByRole('button', { name: '무조건부 · text 제거' }).click();
  await expect(lab).toContainText('unconditional pass에서 text token 제거');
});

test('Krea lifecycle keeps RAW and Turbo inference contracts separate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/krea-2-foundation-model`, { waitUntil: 'networkidle' });

  const flow = page.locator('[data-krea-lifecycle]');
  const controlsOffset = () => flow.locator('[data-step-viz]').evaluate((viz) => {
    const controls = viz.querySelector('.step-viz__controls');
    if (!(controls instanceof HTMLElement)) return Number.NaN;
    return controls.getBoundingClientRect().top - viz.getBoundingClientRect().top;
  });
  const controlsBefore = await controlsOffset();
  await flow.getByRole('button', { name: 'step 5', exact: true }).click();
  await expect(flow.locator('[data-step-viz-narrative]').last()).toContainText('RAW는 학습 artifact');
  await expect(flow.locator('[data-krea-stage="4"]').last()).toHaveAttribute('data-active', 'true');
  await expect(flow).toContainText('52 steps · CFG 3.5 · ≤1K');
  await expect(flow).toContainText('8 steps · CFG 0 · μ 1.15');
  await page.waitForTimeout(300);
  const controlsAfter = await controlsOffset();
  expect(Math.abs(controlsAfter - controlsBefore)).toBeLessThanOrEqual(2);

  const lab = flow.locator('[data-krea-runtime-lab]');
  await expect(lab.locator('[data-runtime-status]')).toHaveAttribute('data-runtime-status', 'pass');
  await lab.getByRole('button', { name: 'Turbo', exact: true }).click();
  await expect(lab.locator('[data-runtime-status]')).toHaveAttribute('data-runtime-status', 'invalid');
  await expect(lab).toContainText('LoRA·fine-tuning은 Turbo가 아니라 RAW artifact에서 시작합니다');
  await lab.getByRole('button', { name: 'Inference', exact: true }).click();
  await expect(lab.locator('[data-runtime-status]')).toHaveAttribute('data-runtime-status', 'pass');
  await lab.getByRole('spinbutton', { name: 'Krea CFG' }).fill('3.5');
  await expect(lab).toContainText('Turbo는 CFG 0으로 unconditional pass를 생략합니다');

  await expect(page.locator('[data-formula-note]').filter({ hasText: '여기서 s=0' }))
    .toContainText('unconditional text encoding과 model pass를 아예 건너뛰고');
  await expect(page.locator('article')).not.toContainText('12B rectified-flow DiT');
  await expect(page.locator('article')).toContainText('전체 parameter 수를 명시하지 않으므로');
  expect(await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )).toBeLessThanOrEqual(1);
});

test('recent model claims stay attached to official sources and hub routes', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/ideogram-4-typography-layout`, { waitUntil: 'networkidle' });
  for (const href of [
    'https://github.com/ideogram-oss/ideogram4',
    'https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md',
    'https://github.com/ideogram-oss/ideogram4/blob/main/docs/model_architecture.md',
    'https://github.com/ideogram-oss/ideogram4/blob/main/docs/safety.md',
    'https://ideogram.ai/licensing/',
  ]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  await page.goto(`${base}/lab/blog/ai/krea-2-foundation-model`, { waitUntil: 'networkidle' });
  for (const href of [
    'https://www.krea.ai/blog/krea-2-technical-report',
    'https://github.com/krea-ai/krea-2',
    'https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md',
    'https://www.krea.ai/krea-2-licensing',
  ]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  await page.goto(`${base}/lab/blog/ai/open-image-video-models`, { waitUntil: 'networkidle' });
  const imageSequence = page.locator('[data-image-model-sequence]');
  await expect(imageSequence.getByRole('tab')).toHaveCount(6);
  await expect(imageSequence.getByRole('tabpanel')).toHaveCount(1);
  for (const item of [
    { tab: 'Ideogram 4.0', href: '/lab/blog/ai/ideogram-4-typography-layout' },
    { tab: 'Krea 2', href: '/lab/blog/ai/krea-2-foundation-model' },
    { tab: 'Z-Image', href: '/lab/blog/ai/z-image' },
    { tab: 'Illustrious XL v1.1', href: '/lab/blog/ai/illustrious-xl' },
  ]) {
    await imageSequence.getByRole('tab', { name: item.tab, exact: true }).click();
    await expect(imageSequence.locator(`a[href="${item.href}"]`)).toContainText('구조부터 읽기');
  }

  const videoSequence = page.locator('[data-video-model-sequence]');
  await expect(videoSequence.getByRole('tab')).toHaveCount(2);
  for (const item of [
    { tab: 'LTX-2.3', href: '/lab/blog/ai/ltx-23' },
    { tab: 'Wan2.2', href: '/lab/blog/ai/wan22' },
  ]) {
    await videoSequence.getByRole('tab', { name: item.tab, exact: true }).click();
    await expect(videoSequence.locator(`a[href="${item.href}"]`)).toContainText('구조부터 읽기');
  }

  const sequenceAudit = await page.locator('[data-image-model-sequence], [data-video-model-sequence]').evaluateAll((sequences) => ({
    minimumText: Math.min(...sequences.flatMap((sequence) => [...sequence.querySelectorAll<HTMLElement>('p, span, dt, dd, a')]
      .filter((element) => getComputedStyle(element).display !== 'none' && (element.textContent ?? '').trim())
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)))),
    overflow: sequences.map((sequence) => sequence.scrollWidth - sequence.clientWidth),
  }));
  expect(sequenceAudit.minimumText).toBeGreaterThanOrEqual(12);
  expect(Math.max(0, ...sequenceAudit.overflow)).toBeLessThanOrEqual(1);
});

test('each new sidebar leaf is a focused branch with a parent-route escape', async ({ page }) => {
  for (const branch of [
    {
      sub: 'ai-open-models-krea',
      heading: '현대 Foundation · Krea 2',
      article: 'Krea 2 내부 구조: 넓은 Style 분포에서 RAW·Turbo까지',
      hrefs: [
        '/lab/blog/ai/image-model-runtime',
        '/lab/blog/ai/krea-2-foundation-model',
        '/lab/blog/ai/open-model-community-workflows',
      ],
    },
    {
      sub: 'ai-open-models-ideogram',
      heading: 'Typography · Ideogram 4',
      article: 'Ideogram 4 내부 구조: Typography·Layout을 납품 계약으로',
      hrefs: [
        '/lab/blog/ai/image-model-runtime',
        '/lab/blog/ai/ideogram-4-typography-layout',
        '/lab/blog/ai/open-model-community-workflows',
      ],
    },
  ]) {
    await page.goto(`${base}/lab/blog/ai?sub=${branch.sub}`, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1, name: branch.heading })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: branch.article })).toBeVisible();
    const cards = page.locator('[data-article-card]');
    await expect(cards).toHaveCount(3);
    await expect(cards.evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
      .resolves.toEqual(branch.hrefs);
    await expect(page.locator('[data-parent-learning-route]'))
      .toHaveAttribute('href', '/lab/blog/ai?sub=ai-open-models');
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )).toBeLessThanOrEqual(1);
  }

  await page.goto(`${base}/lab/blog/ai?sub=ai-open-models`, { waitUntil: 'networkidle' });
  const route = page.locator('[data-topdown-research-route="open-image-video"]');
  await expect(route).toBeVisible();
  await expect(route.locator('a[href="/lab/blog/ai/krea-2-foundation-model?track=open-image-video"]'))
    .toContainText('Krea 2 선택 사례');
  await expect(route.locator('a[href="/lab/blog/ai/ideogram-4-typography-layout?track=open-image-video"]'))
    .toContainText('Ideogram 4 선택 사례');
});
