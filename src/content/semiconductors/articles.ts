import type { Article } from "../types";

export const semiconductorArticles: Article[] = [
  {
    slug: "bands-and-doping",
    title: "실리콘에 소량을 섞으면 흐름이 달라지는 이유",
    subcategory: "semiconductor-physics",
    sections: [
      { id: "overview", title: "같은 실리콘인데 움직일 수 있는 전자가 달라집니다" },
      { id: "states", title: "움직일 수 있는 에너지 자리가 따로 있습니다" },
      { id: "intrinsic", title: "순수한 실리콘에서도 둘이 함께 생깁니다" },
      { id: "dopants", title: "한쪽 수를 늘리면 다른 쪽 수가 줄어듭니다" },
      { id: "count", title: "1세제곱센티미터의 수를 끝까지 셉니다" },
      { id: "boundaries", title: "온도와 이동도를 빼면 계산이 틀어집니다" },
      { id: "handoff", title: "두 영역을 붙이면 접합이 됩니다" },
    ],
    component: () => import("@/pages/articles/semiconductors/bands-and-doping"),
  },
  {
    slug: "wafer-and-planar-process",
    title: "웨이퍼의 필요한 곳만 열어 접합을 만드는 법",
    subcategory: "semiconductor-fabrication",
    sections: [
      { id: "overview", title: "전기가 흐를 자리를 웨이퍼 위에서 어떻게 골라낼까요?" },
      { id: "wafer", title: "웨이퍼는 여러 소자를 한 번에 가공하는 바탕입니다" },
      { id: "mask", title: "산화막에 낸 창이 불순물의 입구를 정합니다" },
      { id: "protect", title: "접합 위의 막을 남기고 전극 자리만 다시 엽니다" },
      { id: "limits", title: "이 첫 평면 공정은 오늘의 칩 제조 전체가 아닙니다" },
    ],
    component: () => import("@/pages/articles/semiconductors/wafer-and-planar-process"),
  },
];
