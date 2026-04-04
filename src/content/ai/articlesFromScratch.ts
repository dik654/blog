import type { Article } from '../types';

export const fromScratchArticles: Article[] = [
  {
    slug: 'dezero-autodiff',
    title: '자동 미분 엔진 구현 (Rust)',
    subcategory: 'ai-from-scratch',
    sections: [
      { id: 'overview', title: 'Variable & 계산 그래프' },
      { id: 'forward', title: '순전파 구현' },
      { id: 'backward', title: '역전파 & 그래디언트 누적' },
      { id: 'higher-order', title: '고차 미분 (double backprop)' },
      { id: 'memory', title: 'Rc/RefCell 메모리 관리' },
    ],
    component: () => import('@/pages/articles/ai/dezero-autodiff'),
  },
  {
    slug: 'dezero-nn',
    title: '신경망 레이어 구현 (Rust)',
    subcategory: 'ai-from-scratch',
    sections: [
      { id: 'overview', title: 'Layer 트레이트 설계' },
      { id: 'linear', title: 'Linear (전결합) 레이어' },
      { id: 'activation', title: '활성화 함수 (ReLU, Sigmoid, Tanh)' },
      { id: 'optimizer', title: '옵티마이저 (SGD, Adam)' },
      { id: 'training', title: '학습 루프 & 손실 함수' },
    ],
    component: () => import('@/pages/articles/ai/dezero-nn'),
  },
  {
    slug: 'dezero-advanced',
    title: 'LSTM · 정규화 · Embedding 구현 (Rust)',
    subcategory: 'ai-from-scratch',
    sections: [
      { id: 'overview', title: '시퀀스 모델 개요' },
      { id: 'rnn-vs-lstm', title: 'RNN → LSTM 비교' },
      { id: 'lstm', title: 'LSTM 셀 구현' },
      { id: 'normalization', title: 'LayerNorm 구현' },
      { id: 'dropout-embedding', title: 'Dropout & Embedding' },
    ],
    component: () => import('@/pages/articles/ai/dezero-advanced'),
  },
];
