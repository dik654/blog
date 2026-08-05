import { expect, test, type Locator, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

async function expectNoOverflow(page: Page, root: Locator) {
  const result = await page.evaluate((selector) => {
    const element = document.querySelector<HTMLElement>(selector);
    const stages = Array.from(document.querySelectorAll<HTMLElement>(`${selector} [data-step-viz-stage]`));
    return {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      root: element ? element.scrollWidth - element.clientWidth : 999,
      stages: stages.map((stage) => stage.scrollWidth - stage.clientWidth),
    };
  }, await root.evaluate((element) => {
    if (!element.id) element.id = `qa-${Math.random().toString(36).slice(2)}`;
    return `#${element.id}`;
  }));

  expect(result.document).toBeLessThanOrEqual(1);
  expect(result.root).toBeLessThanOrEqual(1);
  expect(Math.max(0, ...result.stages)).toBeLessThanOrEqual(1);
}

async function walkScenes(lab: Locator, stages: string[]) {
  for (let index = 0; index < stages.length; index += 1) {
    await lab.getByRole('button', { name: `step ${index + 1}` }).click();
    await expect(lab.locator('[data-stage]')).toHaveAttribute('data-stage', stages[index]);
  }
}

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const) {
  test(`prompt contract owns the right failures at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/prompt-engineering?path=ai-agent-instruction-contract`, { waitUntil: 'networkidle' });

    const article = page.locator('article');
    const lab = page.locator('[data-prompt-contract-lab]');
    await expect(lab).toBeVisible();
    await expect(article).toContainText('프롬프트는 모델에게 건네는 시험 가능한 요청 계약');
    await expect(article).toContainText('Schema를 통과한 JSON');
    await expect(article).toContainText('effect receipt');
    await expect(article).not.toContainText('500+ 토큰');
    await expect(article).not.toContainText('60B+');
    await expect(article).not.toContainText('50% → 95%');

    await walkScenes(lab, ['raw', 'success', 'boundary', 'gates', 'release']);
    await expectNoOverflow(page, lab);
    expect(errors).toEqual([]);
  });

  test(`skill lifecycle keeps permission closed at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/skills-anatomy?path=ai-agent-instruction-contract`, { waitUntil: 'networkidle' });

    const article = page.locator('article');
    const lab = page.locator('[data-skill-lifecycle-lab]');
    await expect(lab).toBeVisible();
    await expect(article).toContainText('Skill은 재사용할 절차와 자료이지 새 권한이 아니다');
    await expect(article).toContainText('name');
    await expect(article).toContainText('description');
    await expect(article).toContainText('Skill activation 뒤에도 Permission은 닫혀 있다');
    await expect(article).toContainText('effect receipt');
    await expect(article).not.toContainText('Tool (low)');
    await expect(article).not.toContainText('Anthropic 2024 release');

    await walkScenes(lab, ['catalog', 'activate', 'body', 'resource', 'gate', 'evidence']);
    await expectNoOverflow(page, lab);
    expect(errors).toEqual([]);
  });
}

test('XML remains a semantic boundary and hands off to Skills', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/xml-prompting?path=ai-agent-instruction-contract`, { waitUntil: 'networkidle' });

  const article = page.locator('article');
  await expect(article).toContainText('XML은 경계를 표시할 뿐 권한 경계가 아니다');
  await expect(article.getByRole('link', { name: 'Agent Skills' })).toHaveAttribute(
    'href',
    /skills-anatomy\?path=ai-agent-instruction-contract/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
