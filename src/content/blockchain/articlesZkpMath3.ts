import type { Article } from "../types";

// 순서: 페어링 최적화 상세 (확장체 이론 아티클에서 참조하는 기법들)
export const zkpMath3Articles: Article[] = [
  {
    slug: "karatsuba",
    title: "Karatsuba: 세 곱 재결합·재귀·cutoff",
    subcategory: "zkp-math",
    sections: [
      { id: "overview", title: "문제와 세 곱 아이디어" },
      { id: "naive-mul", title: "Schoolbook 네 곱 기준선" },
      { id: "karatsuba-trick", title: "세 곱 유도와 수치 예제" },
      { id: "recursive", title: "재귀 정리·적용 경계" },
      { id: "cost-comparison", title: "Cutoff·비용·benchmark" },
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
