import { useParams, useLocation } from "react-router-dom";
import { Suspense, createElement, lazy, useEffect } from "react";
import { categories, getArticle } from "@/content";
import ArticleLayout from "@/components/ArticleLayout";
import ArticleEvidenceRail from "@/components/articles/article-evidence-rail";
import ArticleConceptViz from "@/components/viz/ArticleConceptViz";
import ArticleOnboarding from "@/components/ArticleOnboarding";
import ArticleLearningContractView from "@/components/ArticleLearningContract";
import { ARTICLE_EVIDENCE } from "@/content/article-evidence";
import { ARTICLE_LEARNING } from "@/content/article-learning";
import { getArticleConceptFlow } from "@/content/article-guidance";

const articleComponents = new Map(
  categories.flatMap((category) =>
    category.articles.map(
      (article) =>
        [`${category.slug}/${article.slug}`, lazy(article.component)] as const,
    ),
  ),
);

export default function ArticlePage() {
  const { category, article: articleSlug } = useParams<{
    category: string;
    article: string;
  }>();

  const result = getArticle(category ?? "", articleSlug ?? "");
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return true;
      }
      return false;
    };
    if (tryScroll()) return;
    // lazy 로드 후 재시도
    const timer = setTimeout(tryScroll, 500);
    return () => clearTimeout(timer);
  }, [hash, result]);

  const ArticleComponent = articleComponents.get(
    `${category ?? ""}/${articleSlug ?? ""}`,
  );

  if (!result || !ArticleComponent) {
    return <p className="text-muted-foreground">글을 찾을 수 없습니다.</p>;
  }

  const conceptFlow = getArticleConceptFlow(result.category, result.article);
  const evidence =
    ARTICLE_EVIDENCE[`${result.category.slug}/${result.article.slug}`];
  const learning =
    ARTICLE_LEARNING[`${result.category.slug}/${result.article.slug}`];

  return (
    <ArticleLayout title={result.article.title}>
      <ArticleOnboarding
        category={result.category}
        article={result.article}
        flow={conceptFlow}
      />
      {learning && <ArticleLearningContractView contract={learning} />}
      {conceptFlow && <ArticleConceptViz flow={conceptFlow} />}
      {evidence && (
        <ArticleEvidenceRail items={evidence} paperReadings={learning?.papers} />
      )}
      <Suspense
        fallback={
          <p className="text-muted-foreground animate-pulse">로딩 중...</p>
        }
      >
        {createElement(ArticleComponent)}
      </Suspense>
    </ArticleLayout>
  );
}
