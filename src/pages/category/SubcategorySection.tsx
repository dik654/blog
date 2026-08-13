import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Article, Subcategory } from "@/content";
import ArticleCard from "./ArticleCard";

interface Props {
  subcategory: Subcategory;
  articles: Article[];
  allArticles: Article[];
  categorySlug: string;
  isExpanded: boolean;
  expanded: Record<string, boolean>;
  onToggle: (slug: string) => void;
  depth?: number;
}

export default function SubcategorySection({
  subcategory: sub,
  articles,
  allArticles,
  categorySlug,
  isExpanded,
  expanded,
  onToggle,
  depth = 0,
}: Props) {
  const hasChildren = sub.children && sub.children.length > 0;
  const onlyArticle = !hasChildren && articles.length === 1 ? articles[0] : undefined;

  return (
    <section className={depth === 0 ? "mb-4" : "mb-2 ml-4"}>
      {onlyArticle ? (
        <Link
          to={`/${categorySlug}/${onlyArticle.slug}`}
          className="flex w-full items-center justify-between rounded-lg border-b px-1 py-3 transition-colors hover:bg-accent/30"
        >
          <h2
            className={cn(
              "font-semibold uppercase tracking-wider text-muted-foreground",
              depth === 0 ? "text-sm" : "text-xs",
            )}
          >
            {sub.name}
          </h2>
          <span className="flex items-center gap-2 text-xs font-semibold text-primary">
            바로 읽기
            <span aria-hidden="true">→</span>
          </span>
        </Link>
      ) : (
        <button
          onClick={() => onToggle(sub.slug)}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border-b px-1 py-3 transition-colors hover:bg-accent/30"
        >
        <h2
          className={cn(
            "font-semibold uppercase tracking-wider text-muted-foreground",
            depth === 0 ? "text-sm" : "text-xs",
          )}
        >
          {sub.name}
        </h2>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {!hasChildren && <>{articles.length}개의 글</>}
          <svg
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              isExpanded && "rotate-90",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
        </button>
      )}

      <AnimatePresence initial={false}>
        {!onlyArticle && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {hasChildren ? (
              <div className="pt-2">
                {sub.children!.map((child) => (
                  <SubcategorySection
                    key={child.slug}
                    subcategory={child}
                    articles={allArticles.filter(
                      (article) => article.subcategory === child.slug,
                    )}
                    allArticles={allArticles}
                    categorySlug={categorySlug}
                    isExpanded={expanded[child.slug] ?? false}
                    expanded={expanded}
                    onToggle={onToggle}
                    depth={depth + 1}
                  />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <p className="px-1 py-3 text-sm text-muted-foreground/60">
                아직 작성된 글이 없습니다.
              </p>
            ) : (
              <div className="space-y-2 pb-2 pt-3">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    categorySlug={categorySlug}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
