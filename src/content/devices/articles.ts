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
  {
    slug: "mosfet-regions-and-transfer",
    title: "문 하나로 두 단자 사이의 전류를 조절합니다",
    subcategory: "field-effect-devices",
    sections: [
      { id: "overview", title: "길을 만들고 양끝에 전압을 겁니다" },
      { id: "terminals", title: "전극과 두 통로 끝의 역할을 나눕니다" },
      { id: "channel", title: "표면 전하가 양끝을 잇는 길이 됩니다" },
      { id: "states", title: "닫힘·완만한 증가·거의 일정한 전류" },
      { id: "current", title: "같은 소자를 세 전압에서 계산합니다" },
      { id: "limits", title: "평평한 전류도 실제로는 기울어집니다" },
      { id: "handoff", title: "한 번 바꿀 때 드는 에너지를 셉니다" },
    ],
    component: () => import("@/pages/articles/devices/mosfet-regions-and-transfer"),
  },
  {
    slug: "switching-energy-and-leakage",
    title: "한 번 뒤집는 에너지와 멈춰 있어도 새는 전류",
    subcategory: "field-effect-devices",
    sections: [
      { id: "overview", title: "가만히 있을 때와 뒤집을 때를 따로 셉니다" },
      { id: "two-paths", title: "위쪽 길이 채우고 아래쪽 길이 비웁니다" },
      { id: "energy-ledger", title: "33 pC가 움직인 동안 108.9 pJ를 냅니다" },
      { id: "activity", title: "매 기준 주기마다 바뀌지는 않습니다" },
      { id: "limits", title: "전압을 낮출 때는 속도와 누설도 바뀝니다" },
      { id: "handoff", title: "소자의 전력에서 실리콘의 제작으로 갑니다" },
    ],
    component: () => import("@/pages/articles/devices/switching-energy-and-leakage"),
  },
];
