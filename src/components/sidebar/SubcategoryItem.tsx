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
  const isActive = hasChildren
    ? sub.children!.some((c) => allArticles.some((a) => a.subcategory === c.slug && a.slug === activeArticle))
    : articles.some((a) => a.slug === activeArticle);
  const open = isExpanded || isActive;

  return (
    <div className="mb-0.5">
      {hasChildren ? (
        <button
          onClick={() => onToggle(key)}
          className={cn(
            'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer',
            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
          )}
        >
          <span>{sub.name}</span>
          <svg className={cn('h-3 w-3 text-muted-foreground/60 transition-transform duration-200', open && 'rotate-90')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <Link to={`/${categorySlug}?sub=${sub.slug}`}
          className={cn(
            'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
            isActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
          )}>
          {sub.name}
        </Link>
      )}
      {hasChildren && open && (
        <div className="ml-2 border-l border-border/50 pl-2 mt-0.5">
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
