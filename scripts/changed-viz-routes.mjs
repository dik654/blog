#!/usr/bin/env node
/**
 * 두 커밋 사이에 바뀐 글·Viz가 화면에 나오는 public route를 찾아 sweep에 넘긴다.
 *
 *   node scripts/changed-viz-routes.mjs <base 커밋> [head 커밋]
 *
 * Viz 파일은 다른 글에서도 import되므로 디렉터리 이름이 아니라 import 경로를 따라간다.
 * 공용 Viz 코드나 전역 CSS가 바뀌면 모든 글을 CI에서 재기엔 오래 걸리므로 catalog에서
 * 고르게 표본을 뽑는다. 전수 검사는 `sweep-routes.mjs --catalog`로 따로 한다.
 * 결과는 한 줄에 route 하나씩 stdout으로 쓰고, 판단 근거는 stderr로 쓴다.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { loadPublicArticleCatalog } from "./lib/public-article-catalog.mjs";

const SHARED_SAMPLE_SIZE = 60;
const SHARED_PATHS = [/^src\/components\/viz\//, /^src\/components\/articles\//, /^src\/index\.css$/, /^scripts\/sweep-routes\.mjs$/];
const ARTICLE_ROOT = "src/pages/articles/";
const IMPORT_PATTERN = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

const [base, head = "HEAD"] = process.argv.slice(2);
if (!base) {
  console.error("사용법: node scripts/changed-viz-routes.mjs <base 커밋> [head 커밋]");
  process.exit(2);
}

const changed = execFileSync("git", ["diff", "--name-only", "--diff-filter=d", base, head], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

function resolveImport(from, specifier) {
  let target;
  if (specifier.startsWith("@/")) target = path.join("src", specifier.slice(2));
  else if (specifier.startsWith(".")) target = path.join(path.dirname(from), specifier);
  else return null;
  for (const candidate of [target, `${target}.tsx`, `${target}.ts`, path.join(target, "index.tsx"), path.join(target, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate.split(path.sep).join("/");
  }
  return null;
}

/** 글 entry에서 닿는 글 소스 전체. 공용 컴포넌트는 표본 규칙이 맡으므로 따라가지 않는다. */
function reachableArticleFiles(entry) {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    for (const match of fs.readFileSync(file, "utf8").matchAll(IMPORT_PATTERN)) {
      const target = resolveImport(file, match[1]);
      if (target?.startsWith(ARTICLE_ROOT) && !target.includes("/codebase/")) stack.push(target);
    }
  }
  return seen;
}

const catalog = await loadPublicArticleCatalog();
const routes = new Set();
const changedArticleFiles = new Set(changed.filter((file) => file.startsWith(ARTICLE_ROOT) && /\.tsx?$/.test(file)));
if (changedArticleFiles.size) {
  for (const article of catalog) {
    if (!article.sourcePath) continue;
    const entry = path.relative(process.cwd(), path.resolve(article.sourcePath)).split(path.sep).join("/");
    if (!fs.existsSync(entry)) continue;
    for (const file of reachableArticleFiles(entry)) {
      if (changedArticleFiles.has(file)) {
        routes.add(article.route);
        break;
      }
    }
  }
}
console.error(`바뀐 글 소스 ${changedArticleFiles.size}개 → route ${routes.size}개`);

const sharedChange = changed.find((file) => SHARED_PATHS.some((pattern) => pattern.test(file)));
if (sharedChange) {
  const step = Math.max(1, Math.floor(catalog.length / SHARED_SAMPLE_SIZE));
  catalog.filter((_, index) => index % step === 0).forEach((article) => routes.add(article.route));
  console.error(`공용 코드 변경(${sharedChange}): catalog에서 ${step}개마다 표본 추가 → route ${routes.size}개`);
}

for (const route of [...routes].sort()) console.log(route);
