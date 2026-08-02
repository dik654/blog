import { build } from 'esbuild';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const outArgIndex = process.argv.findIndex((arg) => arg === '--out' || arg.startsWith('--out='));
const outArg = outArgIndex >= 0 ? process.argv[outArgIndex] : null;
const outputValue = outArg?.startsWith('--out=')
  ? outArg.slice('--out='.length)
  : outArg === '--out'
    ? process.argv[outArgIndex + 1]
    : null;
const outputPath = outputValue ? resolve(root, outputValue) : null;
const tempDir = resolve(root, '.codex-tmp/ai-mastery-audit-runtime');
const tempEntry = resolve(tempDir, 'entry.ts');
const tempBundle = resolve(tempDir, 'bundle.mjs');
const metricHelperExclusions = new Set([
  resolve(root, 'src/pages/articles/ai/nlp-shared.tsx'),
  resolve(root, 'src/pages/articles/ai/practical-training/FormulaPair.tsx'),
]);

const runtimeSource = String.raw`
import ai from '../../src/content/ai/index.ts';
import { topDownResearchTracks } from '../../src/content/ai/topdownResearchTracks.ts';
import { learningPaths } from '../../src/content/learning-paths.ts';

const normalize = (link, role) => link?.articleSlug
  ? { role, articleSlug: link.articleSlug, category: link.category ?? 'ai' }
  : null;

console.log(JSON.stringify({
	  articles: ai.articles.map((article) => ({
	    slug: article.slug,
	    title: article.title,
	    subcategory: article.subcategory,
	    curriculumRole: article.curriculumRole
	      ?? (/^(paper|research|reference)-/.test(article.slug) ? 'source' : 'core'),
    learningPath: article.learningPath ?? null,
    learningPaths: article.learningPaths ?? [],
  })),
  learningPaths: learningPaths
    .filter((path) => path.steps.some((step) => step.category === 'ai'))
    .map((path) => ({
      id: path.id,
      title: path.title,
      steps: path.steps.filter((step) => step.category === 'ai').map((step) => step.slug),
    })),
  tracks: topDownResearchTracks.map((track) => ({
    id: track.id,
    title: track.title,
    goal: track.goal,
    current: normalize(track.current, 'current'),
    canonical: normalize(track.canonical, 'canonical'),
    concepts: track.concepts.map((item) => normalize(item, 'concept')),
    foundations: track.foundations.map((item) => normalize(item, 'foundation')),
    implementation: track.implementation.map((item) => normalize(item, 'implementation')),
  })),
}));
`;

const writeRuntimeBundle = async () => {
  await mkdir(tempDir, { recursive: true });
  await writeFile(tempEntry, runtimeSource);
  await build({
    absWorkingDir: root,
    entryPoints: [tempEntry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: tempBundle,
    plugins: [{
      name: 'skip-ui-components',
      setup(buildApi) {
        buildApi.onResolve({ filter: /\/pages\/articles\// }, (args) => ({
          path: args.path,
          external: true,
        }));
        buildApi.onResolve({ filter: /\/components\/thumbnails\// }, (args) => ({
          path: args.path,
          external: true,
        }));
      },
    }],
    logLevel: 'silent',
  });
  const result = spawnSync(process.execPath, [tempBundle], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || 'AI curriculum runtime probe failed.');
  }
  return JSON.parse(result.stdout);
};

const listFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? [] : [path];
  });
};

const getStringProperty = (node, name) => {
  const property = node.properties.find((candidate) =>
    ts.isPropertyAssignment(candidate)
    && ((ts.isIdentifier(candidate.name) && candidate.name.text === name)
      || (ts.isStringLiteral(candidate.name) && candidate.name.text === name)));
  if (!property || !ts.isStringLiteralLike(property.initializer)) return null;
  return property.initializer.text;
};

const findDynamicImport = (node) => {
  let modulePath = null;
  const visit = (candidate) => {
    if (
      ts.isCallExpression(candidate)
      && candidate.expression.kind === ts.SyntaxKind.ImportKeyword
      && candidate.arguments.length === 1
      && ts.isStringLiteralLike(candidate.arguments[0])
    ) {
      modulePath = candidate.arguments[0].text;
      return;
    }
    ts.forEachChild(candidate, visit);
  };
  visit(node);
  return modulePath;
};

