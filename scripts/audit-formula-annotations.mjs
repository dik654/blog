import fs from "node:fs";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const catalog = await loadPublicArticleCatalog();
const files = [
  ...new Set(
    catalog.flatMap((article) => collectArticleSourceClosure(article.sourcePath)),
  ),
];

let explained = 0;
let domainAnnotated = 0;
let explicitOperations = 0;
const rawDisplay = [];
const unsafeKatexSymbols = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  explained += (source.match(/<ExplainedFormula\b/g) ?? []).length;
  domainAnnotated += (source.match(/\bannotatedFormula=/g) ?? []).length;
  explicitOperations += (source.match(/\boperations=/g) ?? []).length;
  if (/<(?:Math\s+display|BlockMath)\b|\$\$/.test(source)) rawDisplay.push(file);
  if (/symbol:\s*"\\(?!\\)/.test(source)) unsafeKatexSymbols.push(file);
}

const component = fs.readFileSync(
  "src/components/ui/explained-formula.tsx",
  "utf8",
);
const runtimeContract = {
  underbrace: component.includes(String.raw`\underbrace`),
  operationRegion: component.includes("data-formula-operations"),
  operationItem: component.includes("data-formula-operation"),
  fallback: component.includes("inferOperations(formula)"),
};

const failures = [];
if (explained === 0) failures.push("ExplainedFormula가 없습니다.");
if (domainAnnotated === 0) {
  failures.push("도메인 의미를 식 안에 단 domain-specific annotatedFormula가 없습니다.");
}
if (explicitOperations === 0) {
  failures.push("도메인 연산 의도를 설명하는 explicit operations가 없습니다.");
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
    rawDisplayFiles: rawDisplay.length,
    unsafeKatexSymbolFiles: unsafeKatexSymbols.length,
    runtimeContract,
  })}`,
);

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  if (strict) process.exitCode = 1;
} else {
  console.log("수식 연산 주석 검사 통과");
}
