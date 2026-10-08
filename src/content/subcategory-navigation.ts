import type { Article, Category, Subcategory } from "./types";
import { ARTICLE_LEARNING } from "./article-learning";
import { CATEGORY_READING_PATHS } from "./category-reading-paths";
import { SUBCATEGORY_ARTICLE_CURRICULA } from "./article-reading-curricula";
import {
  inferArticleIntent,
  isDeclaredSubcategoryStart,
  type ArticleIntent,
} from "./article-guidance";
import { articleHref, categoryHref } from "@/lib/routes";

const conceptOwner = new Map<string, string>();

for (const [route, contract] of Object.entries(ARTICLE_LEARNING)) {
  for (const concept of contract.introducedHere) {
    if (!conceptOwner.has(concept.id)) conceptOwner.set(concept.id, route);
  }
}

const globalDependencies = new Map<string, Set<string>>();
for (const [route, contract] of Object.entries(ARTICLE_LEARNING)) {
  const dependencies = new Set<string>();
  for (const concept of contract.assumedKnowledge) {
    const owner = conceptOwner.get(concept.id);
    if (owner && owner !== route) dependencies.add(owner);
  }
  globalDependencies.set(route, dependencies);
}

const globalDepthMemo = new Map<string, number>();

function globalLearningDepth(route: string, visiting = new Set<string>()): number {
  const memoized = globalDepthMemo.get(route);
  if (memoized !== undefined) return memoized;
  const contract = ARTICLE_LEARNING[route];
  if (visiting.has(route)) return 0;
  const dependencies = globalDependencies.get(route) ?? new Set<string>();
  if (dependencies.size === 0) {
    const depth = contract?.entryLevel ? 0 : 1;
    globalDepthMemo.set(route, depth);
    return depth;
  }
  const nextVisiting = new Set(visiting).add(route);
  const depth = Math.max(
    1,
    ...[...dependencies].map(
      (dependency) => globalLearningDepth(dependency, nextVisiting) + 1,
    ),
  );
  globalDepthMemo.set(route, depth);
  return depth;
}

const intentRank: Record<ArticleIntent, number> = {
  "개념 지도": 0,
  "논문·프로젝트 해설": 1,
  "구현 추적": 2,
  "비교·선택": 3,
  "사례·실측": 4,
  "운영 가이드": 5,
};

const stageLabels = [
  "입문·측정",
  "기초 원리",
  "핵심 메커니즘",
  "변형·비교",
  "구현 추적",
  "평가·용량",
  "운영·보안",
] as const;

function pedagogicalStage(
  categorySlug: string,
  article: Article,
  intent: ArticleIntent,
): number {
  if (isDeclaredSubcategoryStart(categorySlug, article)) return 0;
  const text = `${article.slug} ${article.title}`.toLowerCase();
  if (/^(options-and-asymmetric-payoffs|swaps-and-credit-risk)$/.test(article.slug)) return 1;
  if (/^(interest-rate-derivatives-from-fra-to-swaptions|currency-hedging-forward-points-and-cross-currency-basis)$/.test(article.slug)) return 2;
  if (/운영|배포|장애|복구|보안|체크리스트|incident|production|operations|runbook/.test(text)) return 6;
  if (/평가|benchmark|capacity|비용|cost|성능 분석|profil/.test(text)) return 5;
  if (/구현|코드|compiler|kernel|runtime|sdk|api|source|내부 구조/.test(text)) return 4;
  if (/greeks|volatility|replication|black.?scholes|ito|hazard|xva|margin|clearing|governance|structured|smile|surface|calibration|yield.?curve|credit.?derivatives/.test(text)) return 3;
  if (/비교|선택|versus|\bvs\b|variant|변형|trade-?off|파생|상품/.test(text)) return 3;
  if (/아키텍처|mechanism|메커니즘|anatomy|실행 경로|동작 원리|pipeline/.test(text)) return 2;
  if (/개요|전체 지도|기초|입문|fundamental|overview|theory|이론|수학|math|용어|개념|metrics-and-slo/.test(text)) return 0;
  return Math.min(intentRank[intent] + 1, 6);
}

