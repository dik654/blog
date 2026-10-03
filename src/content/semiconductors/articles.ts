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
  {
    slug: "lithography-and-resolution",
    title: "작게 찍는 해상도와 제자리에 맞추는 정렬은 다릅니다",
    subcategory: "semiconductor-fabrication",
    sections: [
      { id: "overview", title: "같은 자리에 두 번 찍어야 연결됩니다" },
      { id: "transfer", title: "빛은 보호막이 아니라 감광막에 먼저 무늬를 남깁니다" },
      { id: "resolution", title: "193 nm 빛으로 계산한 가상 경계는 96.5 nm입니다" },
      { id: "overlay", title: "새 창이 옆으로 밀리면 좁은 쪽의 여유가 먼저 사라집니다" },
      { id: "limits", title: "찍힌 감광막과 식각 뒤 실제 구조를 다시 재야 합니다" },
    ],
    component: () => import("@/pages/articles/semiconductors/lithography-and-resolution"),
  },
  {
    slug: "doping-and-thermal-budget",
    title: "열을 준 시간만으로 도핑 경계를 정할 수 없는 이유",
    subcategory: "semiconductor-fabrication",
    sections: [
      { id: "overview", title: "창을 정확히 열어도 가열 뒤에는 경계가 움직입니다" },
      { id: "profile", title: "농도는 갑자기 끊기지 않고 깊이에 따라 줄어듭니다" },
      { id: "first", title: "첫 1시간의 퍼짐 폭은 120 nm입니다" },
      { id: "budget", title: "다음 30분이 앞의 1시간보다 더 크게 퍼뜨립니다" },
      { id: "limits", title: "퍼짐 폭 하나로 접합과 전기적 결과를 끝내지 않습니다" },
    ],
    component: () => import("@/pages/articles/semiconductors/doping-and-thermal-budget"),
  },
];
