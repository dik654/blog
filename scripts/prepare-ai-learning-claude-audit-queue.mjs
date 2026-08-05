#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const workspaceRoot = path.dirname(repoRoot);
const auditPath = path.join(
  repoRoot,
  'knowledge/authoring/runs/2026-07-31-topdown-source-receipt-audit.json',
);
const graphPath = path.join(repoRoot, '.codex-tmp/ai-learning-graph-predeploy.json');
const queuePath = path.resolve(
  repoRoot,
  process.argv[2] ?? '.codex-tmp/claude-ai-learning-closure-audit-2026-07-31',
);

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const graphBySlug = new Map(graph.articles.map((article) => [article.slug, article]));

const manifest = audit.allAiArticles
  .filter((article) => article.closureStatus !== 'ACCEPT')
  .sort((left, right) => left.slug.localeCompare(right.slug))
  .map((article) => {
    const graphArticle = graphBySlug.get(article.slug);
    const pathContext = (graphArticle?.learningStepOwners ?? [])
      .map((owner) => `${owner.pathTitle} (${owner.pathId}) ${owner.index + 1}/${owner.count}`);
    const trackContext = (graphArticle?.trackOwners ?? [])
      .map((owner) => `${owner.trackId}:${owner.role}`);
    const sources = new Set(
      article.files.map(({ file }) => path.posix.join('blog', file)),
    );

    if (article.metadataFile) {
      const metadata = path.posix.join('blog', article.metadataFile);
      if (fs.existsSync(path.join(workspaceRoot, metadata))) sources.add(metadata);
    }

    const contentSpec = path.posix.join(
      'blog',
      'src/pages/articles/ai/content-specs',
      `${article.slug}.md`,
    );
    if (fs.existsSync(path.join(workspaceRoot, contentSpec))) sources.add(contentSpec);
    const localContentSpec = path.posix.join(
      'blog',
      'src/pages/articles/ai',
      article.slug,
      'content-spec.md',
    );
    if (fs.existsSync(path.join(workspaceRoot, localContentSpec))) sources.add(localContentSpec);

    const isOptionalSource = graphArticle?.curriculumRole === 'source'
      && pathContext.length === 0
      && trackContext.length === 0;
    const routeContext = [
      pathContext.length ? `Learning paths: ${pathContext.join('; ')}.` : '',
      trackContext.length ? `Research tracks: ${trackContext.join('; ')}.` : '',
      isOptionalSource
        ? 'This is an intentionally hidden optional historical source below the minimum required spine; audit its bounded accuracy without demanding promotion into the visible required route.'
        : '',
    ].filter(Boolean).join(' ');

    return {
      id: `article-${article.slug}`,
      slug: article.slug,
      previousStatus: article.status,
      previousClosureStatus: article.closureStatus,
      curriculumRole: graphArticle?.curriculumRole ?? 'core',
      learningPaths: pathContext,
      tracks: trackContext,
      scope: [
        `ALL-AI CURRENT-SOURCE CLOSURE AUDIT: ${article.title} (${article.slug}).`,
        routeContext,
        'Audit the current source as one bounded learning unit in the current-to-minimum-foundation curriculum.',
        'A learner must understand why this article appears at this position, learn every first-use prerequisite needed here, and the private authoring fixture must be solvable using only the causal model taught in the article.',
        'The hard-transfer fixture is an internal evaluation device, not public article content. Do not require a visible quiz, worked-transfer block, answer-reveal interaction, or reader exercise; instead judge whether the explanatory body supplies every premise needed to solve an unseen private fixture.',
        'Check factual and mathematical correctness, current-claim/source boundaries, Korean explanations for formula operations, meaningful controlled Viz state changes, responsive readability, explicit handoff to the next needed branch, and a finite stopping rule.',
        'Do not demand unrelated history, every sibling article, or promotion of optional historical sources.',
        'Flag hidden prerequisite jumps, unsupported claims, raw or unreadable math, decorative-only Viz, broken route ownership, duplicated content without a distinct question, and any source boundary that prevents this article from fulfilling its assigned role.',
        'ACCEPT only when no concrete P0/P1/P2 defect remains in this bounded current-source closure.',
      ].filter(Boolean).join(' '),
      sources: [...sources].sort(),
    };
  });

fs.mkdirSync(queuePath, { recursive: true });
fs.writeFileSync(
  path.join(queuePath, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const summary = {
  generatedAt: new Date().toISOString(),
  auditSource: path.relative(repoRoot, auditPath),
  graphSource: path.relative(repoRoot, graphPath),
  queue: path.relative(repoRoot, queuePath),
  allAiArticles: audit.summary.allAiArticles,
  currentClosureAccepted: audit.summary.allAiClosure.ACCEPT,
  queued: manifest.length,
  byPreviousClosureStatus: Object.groupBy(
    manifest,
    (item) => item.previousClosureStatus,
  ),
  optionalHistoricalSourcesQueued: manifest.filter((item) => (
    item.curriculumRole === 'source'
    && item.learningPaths.length === 0
    && item.tracks.length === 0
  )).length,
};
for (const [status, items] of Object.entries(summary.byPreviousClosureStatus)) {
  summary.byPreviousClosureStatus[status] = items.length;
}
fs.writeFileSync(
  path.join(queuePath, 'queue-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
