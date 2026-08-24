import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ARTICLE_LEARNING } from "../src/content/article-learning.ts";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const catalog = await loadPublicArticleCatalog({ root: repoRoot });
const byRoute = new Map(catalog.map((article) => [article.route, article]));

test("public catalog is the complete article route set without filesystem phantoms", () => {
  assert.equal(catalog.length, 563);
  assert.equal(byRoute.size, catalog.length);

  for (const route of [
    "blockchain/reth",
    "crypto/finite-field-theory",
    "gpu/gpu-architecture",
    "gpu/cfd-finite-volume-gpu",
    "gpu/hw-memory",
    "ai/supervised-learning-loop",
    "ai/train-validation-test",
    "ai/math-functions-composition",
    "ai/math-gradients-jacobians",
    "ai/math-optimization-objectives",
    "ai/math-gradient-descent-convergence",
    "ai/math-random-variables-expectation",
    "ai/math-variance-sampling",
    "ai/kv-cache-fundamentals",
    "ai/hybrid-kv-cache-allocation",
    "ai/llm-serving-capacity",
    "ai/agent-loop-foundations",
    "ai/agent-plan-replanning",
    "ai/agent-delegation-contracts",
    "ai/agent-extension-boundaries",
    "ai/agent-run-contract",
    "ai/agent-verification",
    "ai/llm-training-stages",
    "ai/motif-3-architecture",
    "ai/spiking-neural-networks",
    "ai/harness-failure-ablation",
    "ai/agent-control-boundaries",
    "ai/claude-code",
    "ai/claude-code-instructions-memory",
    "ai/claude-code-subagents",
    "ai/claude-code-permissions",
    "ai/claude-code-hooks",
    "ai/claude-code-checkpointing",
    "ai/bert",
    "ai/bert-input-packing",
    "ai/bert-mlm-corruption",
    "ai/bert-pretraining-objectives",
    "ai/bert-task-heads",
    "ai/cnn",
    "ai/cnn-translation-equivariance",
    "ai/cnn-receptive-fields",
    "ai/depthwise-separable-convolution",
    "ai/vision-task-spatial-contracts",
    "ai/continued-pretraining",
    "ai/domain-task-finetuning",
    "ai/domain-data-governance",
    "ai/bi-encoder-retrieval",
    "ai/embedding-serving-contract",
    "ai/embedding-evaluation",
    "ai/word2vec-prediction-objectives",
    "ai/word2vec-negative-sampling",
    "ai/subword-static-embeddings",
    "ai/deepfake-detection",
    "ai/deepfake-preprocessing-lineage",
    "ai/deepfake-frequency-evidence",
    "ai/deepfake-video-decisions",
    "ai/deepfake-dataset-governance",
    "ai/video-understanding",
    "ai/video-clip-sampling",
    "ai/video-convolution-architectures",
    "ai/video-transformers",
    "ai/image-backbone-scaling",
    "ai/image-training-stages",
    "ai/image-probability-decisions",
    "ai/regression-metrics",
    "ai/classification-metrics",
    "ai/ranking-metrics",
    "ai/metric-selection-protocol",
    "ai/adaptive-hyperparameter-search",
    "ai/search-space-design",
    "ai/multi-fidelity-pruning",
    "ai/multi-objective-hpo",
    "ai/learning-curve-tracking",
    "ai/model-artifact-registry",
    "ai/reproducible-ml-execution",
    "ai/imbalance-resampling",
    "ai/imbalance-loss-weighting",
    "ai/cost-sensitive-thresholding",
    "ai/imbalanced-classification-evaluation",
    "ai/momentum-optimizer",
    "ai/adam-optimizer",
    "ai/lr-decay-policies",
    "ai/cosine-restart-scheduling",
    "ai/one-cycle-scheduling",
    "ai/warmup-scheduling",
    "ai/cfg-pushdown-automata",
    "ai/incremental-parsing-tree-sitter",
    "ai/grammar-tokenizer-decoding",
    "ai/structured-generation-serving",
  ]) {
    assert.ok(byRoute.has(route), `public route가 누락되었습니다: ${route}`);
  }
  for (const phantomRoute of [
    "ethereum/reth",
    "blockchain/finite-field-theory",
    "blockchain/gpu-architecture",
    "hw/memory",
    "ai/hybrid-attention-serving",
    "ai/agentic-patterns",
  ]) {
    assert.ok(
      !byRoute.has(phantomRoute),
      `source 경로가 phantom route가 되었습니다: ${phantomRoute}`,
    );
  }
});

test("every public route resolves to an existing article source closure", () => {
  for (const article of catalog) {
    assert.ok(
      fs.existsSync(article.sourcePath),
      `${article.route} source가 없습니다.`,
    );
    const closure = collectArticleSourceClosure(article.sourcePath, {
      root: repoRoot,
    });
    assert.ok(
      closure.length > 0,
      `${article.route} source closure가 비어 있습니다.`,
    );
    assert.ok(
      closure.includes(article.sourcePath),
      `${article.route} entry가 closure에 없습니다.`,
    );
  }
});

test("registered learning contracts remain a subset of public routes", () => {
  for (const route of Object.keys(ARTICLE_LEARNING)) {
    assert.ok(
      byRoute.has(route),
      `등록된 contract가 public catalog에 없습니다: ${route}`,
    );
  }
});

test("cross-category public routes retain their catalog source mapping", () => {
  const expectedSources = new Map([
    ["blockchain/reth", "src/pages/articles/ethereum/reth.tsx"],
    [
      "crypto/finite-field-theory",
      "src/pages/articles/blockchain/finite-field-theory.tsx",
    ],
    [
      "gpu/gpu-architecture",
      "src/pages/articles/blockchain/gpu-architecture.tsx",
    ],
    ["gpu/hw-memory", "src/pages/articles/hw/memory.tsx"],
  ]);

  for (const [route, source] of expectedSources) {
    assert.equal(
      path.relative(repoRoot, byRoute.get(route).sourcePath),
      source,
    );
  }
});
