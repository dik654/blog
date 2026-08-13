import { Link } from "react-router-dom";
import type { Category } from "@/content";
import { CATEGORY_READING_PATHS } from "@/content/category-reading-paths";
import { findSubcategory } from "@/content/subcategory-navigation";
import SubcategoryItem from "./SubcategoryItem";

export default function TopDownCategoryNav({
  category,
  activeArticle,
  expanded,
  onToggle,
}: {
  category: Category;
  activeArticle?: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  const path = CATEGORY_READING_PATHS[category.slug];
  if (!path) return null;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-border/65 bg-primary/[0.025]">
      <div className="border-b border-border/55 px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-black text-primary-foreground">
            ↓
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-black tracking-[0.14em] text-primary">
              TOP-DOWN READING
            </p>
            <p className="mt-0.5 text-[10px] font-semibold leading-4 text-foreground/70">
              개념에서 구현·운영 순서
            </p>
          </div>
        </div>
      </div>

      <ol className="space-y-3 px-2 py-3">
        {path.stages.map((stage, stageIndex) => {
          const entries = stage.subcategories
            .map((slug) => findSubcategory(category.subcategories, slug))
            .filter((subcategory) => subcategory !== null);

          return (
            <li key={stage.eyebrow} className="relative pl-6">
              {stageIndex < path.stages.length - 1 && (
                <span className="absolute bottom-[-0.75rem] left-[0.68rem] top-5 w-px bg-border" />
              )}
              <span className="absolute left-0 top-0.5 flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full border border-primary/25 bg-background text-[8px] font-black tabular-nums text-primary">
                {String(stageIndex + 1).padStart(2, "0")}
              </span>
              <div className="mb-1.5 pr-1">
                <p className="text-[10px] font-black leading-4 text-foreground">
                  {stage.title}
                </p>
                <p className="line-clamp-2 text-[9px] leading-4 text-muted-foreground">
                  {stage.description}
                </p>
              </div>
              <div className="space-y-0.5">
                {entries.map((subcategory) => (
                  <SubcategoryItem
                    key={subcategory.slug}
                    categorySlug={category.slug}
                    subcategory={subcategory}
                    allArticles={category.articles}
                    isExpanded={
                      expanded[`${category.slug}/${subcategory.slug}`] ?? false
                    }
                    activeArticle={activeArticle}
                    expanded={expanded}
                    onToggle={onToggle}
                    compact
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      <Link
        to={`/${category.slug}`}
        className="flex items-center justify-between border-t border-border/55 px-3 py-2.5 text-[10px] font-bold text-muted-foreground transition-colors hover:bg-background/70 hover:text-primary"
      >
        전체 학습 지도
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
