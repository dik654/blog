import type { Article } from "../types";

export const disputeResolutionArticles: Article[] = [
  {
    slug: "settlement-and-access",
    title: "규칙은 적용되지 않는 사건에서도 작동합니다",
    subcategory: "disp-settlement",
    sections: [
      {
        id: "overview",
        title: "지금까지 본 규칙들은 대부분의 사건에 적용되지 않습니다",
      },
      {
        id: "settlement-range",
        title: "부품 1. 합의할 수 있는 금액의 폭은 소송비용만큼입니다",
      },
      {
        id: "selection",
        title: "부품 2. 재판까지 간 사건만 보면 법을 잘못 읽습니다",
      },
      {
        id: "shadow",
        title: "부품 3. 적용되지 않는 규칙이 모든 사건에 닿습니다",
      },
      {
        id: "access",
        title: "부품 4. 그래서 비용은 두 방향으로 작용합니다",
      },
      {
        id: "boundary",
        title: "네 대분류가 같은 문법으로 읽힙니다",
      },
    ],
    component: () =>
      import("@/pages/articles/dispute-resolution/settlement-and-access"),
  },
];
