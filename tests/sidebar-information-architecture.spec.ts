import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function visibleSidebar(page: Page, width: number) {
  if (width < 1024) {
    await page.getByRole('button', { name: '메뉴 열기' }).click();
    return page.locator('aside[role="dialog"]');
  }
  return page.locator('aside').filter({ has: page.getByRole('link', { name: 'Dylan Lab' }) }).first();
}

for (const viewport of viewports) {
  test(`sidebar exposes one layer model and one top-down AI path at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog`, { waitUntil: 'networkidle' });
    const sidebar = await visibleSidebar(page, viewport.width);
    await expect(sidebar).toBeVisible();

    const layerIds = await sidebar.locator('[data-sidebar-layer]').evaluateAll((layers) =>
      layers.map((layer) => layer.getAttribute('data-sidebar-layer')),
    );
    expect(layerIds).toEqual(['capability', 'foundation', 'operations']);

    const categoryIds = await sidebar.locator('[data-sidebar-category]').evaluateAll((categories) =>
      categories.map((category) => category.getAttribute('data-sidebar-category')),
    );
    expect(categoryIds).toEqual([
      'ai', 'blockchain', 'tee',
      'systems', 'gpu', 'crypto', 'p2p',
      'ops', 'isms-aml',
    ]);

    await sidebar.getByRole('button', { name: 'AI 세부 주제 펼치기' }).click();
    const ai = sidebar.locator('[data-sidebar-category="ai"]');
    const aiCategoryLink = ai.getByRole('link', { name: 'AI', exact: true });
    await expect(aiCategoryLink).not.toHaveClass(/truncate/);
    const aiCategoryLinkBox = await aiCategoryLink.boundingBox();
    expect(aiCategoryLinkBox?.height).toBeGreaterThanOrEqual(44);
    expect(await aiCategoryLink.locator('span').evaluate((node) => getComputedStyle(node).whiteSpace))
      .not.toBe('nowrap');
    const categoryToggle = ai.getByRole('button', { name: 'AI 세부 주제 접기' });
    const categoryToggleBox = await categoryToggle.boundingBox();
    expect(categoryToggleBox?.width).toBeGreaterThanOrEqual(44);
    expect(categoryToggleBox?.height).toBeGreaterThanOrEqual(44);
    const stageIds = await ai.locator('[data-sidebar-stage]').evaluateAll((stages) =>
      stages.map((stage) => stage.getAttribute('data-sidebar-stage')),
    );
    expect(stageIds).toEqual(['method', 'target', 'foundation', 'build']);
    await expect(ai.locator('[data-sidebar-curriculum="ai"]')).toContainText('4 STEPS');
    await expect(ai.getByText('AI 전체 지도 · 특화 경로', { exact: true })).toHaveCount(0);
    const methodStage = ai.locator('[data-sidebar-stage="method"]');
    const targetStage = ai.locator('[data-sidebar-stage="target"]');
    await expect(methodStage).toHaveAttribute('aria-label', '00 공통 읽기 프레임');
    await expect(methodStage).toHaveAttribute('data-stage-role', 'orient');
    await expect(methodStage.getByRole('link', { name: 'AI 시스템 공통 관점', exact: true })).toBeVisible();
    await expect(methodStage.getByRole('link')).toHaveCount(1);
    await expect(targetStage.getByRole('link', { name: '지식 시스템', exact: true })).toBeVisible();
    await expect(targetStage.getByRole('link', { name: '로봇 AI', exact: true })).toBeVisible();
    await expect(targetStage.getByText('언어 · 지식', { exact: true })).toBeVisible();
    await expect(targetStage.getByText('인식 · 생성', { exact: true })).toBeVisible();
    await expect(targetStage.getByText('행동 · 예측', { exact: true })).toBeVisible();
    await expect(ai.getByText('딥러닝 공통 기반', { exact: true })).toBeVisible();

    const llmLink = targetStage.getByRole('link', { name: 'LLM', exact: true });
    await expect(llmLink).toHaveAttribute('href', /\/lab\/blog\/ai\?sub=ai-llm$/);
    await expect(targetStage.getByRole('link', { name: 'LLM 아키텍처', exact: true })).toHaveCount(0);
    const llmDisclosure = targetStage.getByRole('button', { name: 'LLM 세부 주제 펼치기' });
    await expect(llmDisclosure).toHaveAttribute('aria-expanded', 'false');
    await llmDisclosure.click();
    await expect(targetStage.getByRole('link', { name: '모델 만들기 · 검증', exact: true })).toBeVisible();
    await expect(targetStage.getByRole('link', { name: '실행 · 배포', exact: true })).toBeVisible();
    const modelBuildingDisclosure = targetStage.getByRole('button', { name: '모델 만들기 · 검증 세부 주제 펼치기' });
    await expect(modelBuildingDisclosure).toHaveAttribute('aria-expanded', 'false');
    await modelBuildingDisclosure.click();
    await expect(targetStage.getByRole('link', { name: '01 · 데이터 · Pre-training', exact: true })).toBeVisible();
    await expect(targetStage.getByRole('link', { name: '02 · LLM 아키텍처', exact: true })).toBeVisible();
    for (const disclosure of [
      targetStage.getByRole('button', { name: 'LLM 세부 주제 접기' }),
      targetStage.getByRole('button', { name: '모델 만들기 · 검증 세부 주제 접기' }),
    ]) {
      const box = await disclosure.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    const overflow = await sidebar.evaluate((element) => ({
      own: element.scrollWidth - element.clientWidth,
      children: Array.from(element.querySelectorAll<HTMLElement>('[data-sidebar-layer], [data-sidebar-stage], a, button'))
        .flatMap((child) => {
          const childRect = child.getBoundingClientRect();
          const parentRect = element.getBoundingClientRect();
          return childRect.left < parentRect.left - 1 || childRect.right > parentRect.right + 1
            ? [{ text: child.textContent?.trim().slice(0, 80), left: childRect.left, right: childRect.right }]
            : [];
        }),
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(overflow.own).toBeLessThanOrEqual(1);
    expect(overflow.children).toEqual([]);
    expect(overflow.document).toBeLessThanOrEqual(1);
  });
}

for (const viewport of [viewports[1], viewports[3]]) {
  test(`sidebar role legend follows the active category at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ops`, { waitUntil: 'networkidle' });
    const sidebar = await visibleSidebar(page, viewport.width);
    const legend = sidebar.locator('[data-sidebar-role-legend]');

    await expect(legend).toHaveText('구현');
    await expect(legend.getByText('읽기', { exact: true })).toHaveCount(0);
    await expect(legend.getByText('목표', { exact: true })).toHaveCount(0);
    await expect(legend.getByText('기반', { exact: true })).toHaveCount(0);
  });
}

