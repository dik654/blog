import type { Article } from '../types';

const paperSections = [
  { id: 'context', title: '논문의 질문과 이전 병목' },
  { id: 'claim', title: '주장과 계산 흐름' },
  { id: 'mechanism', title: '핵심 수식과 구현 의미' },
  { id: 'evidence', title: '실험과 증거의 경계' },
  { id: 'reproduction', title: '재현과 실패 진단' },
  { id: 'legacy', title: '유산과 다음 읽기' },
];

export const foundationPaperArticles: Article[] = [
  {
    slug: 'paper-perceptron-1958',
    title: '1958 Perceptron: 학습 가능한 연결의 시작',
    subcategory: 'ai-foundations',
    sections: paperSections,
    summary: 'Rosenblatt가 감각, 기억, 행동을 어떤 학습 시스템으로 연결하려 했는지 원 논문의 질문부터 현대 퍼셉트론 식까지 복원합니다.',
    level: '심화', estimatedMinutes: 42, prerequisites: ['퍼셉트론 글'],
    component: () => import('@/pages/articles/ai/paper-perceptron-1958'),
  },
  {
    slug: 'paper-backprop-1986',
    title: '1986 Backpropagation: Hidden Representation을 학습하다',
    subcategory: 'ai-foundations', sections: paperSections,
    summary: '출력 오차를 내부 연결의 책임으로 분해해 hidden unit이 과제의 특징을 학습하게 만든 논리를 재구성합니다.',
    level: '심화', estimatedMinutes: 48, prerequisites: ['신경망', '역전파'],
    component: () => import('@/pages/articles/ai/paper-backprop-1986'),
  },
  {
    slug: 'paper-adam-2014',
    title: '2014 Adam: 두 Moment로 Update를 만들다',
    subcategory: 'ai-foundations', sections: paperSections,
    summary: 'Gradient의 방향과 제곱 크기를 기억하고 초기 편향을 보정하는 Adam의 상태를 논문 수식과 재현 순서로 읽습니다.',
    level: '심화', estimatedMinutes: 46, prerequisites: ['역전파', '옵티마이저'],
    component: () => import('@/pages/articles/ai/paper-adam-2014'),
  },
  {
    slug: 'paper-adamw-2017',
    title: '2017 AdamW: Weight Decay를 분리하다',
    subcategory: 'ai-foundations', sections: paperSections,
    summary: 'Adaptive optimizer에서 L2 penalty와 weight decay가 같지 않은 이유와 decoupled update의 구현 경계를 복원합니다.',
    level: '심화', estimatedMinutes: 44, prerequisites: ['Adam 논문 글'],
    component: () => import('@/pages/articles/ai/paper-adamw-2017'),
  },
  {
    slug: 'paper-autoencoder-2006',
    title: '2006 Deep Autoencoder: 비선형 차원 축소',
    subcategory: 'ai-foundations', sections: paperSections,
    summary: 'Deep autoencoder가 PCA와 무엇이 달랐고 당시 layer-wise pretraining이 왜 필요했는지를 실험 주장과 함께 읽습니다.',
    level: '심화', estimatedMinutes: 45, prerequisites: ['오토인코더 글'],
    component: () => import('@/pages/articles/ai/paper-autoencoder-2006'),
  },
  {
    slug: 'paper-fft-1965',
    title: '1965 Cooley–Tukey FFT: 변환은 같고 계산을 줄이다',
    subcategory: 'ai-foundations', sections: paperSections,
    summary: 'DFT를 바꾸지 않고 index factorization과 butterfly로 중복 계산을 재사용한 알고리즘을 복원합니다.',
    level: '심화', estimatedMinutes: 46, prerequisites: ['FFT 글'],
    component: () => import('@/pages/articles/ai/paper-fft-1965'),
  },
  {
    slug: 'paper-word2vec-2013',
    title: '2013 Word2Vec: 대규모 문맥 예측으로 벡터를 배우다',
    subcategory: 'ai-nlp', sections: paperSections,
    summary: 'CBOW와 Skip-gram이 기존 neural language model의 계산 병목을 어떻게 줄이고 word vector를 학습했는지 읽습니다.',
    level: '심화', estimatedMinutes: 47, prerequisites: ['Word2Vec 글'], learningPath: 'ai-nlp-paper-spine',
    component: () => import('@/pages/articles/ai/paper-word2vec-2013'),
  },
];
