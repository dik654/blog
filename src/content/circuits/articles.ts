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
      { id: "handoff", title: "이제 각 부품이 내는 열을 묻습니다" },
    ],
    component: () =>
      import("@/pages/articles/circuits/lumped-circuit-and-conservation"),
  },
  {
    slug: "resistance-and-power-dissipation",
    title: "저항을 합친 뒤 각 부품의 열을 다시 세는 이유",
    subcategory: "circuit-foundations",
    sections: [
      { id: "overview", title: "전원에서 나온 72 mW는 어디서 열이 될까요?" },
      { id: "one-path", title: "한 길에서는 같은 전류를 나눠 받습니다" },
      { id: "two-paths", title: "두 길에서는 같은 전압을 나눠 흘립니다" },
      { id: "heat", title: "각 길의 전압과 전류로 열을 다시 셉니다" },
      { id: "rating", title: "같은 1 kΩ이라도 얼마나 견디는지는 따로 봅니다" },
      { id: "limits", title: "값과 열이 바뀌면 처음의 전류도 다시 봅니다" },
    ],
    component: () => import("@/pages/articles/circuits/resistance-and-power-dissipation"),
  },
];
