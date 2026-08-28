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
const baselinePath = path.resolve("docs/prose-readability-baseline.json");
const internalTerms = [
  "artifact",
  "receipt",
  "fixture",
  "fingerprint",
  "snapshot",
  "canonical",
  "release gate",
];
const transitionTerms = [
  "예를 들어",
  "하지만",
  "따라서",
  "그러면",
  "반대로",
  "여기서",
  "즉",
  "이 때문에",
];

function stripJsx(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectTagText(source, tag) {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  return [...source.matchAll(pattern)]
    .map((match) => stripJsx(match[1]))
    .filter(Boolean);
}

function countMatches(source, needle) {
  return source.toLowerCase().split(needle.toLowerCase()).length - 1;
}

function analyze(source) {
  const headings = [...collectTagText(source, "h2"), ...collectTagText(source, "h3")];
  const paragraphs = collectTagText(source, "p");
  const longHeadings = headings.filter(
    (heading) =>
      heading.length >= 58 ||
      (heading.match(/[·/+→]/g)?.length ?? 0) >= 3,
  );
  const longParagraphs = paragraphs.filter(
    (paragraph) => paragraph.length >= 260,
  );
  const listLikeParagraphs = paragraphs.filter(
    (paragraph) => (paragraph.match(/[·]/g)?.length ?? 0) >= 5,
  );
  const proseText = [...headings, ...paragraphs].join("\n");
  const internalTermCount = internalTerms.reduce(
    (sum, term) => sum + countMatches(proseText, term),
    0,
  );
  const transitionCount = transitionTerms.reduce(
    (sum, term) => sum + countMatches(proseText, term),
    0,
  );
  const proseChars = paragraphs.reduce(
    (sum, paragraph) => sum + paragraph.length,
    0,
  );
  const pacingScore =
    longHeadings.length * 2 +
    longParagraphs.length * 2 +
    listLikeParagraphs.length * 2 +
    (proseChars >= 1000 && transitionCount === 0 ? 2 : 0);
  const editorialJargonScore = Math.max(0, internalTermCount - 8);
  const score = pacingScore + editorialJargonScore;
  const signalSnippets = [
    ...longHeadings.map((text) => ({ kind: "긴 제목", text })),
    ...longParagraphs.map((text) => ({ kind: "긴 문단", text })),
    ...listLikeParagraphs.map((text) => ({ kind: "목록형 문단", text })),
  ];

  return {
    score,
    paragraphCount: paragraphs.length,
    proseChars,
    longHeadings: longHeadings.length,
    longParagraphs: longParagraphs.length,
    listLikeParagraphs: listLikeParagraphs.length,
    internalTermCount,
    transitionCount,
    pacingScore,
    editorialJargonScore,
    signalSnippets,
  };
}

const catalog = await loadPublicArticleCatalog();
const findings = [];

for (const article of catalog) {
  const files = collectArticleSourceClosure(article.sourcePath);
  const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const metrics = analyze(source);
  if (metrics.score < 5) continue;
  findings.push({
    route: article.route,
    fingerprint: crypto.createHash("sha256").update(source).digest("hex").slice(0, 16),
    ...metrics,
  });
}

findings.sort((left, right) => right.score - left.score || left.route.localeCompare(right.route));

if (refreshBaseline) {
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        description:
          "Known legacy prose-compression inventory keyed by route and source fingerprint. New or changed findings must be rewritten or explicitly re-reviewed; an entry is not a claim that prose quality is complete.",
        findings: Object.fromEntries(
          findings.map(({ route, fingerprint, score }) => [route, { fingerprint, score }]),
        ),
      },
      null,
      2,
    )}\n`,
  );
}

const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, "utf8"))
  : { findings: {} };
const unreviewed = findings.filter((finding) => {
  const decision = baseline.findings[finding.route];
  return (
    !decision ||
    decision.fingerprint !== finding.fingerprint ||
    finding.score > decision.score
  );
});

console.log(
  `문장 호흡 검사: 공개 글 ${catalog.length}개 · 압축 신호 ${findings.length}개 · 재검토 ${unreviewed.length}개`,
);
const reportedFindings = routeFilter
  ? findings.filter((finding) => finding.route === routeFilter)
  : findings.slice(0, 20);
for (const finding of reportedFindings) {
  console.log(
    `${finding.route} score=${finding.score} pacing=${finding.pacingScore} jargon=${finding.editorialJargonScore} heading=${finding.longHeadings} paragraph=${finding.longParagraphs} list=${finding.listLikeParagraphs} ops=${finding.internalTermCount} transitions=${finding.transitionCount}`,
  );
  if (routeFilter) {
    finding.signalSnippets.forEach((signal) =>
      console.log(`  - ${signal.kind}: ${signal.text.slice(0, 220)}`),
    );
  }
}

if (unreviewed.length > 0) {
  unreviewed.forEach((finding) =>
    console.error(`- 설명 호흡 재검토 필요: ${finding.route} (${finding.fingerprint}, score ${finding.score})`),
  );
  if (strict) process.exitCode = 1;
} else {
  console.log("문장 호흡 baseline 검사 통과");
}
