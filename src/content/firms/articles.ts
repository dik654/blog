import type { Article } from "../types";

export const firmsArticles: Article[] = [
  {
    slug: "why-firms-exist",
    title: "기업은 왜 존재할까: 같은 여섯 일의 비용과 계약",
    subcategory: "firm-boundary",
    sections: [
  {
    "id": "overview",
    "title": "1. 일을 맡길 때마다 다시 협상해야 한다면"
  },
  {
    "id": "black-box",
    "title": "2. 밖에 주문하거나 안에서 배정한다"
  },
  {
    "id": "case",
    "title": "3. 전부 밖에 두면 24, 전부 안에 두면 21이다"
  },
  {
    "id": "picture",
    "title": "4. 여섯 일을 옮길 때 합계가 어떻게 변하는가"
  },
  {
    "id": "need",
    "title": "5. 물건값을 알아보고 약속을 지키는 데에도 돈이 든다"
  },
  {
    "id": "names",
    "title": "6. 방식의 비용과 기업의 경계를 구분한다"
  },
  {
    "id": "cost-of-market",
    "title": "7. 넷째 일을 바꿔도 합계가 18인 이유"
  },
  {
    "id": "one-contract",
    "title": "8. 세부 작업을 나중에 정할 수 있는 범위를 약속한다"
  },
  {
    "id": "source",
    "title": "9. Coase의 원문은 시장을 사용하는 비용부터 묻는다"
  },
  {
    "id": "boundary",
    "title": "10. 하나 더 들일 때의 차이는 안의 비용 빼기 밖의 비용이다"
  },
  {
    "id": "what-moves",
    "title": "11. 회사가 커졌어도 안쪽이 좋아진 것은 아닐 수 있다"
  },
  {
    "id": "limits",
    "title": "12. 설립비가 생기면 첫 작업만 보고 멈출 수 없다"
  },
  {
    "id": "handoff",
    "title": "13. 같은 일을 끝내는 전체 비용으로 예측한다"
  }
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
