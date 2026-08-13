import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Article, Subcategory } from "@/content";
import { ARTICLE_EVIDENCE } from "@/content/article-evidence";
import {
  articleBelongsToSubcategory,
  getSubcategoryHref,
} from "@/content/subcategory-navigation";

interface Props {
  categorySlug: string;
  subcategory: Subcategory;
  allArticles: Article[];
  isExpanded: boolean;
  activeArticle?: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string) => void;
  compact?: boolean;
}

function hasPaperEvidence(categorySlug: string, articleSlug: string) {
  return (ARTICLE_EVIDENCE[`${categorySlug}/${articleSlug}`] ?? []).some(
    (item) => item.kind.includes("논문") || item.kind.includes("연구"),
  );
}

export default function SubcategoryItem({
  categorySlug,
  subcategory: sub,
  allArticles,
  isExpanded,
  activeArticle,
  expanded,
  onToggle,
  compact = false,
}: Props) {
  const hasChildren = Boolean(sub.children?.length);
  const groupedArticles = allArticles.filter((article) =>
    articleBelongsToSubcategory(article, sub),
  );
  const directArticles = allArticles.filter(
    (article) => article.subcategory === sub.slug,
  );
  const articlesHere = hasChildren ? directArticles : groupedArticles;
  const onlyArticle =
    groupedArticles.length === 1 ? groupedArticles[0] : undefined;
  const key = `${categorySlug}/${sub.slug}`;
  const isActive = groupedArticles.some(
    (article) => article.slug === activeArticle,
  );
  const open = isExpanded || isActive;
  const hasExpandableContent = hasChildren || articlesHere.length > 0;
  const rowClass = compact ? "px-2 py-1.5" : "px-2 py-1.5";

  if (onlyArticle) {
    return (
      <div className="mb-0.5">
        <Link
          to={`/${categorySlug}/${onlyArticle.slug}`}
          aria-current={activeArticle === onlyArticle.slug ? "page" : undefined}
          className={cn(
            "group flex w-full min-w-0 items-center gap-2 rounded-lg text-xs font-medium transition-colors",
            rowClass,
            activeArticle === onlyArticle.slug
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              activeArticle === onlyArticle.slug
                ? "bg-primary"
                : "bg-border group-hover:bg-primary/50",
            )}
          />
          <span className="min-w-0 flex-1 truncate">{sub.name}</span>
          <span className="shrink-0 text-[9px] font-bold text-primary/70">
            읽기 →
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-0.5 min-w-0">
      <div
        className={cn(
          "group flex min-w-0 items-center rounded-lg transition-colors",
          isActive
            ? "bg-accent/75 text-foreground"
            : "text-muted-foreground hover:bg-accent/45 hover:text-foreground",
        )}
      >
        <Link
          to={getSubcategoryHref(
            { slug: categorySlug, articles: allArticles },
            sub,
          )}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold",
            rowClass,
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
              isActive ? "bg-primary" : "bg-border group-hover:bg-primary/50",
            )}
          />
          <span className="min-w-0 flex-1 truncate">{sub.name}</span>
          <span className="shrink-0 text-[9px] font-bold tabular-nums text-muted-foreground/70">
            {groupedArticles.length}
          </span>
        </Link>
        {hasExpandableContent && (
          <button
            type="button"
            onClick={() => onToggle(key)}
            aria-label={`${sub.name} 글 목록 ${open ? "접기" : "펼치기"}`}
            aria-expanded={open}
            className="mr-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-background/80"
          >
            <svg
              className={cn(
                "h-3 w-3 text-muted-foreground/70 transition-transform duration-200",
                open && "rotate-90",
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
          </button>
        )}
      </div>

      {open && (
        <div className="ml-2 mt-0.5 border-l border-border/55 pl-2">
          {sub.children?.map((child) => (
            <SubcategoryItem
              key={child.slug}
              categorySlug={categorySlug}
              subcategory={child}
              allArticles={allArticles}
              isExpanded={expanded[`${categorySlug}/${child.slug}`] ?? false}
              activeArticle={activeArticle}
              expanded={expanded}
              onToggle={onToggle}
              compact={compact}
            />
          ))}

          {articlesHere.length > 0 && (
            <div className="space-y-0.5 py-1">
              {articlesHere.map((article, index) => {
                const active = article.slug === activeArticle;
                const paper = hasPaperEvidence(categorySlug, article.slug);
                return (
                  <Link
                    key={article.slug}
                    to={`/${categorySlug}/${article.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/article flex min-w-0 items-start gap-2 rounded-lg px-2 py-1.5 transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[8px] font-black tabular-nums",
                        active
                          ? "bg-white/18 text-white"
                          : "bg-muted text-muted-foreground group-hover/article:bg-primary/10 group-hover/article:text-primary",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-[10px] font-semibold leading-4">
                        {article.title}
                      </span>
                      {paper && (
                        <span
                          className={cn(
                            "mt-1 inline-flex rounded px-1.5 py-0.5 text-[8px] font-black tracking-[0.08em]",
                            active
                              ? "bg-white/15 text-white"
                              : "bg-violet-500/10 text-violet-600 dark:text-violet-300",
                          )}
                        >
                          PAPER
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
