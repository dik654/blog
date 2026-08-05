import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'src/content');
const articleSourceRoot = path.join(root, 'src/pages/articles');
const reportDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
const requestedCategory = process.env.LEARNING_FLOW_CATEGORY?.trim();
const outputJson = process.env.LEARNING_FLOW_REPORT
  ?? path.join(root, `knowledge/authoring/runs/${reportDate}-learning-flow-audit.json`);
const outputMarkdown = outputJson.replace(/\.json$/, '-report.md');

async function walk(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target, extension);
    return entry.name.endsWith(extension) ? [target] : [];
  }));
  return nested.flat();
}

function count(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

function auditFormulaGroups(source) {
  const tokens = [
    ...source.matchAll(/<(?:M|MathFormula)\b[^>]*\bdisplay\b/g),
    ...source.matchAll(/<FormulaNote\b/g),
    ...source.matchAll(/<h[2-6]\b/g),
  ]
    .map((match) => ({
      index: match.index ?? 0,
      kind: match[0].startsWith('<FormulaNote')
        ? 'note'
        : match[0].startsWith('<h')
          ? 'heading'
          : 'formula',
    }))
    .sort((a, b) => a.index - b.index);

  const groups = [];
  let pending = [];
  for (const token of tokens) {
    if (token.kind === 'formula') {
      pending.push(token);
      continue;
    }

    if (token.kind === 'note') {
      if (pending.length > 0) {
        const distance = token.index - pending[pending.length - 1].index;
        groups.push({ formulas: pending.length, covered: distance <= 2_400, distance });
        pending = [];
      }
      continue;
    }

    if (pending.length > 0) {
      groups.push({ formulas: pending.length, covered: false, distance: null });
      pending = [];
    }
  }

  if (pending.length > 0) {
    groups.push({ formulas: pending.length, covered: false, distance: null });
  }

  return {
    groups,
    uncovered: groups.filter((group) => !group.covered),
  };
}

function resolveArticleSource(importPath) {
  const relative = importPath.replace(/^@\//, 'src/');
  return [
    path.join(root, `${relative}.tsx`),
    path.join(root, relative, 'index.tsx'),
  ];
}

function resolveLocalArticleImport(sourceFile, importPath) {
  if (!importPath.startsWith('.')) return undefined;
  const base = path.resolve(path.dirname(sourceFile), importPath);
  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
  ];
  return candidates.find((candidate) => candidate.startsWith(articleSourceRoot));
}

async function readArticleSourceClosure(entryFile) {
  const files = [];
  const sources = [];
  const visited = new Set();

  async function visit(file) {
    if (!file || visited.has(file)) return;
    try {
      const source = await readFile(file, 'utf8');
      visited.add(file);
      files.push(file);
      sources.push(source);

      const imports = [
        ...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g),
        ...source.matchAll(/import\(\s*['"](\.[^'"]+)['"]\s*\)/g),
      ];
      for (const match of imports) {
        const resolved = resolveLocalArticleImport(file, match[1]);
        if (resolved) await visit(resolved);
      }
    } catch {
      // Missing entry sources are reported by the registration audit.
    }
  }

  await visit(entryFile);
  return { files, source: sources.join('\n') };
}

