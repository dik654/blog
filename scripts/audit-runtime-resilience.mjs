import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

const app = read("src/App.tsx");
const bridge = read("src/components/InternalLinkBridge.tsx");
const articlePage = read("src/pages/ArticlePage.tsx");
const lazyLoader = read("src/lib/lazy-with-reload.ts");
const boundary = read("src/components/articles/article-load-boundary.tsx");
const main = read("src/main.tsx");
const math = read("src/components/ui/math.tsx");
const articleTemplate = read("src/pages/articles/cloud/CloudCertificationArticle.tsx");
const p0Data = read("src/pages/articles/hw/ai-infrastructure-study/data.ts");
const staticRoutes = read("scripts/generate-static-routes.mjs");

const checks = {
  basePathBridgeMounted:
    app.includes("<InternalLinkBridge />") &&
    bridge.includes("import.meta.env.BASE_URL") &&
    bridge.includes('anchor.setAttribute("href", `${basePath}${appRoute}`)'),
  spaClickUsesRouter:
    bridge.includes('closest<HTMLAnchorElement>("a[data-app-route]")') &&
    bridge.includes("navigate(appRoute)"),
  lazyChunkReloadOnce:
    articlePage.includes("lazyWithReload(article.component") &&
    lazyLoader.includes("window.sessionStorage") &&
    lazyLoader.includes("window.history.replaceState") &&
    lazyLoader.includes("RELOAD_GUARD_MS") &&
    lazyLoader.includes("if (!recorded) return false") &&
    lazyLoader.includes("window.location.reload()"),
  articleErrorBoundary:
    articlePage.includes("<ArticleLoadBoundary") &&
    boundary.includes("getDerivedStateFromError"),
  static404Fallback: staticRoutes.includes('"404.html"'),
  katexCssLoaded: main.includes('katex/dist/katex.min.css'),
  katexRenderStatus:
    math.includes('html.includes("katex-error")') &&
    math.includes("data-math-status={renderStatus}"),
  structuredFormulaTemplate:
    articleTemplate.includes("formulas?: readonly CloudArticleFormula[]") &&
    articleTemplate.includes("<ExplainedFormula") &&
    articleTemplate.includes("annotatedFormula={formula.content.annotatedFormula}"),
  p0FormulaCoverage: (p0Data.match(/\bformulas:\s*\[/g) ?? []).length >= 6,
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

console.log(`런타임 복구·수식 계약: ${JSON.stringify(checks)}`);
if (failed.length) {
  console.error(`누락된 계약: ${failed.join(", ")}`);
  process.exit(1);
}
