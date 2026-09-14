/**
 * 공개 href(`/cs/ai/flash-attention#online-softmax`)에서 내부 route key
 * (`ai/flash-attention`)와 anchor를 읽습니다.
 *
 * `src/lib/routes.ts`의 `routeKeyFromHref`와 같은 규칙입니다. 감사 스크립트는
 * `@` alias를 해석하지 못해 그 파일을 그대로 import 할 수 없으므로 규칙만
 * 옮겨 왔습니다. 한쪽을 고치면 다른 쪽도 함께 고쳐야 합니다.
 *
 * 대분류를 붙인 세 조각 주소와 대분류 도입 이전의 두 조각 주소를 모두 받도록
 * 앞이 아니라 뒤에서 두 조각을 읽습니다.
 */
export function splitArticleHref(href) {
  if (typeof href !== "string" || !href.startsWith("/")) return undefined;
  const hashIndex = href.indexOf("#");
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const sectionId = hashIndex === -1 ? undefined : href.slice(hashIndex + 1);
  const segments = path.slice(1).split("/").filter(Boolean);
  if (segments.length < 2 || segments.length > 3) return undefined;
  return { route: segments.slice(-2).join("/"), sectionId };
}

export function routeKeyFromHref(href) {
  return splitArticleHref(href)?.route;
}
