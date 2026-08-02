import type { Article, Category, Subcategory } from './types';
import { getLearningPath } from './learning-paths';

export interface ArticleNavigationStep {
  category: string;
  slug: string;
  label: string;
  question: string;
}

export interface ArticleNavigation {
  kind: 'declared' | 'subcategory';
  pathId?: string;
  title: string;
  description: string;
  steps: ArticleNavigationStep[];
  index: number;
  subcategory?: Subcategory;
}

export function isSourceArticle(article: Article): boolean {
  if (article.curriculumRole) return article.curriculumRole === 'source';
  return /^(paper|research|reference)-/.test(article.slug);
}

export function findSubcategoryBySlug(subcategories: Subcategory[], slug: string): Subcategory | undefined {
  for (const subcategory of subcategories) {
    if (subcategory.slug === slug) return subcategory;
    const nested = findSubcategoryBySlug(subcategory.children ?? [], slug);
    if (nested) return nested;
  }
  return undefined;
}

export function descendantSubcategorySlugs(subcategory: Subcategory): Set<string> {
  const slugs = new Set<string>();
  const visit = (children: Subcategory[]) => {
    for (const child of children) {
      slugs.add(child.slug);
      visit(child.children ?? []);
    }
  };
  visit(subcategory.children ?? []);
  return slugs;
}

export function getArticleNavigation(category: Category, article: Article, preferredLearningPathId?: string): ArticleNavigation {
  const preferred = getLearningPath(preferredLearningPathId);
  const preferredIndex = preferred?.steps.findIndex(
    (step) => step.category === category.slug && step.slug === article.slug,
  ) ?? -1;
  const declared = preferred && preferredIndex >= 0 ? preferred : getLearningPath(article.learningPath);
  const declaredIndex = declared?.steps.findIndex(
    (step) => step.category === category.slug && step.slug === article.slug,
  ) ?? -1;

  if (declared && declaredIndex >= 0) {
    return {
      kind: 'declared',
      pathId: declared.id,
      title: declared.title,
      description: declared.description,
      steps: declared.steps,
      index: declaredIndex,
      subcategory: findSubcategoryBySlug(category.subcategories, article.subcategory),
    };
  }

  const source = isSourceArticle(article);
  const peers = category.articles.filter(
    (candidate) => candidate.subcategory === article.subcategory && isSourceArticle(candidate) === source,
  );
  const subcategory = findSubcategoryBySlug(category.subcategories, article.subcategory);

  return {
    kind: 'subcategory',
    title: `${subcategory?.name ?? '이 주제'} · ${source ? '선택 원문' : '핵심 흐름'}`,
    description: subcategory?.description ?? '같은 주제 안에서 앞뒤 글을 연결한다.',
    steps: peers.map((peer) => ({
      category: category.slug,
      slug: peer.slug,
      label: peer.title,
      question: peer.summary ?? peer.title,
    })),
    index: peers.findIndex((peer) => peer.slug === article.slug),
    subcategory,
  };
}
