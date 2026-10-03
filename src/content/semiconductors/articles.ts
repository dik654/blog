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
];