export interface ArticleReadingPlacement {
  depth: number;
  intent: ArticleIntent;
  stage: number;
  label: string;
}

export function getArticleReadingPlacement(
  category: Pick<Category, "slug">,
  article: Article,
): ArticleReadingPlacement {
  const route = getRoute(category.slug, article);
  const depth = globalLearningDepth(route);
  const intent = inferArticleIntent(article);
  const stage = pedagogicalStage(category.slug, article, intent);
  const label = isDeclaredSubcategoryStart(category.slug, article)
    ? `시작 글 · 선수 ${depth}단계`
    : `${stageLabels[stage]} · 선수 ${depth}단계`;
  return { depth, intent, stage, label };
}

function getRoute(categorySlug: string, article: Article): string {
  return `${categorySlug}/${article.slug}`;
}

export interface ArticleReadingOrderDiagnostics {
  orderedRoutes: readonly string[];
  dependencies: Readonly<Record<string, readonly string[]>>;
  depthByRoute: Readonly<Record<string, number>>;
  stageByRoute: Readonly<Record<string, number>>;
  intentRankByRoute: Readonly<Record<string, number>>;
  curriculumRankByRoute: Readonly<Record<string, number | null>>;
  cycleRoutes: readonly string[];
}

function getCategoryPathPosition(
  categorySlug: string,
  article: Article,
): { stage: number; group: number } {
  const stages = CATEGORY_READING_PATHS[categorySlug]?.stages ?? [];
  let best: { stage: number; group: number; matchLength: number } | undefined;
  stages.forEach((stage, stageIndex) => {
    stage.subcategories.forEach((subcategory, groupIndex) => {
      if (
        article.subcategory !== subcategory &&
        !article.subcategory.startsWith(`${subcategory}-`)
      ) {
        return;
      }
      if (!best || subcategory.length > best.matchLength) {
        best = { stage: stageIndex, group: groupIndex, matchLength: subcategory.length };
      }
    });
  });
  return {
    stage: best?.stage ?? Number.MAX_SAFE_INTEGER,
    group: best?.group ?? Number.MAX_SAFE_INTEGER,
  };
}

function getCurriculumRanks(
  categorySlug: string,
  articles: readonly Article[],
): Map<string, number> {
  const ranks = new Map<string, number>();
  const subcategories = new Set(articles.map((article) => article.subcategory));
  if (subcategories.size === 1) {
    const [subcategory] = [...subcategories];
    const explicit = SUBCATEGORY_ARTICLE_CURRICULA[subcategory];
    explicit?.forEach((slug, index) => ranks.set(slug, index));

    const featured = CATEGORY_READING_PATHS[categorySlug]?.featuredArticles ?? [];
    const featuredRanks = new Map(featured.map((slug, index) => [slug, index]));
    if (articles.every((article) => featuredRanks.has(article.slug))) {
      articles.forEach((article) => {
        ranks.set(article.slug, featuredRanks.get(article.slug) ?? 0);
      });
    }
  }
  return ranks;
}

/**
 * 같은 listing 안에서 명시한 커리큘럼과 실제 선수 글을 먼저 놓습니다.
 * 긴 핵심 목록은 편집 커리큘럼, 전체가 featured path에 등록된 목록은 그 path,
 * 나머지는 manifest를 tie breaker로 쓰는 stable topological sort입니다.
 */
