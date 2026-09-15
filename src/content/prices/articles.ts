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
  {
    slug: "surplus-and-efficiency",
    title: "거래가 만든 값은 누구에게 갑니까",
    subcategory: "price-welfare",
    sections: [
      {
        id: "overview",
        title: "거래가 끝나면 양쪽 모두 무언가를 남깁니다",
      },
      {
        id: "two-surpluses",
        title: "부품 1. 양쪽 모두 값보다 나은 자리에서 거래합니다",
      },
      {
        id: "total-surplus",
        title: "부품 2. 쌍으로 묶으면 값이 지워지고 차이만 남습니다",
      },
      {
        id: "price-cap",
        title: "부품 3. 값을 묶으면 옮겨지는 것과 사라지는 것이 함께 생깁니다",
      },
      {
        id: "not-fairness",
        title: "부품 4. 이 자는 공정을 재지 않습니다",
      },
      {
        id: "boundary",
        title: "채점까지가 이 글이고, 왜 그 값이 정해지는지는 다음 글입니다",
      },
    ],
    component: () => import("@/pages/articles/prices/surplus-and-efficiency"),
  },
  {
    slug: "prices-as-information",
    title: "가격은 아무도 갖지 않은 지식을 옮깁니다",
    subcategory: "price-information",
    sections: [
      {
        id: "overview",
        title: "아무도 전체를 모르는데 답은 맞게 나옵니다",
      },
      {
        id: "dispersed",
        title: "부품 1. 알아야 할 것이 한곳에 모여 있지 않습니다",
      },
      {
        id: "sufficient",
        title: "부품 2. 값 하나가 그 전부를 대신합니다",
      },
      {
        id: "three-roles",
        title: "부품 3. 아는 것만으로는 부족하고 따를 이유가 있어야 합니다",
      },
      {
        id: "central-calculation",
        title: "부품 4. 중앙에서 계산하려면 자료를 먼저 모아야 합니다",
      },
      {
        id: "boundary",
        title: "값이 나르지 못하는 것이 다음 글입니다",
      },
    ],
    component: () => import("@/pages/articles/prices/prices-as-information"),
  },
];
