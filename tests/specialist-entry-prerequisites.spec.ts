import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const specialistEntries = [
  {
    slug: 'claw-overview',
    title: '처음이라면 Agent 한 Turn을 먼저 잡고',
    prerequisite: 'tool call이 이어지는 Agent loop',
    linkedSlug: 'agent-runtime-current-first',
  },
  {
    slug: 'claw-config',
    title: '설정 파일 문법보다 runtime이 값을 읽고',
    prerequisite: '환경 변수와 설정 파일을 읽는다는',
    linkedSlug: 'claw-overview',
  },
  {
    slug: 'claw-permissions',
    title: '도구가 등록되고 실행되는 길을 본 뒤',
    prerequisite: 'registry에서 실제 executor로 dispatch',
    linkedSlug: 'claw-tool-system',
  },
  {
    slug: 'claw-worker-boot',
    title: '상태 이름을 읽기 전에 session, process와 transport',
    prerequisite: 'process의 실제 생명주기는 다르다는 점',
    linkedSlug: 'claw-session',
  },
  {
    slug: 'claw-task-team',
    title: 'Task record를 읽기 전에 tool 호출과 worker 실행',
    prerequisite: 'executor가 외부 side effect를 수행',
    linkedSlug: 'claw-worker-boot',
  },
  {
    slug: 'paper-word2vec-2013',
    title: 'Word2Vec의 계산을 먼저 익히고',
    prerequisite: '중심 단어와 일정 거리 안의 주변 단어',
    linkedSlug: 'word2vec',
  },
] as const;

for (const entry of specialistEntries) {
  test(`${entry.slug} exposes prerequisite ownership before its source-reading question`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${entry.slug}`, { waitUntil: 'networkidle' });

    const article = page.locator(`article[data-article-slug="${entry.slug}"]`).first();
    const specialist = article.locator('[data-specialist-entry]').first();
    const question = article.locator('[data-learning-question]').first();
    await expect(specialist).toContainText(entry.title);
    await expect(specialist).toContainText(entry.prerequisite);
    await expect(specialist.locator(`a[href*="/${entry.linkedSlug}"]`).first()).toBeVisible();

    const specialistComesFirst = await article.evaluate((root) => {
      const specialistNode = root.querySelector('[data-specialist-entry]');
      const questionNode = root.querySelector('[data-learning-question]');
      return specialistNode && questionNode
        ? Boolean(specialistNode.compareDocumentPosition(questionNode) & Node.DOCUMENT_POSITION_FOLLOWING)
        : false;
    });
    expect(specialistComesFirst).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
