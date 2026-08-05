import { expect, test } from '@playwright/test';
import { getArticle } from '../src/content';
import { getLearningPath } from '../src/content/learning-paths';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

test('Agent Ops keeps a distinct evidence-promotion responsibility', () => {
  const article = getArticle('ai', 'agent-devlog-patterns')?.article;
  expect(article).toBeDefined();
  expect(article!.title).toContain('Trace에서 ADR·Lesson');
  expect(article!.sections?.map((section) => section.id)).toEqual([
    'boundary',
    'evidence-ledger',
    'promotion-rules',
    'worked-incident',
    'release-gate',
  ]);
  expect(getLearningPath('ai-agent-ops-evidence')?.steps.map((step) => step.slug)).toEqual([
    'agent-evaluation-trace',
    'agent-devlog-patterns',
    'claw-telemetry',
    'claw-recovery',
  ]);
});

test('Agent evaluation explicitly hands release evidence to the operations record', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/agent-evaluation-trace`, { waitUntil: 'networkidle' });
  await expect(page.locator('#regression-loop').getByRole('link', { name: 'Agent 운영 증거 글' })).toHaveAttribute(
    'href',
    '/lab/blog/ai/agent-devlog-patterns?path=ai-agent-ops-evidence',
  );
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`${viewport.name} renders the evidence ledger without clipping`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/agent-devlog-patterns?path=ai-agent-ops-evidence`, { waitUntil: 'networkidle' });

    const article = page.getByRole('article');
    const lab = article.locator('[data-agent-evidence-ledger]');
    await expect(lab).toBeVisible();
    await expect(article.getByRole('heading', { name: 'Trace를 저장했는데도 왜 같은 논쟁과 실패가 반복될까?' })).toBeVisible();
    await expect(article.locator('.katex-display')).toHaveCount(2);

    await lab.getByRole('button', { name: '반복 Retry 사고' }).click();
    await expect(lab.getByText('Lesson', { exact: true })).toBeVisible();
    await expect(lab.getByText('필수', { exact: true })).toHaveCount(3);
    await expect(lab).toContainText('duplicate commit');

    for (const target of ['agent-evaluation-trace', 'claw-telemetry', 'claw-recovery']) {
      await expect(article.locator(`a[href^="/lab/blog/ai/${target}"]`).first()).toBeVisible();
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const clipped = await lab.evaluate((root) => {
      const rootRect = root.getBoundingClientRect();
      return [...root.querySelectorAll<HTMLElement>('button, strong, p, span')].filter((node) => {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = node.getBoundingClientRect();
        return rect.right > rootRect.right + 1 || rect.left < rootRect.left - 1;
      }).length;
    });
    expect(clipped).toBe(0);
  });
}
