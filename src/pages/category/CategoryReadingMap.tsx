import { Link } from "react-router-dom";
import type { Category } from "@/content";
import { ARTICLE_EVIDENCE } from "@/content/article-evidence";
import { CATEGORY_READING_PATHS } from "@/content/category-reading-paths";
import {
  findSubcategory,
  getArticlesInSubcategory,
  getSubcategoryHref,
} from "@/content/subcategory-navigation";
import {
  ARTICLE_INTENT_DESCRIPTIONS,
  inferArticleIntent,
} from "@/content/article-guidance";

function isPaperEvidence(kind: string) {
  return kind.includes("논문") || kind.includes("연구");
}

export default function CategoryReadingMap({
  category,
}: {
  category: Category;
}) {
  const path = CATEGORY_READING_PATHS[category.slug];
  if (!path) return null;

  const featured = path.featuredArticles
    .map((slug) => category.articles.find((article) => article.slug === slug))
    .filter((article) => article !== undefined);

  return (
    <section
      className="mb-10 overflow-hidden rounded-xl border border-border/70 bg-card"
      aria-label={`${category.name} 탑다운 학습 지도`}
    >
      <div className="border-b border-border/60 bg-primary/[0.035] px-5 py-5 sm:px-6">
        <p className="text-xs font-black tracking-[0.14em] text-primary">
          TOP-DOWN MAP
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          {path.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/70">
          {path.description}
        </p>
      </div>

      <ol className="space-y-3 p-4 sm:p-5">
        {path.stages.map((stage) => {
          const entries = stage.subcategories
            .map((slug) => findSubcategory(category.subcategories, slug))
            .filter((subcategory) => subcategory !== null);

          return (
            <li
              key={stage.eyebrow}
              className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-muted/15 p-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start"
            >
              <div>
                <span className="inline-flex rounded-lg bg-primary px-2.5 py-1 text-xs font-black tracking-[0.08em] text-primary-foreground">
                  {stage.eyebrow}
                </span>
                <h3 className="mt-2 text-sm font-bold leading-6 text-foreground">
                  {stage.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {stage.description}
                </p>
              </div>

              <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((subcategory) => {
                  const articles = getArticlesInSubcategory(
                    category,
                    subcategory,
                  );
                  return (
                    <Link
                      key={subcategory.slug}
                      to={getSubcategoryHref(category, subcategory)}
                      className="group min-w-0 rounded-xl border border-border/70 bg-background/80 px-3 py-2.5 transition-colors hover:border-primary/35 hover:bg-primary/[0.04]"
                    >
                      <span className="block text-xs font-bold text-foreground group-hover:text-primary">
                        {subcategory.name} →
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {articles.length === 1
                          ? "단일 가이드로 바로 이동"
                          : `${articles.length}개 글 · 개념에서 세부 구현 순서`}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {featured.length > 0 && (
        <div className="border-t border-border/60 bg-muted/10 px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                원 논문·테크 리포트에서 시작하는 글
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                제목을 열기 전에 글의 역할과 연결된 원천 수를 확인할 수
                있습니다.
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {featured.length}개 엄선
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {featured.map((article) => {
              const evidence =
                ARTICLE_EVIDENCE[`${category.slug}/${article.slug}`] ?? [];
              const paperCount = evidence.filter((item) =>
                isPaperEvidence(item.kind),
              ).length;
              const intent = inferArticleIntent(article);
              return (
                <Link
                  key={article.slug}
                  to={`/${category.slug}/${article.slug}`}
                  className="group rounded-xl border border-border/70 bg-background/80 p-3 transition-colors hover:border-primary/35 hover:bg-primary/[0.04]"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-violet-500/10 px-2 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
                      {intent}
                    </span>
                    {paperCount > 0 && (
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                        원 논문 {paperCount}
                      </span>
                    )}
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                      근거 {evidence.length}
                    </span>
                  </div>
                  <strong className="mt-2 block text-sm leading-6 text-foreground group-hover:text-primary">
                    {article.title} →
                  </strong>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {ARTICLE_INTENT_DESCRIPTIONS[intent]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
