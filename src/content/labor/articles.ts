import type { Article } from "../types";

export const laborArticles: Article[] = [
  {
    slug: "wage-floor-natural-experiment",
    title: "임금을 올리면 일자리가 준다는 예측을 재 봤습니다",
    subcategory: "wage-formation",
    sections: [
      {
        id: "overview",
        title: "한 시간에 4.25달러 받던 사람이 5.05달러를 받게 되었습니다",
      },
      {
        id: "two-counts",
        title: "부품 1. 한 사람을 더 쓸 때 얻는 것과 내는 것을 셉니다",
      },
      {
        id: "many-buyers",
        title: "부품 2. 사는 가게가 여럿이면 임금은 얻는 몫에서 멈춥니다",
      },
      {
        id: "one-buyer",
        title: "부품 3. 사는 가게가 하나면 앞 글의 셈이 뒤집혀 나타납니다",
      },
      {
        id: "two-predictions",
        title: "부품 4. 같은 바닥이 한쪽은 줄이고 다른 쪽은 늘립니다",
      },
      {
        id: "what-happened",
        title: "부품 5. 재 본 결과는 두 셈 중 어느 쪽도 그대로 맞히지 못했습니다",
      },
      {
        id: "handoff",
        title: "정해진 몫이 사람 사이에서 어떻게 벌어지는지가 남습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/labor/wage-floor-natural-experiment"),
  },
  {
    slug: "measuring-the-spread",
    title: "벌어진 정도는 표가 아니라 곡선으로 잽니다",
    subcategory: "distribution",
    sections: [
      {
        id: "overview",
        title: "같은 100달러를 열 사람이 나눠 가진 두 경우가 있습니다",
      },
      {
        id: "why-tables-fail",
        title: "부품 1. 계급별 표로는 벌어졌는지 좁아졌는지 알 수 없습니다",
      },
      {
        id: "cumulate-and-draw",
        title: "부품 2. 가난한 쪽부터 쌓아서 그리면 보입니다",
      },
      {
        id: "one-number",
        title: "부품 3. 휜 정도를 한 숫자로 줄입니다",
      },
      {
        id: "what-one-number-loses",
        title: "부품 4. 그 한 숫자가 못 보는 것이 입구의 두 경우입니다",
      },
      {
        id: "where-the-spread-comes-from",
        title: "부품 5. 벌어지는 자리는 앞 글의 틈이 사람마다 다른 자리입니다",
      },
      {
        id: "handoff",
        title: "다섯 편으로 조직과 사람까지 왔습니다",
      },
    ],
    component: () => import("@/pages/articles/labor/measuring-the-spread"),
  },
];
