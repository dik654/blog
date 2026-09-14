import type { Article } from "../types";

export const riskArticles: Article[] = [
  {
    slug: "risk-diversification-and-pricing",
    title: "나눠서 없앨 수 있는 위험에는 아무도 대가를 주지 않습니다",
    subcategory: "risk-portfolio",
    sections: [
      {
        id: "overview",
        title: "위험은 한 덩어리가 아니라 두 종류로 갈라집니다",
      },
      {
        id: "measuring-risk",
        title: "부품 1. 위험을 재려면 먼저 흩어진 정도를 숫자로 만들어야 합니다",
      },
      {
        id: "covariance",
        title: "부품 2. 섞었을 때 위험이 줄어드는 몫은 상관이 정합니다",
        subsections: [
          { id: "many-assets", title: "자산 수를 늘리면 무엇이 사라지고 무엇이 남는가" },
        ],
      },
      {
        id: "systematic-risk",
        title: "부품 3. 남는 위험에만 보상이 붙는 이유는 선택 가능성에 있습니다",
      },
      {
        id: "capm",
        title: "부품 4. 남는 위험의 양을 재면 마침내 r이 나옵니다",
        subsections: [
          { id: "applying-r", title: "이 값을 앞의 글들에 어떻게 끼워 넣는가" },
        ],
      },
      {
        id: "boundary",
        title: "이 틀은 평온할 때 가장 잘 맞고 필요할 때 가장 덜 맞습니다",
      },
    ],
    component: () => import("@/pages/articles/risk/risk-diversification-and-pricing"),
  },
];
