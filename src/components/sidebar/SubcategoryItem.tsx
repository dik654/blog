import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article, Subcategory } from '@/content';
import { subcategoryPath } from '@/lib/paths';

interface Props {
  categorySlug: string;
  subcategory: Subcategory;
  articles: Article[];
  allArticles: Article[];
  isExpanded?: boolean;
  activeArticle?: string;
  activeSubcategory?: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string, nextOpen?: boolean) => void;
  onNavigate?: () => void;
}

function containsSubcategory(subcategory: Subcategory, activeSlug?: string): boolean {
  if (!activeSlug) return false;
  if (subcategory.slug === activeSlug) return true;
  return Boolean(subcategory.children?.some((child) => containsSubcategory(child, activeSlug)));
}

export default function SubcategoryItem({
  categorySlug,
  subcategory: sub,
  articles,
  allArticles,
  isExpanded,
  activeArticle,
  activeSubcategory,
  expanded,
  onToggle,
  onNavigate,
}: Props) {
  const hasChildren = sub.children && sub.children.length > 0;
  const key = `${categorySlug}/${sub.slug}`;
  const activeArticleSubcategory = allArticles.find((article) => article.slug === activeArticle)?.subcategory;
  const containsActiveSubcategory = containsSubcategory(sub, activeSubcategory);
  const containsActiveArticle = containsSubcategory(sub, activeArticleSubcategory);
  const isExactActive = activeSubcategory === sub.slug
    || articles.some((article) => article.slug === activeArticle);
  const isBranchActive = containsActiveSubcategory || containsActiveArticle;
  const open = isExpanded ?? isBranchActive;

  return (
    <div className="mb-0.5">
      {hasChildren ? (
        <div
          className={cn(
            'flex w-full items-stretch rounded-md text-xs font-medium',
            isExactActive
              ? 'text-foreground'
              : isBranchActive
                ? 'text-foreground'
                : 'text-muted-foreground',
          )}
        >
          <Link
            to={subcategoryPath(categorySlug, sub.slug)}
            onClick={onNavigate}
            aria-current={isExactActive ? 'page' : undefined}
            className={cn(
              'flex min-h-11 min-w-0 flex-1 items-center rounded-md px-2 py-2 text-left transition-colors',
              isExactActive
                ? 'bg-accent text-foreground'
                : 'hover:bg-accent/50 hover:text-foreground',
            )}
          >
            <span className="block break-words leading-snug">{sub.name}</span>
          </Link>
          <button
            type="button"
            onClick={() => onToggle(key, !open)}
            aria-label={`${sub.name} 세부 주제 ${open ? '접기' : '펼치기'}`}
            aria-expanded={open}
            className="mr-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
          >
            <ChevronRight
              aria-hidden
              className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-90')}
            />
          </button>
        </div>
      ) : (
        <Link to={subcategoryPath(categorySlug, sub.slug)}
          onClick={onNavigate}
          aria-current={isExactActive ? 'page' : undefined}
          className={cn(
            'flex min-h-11 w-full items-center justify-between rounded-md px-2 py-2 text-xs font-medium transition-colors',
            isExactActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
          )}>
          <span className="min-w-0 break-words leading-snug">{sub.name}</span>
        </Link>
      )}
      {hasChildren && open && (
        <div className="ml-1.5 mt-0.5 border-l border-border/50 pl-1.5">
          {sub.children!.map((child) => (
            <SubcategoryItem
              key={child.slug}
              categorySlug={categorySlug}
              subcategory={child}
              articles={allArticles.filter((a) => a.subcategory === child.slug)}
              allArticles={allArticles}
              isExpanded={expanded[`${categorySlug}/${child.slug}`]}
              activeArticle={activeArticle}
              activeSubcategory={activeSubcategory}
              expanded={expanded}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
