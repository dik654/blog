import { createServer } from "vite";
import fs from "node:fs";

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

function indexSubcategoryDescendants(subcategories, index = new Map()) {
  for (const subcategory of subcategories) {
    const descendants = new Set([subcategory.slug]);
    const childIndex = indexSubcategoryDescendants(
      subcategory.children ?? [],
      index,
    );
    for (const child of subcategory.children ?? []) {
      for (const slug of childIndex.get(child.slug) ?? []) {
        descendants.add(slug);
      }
    }
    index.set(subcategory.slug, descendants);
  }
  return index;
}

function sourceContainsAnchor(href) {
  const [pathname, fragment] = href.split("#");
  if (!fragment) return false;
  const [, domain, slug] = pathname.split("/").filter(Boolean);
  if (!domain || !slug) return false;
  const candidates = [
    `src/pages/articles/${domain}/${slug}.tsx`,
    `src/pages/articles/${domain}/${slug}/index.tsx`,
  ];
  const articleDirectory = `src/pages/articles/${domain}/${slug}`;
  if (fs.existsSync(articleDirectory)) {
    for (const entry of fs.readdirSync(articleDirectory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".tsx")) {
        candidates.push(`${articleDirectory}/${entry.name}`);
      }
    }
  }
  return candidates.some((candidate) => {
    if (!fs.existsSync(candidate)) return false;
    const source = fs.readFileSync(candidate, "utf8");
    return source.includes(`id="${fragment}"`) || source.includes(`id={'${fragment}'}`);
  });
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
  const {
    KUBERNETES_LEARNING_GROUPS,
    KUBERNETES_LEARNING_NODES,
  } = await server.ssrLoadModule("/src/content/kubernetes-learning-tree.ts");

  const cloud = categories.find((category) => category.slug === "cloud");
  if (!cloud) {
    failures.push("cloud category가 없어 Kubernetes 학습 지도를 검사할 수 없습니다.");
  } else {
    const kubernetesSubcategories = new Set([
      "cloud-kubernetes",
      ...KUBERNETES_LEARNING_GROUPS.map((group) => group.slug),
    ]);
    const publicKubernetesArticles = cloud.articles.filter((article) =>
      kubernetesSubcategories.has(article.subcategory),
    );
    const nodeBySlug = new Map(
      KUBERNETES_LEARNING_NODES.map((node) => [node.slug, node]),
    );
    const groupById = new Map(
      KUBERNETES_LEARNING_GROUPS.map((group) => [group.id, group]),
    );
    const missingNodes = publicKubernetesArticles
      .map((article) => article.slug)
      .filter((slug) => !nodeBySlug.has(slug));
    const staleNodes = KUBERNETES_LEARNING_NODES
      .map((node) => node.slug)
      .filter((slug) => !publicKubernetesArticles.some((article) => article.slug === slug));

    if (missingNodes.length > 0 || staleNodes.length > 0) {
      failures.push(
        `Kubernetes concept/practice/reference 분류 불일치 (미분류=${missingNodes.join(",") || "없음"}; 공개 경로 없음=${staleNodes.join(",") || "없음"})`,
      );
    }

    for (const article of publicKubernetesArticles) {
      const node = nodeBySlug.get(article.slug);
      if (!node) continue;
      const group = groupById.get(node.group);
      if (!group) {
        failures.push(`Kubernetes ${article.slug}: 존재하지 않는 부모 영역 (${node.group})`);
        continue;
      }
      if (article.subcategory !== group.slug) {
        failures.push(
          `Kubernetes ${article.slug}: catalog 영역(${article.subcategory})과 학습 지도 영역(${group.slug})이 다릅니다.`,
        );
      }
      if (strict && node.reviewStatus !== "reviewed") {
        failures.push(`Kubernetes ${article.slug}: 공개 경로 검토 상태가 ${node.reviewStatus}입니다.`);
      }
      if (node.track === "concept" && node.id !== "map" && node.parent !== "map") {
        failures.push(`Kubernetes ${article.slug}: 개념 글의 직속 부모 지도가 없습니다.`);
      }
      if (node.track === "practice") {
        if (!node.conceptAnchors || node.conceptAnchors.length === 0) {
          failures.push(`Kubernetes ${article.slug}: 실무 글의 개념 anchor가 없습니다.`);
        }
        for (const conceptAnchor of node.conceptAnchors ?? []) {
          if (!conceptAnchor.href.includes("#")) {
            failures.push(`Kubernetes ${article.slug}: 절 anchor가 아닌 링크 (${conceptAnchor.href})`);
          }
          if (!sourceContainsAnchor(conceptAnchor.href)) {
            failures.push(`Kubernetes ${article.slug}: 실제 본문에 없는 개념 anchor (${conceptAnchor.href})`);
          }
          if (!conceptAnchor.node) continue;
          const anchor = KUBERNETES_LEARNING_NODES.find((candidate) => candidate.id === conceptAnchor.node);
          if (!anchor || anchor.track !== "concept") {
            failures.push(`Kubernetes ${article.slug}: 잘못된 개념 anchor (${conceptAnchor.node})`);
          }
        }
      }
    }
  }

  for (const category of categories) {
    const listedSubcategories = sortSubcategoriesForReading(
      category,
      category.subcategories,
    );
    const path = CATEGORY_READING_PATHS[category.slug];
    if (path) {
      const descendantsBySubcategory = indexSubcategoryDescendants(
        category.subcategories,
      );
      const duplicateFeatured = path.featuredArticles.filter(
        (slug, index) => path.featuredArticles.indexOf(slug) !== index,
      );
      if (duplicateFeatured.length > 0) {
        failures.push(
          `${category.slug}: featured article 중복 (${[...new Set(duplicateFeatured)].join(", ")})`,
        );
      }
      const articleBySlug = new Map(
        category.articles.map((article) => [article.slug, article]),
      );
      for (const slug of path.featuredArticles) {
        const article = articleBySlug.get(slug);
        if (!article) {
          failures.push(`${category.slug}: 존재하지 않는 featured article (${slug})`);
          continue;
        }
        const hasStage = path.stages.some((stage) =>
          stage.subcategories.some(
            (subcategory) => {
              const descendants = descendantsBySubcategory.get(subcategory);
              return (
                descendants?.has(article.subcategory) ||
                article.subcategory === subcategory ||
                article.subcategory.startsWith(`${subcategory}-`)
              );
            },
          ),
        );
        if (!hasStage) {
          failures.push(
            `${category.slug}: featured article의 읽기 단계가 없습니다 (${slug} → ${article.subcategory})`,
          );
        }
      }
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
