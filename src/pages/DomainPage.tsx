import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { domains } from "@/content";
import type { Category } from "@/content";
import { DOMAIN_READING_PATHS } from "@/content/domain-reading-paths";
import { ARTICLE_LEARNING } from "@/content/article-learning";
import { countArticlesInSubcategory } from "@/content/subcategory-navigation";
import { articleHref, categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

function CategoryRow({ category }: { category: Category }) {
  return (
    <Link
      to={categoryHref(category.slug)}
      className="group block min-w-0 rounded-xl border border-border/70 bg-background/80 p-4 transition-colors hover:border-primary/35 hover:bg-primary/[0.04]"
    >
      <div className="flex items-start justify-between gap-3">
        <strong className="text-sm font-bold leading-6 text-foreground group-hover:text-primary">
          {category.name} →
        </strong>
        <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          {category.articles.length}편
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {category.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {category.subcategories.map((sub) => {
          const count = countArticlesInSubcategory(category, sub);
          return (
            <span
              key={sub.slug}
              className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground transition-colors group-hover:border-foreground/15"
            >
              {sub.name}
              {count > 0 && (
                <span className="ml-1 font-medium text-foreground">
                  {count}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

export default function DomainPage({ domain }: { domain: string }) {
  const group = domains.find((item) => item.slug === domain);
  if (!group) {
    return <p className="text-muted-foreground">대분류를 찾을 수 없습니다.</p>;
  }

  const path = DOMAIN_READING_PATHS[group.slug];
  const articleCount = group.categories.reduce(
    (sum, category) => sum + category.articles.length,
    0,
  );
  // 순서대로 읽는 커리큘럼일 때만 전편을 번호와 함께 펼친다.
  const sequence = path?.showFullSequence
    ? group.categories.flatMap((category) =>
        category.articles.map((article) => ({ category, article })),
      )
    : [];

  const staged = new Set(
    path?.stages.flatMap((stage) => stage.categories) ?? [],
  );
  const unstaged = group.categories.filter(
    (category) => !staged.has(category.slug),
  );

  return (
    <div className="max-w-4xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-1 text-2xl font-bold tracking-tight">{group.name}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {group.description}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {group.categories.length}개 분야 · {articleCount}편
        </p>
      </motion.div>

      {path && (
        <section
          className="mb-10 overflow-hidden rounded-xl border border-border/70 bg-card"
          aria-label={`${group.name} 읽는 순서`}
        >
          <div className="border-b border-border/60 bg-primary/[0.035] px-5 py-5 sm:px-6">
            <p className="text-xs font-black tracking-[0.14em] text-primary">
              READING ORDER
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
              const entries = stage.categories
                .map((slug) =>
                  group.categories.find((category) => category.slug === slug),
                )
                .filter((category) => category !== undefined);

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

                  {/* 카테고리가 하나뿐인 단계는 반쪽을 비우지 않고 폭을 다 쓴다. */}
                  <div
                    className={cn(
                      "grid min-w-0 gap-2",
                      entries.length > 1 && "sm:grid-cols-2",
                    )}
                  >
                    {entries.map((category) => (
                      <CategoryRow key={category.slug} category={category} />
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {unstaged.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {path ? "그 밖의 분야" : "분야"}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {unstaged.map((category) => (
              <CategoryRow key={category.slug} category={category} />
            ))}
          </div>
        </section>
      )}

      {sequence.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-1 border-b pb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            처음부터 순서대로
          </h2>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            앞 글이 뒤 글의 선수 개념을 정의합니다. 1편부터 읽으면 바깥에서
            가져와야 하는 지식이 없습니다.
          </p>
          <ol className="space-y-2">
            {sequence.map(({ category, article }, index) => {
              const coreIdea =
                ARTICLE_LEARNING[`${category.slug}/${article.slug}`]?.coreIdea;
              return (
                <li key={`${category.slug}/${article.slug}`}>
                  <Link
                    to={articleHref(category.slug, article.slug)}
                    className="group flex min-w-0 gap-3 rounded-xl border border-border/70 bg-background/80 p-3 transition-colors hover:border-primary/35 hover:bg-primary/[0.04]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <strong className="block text-sm leading-6 text-foreground group-hover:text-primary">
                        {article.title} →
                      </strong>
                      <span className="mt-0.5 block text-xs font-semibold leading-5 text-muted-foreground">
                        {category.name}
                      </span>
                      {coreIdea && (
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {coreIdea}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
