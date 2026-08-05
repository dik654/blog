import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const codeRoot = path.dirname(root);
const articleRoot = path.join(root, 'src/pages/articles');
const contentRoot = path.join(root, 'src/content');
const receiptRoot = path.join(root, '.codex-tmp');
const learningGraphReport = process.env.AI_LEARNING_GRAPH_REPORT
  ?? path.join(root, '.codex-tmp/ai-learning-graph-predeploy.json');
const reportDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
const outputJson = process.env.TOPDOWN_RECEIPT_REPORT
  ?? path.join(root, `knowledge/authoring/runs/${reportDate}-topdown-source-receipt-audit.json`);
const outputMarkdown = outputJson.replace(/\.json$/, '-report.md');

async function walk(directory, predicate = () => true) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target, predicate);
    return predicate(target) ? [target] : [];
  }));
  return nested.flat();
}

function sha256(source) {
  return createHash('sha256').update(source).digest('hex');
}

async function fileHash(file) {
  return sha256(await readFile(file));
}

function loadTracks(source) {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  const evaluate = new Function('exports', 'module', output);
  evaluate(module.exports, module);
  return module.exports.topDownResearchTracks;
}

function resolveArticleEntry(importPath) {
  const relative = importPath.replace(/^@\//, 'src/');
  const candidates = [
    path.join(root, `${relative}.tsx`),
    path.join(root, `${relative}.ts`),
    path.join(root, relative, 'index.tsx'),
    path.join(root, relative, 'index.ts'),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

function resolveLocalImport(sourceFile, importPath) {
  if (!importPath.startsWith('.')) return undefined;
  const base = path.resolve(path.dirname(sourceFile), importPath);
  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
  ];
  return candidates.find((candidate) => candidate.startsWith(articleRoot) && existsSync(candidate));
}

async function articleClosure(entryFile) {
  const visited = new Set();
  const files = [];

  async function visit(file) {
    if (!file || visited.has(file)) return;
    visited.add(file);
    files.push(file);
    const source = await readFile(file, 'utf8');
    const imports = [
      ...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g),
      ...source.matchAll(/import\(\s*['"](\.[^'"]+)['"]\s*\)/g),
    ];
    for (const match of imports) {
      await visit(resolveLocalImport(file, match[1]));
    }
  }

  await visit(entryFile);
  return files;
}

async function articleRegistry() {
  const registry = new Map();
  const contentFiles = await walk(path.join(contentRoot, 'ai'), (file) => file.endsWith('.ts'));
  const registeredSlugs = existsSync(learningGraphReport)
    ? new Set(JSON.parse(await readFile(learningGraphReport, 'utf8')).articles.map((article) => article.slug))
    : null;

  const property = (object, name) => object.properties.find((item) => (
    ts.isPropertyAssignment(item)
    && (
      (ts.isIdentifier(item.name) && item.name.text === name)
      || (ts.isStringLiteral(item.name) && item.name.text === name)
    )
  ));
  const literal = (object, name) => {
    const item = property(object, name);
    return item && ts.isStringLiteralLike(item.initializer) ? item.initializer.text : undefined;
  };

  for (const file of contentFiles) {
    const source = await readFile(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (!ts.isObjectLiteralExpression(node)) {
        ts.forEachChild(node, visit);
        return;
      }

      const slug = literal(node, 'slug');
      const title = literal(node, 'title');
      const subcategory = literal(node, 'subcategory');
      const component = property(node, 'component');
      const componentSource = component?.initializer.getText(sourceFile) ?? '';
      const importPath = componentSource.match(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/)?.[1];
      if (slug && title && subcategory && importPath && (!registeredSlugs || registeredSlugs.has(slug))) {
        registry.set(slug, {
          slug,
          title,
          subcategory,
          importPath,
          curriculumRole: literal(node, 'curriculumRole'),
          learningPath: literal(node, 'learningPath'),
          metadataFile: path.relative(root, file),
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return registry;
}

function normalizeHashedPath(rawPath) {
  const cleaned = rawPath.replace(/^\*/, '').trim();
  if (path.isAbsolute(cleaned)) return cleaned;
  if (cleaned.startsWith('blog/')) return path.join(codeRoot, cleaned);
  const fromBlog = path.join(root, cleaned);
  if (existsSync(fromBlog)) return fromBlog;
  return path.join(codeRoot, cleaned);
}

async function receiptIndex() {
  const byFile = new Map();
  const progressFiles = await walk(receiptRoot, (file) => file.endsWith('.jsonl'));

  for (const progressFile of progressFiles) {
    const queue = path.dirname(progressFile);
    const rows = (await readFile(progressFile, 'utf8'))
      .split('\n')
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch {
          return [];
        }
      })
      .filter((row) => (
        row.status === 'completed'
        && row.worker === 'claude-code:sonnet'
        && row.strict_valid === true
        && row.source_hash_stable === true
        && (row.first_line === 'ACCEPT' || row.first_line === 'REVISE')
      ));

    for (const row of rows) {
      const hashFile = path.join(queue, 'hashes', `${row.id}.attempt-${row.attempt}.after`);
      if (!existsSync(hashFile)) continue;
      const lines = (await readFile(hashFile, 'utf8')).split('\n').filter(Boolean);
      for (const line of lines) {
        const match = line.match(/^([a-f0-9]{64})\s+(.+)$/);
        if (!match) continue;
        const file = normalizeHashedPath(match[2]);
        const receipts = byFile.get(file) ?? [];
        receipts.push({
          hash: match[1],
          verdict: row.first_line,
          id: row.id,
          attempt: row.attempt,
          at: row.at,
          queue: path.relative(root, queue),
          progressFile: path.relative(root, progressFile),
        });
        byFile.set(file, receipts);
      }
    }
  }

  for (const receipts of byFile.values()) {
    receipts.sort((a, b) => String(a.at).localeCompare(String(b.at)) || a.attempt - b.attempt);
  }
  return byFile;
}

function fileReceiptStatus(file, currentHash, receipts) {
  if (!receipts?.length) return { status: 'UNVERIFIED' };
  const matching = receipts.filter((receipt) => receipt.hash === currentHash);
  if (!matching.length) {
    const latest = receipts.at(-1);
    return { status: 'DRIFT', latestReceipt: latest };
  }
  const latest = matching.at(-1);
  return {
    status: latest.verdict === 'ACCEPT' ? 'ACCEPT' : 'REVIEW_REQUIRED',
    latestReceipt: latest,
  };
}

function closureStatus(fileStatuses) {
  if (fileStatuses.every((entry) => entry.status === 'ACCEPT')) return 'ACCEPT';
  if (fileStatuses.some((entry) => entry.status === 'REVIEW_REQUIRED')) return 'REVIEW_REQUIRED';
  if (fileStatuses[0]?.status === 'ACCEPT') return 'PARTIAL';
  if (fileStatuses.some((entry) => entry.status === 'DRIFT')) return 'DRIFT';
  return 'UNVERIFIED';
}

const trackSource = await readFile(path.join(root, 'src/content/ai/topdownResearchTracks.ts'), 'utf8');
const tracks = loadTracks(trackSource);
const registry = await articleRegistry();
const receipts = await receiptIndex();
const articleCache = new Map();

async function auditArticle(slug) {
  if (articleCache.has(slug)) return articleCache.get(slug);
  const metadata = registry.get(slug);
  if (!metadata) {
    const missing = { slug, status: 'MISSING_REGISTRY', closureStatus: 'MISSING_REGISTRY', files: [] };
    articleCache.set(slug, missing);
    return missing;
  }
  const entryFile = resolveArticleEntry(metadata.importPath);
  if (!entryFile) {
    const missing = {
      ...metadata,
      status: 'MISSING_SOURCE',
      closureStatus: 'MISSING_SOURCE',
      files: [],
    };
    articleCache.set(slug, missing);
    return missing;
  }

  const files = await articleClosure(entryFile);
  const auditedFiles = [];
  for (const file of files) {
    const currentHash = await fileHash(file);
    const receipt = fileReceiptStatus(file, currentHash, receipts.get(file));
    auditedFiles.push({
      file: path.relative(root, file),
      hash: currentHash,
      ...receipt,
    });
  }
  const article = {
    ...metadata,
    entryFile: path.relative(root, entryFile),
    status: auditedFiles[0]?.status ?? 'UNVERIFIED',
    closureStatus: closureStatus(auditedFiles),
    files: auditedFiles,
  };
  articleCache.set(slug, article);
  return article;
}

const roleOrder = ['current', 'canonical', 'concept', 'foundation', 'implementation'];
const trackAudits = [];
for (const track of tracks) {
  const assignments = [
    { role: 'current', slug: track.current.articleSlug },
    { role: 'canonical', slug: track.canonical.articleSlug },
    ...track.concepts.map((item) => ({ role: 'concept', slug: item.articleSlug })),
    ...track.foundations
      .filter((item) => !item.category || item.category === 'ai')
      .map((item) => ({ role: 'foundation', slug: item.articleSlug })),
    ...track.implementation
      .filter((item) => !item.category || item.category === 'ai')
      .map((item) => ({ role: 'implementation', slug: item.articleSlug })),
  ].filter((item) => item.slug);
  const auditedAssignments = [];
  for (const assignment of assignments) {
    auditedAssignments.push({
      ...assignment,
      article: await auditArticle(assignment.slug),
    });
  }
  trackAudits.push({
    id: track.id,
    title: track.title,
    asOf: track.asOf,
    stopReason: track.stopReason,
    assignments: auditedAssignments,
  });
}

const allAssignments = trackAudits.flatMap((track) => (
  track.assignments.map((assignment) => ({ track: track.id, ...assignment }))
));
const trackArticles = [...articleCache.values()];
const allAiArticles = [];
for (const metadata of [...registry.values()].sort((left, right) => left.slug.localeCompare(right.slug))) {
  if (!metadata.subcategory.startsWith('ai-')) continue;
  allAiArticles.push(await auditArticle(metadata.slug));
}
const statusCounts = (items, key) => Object.fromEntries(
  ['ACCEPT', 'REVIEW_REQUIRED', 'PARTIAL', 'DRIFT', 'UNVERIFIED', 'MISSING_REGISTRY', 'MISSING_SOURCE']
    .map((status) => [status, items.filter((item) => item[key] === status).length]),
);
const priority = allAssignments
  .filter((assignment) => (
    assignment.article.status !== 'ACCEPT'
    || assignment.article.closureStatus !== 'ACCEPT'
  ))
  .sort((a, b) => (
    roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
    || a.track.localeCompare(b.track)
    || a.slug.localeCompare(b.slug)
  ))
  .map((assignment) => ({
    track: assignment.track,
    role: assignment.role,
    slug: assignment.slug,
    mainStatus: assignment.article.status,
    closureStatus: assignment.article.closureStatus,
    files: assignment.article.files
      .filter((file) => file.status !== 'ACCEPT')
      .map((file) => ({ file: file.file, status: file.status })),
  }));

const report = {
  generatedAt: new Date().toISOString(),
  policy: {
    acceptedReceipt: 'completed + strict_valid + source_hash_stable + current SHA-256 match + latest verdict ACCEPT',
    articleMain: 'registered article entry file',
    articleClosure: 'entry file and recursively imported local article files',
    articleRegistry: 'runtime AI learning-graph slug set plus AST metadata from src/content/ai; category-local slug ownership',
    excluded: 'HTTP 500, timeout, empty result, wrong worker, unstable hash, old hash, headerless result',
  },
  summary: {
    tracks: trackAudits.length,
    assignments: allAssignments.length,
    uniqueArticles: trackArticles.length,
    main: statusCounts(trackArticles, 'status'),
    closure: statusCounts(trackArticles, 'closureStatus'),
    priorityGaps: priority.length,
    allAiArticles: allAiArticles.length,
    allAiMain: statusCounts(allAiArticles, 'status'),
    allAiClosure: statusCounts(allAiArticles, 'closureStatus'),
    allAiPriorityGaps: allAiArticles.filter((article) => article.closureStatus !== 'ACCEPT').length,
  },
  priority,
  tracks: trackAudits,
  allAiArticles,
};

const markdown = [
  '# Top-down current-source Claude 영수증 감사',
  '',
  `- Track: ${report.summary.tracks}`,
  `- 역할 할당: ${report.summary.assignments}`,
  `- 고유 article: ${report.summary.uniqueArticles}`,
  `- Main current-hash ACCEPT: ${report.summary.main.ACCEPT}`,
  `- Closure current-hash ACCEPT: ${report.summary.closure.ACCEPT}`,
  `- 우선 검토 역할: ${report.summary.priorityGaps}`,
  `- 전체 AI article: ${report.summary.allAiArticles}`,
  `- 전체 AI closure current-hash ACCEPT: ${report.summary.allAiClosure.ACCEPT}`,
  `- 전체 AI closure 재검토 대상: ${report.summary.allAiPriorityGaps}`,
  '',
  '## 판정 규칙',
  '',
  '- `completed + strict_valid + source_hash_stable`인 Claude receipt만 읽는다.',
  '- Receipt가 기록한 SHA-256과 현재 파일 SHA-256이 같아야 한다.',
  '- 같은 hash의 최신 판정이 `ACCEPT`여야 통과한다.',
  '- 여러 파일을 묶은 최신 판정이 `REVISE`이면 개별 결함으로 단정하지 않고 `REVIEW_REQUIRED`로 둔다.',
  '- Main 글과 로컬 Viz·section import closure를 별도로 판정한다.',
  '- HTTP 500, timeout, empty result, old hash와 headerless 결과는 제외한다.',
  '',
  '## 우선 검토',
  '',
  ...(priority.length
    ? priority.map((item, index) => (
      `${index + 1}. \`${item.track}\` · ${item.role} · \`${item.slug}\` — main ${item.mainStatus}, closure ${item.closureStatus}`
    ))
    : ['현재 hash 기준 영수증 공백 없음.']),
  '',
  '## Track별 상태',
  '',
  ...trackAudits.flatMap((track) => [
    `### ${track.id}`,
    '',
    `- 기준 시점: ${track.asOf}`,
    ...track.assignments.map((item) => (
      `- ${item.role} · \`${item.slug}\` — main ${item.article.status}, closure ${item.article.closureStatus}`
    )),
    '',
  ]),
  'JSON 보고서에는 file hash, receipt queue, attempt와 불일치 closure가 포함되어 있다.',
  '',
].join('\n');

await writeFile(outputJson, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(outputMarkdown, markdown);

console.log(JSON.stringify({
  outputJson,
  outputMarkdown,
  ...report.summary,
}, null, 2));
