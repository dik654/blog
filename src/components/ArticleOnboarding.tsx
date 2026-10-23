import { Link } from "react-router-dom";
import type { Article, Category, Subcategory } from "@/content";
import {
  ARTICLE_INTENT_DESCRIPTIONS,
  CONCEPT_REUSE,
  getBeginnerStart,
  inferArticleIntent,
  type ConceptFlow,
  type GuidanceLink,
} from "@/content/article-guidance";
import { EDITORIAL_BOUNDARIES } from "@/content/editorial-ownership";
import { ARTICLE_LEARNING } from "@/content/article-learning";
import { getKnowledgeConcept } from "@/content/knowledge-graph";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ArticleScopeMap from "@/components/articles/article-scope-map";
import ArticleConceptViz from "@/components/viz/ArticleConceptViz";
import { hrefForRoute } from "@/lib/routes";

function findSubcategory(
  subcategories: readonly Subcategory[],
  slug: string,
): Subcategory | undefined {
  for (const subcategory of subcategories) {
    if (subcategory.slug === slug) return subcategory;
    const child = subcategory.children
      ? findSubcategory(subcategory.children, slug)
      : undefined;
    if (child) return child;
  }
}

function uniqueLinks(links: readonly GuidanceLink[]): GuidanceLink[] {
  return links.filter(
    (link, index) =>
      links.findIndex((candidate) => candidate.href === link.href) === index,
  );
}

export default function ArticleOnboarding({
  category,
  article,
  flow,
}: {
  category: Category;
  article: Article;
  flow?: ConceptFlow;
}) {
  const intent = inferArticleIntent(article);
  const subcategory = findSubcategory(
    category.subcategories,
    article.subcategory,
  );
  const beginnerStart = getBeginnerStart(category, article);
  const routeKey = `${category.slug}/${article.slug}`;
  const learning = ARTICLE_LEARNING[routeKey];
  const firstPrerequisite = learning?.assumedKnowledge[0];
  const learningStart = firstPrerequisite
    ? {
        href: getKnowledgeConcept(firstPrerequisite.id).canonicalHref,
        label: getKnowledgeConcept(firstPrerequisite.id).label,
        reason: firstPrerequisite.role,
      }
    : undefined;
  const effectiveBeginnerStart = learningStart ?? beginnerStart;
  const boundary =
    EDITORIAL_BOUNDARIES[article.slug as keyof typeof EDITORIAL_BOUNDARIES];
  const reuseLinks = uniqueLinks([
    ...(CONCEPT_REUSE[routeKey] ?? []),
    ...(boundary?.reuses.map((link) => ({
      ...link,
      reason:
        "공통 원리는 이 글에서 다시 정의하지 않고 해당 글의 설명을 사용합니다.",
    })) ?? []),
  ]).filter((link) => link.href !== hrefForRoute(routeKey));
  const learningScope = learning?.introducedHere.slice(0, 5).map((concept) => ({
    label: getKnowledgeConcept(concept.id).label,
    role: concept.role,
  }));
  const fallbackScope = (subcategory?.description ?? category.description).replace(
    /[.!?]\s*$/,
    "",
  );
  const firstScope = learningScope?.[0];
  const lastScope = learningScope?.at(-1);
  const scopePreview =
    firstScope && lastScope
      ? firstScope === lastScope
        ? `${firstScope.label}의 핵심 원리와 적용 경계를 설명합니다.`
        : `${firstScope.label}에서 출발해 ${lastScope.label}까지 순서대로 연결합니다.`
      : `${fallbackScope}의 핵심 흐름과 경계를 설명합니다.`;
  const firstSectionId = article.sections[0]?.id;

  return (
    <section
      className="not-prose mb-8 space-y-4 border-b border-border/70 pb-7"
      aria-label="이 글을 읽는 방법"
    >
      <ArticleScopeMap category={category} article={article} />

      {flow ? (
        <>
          <ArticleConceptViz flow={flow} />
          <p className="max-w-3xl text-sm leading-7 text-foreground/75">
            {learning?.entryNote ??
              "본문을 읽기 전에 이 글이 답하는 질문과 단계 사이의 관계를 먼저 확인합니다."}
          </p>
        </>
      ) : (
        <div
          data-article-quick-start
          className="border-l-2 border-primary/60 bg-muted/15 px-3.5 py-3 sm:px-4"
        >
          <p className="text-[10px] font-bold text-primary">이 글의 출발점</p>
          <p className="mt-1 text-sm font-bold leading-6 text-foreground">
            {learning?.coreIdea ??
              `${fallbackScope}에서 답할 핵심 질문을 먼저 확인합니다.`}
          </p>
          {learning?.entryNote ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {learning.entryNote}
            </p>
          ) : null}
          {firstSectionId ? (
            <a
              href={`#${firstSectionId}`}
              className="mt-2 inline-flex min-h-11 items-center border-b border-primary/35 text-xs font-bold text-primary hover:border-primary"
            >
              첫 설명부터 보기 <span className="ml-1" aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>
      )}

      {!learning &&
        effectiveBeginnerStart &&
        effectiveBeginnerStart.href !== hrefForRoute(routeKey) && (
          <Link
            to={effectiveBeginnerStart.href}
            className="block rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 transition-colors hover:bg-primary/10"
          >
            <span className="block text-xs font-bold text-primary">
              처음이라면 먼저: {effectiveBeginnerStart.label} →
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {effectiveBeginnerStart.reason}
            </span>
          </Link>
        )}

      <ProgressiveDetail
        className="my-0"
        title="이 글은 어디까지 설명하고, 무엇을 연결 글에 맡기나요?"
        preview={scopePreview}
      >
        <p>
          이 글은 {ARTICLE_INTENT_DESCRIPTIONS[intent]}입니다. 핵심 판단에 필요한
          흐름은 본문에서 설명하고, 여러 글에 공통인 정의는 아래 연결 글의 정본
          설명을 사용합니다.
        </p>
        {learningScope && learningScope.length > 0 ? (
          <ol>
            {learningScope.map((concept) => (
              <li key={concept.label}>
                <strong>{concept.label}</strong>
                <span className="mt-1 block text-muted-foreground">
                  {concept.role}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p>{fallbackScope}의 배경·핵심 동작·적용 경계를 차례로 다룹니다.</p>
        )}

        {reuseLinks.length > 0 && (
          <div className="not-prose mt-5 border-t border-border/70 pt-4">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
              이 글과 역할을 나누는 연결 글
            </p>
            <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
              {reuseLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="min-w-0 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs transition-colors hover:bg-muted/40"
                >
                  <span className="block break-words font-semibold text-foreground">
                    {link.label} →
                  </span>
                  <span className="mt-0.5 block break-words leading-5 text-muted-foreground">
                    {link.reason}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </ProgressiveDetail>
    </section>
  );
}