function defaultRenderSource(source) {
  const inlineDefault = source.match(/export\s+default\s+function(?:\s+[A-Za-z_$][\w$]*)?\s*\(/);
  if (inlineDefault?.index !== undefined) return source.slice(inlineDefault.index);

  const namedDefault = source.match(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;/);
  if (!namedDefault) return source;

  const name = namedDefault[1];
  const declarations = [
    source.lastIndexOf(`function ${name}`),
    source.lastIndexOf(`const ${name}`),
    source.lastIndexOf(`class ${name}`),
  ].filter((index) => index >= 0);
  return declarations.length > 0 ? source.slice(Math.min(...declarations)) : source;
}

const contentFiles = await walk(contentRoot, '.ts');
const registered = [];

for (const file of contentFiles) {
  const contentCategory = path.relative(contentRoot, file).split(path.sep)[0];
  if (requestedCategory && contentCategory !== requestedCategory) continue;

  const source = await readFile(file, 'utf8');
  const articlePattern = /\{\s*slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],[\s\S]*?\bsubcategory:\s*['"]([^'"]+)['"],[\s\S]*?component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/g;
  for (const match of source.matchAll(articlePattern)) {
    const block = match[0];
    registered.push({
      slug: match[1],
      title: match[2],
      subcategory: match[3],
      importPath: match[4],
      contentCategory,
      metadataFile: path.relative(root, file),
      hasSummary: /\bsummary\s*:/.test(block),
      hasLevel: /\blevel\s*:/.test(block),
      hasEstimatedMinutes: /\bestimatedMinutes\s*:/.test(block),
      hasPrerequisites: /\bprerequisites\s*:/.test(block),
      learningPath: block.match(/\blearningPath\s*:\s*['"]([^'"]+)['"]/)?.[1],
    });
  }
}

const articles = [];
for (const entry of registered) {
  let sourceFile;
  let source;
  for (const candidate of resolveArticleSource(entry.importPath)) {
    try {
      source = await readFile(candidate, 'utf8');
      sourceFile = candidate;
      break;
    } catch {
      // Try the next supported article entry shape.
    }
  }

  if (!sourceFile || !source) {
    articles.push({ ...entry, missingSource: true, score: 100, issues: ['등록된 component source를 찾을 수 없음'] });
    continue;
  }

  const sourceClosure = await readArticleSourceClosure(sourceFile);
  source = sourceClosure.source || source;
  const renderSource = defaultRenderSource(source);
  const formulaCount = count(source, /<(?:M|MathFormula)\b[^>]*\bdisplay\b/g);
  const formulaNoteCount = count(source, /<FormulaNote\b/g);
  const formulaAudit = auditFormulaGroups(source);
  const tablePattern = /<(?:table|[A-Z][A-Za-z0-9]*(?:Table|Matrix))\b/g;
  const tableCount = count(renderSource, tablePattern);
  const explanationPositions = [...renderSource.matchAll(/<(?:p|QuestionLead|ConceptPrimer|NarrativeBridge)\b/g)]
    .map((match) => match.index ?? Infinity);
  const firstTable = renderSource.search(tablePattern);
  const tableBeforeExplanation = firstTable >= 0 && !explanationPositions.some((position) => position < firstTable);
  const hasLearningLead = /<(?:QuestionLead|ConceptPrimer|NarrativeBridge|CapabilityCheck)\b/.test(source);
  const hasOutgoingConnection = /articlePath\(|<(?:Link|ArticleLink|InternalLink|LearningHandoff)\b/.test(source);
  const hasSources = /<(?:SourceNotes|CitationBlock)\b|https?:\/\/|FoundationalPaperStudy/.test(source);
  const hasVisual = /<(?:[A-Z][A-Za-z0-9]*(?:Viz|Scene|Explorer|Lab|Diagram|Figure|Router|Ledger)|ArchitectureFigureStrip|EvidenceInspector|PaperReconstruction|img|svg)\b/.test(source);
  const isSourceArticle = entry.slug.startsWith('paper-') || entry.slug.startsWith('research-') || entry.slug.startsWith('reference-');
  const blockers = [];
  const review = [];
  const enrichment = [];
  let score = 0;

  if (!entry.hasSummary) { enrichment.push('요약 metadata 보강'); score += 2; }
  if (!entry.hasPrerequisites) { enrichment.push('선행지식 metadata 보강'); score += 3; }
  if (!entry.hasLevel || !entry.hasEstimatedMinutes) { enrichment.push('난이도 또는 예상시간 metadata 보강'); score += 1; }
  if (!hasLearningLead) { enrichment.push('본문 내부의 질문·개념·도달점 보강'); score += 2; }
  if (!hasOutgoingConnection) { enrichment.push('본문 내부의 세부 선행·다음 글 링크 보강'); score += 2; }
  if (tableBeforeExplanation) { review.push('소스상 표가 설명보다 먼저인지 렌더 확인'); score += 5; }
  if (formulaAudit.uncovered.length > 0) {
    blockers.push(`한글 설명이 바로 따르지 않는 수식 묶음 ${formulaAudit.uncovered.length}개`);
    score += Math.min(8, formulaAudit.uncovered.length * 2);
  }
  if (isSourceArticle && !hasSources) { blockers.push('논문·리서치 글의 원출처 블록 없음'); score += 5; }
  if (!hasVisual && source.length > 8_000) { enrichment.push('긴 글의 시각적 설명 장치 보강'); score += 2; }

  const issues = [...blockers, ...review, ...enrichment];

  articles.push({
    ...entry,
    sourceFile: path.relative(root, sourceFile),
    sourceFiles: sourceClosure.files.map((file) => path.relative(root, file)),
    sourceBytes: source.length,
    formulaCount,
    formulaNoteCount,
    formulaGroupCount: formulaAudit.groups.length,
    uncoveredFormulaGroups: formulaAudit.uncovered.length,
    tableCount,
    hasLearningLead,
    hasOutgoingConnection,
    hasSources,
    hasVisual,
    tableBeforeExplanation,
    score,
    blockers,
    review,
    enrichment,
    issues,
  });
}

const sorted = articles.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
const report = {
  generatedAt: new Date().toISOString(),
  category: requestedCategory ?? 'all',
  contract: [
    '선행 개념과 현재 목표를 먼저 밝힌다.',
    '새 구조가 해결하는 이전 병목을 설명한다.',
    'token 또는 데이터의 실행 순서를 따라간다.',
    '얻는 이점과 치르는 비용을 함께 쓴다.',
    '표시 수식 바로 뒤에 한글 FormulaNote를 둔다.',
    '근거와 다음 학습 경로를 연결한다.',
  ],
  summary: {
    registered: sorted.length,
    releaseBlockers: sorted.filter((article) => article.missingSource || article.blockers?.length > 0).length,
    reviewNeeded: sorted.filter((article) => article.review?.length > 0).length,
    enrichmentBacklog: sorted.filter((article) => article.enrichment?.length > 0).length,
    formulaGaps: sorted.filter((article) => article.uncoveredFormulaGroups > 0).length,
    tableFirst: sorted.filter((article) => article.tableBeforeExplanation).length,
    missingPrerequisites: sorted.filter((article) => !article.hasPrerequisites).length,
    localConnectionBacklog: sorted.filter((article) => !article.hasOutgoingConnection).length,
    globalContinuityCoverage: sorted.filter((article) => !article.missingSource).length,
    learningPathMetadataAssignments: sorted.filter((article) => article.learningPath).length,
  },
  priority: sorted.slice(0, 80),
  articles: sorted,
};

await mkdir(path.dirname(outputJson), { recursive: true });
await writeFile(outputJson, `${JSON.stringify(report, null, 2)}\n`);

const markdown = [
  `# ${requestedCategory ? `${requestedCategory.toUpperCase()} 아티클` : '전체 아티클'} 학습 흐름 감사`,
  '',
  `- 범위: ${report.category}`,
  `- 등록 글: ${report.summary.registered}`,
  `- 배포 차단 후보: ${report.summary.releaseBlockers}`,
  `- 렌더 확인 필요: ${report.summary.reviewNeeded}`,
  `- 점진적 보강 backlog: ${report.summary.enrichmentBacklog}`,
  `- 수식 설명 간극: ${report.summary.formulaGaps}`,
  `- 표가 설명보다 먼저인 글: ${report.summary.tableFirst}`,
  `- 선행지식 metadata 없음: ${report.summary.missingPrerequisites}`,
  `- 세부 본문 링크 보강: ${report.summary.localConnectionBacklog}`,
  `- 공통 전역 학습 연결 적용: ${report.summary.globalContinuityCoverage}`,
  `- learningPath metadata 할당: ${report.summary.learningPathMetadataAssignments}`,
  '',
  '## 공통 학습 계약',
  '',
  ...report.contract.map((item) => `- ${item}`),
  '',
  '## 우선 검토 대상',
  '',
  ...report.priority.slice(0, 40).map((article, index) => (
    `${index + 1}. \`${article.slug}\` (${article.score}) - ${article.issues.join('; ')}`
  )),
  '',
  'JSON 보고서에는 전체 글의 개별 판정과 source 경로가 포함되어 있다.',
  '',
].join('\n');
await writeFile(outputMarkdown, markdown);

console.log(JSON.stringify({ outputJson, outputMarkdown, ...report.summary }, null, 2));
