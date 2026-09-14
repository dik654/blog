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
  {
    slug: "capital-requirements-and-systemic-risk",
    title: "은행에만 미리 자본을 쌓으라고 하는 이유는 손실이 번지기 때문입니다",
    subcategory: "risk-capital",
    sections: [
      {
        id: "overview",
        title: "한 칸이 무너지면 이어진 칸이 함께 흔들리는 구조였습니다",
      },
      {
        id: "why-regulate",
        title: "부품 1. 결정하는 쪽과 비용을 치르는 쪽이 다릅니다",
      },
      {
        id: "loss-absorption",
        title: "부품 2. 자본은 쌓아 둔 현금이 아니라 손실을 먼저 받는 순서입니다",
      },
      {
        id: "rwa",
        title: "부품 3. 그래서 분모를 자산이 아니라 위험으로 바꿉니다",
        subsections: [
          { id: "gaming-the-weights", title: "분모를 줄이는 것과 위험을 줄이는 것은 다릅니다" },
        ],
      },
      {
        id: "liquidity",
        title: "부품 4. 자본이 충분해도 오늘 낼 현금이 없으면 무너집니다",
        subsections: [
          { id: "two-axes", title: "두 축이 막는 실패가 서로 다릅니다" },
        ],
      },
      {
        id: "boundary",
        title: "이 규제는 스스로 새 문제를 만들고, 그 자리에서 그물이 닫힙니다",
      },
    ],
    component: () =>
      import("@/pages/articles/risk/capital-requirements-and-systemic-risk"),
  },
];