for (const viewport of [viewports[1], viewports[3]]) {
  test(`an active parent topic highlights its link without merging the disclosure at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-llm`, { waitUntil: 'networkidle' });
    const sidebar = await visibleSidebar(page, viewport.width);
    const targetStage = sidebar
      .locator('[data-sidebar-category="ai"]')
      .locator('[data-sidebar-stage="target"]');
    const activeParentLink = targetStage.getByRole('link', { name: 'LLM', exact: true });

    await expect(activeParentLink).toHaveAttribute('aria-current', 'page');
    await expect(activeParentLink).toHaveClass(/bg-accent/);
    await expect(activeParentLink.locator('..')).not.toHaveClass(/bg-accent/);
    await expect(targetStage.getByRole('button', { name: 'LLM 세부 주제 접기' })).toBeVisible();
  });
}

for (const viewport of viewports) {
  test(`active AI subcategory opens and marks its foundation stage at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai?sub=ai-foundations`, { waitUntil: 'networkidle' });
    const sidebar = await visibleSidebar(page, viewport.width);
    const ai = sidebar.locator('[data-sidebar-category="ai"]');
    await expect(ai.getByRole('link', { name: 'AI', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(ai.getByRole('button', { name: 'AI 세부 주제 접기' })).toHaveAttribute('aria-expanded', 'true');
    const activeLink = ai.getByRole('link', { name: '딥러닝 공통 기반', exact: true });
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toHaveClass(/bg-accent/);
    await expect(activeLink.locator('xpath=ancestor::section[@data-sidebar-stage="foundation"]')).toBeVisible();
  });
}

for (const viewport of [viewports[1], viewports[3]]) {
  test(`article ownership overrides a stale subcategory query at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/perceptron?sub=ai-llm`, { waitUntil: 'networkidle' });
    const sidebar = await visibleSidebar(page, viewport.width);
    const ai = sidebar.locator('[data-sidebar-category="ai"]');
    const foundation = ai.locator('[data-sidebar-stage="foundation"]');
    const target = ai.locator('[data-sidebar-stage="target"]');

    await expect(foundation.getByRole('link', { name: '딥러닝 공통 기반', exact: true })).toBeVisible();
    await expect(foundation.getByRole('link', { name: '딥러닝 공통 기반', exact: true })).toHaveClass(/bg-accent/);
    expect(await target.getByRole('link', { name: 'LLM', exact: true }).evaluate((node) =>
      node.classList.contains('bg-accent'),
    )).toBe(false);
  });
}