const articleComponentMap = async () => {
  const contentDirectory = resolve(root, 'src/content/ai');
  const registryFiles = (await listFiles(contentDirectory))
    .filter((path) => /^articles.*\.ts$/.test(path.split('/').at(-1)));
  const components = new Map();

  for (const path of registryFiles) {
    const source = await readFile(path, 'utf8');
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const visit = (node) => {
      if (ts.isObjectLiteralExpression(node)) {
        const slug = getStringProperty(node, 'slug');
        const component = node.properties.find((property) =>
          ts.isPropertyAssignment(property)
          && ts.isIdentifier(property.name)
          && property.name.text === 'component');
        const modulePath = component ? findDynamicImport(component.initializer) : null;
        if (slug && modulePath) components.set(slug, modulePath);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }

  return components;
};

const resolveModule = async (fromPath, modulePath) => {
  const base = modulePath.startsWith('@/')
    ? resolve(root, 'src', modulePath.slice(2))
    : resolve(dirname(fromPath), modulePath);
  const candidates = extname(base)
    ? [base]
    : [
        `${base}.tsx`,
        `${base}.ts`,
        `${base}.jsx`,
        `${base}.js`,
        resolve(base, 'index.tsx'),
        resolve(base, 'index.ts'),
      ];
  for (const candidate of candidates) {
    try {
      await readFile(candidate);
      return candidate;
    } catch {
      // Continue through the supported TypeScript/JavaScript extensions.
    }
  }
  return null;
};

const collectArticleSources = async (entryModule) => {
  const virtualImporter = resolve(root, 'src/content/ai/virtual-registry.ts');
  const entryPath = await resolveModule(virtualImporter, entryModule);
  if (!entryPath) return { files: [], source: '' };

  const articleRoot = resolve(root, 'src/pages/articles/ai');
  const queue = [entryPath];
  const visited = new Set();
  const chunks = [];

  while (queue.length > 0) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);
    const source = await readFile(path, 'utf8');
    chunks.push(`\n/* ${relative(root, path)} */\n${source}`);
    const ast = ts.createSourceFile(
      path,
      source,
      ts.ScriptTarget.Latest,
      true,
      path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const imports = [];
    const visit = (node) => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
      if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
    for (const modulePath of imports) {
      if (!modulePath.startsWith('.')) continue;
      const resolved = await resolveModule(path, modulePath);
      if (
        resolved
        && resolved.startsWith(articleRoot)
        && !metricHelperExclusions.has(resolved)
      ) queue.push(resolved);
    }
  }

  return { files: [...visited], source: chunks.join('\n') };
};

const count = (source, expression) => [...source.matchAll(expression)].length;
const koreanChars = (source) => count(source, /[가-힣]/gu);

const articleMetrics = ({ article, role, component, files, source }) => {
  const questionCount = count(source, /<QuestionLead\b/g);
  const capabilityCount = count(source, /<CapabilityCheck\b/g);
  const sourceCount = count(source, /<(?:SourceNotes|CitationBlock)\b/g);
  const formulaCount = count(source, /<(?:M|BlockMath|Math|MathFormula|SourceFormula)\b/g);
  const formulaNoteCount = count(source, /<FormulaNote\b/g);
  const explicitLearningLinkCount = count(source, /<(?:InternalLink|LearningHandoff)\b/g);
  const routedArticleLinkCount = count(source, /<Link\b[^>]*\bto=\{?[^>]*articlePath\s*\(/g);
  const articlePathReferenceCount = count(source, /articlePath\s*\(/g);
  const internalLinkCount = explicitLearningLinkCount
    + Math.max(routedArticleLinkCount, articlePathReferenceCount);
  const vizNameCount = files.filter((path) =>
    /(?:\/viz\/|(?:Diagram|Scene|Explorer|Lab|Simulator|Flow|Timeline|Map)\.(?:tsx|ts)$)/.test(path)).length;
  const localVizCount = count(
    source,
    /(?:<(?:StepViz|AnimatedArticleViz)\b|function\s+\w*(?:Diagram|Scene|Explorer|Lab|Simulator|Flow|Timeline|Map)\s*\()/g,
  );
  const sharedControlledVizCount = count(source, /<(?:StepViz|AnimatedArticleViz)\b/g);
  const svgCount = count(source, /<svg\b/g);
  const interactionCount = count(
    source,
    /(?:useState\s*\(|onClick=|onChange=|type=["']range["']|<button\b|<Tabs\b)/g,
  );
  const proseDepth = koreanChars(source);
  const hasQuestion = questionCount > 0;
  const hasCapability = capabilityCount > 0;
  const hasSources = sourceCount > 0;
  const hasFormula = formulaCount > 0;
  const hasFormulaNotes = !hasFormula || formulaNoteCount > 0;
  const hasViz = vizNameCount > 0 || localVizCount > 0 || svgCount > 0;
  const hasCausalViz = hasViz && (interactionCount > 0 || sharedControlledVizCount > 0);
  const hasInternalLinks = internalLinkCount > 0;
  const hasDepth = proseDepth >= 1800;

  const weights = {
    current: { question: 12, capability: 14, sources: 22, formula: 8, viz: 18, links: 12, depth: 14 },
    canonical: { question: 10, capability: 16, sources: 22, formula: 14, viz: 16, links: 10, depth: 12 },
    concept: { question: 12, capability: 18, sources: 12, formula: 12, viz: 22, links: 12, depth: 12 },
    foundation: { question: 10, capability: 18, sources: 10, formula: 22, viz: 18, links: 10, depth: 12 },
    implementation: { question: 10, capability: 20, sources: 16, formula: 8, viz: 18, links: 16, depth: 12 },
  }[role];
  const score = [
    hasQuestion ? weights.question : 0,
    hasCapability ? weights.capability : 0,
    hasSources ? weights.sources : 0,
    hasFormulaNotes ? weights.formula : 0,
    hasCausalViz ? weights.viz : 0,
    hasInternalLinks ? weights.links : 0,
    hasDepth ? weights.depth : 0,
  ].reduce((sum, value) => sum + value, 0);

  return {
    slug: article.articleSlug,
    title: article.title,
    role,
    component: component ?? null,
    sourceFiles: files.map((path) => relative(root, path)),
    proseDepth,
    score,
    checks: {
      question: hasQuestion,
      capability: hasCapability,
      sources: hasSources,
      formulaNotes: hasFormulaNotes,
      viz: hasViz,
      causalViz: hasCausalViz,
      internalLinks: hasInternalLinks,
      depth: hasDepth,
    },
    counts: {
      question: questionCount,
      capability: capabilityCount,
      sourceBlocks: sourceCount,
      formulas: formulaCount,
      formulaNotes: formulaNoteCount,
      vizFiles: vizNameCount,
	      localViz: localVizCount,
	      sharedControlledViz: sharedControlledVizCount,
      svg: svgCount,
      interactions: interactionCount,
      internalLinks: internalLinkCount,
    },
  };
};

const main = async () => {
  const curriculum = await writeRuntimeBundle();
  const components = await articleComponentMap();
  const articleBySlug = new Map(curriculum.articles.map((article) => [article.slug, article]));
  const sourceCache = new Map();
  const tracks = [];
  const rolesByArticle = new Map();
  const pathsByArticle = new Map();

  for (const path of curriculum.learningPaths) {
    path.steps.forEach((slug, index) => {
      const owners = pathsByArticle.get(slug) ?? [];
      owners.push({ id: path.id, title: path.title, index, count: path.steps.length });
      pathsByArticle.set(slug, owners);
    });
  }

  for (const track of curriculum.tracks) {
    const links = [
      track.current,
      track.canonical,
      ...track.concepts,
      ...track.foundations,
      ...track.implementation,
    ].filter((link) => link?.category === 'ai');
    const articles = [];
    for (const link of links) {
      const assignedRoles = rolesByArticle.get(link.articleSlug) ?? new Set();
      assignedRoles.add(link.role);
      rolesByArticle.set(link.articleSlug, assignedRoles);
      const article = articleBySlug.get(link.articleSlug) ?? {
        slug: link.articleSlug,
        title: link.articleSlug,
      };
      const component = components.get(link.articleSlug);
      if (!sourceCache.has(component)) {
        sourceCache.set(component, component
          ? await collectArticleSources(component)
          : { files: [], source: '' });
      }
      articles.push(articleMetrics({
        article: { ...article, articleSlug: link.articleSlug },
        role: link.role,
        component,
        ...sourceCache.get(component),
      }));
    }
    const score = articles.length
      ? Math.round(articles.reduce((sum, article) => sum + article.score, 0) / articles.length)
      : 0;
    tracks.push({
      id: track.id,
      title: track.title,
      goal: track.goal,
      score,
      articleCount: articles.length,
      weakArticles: articles
        .filter((article) => article.score < 75)
        .sort((a, b) => a.score - b.score)
        .map((article) => ({
          slug: article.slug,
          role: article.role,
          score: article.score,
          missing: Object.entries(article.checks)
            .filter(([, passed]) => !passed)
            .map(([check]) => check),
        })),
      articles,
    });
  }

  const allArticles = [];
  for (const article of curriculum.articles) {
    const component = components.get(article.slug);
    if (!sourceCache.has(component)) {
      sourceCache.set(component, component
        ? await collectArticleSources(component)
        : { files: [], source: '' });
    }
    const evaluatedRoles = rolesByArticle.has(article.slug)
      ? [...rolesByArticle.get(article.slug)]
      : [article.curriculumRole === 'source' ? 'canonical' : 'concept'];
    const roleMetrics = evaluatedRoles.map((role) => articleMetrics({
      article: { ...article, articleSlug: article.slug },
      role,
      component,
      ...sourceCache.get(component),
    }));
    const weakestRoleMetric = [...roleMetrics].sort((left, right) => left.score - right.score)[0];
    allArticles.push({
      ...weakestRoleMetric,
      curriculumRole: article.curriculumRole,
      declaredLearningPath: article.learningPath,
      pathOwners: pathsByArticle.get(article.slug) ?? [],
      evaluatedRoles,
      roleScores: Object.fromEntries(roleMetrics.map((metric) => [metric.role, metric.score])),
    });
  }
  const weakAllArticles = allArticles
    .filter((article) => article.score < 75)
    .sort((left, right) => left.score - right.score || left.slug.localeCompare(right.slug))
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      curriculumRole: article.curriculumRole,
      evaluatedRoles: article.evaluatedRoles,
      score: article.score,
      missing: Object.entries(article.checks)
        .filter(([, passed]) => !passed)
        .map(([check]) => check),
      pathOwners: article.pathOwners.map((owner) => owner.id),
    }));

  const result = {
    generatedAt: new Date().toISOString(),
    method: {
      purpose: 'Select articles for human/LLM mastery review; this heuristic is not release evidence.',
      depthThreshold: 'At least 1,800 Korean characters across the article-local source closure.',
	      causalViz: 'Article-local SVG/Viz plus a local interaction or shared StepViz controller. A reviewer must still verify explanatory causality.',
      formulaNotes: 'Any detected displayed formula requires at least one FormulaNote in the source closure.',
    },
    summary: {
      trackCount: tracks.length,
      articleReferences: tracks.reduce((sum, track) => sum + track.articleCount, 0),
      weakArticleReferences: tracks.reduce((sum, track) => sum + track.weakArticles.length, 0),
      allArticleCount: allArticles.length,
      weakAllArticleCount: weakAllArticles.length,
      allArticleScoreBuckets: {
        under50: allArticles.filter((article) => article.score < 50).length,
        from50To74: allArticles.filter((article) => article.score >= 50 && article.score < 75).length,
        from75To89: allArticles.filter((article) => article.score >= 75 && article.score < 90).length,
        atLeast90: allArticles.filter((article) => article.score >= 90).length,
      },
      weakestTracks: [...tracks]
        .sort((a, b) => a.score - b.score)
        .slice(0, 8)
        .map(({ id, title, score, articleCount, weakArticles }) => ({
          id,
          title,
          score,
          articleCount,
          weakArticleCount: weakArticles.length,
        })),
    },
    tracks,
    weakAllArticles,
    allArticles,
  };

  if (outputPath) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
    console.log(outputPath);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
  await rm(tempDir, { recursive: true, force: true });
};

await main();
