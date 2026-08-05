import { expect, test } from '@playwright/test';
import { getArticle, getCategoryBySlug, type Subcategory } from '../src/content';
import { getSidebarLearningStages } from '../src/content/sidebar-learning-structure';
import {
  getTopDownResearchTrack,
  topDownResearchTracks,
  type ResearchDependency,
} from '../src/content/ai/topdownResearchTracks';

function expectRegisteredDependency(dependency: ResearchDependency) {
  const category = dependency.category ?? 'ai';
  expect(
    getArticle(category, dependency.articleSlug),
    `${category}/${dependency.articleSlug} is not registered`,
  ).not.toBeNull();
  expect(dependency.label.trim().length).toBeGreaterThan(0);
  expect(dependency.reason.trim().length).toBeGreaterThan(0);
}

function expectRouteCoverage(subcategory: Subcategory, trail: string[] = []) {
  if (getTopDownResearchTrack(subcategory.slug)) return;

  const nextTrail = [...trail, subcategory.slug];
  expect(
    subcategory.children?.length,
    `${nextTrail.join('/')} has neither a route nor routed descendants`,
  ).toBeGreaterThan(0);

  for (const child of subcategory.children ?? []) {
    expectRouteCoverage(child, nextTrail);
  }
}

test('every AI target exposes a direct route or recursively routed branches', () => {
  const ai = getCategoryBySlug('ai');
  expect(ai).not.toBeNull();
  const targetStage = getSidebarLearningStages(ai!).find((stage) => stage.role === 'target');
  expect(targetStage).toBeDefined();

  for (const target of targetStage!.subcategories) {
    expectRouteCoverage(target);
  }
});

test('every research route has finite foundations and resolvable evidence and implementation edges', () => {
  for (const track of topDownResearchTracks) {
    expect(track.current.source.trim().length, `${track.id}: current source`).toBeGreaterThan(0);
    expect(track.current.published.trim().length, `${track.id}: current date`).toBeGreaterThan(0);
    expect(track.current.url || track.current.articleSlug, `${track.id}: current evidence`).toBeTruthy();
    expect(track.canonical.source.trim().length, `${track.id}: canonical source`).toBeGreaterThan(0);
    expect(track.canonical.published.trim().length, `${track.id}: canonical date`).toBeGreaterThan(0);
    expect(track.canonical.url || track.canonical.articleSlug, `${track.id}: canonical evidence`).toBeTruthy();

    for (const evidence of [track.current, track.canonical]) {
      if (!evidence.articleSlug) continue;
      const category = evidence.category ?? 'ai';
      expect(
        getArticle(category, evidence.articleSlug),
        `${track.id}: evidence article ${category}/${evidence.articleSlug}`,
      ).not.toBeNull();
    }

    expect(track.concepts.length, `${track.id}: concepts`).toBeGreaterThan(0);
    expect(track.concepts.length, `${track.id}: concepts must stay finite`).toBeLessThanOrEqual(8);
    expect(track.foundations.length, `${track.id}: foundations`).toBeGreaterThan(0);
    expect(track.foundations.length, `${track.id}: foundations must stay finite`).toBeLessThanOrEqual(5);
    expect(track.implementation.length, `${track.id}: implementation`).toBeGreaterThan(0);
    for (const dependency of [...track.concepts, ...track.foundations, ...track.implementation]) {
      expectRegisteredDependency(dependency);
    }
    const dependencyRoles = [
      ...track.concepts.map((dependency) => ({ ...dependency, role: 'concept' })),
      ...track.foundations.map((dependency) => ({ ...dependency, role: 'foundation' })),
      ...track.implementation.map((dependency) => ({ ...dependency, role: 'implementation' })),
    ].filter((dependency) => !dependency.category || dependency.category === 'ai');
    const duplicateDependencies = dependencyRoles
      .filter((dependency, index) => dependencyRoles.findIndex(
        (candidate) => candidate.articleSlug === dependency.articleSlug,
      ) !== index)
      .map((dependency) => `${dependency.articleSlug}:${dependency.role}`);
    expect(duplicateDependencies, `${track.id}: one article must not repeat across dependency stages`).toEqual([]);
    const evidenceArticleKeys = new Set(
      [track.current, track.canonical, ...(track.supportingEvidence ?? [])]
        .filter((evidence) => evidence.articleSlug)
        .map((evidence) => `${evidence.category ?? track.category}:${evidence.articleSlug}`),
    );
    const repeatedEvidenceDependencies = dependencyRoles
      .filter((dependency) => evidenceArticleKeys.has(`${dependency.category ?? track.category}:${dependency.articleSlug}`))
      .map((dependency) => `${dependency.articleSlug}:${dependency.role}`);
    expect(
      repeatedEvidenceDependencies,
      `${track.id}: a source checkpoint article must not repeat as a dependency`,
    ).toEqual([]);

    if (
      track.current.articleSlug
      && track.current.articleSlug === track.canonical.articleSlug
      && (track.current.category ?? track.category) === (track.canonical.category ?? track.category)
    ) {
      expect(track.current.articleAnchor, `${track.id}: integrated current anchor`).toBeTruthy();
      expect(track.canonical.articleAnchor, `${track.id}: integrated canonical anchor`).toBeTruthy();
      expect(
        track.current.articleAnchor,
        `${track.id}: integrated current/canonical anchors must differ`,
      ).not.toBe(track.canonical.articleAnchor);
    }

    expect(track.stopReason.trim().length, `${track.id}: historical stop rule`).toBeGreaterThan(30);
    expect(track.promotionRule.trim().length, `${track.id}: current promotion rule`).toBeGreaterThan(30);
  }
});
