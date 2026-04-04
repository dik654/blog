import type { Article } from '../types';
import { dlNlpArticles } from './articlesDL2';
import { dlFoundation2Articles, dlVisionArticles } from './articlesDL3';

// ── Foundations (읽기 순서: 퍼셉트론 → 신경망 → 역전파 → 활성화 → 옵티마이저 → 크로스엔트로피 → FFT → Word2Vec) ──
export const dlFoundationArticles: Article[] = [
  {
    slug: 'perceptron',
    title: '퍼셉트론: 신경망의 기원',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '퍼셉트론이란' },
      { id: 'logic-gates', title: '논리 회로 구현' },
      { id: 'limitation', title: '퍼셉트론의 한계' },
      { id: 'multilayer', title: '다층 퍼셉트론' },
    ],
    component: () => import('@/pages/articles/ai/perceptron'),
  },
  {
    slug: 'neural-network',
    title: '신경망: 퍼셉트론에서 다층 네트워크로',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '퍼셉트론에서 신경망으로' },
      { id: 'activation', title: '활성화 함수' },
      { id: 'forward', title: '3층 신경망 순전파' },
      { id: 'output-layer', title: '출력층 설계' },
      { id: 'mnist', title: '손글씨 숫자 인식' },
    ],
    component: () => import('@/pages/articles/ai/neural-network'),
  },
  {
    slug: 'backprop-optimization',
    title: '역전파 & 최적화: 신경망 학습의 핵심',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '왜 역전파인가' },
      { id: 'forward-pass', title: '순전파: 뉴런의 선형 모델' },
      { id: 'softmax', title: '소프트맥스: 숫자→확률' },
      { id: 'cross-entropy', title: '교차 엔트로피 손실' },
      { id: 'chain-rule', title: '연쇄 법칙' },
      { id: 'backprop-derivation', title: '역전파 수식 전개' },
      { id: 'gradient-update', title: '경사 하강법 업데이트' },
      { id: 'loss-function', title: '손실 함수 비교' },
      { id: 'regularization', title: '정규화 기법' },
    ],
    component: () => import('@/pages/articles/ai/backprop-optimization'),
  },
  {
    slug: 'activation-functions',
    title: '활성화 함수: 비선형성의 진화',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '활성화 함수가 왜 필요한가' },
      { id: 'step-function', title: '계단 함수' },
      { id: 'sigmoid', title: '시그모이드' },
      { id: 'tanh', title: '하이퍼볼릭 탄젠트' },
      { id: 'relu', title: 'ReLU' },
      { id: 'relu-variants', title: 'ReLU 변형들' },
      { id: 'comparison', title: '비교 & 선택 가이드' },
    ],
    component: () => import('@/pages/articles/ai/activation-functions'),
  },
  {
    slug: 'optimizers',
    title: '옵티마이저: SGD에서 AdamW까지',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '경사 하강법 & 옵티마이저 개요' },
      { id: 'sgd', title: 'SGD (확률적 경사 하강법)' },
      { id: 'batch-variants', title: 'Batch / Stochastic / Mini-batch' },
      { id: 'momentum', title: 'Momentum (관성)' },
      { id: 'adam', title: 'Adam (적응적 학습률)' },
      { id: 'adamw', title: 'AdamW (Decoupled Weight Decay)' },
    ],
    component: () => import('@/pages/articles/ai/optimizers'),
  },
  {
    slug: 'cross-entropy',
    title: '크로스 엔트로피: 정보 이론에서 손실 함수로',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '확률과 정보' },
      { id: 'expectation', title: '기대값: 확률을 곱한 예상치' },
      { id: 'entropy', title: '엔트로피: 불확실성의 척도' },
      { id: 'cross-entropy', title: '크로스 엔트로피: 두 분포의 괴리' },
      { id: 'ce-vs-mse', title: 'CE vs MSE' },
      { id: 'softmax-ce-gradient', title: 'Softmax + CE 미분' },
      { id: 'kl-divergence', title: 'KL Divergence' },
    ],
    component: () => import('@/pages/articles/ai/cross-entropy'),
  },
  {
    slug: 'fft',
    title: 'FFT (Fast Fourier Transform) — AI 관점',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: 'FFT란?' },
      { id: 'fourier', title: '푸리에 변환 직관' },
      { id: 'algorithm', title: 'Cooley-Tukey 알고리즘' },
      { id: 'ai-usage', title: 'AI에서의 FFT 활용' },
    ],
    component: () => import('@/pages/articles/ai/fft'),
  },
  {
    slug: 'word2vec',
    title: 'Word2Vec: 단어 임베딩의 원리',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '개요 & 분산 가설' },
      { id: 'models', title: 'Skip-gram & CBOW 모델' },
      { id: 'training', title: '학습 최적화 기법' },
      { id: 'applications', title: '응용 & LLM 연결' },
    ],
    component: () => import('@/pages/articles/ai/word2vec'),
  },
];

/** Combined DL articles: foundations + foundation2 + NLP + vision */
export const dlArticles: Article[] = [
  ...dlFoundationArticles,
  ...dlFoundation2Articles,
  ...dlNlpArticles,
  ...dlVisionArticles,
];
