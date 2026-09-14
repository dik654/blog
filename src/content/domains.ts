/**
 * 대분류(domain)는 카테고리 위의 한 층입니다. 카테고리가 늘어날수록 상단
 * 네비게이션이 평면 목록으로 길어지기만 하는 문제를 막고, 성격이 다른 학습
 * 영역(컴퓨터 기술 / 금융 / …)을 독자가 먼저 고르게 합니다.
 *
 * 이 파일은 다른 content 모듈을 import 하지 않습니다. 공개 href를 만드는
 * `src/lib/routes.ts`가 여기만 의존하게 해 순환 import를 막기 위해서입니다.
 */

export type DomainSlug = "cs" | "finance";

export interface DomainMeta {
  slug: DomainSlug;
  name: string;
  description: string;
}

/** 상단 네비게이션과 홈 화면에 나타나는 순서입니다. */
export const DOMAIN_META: readonly DomainMeta[] = [
  {
    slug: "cs",
    name: "CS",
    description:
      "AI·블록체인·암호학·분산 시스템·하드웨어까지 컴퓨터 기술을 코드베이스 단위로 추적합니다.",
  },
  {
    slug: "finance",
    name: "금융",
    description:
      "돈과 이자에서 시작해 은행·중앙은행·시장·규제까지 금융 체계를 기초부터 쌓습니다.",
  },
];

/**
 * 카테고리가 속한 대분류입니다. 공개 URL의 첫 세그먼트를 정하므로 새 카테고리를
 * 추가할 때 여기에도 반드시 등록해야 합니다.
 */
export const CATEGORY_DOMAIN: Readonly<Record<string, DomainSlug>> = {
  ai: "cs",
  blockchain: "cs",
  crypto: "cs",
  p2p: "cs",
  gpu: "cs",
  tee: "cs",
  "isms-aml": "cs",
  saas: "cs",
  money: "finance",
  banking: "finance",
  markets: "finance",
  risk: "finance",
};

/**
 * 등록되지 않은 카테고리는 기본 대분류로 보내지 않고 즉시 드러냅니다. 조용히
 * 잘못된 URL을 만들면 배포 뒤에야 404로 발견되기 때문입니다.
 */
export function domainOf(categorySlug: string): DomainSlug {
  const domain = CATEGORY_DOMAIN[categorySlug];
  if (!domain) {
    throw new Error(
      `대분류가 등록되지 않은 카테고리입니다: ${categorySlug} (src/content/domains.ts의 CATEGORY_DOMAIN에 추가하세요)`,
    );
  }
  return domain;
}
