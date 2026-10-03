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
  {
    slug: "storage-elements-and-transients",
    title: "전하와 자기장을 담으면 변화에 시간이 걸립니다",
    subcategory: "circuit-dynamics",
    sections: [
      { id: "overview", title: "스위치를 닫아도 출력은 한순간에 도착하지 않습니다" },
      { id: "capacitor", title: "두 판 사이에는 전하가 쌓인 만큼 전압이 남습니다" },
      { id: "rc", title: "5 V까지 남은 차이가 충전 속도를 정합니다" },
      { id: "inductor", title: "감은 선에는 전류가 만든 자기장 에너지가 남습니다" },
      { id: "boundary", title: "같은 1 ms라도 저항을 바꾸면 반대로 움직입니다" },
      { id: "handoff", title: "주기적으로 흔들면 지연을 다른 언어로 읽습니다" },
    ],
    component: () => import("@/pages/articles/circuits/storage-elements-and-transients"),
  },
  {
    slug: "steady-state-and-impedance",
    title: "반복 신호에서는 크기와 늦는 각도를 함께 셉니다",
    subcategory: "circuit-dynamics",
    sections: [
      { id: "overview", title: "같은 5 V라도 빠르게 흔들면 덜 따라옵니다" },
      { id: "wave", title: "반복 입력에서는 크기와 늦는 각도를 함께 적습니다" },
      { id: "complex", title: "미분을 곱셈으로 바꿔 두 숫자를 묶습니다" },
      { id: "divider", title: "저항과 축전기의 몫으로 출력을 구합니다" },
      { id: "limits", title: "정현파 하나일 때 간단해지는 도구입니다" },
      { id: "handoff", title: "한 속도의 답을 여러 속도의 지도로 펼칩니다" },
    ],
    component: () => import("@/pages/articles/circuits/steady-state-and-impedance"),
  },
  {
    slug: "frequency-shaping-and-bode",
    title: "느린 신호와 빠른 신호를 나누는 주파수 지도",
    subcategory: "circuit-dynamics",
    sections: [
      { id: "overview", title: "느린 신호는 남기고 빠른 신호는 줄일 수 있을까요?" },
      { id: "corner", title: "1 ms 저장 시간에서 경계 속도가 나옵니다" },
      { id: "db", title: "비율을 dB로 바꾸면 큰 범위를 함께 볼 수 있습니다" },
      { id: "plot", title: "한 칸에 열 배씩 놓으면 기울기가 드러납니다" },
      { id: "other-output", title: "출력 위치를 바꾸면 통과하는 쪽도 바뀝니다" },
      { id: "limits", title: "실제 필터의 경계는 연결된 회로가 다시 정합니다" },
    ],
    component: () => import("@/pages/articles/circuits/frequency-shaping-and-bode"),
  },
];
