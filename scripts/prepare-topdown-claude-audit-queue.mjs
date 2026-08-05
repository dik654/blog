#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const workspaceRoot = path.dirname(repoRoot);
const auditPath = path.join(
  repoRoot,
  'knowledge/authoring/runs/2026-07-31-topdown-source-receipt-audit.json',
);
const queuePath = path.resolve(
  repoRoot,
  process.argv[2] ?? '.codex-tmp/claude-topdown-closure-audit-2026-07-31',
);

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const articles = new Map();

for (const track of audit.tracks) {
  for (const assignment of track.assignments) {
    const article = assignment.article;
    if (!article || article.closureStatus === 'ACCEPT') continue;

    const existing = articles.get(article.slug) ?? {
      article,
      tracks: new Set(),
      roles: new Set(),
    };
    existing.tracks.add(`${track.title} (${track.id})`);
    existing.roles.add(assignment.role);
    articles.set(article.slug, existing);
  }
}

const manifest = [...articles.values()]
  .sort((left, right) => left.article.slug.localeCompare(right.article.slug))
  .map(({ article, tracks, roles }) => {
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

    return {
      id: `article-${article.slug}`,
      slug: article.slug,
      previousStatus: article.status,
      previousClosureStatus: article.closureStatus,
      roles: [...roles].sort(),
      tracks: [...tracks].sort(),
      scope: [
        `TOP-DOWN ARTICLE CLOSURE AUDIT: ${article.title} (${article.slug}).`,
        `Track context: ${[...tracks].sort().join('; ')}.`,
        `Assigned roles: ${[...roles].sort().join(', ')}.`,
        'Audit the current source as one bounded learning unit.',
        'A learner must be able to start from the track goal, understand this article without hidden prerequisite jumps, and the private authoring fixture must be solvable using only the taught causal model.',
        'The hard-transfer fixture is an internal evaluation device, not public article content. Do not require a visible quiz, worked-transfer block, answer-reveal interaction, or reader exercise; instead judge whether the explanatory body supplies every premise needed to solve an unseen private fixture.',
        'Check factual and mathematical correctness, claim/source boundaries, first-use explanations for specialized terms, Korean formula annotations that explain operation choice, meaningful controlled Viz state changes, responsive text fit, explicit next branch, and a finite stopping rule.',
        'Do not demand unrelated history or every sibling article. Do flag a broken owner boundary, unsupported current claim, raw or unreadable math, decorative-only Viz, or a missing prerequisite that prevents the article from fulfilling its assigned role.',
        'ACCEPT only when no concrete P0/P1/P2 defect remains in this bounded article closure.',
      ].join(' '),
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
  queue: path.relative(repoRoot, queuePath),
  articles: manifest.length,
  byPreviousClosureStatus: Object.groupBy(
    manifest,
    (item) => item.previousClosureStatus,
  ),
};
for (const [status, items] of Object.entries(summary.byPreviousClosureStatus)) {
  summary.byPreviousClosureStatus[status] = items.length;
}
fs.writeFileSync(
  path.join(queuePath, 'queue-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
