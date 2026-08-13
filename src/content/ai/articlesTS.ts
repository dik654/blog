import type { Article } from "../types";

export const tsArticles: Article[] = [
  {
    slug: "arima",
    title: "ARIMA: 시계열 예측의 해석 가능한 기준선",
    subcategory: "ai-timeseries",
    sections: [
      { id: "overview", title: "ARIMA가 설명하는 것" },
      { id: "components", title: "p, d, q의 역할" },
      { id: "modeling", title: "시간 순서 모델링과 검증" },
      { id: "applications", title: "SARIMA 확장과 선택 기준" },
    ],
    component: () => import("@/pages/articles/ai/arima"),
  },
  {
    slug: "lstm-timeseries",
    title: "LSTM 시계열 예측: window 설계부터 검증까지",
    subcategory: "ai-timeseries",
    sections: [
      { id: "overview", title: "Forecast contract와 window" },
      { id: "cell-architecture", title: "Tensor·state·horizon 계약" },
      { id: "training", title: "누출 없는 학습" },
      { id: "applications", title: "Rolling 평가와 모델 선택" },
    ],
    component: () => import("@/pages/articles/ai/lstm-timeseries"),
  },
  {
    slug: "ecod",
    title: "ECOD: ECDF로 시작하는 tabular 이상 탐지",
    subcategory: "ai-practical-tabular",
    sections: [
      { id: "overview", title: "Detection contract" },
      { id: "algorithm", title: "ECDF와 원 논문 score" },
      { id: "implementation", title: "PyOD 구현과 threshold" },
      { id: "comparison", title: "실패 조건과 평가" },
    ],
    component: () => import("@/pages/articles/ai/ecod"),
  },
];
