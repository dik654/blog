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
  {
    slug: "public-goods-and-commons",
    title: "빼놓을 수 없으면 아무도 내지 않고, 줄어드는 것이면 너무 빨리 씁니다",
    subcategory: "mf-commons",
    sections: [
      {
        id: "overview",
        title: "앞 글의 두 길이 모두 닫히는 경우가 있습니다",
      },
      {
        id: "vertical-sum",
        title: "부품 1. 한 사람이 더 누려도 줄지 않으면 값을 세로로 더합니다",
      },
      {
        id: "revelation",
        title: "부품 2. 얼마나 원하는지 물어보면 참말할 이유가 없습니다",
      },
      {
        id: "congestion",
        title: "부품 3. 줄어드는 것이면 반대쪽으로 어긋납니다",
      },
      {
        id: "excluding",
        title: "부품 4. 빼놓을 수 있게 되어도 한 값으로는 비용을 못 채웁니다",
      },
      {
        id: "boundary",
        title: "얼마가 맞는지를 아는 것과 그것을 정하는 것은 다른 일입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/market-failure/public-goods-and-commons"),
  },
  {
    slug: "information-asymmetry",
    title: "한쪽만 아는 것이 있으면 값이 평균을 말합니다",
    subcategory: "mf-information",
    sections: [
      {
        id: "overview",
        title: "지금까지는 양쪽이 같은 것을 보고 있었습니다",
      },
      {
        id: "pooling",
        title: "부품 1. 구별할 수 없으면 좋은 것과 나쁜 것이 같은 값에 팔립니다",
      },
      {
        id: "unravelling",
        title: "부품 2. 그 값으로는 좋은 것부터 나오지 않습니다",
      },
      {
        id: "signaling",
        title: "부품 3. 아는 쪽이 값비싼 표시를 보내면 갈라집니다",
      },
      {
        id: "hidden-action",
        title: "부품 4. 계약을 맺은 뒤에 행동이 바뀝니다",
      },
      {
        id: "boundary",
        title: "가려내는 장치의 값을 세지 않으면 절반만 본 것입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/market-failure/information-asymmetry"),
  },
];
