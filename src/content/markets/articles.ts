import type { Article } from "../types";

export const marketsArticles: Article[] = [
  {
    slug: "bond-pricing-and-yield-curve",
    title: "채권 가격과 수익률은 같은 정보를 반대 방향으로 적은 것입니다",
    subcategory: "markets-bond",
    sections: [
      {
        id: "overview",
        title: "채권은 2편의 할인 식에 현금흐름을 꽂아 넣은 첫 사례입니다",
      },
      {
        id: "cashflow-to-price",
        title: "부품 1. 현금흐름이 적혀 있으면 가격은 계산의 결과입니다",
      },
      {
        id: "ytm",
        title: "부품 2. 시장 가격을 식에 거꾸로 넣으면 수익률 하나가 나옵니다",
        subsections: [
          { id: "ytm-assumption", title: "만기수익률은 실제로 얻게 될 수익률이 아닙니다" },
        ],
      },
      {
        id: "duration",
        title: "부품 3. 가격이 얼마나 흔들릴지는 현금흐름의 무게중심이 정합니다",
        subsections: [
          { id: "duration-use", title: "같은 만기라도 듀레이션은 다를 수 있습니다" },
        ],
      },
      {
        id: "yield-curve",
        title: "부품 4. 만기마다 금리가 다르므로 하나의 y로는 부족합니다",
        subsections: [
          { id: "curve-shapes", title: "곡선이 뒤집히면 무엇을 읽어야 하는가" },
        ],
      },
      {
        id: "boundary",
        title: "현금흐름이 적혀 있지 않은 청구권은 어떻게 값을 매길까요",
      },
    ],
    component: () => import("@/pages/articles/markets/bond-pricing-and-yield-curve"),
  },
  {
    slug: "equity-claims-and-valuation",
    title: "주주는 아무것도 약속받지 못한 대신 남는 것을 전부 갖습니다",
    subcategory: "markets-equity",
    sections: [
      {
        id: "overview",
        title: "같은 회사에 걸린 청구권들이 순위대로 줄을 서 있습니다",
      },
      {
        id: "residual-claim",
        title: "부품 1. 마지막 순위이면서 아래가 막혀 있다는 것이 핵심입니다",
      },
      {
        id: "leverage",
        title: "부품 2. 같은 사업이라도 빚을 섞으면 주주 몫의 진폭이 커집니다",
        subsections: [
          {
            id: "structure-neutrality",
            title: "그렇다면 빚을 늘리는 것만으로 회사가 더 가치 있어질까요",
          },
        ],
      },
      {
        id: "ddm",
        title: "부품 3. 적혀 있지 않은 현금흐름은 모양을 가정해야 합니다",
      },
      {
        id: "multiples",
        title: "부품 4. 실무는 가정을 줄이는 대신 비교 대상을 빌려 씁니다",
        subsections: [
          { id: "multiple-traps", title: "배수를 비교할 때 자주 어긋나는 지점" },
        ],
      },
      {
        id: "boundary",
        title: "분자를 다뤘으니 남은 것은 분모입니다",
      },
    ],
    component: () => import("@/pages/articles/markets/equity-claims-and-valuation"),
  },
];
