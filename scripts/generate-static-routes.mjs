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
// 이 목록에 넣습니다. 개별 파일이 아니라 함께 검증한 학습 묶음을 완성 단위로 봅니다.
const noScriptArticleRoutes = new Set([
  "ai/diffusion-models",
  "ai/diffusion-continuous-time",
  "ai/latent-diffusion-guidance",
  "ai/visual-representation-tokenizers",
  "ai/diffusion-transformer-architecture",
  "ai/modern-image-model-stack",
  "ai/diffusion-language-models",
  "ai/image-video-lora-architecture",
  "ai/multi-component-finetuning-vram",
  "ai/generative-measurement-controls",
  "ai/masked-edit-verb-routing",
  "ai/removal-is-not-inpainting",
  "ai/roi-resolution-identity-budget",
  "ai/reference-identity-pose-separation",
  "ai/generative-identity-diversity",
  "ai/negative-result-3d-face-control",
  "ai/in-context-lora",
  "ai/world-model-latent-planning",
  "ai/gan",
  "ai/gan-training-dynamics",
  "ai/gan-wasserstein-critics",
  "ai/gan-conditional-evaluation",
  "ai/generative-theory",
  "ai/autoregressive-generative-models",
  "ai/latent-variable-generative-models",
  "ai/normalizing-flows",
  "ai/adversarial-density-ratios",
  "ai/score-based-generative-models",
  "ai/arima",
  "ai/lstm-timeseries",
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
  "ai/sam3-promptable-concept-segmentation",
  "ai/vla-embodiment-gap",
  "ai/robot-action-representations",
  "ai/imitation-learning-and-policy-generalization",
  "ai/vision-language-navigation",
  "ai/llm-training-stages",
  "ai/llm-dataset-engineering-and-cleaning",
  "ai/supervised-fine-tuning",
  "ai/rlhf",
  "ai/rl-foundations-for-llm-post-training",
  "ai/reward-design-for-verifiable-rl",
  "ai/dpo",
  "ai/constitutional-ai",
  "ai/orpo",
  "ai/kto",
  "ai/synthetic-data-and-data-flywheel",
  "ai/llm-sampling-strategies",
  "ai/yarn-rope-extension",
  "ai/multi-head-latent-attention-mechanics",
  "ai/linear-attention-and-state-space-models",
  "ai/fast-weight-memory-and-chunkwise-recurrence",
  "ai/differential-attention",
  "ai/sparse-windowed-attention-patterns",
  "ai/hyper-connections-residual-streams",
  "ai/mixture-of-experts",
  "ai/moe-routing-and-load-balancing",
  "ai/sparse-autoencoder",
  "ai/grammar-constrained-generation",
  "ai/cfg-pushdown-automata",
  "ai/grammar-tokenizer-decoding",
  "ai/incremental-parsing-tree-sitter",
  "ai/structured-generation-serving",
  "ai/motif-3-architecture",
  "ai/kimi-k3-architecture",
  "ai/kimi-k3-sequence-mixer",
  "ai/kimi-k3-depth-routing",
  "ai/kimi-k3-latent-moe",
  "ai/kv-cache-fundamentals",
  "ai/kv-cache-quantization",
  "ai/vllm-serving",
  "ai/serving-latency-metrics-and-slo",
  "ai/vllm-scheduler",
  "ai/continuous-batching-step-anatomy",
  "ai/prefill-decode-phase-dynamics",
  "ai/vllm-paged-attention",
  "ai/serving-memory-admission-and-preemption",
  "ai/prefix-caching-radix-attention",
  "ai/model-vram-budgeting",
  "ai/inference-runtime-anatomy",
  "ai/llm-serving-capacity",
  "ai/multimodal-serving-pipeline",
  "ai/sglang-runtime-anatomy",
  "ai/llama-cpp-local-inference",
  "ai/launch-overhead-and-cpu-gpu-synchronization",
  "ai/cuda-graph-capture",
  "ai/flash-attention-io-aware-kernel",
  "ai/attention-kernel-anatomy-and-backends",
  "ai/tensorrt-llm-kv-cache-and-kernels",
  "ai/inference-engine-design-axes",
  "ai/vllm-spec-decode",
  "ai/speculative-decoding-variants",
  "ai/multi-adapter-serving",
  "ai/hybrid-kv-cache-allocation",
  "ai/sliding-window-kv-and-attention-sinks",
  "ai/qwen36-hybrid-architecture",
  "ai/qwen36-hybrid-runtime",
  "ai/qwen38-flash-next-architecture",
  "ai/expert-parallelism-moe-systems",
  "ai/tensor-and-pipeline-parallel-inference",
  "ai/parallelism-strategy-and-placement",
  "ai/disaggregated-prefill-decode-serving",
  "ai/inference-optimization-layers",
  "ai/serving-benchmark-methodology",
  "ai/inference-cost-and-capacity-planning",
  "ai/sionic-glm-b300",
  "ai/qwen36-long-context-deployment",
  "ai/region-agnostic-inference-routing",
  "ai/inference-stack-standard-levels",
  "ai/llm-serving-ops",
  "ai/onprem-k8s-inference-platform",
  "ai/inference-failure-absorption",
  "ai/own-vs-rent-inference-capacity",
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
