import type { Article } from "../types";

export const macroArticles: Article[] = [
  {
    slug: "aggregation-and-composition",
    title: "한 사람에게 맞는 답이 모두에게 맞지는 않습니다",
    subcategory: "macro-aggregate",
    sections: [
      {
        id: "overview",
        title: "앞의 여덟 편은 전부 한 사람의 자리에서 본 것입니다",
      },
      {
        id: "spending-is-income",
        title: "부품 1. 한 사람의 지출이 다른 사람의 소득입니다",
      },
      {
        id: "thrift",
        title: "부품 2. 그래서 다 같이 아끼면 아껴지지 않습니다",
      },
      {
        id: "multiplier",
        title: "부품 3. 한 번의 지출이 몇 바퀴를 돌지는 도는 비율이 정합니다",
      },
      {
        id: "aggregates-hide",
        title: "부품 4. 합친 숫자는 그 숫자를 정한 것을 지웁니다",
      },
      {
        id: "boundary",
        title: "이 글의 계산은 값과 이자율을 세워 둔 채로 한 것입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/macro/aggregation-and-composition"),
  },
];
