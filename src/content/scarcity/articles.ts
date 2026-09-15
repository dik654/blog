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
  {
    slug: "gains-from-trade",
    title: "더 잘하는 쪽이 다 하지 않는 것이 낫습니다",
    subcategory: "scar-exchange",
    sections: [
      {
        id: "overview",
        title: "둘 다 더 잘하는 사람이 있어도 혼자 다 하는 것은 손해입니다",
      },
      {
        id: "two-advantages",
        title: "부품 1. 더 많이 만드는 것과 더 싸게 만드는 것은 다릅니다",
      },
      {
        id: "trade-range",
        title: "부품 2. 둘 다 나아지는 비율의 구간이 존재합니다",
      },
      {
        id: "where-gain-comes-from",
        title: "부품 3. 이득은 옮겨 담는 데서가 아니라 배치를 바꾸는 데서 나옵니다",
      },
      {
        id: "transaction-cost",
        title: "부품 4. 옮기고 재고 지키는 값이 구간을 갉아먹습니다",
      },
      {
        id: "boundary",
        title: "비율이 구간 안 어디로 정해지는지는 아직 빈칸입니다",
      },
    ],
    component: () => import("@/pages/articles/scarcity/gains-from-trade"),
  },
];
