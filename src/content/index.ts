export type { Section, Article, Subcategory, Category } from "./types";
export type { DomainSlug, DomainMeta } from "./domains";

import type { Category } from "./types";
import { DOMAIN_META, domainOf, type DomainSlug } from "./domains";
import ai from "./ai";
import blockchain from "./blockchain";
import crypto from "./crypto";
import p2p from "./p2p";
import gpu from "./gpu";
import tee from "./tee";
import ismsAml from "./isms-aml";
import saas from "./saas";
import money from "./money";
import banking from "./banking";
import markets from "./markets";
import risk from "./risk";
import polity from "./polity";
import constitution from "./constitution";
import elections from "./elections";
import governance from "./governance";

export const categories = [
  ai,
  blockchain,
  crypto,
  p2p,
  gpu,
  tee,
  ismsAml,
  saas,
  money,
  banking,
  markets,
  risk,
  polity,
  constitution,
  elections,
  governance,
];

export interface DomainGroup {
  slug: DomainSlug;
  name: string;
  description: string;
  categories: Category[];
}

/**
 * 상단 네비게이션·사이드바·홈이 공유하는 대분류 묶음입니다. 카테고리 순서는
 * 위 `categories` 배열의 큐레이션을 그대로 보존합니다.
 */
export const domains: DomainGroup[] = DOMAIN_META.map((meta) => ({
  ...meta,
  categories: categories.filter(
    (category) => domainOf(category.slug) === meta.slug,
  ),
}));

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
