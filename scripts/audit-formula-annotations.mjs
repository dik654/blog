import fs from "node:fs";
import ts from "typescript";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const requireExplicit = process.argv.includes("--require-explicit");
const catalog = await loadPublicArticleCatalog();
const files = [
  ...new Set(
    catalog.flatMap((article) => collectArticleSourceClosure(article.sourcePath)),
  ),
];

let explained = 0;
let domainAnnotated = 0;
let explicitOperations = 0;
const missingExplicitAnnotations = [];
const rawDisplay = [];
const unsafeKatexSymbols = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  explained += (source.match(/<ExplainedFormula\b/g) ?? []).length;
  domainAnnotated += (source.match(/\bannotatedFormula=/g) ?? []).length;
  explicitOperations += (source.match(/\boperations=/g) ?? []).length;
  if (/<(?:Math\s+display|BlockMath)\b|\$\$/.test(source)) rawDisplay.push(file);
  if (/symbol:\s*"\\(?!\\)/.test(source)) unsafeKatexSymbols.push(file);

  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const visit = (node) => {
    if (
      ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(ast) === "ExplainedFormula"
    ) {
      const attributes = new Set(
        node.attributes.properties
          .filter(ts.isJsxAttribute)
          .map((attribute) => attribute.name.getText(ast)),
      );
      if (!attributes.has("annotatedFormula") || !attributes.has("operations")) {
        const { line } = ast.getLineAndCharacterOfPosition(node.getStart(ast));
        missingExplicitAnnotations.push({
          file,
          line: line + 1,
          annotatedFormula: attributes.has("annotatedFormula"),
          operations: attributes.has("operations"),
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
}

const component = fs.readFileSync(
  "src/components/ui/explained-formula.tsx",
  "utf8",
);
const mathComponent = fs.readFileSync("src/components/ui/math.tsx", "utf8");
const runtimeContract = {
  underbrace: component.includes(String.raw`\underbrace`),
  operationRegion: component.includes("data-formula-operations"),
  operationItem: component.includes("data-formula-operation"),
  fallback: component.includes("inferOperations(formula)"),
  annotationMode: component.includes("data-formula-annotation-mode"),
  annotationVerticalPadding: mathComponent.includes(
    "overflow-y-hidden px-1 py-4 text-center",
  ),
};

const failures = [];
if (explained === 0) failures.push("ExplainedFormula가 없습니다.");
if (domainAnnotated === 0) {
  failures.push("도메인 의미를 식 안에 단 domain-specific annotatedFormula가 없습니다.");
}
if (explicitOperations === 0) {
  failures.push("도메인 연산 의도를 설명하는 explicit operations가 없습니다.");
}
if (requireExplicit && missingExplicitAnnotations.length) {
  failures.push(
    `명시적 annotatedFormula·operations가 모두 없는 식 ${missingExplicitAnnotations.length}개`,
  );
}
if (rawDisplay.length) {
  failures.push(`ExplainedFormula 밖 display 수식: ${rawDisplay.join(", ")}`);
}
if (unsafeKatexSymbols.length) {
  failures.push(
    `String.raw 없이 JS escape에 노출된 KaTeX 기호: ${unsafeKatexSymbols.join(", ")}`,
  );
}
for (const [key, passed] of Object.entries(runtimeContract)) {
  if (!passed) failures.push(`공통 연산 주석 계약 누락: ${key}`);
}

console.log(
  `수식 연산 주석 요약: ${JSON.stringify({
    publicArticles: catalog.length,
    sourceFiles: files.length,
    explainedFormulas: explained,
    domainAnnotated,
    explicitOperations,
    missingExplicitAnnotations: missingExplicitAnnotations.length,
    rawDisplayFiles: rawDisplay.length,
    unsafeKatexSymbolFiles: unsafeKatexSymbols.length,
    runtimeContract,
  })}`,
);

if (missingExplicitAnnotations.length) {
  const byFile = new Map();
  for (const item of missingExplicitAnnotations) {
    const current = byFile.get(item.file) ?? [];
    current.push(item.line);
    byFile.set(item.file, current);
  }
  console.log(
    `명시적 수식 주석 전환 대기: ${byFile.size} files / ${missingExplicitAnnotations.length} formulas`,
  );
  for (const [file, lines] of [...byFile.entries()].slice(0, 30)) {
    console.log(`- ${file}:${lines.join(",")}`);
  }
  if (byFile.size > 30) console.log(`- … ${byFile.size - 30}개 파일 추가`);
}

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  if (strict) process.exitCode = 1;
} else {
  console.log("수식 연산 주석 검사 통과");
}
