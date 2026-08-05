import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';
const articles = [
  {
    slug: 'claw-worker-boot',
    concepts: ['Spawning', 'ReadyForPrompt', 'control plane', 'WorkerSendPrompt'],
    rejected: ['Idle / Launching', 'TerminalHandle', '100-500ms'],
  },
  {
    slug: 'claw-hooks',
    concepts: ['PostToolUseFailure', 'updatedInput', 'exit 2', 'side effect'],
    rejected: ['HookMatcher::Always', 'DEFAULT_HOOK_TIMEOUT', 'hook_fail_closed'],
  },
  {
    slug: 'claw-plugin',
    concepts: ['plugin.json', 'Builtin', 'requiredPermission', 'containment'],
    rejected: ['plugin-manifest.json', 'PluginLifecycle::Healthy', '30초 timeout'],
  },
];

test('Claw lifecycle keeps evidence -> interception -> extension order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-claw-lifecycle`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-claw-lifecycle"]');
  await expect(path).toBeVisible();
  expect(await path.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/claw-worker-boot',
    '/lab/blog/ai/claw-hooks',
    '/lab/blog/ai/claw-plugin',
  ]);
  await expect(path).toContainText('상태 관찰에서 Extension 실행까지');
});

test('worker receipt text distinguishes copied input from generated evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-worker-boot`, { waitUntil: 'networkidle' });
  const body = page.locator('body');
  await expect(body).toContainText('Some이면 caller가 넘긴 문자열을 복사');
  await expect(body).toContainText('None이면 receipt를 생성하거나 기록하지 않는다');
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of articles) {
    test(`${article.slug} preserves factual and visual contracts at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

      await expect(page.locator('[data-learning-question]')).toBeVisible();
      await expect(page.locator('[data-concept-primer]')).toBeVisible();
      for (const concept of article.concepts) {
        await expect(page.locator('body')).toContainText(concept);
      }
      for (const claim of article.rejected) {
        await expect(page.locator('body')).not.toContainText(claim);
      }
      await expect(page.locator('.katex-error')).toHaveCount(0);

      const layout = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll<HTMLElement>('figure, [data-learning-question], [data-concept-primer]')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -2 || rect.right > viewportWidth + 2 || element.scrollWidth - element.clientWidth > 2);
          })
          .map((element) => ({
            tag: element.tagName,
            label: element.getAttribute('aria-label') ?? element.textContent?.slice(0, 50),
            ownOverflow: element.scrollWidth - element.clientWidth,
          }));
        const question = document.querySelector('[data-learning-question]');
        const primer = document.querySelector('[data-concept-primer]');
        const firstFigure = document.querySelector('figure');
        const figureText = [...document.querySelectorAll<HTMLElement>('figure *')]
          .filter((element) => element.children.length === 0 && (element.textContent?.trim().length ?? 0) > 0)
          .map((element) => ({
            text: element.textContent?.trim().slice(0, 40),
            size: Number.parseFloat(getComputedStyle(element).fontSize),
          }));
        return {
          documentOverflow: document.documentElement.scrollWidth - viewportWidth,
          offenders,
          svgTextCount: document.querySelectorAll('figure svg text').length,
          smallestFigureText: figureText.reduce(
            (smallest, item) => item.size < smallest.size ? item : smallest,
            { text: '', size: Number.POSITIVE_INFINITY },
          ),
          order: question && primer && firstFigure
            ? Boolean(
              question.compareDocumentPosition(primer) & Node.DOCUMENT_POSITION_FOLLOWING
              && primer.compareDocumentPosition(firstFigure) & Node.DOCUMENT_POSITION_FOLLOWING,
            )
            : false,
        };
      });

      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.offenders).toEqual([]);
      expect(layout.svgTextCount).toBe(0);
      expect(layout.smallestFigureText.size).toBeGreaterThanOrEqual(12);
      expect(layout.order).toBe(true);
    });
  }
}

for (const article of articles) {
  test(`${article.slug} exposes copied source evidence`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });
    await page.locator('button').filter({ hasText: '{ }' }).first().click();
    await expect(page.getByText(/claw-code\/rust\/crates\//, { exact: false }).first()).toBeVisible();
    await expect(page.locator('body')).toContainText('pub ');
  });
}
