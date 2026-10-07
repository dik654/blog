import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const requestedRoutes = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));
const catalog = await loadPublicArticleCatalog();
const selected = requestedRoutes.length
  ? catalog.filter((article) => requestedRoutes.includes(article.route))
  : catalog;
const missingRoutes = requestedRoutes.filter(
  (route) => !catalog.some((article) => article.route === route),
);

if (missingRoutes.length) {
  throw new Error(`존재하지 않는 public article route: ${missingRoutes.join(", ")}`);
}

const sourceToRoutes = new Map();
for (const article of selected) {
  for (const sourcePath of collectArticleSourceClosure(article.sourcePath)) {
    const routes = sourceToRoutes.get(sourcePath) ?? [];
    routes.push(article.route);
    sourceToRoutes.set(sourcePath, routes);
  }
}

function tagName(node) {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText();
  return undefined;
}

function plainText(source) {
  return source
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\s*"\s"\s*\}/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// A comma between two meaning→name assignments is unsafe on a narrow screen:
// after wrapping, the second meaning can look like the first term's gloss.
const riskyPair =
  /[가-힣][^.!?]{0,70}(?:을|를|은|는)\s+[A-Za-z][A-Za-z0-9+/_-]*(?:\s+[A-Za-z][A-Za-z0-9+/_-]*)?\s*,\s*[^.!?]{0,90}(?:을|를|은|는)\s+[A-Za-z][A-Za-z0-9+/_-]*(?:\s+[A-Za-z][A-Za-z0-9+/_-]*)?[^.!?]{0,60}(?:라고\s*(?:합니다|부릅니다)|이라\s*부릅니다)/;

const findings = [];
for (const [sourcePath, routes] of sourceToRoutes) {
  const source = fs.readFileSync(sourcePath, "utf8");
  const ast = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  function visit(node) {
    if (ts.isJsxElement(node) && tagName(node) === "p") {
      const text = plainText(node.getText(ast));
      const match = text.match(riskyPair);
      if (match) {
        const { line } = ast.getLineAndCharacterOfPosition(node.getStart(ast));
        findings.push({
          routes: [...new Set(routes)],
          file: path.relative(process.cwd(), sourcePath),
          line: line + 1,
          text: match[0],
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(ast);
}

console.log(
  `모바일 용어 대응 검사: ${selected.length}개 글, 위험한 쉼표식 복수 대응 ${findings.length}건`,
);
for (const finding of findings) {
  console.error(
    `- ${finding.routes.join(", ")} · ${finding.file}:${finding.line}\n  ${finding.text}`,
  );
}

if (strict && findings.length) process.exitCode = 1;
