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
const animatedControls = fs.readFileSync(
  "src/components/viz/AnimatedSceneControls.tsx",
  "utf8",
);
const stepViz = fs.readFileSync("src/components/ui/step-viz.tsx", "utf8");
const responsiveVizTable = fs.readFileSync(
  "src/components/viz/ResponsiveVizTable.tsx",
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
const progressiveDetail = fs.readFileSync(
  "src/components/articles/progressive-detail.tsx",
  "utf8",
);
const articleOnboarding = fs.readFileSync(
  "src/components/ArticleOnboarding.tsx",
  "utf8",
);
const contentBoundary = fs.readFileSync(
  "src/components/articles/content-boundary.tsx",
  "utf8",
);
const globalStyles = fs.readFileSync("src/index.css", "utf8");
const layoutShell = fs.readFileSync("src/components/Layout.tsx", "utf8");
const cloudArticle = fs.readFileSync(
  "src/pages/articles/blockchain/filecoin-onchain-cloud/ModernArticle.tsx",
  "utf8",
);
const viewportSensitiveFiles = [];
const wideVizTableFiles = [];
const collectViewportSensitiveFiles = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collectViewportSensitiveFiles(path);
    else if (/\.(?:css|ts|tsx)$/.test(entry.name)) {
      const source = fs.readFileSync(path, "utf8");
      if (
        /100(?:d|l)?vh/.test(source) ||
        /(?:^|[\s"'])(?:(?:min|max)-)?h-screen(?:[\s"':]|$)/m.test(source)
      ) {
        viewportSensitiveFiles.push(path);
      }
      if (
        path.includes("/viz/") &&
        source.includes("<table") &&
        /min-w-\[(?:3\drem|[4-9]\drem|[4-9]\d{2}px|[1-9]\d{3}px)/.test(source) &&
        !source.includes("ResponsiveVizTable")
      ) {
        wideVizTableFiles.push(path);
      }
    }
  }
};
collectViewportSensitiveFiles("src");

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
  newLessonVizMarker: lessonViz.includes('data-viz="lesson-flow-v4"'),
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
    lessonViz.indexOf("이 장면의 개념") !== -1 &&
    lessonViz.indexOf("먼저 볼 장면") <
      lessonViz.indexOf("이 장면의 개념"),
  fiveCutProgressiveReveal:
    lessonViz.includes('["장면", "정의", "형태", "예시", "경계"]') &&
    lessonViz.includes("reveal >= 1") &&
    lessonViz.includes("reveal >= 2") &&
    lessonViz.includes("reveal >= 3") &&
    lessonViz.includes("reveal >= 4"),
  overviewMapAlwaysVisible:
    lessonViz.includes("data-lesson-overview-map") &&
    lessonViz.includes("{candidate.concept.label}") &&
    lessonViz.includes("Always-visible map") &&
    lessonViz.includes("data-concept-storyboard"),
  diagramGrammarNotTextCards:
    lessonViz.includes("data-concept-glyph") &&
    lessonViz.includes("data-shape-legend") &&
    lessonViz.includes('type ShapeKind = "input" | "process" | "decision" | "store" | "state"') &&
    lessonViz.includes("<polygon") &&
    lessonViz.includes("<circle") &&
    lessonViz.includes("<ellipse") &&
    lessonViz.includes("<rect") &&
    lessonViz.includes("<FlowShape") &&
    lessonViz.includes("data-flow-arrow") &&
    lessonViz.includes("data-stage-flow-arrow") &&
    lessonViz.includes("strokeDashoffset"),
  fullExplanationVisibleByDefault: lessonViz.includes("useState(4)"),
  compositionAfterConcepts: lessonViz.includes("data-concept-composition"),
  explanatoryPlayback:
    lessonViz.includes("data-viz-play") &&
    lessonViz.includes("useReducedMotion") &&
    lessonViz.includes("window.setTimeout"),
  stableVizControlMarker:
    animatedControls.includes("data-viz-controls") &&
    lessonViz.includes("data-viz-controls"),
  stableVizControlSize:
    animatedControls.includes("min-h-[6.75rem]") &&
    animatedControls.includes("w-[7.75rem]") &&
    lessonViz.includes("w-[8.5rem]"),
  mobileVizNaturalFlow:
    globalStyles.includes("@media (max-width: 39.999rem)") &&
    globalStyles.includes(":is([data-viz], figure):has([data-viz-controls])") &&
    globalStyles.includes("height: auto !important") &&
    globalStyles.includes('[data-viz="step-flow"] svg') &&
    globalStyles.includes('[class*="min-w-["]'),
  mobileSceneControls:
    animatedControls.includes("data-viz-mobile-controls") &&
    animatedControls.includes("data-viz-desktop-controls") &&
    animatedControls.includes("grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]") &&
    animatedControls.includes("← 이전") &&
    animatedControls.includes("다음 →") &&
    globalStyles.includes("[data-viz-controls] button") &&
    globalStyles.includes("overflow-wrap: anywhere"),
  mobileStepControls:
    stepViz.includes("data-step-viz-mobile-controls") &&
    stepViz.includes("grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]") &&
    stepViz.includes("overflow-hidden bg-background") &&
    stepViz.includes("sm:overflow-x-auto") &&
    stepViz.includes("[&_svg]:w-full") &&
    !stepViz.includes("↔ 좌우로 살펴보기"),
  mobileVizTables:
    responsiveVizTable.includes("data-viz-mobile-table") &&
    responsiveVizTable.includes("data-viz-desktop-table") &&
    responsiveVizTable.includes("sm:hidden") &&
    responsiveVizTable.includes("hidden overflow-x-auto sm:block") &&
    responsiveVizTable.includes("[overflow-wrap:anywhere]"),
  allWideVizTablesHaveMobileCards: wideVizTableFiles.length === 0,
  mobileLessonControls:
    lessonViz.includes("data-lesson-mobile-controls") &&
    lessonViz.includes("sm:sticky sm:bottom-0") &&
    lessonViz.includes("grid-cols-1") &&
    lessonViz.includes(
      "grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]",
    ),
  viewportCappedVizFrame:
    globalStyles.includes('figure[data-viz="modern"]:has([data-viz-controls])') &&
    globalStyles.includes('figure[data-viz="lesson-flow-v4"]') &&
    globalStyles.includes("calc(100svh - 5rem)") &&
    globalStyles.includes("scroll-margin-top: 4rem") &&
    globalStyles.includes("overscroll-behavior: contain"),
  stableMobileViewportUnits: viewportSensitiveFiles.length === 0,
  stableMobileDocumentShell:
    layoutShell.includes('className="min-h-svh bg-background overscroll-none"') &&
    layoutShell.includes('className="sticky top-0 z-50') &&
    !layoutShell.includes('className="fixed top-0') &&
    !globalStyles.includes("@media (max-height:"),
  keyboardCutNavigation:
    lessonViz.includes("data-viz-keyboard") &&
    lessonViz.includes('event.key === "ArrowRight"') &&
    lessonViz.includes('event.key === "ArrowLeft"') &&
    lessonViz.includes('aria-keyshortcuts="ArrowLeft ArrowRight Space"') &&
    lessonViz.includes("lesson-flow-keyboard-help"),
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
  progressiveDisclosureAccessible:
    progressiveDetail.includes("<details") &&
    progressiveDetail.includes("<summary") &&
    progressiveDetail.includes("data-progressive-detail") &&
    progressiveDetail.includes("data-progressive-detail-preview") &&
    progressiveDetail.includes("focus-visible:ring-2") &&
    progressiveDetail.includes("group-open:rotate-90"),
  articleScopeProgressivelyDisclosed:
    articleOnboarding.includes("<ProgressiveDetail") &&
    articleOnboarding.includes("이 글은 어디까지 설명하고") &&
    articleOnboarding.includes("learningScope.map") &&
    articleOnboarding.includes("concept.role") &&
    !articleOnboarding.includes('.join(" · ")'),
  editorialBoundaryProgressivelyDisclosed:
    contentBoundary.includes("<ProgressiveDetail") &&
    contentBoundary.includes("본문의 핵심 흐름을 읽는 데 먼저 외울 필요는 없습니다") &&
    contentBoundary.includes("이 글이 직접 설명하는 내용") &&
    !contentBoundary.includes("lg:grid-cols-3"),
};

const failures = Object.entries(contract)
  .filter(([key, value]) => key !== "publicArticles" && value !== true)
  .map(([key]) => `읽기 경험 계약 누락: ${key}`);

if (wideVizTableFiles.length) {
  failures.push(
    ...wideVizTableFiles.map((path) => `모바일 카드가 없는 고정 폭 Viz 표: ${path}`),
  );
}

console.log(`읽기 경험 요약: ${JSON.stringify(contract)}`);
if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  if (strict) process.exitCode = 1;
} else {
  console.log("읽기 경험 검사 통과");
}
