import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';
const articles = [
  {
    slug: 'claw-permissions',
    concepts: ['authorization', 'fail-closed', 'Ask는 중간 신호', '별도 direct helper 경로', '다음:'],
  },
  {
    slug: 'claw-file-ops',
    concepts: ['TOCTOU', 'openat2', 'atomic replace'],
  },
  {
    slug: 'claw-bash',
    concepts: ['process tree', 'fail-closed', 'OS sandbox'],
  },
];

test('Claw security category keeps Permission -> File -> Shell order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-claw-security`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-claw-security"]');
  await expect(path).toBeVisible();
  expect(await path.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/claw-permissions',
    '/lab/blog/ai/claw-file-ops',
    '/lab/blog/ai/claw-bash',
  ]);
  await expect(path).toContainText('Permission에서 File·Shell 실행 경계까지');
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of articles) {
    test(`${article.slug} keeps learning and visual contracts at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

      await expect(page.locator('[data-learning-question]')).toBeVisible();
      await expect(page.locator('[data-concept-primer]')).toBeVisible();
      for (const concept of article.concepts) {
        await expect(page.locator('body')).toContainText(concept);
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

test('file article opens implementation evidence in the code panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-file-ops`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /read_file 175-220줄 보기/ }).click();
  await expect(page.getByText('claw-code/rust/crates/runtime/src/file_ops.rs', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/binary probe 통과와 UTF-8 디코딩 성공/)).toBeVisible();
});

test('permission article opens implementation evidence in the code panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-permissions`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /실제 permission 타입 7-105줄 보기/ }).click();
  await expect(page.getByText('claw-code/rust/crates/runtime/src/permissions.rs', { exact: true }).first()).toBeVisible();
  await expect(page.locator('body')).toContainText('pub enum PermissionMode');
});

test('bash article opens implementation evidence in the code panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-bash`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Bash 입출력과 실행 진입점 보기/ }).click();
  await expect(page.getByText('claw-code/rust/crates/runtime/src/bash.rs', { exact: true }).first()).toBeVisible();
  await expect(page.locator('body')).toContainText('pub struct BashCommandInput');
});
