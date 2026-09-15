import type { Article } from "../types";

export const pricesArticles: Article[] = [
  {
    slug: "supply-demand-and-equilibrium",
    title: "아무도 정하지 않은 숫자가 정해집니다",
    subcategory: "price-equilibrium",
    sections: [
      {
        id: "overview",
        title: "아무에게도 물어보지 않고 숫자 하나가 정해집니다",
      },
      {
        id: "demand-side",
        title: "부품 1. 사려는 줄은 낼 수 있는 값의 내림차순입니다",
      },
      {
        id: "supply-side",
        title: "부품 2. 팔려는 줄은 드는 값의 오름차순입니다",
      },
      {
        id: "adjustment",
        title: "부품 3. 두 줄의 길이가 어긋나면 남는 쪽이 값을 밉니다",
      },
      {
        id: "shift-vs-move",
        title: "부품 4. 값이 바뀌었다고 사정이 바뀐 것은 아닙니다",
      },
      {
        id: "boundary",
        title: "정해진다는 것과 좋다는 것은 아직 다른 말입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/prices/supply-demand-and-equilibrium"),
  },
];
