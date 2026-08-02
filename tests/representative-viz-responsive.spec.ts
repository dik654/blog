import { expect, test, type Locator, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';

type SvgAudit = {
  documentOverflow: number;
  stageOverflow: number;
  viewBox: string | null;
  height: number;
  effectiveFontSizes: number[];
  outOfBoundsText: string[];
  overlappingTextPairs: string[];
  controlSizes: Array<{ width: number; height: number }>;
};

async function auditSvg(page: Page, svg: Locator): Promise<SvgAudit> {
  const owner = page.locator('[data-step-viz]').filter({ has: svg });
  const audit = await svg.evaluate((node) => {
    const svgNode = node as SVGSVGElement;
    const svgRect = svgNode.getBoundingClientRect();
    const ownerNode = svgNode.closest<HTMLElement>('[data-step-viz]');
    const stage = svgNode.closest<HTMLElement>('[data-step-viz-stage]');
    const visibleText = [...svgNode.querySelectorAll<SVGTextElement>('text')]
      .filter((text) => {
        const style = getComputedStyle(text);
        const rect = text.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0;
      });
    const effectiveFontSizes = visibleText.map((text) => {
      const matrix = text.getScreenCTM();
      const scale = matrix ? Math.hypot(matrix.a, matrix.b) : 1;
      return Number.parseFloat(getComputedStyle(text).fontSize) * scale;
    });
    const outOfBoundsText = visibleText
      .filter((text) => {
        const rect = text.getBoundingClientRect();
        return (
          rect.left < svgRect.left - 1
          || rect.right > svgRect.right + 1
          || rect.top < svgRect.top - 1
          || rect.bottom > svgRect.bottom + 1
        );
      })
      .map((text) => text.textContent?.trim() ?? '');
    const overlappingTextPairs: string[] = [];
    visibleText.forEach((left, leftIndex) => {
      const leftRect = left.getBoundingClientRect();
      visibleText.slice(leftIndex + 1).forEach((right) => {
        const rightRect = right.getBoundingClientRect();
        const overlapWidth = Math.min(leftRect.right, rightRect.right) - Math.max(leftRect.left, rightRect.left);
        const overlapHeight = Math.min(leftRect.bottom, rightRect.bottom) - Math.max(leftRect.top, rightRect.top);
        if (overlapWidth > 1 && overlapHeight > 1) {
          overlappingTextPairs.push(`${left.textContent?.trim()} <> ${right.textContent?.trim()}`);
        }
      });
    });
    const controlSizes = ownerNode
      ? [...ownerNode.querySelectorAll<HTMLElement>('.step-viz__progress button, .step-viz__controls button')].map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })
      : [];

    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      stageOverflow: stage ? stage.scrollWidth - stage.clientWidth : Number.POSITIVE_INFINITY,
      viewBox: svgNode.getAttribute('viewBox'),
      height: svgRect.height,
      effectiveFontSizes,
      outOfBoundsText,
      overlappingTextPairs,
      controlSizes,
    };
  });
  await expect(owner).toHaveCount(1);
  return audit;
}

async function waitForVizSettled(page: Page, owner: Locator, svg: Locator) {
  await expect.poll(
    async () => {
      try {
        return await owner.evaluate((root) => root
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Execution context was destroyed')) {
          return Number.POSITIVE_INFINITY;
        }
        throw error;
      }
    },
    {
      message: 'step-viz animations should finish before geometry is measured',
      timeout: 5_000,
      intervals: [80, 120, 180, 260],
    },
  ).toBe(0);

  await expect.poll(async () => {
    try {
      return await svg.evaluate(async (node) => {
        const snapshot = () => [...node.querySelectorAll<SVGGraphicsElement>('text')]
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return [
              rect.left,
              rect.top,
              rect.right,
              rect.bottom,
              Number(getComputedStyle(element).opacity),
            ];
          });
        const before = snapshot();
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        const after = snapshot();
        if (before.length !== after.length) return Number.POSITIVE_INFINITY;
        return Math.max(0, ...before.flatMap((previous, index) => previous
          .map((value, field) => Math.abs(after[index][field] - value))));
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Execution context was destroyed')) {
        return Number.POSITIVE_INFINITY;
      }
      throw error;
    }
  }, {
    message: 'step-viz text geometry should stop changing before geometry is measured',
    timeout: 5_000,
    intervals: [80, 120, 180],
  }).toBeLessThanOrEqual(0.25);
}

