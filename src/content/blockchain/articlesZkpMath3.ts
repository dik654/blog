import type { Article } from "../types";

// 순서: 페어링 최적화 상세 (확장체 이론 아티클에서 참조하는 기법들)
export const zkpMath3Articles: Article[] = [
  {
    slug: "karatsuba",
    title: "Karatsuba: 네 번의 작은 곱을 세 번으로 줄이기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 큰 곱셈 하나를 작은 곱셈 세 개로 만듭니다"
  },
  {
    "id": "black-box",
    "title": "2. 두 정수를 받아 정확한 곱 하나를 돌려줍니다"
  },
  {
    "id": "case",
    "title": "3. 네 번 곱한 결과를 비교 기준으로 둡니다"
  },
  {
    "id": "picture",
    "title": "4. 가운데 두 곱의 합을 한 번에 구합니다"
  },
  {
    "id": "need",
    "title": "5. 덧셈을 늘려도 큰 곱셈을 줄이면 이득일 수 있습니다"
  },
  {
    "id": "names",
    "title": "6. 조각과 자리 기준에 이름을 붙입니다"
  },
  {
    "id": "naive-mul",
    "title": "7. 분배법칙으로 네 곱의 자리 위치를 확인합니다"
  },
  {
    "id": "karatsuba-trick",
    "title": "8. 합의 곱에서 이미 아는 두 항을 뺍니다"
  },
  {
    "id": "trace",
    "title": "9. 세 곱의 결과를 원래 자리에 놓습니다"
  },
  {
    "id": "source",
    "title": "10. GMP 문서는 합 대신 차를 곱합니다"
  },
  {
    "id": "limbs",
    "title": "11. 실제 C 원문의 배열과 부호 분기를 따라갑니다"
  },
  {
    "id": "recursive",
    "title": "12. 깊이는 두 배 기준으로, 작은 곱은 세 배씩 늘어납니다"
  },
  {
    "id": "cost-comparison",
    "title": "13. 전환 크기는 절약한 곱과 추가 비용이 만나는 곳입니다"
  },
  {
    "id": "boundaries",
    "title": "14. 홀수 길이·제곱·확장체에서는 조건을 다시 봅니다"
  },
  {
    "id": "release",
    "title": "15. 정확한 답과 실제 속도를 따로 확인합니다"
  }
],
    component: () => import("@/pages/articles/blockchain/karatsuba"),
  },
  {
    slug: "sparse-multiplication",
    title: "희소 곱셈: 빈 칸을 생략하고 같은 결과를 얻기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 네 칸 중 두 칸이 0이면 그 열의 곱셈을 생략합니다"
  },
  {
    "id": "black-box",
    "title": "2. 입력의 빈 위치를 알고도 일반 곱과 같은 값을 내야 합니다"
  },
  {
    "id": "concrete",
    "title": "3. 같은 여덟 곱을 출력의 여섯 자리에 모읍니다"
  },
  {
    "id": "picture",
    "title": "4. 빈 열과 이동한 두 행을 같은 결과로 연결합니다"
  },
  {
    "id": "need",
    "title": "5. 반복해서 같은 빈 칸이 생기면 전용 계산을 만들 수 있습니다"
  },
  {
    "id": "names",
    "title": "6. 계수의 값과 0 아닌 위치 집합에 이름을 붙입니다"
  },
  {
    "id": "why-sparse",
    "title": "7. 곱할 쌍의 수와 출력의 0 아닌 칸 수를 구분합니다"
  },
  {
    "id": "how-sparse",
    "title": "8. 같은 다항식을 실제 여섯 칸의 순서로 옮깁니다"
  },
  {
    "id": "source",
    "title": "9. 원본 014 함수에 같은 5·7·0을 넣습니다"
  },
  {
    "id": "reduction",
    "title": "10. 빈 칸 하나에 11을 넣으면 높은 항이 되돌아옵니다"
  },
  {
    "id": "twist",
    "title": "11. 같은 세 인자를 034에 넣으면 다른 값을 곱합니다"
  },
  {
    "id": "in-miller",
    "title": "12. 실제 BN254의 선 곱셈은 D형과 034로 연결됩니다"
  },
  {
    "id": "paper-comparison",
    "title": "13. 논문의 같은 세 위치를 원문 중간값에 대입합니다"
  },
  {
    "id": "cost-saving",
    "title": "14. 여덟 부분 곱, 열세 함수 호출, 전체 시간은 다른 장부입니다"
  },
  {
    "id": "boundaries",
    "title": "15. 0을 찾는 분기와 사라진 입력은 별도로 확인합니다"
  },
  {
    "id": "release",
    "title": "16. 같은 값과 위치를 맞춘 뒤 전체 계산을 비교합니다"
  }
],
    component: () =>
      import("@/pages/articles/blockchain/sparse-multiplication"),
  },
  {
    slug: "frobenius-optimization",
    title: "Frobenius: 같은 세제곱을 표로 바꾸고 큰 지수를 나누기",
    subcategory: "zkp-math",
    sections: [
  {
    "id": "overview",
    "title": "1. 세 번 곱할 일을 둘째 숫자 하나의 변경으로 바꿉니다"
  },
  {
    "id": "black-box",
    "title": "2. 같은 두 칸의 값을 받아 세제곱한 두 칸을 돌려줍니다"
  },
  {
    "id": "concrete",
    "title": "3. 1+u를 직접 곱해 1+2u를 얻습니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 입력을 어떤 기저의 두 숫자로 읽는지 표시합니다"
  },
  {
    "id": "need",
    "title": "5. 큰 지수를 반복 계산하는 대신 기저의 변화를 재사용합니다"
  },
  {
    "id": "names",
    "title": "6. p제곱 사상과 특성, 기저에 이름을 붙입니다"
  },
  {
    "id": "coeff-rearrange",
    "title": "7. 가운데 이항계수가 사라져 합을 항별로 세제곱합니다"
  },
  {
    "id": "cycle",
    "title": "8. 두 번 돌아오는 이유와 먼저 고정되는 값을 구분합니다"
  },
  {
    "id": "basis",
    "title": "9. 기저를 바꾸면 첫째 계수도 움직일 수 있습니다"
  },
  {
    "id": "source",
    "title": "10. 실제 코드도 아래 계수를 먼저 처리하고 배율을 곱합니다"
  },
  {
    "id": "why-free",
    "title": "11. 줄어든 것은 일반 거듭제곱이며 남은 일도 있습니다"
  },
  {
    "id": "unitary",
    "title": "12. 같은 값에서 노름 1인 값을 만들면 켤레가 역원이 됩니다"
  },
  {
    "id": "in-final-exp",
    "title": "13. 마지막 큰 지수를 두 쉬운 인수와 남은 인수로 나눕니다"
  },
  {
    "id": "large-case",
    "title": "14. 큰 BN254에서도 같은 절차를 직접 지수와 대조합니다"
  },
  {
    "id": "boundaries",
    "title": "15. 체가 아닌 예의 실패 원인도 나누어 봅니다"
  },
  {
    "id": "release",
    "title": "16. 빠른 표는 같은 값의 직접 계산을 통과해야 합니다"
  }
],
    component: () =>
      import("@/pages/articles/blockchain/frobenius-optimization"),
  },
];
