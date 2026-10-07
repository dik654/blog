import fs from "node:fs";
import path from "node:path";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const requestedRoutes = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const catalog = await loadPublicArticleCatalog();
const selected = requestedRoutes.length
  ? catalog.filter((article) => requestedRoutes.includes(article.route))
  : catalog;

const unknownRoutes = requestedRoutes.filter(
  (route) => !catalog.some((article) => article.route === route),
);
if (unknownRoutes.length) {
  console.error(`등록되지 않은 article route: ${unknownRoutes.join(", ")}`);
  process.exit(1);
}

const algorithmBlockPath = path.resolve("src/components/ui/algorithm-block.tsx");
const algorithmBlockSource = fs.readFileSync(algorithmBlockPath, "utf8");
const sharedContract = [
  ["data-algorithm-viz", /data-algorithm-viz/],
  ["단계 선택 상태", /useState\(0\)/],
  ["현재 줄 표시", /aria-current=\{[^}]*\?\s*["']step["']/],
  ["이전·다음 조작", />\s*이전\s*</m, />\s*다음\s*</m],
];

const findings = [];
for (const [label, ...patterns] of sharedContract) {
  if (!patterns.every((pattern) => pattern.test(algorithmBlockSource))) {
    findings.push(`${path.relative(process.cwd(), algorithmBlockPath)}  공통 의사코드 Viz에 ${label}가 없습니다.`);
  }
}

const files = new Map();
for (const article of selected) {
  for (const sourcePath of collectArticleSourceClosure(article.sourcePath)) {
    const entry = files.get(sourcePath) ?? { routes: new Set(), source: undefined };
    entry.routes.add(article.route);
    files.set(sourcePath, entry);
  }
}

let algorithmBlocks = 0;
let customTraces = 0;
let referenceMentions = 0;

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

function addFinding(sourcePath, source, index, message, routes) {
  findings.push(
    `${path.relative(process.cwd(), sourcePath)}:${lineOf(source, index)}  ${message} (${[...routes].join(", ")})`,
  );
}

for (const [sourcePath, entry] of files) {
  const source = fs.readFileSync(sourcePath, "utf8");

  algorithmBlocks += [...source.matchAll(/<AlgorithmBlock\b/g)].length;
  const hasCustomTrace = /aria-current=\{[^}]*["']step["']/.test(source)
    && /(?:useAnimatedScenes|data-algorithm-viz)/.test(source)
    && /<(?:ol|code)\b/.test(source);
  if (hasCustomTrace) customTraces += 1;

  // Conceptual pseudocode belongs in AlgorithmBlock. CodePanel remains for
  // real source excerpts and commands, so a pseudocode-labelled CodePanel is
  // always a migration error even when the same file has another Viz.
  for (const match of source.matchAll(
    /<CodePanel\b[\s\S]{0,500}?title\s*=\s*(?:["'][^"']*(?:의사코드|pseudocode)[^"']*["']|\{["'][^"']*(?:의사코드|pseudocode)[^"']*["']\})/gi,
  )) {
    addFinding(
      sourcePath,
      source,
      match.index,
      "정적 CodePanel에 의사코드가 있습니다. 각 줄을 AlgorithmBlock 장면으로 옮기세요.",
      entry.routes,
    );
  }

  for (const match of source.matchAll(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi)) {
    if (!/(의사코드|\bpseudocode\b)/i.test(match[0])) continue;
    addFinding(
      sourcePath,
      source,
      match.index,
      "정적 <pre>에 의사코드가 있습니다. 입력·현재 줄·상태 변화·출력을 보여 주는 Viz로 옮기세요.",
      entry.routes,
    );
  }

  if (/(의사코드|\bpseudocode\b)/i.test(source)
    && !/<AlgorithmBlock\b/.test(source)
    && !hasCustomTrace) {
    referenceMentions += 1;
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  console.error(`\n의사코드 과정 Viz 위반 ${findings.length}건`);
  if (strict) process.exitCode = 1;
} else {
  console.log(
    `의사코드 과정 Viz 검사 통과: 공개 ${selected.length}개 글, `
      + `AlgorithmBlock ${algorithmBlocks}개, 전용 장면 Viz ${customTraces}개`,
  );
  if (referenceMentions) {
    console.log(`절차 블록이 아닌 원문·구현 구분 문장: ${referenceMentions}개 source file`);
  }
}
