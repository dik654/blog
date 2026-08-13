import type { Article, Category, Subcategory } from "./types";

export function findSubcategory(
  subcategories: readonly Subcategory[],
  slug: string,
): Subcategory | null {
  for (const subcategory of subcategories) {
    if (subcategory.slug === slug) return subcategory;
    if (subcategory.children) {
      const found = findSubcategory(subcategory.children, slug);
      if (found) return found;
    }
  }
  return null;
}

function collectSubcategorySlugs(
  subcategory: Subcategory,
  slugs: Set<string>,
): Set<string> {
  slugs.add(subcategory.slug);
  subcategory.children?.forEach((child) =>
    collectSubcategorySlugs(child, slugs),
  );
  return slugs;
}

export function getArticlesInSubcategory(
  category: Pick<Category, "articles">,
  subcategory: Subcategory,
): Article[] {
  const slugs = collectSubcategorySlugs(subcategory, new Set<string>());
  return category.articles.filter((article) => slugs.has(article.subcategory));
}

export function getDirectArticlesInSubcategory(
  category: Pick<Category, "articles">,
  subcategory: Subcategory,
): Article[] {
  return category.articles.filter(
    (article) => article.subcategory === subcategory.slug,
  );
}

export function articleBelongsToSubcategory(
  article: Article,
  subcategory: Subcategory,
): boolean {
  return collectSubcategorySlugs(subcategory, new Set<string>()).has(
    article.subcategory,
  );
}

export function getSubcategoryHref(
  category: Pick<Category, "slug" | "articles">,
  subcategory: Subcategory,
): string {
  const articles = getArticlesInSubcategory(category, subcategory);
  if (articles.length === 1) {
    return `/${category.slug}/${articles[0].slug}`;
  }
  return `/${category.slug}?sub=${subcategory.slug}`;
}

export function countArticlesInSubcategory(
  category: Category,
  subcategory: Subcategory,
): number {
  return getArticlesInSubcategory(category, subcategory).length;
}
