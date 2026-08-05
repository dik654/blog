import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

const articles = [
  { slug: 'multimodal-foundation-models-current', formulas: 2, surfaces: 3 },
  { slug: 'multimodal-fusion-interleaved-context', formulas: 4, surfaces: 4 },
  { slug: 'video-long-context-memory', formulas: 3, surfaces: 3 },
  { slug: 'multimodal-visual-tokenization', formulas: 5, surfaces: 4 },
  { slug: 'multimodal-unified-generation-objectives', formulas: 5, surfaces: 3 },
  { slug: 'paper-janus-2024', formulas: 1, surfaces: 2 },
  { slug: 'janus-pro-multimodal-runtime', formulas: 2, surfaces: 2 },
];

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`multimodal current-first path stays readable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const article of articles) {
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

      await expect(page.locator('article[data-article-viz-system="technical"]')).toBeVisible();
      await expect(page.locator('[data-article-viz="true"]')).toHaveCount(article.surfaces);
      await expect(page.locator('[data-formula-pair]')).toHaveCount(article.formulas);
      await expect(page.locator('[data-formula-note]')).toHaveCount(article.formulas);
      await expect(page.locator('[data-math-fit]')).toHaveCount(article.formulas);

      const audit = await page.evaluate(() => {
        const visible = (element: HTMLElement) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0
            && rect.height > 0
            && style.display !== 'none'
            && style.visibility !== 'hidden';
        };
        const panels = [...document.querySelectorAll<HTMLElement>('[data-article-viz="true"]')];
        const labels = panels.flatMap((panel) => (
          [...panel.querySelectorAll<HTMLElement>('p, span, dt, dd, label, button, svg text')]
        )).filter((element) => (
          visible(element)
          && !element.closest('.katex, .article-viz-inline-tool, .sr-only')
          && (element.textContent?.trim().length ?? 0) > 0
        ));
        const controls = panels.flatMap((panel) => (
          [...panel.querySelectorAll<HTMLElement>('button, input, select')]
        )).filter(visible);
        const formulas = [...document.querySelectorAll<HTMLElement>('[data-math-fit]')];

        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          panelOverflow: Math.max(0, ...panels.map((panel) => panel.scrollWidth - panel.clientWidth)),
          minimumLabel: labels.length
            ? Math.min(...labels.map((label) => Number.parseFloat(getComputedStyle(label).fontSize)))
            : 99,
          minimumControl: controls.length
            ? Math.min(...controls.map((control) => {
              const rect = control.getBoundingClientRect();
              return Math.min(rect.width, rect.height);
            }))
            : 99,
          formulaScales: formulas.map((formula) => Number(formula.dataset.mathScale ?? '1')),
          formulaFonts: formulas.map((formula) => {
            const katex = formula.querySelector<HTMLElement>('.katex');
            return katex ? Number.parseFloat(getComputedStyle(katex).fontSize) : 99;
          }),
          formulaOverflow: formulas.map((formula) => {
            const inner = formula.firstElementChild as HTMLElement | null;
            if (!inner) return 0;
            return inner.getBoundingClientRect().width - formula.getBoundingClientRect().width;
          }),
          rawLatexText: [...document.querySelectorAll<HTMLElement>('article p, article li, article h2, article h3')]
            .some((element) => /\\(?:theta|tau|mathcal|underbrace|frac|sum|partial|dot)\b/.test(element.textContent ?? '')),
          duplicateCaptions: panels.some((panel) => panel.querySelectorAll(':scope > figcaption').length > 1),
        };
      });

      expect(audit.documentOverflow).toBeLessThanOrEqual(1);
      expect(audit.panelOverflow).toBeLessThanOrEqual(1);
      expect(audit.minimumLabel).toBeGreaterThanOrEqual(12);
      expect(audit.minimumControl).toBeGreaterThanOrEqual(44);
      expect(Math.min(1, ...audit.formulaScales)).toBeGreaterThanOrEqual(0.75);
      expect(Math.min(99, ...audit.formulaFonts)).toBeGreaterThanOrEqual(12);
      expect(Math.max(0, ...audit.formulaOverflow)).toBeLessThanOrEqual(1);
      expect(audit.rawLatexText).toBe(false);
      expect(audit.duplicateCaptions).toBe(false);
    }
  });
}

test('multimodal labs expose visible state changes instead of static decoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/multimodal-fusion-interleaved-context`, { waitUntil: 'networkidle' });
  const imagePosition = page.getByRole('tab', { name: 'Image · 2D' });
  await expect(imagePosition).toHaveAttribute('aria-selected', 'true');
  await imagePosition.focus();
  await imagePosition.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Video · 3D' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-position-coordinate-lab]')).toContainText('시간 t · 높이 h · 너비 w');

  await page.goto(`${base}/lab/blog/ai/multimodal-visual-tokenization`, { waitUntil: 'networkidle' });
  const reconstruct = page.getByRole('tab', { name: 'Image 복원' });
  await reconstruct.click();
  await expect(reconstruct).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-semantic-reconstruction-lab]')).toContainText('VQ code');

  const previousCode = await page.locator('[data-nearest-code]').textContent();
  await page.getByLabel('feature x').fill('95');
  await page.getByLabel('feature y').fill('5');
  await expect.poll(async () => page.locator('[data-nearest-code]').textContent()).not.toBe(previousCode);

  const tokenCountBefore = await page.locator('[data-representation-budget-lab]').getByText(/positions$/).textContent();
  await page.getByLabel('Representation image resolution').fill('1024');
  await expect.poll(async () => page.locator('[data-representation-budget-lab]').getByText(/positions$/).textContent()).not.toBe(tokenCountBefore);

  const straightThrough = page.locator('[data-straight-through-lab]');
  await expect(straightThrough).toContainText('선택 code와 정확히 같음');
  await straightThrough.getByRole('tab', { name: '2 · Backward 통로' }).click();
  await expect(straightThrough).toContainText('zₑ identity');
  await straightThrough.getByRole('tab', { name: '3 · Loss 책임' }).click();
  await expect(straightThrough).toContainText('Codebook 이동');

  await page.goto(`${base}/lab/blog/ai/paper-janus-2024`, { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /Unified pretraining/ }).click();
  await expect(page.locator('[data-janus-training-stage-lab]')).toContainText('180,000 steps');
  await expect(page.locator('[data-janus-training-stage-lab]')).toContainText('이해 2 : Text 3 : 생성 5');

  await page.goto(`${base}/lab/blog/ai/janus-pro-multimodal-runtime`, { waitUntil: 'networkidle' });
  const generation = page.getByRole('tab', { name: 'Image 생성' });
  await generation.click();
  await expect(generation).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: /prepare_gen_img_embeds/ }).click();
  await expect(page.locator('[data-janus-runtime-lab] h4')).toHaveText('prepare_gen_img_embeds');
  await expect(page.locator('[data-janus-runtime-lab]')).toContainText('1단계 남음 · 다음 gen_vision_model.decode_code');
  await page.getByRole('tab', { name: /gen_vision_model\.decode_code/ }).click();
  const runtimeLab = page.locator('[data-janus-runtime-lab]');
  await expect(runtimeLab).toContainText('8×24×24 latent shape');
  await expect(runtimeLab).toContainText('384×384 RGB image');
  expect(await runtimeLab.locator('h4').evaluate((element) => getComputedStyle(element).wordBreak)).not.toBe('break-all');

  const article = page.locator('article');
  await expect(article).toContainText('[c₀,u₀,c₁,u₁,…]');
  await expect(article).toContainText('하나의 batched language-model forward');
  await expect(article).toContainText('뽑은 ID는 conditional·unconditional 두 row에 똑같이 복제된다');
  await expect(article).not.toContainText('row를 번갈아');
  await expect(article.getByRole('link', { name: 'Janus 원 논문 재구성' })).toHaveAttribute('href', '/lab/blog/ai/paper-janus-2024');
  await expect(
    article.locator('a[href="/lab/blog/ai/multimodal-visual-tokenization"]', { hasText: '시각 tokenization 기반' }),
  ).toHaveAttribute('href', '/lab/blog/ai/multimodal-visual-tokenization');
  await expect(article.getByRole('link', { name: '통합 생성 objective 비교' })).toHaveAttribute('href', '/lab/blog/ai/multimodal-unified-generation-objectives');

  const cfgLab = page.locator('[data-janus-cfg-lab]');
  await expect(cfgLab.locator('[data-cfg-batch-layout]')).toContainText('[c₀, u₀, c₁, u₁, …]');
  await cfgLab.getByLabel('Conditional logit', { exact: true }).fill('3');
  await cfgLab.getByLabel('Unconditional logit', { exact: true }).fill('1');
  await cfgLab.getByLabel('CFG weight', { exact: true }).fill('4');
  await expect(cfgLab).toContainText('9.00');
});

