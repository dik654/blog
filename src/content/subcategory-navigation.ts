import type { Article, Category, Subcategory } from "./types";
import { ARTICLE_LEARNING } from "./article-learning";
import { CATEGORY_READING_PATHS } from "./category-reading-paths";

const conceptOwner = new Map<string, string>();

for (const [route, contract] of Object.entries(ARTICLE_LEARNING)) {
  for (const concept of contract.introducedHere) {
    if (!conceptOwner.has(concept.id)) conceptOwner.set(concept.id, route);
  }
}

function getRoute(categorySlug: string, article: Article): string {
  return `${categorySlug}/${article.slug}`;
}

export interface ArticleReadingOrderDiagnostics {
  orderedRoutes: readonly string[];
  dependencies: Readonly<Record<string, readonly string[]>>;
  cycleRoutes: readonly string[];
}

/**
 * 같은 listing 안에서 실제 선수 글을 먼저 놓습니다. 서로 무관한 글은 manifest
 * 순서를 유지하므로 사람이 만든 큐레이션을 지우지 않는 stable topological sort입니다.
 */
export function getArticleReadingOrderDiagnostics(
  category: Pick<Category, "slug">,
  articles: readonly Article[],
): ArticleReadingOrderDiagnostics {
  const manifestIndex = new Map(
    articles.map((article, index) => [getRoute(category.slug, article), index]),
  );
  const routeSet = new Set(manifestIndex.keys());
  const dependencies = new Map<string, Set<string>>();
  const dependents = new Map<string, Set<string>>();

  for (const article of articles) {
    const route = getRoute(category.slug, article);
    const routeDependencies = new Set<string>();
    const contract = ARTICLE_LEARNING[route];
    for (const concept of contract?.assumedKnowledge ?? []) {
      const owner = conceptOwner.get(concept.id);
      if (owner && owner !== route && routeSet.has(owner)) {
        routeDependencies.add(owner);
        const outgoing = dependents.get(owner) ?? new Set<string>();
        outgoing.add(route);
        dependents.set(owner, outgoing);
      }
    }
    dependencies.set(route, routeDependencies);
  }

  const declaredDependencies = new Map(
    [...dependencies].map(([route, values]) => [route, new Set(values)]),
  );

  const ready = [...routeSet]
    .filter((route) => dependencies.get(route)?.size === 0)
    .sort(
      (left, right) =>
        (manifestIndex.get(left) ?? 0) - (manifestIndex.get(right) ?? 0),
    );
  const orderedRoutes: string[] = [];

  while (ready.length > 0) {
    const route = ready.shift();
    if (!route) break;
    orderedRoutes.push(route);
    for (const dependent of dependents.get(route) ?? []) {
      const incoming = dependencies.get(dependent);
      incoming?.delete(route);
      if (incoming?.size === 0) {
        ready.push(dependent);
        ready.sort(
          (left, right) =>
            (manifestIndex.get(left) ?? 0) - (manifestIndex.get(right) ?? 0),
        );
      }
    }
  }

  const cycleRoutes = [...routeSet]
    .filter((route) => !orderedRoutes.includes(route))
    .sort(
      (left, right) =>
        (manifestIndex.get(left) ?? 0) - (manifestIndex.get(right) ?? 0),
    );
  const finalRoutes = [...orderedRoutes, ...cycleRoutes];

  return {
    orderedRoutes: finalRoutes,
    dependencies: Object.fromEntries(
      [...declaredDependencies].map(([route, values]) => [route, [...values]]),
    ),
    cycleRoutes,
  };
}

export function sortArticlesForReading(
  category: Pick<Category, "slug">,
  articles: readonly Article[],
): Article[] {
  const byRoute = new Map(
    articles.map((article) => [getRoute(category.slug, article), article]),
  );
  return getArticleReadingOrderDiagnostics(category, articles).orderedRoutes
    .map((route) => byRoute.get(route))
    .filter((article): article is Article => Boolean(article));
}

export function sortSubcategoriesForReading(
  category: Pick<Category, "slug">,
  subcategories: readonly Subcategory[],
): Subcategory[] {
  const stageIndex = new Map<string, number>();
  CATEGORY_READING_PATHS[category.slug]?.stages.forEach((stage, index) => {
    stage.subcategories.forEach((slug) => stageIndex.set(slug, index));
  });
  return [...subcategories].sort((left, right) => {
    const leftStage = stageIndex.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightStage = stageIndex.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
    return leftStage - rightStage;
  });
}

export function findSubcategory(
  subcategories: readonly Subcategory[],
  slug: string,
): Subcategory | null {
  for (const subcategory of subcategories) {
    if (subcategory.slug === slug) return subcategory;
    if (subcategory.children) {
      const found = findSubcategory(subcategory.children, slug);
      if (found) return found;
    }
  }
  return null;
}

function collectSubcategorySlugs(
  subcategory: Subcategory,
  slugs: Set<string>,
): Set<string> {
  slugs.add(subcategory.slug);
  subcategory.children?.forEach((child) =>
    collectSubcategorySlugs(child, slugs),
  );
  return slugs;
}

export function getArticlesInSubcategory(
  category: Pick<Category, "slug" | "articles">,
  subcategory: Subcategory,
): Article[] {
  const slugs = collectSubcategorySlugs(subcategory, new Set<string>());
  return sortArticlesForReading(
    category,
    category.articles.filter((article) => slugs.has(article.subcategory)),
  );
}

export function getDirectArticlesInSubcategory(
  category: Pick<Category, "slug" | "articles">,
  subcategory: Subcategory,
): Article[] {
  return sortArticlesForReading(
    category,
    category.articles.filter(
      (article) => article.subcategory === subcategory.slug,
    ),
  );
}

export function articleBelongsToSubcategory(
  article: Article,
  subcategory: Subcategory,
): boolean {
  return collectSubcategorySlugs(subcategory, new Set<string>()).has(
    article.subcategory,
  );
}

export function getSubcategoryHref(
  category: Pick<Category, "slug" | "articles">,
  subcategory: Subcategory,
): string {
  const articles = getArticlesInSubcategory(category, subcategory);
  if (articles.length === 1) {
    return `/${category.slug}/${articles[0].slug}`;
  }
  return `/${category.slug}?sub=${subcategory.slug}`;
}

export function countArticlesInSubcategory(
  category: Category,
  subcategory: Subcategory,
): number {
  return getArticlesInSubcategory(category, subcategory).length;
}
