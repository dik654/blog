export type { Section, Article, Subcategory, Category } from './types';

import ai from './ai';
import blockchain from './blockchain';
import crypto from './crypto';
import p2p from './p2p';
import gpu from './gpu';
import tee from './tee';
import ismsAml from './isms-aml';
import ops from './ops';
import systems from './systems';

// 정식 도메인 카테고리만 블로그에 노출한다. 검증 실천은 코어로 이동했고,
// 자동 미러 노트는 공개 탐색 목록에서 제외한다.
export const categories = [
  systems,
  gpu,
  crypto,
  p2p,
  ai,
  blockchain,
  tee,
  ops,
  ismsAml,
];

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
