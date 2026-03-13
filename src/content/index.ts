export type { Section, Article, Subcategory, Category } from './types';

import ai from './ai';
import blockchain from './blockchain';
import gpu from './gpu';
import ismsAml from './isms-aml';

export const categories = [ai, blockchain, gpu, ismsAml];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getArticle(categorySlug: string, articleSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  const article = category.articles.find((a) => a.slug === articleSlug);
  if (!article) return null;
  return { category, article };
}