export function getArticleReadingOrderDiagnostics(
  category: Pick<Category, "slug">,
  articles: readonly Article[],
): ArticleReadingOrderDiagnostics {
  const manifestIndex = new Map(
    articles.map((article, index) => [getRoute(category.slug, article), index]),
  );
  const articleByRoute = new Map(
    articles.map((article) => [getRoute(category.slug, article), article]),
  );
  const depthByRoute = new Map(
    [...manifestIndex.keys()].map((route) => [route, globalLearningDepth(route)]),
  );
  const intentRankByRoute = new Map(
    [...articleByRoute].map(([route, article]) => [
      route,
      intentRank[inferArticleIntent(article)],
    ]),
  );
  const stageByRoute = new Map(
    [...articleByRoute].map(([route, article]) => [
      route,
      pedagogicalStage(category.slug, article, inferArticleIntent(article)),
    ]),
  );
  const startByRoute = new Map(
    [...articleByRoute].map(([route, article]) => [
      route,
      isDeclaredSubcategoryStart(category.slug, article) ? 0 : 1,
    ]),
  );
  const curriculumRanks = getCurriculumRanks(category.slug, articles);
  const curriculumRankByRoute = new Map(
    [...articleByRoute].map(([route, article]) => [
      route,
      curriculumRanks.get(article.slug) ?? null,
    ]),
  );
  const subcategoryCount = new Set(
    [...articleByRoute.values()].map((article) => article.subcategory),
  ).size;
  const pathPositionByRoute = new Map(
    [...articleByRoute].map(([route, article]) => [
      route,
      getCategoryPathPosition(category.slug, article),
    ]),
  );
  const compareReadingPosition = (left: string, right: string) =>
    (subcategoryCount > 1
      ? (pathPositionByRoute.get(left)?.stage ?? Number.MAX_SAFE_INTEGER) -
          (pathPositionByRoute.get(right)?.stage ?? Number.MAX_SAFE_INTEGER) ||
        (pathPositionByRoute.get(left)?.group ?? Number.MAX_SAFE_INTEGER) -
          (pathPositionByRoute.get(right)?.group ?? Number.MAX_SAFE_INTEGER)
      : 0) ||
    (subcategoryCount === 1
      ? (startByRoute.get(left) ?? 1) - (startByRoute.get(right) ?? 1)
      : 0) ||
    (curriculumRankByRoute.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (curriculumRankByRoute.get(right) ?? Number.MAX_SAFE_INTEGER) ||
    (manifestIndex.get(left) ?? 0) - (manifestIndex.get(right) ?? 0);
  const routeSet = new Set(manifestIndex.keys());
  const dependencies = new Map<string, Set<string>>();
  const dependents = new Map<string, Set<string>>();

  for (const article of articles) {
    const route = getRoute(category.slug, article);
    const routeDependencies = new Set<string>();
    for (const owner of globalDependencies.get(route) ?? []) {
      if (owner !== route && routeSet.has(owner)) {
        const dependencyArticle = articleByRoute.get(owner);
        const dependencyRank = dependencyArticle
          ? curriculumRanks.get(dependencyArticle.slug)
          : undefined;
        const articleRank = curriculumRanks.get(article.slug);
        // 명시한 커리큘럼은 편집자가 검토한 학습 경로입니다. 개념 owner를
        // 자동 연결한 edge가 그 경로를 거꾸로 만들면 링크 관계로만 남기고
        // 목록의 hard prerequisite로 사용하지 않습니다.
        if (
          dependencyRank !== undefined &&
          articleRank !== undefined &&
          dependencyRank > articleRank
        ) {
          continue;
        }
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
    .sort(compareReadingPosition);
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
        ready.sort(compareReadingPosition);
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
    depthByRoute: Object.fromEntries(depthByRoute),
    stageByRoute: Object.fromEntries(stageByRoute),
    intentRankByRoute: Object.fromEntries(intentRankByRoute),
    curriculumRankByRoute: Object.fromEntries(curriculumRankByRoute),
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
    return articleHref(category.slug, articles[0].slug);
  }
  return `${categoryHref(category.slug)}?sub=${subcategory.slug}`;
}

export function countArticlesInSubcategory(
  category: Category,
  subcategory: Subcategory,
): number {
  return getArticlesInSubcategory(category, subcategory).length;
}
