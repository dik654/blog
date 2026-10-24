import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import { createServer } from "vite";
import { loadPublicArticleCatalog } from "./lib/public-article-catalog.mjs";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(repoRoot, "dist");
const sourceIndex = path.join(distRoot, "index.html");

function assertSafeRoute(route) {
  const segments = route.split("/");
  if (
    segments.length === 0 ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new Error(`정적 페이지를 생성할 수 없는 public route: ${route}`);
  }
}

const catalog = await loadPublicArticleCatalog({ root: repoRoot });
const routes = new Set();

for (const { route, publicPath } of catalog) {
  assertSafeRoute(publicPath);
  // 현재 공개 주소: /<대분류>/<카테고리>/<글>, /<대분류>/<카테고리>, /<대분류>
  const segments = publicPath.split("/");
  routes.add(publicPath);
  routes.add(segments.slice(0, 2).join("/"));
  routes.add(segments[0]);

  // 대분류 도입 이전 주소도 실제 파일로 남겨 둔다. 정적 호스팅에서는 해당
  // 경로에 index.html이 있어야 앱이 떠서 새 주소로 보낼 수 있다.
  assertSafeRoute(route);
  routes.add(route);
  routes.add(route.split("/", 1)[0]);
}

for (const route of [...routes].sort()) {
  const routeDirectory = path.join(distRoot, ...route.split("/"));
  const relativeDirectory = path.relative(distRoot, routeDirectory);
  if (relativeDirectory.startsWith("..") || path.isAbsolute(relativeDirectory)) {
    throw new Error(`dist 바깥의 public route는 생성할 수 없습니다: ${route}`);
  }
  await fs.mkdir(routeDirectory, { recursive: true });
  await fs.copyFile(sourceIndex, path.join(routeDirectory, "index.html"));
}

// 이 저장소는 client-side SPA라 JavaScript가 꺼지면 #root가 비어 있습니다.
// 검토를 마친 학습 묶음은 같은 절 순서와 결론을 읽을 수 있도록 각 글의
// 실제 React 본문을 build 시점에 정적 markup으로 한 번 더 넣습니다.
// 새 글은 모바일·키보드·reduced-motion·정적 읽기 검증을 모두 마친 뒤에만
// 이 목록에 넣습니다. Kubernetes 묶음은 subcategory가 완성 단위입니다.
const noScriptArticleRoutes = new Set([
  "ai/autoencoder",
  "ai/linear-autoencoder-pca",
  "ai/denoising-masked-autoencoders",
  "ai/reconstruction-anomaly-detection",
  "ai/distributional-semantics",
  "ai/vision-language-model-architecture",
  "ai/multimodal-retrieval-and-visual-grounding",
  "ai/rnn",
  "ai/rnn-language-model",
  "ai/bptt",
  "ai/lstm",
  "ai/gru",
  "ai/seq2seq",
  "ai/attention-theory",
  "ai/tokenizer",
  "ai/transformer-architecture",
  "ai/bert",
  "ai/bert-input-packing",
  "ai/bert-mlm-corruption",
  "ai/bert-pretraining-objectives",
  "ai/bert-task-heads",
  "ai/cnn",
  "ai/cnn-translation-equivariance",
  "ai/cnn-receptive-fields",
  "ai/depthwise-separable-convolution",
  "ai/resnet",
  "ai/vision-task-spatial-contracts",
]);
const noScriptArticles = catalog.filter(
  (article) =>
    article.subcategory.startsWith("cloud-kubernetes") ||
    noScriptArticleRoutes.has(article.route),
);
const vite = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  for (const article of noScriptArticles) {
    const module = await vite.ssrLoadModule(article.sourceSpecifier);
    const body = renderToStaticMarkup(
      createElement(
        StaticRouter,
        { location: `/${article.publicPath}` },
        createElement(module.default),
      ),
    );
    const fallback = `<noscript><main id="noscript-article" style="max-width:52rem;margin:0 auto;padding:2rem 1rem 5rem"><article><p style="margin:0 0 .75rem;color:#64748b;font:600 12px/1.5 system-ui,sans-serif">정적 읽기 모드 · 장면 조작 없이 모든 절을 순서대로 표시합니다.</p><h1 style="margin:0 0 2rem;font:700 clamp(1.75rem,5vw,2.5rem)/1.25 system-ui,sans-serif">${article.title}</h1>${body}</article></main></noscript>`;

    for (const route of [article.publicPath, article.route]) {
      const outputPath = path.join(distRoot, ...route.split("/"), "index.html");
      const html = await fs.readFile(outputPath, "utf8");
      await fs.writeFile(outputPath, html.replace("</body>", `${fallback}</body>`));
    }
  }
} finally {
  await vite.close();
}

// 알 수 없는 경로도 앱의 NotFound 화면까지 도달하게 하되, 알려진 공개
// 경로는 위의 실제 index.html이 처리하므로 HTTP 200으로 응답한다.
await fs.copyFile(sourceIndex, path.join(distRoot, "404.html"));

console.log(
  `정적 public route ${routes.size.toLocaleString("en-US")}개와 404 fallback을 생성하고 검토 완료 ${noScriptArticles.length}편의 no-script 본문을 넣었습니다.`,
);
