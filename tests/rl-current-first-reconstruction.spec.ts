import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectBefore(page: Page, firstHref: string, secondHref: string) {
  const order = await page.locator(`a[href="${firstHref}"], a[href="${secondHref}"]`).evaluateAll(
    (links, hrefs) => links.map((link) => link.getAttribute('href')).filter((href) => hrefs.includes(href ?? '')),
    [firstHref, secondHref],
  );
  expect(order.slice(0, 2)).toEqual([firstHref, secondHref]);
}

for (const viewport of [viewports[0], viewports[2]]) {
  test(`RL root chooses one goal branch instead of exposing a paper chronology on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-reinforcement-learning`, { waitUntil: 'networkidle' });

    const main = page.getByRole('main');
    await expect(page.getByText('현재 행동 시스템에서 필요한 RL 분기 하나 고르기', { exact: false }).first()).toBeVisible();
    await expect(main.getByRole('heading', { level: 2, name: '적용 계약 뒤에 필요한 의사결정 분기만 고릅니다' })).toBeVisible();
    await main.locator('[data-child-navigation-group="rl-branches"] summary').click();
    for (const branch of [
      '00 · 적용 계약',
      '01 · Policy · 제어',
      '02 · Demonstration · Offline',
      '03 · World Model · Planning',
      '04 · State 추정',
      '05 · Safety · 제약',
      '06 · 최소 기반',
    ]) {
      await expect(main.getByRole('link', { name: new RegExp(branch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })).toBeVisible();
    }
    await expect(main.locator('[data-authored-article-sequences]')).toHaveCount(0);
    await expect(main.locator('a[href="/lab/blog/ai/paper-ppo-2017?track=reinforcement-learning"]')).toHaveCount(1);
    await expect(main.locator('a[href^="/lab/blog/ai/paper-"]')).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
  });
}

const branchContracts = [
  {
    slug: 'ai-rl-orientation',
    first: '/lab/blog/ai/rl-decision-system-contracts',
    second: null,
    sources: 0,
  },
  {
    slug: 'ai-rl-policy-control',
    first: '/lab/blog/ai/rl-ppo-continuous-control',
    second: '/lab/blog/ai/rl-policy-gradient-actor-critic',
    sources: 6,
  },
  {
    slug: 'ai-rl-offline',
    first: '/lab/blog/ai/rl-imitation-offline-learning',
    second: null,
    sources: 3,
  },
  {
    slug: 'ai-rl-world-model',
    first: '/lab/blog/ai/rl-model-based-world-models',
    second: null,
    sources: 4,
  },
  {
    slug: 'ai-rl-state-estimation',
    first: '/lab/blog/ai/rl-pomdp-state-estimation',
    second: null,
    sources: 3,
  },
  {
    slug: 'ai-rl-safety',
    first: '/lab/blog/ai/rl-safe-constrained-learning',
    second: null,
    sources: 3,
  },
  {
    slug: 'ai-rl-foundations',
    first: '/lab/blog/ai/rl-mdp-bellman',
    second: '/lab/blog/ai/rl-temporal-difference-dqn',
    sources: 2,
  },
] as const;

for (const branch of branchContracts) {
  test(`${branch.slug} keeps its core sequence separate from optional paper evidence`, async ({ page }) => {
    await page.setViewportSize(viewports[0]);
    await page.goto(`${base}/lab/blog/ai?sub=${branch.slug}`, { waitUntil: 'networkidle' });

    await expect(page.locator(`a[href="${branch.first}"]`).first()).toBeVisible();
    if (branch.second) await expectBefore(page, branch.first, branch.second);

    if (branch.sources > 0) {
      const details = page.locator('details').filter({ hasText: `선택 원문 근거 ${branch.sources}편 펼치기` });
      await expect(details).toHaveCount(1);
      await expect(details).not.toHaveAttribute('open', '');
      await expect(details.locator('a').first()).toBeHidden();
    } else {
      await expect(page.locator('details').filter({ hasText: '선택 원문 근거' })).toHaveCount(0);
    }
    await expectNoHorizontalOverflow(page);
  });
}

for (const viewport of viewports) {
  test(`RL decision contract remains legible and interactive on ${viewport.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/rl-decision-system-contracts`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator('[data-rl-fit-lab]')).toBeVisible();
    await page.getByRole('button', { name: 'Demand forecast', exact: true }).click();
    await expect(page.locator('[data-fit-verdict]')).toHaveText('우선 supervised');

    const access = page.locator('[data-data-access-lab]');
    await access.getByRole('button', { name: 'Fixed log', exact: true }).click();
    await expect(access.locator('[data-access-route]')).toHaveText('Offline RL · Behavior cloning');

    const release = page.locator('[data-rl-release-lab]');
    await expect(release.locator('[data-release-status]')).toHaveText('HOLD');
    await expect(release.locator('[data-rl-gate-state="unmeasured"]')).toHaveCount(4);
    await release.getByRole('slider', { name: 'Safety violation' }).fill('0');
    await release.getByRole('slider', { name: 'OOD success gap' }).fill('4');
    await expect(release.locator('[data-release-status]')).toHaveText('HOLD');
    await release.getByRole('slider', { name: 'Task success' }).fill('90');
    await release.getByRole('slider', { name: 'Evaluation trials' }).fill('400');
    await release.getByLabel('task cohort receipt').check();
    await release.getByLabel('safety exposure receipt').check();
    await release.getByLabel('ood paired slice receipt').check();
    await release.getByLabel('latency trace receipt').check();
    await expect(release.locator('[data-release-status]')).toHaveText('RELEASE');
    await release.getByLabel('latency trace receipt').uncheck();
    await expect(release.locator('[data-release-status]')).toHaveText('HOLD');

    await expect(page.locator('[data-math-fit]')).toHaveCount(4);
    await expect(page.locator('[data-formula-note]')).toHaveCount(4);
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await expect(page.locator('article table')).toHaveCount(0);
    const formulas = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => {
      const katex = element.querySelector<HTMLElement>('.katex');
      const source = (element as HTMLElement).dataset.mathSource ?? '';
      const pair = element.closest<HTMLElement>('[data-formula-pair]');
      return {
        overflow: element.scrollWidth - element.clientWidth,
        scale: Number((element as HTMLElement).dataset.mathScale ?? '1'),
        fontSize: katex ? Number.parseFloat(getComputedStyle(katex).fontSize) : 0,
        koreanAnnotation: /\\text\{[^}]*[가-힣][^}]*\}/.test(source),
        note: pair?.querySelector<HTMLElement>('[data-formula-note]')?.innerText ?? '',
      };
    }));
    for (const formula of formulas) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.7);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.koreanAnnotation).toBe(true);
      expect(formula.note).toContain('이 식은');
    }
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors).toEqual([]);

    const body = page.locator('body');
    await expect(body).toContainText('하루 120 episode');
    await expect(body).toContainText('현실보다 9% 높다면');
    await expect(body).toContainText('쉬운 parcel이 85%');
    await expect(body).toContainText('성공 86/100');
    await expect(body).toContainText('위반 0/100');
    await expect(body).not.toContainText('성공 +1');
    await expect(body).not.toContainText('파손 -100');
    await expect(body).not.toContainText('8초 timeout');
    await expect(body).not.toContainText('쉬운 parcel이 92%');
    await expect(body).not.toContainText('하루 200 episode');
    await expect(body).not.toContainText('15% 낮');
  });
}
