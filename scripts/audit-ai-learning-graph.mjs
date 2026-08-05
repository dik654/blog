import { build } from 'esbuild';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const outArg = process.argv.find((arg) => arg.startsWith('--out='));
const outputPath = outArg ? resolve(root, outArg.slice('--out='.length)) : null;

const entry = String.raw`
import ai from './src/content/ai/index.ts';
import { learningPaths } from './src/content/learning-paths.ts';
import { topDownResearchTracks } from './src/content/ai/topdownResearchTracks.ts';
import { getSidebarLearningStages } from './src/content/sidebar-learning-structure.ts';

const flattenSubcategories = (items, parent = null, depth = 0, topLevel = null) =>
  items.flatMap((item) => {
    const currentTopLevel = topLevel ?? item.slug;
    return [
      {
        slug: item.slug,
        name: item.name,
        parent,
        depth,
        topLevel: currentTopLevel,
        aggregateChildArticles: Boolean(item.aggregateChildArticles),
        childCount: item.children?.length ?? 0,
      },
      ...flattenSubcategories(item.children ?? [], item.slug, depth + 1, currentTopLevel),
    ];
  });

const descendants = (slug, nodes) => {
  const found = new Set([slug]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (node.parent && found.has(node.parent) && !found.has(node.slug)) {
        found.add(node.slug);
        changed = true;
      }
    }
  }
  return found;
};

const nodes = flattenSubcategories(ai.subcategories);
const articleBySlug = new Map(ai.articles.map((article) => [article.slug, article]));
const nodeBySlug = new Map(nodes.map((node) => [node.slug, node]));
const stages = getSidebarLearningStages(ai);
const aiLearningPaths = learningPaths.filter((path) => path.steps.some((step) => step.category === 'ai'));
const isSourceArticle = (article) => article.curriculumRole
  ? article.curriculumRole === 'source'
  : /^(paper|research|reference)-/.test(article.slug);

const learningStepOwners = new Map();
for (const path of aiLearningPaths) {
  path.steps.forEach((step, index) => {
    if (step.category !== 'ai') return;
    const owners = learningStepOwners.get(step.slug) ?? [];
    owners.push({ pathId: path.id, pathTitle: path.title, index, count: path.steps.length });
    learningStepOwners.set(step.slug, owners);
  });
}

const trackArticleOwners = new Map();
const addTrackOwner = (articleSlug, owner) => {
  const owners = trackArticleOwners.get(articleSlug) ?? [];
  owners.push(owner);
  trackArticleOwners.set(articleSlug, owners);
};

for (const track of topDownResearchTracks) {
  if (track.current.articleSlug) addTrackOwner(track.current.articleSlug, { trackId: track.id, role: 'current' });
  if (track.canonical.articleSlug) addTrackOwner(track.canonical.articleSlug, { trackId: track.id, role: 'canonical' });
  for (const item of track.concepts) addTrackOwner(item.articleSlug, { trackId: track.id, role: 'concept' });
  for (const item of track.foundations) {
    if (!item.category || item.category === 'ai') addTrackOwner(item.articleSlug, { trackId: track.id, role: 'foundation' });
  }
  for (const item of track.implementation) {
    if (!item.category || item.category === 'ai') addTrackOwner(item.articleSlug, { trackId: track.id, role: 'implementation' });
  }
}

const subcategoryRows = nodes.map((node) => {
  const exact = ai.articles.filter((article) => article.subcategory === node.slug);
  const visibleSlugs = node.aggregateChildArticles ? descendants(node.slug, nodes) : new Set([node.slug]);
  const visible = ai.articles.filter((article) => visibleSlugs.has(article.subcategory));
  const matchingTracks = topDownResearchTracks.filter((track) => track.subcategories.includes(node.slug));
  const entryTracks = matchingTracks.filter((track) => track.subcategories[0] === node.slug);
  const visibleLearningPaths = [...new Set(
    visible.flatMap((article) => (learningStepOwners.get(article.slug) ?? []).map((owner) => owner.pathId)),
  )];
  const isResearchTrackEntry = entryTracks.length > 0;
  const navigationHandoff = isResearchTrackEntry
    ? (node.childCount > 0 ? 'branch-directory' : (visibleLearningPaths.length > 0 ? 'learning-path-directory' : 'none'))
    : 'none';
  return {
    ...node,
    exactArticleCount: exact.length,
    exactCoreCount: exact.filter((article) => !isSourceArticle(article)).length,
    exactSourceCount: exact.filter(isSourceArticle).length,
    visibleArticleCount: visible.length,
    visibleCoreCount: visible.filter((article) => !isSourceArticle(article)).length,
    learningPathCount: visibleLearningPaths.length,
    learningPaths: visibleLearningPaths,
    trackCount: matchingTracks.length,
    trackIds: matchingTracks.map((track) => track.id),
    entryTrackIds: entryTracks.map((track) => track.id),
    hasTrackAndLearningPathData: isResearchTrackEntry && visibleLearningPaths.length > 0,
    presentationOwner: isResearchTrackEntry ? 'research-track' : 'article-sequence',
    navigationHandoff,
  };
});

const articleRows = ai.articles.map((article) => ({
  slug: article.slug,
  title: article.title,
  subcategory: article.subcategory,
  subcategoryExists: nodeBySlug.has(article.subcategory),
  curriculumRole: isSourceArticle(article) ? 'source' : 'core',
  declaredLearningPath: article.learningPath ?? null,
  learningStepOwners: learningStepOwners.get(article.slug) ?? [],
  trackOwners: trackArticleOwners.get(article.slug) ?? [],
}));

const resolveTrackLink = (trackId, role, link) => {
  if (!link.articleSlug) return null;
  const category = link.category ?? 'ai';
  return {
    trackId,
    role,
    category,
    articleSlug: link.articleSlug,
    resolves: category === 'ai' ? articleBySlug.has(link.articleSlug) : true,
  };
};

const trackRows = topDownResearchTracks.map((track) => {
  const dependencies = [
    ...track.concepts.map((item) => ({ ...item, role: 'concept' })),
    ...track.foundations.map((item) => ({ ...item, role: 'foundation' })),
    ...track.implementation.map((item) => ({ ...item, role: 'implementation' })),
  ];
  const aiDependencies = dependencies.filter((item) => !item.category || item.category === 'ai');
  const duplicateDependencies = aiDependencies
    .filter((item, index) => aiDependencies.findIndex((candidate) => candidate.articleSlug === item.articleSlug) !== index)
    .map((item) => item.articleSlug);
  return {
    id: track.id,
    subcategories: track.subcategories,
    missingSubcategories: track.subcategories.filter((slug) => !nodeBySlug.has(slug)),
    current: resolveTrackLink(track.id, 'current', track.current),
    canonical: resolveTrackLink(track.id, 'canonical', track.canonical),
    unresolvedDependencies: aiDependencies
      .filter((item) => !articleBySlug.has(item.articleSlug))
      .map((item) => ({ role: item.role, articleSlug: item.articleSlug })),
    duplicateDependencies: [...new Set(duplicateDependencies)],
    conceptCount: track.concepts.length,
    foundationCount: track.foundations.length,
    implementationCount: track.implementation.length,
  };
});

const stageRows = stages.map((stage) => ({
  id: stage.id,
  order: stage.order,
  role: stage.role,
  label: stage.label,
  topLevelSlugs: stage.subcategories.map((subcategory) => subcategory.slug),
  clusterCount: stage.clusters.length,
  clusters: stage.clusters.map((cluster) => ({
    id: cluster.id,
    label: cluster.label,
    slugs: cluster.subcategories.map((subcategory) => subcategory.slug),
  })),
}));

const findings = {
  duplicateArticleSlugs: ai.articles
    .filter((article, index) => ai.articles.findIndex((candidate) => candidate.slug === article.slug) !== index)
    .map((article) => article.slug),
  articlesWithMissingSubcategory: articleRows.filter((article) => !article.subcategoryExists).map((article) => article.slug),
  emptyLeafSubcategories: subcategoryRows
    .filter((node) => node.childCount === 0 && node.exactArticleCount === 0)
    .map((node) => node.slug),
  sourceOnlyLeafSubcategories: subcategoryRows
    .filter((node) => node.childCount === 0 && node.exactArticleCount > 0 && node.exactCoreCount === 0)
    .map((node) => node.slug),
  unownedCoreArticles: articleRows
    .filter((article) =>
      article.curriculumRole === 'core'
      && article.learningStepOwners.length === 0
      && article.trackOwners.length === 0)
    .map((article) => ({ slug: article.slug, subcategory: article.subcategory })),
  optionalSourceArticlesOutsidePaths: articleRows
    .filter((article) =>
      article.curriculumRole === 'source'
      && article.learningStepOwners.length === 0
      && article.trackOwners.length === 0)
    .map((article) => ({ slug: article.slug, subcategory: article.subcategory })),
  trackEntriesWithLearningPathHandoff: subcategoryRows
    .filter((node) => node.hasTrackAndLearningPathData)
    .map((node) => ({
      slug: node.slug,
      trackIds: node.entryTrackIds,
      visibleArticleCount: node.visibleArticleCount,
      learningPaths: node.learningPaths,
      presentationOwner: node.presentationOwner,
      navigationHandoff: node.navigationHandoff,
    })),
  articlesInMultipleLearningPaths: articleRows
    .filter((article) => article.learningStepOwners.length > 1)
    .map((article) => ({ slug: article.slug, owners: article.learningStepOwners })),
  articlesWithDeclaredPathButMissingFromPath: articleRows
    .filter((article) => article.declaredLearningPath
      && !article.learningStepOwners.some((owner) => owner.pathId === article.declaredLearningPath))
    .map((article) => ({ slug: article.slug, declaredLearningPath: article.declaredLearningPath })),
  articlesInPathButDeclaredElsewhere: articleRows
    .filter((article) => article.declaredLearningPath
      && article.learningStepOwners.length > 0
      && !article.learningStepOwners.some((owner) => owner.pathId === article.declaredLearningPath))
    .map((article) => ({
      slug: article.slug,
      declaredLearningPath: article.declaredLearningPath,
      pathOwners: article.learningStepOwners.map((owner) => owner.pathId),
    })),
  articlesInAdditionalLearningPaths: articleRows
    .filter((article) => article.declaredLearningPath
      && article.learningStepOwners.some((owner) => owner.pathId === article.declaredLearningPath)
      && article.learningStepOwners.some((owner) => owner.pathId !== article.declaredLearningPath))
    .map((article) => ({
      slug: article.slug,
      declaredLearningPath: article.declaredLearningPath,
      additionalPathOwners: article.learningStepOwners
        .filter((owner) => owner.pathId !== article.declaredLearningPath)
        .map((owner) => owner.pathId),
    })),
  unresolvedLearningSteps: aiLearningPaths.flatMap((path) =>
    path.steps
      .filter((step) => step.category === 'ai' && !articleBySlug.has(step.slug))
      .map((step) => ({ pathId: path.id, articleSlug: step.slug }))),
  unresolvedTrackReferences: trackRows.flatMap((track) => [
    ...(track.current && !track.current.resolves ? [track.current] : []),
    ...(track.canonical && !track.canonical.resolves ? [track.canonical] : []),
    ...track.unresolvedDependencies.map((item) => ({ trackId: track.id, ...item })),
  ]),
  duplicateTrackDependencies: trackRows
    .filter((track) => track.duplicateDependencies.length > 0)
    .map((track) => ({
      trackId: track.id,
      articleSlugs: track.duplicateDependencies,
    })),
  duplicateTrackSubcategoryOwnership: nodes
    .map((node) => ({
      slug: node.slug,
      trackIds: topDownResearchTracks.filter((track) => track.subcategories.includes(node.slug)).map((track) => track.id),
    }))
    .filter((item) => item.trackIds.length > 1),
};

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  totals: {
    topLevelSubcategories: ai.subcategories.length,
    allSubcategories: nodes.length,
    articles: ai.articles.length,
    learningPaths: aiLearningPaths.length,
    researchTracks: topDownResearchTracks.length,
    sidebarStages: stages.length,
  },
  stages: stageRows,
  subcategories: subcategoryRows,
  learningPaths: aiLearningPaths.map((path) => ({
    id: path.id,
    title: path.title,
    displayOrder: path.displayOrder ?? null,
    aiStepCount: path.steps.filter((step) => step.category === 'ai').length,
    aiSteps: path.steps.filter((step) => step.category === 'ai').map((step) => step.slug),
  })),
  tracks: trackRows,
  articles: articleRows,
  findings,
}, null, 2));
`;

