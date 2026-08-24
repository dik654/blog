import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

for (const { route } of catalog) {
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

// 알 수 없는 경로도 앱의 NotFound 화면까지 도달하게 하되, 알려진 공개
// 경로는 위의 실제 index.html이 처리하므로 HTTP 200으로 응답한다.
await fs.copyFile(sourceIndex, path.join(distRoot, "404.html"));

console.log(
  `정적 public route ${routes.size.toLocaleString("en-US")}개와 404 fallback을 생성했습니다.`,
);