test('multimodal viz zoom, keyboard tabs, and extreme mixer values remain functional', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/lab/blog/ai/multimodal-foundation-models-current`, { waitUntil: 'networkidle' });
  const contractTabs = page.getByRole('tablist', { name: '멀티모달 모델 계약 선택' }).getByRole('tab');
  await expect(contractTabs).toHaveCount(7);
  await expect(contractTabs).toHaveText([
    /2026-07.*Gemma 4/s,
    /2025-04.*Llama 4/s,
    /2025-11.*Qwen3-VL/s,
    /2025-06.*Qwen VLo/s,
    /2025-01.*Janus-Pro/s,
    /2024-09.*Emu3/s,
    /2024-09.*Transfusion/s,
  ]);
  await expect(page.locator('#current-models h3')).toHaveText([
    /Gemma 4/,
    /Llama 4/,
    /Qwen3-VL/,
    /Qwen VLo/,
    /Janus-Pro/,
    /Emu3/,
    /Transfusion/,
  ]);
  for (const term of ['Resampler', 'DeepStack', 'Interleaved-MRoPE']) {
    await expect(page.locator('#contract-first').getByText(term, { exact: true })).toBeVisible();
  }
  await expect(page.locator('#route')).toContainText('탭을 누르면 그 질문의 판단 기준과 권장 다음 글이 함께 바뀐다');

  const contractTablist = page.getByRole('tablist', { name: '멀티모달 모델 계약 선택' });
  const gemmaTab = contractTablist.getByRole('tab', { name: /Gemma 4/ });
  await gemmaTab.focus();
  await gemmaTab.press('ArrowRight');
  await expect(contractTablist.getByRole('tab', { name: /Llama 4/ })).toHaveAttribute('aria-selected', 'true');

  const budgetLab = page.locator('[data-multimodal-budget-evidence-lab]');
  await expect(budgetLab.locator('[data-budget-total]')).toHaveText('85,600 token');
  await expect(budgetLab.locator('[data-budget-margin]')).toHaveText('+170,400');
  await expect(budgetLab.locator('[data-release-verdict]')).toContainText('예산 통과 · 실측 필요');
  await budgetLab.getByRole('button', { name: '최대 detail · 1,120' }).click();
  await expect(budgetLab.locator('[data-budget-total]')).toHaveText('270,400 token');
  await expect(budgetLab.locator('[data-budget-margin]')).toHaveText('−14,400');
  await expect(budgetLab.locator('[data-release-verdict]')).toContainText('예산 초과 · 요청 분할');
  await budgetLab.getByRole('tab', { name: /Qwen VLo · 구조 재현/ }).click();
  await expect(budgetLab.locator('[data-budget-total]')).toHaveText('계산 보류');
  await expect(budgetLab.locator('[data-budget-margin]')).toHaveText('미확정');
  await expect(budgetLab.locator('[data-release-verdict]')).toContainText('구조 재현 보류');
  await expect(budgetLab).toContainText('Visual span이 미공개라 합계를 닫을 수 없다.');

  const firstFigure = page.locator('figure[data-viz-canvas]').first();
  await firstFigure.getByLabel('시각화 전체화면으로 보기').click();
  const caption = firstFigure.locator(':scope > figcaption');
  const widthBefore = await caption.evaluate((element) => element.getBoundingClientRect().width);
  await firstFigure.getByLabel('확대').click();
  await expect.poll(async () => caption.evaluate((element) => element.getBoundingClientRect().width))
    .toBeGreaterThan(widthBefore * 1.15);
  await firstFigure.getByLabel('전체화면 닫기').click();

  await page.goto(`${base}/lab/blog/ai/multimodal-unified-generation-objectives`, { waitUntil: 'networkidle' });
  const objectiveLab = page.locator('[data-objective-branch-lab]');
  await objectiveLab.getByRole('button', { name: 'Continuous latent' }).click();
  await objectiveLab.getByRole('button', { name: 'Span을 함께' }).click();
  await expect(objectiveLab.locator('[data-objective-match]')).toContainText('Transfusion 구조 보기');
  await objectiveLab.getByRole('button', { name: 'Transfusion 구조 보기' }).click();
  await expect(objectiveLab.getByRole('tab', { name: /Transfusion/ })).toHaveAttribute('aria-selected', 'true');

  const mixedMask = page.locator('[data-mixed-sequence-mask-lab]');
  await mixedMask.getByRole('tab', { name: 'Continuous image span' }).click();
  await expect(mixedMask).toContainText('span 전체가 image loss 1개');

  await page.getByLabel('Text sample share').fill('90');
  await page.getByLabel('Image loss weight').fill('0.5');
  const mixer = page.locator('[data-gradient-budget-lab]');
  await expect(mixer).toContainText('TEXT SIGNAL');
  await expect(mixer).toContainText('IMAGE SIGNAL');
  const mixerTextClipped = await mixer.evaluate((element) => (
    [...element.querySelectorAll<HTMLElement>('p')].some((label) => (
      /(?:TEXT|IMAGE) SIGNAL/.test(label.textContent ?? '')
      && label.scrollWidth > label.clientWidth + 1
    ))
  ));
  expect(mixerTextClipped).toBe(false);
});
