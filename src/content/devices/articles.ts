import type { Article } from "../types";

export const deviceArticles: Article[] = [
  {
    slug: "pn-junction-and-rectification",
    title: "두 실리콘 조각을 붙이면 한쪽 방향으로 잘 흐르는 이유",
    subcategory: "junction-devices",
    sections: [
      { id: "overview", title: "같은 접합에 전압의 방향만 바꿉니다" },
      { id: "diffusion", title: "붙인 직후에는 양쪽 전하가 건너갑니다" },
      { id: "depletion", title: "떠난 자리의 전하가 건넘을 막습니다" },
      { id: "bias", title: "바깥 전압이 그 장벽을 바꿉니다" },
      { id: "calculation", title: "0.1 V 차이를 전류로 계산합니다" },
      { id: "limits", title: "정해진 문턱 전압은 없습니다" },
      { id: "handoff", title: "전류를 여닫는 면으로 넘어갑니다" },
    ],
    component: () => import("@/pages/articles/devices/pn-junction-and-rectification"),
  },
  {
    slug: "mos-capacitor-and-inversion",
    title: "전극을 닿지 않게 놓아도 실리콘 표면이 바뀝니다",
    subcategory: "field-effect-devices",
    sections: [
      { id: "overview", title: "전류를 넣지 않고 표면을 바꿀 수 있을까요?" },
      { id: "stack", title: "전극과 실리콘 사이에 절연층을 둡니다" },
      { id: "states", title: "전압 방향에 따라 표면의 주인이 바뀝니다" },
      { id: "threshold", title: "표면이 뒤집히는 기준을 정합니다" },
      { id: "numbers", title: "10 nm 절연층에서 전하를 셉니다" },
      { id: "limits", title: "절연층도 공짜는 아닙니다" },
      { id: "handoff", title: "표면 길을 양쪽 단자에 잇습니다" },
    ],
    component: () => import("@/pages/articles/devices/mos-capacitor-and-inversion"),
  },
];
