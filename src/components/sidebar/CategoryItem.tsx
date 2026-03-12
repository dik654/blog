import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Category } from '@/content';
import SubcategoryItem from './SubcategoryItem';

interface Props {
  category: Category;
  isActive: boolean;
  isExpanded: boolean;
  activeArticle?: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export default function CategoryItem({
  category: cat,
  isActive,
  isExpanded,
  activeArticle,
  expanded,
  onToggle,
}: Props) {
  return (
    <div className="mb-1">
      <button
        onClick={() => onToggle(cat.slug)}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-foreground hover:bg-accent/50',
        )}
      >
        <Link
          to={`/${cat.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-left"
        >
          {cat.name}
        </Link>
        <span className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{cat.articles.length}</span>
          <svg
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
              isExpanded && 'rotate-90',
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {isExpanded && (
        <div className="ml-2 border-l border-border pl-2 mt-1">
          {cat.subcategories.map((sub) => (
            <SubcategoryItem
              key={sub.slug}
              categorySlug={cat.slug}
              subcategory={sub}
              articles={cat.articles.filter((a) => a.subcategory === sub.slug)}
              allArticles={cat.articles}
              isExpanded={expanded[`${cat.slug}/${sub.slug}`] ?? false}
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
