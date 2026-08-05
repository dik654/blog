import { Link } from 'react-router-dom';
import { ArrowRight, Files, GitBranch } from 'lucide-react';
import type { Category, Subcategory } from '@/content';
import { isSourceArticle } from '@/content/article-navigation';
import { getTopDownResearchTrack } from '@/content/ai/topdownResearchTracks';
import { subcategoryPath } from '@/lib/paths';

// eslint-disable-next-line react-refresh/only-export-components
export function findSubcategory(subs: Subcategory[], slug: string): Subcategory | null {
  for (const sub of subs) {
    if (sub.slug === slug) return sub;
    if (sub.children) { const f = findSubcategory(sub.children, slug); if (f) return f; }
  }
  return null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function countArticles(cat: Category, sub: Subcategory): number {
  const direct = cat.articles.filter((article) => article.subcategory === sub.slug).length;
  if (sub.children) return direct + sub.children.reduce((sum, child) => sum + countArticles(cat, child), 0);
  return direct;
}

function countArticleRoles(cat: Category, sub: Subcategory): { core: number; source: number } {
  const direct = cat.articles.filter((article) => article.subcategory === sub.slug);
  const own = direct.reduce(
    (counts, article) => {
      counts[isSourceArticle(article) ? 'source' : 'core'] += 1;
      return counts;
    },
    { core: 0, source: 0 },
  );
  return (sub.children ?? []).reduce((counts, child) => {
    const nested = countArticleRoles(cat, child);
    return { core: counts.core + nested.core, source: counts.source + nested.source };
  }, own);
}

// eslint-disable-next-line react-refresh/only-export-components
export function countLeafPaths(sub: Subcategory): number {
  if (!sub.children?.length) return 1;
  return sub.children.reduce((sum, child) => sum + countLeafPaths(child), 0);
}

export default function SubcategoryCard({
  cat,
  sub,
  index,
  displayName,
  eyebrow,
}: {
  cat: Category;
  sub: Subcategory;
  index?: number;
  displayName?: string;
  eyebrow?: string;
}) {
  const count = countArticles(cat, sub);
  const roles = countArticleRoles(cat, sub);
  const hasChildren = Boolean(sub.children?.length);
  const pathCount = countLeafPaths(sub);
  const researchTrack = cat.slug === 'ai' ? getTopDownResearchTrack(sub.slug) : undefined;
  const showOrdinal = typeof index === 'number';
  const showResearchContract = Boolean(researchTrack && researchTrack.subcategories[0] === sub.slug);
  const articleCountLabel = roles.core > 0
    ? `핵심 ${roles.core}${roles.source > 0 ? ` · 원문 ${roles.source}` : ''}`
    : `원문 ${roles.source}`;

  return (
    <Link
      to={subcategoryPath(cat.slug, sub.slug)}
      data-learning-node={sub.slug}
      className={`group grid min-h-[6.75rem] gap-3 border-t border-border py-4 transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        showOrdinal
          ? 'grid-cols-[2rem_minmax(0,1fr)_1.25rem] sm:grid-cols-[2.25rem_minmax(0,1fr)_auto_1.25rem]'
          : 'grid-cols-[minmax(0,1fr)_1.25rem] sm:grid-cols-[minmax(0,1fr)_auto_1.25rem]'
      }`}
    >
      {showOrdinal && (
        <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground/70">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <span className="min-w-0">
        {eyebrow && (
          <span className="mb-1 block font-mono text-xs font-bold text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h3 className="text-sm font-semibold leading-snug group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
          {displayName ?? sub.name}
        </h3>
        <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
          {sub.description ?? `${count}개의 글`}
        </span>
        {showResearchContract && researchTrack && (
          <span
            className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold leading-relaxed text-muted-foreground"
            data-target-route-contract={researchTrack.id}
          >
            <span className="text-emerald-700 dark:text-emerald-300">현재 연구</span>
            <span aria-hidden="true">→</span>
            <span>핵심 {researchTrack.concepts.length}</span>
            <span aria-hidden="true">→</span>
            <span>기반 {researchTrack.foundations.length}</span>
            <span aria-hidden="true">→</span>
            <span className="text-blue-700 dark:text-blue-300">최소 원문</span>
            <span aria-hidden="true">→</span>
            <span>구현 {researchTrack.implementation.length}</span>
          </span>
        )}
        <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:hidden">
          {hasChildren ? <GitBranch aria-hidden className="h-3 w-3" /> : <Files aria-hidden className="h-3 w-3" />}
          {hasChildren ? `${pathCount}개 세부 경로` : articleCountLabel}
        </span>
      </span>
      <span className="hidden self-start whitespace-nowrap text-xs font-medium text-muted-foreground sm:flex sm:items-center sm:gap-1.5">
        {hasChildren ? <GitBranch aria-hidden className="h-3 w-3" /> : <Files aria-hidden className="h-3 w-3" />}
        {hasChildren ? `${pathCount}개 경로` : articleCountLabel}
      </span>
      <ArrowRight aria-hidden className="mt-0.5 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
