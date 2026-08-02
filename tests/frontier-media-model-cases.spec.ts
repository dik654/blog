import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const cases = [
  {
    slug: 'z-image',
    lab: '[data-z-image-contract-lab]',
    sections: ['artifact-boundary', 't2i-token-path', 'base-turbo', 'evidence-ledger', 'verification-stop'],
    buttons: ['계열 경계', 'T2I 실행', 'Base·Turbo', '재현 증거'],
    formulas: 2,
    required: ['To be released', '50 NFE', '8 NFE', 'observable input branch'],
    forbidden: ['z-image.me/en/resources', 'Edit 실험은 입력 이미지와 instruction을 함께 공개해야 한다'],
  },
  {
    slug: 'illustrious-xl',
    lab: '[data-illustrious-evidence-lab]',
    sections: ['evidence-layers', 'inherited-runtime', 'v11-delta', 'controlled-workflow', 'regression-stop'],
    buttons: ['SDXL에서 상속', 'v1.1 카드 명시', '직접 실험 필요'],
    formulas: 3,
    required: ['ELO 1617', 'ELO 1571', '400 sample', '2024-07'],
    forbidden: ['Illustrious-xl-early-release-v0', '공식 Illustrious v1.1 behavior'],
  },
  {
    slug: 'wan22',
    lab: '[data-wan-family-lab]',
    sections: ['family-decision', 'noise-regime-moe', 'ti2v-compression', 'runtime-evidence', 'wan-stop'],
    buttons: ['Task', 'Family', 'Mechanism', 'Runtime'],
    formulas: 2,
    required: ['약 27B total', 'step당 약 14B active', '4×32×32', '최소 80GB VRAM'],
    forbidden: ['TI2V-5B는 A14B와 같은 MoE다', 'A14B도 24GB에서 실행된다'],
  },
  {
    slug: 'ltx-23',
    lab: '[data-ltx-version-pipeline-lab]',
    sections: ['version-boundary', 'dual-stream-contract', 'two-stage-runtime', 'modality-training', 'ltx-evidence'],
    buttons: ['Version', 'Dual stream', 'Two stage', 'Train mode'],
    formulas: 3,
    required: ['14B video + 5B audio', '22B checkpoint', '공개 문서에서 미확인', 'Spatial upsampler'],
    forbidden: ['LTX-2.3은 19B', 'LTX-2.3의 정확한 video/audio 분할은 14B/5B'],
  },
  {
    slug: 'sulphur-2',
    lab: '[data-sulphur-claim-ledger]',
    sections: ['claim-boundary', 'package-identity', 'training-unknowns', 'paired-evaluation'],
    buttons: ['Card verified', 'LTX inherited', 'Pending · unknown', 'Local evidence'],
    formulas: 0,
    required: ['Official inference for the model is coming soon', 'GGUF와 MMPROJ', '기반 LLM을 Qwen이라고'],
    forbidden: ['Quasa', 'Qwen 계열 로컬 LLM', '독립적으로 완전 검증된 full fine-tune'],
  },
] as const;

async function inspectLayout(page: import('@playwright/test').Page, labSelector: string) {
  return page.evaluate((selector) => {
    const viewportWidth = document.documentElement.clientWidth;
    const lab = document.querySelector<HTMLElement>(selector);
    const inspected = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-learning-question], [data-concept-primer], section, [data-formula-pair], [data-formula-note]',
      ),
    ];
    if (lab) inspected.push(lab);
    const offenders = inspected
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (
          rect.left < -2
          || rect.right > viewportWidth + 2
          || element.scrollWidth - element.clientWidth > 2
        );
      })
      .map((element) => ({
        tag: element.tagName,
        marker: element.id || [...element.attributes].find((attribute) => attribute.name.startsWith('data-') && attribute.value === '')?.name,
        ownOverflow: element.scrollWidth - element.clientWidth,
      }));
    const undersizedControls = lab
      ? [...lab.querySelectorAll<HTMLElement>('button')]
        .map((button) => {
          const rect = button.getBoundingClientRect();
          return { text: button.textContent?.trim(), width: rect.width, height: rect.height };
        })
        .filter((button) => button.width < 44 || button.height < 44)
      : [];
    return {
      documentOverflow: document.documentElement.scrollWidth - viewportWidth,
      labOverflow: lab ? lab.scrollWidth - lab.clientWidth : null,
      offenders,
      undersizedControls,
    };
  }, labSelector);
}

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of cases) {
    test(`${article.slug} keeps source, narrative, math, and visual contracts at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

      await expect(page.locator('[data-learning-question]')).toBeVisible();
      await expect(page.locator('[data-concept-primer]')).toBeVisible();
      await expect(page.locator(article.lab)).toBeVisible();
      await expect(page.locator('.katex-error')).toHaveCount(0);
      await expect(page.locator('[data-formula-pair]')).toHaveCount(article.formulas);
      await expect(page.locator('[data-formula-pair] [data-formula-note]')).toHaveCount(article.formulas);

      for (const section of article.sections) {
        await expect(page.locator(`#${section}`)).toHaveCount(1);
      }
      for (const text of article.required) {
        await expect(page.locator('body')).toContainText(text);
      }
      for (const text of article.forbidden) {
        await expect(page.locator('body')).not.toContainText(text);
      }

      for (const label of article.buttons) {
        const button = page.locator(article.lab).getByRole('button', { name: label, exact: true });
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
      }

      const formulas = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
        overflow: element.scrollWidth - element.clientWidth,
        scale: Number((element as HTMLElement).dataset.mathScale ?? '1'),
        source: (element as HTMLElement).dataset.mathSource ?? '',
      })));
      for (const formula of formulas) {
        expect(formula.overflow).toBeLessThanOrEqual(1);
        expect(formula.scale).toBeGreaterThanOrEqual(0.67);
        expect(formula.source).toMatch(/\\text\{[^}]*[가-힣][^}]*\}/);
      }

      const layout = await inspectLayout(page, article.lab);
      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.labOverflow).toBeLessThanOrEqual(1);
      expect(layout.offenders).toEqual([]);
      expect(layout.undersizedControls).toEqual([]);
    });
  }
}

test('LTX learning path starts from the common video runtime and keeps derivative evidence after the base', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-open-models-ltx`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-open-model-ltx"]');
  await expect(path).toBeVisible();
  expect(await path.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/video-model-runtime',
    '/lab/blog/ai/ltx-23',
    '/lab/blog/ai/sulphur-2',
    '/lab/blog/ai/ltx-animation-project',
  ]);
});
