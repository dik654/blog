import type { Article } from "../types";

export const firmsArticles: Article[] = [
  {
    slug: "why-firms-exist",
    title: "시장을 쓰는 데에도 값이 듭니다",
    subcategory: "firm-boundary",
    sections: [
      {
        id: "overview",
        title: "값이 조정한다고 했는데 공장 안에는 값이 없습니다",
      },
      {
        id: "cost-of-market",
        title: "부품 1. 값을 알아내는 일 자체가 공짜가 아닙니다",
      },
      {
        id: "one-contract",
        title: "부품 2. 조직은 여러 약속을 하나로 바꿉니다",
      },
      {
        id: "boundary",
        title: "부품 3. 경계는 두 값이 같아지는 자리에서 멈춥니다",
      },
      {
        id: "what-moves",
        title: "부품 4. 경계를 옮기는 것은 조직의 뜻이 아닙니다",
      },
      {
        id: "handoff",
        title: "경계 안에서는 값이 아니라 지시가 정합니다",
      },
    ],
    component: () => import("@/pages/articles/firms/why-firms-exist"),
  },
  {
    slug: "scale-and-cost-structure",
    title: "싸지는 것은 공장이 커져서가 아닙니다",
    subcategory: "firm-pricing",
    sections: [
      {
        id: "overview",
        title: "많이 만들면 싸진다는 말에는 설명이 빠져 있습니다",
      },
      {
        id: "roundabout",
        title: "부품 1. 싸지는 힘은 곧장 가지 않고 돌아가는 데서 옵니다",
      },
      {
        id: "minimum-market",
        title: "부품 2. 돌아가려면 먼저 그만큼의 시장이 있어야 합니다",
      },
      {
        id: "market-is-produced",
        title: "부품 3. 그 시장의 크기도 생산이 정합니다",
      },
      {
        id: "differentiation",
        title: "부품 4. 커지는 것은 공장이 아니라 산업이 쪼개지는 것입니다",
      },
      {
        id: "not-monopoly",
        title: "부품 5. 싸진다는 것에서 하나만 남는다는 것이 따라 나오지 않습니다",
      },
      {
        id: "handoff",
        title: "파는 쪽이 하나인 이유는 따로 세워야 합니다",
      },
    ],
    component: () =>
      import("@/pages/articles/firms/scale-and-cost-structure"),
  },
  {
    slug: "market-power-and-markup",
    title: "혼자 팔면 값을 고르게 됩니다",
    subcategory: "firm-pricing",
    sections: [
      {
        id: "overview",
        title: "1단계에서는 아무도 값을 고르지 않았습니다",
      },
      {
        id: "facing-demand",
        title: "부품 1. 혼자 팔면 점 하나가 아니라 선 전체를 마주합니다",
      },
      {
        id: "marginal-revenue",
        title: "부품 2. 하나 더 팔 때 늘어나는 돈은 그 값보다 낮습니다",
      },
      {
        id: "stopping-point",
        title: "부품 3. 멈추는 자리는 늘어나는 돈과 늘어나는 값이 같아지는 곳입니다",
      },
      {
        id: "markup-size",
        title: "부품 4. 틈의 크기는 수요가 얼마나 민감한가로 정해집니다",
      },
      {
        id: "what-is-lost",
        title: "부품 5. 틈은 옮겨 가는 몫만이 아니라 사라지는 몫을 만듭니다",
      },
      {
        id: "handoff",
        title: "값을 고르는 힘까지 왔고, 남은 것은 사람입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/firms/market-power-and-markup"),
  },
];
