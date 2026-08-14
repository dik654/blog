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
  ]).filter((link) => link.href !== `/${routeKey}`);
  const learningScope = learning?.introducedHere
    .slice(0, 5)
    .map((concept) => getKnowledgeConcept(concept.id).label)
    .join(" · ");
  const scopeDescription = (
    learningScope ?? subcategory?.description ?? category.description
  ).replace(/[.!?]\s*$/, "");
  const firstStage = flow?.nodes[0]?.label;
  const lastStage = flow?.nodes.at(-1)?.label;

  return (
    <section
      className="not-prose mb-8 space-y-4 border-b border-border/70 pb-7"
      aria-label="이 글을 읽는 방법"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {intent}
        </span>
        <span className="text-xs text-muted-foreground">
          {category.name} · {subcategory?.name ?? article.subcategory}
        </span>
      </div>

      <div className="max-w-3xl">
        <p className="text-lg font-black leading-7 text-foreground sm:text-xl">
          {flow?.question ?? `${article.title}에서 무엇을 먼저 봐야 할까요?`}
        </p>
        <p className="mt-2 text-sm leading-7 text-foreground/75">
          {learning ? (
            <>
              위의 장면별 수업에서 새 용어를 하나씩 확인했습니다. 이제 이 글이
              다루는 범위와 연결 글을 구분한 뒤 실제 본문을 처음부터 읽습니다.
              다 읽은 뒤에는 넓은 용어 카드와 연습문제로 이해를 확인합니다.
            </>
          ) : firstStage && lastStage ? (
            <>
              이 질문에 답하려면 먼저 <strong>{firstStage}</strong>부터 살펴본
              뒤, 핵심 동작을 따라 <strong>{lastStage}</strong>까지 범위를
              넓혀야 합니다. 아래 지도에서 전체 순서를 먼저 확인한 다음, 필요한
              섹션부터 자세히 읽어도 흐름을 놓치지 않습니다.
            </>
          ) : (
            <>
              먼저 배경과 용어를 잡고, 핵심 동작을 따라 구현·운영상의 판단으로
              범위를 넓혀 갑니다.
            </>
          )}
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
        <p className="text-xs leading-5 text-foreground/75">
          <strong className="text-foreground">다루는 범위:</strong>{" "}
          {scopeDescription}. 이 글은 {ARTICLE_INTENT_DESCRIPTIONS[intent]}이며,
          공통 정의는 연결 글에 맡기고 이 주제에서 필요한 판단과 흐름에
          집중합니다.
        </p>
        {effectiveBeginnerStart &&
          !learning?.entryLevel &&
          effectiveBeginnerStart.href !== `/${routeKey}` && (
          <Link
            to={effectiveBeginnerStart.href}
            className="mt-3 block rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 transition-colors hover:bg-primary/10"
          >
            <span className="block text-xs font-bold text-primary">
              처음이라면 먼저: {effectiveBeginnerStart.label} →
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {effectiveBeginnerStart.reason}
            </span>
          </Link>
        )}
      </div>

      {reuseLinks.length > 0 && (
        <div className="min-w-0 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
            이 글과 역할을 나누는 연결 글
          </p>
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
            {reuseLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="min-w-0 rounded-lg bg-background/70 px-3 py-2 text-xs transition-colors hover:bg-background"
              >
                <span className="block break-words font-semibold text-foreground">
                  {link.label} →
                </span>
                <span className="mt-0.5 block break-words text-xs leading-5 text-muted-foreground">
                  {link.reason}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
