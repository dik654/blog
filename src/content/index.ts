export type { Section, Article, Subcategory, Category } from './types';

import ai from './ai';
import blockchain from './blockchain';
import crypto from './crypto';
import p2p from './p2p';
import gpu from './gpu';
import tee from './tee';

export const categories = [ai, blockchain, crypto, p2p, gpu, tee];

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
