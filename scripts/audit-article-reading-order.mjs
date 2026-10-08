import { createServer } from "vite";

const strict = process.argv.includes("--strict");
const server = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});
const failures = [];
let listCount = 0;
let dependencyCount = 0;

function flattenSubcategories(subcategories) {
  return subcategories.flatMap((subcategory) => [
    subcategory,
    ...flattenSubcategories(subcategory.children ?? []),
  ]);
}

try {
  const { categories } = await server.ssrLoadModule("/src/content/index.ts");
  const {
    getArticleReadingOrderDiagnostics,
    getDirectArticlesInSubcategory,
    sortSubcategoriesForReading,
  } = await server.ssrLoadModule("/src/content/subcategory-navigation.ts");
  const { CATEGORY_READING_PATHS } = await server.ssrLoadModule(
    "/src/content/category-reading-paths.ts",
  );
  const { SUBCATEGORY_ARTICLE_CURRICULA } = await server.ssrLoadModule(
    "/src/content/article-reading-curricula.ts",
  );
  const { isDeclaredSubcategoryStart } = await server.ssrLoadModule(
    "/src/content/article-guidance.ts",
  );

  for (const category of categories) {
    const listedSubcategories = sortSubcategoriesForReading(
      category,
      category.subcategories,
    );
    const path = CATEGORY_READING_PATHS[category.slug];
    if (path) {
      const stageBySlug = new Map();
      path.stages.forEach((stage, index) => {
        stage.subcategories.forEach((slug) => stageBySlug.set(slug, index));
      });
      let previousStage = -1;
      for (const subcategory of listedSubcategories) {
        const stage = stageBySlug.get(subcategory.slug);
        if (stage === undefined) continue;
        if (stage < previousStage) {
          failures.push(
            `${category.slug}: 상위 subcategory가 reading path 역순입니다 (${subcategory.slug})`,
          );
        }
        previousStage = stage;
      }
    }

    for (const subcategory of flattenSubcategories(category.subcategories)) {
      const articles = getDirectArticlesInSubcategory(category, subcategory);
      if (articles.length < 2) continue;
      listCount += 1;
      const diagnostics = getArticleReadingOrderDiagnostics(category, articles);
      dependencyCount += Object.values(diagnostics.dependencies).reduce(
        (sum, dependencies) => sum + dependencies.length,
        0,
      );
      if (diagnostics.cycleRoutes.length > 0) {
        failures.push(
          `${category.slug}/${subcategory.slug}: prerequisite cycle (${diagnostics.cycleRoutes.join(", ")})`,
        );
      }
      const position = new Map(
        diagnostics.orderedRoutes.map((route, index) => [route, index]),
      );
      const declaredStart = articles.find((article) =>
        isDeclaredSubcategoryStart(category.slug, article),
      );
      if (
        declaredStart &&
        diagnostics.orderedRoutes[0] !==
          `${category.slug}/${declaredStart.slug}`
      ) {
        failures.push(
          `${category.slug}/${subcategory.slug}: 시작 글이 첫 번째가 아닙니다 (${declaredStart.slug})`,
        );
      }
      const curriculum = SUBCATEGORY_ARTICLE_CURRICULA[subcategory.slug];
      if (curriculum) {
        const duplicateSlugs = curriculum.filter(
          (slug, index) => curriculum.indexOf(slug) !== index,
        );
        if (duplicateSlugs.length > 0) {
          failures.push(
            `${category.slug}/${subcategory.slug}: curriculum 중복 (${[...new Set(duplicateSlugs)].join(", ")})`,
          );
        }
        const articleSlugs = new Set(articles.map((article) => article.slug));
        const stale = curriculum.filter((slug) => !articleSlugs.has(slug));
        const missing = articles
          .map((article) => article.slug)
          .filter((slug) => !curriculum.includes(slug));
        if (stale.length > 0 || missing.length > 0) {
          failures.push(
            `${category.slug}/${subcategory.slug}: curriculum coverage 불일치 (stale=${stale.join(",") || "없음"}; missing=${missing.join(",") || "없음"})`,
          );
        }
        let previous = -1;
        for (const slug of curriculum) {
          const current = position.get(`${category.slug}/${slug}`);
          if (current === undefined) continue;
          if (current < previous) {
            failures.push(
              `${category.slug}/${subcategory.slug}: 명시한 curriculum 역순 (${slug})`,
            );
          }
          previous = current;
        }
      }
      const featured = CATEGORY_READING_PATHS[category.slug]?.featuredArticles ?? [];
      const featuredRank = new Map(featured.map((slug, index) => [slug, index]));
      if (articles.every((article) => featuredRank.has(article.slug))) {
        let previous = -1;
        for (const route of diagnostics.orderedRoutes) {
          const slug = route.slice(category.slug.length + 1);
          const current = featuredRank.get(slug);
          if (current === undefined) continue;
          if (current < previous) {
            failures.push(
              `${category.slug}/${subcategory.slug}: category featured curriculum 역순 (${slug})`,
            );
          }
          previous = current;
        }
      }
      for (const [route, dependencies] of Object.entries(
        diagnostics.dependencies,
      )) {
        for (const dependency of dependencies) {
          if ((position.get(dependency) ?? -1) >= (position.get(route) ?? -1)) {
            failures.push(`${dependency}가 dependent ${route}보다 뒤에 있습니다.`);
          }
        }
      }
    }
  }
} finally {
  await server.close();
}

console.log(
  `읽기 순서 검사: ${listCount}개 article listing · ${dependencyCount}개 prerequisite edge`,
);
if (failures.length > 0) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  if (strict) process.exitCode = 1;
} else {
  console.log("읽기 순서 검사 통과");
}
