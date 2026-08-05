import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const categoryChecks = [
  {
    query: 'ai-foundations',
    required: '핵심 경로는 위에서 끝난다. 필요한 원문만 선택해 읽는다',
    summary: '원문 근거',
  },
] as const;

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`math foundations exposes a just-in-time return path at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-math-foundations`, { waitUntil: 'networkidle' });
    const route = page.locator('[data-math-foundation-path]');
    await expect(route.getByRole('heading', { name: '수학을 전부 끝내지 말고, 막힌 계산에서 내려온다' })).toBeVisible();
    await expect(route).toContainText('모양 · 변화 · 판단 · 기억');
    await expect(route.getByText('다시 올라갈 곳 · 신경망 · Embedding · RNN', { exact: true })).toBeVisible();
    await expect(route.getByText('다시 올라갈 곳 · 역전파 · Diffusion sampler · 로봇 궤적', { exact: true })).toBeVisible();
    await expect(route.locator('a[href="/lab/blog/ai/linear-algebra-tensors"]')).toBeVisible();
    await expect(route.locator('a[href="/lab/blog/ai/signals-systems-convolution"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  for (const check of categoryChecks) {
    test(`${check.query} distinguishes the reading floor from optional sources at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai?sub=${check.query}`, { waitUntil: 'networkidle' });
      await expect(page.getByText(check.required, { exact: false }).first()).toBeVisible();
      const sourceDetails = page.locator('details').filter({ hasText: check.summary }).first();
      await expect(sourceDetails.locator('summary')).toBeVisible();
      await expect(sourceDetails).not.toHaveAttribute('open', '');
      await expect(sourceDetails.locator('a').first()).toBeHidden();
      if (check.query === 'ai-foundations') {
        await expect(page.getByText('9개 핵심 글', { exact: true })).toBeVisible();
        await expect(page.locator('a[href="/lab/blog/ai/foundation-training-step"]')).toBeVisible();
        await expect(page.locator('main .foundation-path-article')).toHaveCount(9);
        await expect(page.locator('main [data-category-stage]')).toHaveCount(0);
        await expect(page.locator('main [data-topdown-research-route]')).toHaveCount(0);
        await expect(page.locator('main [data-learning-path-directory]')).toHaveCount(0);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`NLP keeps the current target above its finite detailed path at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-nlp`, { waitUntil: 'networkidle' });
    const main = page.getByRole('main');
    const route = main.locator('[data-topdown-research-route="nlp-attention"]');
    await expect(route.getByRole('heading', { level: 2, name: '문맥 예측에서 Transformer까지의 최소 언어 경로' })).toBeVisible();
    await expect(route.locator('[data-route-stage="concepts"]')).toContainText('5개 · 원문의 막힌 지점부터 골라 읽습니다.');
    const directory = main.locator('[data-learning-path-directory]');
    await expect(directory.getByRole('link', { name: /NLP & Attention 핵심 경로/ })).toContainText('9개 핵심 글');
    const sourceDetails = main.locator('[data-source-article-disclosure]');
    await expect(sourceDetails.locator('summary')).toContainText('선택 원문 근거 7편 펼치기');
    await expect(sourceDetails).not.toHaveAttribute('open', '');
    await expect(sourceDetails.locator('a').first()).toBeHidden();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`RL keeps one current decision contract above mutually exclusive branches at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-reinforcement-learning`, { waitUntil: 'networkidle' });
    const main = page.getByRole('main');
    const route = main.locator('[data-topdown-research-route="reinforcement-learning"]');
    await expect(route.getByRole('heading', { level: 2, name: '현재 행동 시스템에서 필요한 RL 분기 하나 고르기' })).toBeVisible();
    await expect(route.locator('[data-route-stage="concepts"]').getByRole('heading', { level: 3, name: '현재 목표에 맞는 RL 분기 하나 선택' })).toBeVisible();
    await expect(route.locator('[data-route-stage="concepts"]').getByRole('link', { name: /LLM Reasoning/ })).toBeVisible();
    await expect(route.locator('a[href^="/lab/blog/ai/rl-decision-system-contracts?track=reinforcement-learning"]')).toHaveCount(1);
    await expect(route.locator('a[href^="/lab/blog/ai/paper-ppo-2017?track=reinforcement-learning"]')).toHaveCount(1);
    const branches = main.locator('[data-subcategory-branches]');
    await expect(branches.getByRole('link')).toHaveCount(7);
    await expect(branches.getByRole('link', { name: /00 · 적용 계약/ })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('robotics parent stays a branch hub and planning sources remain opt-in', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-robotics`, { waitUntil: 'networkidle' });
  const main = page.getByRole('main');
  const route = main.locator('[data-topdown-research-route="robot-ai"]');
  await expect(route.getByRole('heading', { level: 2, name: '명령을 물리 행동으로 닫는 Robot AI' })).toBeVisible();
  const branches = main.locator('[data-subcategory-branches]');
  await expect(branches.getByRole('link')).toHaveCount(6);
  const planningBranch = branches.getByRole('link', { name: /02 · Planning · Control/ });
  await expect(planningBranch).toBeVisible();
  await expect(main.locator('a[href="/lab/blog/ai/robot-trajectory-generation"]')).toHaveCount(0);
  const parentSources = main.locator('[data-source-article-disclosure]');
  await expect(parentSources.locator('summary')).toContainText('선택 원문 근거 28편 펼치기');
  await expect(parentSources.locator('a').first()).toBeHidden();

  await planningBranch.click();
  await expect(page).toHaveURL(/sub=ai-robotics-planning-control/);
  await expect(page.locator('a[href="/lab/blog/ai/robot-trajectory-generation"]').first()).toBeVisible();
  const sourceDetails = page.locator('[data-source-article-disclosure]');
  await expect(sourceDetails.locator('summary')).toBeVisible();
  await expect(page.locator('a[href="/lab/blog/ai/paper-shin-mckay-time-optimal-1985"]').first()).toBeHidden();
  await sourceDetails.locator('summary').click();
  await expect(page.locator('a[href="/lab/blog/ai/paper-shin-mckay-time-optimal-1985"]').first()).toBeVisible();
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`Shin-McKay reconstruction explains terms and renders projected dynamics with KaTeX at ${viewport.width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/paper-shin-mckay-time-optimal-1985`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(180);
    await expect(page.getByText('SOURCE DEEP DIVE', { exact: true })).toBeVisible();
    await expect(page.getByText('필수 경로 밖의 선택 원문 재구성', { exact: true })).toBeVisible();
    for (const term of ['경로 함수', '진행률', '가속도 상한·하한', '전환점 switching point']) {
      await expect(page.getByText(term, { exact: true })).toBeVisible();
    }
    const projected = page.locator('[data-math-source*="관절 토크"][data-math-source*="a(s)"]').first();
    await expect(projected).toBeVisible();
    await expect(projected.locator('.katex')).toHaveCount(1);
    const audit = await page.evaluate(() => {
      const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
      const formulaOverflow = formulas.flatMap((formula) => {
        const rendered = formula.firstElementChild as HTMLElement | null;
        if (!rendered) return [];
        const dx = rendered.getBoundingClientRect().width - formula.clientWidth;
        return dx > 2 ? [{ source: formula.dataset.mathSource, dx }] : [];
      });
      const visible = document.querySelector('article')?.cloneNode(true) as HTMLElement | undefined;
      visible?.querySelectorAll('.katex-mathml').forEach((node) => node.remove());
      const rawLatex = (visible?.textContent ?? '').match(/(?:s_ddot|s_dot|tau\s*=|\\(?:tau|ddot|dot|underbrace|frac)\b)/g) ?? [];
      return {
        formulaOverflow,
        rawLatex,
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(audit.formulaOverflow).toEqual([]);
    expect(audit.rawLatex).toEqual([]);
    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
