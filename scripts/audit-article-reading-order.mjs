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
