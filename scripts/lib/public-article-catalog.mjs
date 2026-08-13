import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const ARTICLE_SOURCE_ROOT = path.join("src", "pages", "articles");
const SOURCE_IMPORT_PATTERN =
  /(?:__vite_ssr_dynamic_import__|import)\(\s*["']([^"']+)["']\s*\)/;
const STATIC_IMPORT_PATTERN =
  /(?:import|export)\s+(?:[^"']+?\s+from\s+)?["']([^"']+)["']/g;

function resolveSourceCandidate(base) {
  for (const candidate of [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return path.resolve(candidate);
    }
  }
}

function resolveCatalogSource(root, specifier) {
  const cleanSpecifier = specifier.split(/[?#]/, 1)[0];
  const base = cleanSpecifier.startsWith("/src/")
    ? path.join(root, cleanSpecifier.slice(1))
    : cleanSpecifier.startsWith("@/")
      ? path.join(root, "src", cleanSpecifier.slice(2))
      : undefined;
  return base ? resolveSourceCandidate(base) : undefined;
}

function isArticleSource(root, file) {
  const articleRoot = path.resolve(root, ARTICLE_SOURCE_ROOT);
  const relative = path.relative(articleRoot, file);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

/**
 * Load the public route catalog through the same Vite module graph used by the
 * application. Each catalog component retains its lazy-import source in the
 * SSR transform, so a public route can be paired with its real source without
 * guessing that the route category and source directory have the same name.
 */
export async function loadPublicArticleCatalog({ root = process.cwd() } = {}) {
  const repoRoot = path.resolve(root);
  const server = await createServer({
    root: repoRoot,
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true },
  });

  try {
    const { categories } = await server.ssrLoadModule("/src/content/index.ts");
    const catalog = [];
    const routes = new Set();

    for (const category of categories) {
      for (const article of category.articles) {
        const route = `${category.slug}/${article.slug}`;
        if (routes.has(route)) throw new Error(`중복 public article route: ${route}`);
        routes.add(route);

        const componentSource = Function.prototype.toString.call(article.component);
        const sourceSpecifier = componentSource.match(SOURCE_IMPORT_PATTERN)?.[1];
        if (!sourceSpecifier) {
          throw new Error(`public article source import를 찾을 수 없습니다: ${route}`);
        }
        const sourcePath = resolveCatalogSource(repoRoot, sourceSpecifier);
        if (!sourcePath || !isArticleSource(repoRoot, sourcePath)) {
          throw new Error(`public article source가 유효하지 않습니다: ${route} → ${sourceSpecifier}`);
        }

        catalog.push({
          route,
          title: article.title,
          subcategory: article.subcategory,
          sourceSpecifier,
          sourcePath,
        });
      }
    }

    return catalog.sort((a, b) => a.route.localeCompare(b.route));
  } finally {
    await server.close();
  }
}

/** Return the transitive closure of article-local static imports. */
export function collectArticleSourceClosure(entryPath, { root = process.cwd() } = {}) {
  const repoRoot = path.resolve(root);
  const seen = new Set();

  function visit(file) {
    const absolute = path.resolve(file);
    if (seen.has(absolute) || !isArticleSource(repoRoot, absolute) || !fs.existsSync(absolute)) {
      return;
    }
    seen.add(absolute);
    const source = fs.readFileSync(absolute, "utf8");
    for (const match of source.matchAll(STATIC_IMPORT_PATTERN)) {
      if (!match[1].startsWith(".")) continue;
      const imported = resolveSourceCandidate(path.resolve(path.dirname(absolute), match[1]));
      if (imported) visit(imported);
    }
  }

  visit(entryPath);
  return [...seen].sort();
}
