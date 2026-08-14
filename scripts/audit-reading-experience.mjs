import fs from "node:fs";
import { loadPublicArticleCatalog } from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const catalog = await loadPublicArticleCatalog();
const articlePage = fs.readFileSync("src/pages/ArticlePage.tsx", "utf8");
const contractView = fs.readFileSync(
  "src/components/ArticleLearningContract.tsx",
  "utf8",
);
const lessonViz = fs.readFileSync(
  "src/components/viz/ArticleLessonFlowViz.tsx",
  "utf8",
);
const termBreakdown = fs.readFileSync(
  "src/components/articles/term-breakdown.tsx",
  "utf8",
);
const denseTermFlow = fs.readFileSync(
  "src/components/articles/dense-term-flow.tsx",
  "utf8",
);
const globalStyles = fs.readFileSync("src/index.css", "utf8");
const cloudArticle = fs.readFileSync(
  "src/pages/articles/blockchain/filecoin-onchain-cloud/ModernArticle.tsx",
  "utf8",
);

const primerIndex = articlePage.indexOf("<ArticleLessonPrimer");
const onboardingIndex = articlePage.indexOf("<ArticleOnboarding");
const bodyIndex = articlePage.indexOf("data-article-body");
const reviewIndex = articlePage.indexOf("<ArticleLearningContractView");
const introducedStart = contractView.indexOf("이 글 안에서 처음 설명하는 용어");
const introducedSection = contractView.slice(
  introducedStart,
  contractView.indexOf("개념 그래프", introducedStart),
);

const contract = {
  publicArticles: catalog.length,
  primerBeforeBody:
    primerIndex !== -1 && bodyIndex !== -1 && primerIndex < bodyIndex,
  primerBeforeTermBearingOnboarding:
    primerIndex !== -1 &&
    onboardingIndex !== -1 &&
    primerIndex < onboardingIndex,
  reviewAfterBody:
    bodyIndex !== -1 && reviewIndex !== -1 && bodyIndex < reviewIndex,
  newLessonVizMounted: contractView.includes("<ArticleLessonFlowViz"),
  newLessonVizMarker: lessonViz.includes('data-viz="lesson-flow-v3"'),
  interactiveStageControl:
    lessonViz.includes('role="tablist"') && lessonViz.includes("setActive"),
  everyConceptBecomesStep:
    lessonViz.includes("stage.concepts.flatMap") &&
    lessonViz.includes("data-concept-step"),
  definitionIntuitionShapeExampleBoundary:
    lessonViz.includes("data-concept-definition") &&
    lessonViz.includes("data-concept-intuition") &&
    lessonViz.includes("data-concept-shape") &&
    lessonViz.includes("data-concept-example") &&
    lessonViz.includes("data-concept-boundary"),
  sceneBeforeFormalTerm:
    lessonViz.indexOf("먼저 볼 장면") !== -1 &&
    lessonViz.indexOf("이 장면에 붙이는 이름") !== -1 &&
    lessonViz.indexOf("먼저 볼 장면") <
      lessonViz.indexOf("이 장면에 붙이는 이름"),
  fiveCutProgressiveReveal:
    lessonViz.includes('["장면", "정의", "형태", "예시", "경계"]') &&
    lessonViz.includes("reveal >= 1") &&
    lessonViz.includes("reveal >= 2") &&
    lessonViz.includes("reveal >= 3") &&
    lessonViz.includes("reveal >= 4"),
  futureTermNotPreExposed:
    !lessonViz.includes("{candidate.concept.label}") &&
    lessonViz.includes("다음 개념의 출발 장면") &&
    !contractView.includes("{contract.coreIdea}"),
  compositionAfterConcepts: lessonViz.includes("data-concept-composition"),
  explanatoryPlayback:
    lessonViz.includes("data-viz-play") &&
    lessonViz.includes("useReducedMotion") &&
    lessonViz.includes("window.setTimeout"),
  legacySharedVizExcluded: !articlePage.includes("ArticleConceptViz"),
  verticalTermBreakdown:
    termBreakdown.includes("data-term-breakdown") &&
    termBreakdown.includes("data-term-breakdown-item") &&
    termBreakdown.includes("작은 예 ·") &&
    termBreakdown.includes("구분할 것 ·"),
  denseEmphasizedTermsBreakLines:
    globalStyles.includes("p:has(> strong:nth-of-type(3))") &&
    globalStyles.includes("p:has(> code:nth-of-type(3))") &&
    globalStyles.includes('content: "\\A — ";'),
  densePlainTextListsBreakLines:
    articlePage.includes("useDenseTermFlow") &&
    articlePage.includes("articleBodyRef") &&
    denseTermFlow.includes("MutationObserver") &&
    denseTermFlow.includes('split("·")') &&
    denseTermFlow.includes("marker.dataset.termFlowMarker") &&
    globalStyles.includes('p[data-dense-term-flow="true"]'),
  cloudTermsSeparated:
    (cloudArticle.match(/<TermBreakdown/g) ?? []).length >= 4 &&
    cloudArticle.includes("Dataset generation을 고정하는 필드") &&
    cloudArticle.includes("Payment rail의 다섯 장부 항목"),
  introducedTermsSingleColumn:
    introducedSection.includes('className="mt-4 grid gap-4"') &&
    !introducedSection.includes("grid-cols-2"),
};

const failures = Object.entries(contract)
  .filter(([key, value]) => key !== "publicArticles" && value !== true)
  .map(([key]) => `읽기 경험 계약 누락: ${key}`);

console.log(`읽기 경험 요약: ${JSON.stringify(contract)}`);
if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  if (strict) process.exitCode = 1;
} else {
  console.log("읽기 경험 검사 통과");
}