const bundle = await build({
  absWorkingDir: root,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node22',
  write: false,
  stdin: {
    contents: entry,
    resolveDir: root,
    sourcefile: 'audit-ai-learning-graph-entry.ts',
    loader: 'ts',
  },
  plugins: [{
    name: 'skip-ui-components',
    setup(buildApi) {
      buildApi.onResolve({ filter: /\/pages\/articles\// }, (args) => ({ path: args.path, external: true }));
      buildApi.onResolve({ filter: /\/components\/thumbnails\// }, (args) => ({ path: args.path, external: true }));
    },
  }],
  logLevel: 'silent',
});

const bundlePath = resolve(root, '.codex-tmp/audit-ai-learning-graph.bundle.cjs');
await mkdir(dirname(bundlePath), { recursive: true });
await writeFile(bundlePath, bundle.outputFiles[0].text, 'utf8');

const execution = spawnSync(process.execPath, [bundlePath], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
});
await rm(bundlePath, { force: true });

if (execution.status !== 0) {
  process.stderr.write(execution.stderr ?? execution.error?.stack ?? 'Audit bundle execution failed without stderr.\n');
  process.exit(execution.status ?? 1);
}

if (outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, execution.stdout, 'utf8');
  process.stdout.write(`${outputPath}\n`);
} else {
  process.stdout.write(execution.stdout);
}
