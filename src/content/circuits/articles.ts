import type { Article } from "../types";

export const circuitsArticles: Article[] = [
  {
    slug: "lumped-circuit-and-conservation",
    title: "회로를 선과 점으로 줄여도 되는 이유",
    subcategory: "circuit-foundations",
    sections: [
      { id: "overview", title: "두 갈래 길을 한 번에 계산하려면" },
      { id: "small-circuit", title: "전압과 전류가 맡는 일" },
      { id: "junction", title: "갈림길에서 전하가 사라지지 않습니다" },
      { id: "loop", title: "한 바퀴를 돌면 전압 변화가 맞아야 합니다" },
      { id: "solve", title: "두 조건으로 같은 숫자를 다시 얻습니다" },
      { id: "power", title: "전력의 합으로 계산을 검산합니다" },
      { id: "limits", title: "점과 선으로 줄일 수 없는 순간" },
      { id: "handoff", title: "다음에는 시간에 따라 달라지는 회로를 봅니다" },
    ],
    component: () =>
      import("@/pages/articles/circuits/lumped-circuit-and-conservation"),
  },
];
