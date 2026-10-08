import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const refreshBaseline = process.argv.includes("--refresh-baseline");
const routeFilter = process.argv
  .find((argument) => argument.startsWith("--route="))
  ?.slice("--route=".length);
const baselinePath = path.resolve("docs/calculation-explanation-baseline.json");

const highRiskPatterns = [
  /\d[\d,.]*\s*[×*]\s*\d[\d,.]*\s*[×*]\s*\d/,
  /\d[\d,.]*\s*[÷/]\s*\d[\d,.]*[^.]{0,50}\bFLOP\/(?:B|byte)\b/i,
  /(?:바이트|byte|MiB|GiB|GB|TB)[^.]{0,100}(?:÷|\s\/\s)\s*\d/i,
];
const explanationComponents =
  /<(?:CalculationWalkthrough|ExplainedFormula|NumericPath)\b|<section\b[^>]*\bdata-calculation-explained\b/;
const structuralVisualization =
  /<(?:[A-Z][A-Za-z0-9]*Viz|svg|Mafs|LineChart|BarChart|AreaChart|ScatterChart)\b/;

function plainText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lineAt(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

function sectionId(openingTag, fallback) {
  return openingTag.match(/\bid=["']([^"']+)["']/)?.[1] ?? fallback;
}

function sourceFingerprint(files) {
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    hash.update(path.relative(process.cwd(), file));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, 16);
}

function findingsInFile(file) {
  const source = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(process.cwd(), file);
  const findings = [];
  const sections = [...source.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)];

  for (const [sectionIndex, section] of sections.entries()) {
    const body = section[0];
    const opening = body.match(/^<section\b[^>]*>/)?.[0] ?? "";
    const id = sectionId(opening, `section-${sectionIndex + 1}`);
    const hasExplanation = explanationComponents.test(body);
    const hasStructuralVisualization = structuralVisualization.test(body);

    for (const paragraph of body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
      const text = plainText(paragraph[1]);
      if (!highRiskPatterns.some((pattern) => pattern.test(text))) continue;
      const missing = [];
      if (!hasExplanation) missing.push("calculation-ledger");
      if (!hasStructuralVisualization) missing.push("structural-viz");
      if (missing.length === 0) continue;
      const offset = (section.index ?? 0) + (paragraph.index ?? 0);
      findings.push({
        file: relativeFile,
        sectionId: id,
        line: lineAt(source, offset),
        missing,
        sample: text.slice(0, 240),
      });
    }
  }
  return findings;
}

const catalog = await loadPublicArticleCatalog();
const findings = [];

for (const article of catalog) {
  if (routeFilter && article.route !== routeFilter) continue;
  const files = collectArticleSourceClosure(article.sourcePath);
  const pending = files.flatMap(findingsInFile);
  if (pending.length === 0) continue;
  findings.push({
    route: article.route,
    fingerprint: sourceFingerprint(files),
    pending,
  });
}

if (refreshBaseline) {
  const baseline = {
    description:
      "High-risk multi-factor calculation inventory. A baseline entry records the last human review point and remains migration debt until its pending list is empty; it is not proof that the explanation is sufficient.",
    generatedAt: new Date().toISOString(),
    findings: Object.fromEntries(
      findings.map(({ route, fingerprint, pending }) => [
        route,
        { fingerprint, pending },
      ]),
    ),
  };
  fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
}

const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, "utf8"))
  : { findings: {} };
const unreviewed = findings.filter((finding) => {
  const prior = baseline.findings[finding.route];
  return !prior || prior.fingerprint !== finding.fingerprint;
});
const pendingCount = findings.reduce((sum, finding) => sum + finding.pending.length, 0);

console.log(
  `계산 설명 검사: 공개 글 ${catalog.length}개 · 고위험 미전환 ${findings.length}편/${pendingCount}곳 · 재검토 ${unreviewed.length}편`,
);

const reported = routeFilter ? findings : findings.slice(0, 30);
for (const finding of reported) {
  console.log(`- ${finding.route}: ${finding.pending.length}곳`);
  if (routeFilter) {
    for (const item of finding.pending) {
      console.log(`  ${item.file}:${item.line} #${item.sectionId} ${item.sample}`);
      console.log(`    missing: ${item.missing.join(", ")}`);
    }
  }
}
if (!routeFilter && findings.length > reported.length) {
  console.log(`- … ${findings.length - reported.length}편 추가`);
}

for (const finding of unreviewed) {
  console.error(
    `- 계산 설명 재검토 필요: ${finding.route} (${finding.fingerprint}, ${finding.pending.length}곳)`,
  );
}

if (unreviewed.length > 0 && strict) process.exitCode = 1;
