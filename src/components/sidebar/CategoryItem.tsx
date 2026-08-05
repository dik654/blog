import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/content';
import { getSidebarLearningStages } from '@/content/sidebar-learning-structure';
import SubcategoryItem from './SubcategoryItem';
import { categoryPath } from '@/lib/paths';

interface Props {
  category: Category;
  isActive: boolean;
  isExpanded: boolean;
  activeArticle?: string;
  activeSubcategory?: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string, nextOpen?: boolean) => void;
  onNavigate?: () => void;
}

export default function CategoryItem({
  category: cat,
  isActive,
  isExpanded,
  activeArticle,
  activeSubcategory,
  expanded,
  onToggle,
  onNavigate,
}: Props) {
  const learningStages = getSidebarLearningStages(cat);
  const curriculumStages = learningStages.filter((stage) => stage.role !== 'orient');
  const readingToolStages = learningStages.filter((stage) => stage.role === 'orient');
  const activeArticleSubcategory = cat.articles.find((article) => article.slug === activeArticle)?.subcategory;
  const resolvedActiveSubcategory = activeArticleSubcategory ?? activeSubcategory;
  const activeStage = learningStages.find((stage) => stage.subcategories.some((sub) => {
    const contains = (candidate: typeof sub, slug?: string): boolean => Boolean(slug)
      && (candidate.slug === slug || Boolean(candidate.children?.some((child) => contains(child, slug))));
    return contains(sub, resolvedActiveSubcategory);
  }));
  const roleTone = {
    orient: 'bg-emerald-500',
    map: 'bg-emerald-500',
    target: 'bg-blue-500',
    foundation: 'bg-amber-500',
    build: 'bg-rose-500',
  } as const;

  return (
    <div className="mb-1.5" data-sidebar-category={cat.slug}>
      <div
        className={cn(
          'flex w-full items-center rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'text-accent-foreground'
            : 'text-foreground hover:bg-accent/50',
        )}
      >
        <Link
          to={categoryPath(cat.slug)}
          onClick={onNavigate}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'flex min-h-11 min-w-0 self-stretch flex-1 items-center rounded-md px-3 py-2 text-left',
            isActive && 'bg-accent',
          )}
        >
          <span className="block min-w-0 break-words leading-snug">{cat.name}</span>
        </Link>
        <button
          type="button"
          onClick={() => onToggle(cat.slug)}
          aria-label={`${cat.name} 세부 주제 ${isExpanded ? '접기' : '펼치기'}`}
          aria-expanded={isExpanded}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronRight
            aria-hidden
            className={cn('h-3.5 w-3.5 transition-transform duration-200', isExpanded && 'rotate-90')}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="ml-3 mt-1.5 border-l border-border/80 pl-2" data-sidebar-curriculum={cat.slug}>
          <div className="mb-2 flex items-center justify-between gap-2 px-2 text-xs font-semibold text-muted-foreground">
            <span>CURRICULUM</span>
            <span className="font-mono tabular-nums">{curriculumStages.length} STEPS</span>
          </div>
          {curriculumStages.map((stage) => (
            <section
              key={stage.id}
              data-sidebar-stage={stage.id}
              data-stage-role={stage.role}
              aria-label={`${stage.order} ${stage.label}`}
              className={cn('mb-3 last:mb-1', activeStage?.id === stage.id && 'text-foreground')}
            >
              <div className="mb-1 flex items-center gap-2 px-2">
                <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', roleTone[stage.role])} />
                <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground/60">
                  {stage.order}
                </span>
                <span className={cn('min-w-0 break-words text-xs font-semibold', activeStage?.id === stage.id ? 'text-foreground' : 'text-muted-foreground')}>
                  {stage.label}
                </span>
                <span aria-hidden className="h-px min-w-3 flex-1 bg-border/60" />
              </div>
              {(stage.clusters.length > 0 ? stage.clusters : [{ id: stage.id, label: '', subcategories: stage.subcategories }]).map((cluster) => (
                <div key={cluster.id} className="mb-1.5 last:mb-0">
                  {cluster.label && <div className="px-2 pb-1 pt-1 text-xs font-medium leading-relaxed text-muted-foreground/70">{cluster.label}</div>}
                  {cluster.subcategories.map((sub) => (
                    <SubcategoryItem
                      key={sub.slug}
                      categorySlug={cat.slug}
                      subcategory={sub}
                      articles={cat.articles.filter((a) => a.subcategory === sub.slug)}
                      allArticles={cat.articles}
                      isExpanded={expanded[`${cat.slug}/${sub.slug}`]}
                      activeArticle={activeArticle}
                      activeSubcategory={resolvedActiveSubcategory}
                      expanded={expanded}
                      onToggle={onToggle}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              ))}
            </section>
          ))}
          {readingToolStages.length > 0 && (
            <section className="mt-4 border-t border-border/70 pt-3" data-sidebar-reading-tools aria-label="선택 읽기 도구">
              <div className="mb-1 flex items-center gap-2 px-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-muted-foreground">필요할 때만 여는 읽기 도구</span>
                <span aria-hidden className="h-px min-w-3 flex-1 bg-border/60" />
              </div>
              {readingToolStages.flatMap((stage) => stage.subcategories).map((sub) => (
                <SubcategoryItem
                  key={sub.slug}
                  categorySlug={cat.slug}
                  subcategory={sub}
                  articles={cat.articles.filter((article) => article.subcategory === sub.slug)}
                  allArticles={cat.articles}
                  isExpanded={expanded[`${cat.slug}/${sub.slug}`]}
                  activeArticle={activeArticle}
                  activeSubcategory={resolvedActiveSubcategory}
                  expanded={expanded}
                  onToggle={onToggle}
                  onNavigate={onNavigate}
                />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
