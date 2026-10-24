import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(
  repoRoot,
  "docs",
  "teach-system-audit",
  "architecture-flow-current.json",
);
const write = process.argv.includes("--write");
const strict = process.argv.includes("--strict");

const architecturePattern =
  /(architecture|pipeline|routing|router|scheduler|scheduling|controller|orchestrat|lifecycle|protocol|network|storage|database|runtime|sync|consensus|execution|gateway|cluster|node|아키텍처|파이프라인|라우팅|스케줄|컨트롤러|수명주기|프로토콜|네트워크|저장|데이터베이스|런타임|동기화|합의|실행|게이트웨이|클러스터|노드)/i;
const inlineVisualPattern = /<svg\b|<canvas\b/i;
const animatedMechanismPattern =
  /useAnimatedScenes|AnimatedSceneControls|\bmotion\.|AnimatePresence|@keyframes|animation(?:Name|Duration|Delay)?\s*[:=]/;
const codeEvidencePattern = /CodeSidebar|CodeViewButton|data-code-ref/;
const sourceCitationPattern = /CitationBlock|id=["']paper-|href=["']https?:/;
const recursiveLocatorPattern =
  /(?:Consensus|Execution)ClientLocator|EthereumNodeLocator|[A-Za-z0-9]+SeriesLocator|Recursive[A-Za-z0-9]*(?:Map|Locator)/;

function readClosure(files) {
  return files
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
}

const catalog = await loadPublicArticleCatalog({ root: repoRoot });
const articles = catalog
  .map((article) => {
    const closure = collectArticleSourceClosure(article.sourcePath, {
      root: repoRoot,
    });
    const source = readClosure(closure);
    const hasDedicatedVisual = closure.some((file) =>
      /[/\\]viz[/\\]|(?:Viz|Diagram)\.[jt]sx?$/.test(file),
    );
    const hasInlineVisual = inlineVisualPattern.test(source);
    const hasCustomVisual = hasDedicatedVisual || hasInlineVisual;
    const hasAnimatedMechanism = animatedMechanismPattern.test(source);
    const hasCodeEvidence = codeEvidencePattern.test(source);
    const hasSourceCitation = sourceCitationPattern.test(source);
    const hasRecursiveLocator = recursiveLocatorPattern.test(source);
    const architectureCandidate = architecturePattern.test(
      `${article.route} ${article.title}`,
    );

    return {
      route: article.route,
      publicPath: article.publicPath,
      title: article.title,
      sourcePath: path.relative(repoRoot, article.sourcePath),
      locationMap: "global:ArticleOnboarding",
      architectureCandidate,
      hasDedicatedVisual,
      hasInlineVisual,
      hasCustomVisual,
      hasAnimatedMechanism,
      hasRecursiveLocator,
      hasCodeEvidence,
      hasSourceCitation,
      reviewPriority:
        architectureCandidate && !hasCustomVisual
          ? "architecture-without-custom-visual"
          : hasAnimatedMechanism
            ? "verify-motion-semantics"
            : hasCustomVisual
              ? "verify-static-visual"
              : "verify-text-first",
    };
  })
  .sort((left, right) => left.route.localeCompare(right.route));

const summary = {
  publicArticles: articles.length,
  architectureCandidates: articles.filter((item) => item.architectureCandidate)
    .length,
  dedicatedVisuals: articles.filter((item) => item.hasDedicatedVisual).length,
  inlineVisuals: articles.filter((item) => item.hasInlineVisual).length,
  customVisuals: articles.filter((item) => item.hasCustomVisual).length,
  animatedMechanisms: articles.filter((item) => item.hasAnimatedMechanism)
    .length,
  architectureWithoutAnimation: articles.filter(
    (item) => item.architectureCandidate && !item.hasAnimatedMechanism,
  ).length,
  recursiveLocators: articles.filter((item) => item.hasRecursiveLocator).length,
  codeEvidenceLinked: articles.filter((item) => item.hasCodeEvidence).length,
  sourceCitationLinked: articles.filter((item) => item.hasSourceCitation).length,
  architectureWithoutCustomVisual: articles.filter(
    (item) =>
      item.reviewPriority === "architecture-without-custom-visual",
  ).length,
};

const report = {
  schemaVersion: 2,
  note:
    "이 파일은 전수 개편의 작업 목록입니다. 실제 import closure 안의 전용 viz 파일과 inline SVG·canvas, 코드 발췌, 외부 근거를 서로 나눠 셉니다. 각 신호는 검토 우선순위를 정할 뿐 설명 품질이나 애니메이션 필요 여부를 자동 판정하지 않습니다.",
  summary,
  articles,
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (write) {
  fs.writeFileSync(outputPath, serialized);
} else if (
  !fs.existsSync(outputPath) ||
  fs.readFileSync(outputPath, "utf8") !== serialized
) {
  console.error(
    "architecture-flow-current.json이 현재 public catalog와 다릅니다. --write로 갱신하세요.",
  );
  if (strict) process.exitCode = 1;
}

console.log(
  [
    `아키텍처 학습 흐름: 공개 ${summary.publicArticles}편`,
    `아키텍처 후보 ${summary.architectureCandidates}편`,
    `전용 viz 파일 ${summary.dedicatedVisuals}편`,
    `inline 시각화 ${summary.inlineVisuals}편`,
    `시각화 근거 ${summary.customVisuals}편`,
    `동작 애니메이션 ${summary.animatedMechanisms}편`,
    `아키텍처 후보 중 애니메이션 검토 ${summary.architectureWithoutAnimation}편`,
    `재귀 위치 지도 ${summary.recursiveLocators}편`,
    `코드 발췌 ${summary.codeEvidenceLinked}편`,
    `외부 근거 ${summary.sourceCitationLinked}편`,
    `전용 시각화 검토 필요 ${summary.architectureWithoutCustomVisual}편`,
  ].join(" · "),
);
