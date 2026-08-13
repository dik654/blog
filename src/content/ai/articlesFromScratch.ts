import type { Article } from "../types";

export const fromScratchArticles: Article[] = [
  {
    slug: "dezero-autodiff",
    title: "Rust로 자동 미분 엔진 만들기",
    subcategory: "ai-from-scratch",
    sections: [
      { id: "overview", title: "값과 계산 이력" },
      { id: "forward", title: "순전파와 그래프 기록" },
      { id: "backward", title: "역전파와 gradient 누적" },
      { id: "higher-order", title: "고차 미분" },
      { id: "memory", title: "Rust 소유권과 그래프 수명" },
    ],
    component: () => import("@/pages/articles/ai/dezero-autodiff"),
  },
  {
    slug: "dezero-nn",
    title: "Rust로 신경망 학습 루프 만들기",
    subcategory: "ai-from-scratch",
    sections: [
      { id: "overview", title: "파라미터와 학습 상태" },
      { id: "linear", title: "Linear layer와 shape" },
      { id: "activation", title: "Activation과 gradient" },
      { id: "optimizer", title: "SGD·Adam 상태" },
      { id: "training", title: "Loss와 학습 루프" },
    ],
    component: () => import("@/pages/articles/ai/dezero-nn"),
  },
  {
    slug: "dezero-advanced",
    title: "Rust로 상태가 있는 신경망 레이어 만들기",
    subcategory: "ai-from-scratch",
    sections: [
      { id: "overview", title: "시간 상태와 실행 모드" },
      { id: "rnn-vs-lstm", title: "RNN과 LSTM의 상태 경로" },
      { id: "lstm", title: "LSTM cell" },
      { id: "normalization", title: "LayerNorm" },
      { id: "dropout-embedding", title: "Dropout과 Embedding" },
    ],
    component: () => import("@/pages/articles/ai/dezero-advanced"),
  },
];
