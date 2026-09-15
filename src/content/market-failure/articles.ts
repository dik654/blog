import type { Article } from "../types";

export const marketFailureArticles: Article[] = [
  {
    slug: "externalities-and-social-cost",
    title: "장부에 적히지 않은 비용은 누가 냅니까",
    subcategory: "mf-externality",
    sections: [
      {
        id: "overview",
        title: "값이 옳게 말하려면 드는 것이 전부 장부에 적혀야 합니다",
      },
      {
        id: "two-costs",
        title: "부품 1. 장부에 적히는 값과 실제로 드는 값이 갈라집니다",
      },
      {
        id: "overproduction",
        title: "부품 2. 갈라진 만큼 더 만들어집니다",
      },
      {
        id: "pricing-in",
        title: "부품 3. 빠진 몫을 값에 얹으면 다시 맞습니다",
      },
      {
        id: "bargaining",
        title: "부품 4. 값을 얹는 대신 권리를 정해 주고 맡길 수도 있습니다",
      },
      {
        id: "boundary",
        title: "상대를 특정할 수 없으면 두 길이 다 막힙니다",
      },
    ],
    component: () =>
      import("@/pages/articles/market-failure/externalities-and-social-cost"),
  },
];
