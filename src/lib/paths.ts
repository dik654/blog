export const LAB_ROOT = '/lab';
export const BLOG_ROOT = `${LAB_ROOT}/blog`;
export const CORE_ROOT = `${LAB_ROOT}/core`;

export function categoryPath(categorySlug: string) {
  return `${BLOG_ROOT}/${categorySlug}`;
}

export function articlePath(categorySlug: string, articleSlug: string) {
  return `${categoryPath(categorySlug)}/${articleSlug}`;
}

export function subcategoryPath(categorySlug: string, subcategorySlug: string) {
  return `${categoryPath(categorySlug)}?sub=${subcategorySlug}`;
}

export function coreTrackPath(trackSlug: string) {
  return `${CORE_ROOT}/${trackSlug}`;
}

export function coreItemPath(trackSlug: string, itemSlug: string) {
  return `${coreTrackPath(trackSlug)}/${itemSlug}`;
}
