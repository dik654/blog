import { domainOf } from "@/content/domains";

/**
 * 내부 route key와 공개 href는 서로 다른 문자열입니다.
 *
 *   route key : `ai/flash-attention`      — 데이터의 식별자 (ARTICLE_LEARNING 등의 키)
 *   공개 href : `/cs/ai/flash-attention`  — 브라우저 주소
 *
 * 데이터 키에 대분류를 넣지 않는 이유는 감사 스크립트·학습 계약·topology 판정이
 * 전부 `카테고리/슬러그` 두 조각을 전제로 하기 때문입니다. 변환은 이 파일에서만
 * 합니다.
 */

export function categoryHref(categorySlug: string): string {
  return `/${domainOf(categorySlug)}/${categorySlug}`;
}

export function articleHref(categorySlug: string, articleSlug: string): string {
  return `${categoryHref(categorySlug)}/${articleSlug}`;
}

/** `ai/flash-attention` → `/cs/ai/flash-attention` */
export function hrefForRoute(routeKey: string): string {
  const [categorySlug, articleSlug] = routeKey.split("/");
  return articleHref(categorySlug, articleSlug);
}

/**
 * 글을 가리키는 공개 href에서 route key를 되찾습니다. 대분류가 붙은 세 조각
 * 주소와 대분류를 도입하기 전의 두 조각 주소를 모두 받아들이려고 앞이 아니라
 * 뒤에서 두 조각을 읽습니다. 그래서 대분류 목록을 여기서 다시 알 필요가 없고,
 * 아직 이전되지 않은 링크도 조용히 감사에서 빠지지 않습니다.
 */
export function routeKeyFromHref(href: string): string | undefined {
  const path = href.split(/[#?]/, 1)[0];
  if (!path.startsWith("/")) return undefined;
  const segments = path.slice(1).split("/").filter(Boolean);
  if (segments.length < 2 || segments.length > 3) return undefined;
  return segments.slice(-2).join("/");
}

/** href의 anchor(`#section`)만 떼어 냅니다. 없으면 undefined입니다. */
export function anchorFromHref(href: string): string | undefined {
  const index = href.indexOf("#");
  return index === -1 ? undefined : href.slice(index + 1);
}
