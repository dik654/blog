import type { Article } from "../types";

export const semiconductorArticles: Article[] = [
  {
    slug: "bands-and-doping",
    title: "실리콘에 소량을 섞으면 흐름이 달라지는 이유",
    subcategory: "semiconductor-physics",
    sections: [
  {
    "id": "overview",
    "title": "1. 실리콘 안의 전자를 전부 전류로 세면 안 됩니다"
  },
  {
    "id": "outside",
    "title": "2. 같은 온도에서 원자 종류를 바꾸고 이동 전하를 셉니다"
  },
  {
    "id": "case",
    "title": "3. 1 cm³의 두 조각에서 10¹⁰개와 10¹⁶개를 비교합니다"
  },
  {
    "id": "picture",
    "title": "4. 움직이는 전자·이동하는 빈자리·고정된 전하를 나눕니다"
  },
  {
    "id": "why",
    "title": "5. 이동 전하 수와 전체 전하량은 서로 다른 장부입니다"
  },
  {
    "id": "states",
    "title": "6. 가능한 상태의 묶음에 에너지띠라는 이름을 붙입니다"
  },
  {
    "id": "intrinsic",
    "title": "7. 기준 조각 A에서 두 이동 전하를 함께 셉니다"
  },
  {
    "id": "dopants",
    "title": "8. 조각 B에 전자를 내놓는 원자를 넣습니다"
  },
  {
    "id": "count",
    "title": "9. 같은 조각의 많은 쪽과 적은 쪽을 계산합니다"
  },
  {
    "id": "source",
    "title": "10. 원문의 평형식과 중성 조건을 같은 사례에 대입합니다"
  },
  {
    "id": "boundaries",
    "title": "11. 온도·빛·이동도가 바뀌면 다시 확인할 것이 생깁니다"
  },
  {
    "id": "handoff",
    "title": "12. 전하 수를 예측한 뒤 두 영역의 경계로 갑니다"
  }
],
    component: () => import("@/pages/articles/semiconductors/bands-and-doping"),
  },
  {
    slug: "wafer-and-planar-process",
    title: "웨이퍼의 필요한 곳만 열어 접합을 만드는 법",
    subcategory: "semiconductor-fabrication",
    sections: [
  {
    "id": "overview",
    "title": "1. 들어갈 자리와 끝까지 덮어 둘 자리를 따로 정합니다"
  },
  {
    "id": "outside",
    "title": "2. 실리콘과 두 창의 위치를 정해 접합과 접촉을 만듭니다"
  },
  {
    "id": "case",
    "title": "3. 100 µm의 첫 창과 80 µm의 전극 창을 고릅니다"
  },
  {
    "id": "picture",
    "title": "4. 첫 창은 원자 입구이고 다음 창은 전극 자리입니다"
  },
  {
    "id": "why",
    "title": "5. 창을 열었다가 다시 덮는 데 이유가 있습니다"
  },
  {
    "id": "wafer",
    "title": "6. 바탕·산화막·접촉 창의 이름과 역할을 잇습니다"
  },
  {
    "id": "mask",
    "title": "7. 100 µm 입구에서 104 µm의 표면 영역을 만듭니다"
  },
  {
    "id": "protect",
    "title": "8. 80 µm 접촉 창을 열어 양쪽에 12 µm를 남깁니다"
  },
  {
    "id": "source",
    "title": "9. 원문의 남겨 둘 막을 가상 단면에서 찾습니다"
  },
  {
    "id": "alternatives",
    "title": "10. 같은 단면의 폭과 정렬을 바꿔 검산합니다"
  },
  {
    "id": "limits",
    "title": "11. 원문의 구조를 현대 제조 전체로 확대하지 않습니다"
  }
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
  {
    slug: "interconnect-and-rc-delay",
    title: "배선이 길어지면 신호가 얼마나 늦어질까",
    subcategory: "semiconductor-fabrication",
    sections: [
      { id: "overview", title: "트랜지스터가 빨라도 먼 곳의 입력은 늦게 바뀝니다" },
      { id: "wire", title: "선이 길어지면 저항도, 충전할 용량도 커집니다" },
      { id: "delay", title: "누가 어느 용량을 충전하는지 세면 74 ps가 나옵니다" },
      { id: "length", title: "길이를 두 배로 늘리면 전체는 158 ps입니다" },
      { id: "materials", title: "금속과 절연막은 식의 다른 자리를 바꿉니다" },
      { id: "limits", title: "정확한 도착 시각은 실제 파형과 배치에서 다시 구합니다" },
    ],
    component: () => import("@/pages/articles/semiconductors/interconnect-and-rc-delay"),
  },
  {
    slug: "yield-defect-and-packaging",
    title: "결함이 없는 다이와 출하되는 칩은 몇 개일까",
    subcategory: "semiconductor-fabrication",
    sections: [
      { id: "overview", title: "같은 웨이퍼에서 나온 다이가 모두 출하되지는 않습니다" },
      { id: "area", title: "결함이 떨어진 위치가 회로를 망가뜨리는지가 중요합니다" },
      { id: "poisson", title: "평균 0.1개라면 0개일 확률은 약 90.48%입니다" },
      { id: "sensitivity", title: "위험 면적이 네 배면 결함 0개 확률은 67.03%입니다" },
      { id: "package", title: "패키지와 시험을 통과하는 비율은 다음 분모에서 셉니다" },
      { id: "limits", title: "실제 수율에는 결함의 뭉침과 사양 탈락도 들어갑니다" },
    ],
    component: () => import("@/pages/articles/semiconductors/yield-defect-and-packaging"),
  },
];
