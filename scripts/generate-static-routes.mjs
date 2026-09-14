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

// 알 수 없는 경로도 앱의 NotFound 화면까지 도달하게 하되, 알려진 공개
// 경로는 위의 실제 index.html이 처리하므로 HTTP 200으로 응답한다.
await fs.copyFile(sourceIndex, path.join(distRoot, "404.html"));

console.log(
  `정적 public route ${routes.size.toLocaleString("en-US")}개와 404 fallback을 생성했습니다.`,
);
