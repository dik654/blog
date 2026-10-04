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
  {
    "id": "overview",
    "title": "1. 창의 폭과 놓인 위치를 따로 확인해야 연결됩니다"
  },
  {
    "id": "outside",
    "title": "2. 빛으로 기록한 무늬가 아래 층의 열린 자리가 됩니다"
  },
  {
    "id": "case",
    "title": "3. 200 nm 선 위에 120 nm 창을 놓습니다"
  },
  {
    "id": "picture",
    "title": "4. 기록할 막·무늬를 비출 경로·아래 층을 차례로 봅니다"
  },
  {
    "id": "why",
    "title": "5. 기록과 물질 제거를 나누어 원하는 부분만 가공합니다"
  },
  {
    "id": "names",
    "title": "6. 이미 본 기록·투영·위치 차이에 이름을 붙입니다"
  },
  {
    "id": "transfer",
    "title": "7. 120 nm 창의 무늬를 감광막에서 아래 층으로 옮깁니다"
  },
  {
    "id": "resolution",
    "title": "8. 원문의 크기 식에 193 nm를 넣으면 96.5 nm입니다"
  },
  {
    "id": "overlay",
    "title": "9. 같은 120 nm 창을 30 nm 옮겨 원문의 위치 정의를 적용합니다"
  },
  {
    "id": "limits",
    "title": "10. 찍힌 감광막과 식각 뒤 실제 구조를 다시 재야 합니다"
  }
],
    component: () => import("@/pages/articles/semiconductors/lithography-and-resolution"),
  },
  {
    slug: "doping-and-thermal-budget",
    title: "열을 준 시간만으로 도핑 경계를 정할 수 없는 이유",
    subcategory: "semiconductor-fabrication",
    sections: [
  {
    "id": "overview",
    "title": "1. 뒤의 짧은 가열이 앞에서 만든 분포를 더 크게 바꿀 수 있습니다"
  },
  {
    "id": "outside",
    "title": "2. 넣은 총량은 유지하고 가열 뒤의 깊이별 양을 비교합니다"
  },
  {
    "id": "case",
    "title": "3. 한 시간 뒤 120 nm였던 폭 척도가 삼십 분 뒤 약 208 nm가 됩니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 원자 수가 더 넓은 깊이에 나뉩니다"
  },
  {
    "id": "why",
    "title": "5. 시간만 더하면 두 가열 상태의 차이를 놓칩니다"
  },
  {
    "id": "names",
    "title": "6. 총량·움직이기 쉬운 정도·누적 곱을 구별합니다"
  },
  {
    "id": "profile",
    "title": "7. 원문의 곡선 모양에서 120 nm가 뜻하는 것을 읽습니다"
  },
  {
    "id": "first",
    "title": "8. 첫 3600초의 곱으로 120 nm를 계산합니다"
  },
  {
    "id": "budget",
    "title": "9. 다음 1800초의 기여를 더해 약 208 nm를 얻습니다"
  },
  {
    "id": "source",
    "title": "10. 같은 곡선의 총량과 두 깊이의 농도를 검산합니다"
  },
  {
    "id": "supply",
    "title": "11. 계속 공급해 표면 농도를 고정하면 다른 문제를 풉니다"
  },
  {
    "id": "limits",
    "title": "12. 퍼짐 폭 하나로 접합과 전기적 결과를 끝내지 않습니다"
  }
],
    component: () => import("@/pages/articles/semiconductors/doping-and-thermal-budget"),
  },
  {
    slug: "interconnect-and-rc-delay",
    title: "배선이 길어지면 신호가 얼마나 늦어질까",
    subcategory: "semiconductor-fabrication",
    sections: [
  {
    "id": "overview",
    "title": "1. 멀리 있는 입력을 바꾸려면 연결선의 전하도 채워야 합니다"
  },
  {
    "id": "outside",
    "title": "2. 출력 전압의 변화가 선 끝 입력에 도달합니다"
  },
  {
    "id": "case",
    "title": "3. 같은 출력·입력에 200 Ω·100 fF 선을 추가합니다"
  },
  {
    "id": "picture",
    "title": "4. 시작 쪽과 끝 쪽 용량이 거치는 저항이 다릅니다"
  },
  {
    "id": "why",
    "title": "5. 전체 용량을 선 끝에 몰면 시작 쪽 경로를 잘못 셉니다"
  },
  {
    "id": "names",
    "title": "6. 두 점으로 줄인 선과 그 시간 척도에 이름을 붙입니다"
  },
  {
    "id": "wire",
    "title": "7. 같은 배선의 시작과 끝에 용량 절반씩을 둡니다"
  },
  {
    "id": "delay",
    "title": "8. 출력의 60 ps와 선 안쪽의 14 ps를 합칩니다"
  },
  {
    "id": "source",
    "title": "9. 원문의 π 식에 같은 네 값을 직접 넣습니다"
  },
  {
    "id": "length",
    "title": "10. 길이를 두 배로 늘리면 전체는 158 ps입니다"
  },
  {
    "id": "materials",
    "title": "11. 금속과 절연막은 식의 다른 자리를 바꿉니다"
  },
  {
    "id": "limits",
    "title": "12. 정확한 도착 시각은 실제 파형과 배치에서 다시 구합니다"
  }
],
    component: () => import("@/pages/articles/semiconductors/interconnect-and-rc-delay"),
  },
  {
    slug: "yield-defect-and-packaging",
    title: "결함이 없는 다이와 출하되는 칩은 몇 개일까",
    subcategory: "semiconductor-fabrication",
    sections: [
  {
    "id": "overview",
    "title": "1. 어느 단계에서 몇 개가 남았는지부터 세어야 합니다"
  },
  {
    "id": "outside",
    "title": "2. 후보 다이가 결함 검사와 조립·시험을 거쳐 출하됩니다"
  },
  {
    "id": "case",
    "title": "3. 후보 1000개에서 약 904.8개, 다시 약 886.7개를 기대합니다"
  },
  {
    "id": "picture",
    "title": "4. 결함 위치 지도와 단계별 통과 장부를 함께 봅니다"
  },
  {
    "id": "why",
    "title": "5. 면적과 분모를 나누어야 실패 원인을 잘못 셈하지 않습니다"
  },
  {
    "id": "names",
    "title": "6. 위험 면적·평균 결함 수·통과율에 이름을 붙입니다"
  },
  {
    "id": "area",
    "title": "7. 고장을 만드는 위치를 모아 1 cm²로 가정합니다"
  },
  {
    "id": "poisson",
    "title": "8. 평균 0.1개에서 결함 0개 확률을 계산합니다"
  },
  {
    "id": "source",
    "title": "9. 원문의 0개 확률에 같은 면적과 밀도를 넣습니다"
  },
  {
    "id": "sensitivity",
    "title": "10. 위험 면적과 밀도를 바꾸되 후보 수와 구별합니다"
  },
  {
    "id": "package",
    "title": "11. 원문의 조립·시험 순서에 다음 단계 98%를 대응시킵니다"
  },
  {
    "id": "limits",
    "title": "12. 실제 수율에는 결함의 뭉침과 사양 탈락도 들어갑니다"
  }
],
    component: () => import("@/pages/articles/semiconductors/yield-defect-and-packaging"),
  },
];
