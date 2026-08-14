import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const jsonOutput = process.argv.includes("--json");
const runtimeFormatterSource = fs.readFileSync(
  "src/components/articles/dense-term-flow.tsx",
  "utf8",
);
const articlePageSource = fs.readFileSync("src/pages/ArticlePage.tsx", "utf8");
const runtimeFormatter =
  runtimeFormatterSource.includes('split("·")') &&
  runtimeFormatterSource.includes("paragraph.dataset.denseTermFlow") &&
  articlePageSource.includes("useDenseTermFlow");
const catalog = await loadPublicArticleCatalog();
const requestedRoutes = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));
const selectedCatalog = requestedRoutes.length
  ? catalog.filter((article) => requestedRoutes.includes(article.route))
  : catalog;
const missingRoutes = requestedRoutes.filter(
  (route) => !catalog.some((article) => article.route === route),
);

if (missingRoutes.length) {
  throw new Error(
    `존재하지 않는 public article route: ${missingRoutes.join(", ")}`,
  );
}
const sourceToRoutes = new Map();

for (const article of selectedCatalog) {
  for (const sourcePath of collectArticleSourceClosure(article.sourcePath)) {
    const routes = sourceToRoutes.get(sourcePath) ?? [];
    routes.push(article.route);
    sourceToRoutes.set(sourcePath, routes);
  }
}

function tagName(node) {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText();
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText();
  return undefined;
}

function insideExcludedContainer(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      ["CitationBlock", "ExplainedFormula", "TermBreakdown"].includes(
        tagName(parent),
      )
    ) {
      return true;
    }
  }
  return false;
}

function plainText(source) {
  return source
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\s*"\s"\s*\}/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const findings = [];
let autoBreakParagraphs = 0;

for (const [sourcePath, routes] of sourceToRoutes) {
  const source = fs.readFileSync(sourcePath, "utf8");
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  function visit(node) {
    if (
      ts.isJsxElement(node) &&
      tagName(node) === "p" &&
      !insideExcludedContainer(node)
    ) {
      const raw = node.getText(sourceFile);
      const text = plainText(raw);
      const emphasizedTerms = (raw.match(/<(?:strong|b|code)\b/g) ?? []).length;
      const interpuncts = (text.match(/·/g) ?? []).length;
      const commas = (text.match(/[,，]/g) ?? []).length;
      if (text.length >= 140 && emphasizedTerms >= 3) autoBreakParagraphs += 1;

      const dense =
        (text.length >= 220 && interpuncts >= 6) ||
        (text.length >= 260 && interpuncts >= 3 && commas >= 6);

      if (dense) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        findings.push({
          routes: [...new Set(routes)],
          file: path.relative(process.cwd(), sourcePath),
          line: line + 1,
          length: text.length,
          emphasizedTerms,
          interpuncts,
          commas,
          preview: text.slice(0, 180),
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const affectedRoutes = new Set(findings.flatMap((finding) => finding.routes));
const runtimeCoveredFindings = runtimeFormatter ? findings.length : 0;
const uncoveredFindings = findings.length - runtimeCoveredFindings;
const summary = {
  publicArticles: selectedCatalog.length,
  sourceFiles: sourceToRoutes.size,
  autoBreakParagraphs,
  affectedRoutes: affectedRoutes.size,
  findings: findings.length,
  runtimeCoveredFindings,
  uncoveredFindings,
};

if (jsonOutput) {
  console.log(
    JSON.stringify({
      summary,
      affectedRouteList: [...affectedRoutes].sort(),
      findings,
    }),
  );
} else {
  console.log(`용어 밀집 문단 요약: ${JSON.stringify(summary)}`);
}

for (const finding of jsonOutput ? [] : findings.slice(0, 100)) {
  console.error(
    `- ${finding.routes.join(", ")} · ${finding.file}:${finding.line} ` +
      `(강조 ${finding.emphasizedTerms}, · ${finding.interpuncts}, 쉼표 ${finding.commas})\n` +
      `  ${finding.preview}`,
  );
}

if (!jsonOutput && findings.length > 100) {
  console.error(`- 나머지 ${findings.length - 100}건은 출력 생략`);
}

if (strict && uncoveredFindings) process.exitCode = 1;
