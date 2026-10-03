import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createServer } from "vite";

const ARTICLE_SOURCE_ROOT = path.join("src", "pages", "articles");
const SOURCE_IMPORT_PATTERN =
  /(?:__vite_ssr_dynamic_import__|import)\(\s*["']([^"']+)["']\s*\)/;
const sourceExtensions = new Set([".tsx", ".ts", ".jsx", ".js"]);
const importCache = new Map();

function resolveSourceCandidate(base) {
  for (const candidate of [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
    path.join(base, "index.jsx"),
    path.join(base, "index.js"),
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
    const { domainOf } = await server.ssrLoadModule("/src/content/domains.ts");
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
          // 공개 URL은 대분류가 앞에 붙습니다. route는 데이터 식별자로 남습니다.
          publicPath: `${domainOf(category.slug)}/${route}`,
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

function runtimeImports(file, source) {
  const cached = importCache.get(file);
  if (cached?.source === source) return cached.imports;
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = [];
  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      const onlyNamedTypes = !clause?.name && bindings && ts.isNamedImports(bindings)
        && bindings.elements.length > 0 && bindings.elements.every((item) => item.isTypeOnly);
      if (!clause?.isTypeOnly && !onlyNamedTypes && ts.isStringLiteralLike(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && !node.isTypeOnly) {
      const onlyNamedTypes = node.exportClause && ts.isNamedExports(node.exportClause)
        && node.exportClause.elements.length > 0 && node.exportClause.elements.every((item) => item.isTypeOnly);
      if (!onlyNamedTypes && ts.isStringLiteralLike(node.moduleSpecifier)) imports.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
      && node.arguments.length === 1 && ts.isStringLiteralLike(node.arguments[0])) {
      imports.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  importCache.set(file, { source, imports });
  return imports;
}

/**
 * Follow runtime imports within article source roots, including aliases,
 * re-exports and literal lazy imports. Raw source assets and type-only imports
 * are data/type dependencies, not rendered article bodies. Viz audits can add
 * their shared component root without treating all application UI as a Viz.
 */
export function collectArticleSourceClosure(entryPath, {
  root = process.cwd(),
  additionalSourceRoots = [],
} = {}) {
  const repoRoot = path.resolve(root);
  const allowedRoots = [ARTICLE_SOURCE_ROOT, ...additionalSourceRoots].map((dir) => path.resolve(repoRoot, dir));
  const seen = new Set();

  function visit(file) {
    const absolute = path.resolve(file);
    const allowed = allowedRoots.some((dir) => {
      const relative = path.relative(dir, absolute);
      return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
    });
    if (seen.has(absolute) || !allowed || !sourceExtensions.has(path.extname(absolute)) || !fs.existsSync(absolute)) {
      return;
    }
    seen.add(absolute);
    const source = fs.readFileSync(absolute, "utf8");
    for (const specifier of runtimeImports(absolute, source)) {
      if (/[?&](?:raw|url|inline)(?:[=&]|$)/.test(specifier)) continue;
      const clean = specifier.split(/[?#]/, 1)[0];
      const base = clean.startsWith(".") ? path.resolve(path.dirname(absolute), clean)
        : clean.startsWith("@/") ? path.join(repoRoot, "src", clean.slice(2))
        : clean.startsWith("/src/") ? path.join(repoRoot, clean.slice(1))
        : undefined;
      const imported = base && resolveSourceCandidate(base);
      if (imported) visit(imported);
    }
  }

  visit(entryPath);
  return [...seen].sort();
}
