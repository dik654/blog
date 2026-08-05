import { expect, test, type Locator, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

async function expectBefore(first: Locator, second: Locator) {
  expect(await first.evaluate((node, other) => (
    Boolean(node.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING)
  ), await second.elementHandle())).toBe(true);
}

async function expectNoHorizontalOverflow(page: Page, scope: Locator) {
  const overflow = await scope.evaluate((element) => ({
    own: element.scrollWidth - element.clientWidth,
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(overflow.own).toBeLessThanOrEqual(1);
  expect(overflow.document).toBeLessThanOrEqual(1);
}

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Robot AI keeps the research route before its execution sequence at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-robotics`, { waitUntil: 'networkidle' });

    const route = page.locator('[data-topdown-research-route="robot-ai"]');
    const navigation = page.locator('[data-subcategory-branches]');
    await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'sequence');
    await expect(navigation).toHaveAttribute('data-child-navigation-placement', 'after-track');
    await expect(navigation).toContainText('명령이 물리 행동이 되는 실행 순서');
    await expect(navigation).not.toContainText('각 행은 독립된 목표');
    await expect(navigation.getByRole('link')).toHaveCount(6);
    await expect(navigation.getByText('실행 단계 00', { exact: true })).toBeVisible();
    await expect(route).toHaveAttribute('data-route-usage', 'primary-path');
    await expectBefore(route, navigation);
    await expectNoHorizontalOverflow(page, navigation);
  });

  test(`Open media separates common, optional, and case routes at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-open-models`, { waitUntil: 'networkidle' });

    const route = page.locator('[data-topdown-research-route="open-image-video"]');
    const navigation = page.locator('[data-subcategory-branches]');
    await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'catalog');
    await expect(navigation).toHaveAttribute('data-child-navigation-placement', 'after-track');
    await expect(navigation).not.toContainText('각 행은 독립된 목표');
    await expect(navigation.locator('[data-child-navigation-group]')).toHaveCount(4);
    await expect(navigation.locator('[data-child-group-role="common"]')).toBeVisible();
    await expect(navigation.locator('[data-child-group-role="optional"]')).toBeVisible();

    const imageCases = navigation.locator('[data-child-navigation-group="open-media-image-cases"]');
    const videoCases = navigation.locator('[data-child-navigation-group="open-media-video-cases"]');
    await expect(imageCases).not.toHaveAttribute('open', '');
    await expect(videoCases).not.toHaveAttribute('open', '');
    await expect(navigation.getByRole('link', { name: /Krea 2/ })).not.toBeVisible();
    await imageCases.locator('summary').click();
    await expect(navigation.getByRole('link', { name: /Krea 2/ })).toBeVisible();
    await expect(imageCases.getByRole('link')).toHaveCount(4);
    await expect(route).toHaveAttribute('data-route-usage', 'primary-path');
    await expectBefore(route, navigation);
    await expectNoHorizontalOverflow(page, navigation);
  });

  test(`Agent hub keeps responsibility choice before shared references at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-agents`, { waitUntil: 'networkidle' });

    const navigation = page.locator('[data-subcategory-branches]');
    const route = page.locator('[data-topdown-research-route="ai-agents"]');
    await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'choice');
    await expect(navigation).toHaveAttribute('data-child-navigation-placement', 'before-track');
    await expect(navigation.getByRole('link')).toHaveCount(6);
    await expect(route).toHaveAttribute('data-route-usage', 'shared-reference');
    await expectBefore(navigation, route);
    await expectNoHorizontalOverflow(page, navigation);
  });

  test(`Sequential research hubs keep execution layers after their primary route at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const target of [
      { subcategory: 'ai-ocr', track: 'document-ai' },
      { subcategory: 'ai-llm-data', track: 'llm-data-engine' },
      { subcategory: 'ai-llm-architectures', track: 'llm-architecture' },
      { subcategory: 'ai-llm-post-training', track: 'llm-post-training' },
      { subcategory: 'ai-llm-interpretability', track: 'llm-interpretability' },
      { subcategory: 'ai-llm-efficiency', track: 'efficient-inference-on-device' },
      { subcategory: 'ai-llm-serving', track: 'llm-disaggregated-serving' },
    ]) {
      await page.goto(`${base}/lab/blog/ai?sub=${target.subcategory}`, { waitUntil: 'networkidle' });
      const navigation = page.locator('[data-subcategory-branches]');
      const route = page.locator(`[data-topdown-research-route="${target.track}"]`);
      await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'sequence');
      await expect(navigation).toHaveAttribute('data-child-navigation-placement', 'after-track');
      await expect(route).toHaveAttribute('data-route-usage', 'primary-path');
      await expectBefore(route, navigation);
      await expectNoHorizontalOverflow(page, navigation);
    }
  });

  test(`Catalog research hubs keep problem branches after their primary route at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const target of [
      { subcategory: 'ai-vision', track: 'computer-vision' },
      { subcategory: 'ai-reinforcement-learning', track: 'reinforcement-learning' },
    ]) {
      await page.goto(`${base}/lab/blog/ai?sub=${target.subcategory}`, { waitUntil: 'networkidle' });
      const navigation = page.locator('[data-subcategory-branches]');
      const route = page.locator(`[data-topdown-research-route="${target.track}"]`);
      await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'catalog');
      await expect(navigation).toHaveAttribute('data-child-navigation-placement', 'after-track');
      await expect(navigation.locator('[data-child-group-role="common"]')).toBeVisible();
      await expect(navigation.locator('[data-child-group-role="optional"]')).toBeVisible();
      await expect(route).toHaveAttribute('data-route-usage', 'primary-path');
      await expectBefore(route, navigation);
      await expectNoHorizontalOverflow(page, navigation);
    }
  });

  test(`Speech hub keeps responsibility choice before shared references at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-speech-audio`, { waitUntil: 'networkidle' });

    const navigation = page.locator('[data-subcategory-branches]');
    const route = page.locator('[data-topdown-research-route="speech-audio"]');
    await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'choice');
    await expect(navigation).toHaveAttribute('data-child-navigation-placement', 'before-track');
    await expect(navigation.getByRole('link')).toHaveCount(4);
    await expect(route).toHaveAttribute('data-route-usage', 'shared-reference');
    await expectBefore(navigation, route);
    await expectNoHorizontalOverflow(page, navigation);
  });

  test(`Claw Code sequence shows each step number once at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-agents-claw`, { waitUntil: 'networkidle' });

    const navigation = page.locator('[data-subcategory-branches]');
    await expect(navigation).toHaveAttribute('data-child-navigation-mode', 'sequence');
    await expect(navigation.getByRole('link')).toHaveCount(5);
    await expect(navigation.getByText('실행 단계 01', { exact: true })).toBeVisible();
    const titles = await navigation.locator('h3').allTextContents();
    expect(titles.every((title) => !/^\d{2}\s/.test(title.trim()))).toBe(true);
    await expectNoHorizontalOverflow(page, navigation);
  });
}
