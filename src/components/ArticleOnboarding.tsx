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
              먼저 본문에서 문제와 결론을 한 흐름으로 따라갑니다. 수식·구현
              조건이 필요할 때만 상세 설명을 펼치고, 마지막 연습문제에서 실제로
              설명할 수 있는지 확인하면 됩니다.
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

      {effectiveBeginnerStart &&
        !learning?.entryLevel &&
        effectiveBeginnerStart.href !== `/${routeKey}` && (
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