function expectSharedContract(audit: SvgAudit) {
  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(audit.stageOverflow).toBeLessThanOrEqual(1);
  expect(audit.outOfBoundsText).toEqual([]);
  for (const control of audit.controlSizes) {
    expect(control.width).toBeGreaterThanOrEqual(44);
    expect(control.height).toBeGreaterThanOrEqual(44);
  }
}

for (const viewport of [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`permission and request lifecycle diagrams stay legible on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    await page.goto(`${base}/lab/blog/ai/claude-code`, { waitUntil: 'networkidle' });
    const permission = page.locator('[data-claude-code-boundary-lab]');
    await expect(permission).toBeVisible();
    await permission.getByRole('button', { name: /결과 관찰/ }).click();
    await expect(permission).toContainText('tool result · updated context · repeat or stop');
    await expect(permission.locator('svg:not(.lucide)')).toHaveCount(0);
    const permissionAudit = await permission.evaluate((lab) => {
      const textSizes = [...lab.querySelectorAll<HTMLElement>('p, span, strong, button')]
        .filter((node) => node.getBoundingClientRect().width > 0)
        .map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
      const controls = [...lab.querySelectorAll<HTMLButtonElement>('button')].map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        labOverflow: lab.scrollWidth - lab.clientWidth,
        minFontSize: Math.min(...textSizes),
        controls,
      };
    });
    expect(permissionAudit.documentOverflow).toBeLessThanOrEqual(1);
    expect(permissionAudit.labOverflow).toBeLessThanOrEqual(1);
    expect(permissionAudit.minFontSize).toBeGreaterThanOrEqual(10);
    expect(permissionAudit.controls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();

    await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });
    const lifecycle = page.locator('[data-request-lifecycle]');
    await expect(lifecycle).toBeVisible();
    const lifecycleOwner = lifecycle.locator('[data-step-viz]');
    for (let step = 0; step < 4; step += 1) {
      await lifecycleOwner.getByRole('button', { name: '다음 장면' }).click();
    }
    await expect(lifecycle.locator('[data-lifecycle-current-owner]')).toHaveText('API process');
    await expect(lifecycle.locator('[data-lifecycle-owner]')).toHaveCount(5);
    await expect(lifecycle.locator('svg:not(.lucide)')).toHaveCount(0);
    const lifecycleAudit = await lifecycleOwner.evaluate((owner) => {
      const stage = owner.querySelector<HTMLElement>('[data-step-viz-stage]');
      const text = [...owner.querySelectorAll<HTMLElement>('[data-lifecycle-owner] p, [data-lifecycle-owner] span')]
        .filter((node) => node.getBoundingClientRect().width > 0)
        .map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
      const controls = [...owner.querySelectorAll<HTMLElement>('.step-viz__progress button, .step-viz__controls button')]
        .map((button) => {
          const rect = button.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        stageOverflow: stage ? stage.scrollWidth - stage.clientWidth : Number.POSITIVE_INFINITY,
        minFontSize: Math.min(...text),
        controls,
      };
    });
    expect(lifecycleAudit.documentOverflow).toBeLessThanOrEqual(1);
    expect(lifecycleAudit.stageOverflow).toBeLessThanOrEqual(1);
    expect(lifecycleAudit.minFontSize).toBeGreaterThanOrEqual(12);
    expect(lifecycleAudit.controls.every((control) => control.width >= 44 && control.height >= 44)).toBeTruthy();
  });
}

test('step progress wraps many scenes without shrinking touch targets on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(`${base}/lab/blog/ai/vllm-serving`, { waitUntil: 'networkidle' });

  const lifecycle = page.locator('[data-request-lifecycle]');
  await expect(lifecycle).toBeVisible();
  const owner = lifecycle.locator('[data-step-viz]');
  const progress = owner.locator('.step-viz__progress');
  await expect(progress.locator('button')).toHaveCount(5);

  await progress.evaluate((node) => {
    const template = node.querySelector('button');
    if (!template) throw new Error('step progress button template is missing');
    for (let index = node.querySelectorAll('button').length; index < 12; index += 1) {
      const clone = template.cloneNode(true) as HTMLButtonElement;
      clone.setAttribute('aria-label', `step ${index + 1}`);
      clone.removeAttribute('aria-current');
      node.append(clone);
    }
  });

  const layout = await progress.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const buttons = [...node.querySelectorAll<HTMLButtonElement>('button')]
      .map((button) => {
        const buttonRect = button.getBoundingClientRect();
        return {
          width: buttonRect.width,
          height: buttonRect.height,
          top: buttonRect.top,
        };
      });
    return {
      buttonCount: buttons.length,
      rowCount: new Set(buttons.map((button) => Math.round(button.top))).size,
      minWidth: Math.min(...buttons.map((button) => button.width)),
      minHeight: Math.min(...buttons.map((button) => button.height)),
      overflow: node.scrollWidth - node.clientWidth,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      width: rect.width,
    };
  });

  expect(layout.buttonCount).toBe(12);
  expect(layout.rowCount).toBeGreaterThan(1);
  expect(layout.minWidth).toBeGreaterThanOrEqual(44);
  expect(layout.minHeight).toBeGreaterThanOrEqual(44);
  expect(layout.overflow).toBeLessThanOrEqual(1);
  expect(layout.documentOverflow).toBeLessThanOrEqual(1);
  expect(layout.width).toBeLessThanOrEqual(360);
});

const dezeroLabs = [
  {
    slug: 'dezero-autodiff',
    selector: '[data-dezero-autodiff-lab]',
    tabs: ['순전파 기록', '역순으로 꺼내기', '기울기 합산', '미분을 다시 미분'],
    finalText: 'd²y/dx² = 6x = 12',
  },
  {
    slug: 'dezero-nn',
    selector: '[data-dezero-training-lab]',
    tabs: ['소유권', 'Forward', 'Backward', 'Step'],
    finalText: 'Contract test: L_after < L_before',
  },
  {
    slug: 'dezero-advanced',
    selector: '[data-dezero-sequence-lab]',
    tabs: ['State 경계', 'LSTM 경로', 'LayerNorm 축', 'Dropout', 'Embedding'],
    finalText: 'grad W[4] = 1 + 1 = 2',
  },
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`DeZero causal labs stay readable through every state on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const article of dezeroLabs) {
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
      const lab = page.locator(article.selector);
      await expect(lab).toBeVisible();
      await expect(lab.locator('svg:not(.lucide)')).toHaveCount(0);

      for (const tabName of article.tabs) {
        const tab = lab.getByRole('tab', { name: new RegExp(tabName) });
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        const geometry = await lab.evaluate((root) => {
          const rect = root.getBoundingClientRect();
          const controls = [...root.querySelectorAll<HTMLElement>('[role="tab"]')].map((button) => {
            const buttonRect = button.getBoundingClientRect();
            return { width: buttonRect.width, height: buttonRect.height };
          });
          const textSizes = [...root.querySelectorAll<HTMLElement>('p, span, code')]
            .filter((node) => node.getBoundingClientRect().width > 0)
            .map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
          return {
            ownOverflow: root.scrollWidth - root.clientWidth,
            documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            left: rect.left,
            right: rect.right,
            viewportWidth: document.documentElement.clientWidth,
            controls,
            textSizes,
          };
        });
        expect(geometry.ownOverflow).toBeLessThanOrEqual(1);
        expect(geometry.documentOverflow).toBeLessThanOrEqual(1);
        expect(geometry.left).toBeGreaterThanOrEqual(-1);
        expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
        expect(geometry.controls.every((control) => control.height >= 44)).toBeTruthy();
        expect(Math.min(...geometry.textSizes)).toBeGreaterThanOrEqual(11);
      }

      await expect(lab.getByText(article.finalText, { exact: false })).toBeVisible();
      const formulaScales = await page.locator('[data-formula-pair] [data-math-fit]').evaluateAll(
        (nodes) => nodes.map((node) => Number(node.getAttribute('data-math-scale') ?? '0')),
      );
      expect(formulaScales.length).toBeGreaterThan(0);
      expect(Math.min(...formulaScales)).toBeGreaterThanOrEqual(0.68);
    }
  });
}
