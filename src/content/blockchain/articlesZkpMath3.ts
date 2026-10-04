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
    title: "Sparse multiplication: support·Fp¹²·Miller 비용",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Support-aware 곱셈" },
      { id: "why-sparse", title: "희소 표현·convolution 예제" },
      { id: "how-sparse", title: "Fp¹² tower slot 경계" },
      { id: "cost-saving", title: "비용 모델·Amdahl 상한" },
      { id: "in-miller", title: "Miller lowering·release gate" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/sparse-multiplication"),
  },
  {
    slug: "frobenius-optimization",
    title: "Frobenius: p제곱 자기동형·table·final exp",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "Characteristic p에서 시작" },
      { id: "coeff-rearrange", title: "Automorphism·cycle 증명" },
      { id: "why-free", title: "Basis table과 비용 경계" },
      { id: "in-final-exp", title: "Final exponent 분해" },
      { id: "concrete", title: "F3² 예제·release gate" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/frobenius-optimization"),
  },
];
