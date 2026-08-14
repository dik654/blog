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
  assert.equal(catalog.length, 390);
  assert.equal(byRoute.size, catalog.length);

  for (const route of [
    "blockchain/reth",
    "crypto/finite-field-theory",
    "gpu/gpu-architecture",
    "gpu/hw-memory",
  ]) {
    assert.ok(byRoute.has(route), `public route가 누락되었습니다: ${route}`);
  }
  for (const phantomRoute of [
    "ethereum/reth",
    "blockchain/finite-field-theory",
    "blockchain/gpu-architecture",
    "hw/memory",
  ]) {
    assert.ok(!byRoute.has(phantomRoute), `source 경로가 phantom route가 되었습니다: ${phantomRoute}`);
  }
});

test("every public route resolves to an existing article source closure", () => {
  for (const article of catalog) {
    assert.ok(fs.existsSync(article.sourcePath), `${article.route} source가 없습니다.`);
    const closure = collectArticleSourceClosure(article.sourcePath, { root: repoRoot });
    assert.ok(closure.length > 0, `${article.route} source closure가 비어 있습니다.`);
    assert.ok(closure.includes(article.sourcePath), `${article.route} entry가 closure에 없습니다.`);
  }
});

test("registered learning contracts remain a subset of public routes", () => {
  for (const route of Object.keys(ARTICLE_LEARNING)) {
    assert.ok(byRoute.has(route), `등록된 contract가 public catalog에 없습니다: ${route}`);
  }
});

test("cross-category public routes retain their catalog source mapping", () => {
  const expectedSources = new Map([
    ["blockchain/reth", "src/pages/articles/ethereum/reth.tsx"],
    ["crypto/finite-field-theory", "src/pages/articles/blockchain/finite-field-theory.tsx"],
    ["gpu/gpu-architecture", "src/pages/articles/blockchain/gpu-architecture.tsx"],
    ["gpu/hw-memory", "src/pages/articles/hw/memory.tsx"],
  ]);

  for (const [route, source] of expectedSources) {
    assert.equal(path.relative(repoRoot, byRoute.get(route).sourcePath), source);
  }
});
