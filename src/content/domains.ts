/**
 * 대분류(domain)는 카테고리 위의 한 층입니다. 카테고리가 늘어날수록 상단
 * 네비게이션이 평면 목록으로 길어지기만 하는 문제를 막고, 성격이 다른 학습
 * 영역(컴퓨터 기술 / 금융 / …)을 독자가 먼저 고르게 합니다.
 *
 * 이 파일은 다른 content 모듈을 import 하지 않습니다. 공개 href를 만드는
 * `src/lib/routes.ts`가 여기만 의존하게 해 순환 import를 막기 위해서입니다.
 */

export type DomainSlug =
  | "cs"
  | "economics"
  | "finance"
  | "politics"
  | "law"
  | "electronics"
  | "history"
  | "philosophy";

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
    slug: "economics",
    name: "경제",
    description:
      "아무도 전체를 정하지 않는데 누가 무엇을 갖고 무엇을 하는지가 어떻게 정해지는지, 그리고 그 방식이 어디서 어긋나는지를 따라갑니다.",
  },
  {
    slug: "finance",
    name: "금융",
    description:
      "돈과 이자에서 시작해 은행·중앙은행·시장·규제까지 금융 체계를 기초부터 쌓습니다.",
  },
  {
    slug: "politics",
    name: "정치",
    description:
      "한 사회에 하나만 존재할 수 있는 결정을 누가 어떻게 내리는지, 국가에서 선거와 국제질서까지 따라갑니다.",
  },
  {
    slug: "law",
    name: "법",
    description:
      "정해진 규범이 개별 사안의 판단이 되기까지 무엇이 필요한지를 효력·해석·계약·재산·불법행위·형벌·증명·분쟁 해결 순으로 쌓습니다.",
  },
  {
    slug: "electronics",
    name: "전자",
    description: "회로의 보존 법칙에서 전자소자·반도체 제조·임베디드 제어까지 실제 수치와 자료로 따라갑니다.",
  },
  {
    slug: "history",
    name: "역사",
    description:
      "지난 일을 어떻게 아는지부터 제국·교역망·혁명·세계대전·탈식민과 생산·통화·부채가 바뀐 순서까지, 원문과 수치를 함께 읽습니다.",
  },
  {
    slug: "philosophy",
    name: "철학",
    description:
      "주장·지식·행동을 판단하는 기초에서 시작해 권력의 정당성, 과학적 설명, 마음과 기계의 이해를 작은 사례와 반례로 따집니다.",
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
  scarcity: "economics",
  firms: "economics",
  labor: "economics",
  prices: "economics",
  "market-failure": "economics",
  macro: "economics",
  business: "economics",
  property: "economics",
  institutions: "economics",
  infrastructure: "economics",
  money: "finance",
  banking: "finance",
  markets: "finance",
  risk: "finance",
  polity: "politics",
  constitution: "politics",
  elections: "politics",
  governance: "politics",
  "legal-system": "law",
  "private-law": "law",
  "criminal-law": "law",
  "dispute-resolution": "law",
  circuits: "electronics",
  semiconductors: "electronics",
  devices: "electronics",
  embedded: "electronics",
  testimony: "history",
  "record-numbers": "history",
  "inference-from-sources": "history",
  "global-history": "history",
  "economic-history": "history",
  reasoning: "philosophy",
  epistemology: "philosophy",
  ethics: "philosophy",
  "political-philosophy": "philosophy",
  "philosophy-of-science": "philosophy",
  "mind-and-language": "philosophy",
  "philosophy-topics": "philosophy",
  "philosophical-traditions": "philosophy",
  "philosophy-history": "philosophy",
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
