import type { Article } from "../types";

export const circuitsArticles: Article[] = [
  {
    slug: "lumped-circuit-and-conservation",
    title: "회로를 선과 점으로 줄여도 되는 이유",
    subcategory: "circuit-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 갈라지는 길의 숫자를 어떻게 함께 정할까요?"
  },
  {
    "id": "outside",
    "title": "2. 넣는 조건과 얻을 답부터 나눕니다"
  },
  {
    "id": "case",
    "title": "3. 12에서 시작하는 세 부품만 놓습니다"
  },
  {
    "id": "picture",
    "title": "4. 갈림길과 되돌아오는 길을 그립니다"
  },
  {
    "id": "why",
    "title": "5. 갈림길 조건 하나로는 답이 정해지지 않습니다"
  },
  {
    "id": "small-circuit",
    "title": "6. 흐름·차이·부품에 이름과 단위를 붙입니다"
  },
  {
    "id": "solve",
    "title": "7. 갈림길 하나를 구해 세 흐름을 끝까지 따라갑니다"
  },
  {
    "id": "junction",
    "title": "8. 원문의 전하 보존 조건에 6·3·3을 넣습니다"
  },
  {
    "id": "loop",
    "title": "9. 원문의 한 바퀴 조건에 12·6·6을 넣습니다"
  },
  {
    "id": "power",
    "title": "10. 에너지의 합으로 별도 검산합니다"
  },
  {
    "id": "limits",
    "title": "11. 점과 선으로 줄일 수 없는 순간을 구분합니다"
  },
  {
    "id": "handoff",
    "title": "12. 하나를 바꾼 결과를 먼저 예측해 봅니다"
  }
],
    component: () =>
      import("@/pages/articles/circuits/lumped-circuit-and-conservation"),
  },
  {
    slug: "resistance-and-power-dissipation",
    title: "저항을 합친 뒤 각 부품의 열을 다시 세는 이유",
    subcategory: "circuit-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 바꾸지 않은 부품이 더 뜨거워질 수 있습니다"
  },
  {
    "id": "outside",
    "title": "2. 세 부품을 상자 하나로 보고 다시 엽니다"
  },
  {
    "id": "case",
    "title": "3. 오른쪽의 2를 1로 바꿉니다"
  },
  {
    "id": "picture",
    "title": "4. 함께 지나는 길과 나눠 지나는 길을 구분합니다"
  },
  {
    "id": "why",
    "title": "5. 입구에서 같다는 조건을 먼저 정합니다"
  },
  {
    "id": "names",
    "title": "6. 역할에 맞춰 직렬·병렬·등가라는 이름을 씁니다"
  },
  {
    "id": "two-paths",
    "title": "7. 두 갈래를 줄이고 다시 펼쳐 7.2·2.4·4.8을 얻습니다"
  },
  {
    "id": "heat",
    "title": "8. 원문의 전력식에 각 부품의 숫자를 따로 넣습니다"
  },
  {
    "id": "rating",
    "title": "9. 실제 표의 두 허용값을 같은 단위로 비교합니다"
  },
  {
    "id": "limits",
    "title": "10. 허용차와 장착 조건을 바꿔 다시 판단합니다"
  }
],
    component: () => import("@/pages/articles/circuits/resistance-and-power-dissipation"),
  },
  {
    slug: "storage-elements-and-transients",
    title: "전하와 자기장을 담으면 변화에 시간이 걸립니다",
    subcategory: "circuit-dynamics",
    sections: [
  {
    "id": "overview",
    "title": "1. 켠 직후와 오래 뒤를 이어 계산합니다"
  },
  {
    "id": "outside",
    "title": "2. 상자에는 입력뿐 아니라 이전 상태도 필요합니다"
  },
  {
    "id": "case",
    "title": "3. 처음 0 V인 두 판에 5 V를 연결합니다"
  },
  {
    "id": "picture",
    "title": "4. 공급·통로·저장·관측 위치를 따로 봅니다"
  },
  {
    "id": "why",
    "title": "5. 유한한 속도로 채우므로 시간이 듭니다"
  },
  {
    "id": "capacitor",
    "title": "6. 두 판의 저장 성질을 축전기와 정전용량으로 부릅니다"
  },
  {
    "id": "trace",
    "title": "7. 0 V에서 1 ms와 3 ms까지 같은 회로를 따라갑니다"
  },
  {
    "id": "rc",
    "title": "8. 원문의 변화식을 적분해 3.16 V와 1% 시간을 얻습니다"
  },
  {
    "id": "inductor",
    "title": "9. 저장 방식을 바꾸면 원문에서 이어지는 변수도 바뀝니다"
  },
  {
    "id": "boundary",
    "title": "10. 저항을 늘렸을 때 두 시간이 반대로 바뀌는 이유를 봅니다"
  },
  {
    "id": "handoff",
    "title": "11. 다음 상태를 식 없이 먼저 예측해 봅니다"
  }
],
    component: () => import("@/pages/articles/circuits/storage-elements-and-transients"),
  },
  {
    slug: "steady-state-and-impedance",
    title: "반복 신호에서는 크기와 늦는 각도를 함께 셉니다",
    subcategory: "circuit-dynamics",
    sections: [
  {
    "id": "overview",
    "title": "1. 계속 흔들리는 출력은 크기와 늦는 양으로 봅니다"
  },
  {
    "id": "outside",
    "title": "2. 한 번 켠 반응이 잦아든 뒤 상자를 봅니다"
  },
  {
    "id": "case",
    "title": "3. 1 ms에 반응하던 같은 회로를 계속 흔듭니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 흐름이 지나도 두 부품의 전압은 다르게 움직입니다"
  },
  {
    "id": "why",
    "title": "5. 5 V를 크기만으로 나누면 시차를 잃습니다"
  },
  {
    "id": "wave",
    "title": "6. 반복 속도와 진폭, 정상 상태를 구분합니다"
  },
  {
    "id": "trace",
    "title": "7. 입력의 봉우리에서 출력의 봉우리까지 따라갑니다"
  },
  {
    "id": "complex",
    "title": "8. 원문에서 미분을 크기와 각도의 곱셈으로 바꿉니다"
  },
  {
    "id": "divider",
    "title": "9. 원문의 전압 분배에 같은 두 부품을 넣습니다"
  },
  {
    "id": "limits",
    "title": "10. 한 주파수로 요약할 수 있는 범위를 확인합니다"
  },
  {
    "id": "handoff",
    "title": "11. 반복 속도를 바꾼 답을 먼저 예상해 봅니다"
  }
],
    component: () => import("@/pages/articles/circuits/steady-state-and-impedance"),
  },
  {
    slug: "frequency-shaping-and-bode",
    title: "느린 신호와 빠른 신호를 나누는 주파수 지도",
    subcategory: "circuit-dynamics",
    sections: [
  {
    "id": "overview",
    "title": "1. 느린 변화와 빠른 변화에 다른 크기로 답하는 회로를 읽습니다"
  },
  {
    "id": "outside",
    "title": "2. 상자를 통과하기 전후의 비를 잽니다"
  },
  {
    "id": "case",
    "title": "3. 같은 부품에 세 가지 반복 속도를 넣습니다"
  },
  {
    "id": "picture",
    "title": "4. 속도를 바꿔도 출력점은 같은 자리에 둡니다"
  },
  {
    "id": "why",
    "title": "5. 열 배 간격을 같은 거리로 그리는 이유가 있습니다"
  },
  {
    "id": "names",
    "title": "6. 통과 방향과 눈금에 이름을 붙입니다"
  },
  {
    "id": "corner",
    "title": "7. 1 ms에서 159.15 Hz를 구해 세 출력을 잇습니다"
  },
  {
    "id": "db",
    "title": "8. 전압비를 로그 눈금으로 옮긴 뒤 원래 값으로 돌립니다"
  },
  {
    "id": "plot",
    "title": "9. 원문 식으로 정확한 곡선과 근사 기울기를 대조합니다"
  },
  {
    "id": "other-output",
    "title": "10. 원문의 연결 그림에서 출력 부품을 바꿔 봅니다"
  },
  {
    "id": "limits",
    "title": "11. 연결한 부하까지 포함해 통과 범위를 판단합니다"
  }
],
    component: () => import("@/pages/articles/circuits/frequency-shaping-and-bode"),
  },
  {
    slug: "feedback-gain-and-stability",
    title: "되먹임은 이득을 고치면서 흔들림도 바꿉니다",
    subcategory: "circuit-dynamics",
    sections: [
  {
    "id": "overview",
    "title": "1. 크게 키우는 장치로 원하는 배율을 만듭니다"
  },
  {
    "id": "outside",
    "title": "2. 결과를 다시 읽어 남은 차이만 키웁니다"
  },
  {
    "id": "case",
    "title": "3. 출력의 10%를 돌려보내는 1 V 입력을 고릅니다"
  },
  {
    "id": "picture",
    "title": "4. 비교하는 곳과 되돌리는 길을 나눠 봅니다"
  },
  {
    "id": "why",
    "title": "5. 배율을 정하는 조건과 늦는 정도를 함께 봐야 합니다"
  },
  {
    "id": "names",
    "title": "6. 되먹임의 경로와 배율에 이름을 붙입니다"
  },
  {
    "id": "loop",
    "title": "7. 같은 1 V가 9.09 V에 머무는 경로를 풉니다"
  },
  {
    "id": "source-gain",
    "title": "8. 실제 자료의 식에서 유한한 배율의 오차를 읽습니다"
  },
  {
    "id": "delay",
    "title": "9. 두 지연을 식에 넣고 원문의 교차 조건을 적용합니다"
  },
  {
    "id": "margin",
    "title": "10. 원문의 위상 여유에 두 지연 각도를 대입합니다"
  },
  {
    "id": "limits",
    "title": "11. 모델의 여유와 실제 부하의 안정성을 구분합니다"
  }
],
    component: () => import("@/pages/articles/circuits/feedback-gain-and-stability"),
  },
];
