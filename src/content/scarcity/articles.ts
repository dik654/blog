import type { Article } from "../types";

export const scarcityArticles: Article[] = [
  {
    slug: "scarcity-and-opportunity-cost",
    title: "무엇을 포기할지부터 정해야 합니다",
    subcategory: "scar-choice",
    sections: [
      {
        id: "overview",
        title: "무엇을 할지 정하는 일은 무엇을 안 할지 정하는 일과 같습니다",
      },
      {
        id: "why-choose",
        title: "부품 1. 모자란 것만으로는 고르는 일이 생기지 않습니다",
      },
      {
        id: "opportunity-cost",
        title: "부품 2. 값은 치른 돈이 아니라 포기한 최선입니다",
      },
      {
        id: "margin",
        title: "부품 3. 전부냐 아니냐가 아니라 한 단위 더냐를 묻습니다",
      },
      {
        id: "sunk",
        title: "부품 4. 이미 사라진 것은 계산에 넣지 않습니다",
      },
      {
        id: "boundary",
        title: "여기까지는 혼자 고를 때입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/scarcity/scarcity-and-opportunity-cost"),
  },
];
