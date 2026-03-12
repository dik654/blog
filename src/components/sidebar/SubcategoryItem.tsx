import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Article, Subcategory } from '@/content';

interface Props {
  categorySlug: string;
  subcategory: Subcategory;
  articles: Article[];
  allArticles: Article[];
  isExpanded: boolean;
  activeArticle?: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export default function SubcategoryItem({
  categorySlug,
  subcategory: sub,
  articles,
  allArticles,
  isExpanded,
  activeArticle,
  expanded,
  onToggle,
}: Props) {
  const hasChildren = sub.children && sub.children.length > 0;
  const key = `${categorySlug}/${sub.slug}`;

  if (hasChildren) {
    return (
      <div className="mb-0.5">
        <button
          onClick={() => onToggle(key)}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <svg
            className={cn(
              'h-3 w-3 shrink-0 transition-transform duration-200',
              isExpanded && 'rotate-90',
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {sub.name}
        </button>
        {isExpanded && (
          <div className="ml-3 border-l border-border pl-2 mt-0.5">
            {sub.children!.map((child) => (
              <SubcategoryItem
                key={child.slug}
                categorySlug={categorySlug}
                subcategory={child}
                articles={allArticles.filter((a) => a.subcategory === child.slug)}
                allArticles={allArticles}
                isExpanded={expanded[`${categorySlug}/${child.slug}`] ?? false}
                activeArticle={activeArticle}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-0.5">
      <Link
        to={`/${categorySlug}?sub=${sub.slug}`}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
      >
        {sub.name}
        <span className="text-muted-foreground/60">({articles.length})</span>
      </Link>
    </div>
  );
}