for (const viewport of [viewports[1], viewports[3]]) {
  test(`AI category page mirrors the same four learning stages at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai`, { waitUntil: 'networkidle' });
    const stages = page.locator('main [data-category-stage]');
    await expect(stages).toHaveCount(4);
    expect(await stages.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-category-stage'))))
      .toEqual(['method', 'target', 'foundation', 'build']);
    expect(await stages.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-stage-role'))))
      .toEqual(['orient', 'target', 'foundation', 'build']);
    await expect(page.getByRole('heading', { name: '공통 읽기 프레임', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '목표 분야', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '공통 보강 자료', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '공통 구현 허브', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /연구 트랙 지도/ })).toBeVisible();
    await expect(page.getByText('진입점', { exact: true })).toBeVisible();
    const methodStage = page.locator('main [data-category-stage="method"]');
    const targetStage = page.locator('main [data-category-stage="target"]');
    await expect(methodStage.getByRole('link', { name: /AI 시스템 공통 관점/ })).toHaveCount(1);
    await expect(targetStage.getByRole('link', { name: /지식 시스템/ })).toHaveCount(1);
    await expect(targetStage.getByRole('link', { name: /로봇 AI/ })).toHaveCount(1);
    const knowledgeContract = targetStage.locator('[data-target-route-contract="knowledge-systems"]');
    await expect(knowledgeContract).toContainText('현재 연구');
    await expect(knowledgeContract).toContainText('최소 원문');
    await expect(knowledgeContract).toContainText('핵심 4');
    await expect(knowledgeContract).toContainText('기반 2');
    await expect(knowledgeContract).toContainText('구현 1');
    expect(await targetStage.locator('[data-learning-cluster]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-learning-cluster'))))
      .toEqual(['language-knowledge', 'multimodal-integration', 'perception-generation', 'action-prediction']);
    const documentOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(documentOverflow).toBeLessThanOrEqual(1);
  });
}

for (const viewport of [viewports[1], viewports[3]]) {
  test(`deep LLM article opens every sidebar ancestor at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/llm-architecture-kv-long-context`, { waitUntil: 'networkidle' });
    const sidebar = await visibleSidebar(page, viewport.width);
    const ai = sidebar.locator('[data-sidebar-category="ai"]');
    const targetStage = ai.locator('[data-sidebar-stage="target"]');
    const breadcrumb = page.getByRole('navigation', { name: '현재 위치', exact: true });

    await expect(targetStage.getByRole('button', { name: 'LLM 세부 주제 접기' })).toHaveAttribute('aria-expanded', 'true');
    await expect(targetStage.getByRole('button', { name: '모델 만들기 · 검증 세부 주제 접기' })).toHaveAttribute('aria-expanded', 'true');
    await expect(targetStage.getByRole('button', { name: 'LLM 아키텍처 세부 주제 접기' })).toHaveAttribute('aria-expanded', 'true');
    const activeLeaf = targetStage.getByRole('link', { name: '02 · KV와 긴 문맥', exact: true });
    await expect(activeLeaf).toBeVisible();
    await expect(activeLeaf).toHaveClass(/bg-accent/);
    const architectureDisclosure = targetStage.getByRole('button', { name: 'LLM 아키텍처 세부 주제 접기' });
    await architectureDisclosure.click();
    await expect(targetStage.getByRole('button', { name: 'LLM 아키텍처 세부 주제 펼치기' })).toHaveAttribute('aria-expanded', 'false');
    await expect(activeLeaf).toBeHidden();
    await targetStage.getByRole('button', { name: 'LLM 아키텍처 세부 주제 펼치기' }).click();
    await expect(activeLeaf).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'LLM', exact: true })).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: '모델 만들기 · 검증', exact: true })).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: '02 · LLM 아키텍처', exact: true })).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: '02 · KV와 긴 문맥', exact: true })).toBeVisible();
  });
}
