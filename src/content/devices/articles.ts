import type { Article } from "../types";

export const deviceArticles: Article[] = [
  {
    slug: "pn-junction-and-rectification",
    title: "두 실리콘 조각을 붙이면 한쪽 방향으로 잘 흐르는 이유",
    subcategory: "junction-devices",
    sections: [
  {
    "id": "overview",
    "title": "1. 방향을 바꾸면 흐르는 양이 왜 달라질까요?"
  },
  {
    "id": "outside",
    "title": "2. 양끝 전압을 바꾸고 단자 전류를 읽습니다"
  },
  {
    "id": "case",
    "title": "3. 300 K의 한 소자에서 세 전압만 바꿉니다"
  },
  {
    "id": "picture",
    "title": "4. 퍼지는 전하와 제자리에 남는 전하를 나눕니다"
  },
  {
    "id": "why",
    "title": "5. 한쪽으로 퍼지는 설명만으로는 평형이 나오지 않습니다"
  },
  {
    "id": "diffusion",
    "title": "6. 퍼짐·빈 경계·내부 전위차에 이름을 붙입니다"
  },
  {
    "id": "bias",
    "title": "7. 같은 경계에 +0.5·+0.6·−0.5 V를 차례로 겁니다"
  },
  {
    "id": "calculation",
    "title": "8. 원문의 두 전류 성분을 합쳐 같은 사례에 넣습니다"
  },
  {
    "id": "ratio",
    "title": "9. 같은 원문의 지수 항으로 약 48배를 검산합니다"
  },
  {
    "id": "limits",
    "title": "10. 켜짐의 기준과 이상식의 범위를 분리합니다"
  },
  {
    "id": "handoff",
    "title": "11. 방향과 전압을 바꾼 결과를 예측해 봅니다"
  }
],
    component: () => import("@/pages/articles/devices/pn-junction-and-rectification"),
  },
  {
    slug: "mos-capacitor-and-inversion",
    title: "전극을 닿지 않게 놓아도 실리콘 표면이 바뀝니다",
    subcategory: "field-effect-devices",
    sections: [
  {
    "id": "overview",
    "title": "1. 전하가 건너는 길을 막아도 표면을 조절할 수 있습니다"
  },
  {
    "id": "outside",
    "title": "2. 전극 전압을 입력으로, 표면 전하를 결과로 읽습니다"
  },
  {
    "id": "case",
    "title": "3. 10 nm와 100 µm²의 작은 면을 고릅니다"
  },
  {
    "id": "picture",
    "title": "4. 제어하는 전극과 전하가 모이는 자리는 떨어져 있습니다"
  },
  {
    "id": "why",
    "title": "5. 두께만으로 전자 수를 정할 수 없습니다"
  },
  {
    "id": "stack",
    "title": "6. 세 층의 구조에 MOS라는 이름을 붙입니다"
  },
  {
    "id": "states",
    "title": "7. 같은 표면을 낮은 전압에서 높은 전압으로 따라갑니다"
  },
  {
    "id": "numbers",
    "title": "8. 원문의 면적당 식에 면적과 여분 전압을 넣습니다"
  },
  {
    "id": "source-supply",
    "title": "9. 원문이 둔 전자 공급 조건까지 같이 가져옵니다"
  },
  {
    "id": "limits",
    "title": "10. 치수와 전압을 바꾸면 무엇을 다시 확인해야 할까요?"
  },
  {
    "id": "handoff",
    "title": "11. 그림과 단위를 써서 다음 결과를 예측합니다"
  }
],
    component: () => import("@/pages/articles/devices/mos-capacitor-and-inversion"),
  },
  {
    slug: "mosfet-regions-and-transfer",
    title: "문 하나로 두 단자 사이의 전류를 조절합니다",
    subcategory: "field-effect-devices",
    sections: [
  {
    "id": "overview",
    "title": "1. 같은 전극 전압에서 흐름이 왜 더는 늘지 않을까요?"
  },
  {
    "id": "outside",
    "title": "2. 두 전압을 정하고 하나의 전류를 읽습니다"
  },
  {
    "id": "case",
    "title": "3. 한 소자에서 세 전압을 비교합니다"
  },
  {
    "id": "picture",
    "title": "4. 출구 쪽 표면에는 전자가 덜 모입니다"
  },
  {
    "id": "why",
    "title": "5. 전하를 모으는 역할과 이동시키는 역할이 모두 필요합니다"
  },
  {
    "id": "terminals",
    "title": "6. 조절·공급·수집·바탕의 역할에 이름을 붙입니다"
  },
  {
    "id": "channel",
    "title": "7. 같은 길에서 위치에 따른 전하량을 읽습니다"
  },
  {
    "id": "states",
    "title": "8. 0.2·1.0·1.5 V에서 길의 끝을 비교합니다"
  },
  {
    "id": "current",
    "title": "9. 원문의 국소 전하를 적분해 0.18 mA를 얻습니다"
  },
  {
    "id": "source-limit",
    "title": "10. 원문이 경계 부근에서 근사를 경고하는 이유입니다"
  },
  {
    "id": "limits",
    "title": "11. 실제 소자에서 다시 확인할 조건입니다"
  },
  {
    "id": "handoff",
    "title": "12. 영역과 전류를 예측하고 에너지로 넘어갑니다"
  }
],
    component: () => import("@/pages/articles/devices/mosfet-regions-and-transfer"),
  },
  {
    slug: "switching-energy-and-leakage",
    title: "한 번 뒤집는 에너지와 멈춰 있어도 새는 전류",
    subcategory: "field-effect-devices",
    sections: [
  {
    "id": "overview",
    "title": "1. 한 번 뒤집는 비용과 가만히 두는 비용을 따로 셉니다"
  },
  {
    "id": "outside",
    "title": "2. 출력의 변화 횟수와 공급선의 전력을 비교합니다"
  },
  {
    "id": "case",
    "title": "3. 3.3 V 출력 하나가 초당 10만 번 왕복합니다"
  },
  {
    "id": "picture",
    "title": "4. 위쪽 길은 채우고 아래쪽 길은 비웁니다"
  },
  {
    "id": "why",
    "title": "5. 저장된 에너지와 공급한 에너지를 구별해야 합니다"
  },
  {
    "id": "two-paths",
    "title": "6. 두 길과 출력 반전에 이름을 붙입니다"
  },
  {
    "id": "energy-ledger",
    "title": "7. 33 pC와 108.9 pJ의 행방을 끝까지 좇습니다"
  },
  {
    "id": "source-integral",
    "title": "8. 원문의 충전·방전 식에 같은 숫자를 넣습니다"
  },
  {
    "id": "activity",
    "title": "9. 원문의 주기당 비용을 초당 횟수로 바꿉니다"
  },
  {
    "id": "limits",
    "title": "10. 전압을 바꾼 뒤에는 속도와 누설을 다시 확인합니다"
  },
  {
    "id": "handoff",
    "title": "11. 같은 장부로 다음 결과를 예측합니다"
  }
],
    component: () => import("@/pages/articles/devices/switching-energy-and-leakage"),
  },
];
