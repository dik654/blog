import type { Article } from '../types';
import { dlNlpArticles } from './articlesDL2';
import { dlFoundation2Articles, dlVisionArticles } from './articlesDL3';
import { foundationPaperArticles } from './articlesFoundationPapers';

// ── Foundations ──
export const dlFoundationArticles: Article[] = [
  {
    slug: 'perceptron',
    title: '퍼셉트론: 신경망의 기원',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '가중합과 결정 규칙' },
      { id: 'decision-boundary', title: '결정 경계' },
      { id: 'learning-rule', title: '퍼셉트론 학습 규칙' },
      { id: 'xor-limit', title: 'XOR과 선형 분리 한계' },
      { id: 'handoff', title: '다층 신경망으로' },
    ],
    summary: '가중합과 편향이 하나의 선형 결정 경계를 만드는 과정에서 신경망의 가장 작은 계산 단위를 시작합니다.',
    level: '입문',
    estimatedMinutes: 32,
    prerequisites: ['사칙연산', '좌표평면과 직선'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/perceptron'),
  },
  {
    slug: 'neural-network',
    title: '신경망: 퍼셉트론에서 다층 네트워크로',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: 'Layer와 함수 합성' },
      { id: 'tensor-shapes', title: 'Tensor shape와 batch' },
      { id: 'forward', title: '숫자로 보는 순전파' },
      { id: 'output-layer', title: 'Task별 출력층' },
      { id: 'implementation', title: '구현과 shape 검산' },
    ],
    summary: '층마다 tensor shape를 검산하고, 비선형성이 선형층의 붕괴를 막는 이유부터 숫자 순전파와 task별 출력 head까지 연결합니다.',
    level: '기초',
    estimatedMinutes: 36,
    prerequisites: ['퍼셉트론의 가중합과 편향', '벡터와 행렬의 shape'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/neural-network'),
  },
  {
    slug: 'activation-functions',
    title: '활성화 함수: 비선형성의 진화',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '순전파 값과 국소 기울기' },
      { id: 'function-and-gradient', title: '함수값과 도함수 탐색' },
      { id: 'families', title: '현대 활성화 함수군' },
      { id: 'gradient-flow', title: 'Gradient 실패 모드' },
      { id: 'selection', title: '선택과 진단 기준' },
    ],
    summary: '비선형성이 왜 필요한지부터 포화와 기울기 흐름까지, 활성화 함수 선택이 학습에 미치는 영향을 비교합니다.',
    level: '기초',
    estimatedMinutes: 38,
    prerequisites: ['신경망의 선형층', '함수와 기울기의 직관'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/activation-functions'),
  },
  {
    slug: 'cross-entropy',
    title: '크로스 엔트로피: 정보 이론에서 손실 함수로',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '확률에서 정보량으로' },
      { id: 'likelihood-to-loss', title: 'Likelihood에서 NLL로' },
      { id: 'numeric-example', title: '정답 확률과 loss' },
      { id: 'softmax-gradient', title: 'Softmax + CE gradient' },
      { id: 'numerical-stability', title: '수치 안정성과 구현' },
      { id: 'entropy-kl-practice', title: 'Entropy, KL, 실전 점검' },
    ],
    summary: '확률과 likelihood에서 p-y까지 유도하고, CE·MSE의 gradient 차이, soft target의 loss 바닥과 LLM perplexity까지 연결합니다.',
    level: '기초',
    estimatedMinutes: 62,
    prerequisites: ['확률분포의 기초', '로그 함수', 'softmax의 출력'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/cross-entropy'),
  },
  {
    slug: 'backprop-optimization',
    title: '역전파: 손실에서 모든 기울기까지',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '역전파가 계산하는 것' },
      { id: 'computational-graph', title: '계산 그래프' },
      { id: 'chain-rule', title: '연쇄 법칙과 gradient 합산' },
      { id: 'reverse-mode', title: 'Reverse-mode autodiff' },
      { id: 'layer-backprop', title: '한 층의 tensor backward' },
      { id: 'autograd-practice', title: 'Autograd 구현과 검증' },
    ],
    summary: '출력의 오차를 계산 그래프의 역순으로 전달해 모든 파라미터 gradient를 구하는 reverse-mode autodiff를 추적합니다.',
    level: '중급',
    estimatedMinutes: 52,
    prerequisites: ['신경망 순전파', '활성화 함수의 미분', '크로스 엔트로피', '연쇄 법칙'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/backprop-optimization'),
  },
  {
    slug: 'optimizers',
    title: '옵티마이저: SGD에서 AdamW까지',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: 'Gradient에서 update로' },
      { id: 'batch-variants', title: 'Mini-batch와 gradient noise' },
      { id: 'sgd', title: 'Optimizer trajectory 비교' },
      { id: 'momentum', title: 'Momentum의 기억' },
      { id: 'adam', title: 'Adam의 좌표별 state' },
      { id: 'adamw', title: 'AdamW와 실전 선택' },
    ],
    summary: '같은 기울기에서도 SGD, Momentum, Adam, AdamW가 서로 다른 업데이트를 만드는 이유를 상태와 수식으로 봅니다.',
    level: '중급',
    estimatedMinutes: 50,
    prerequisites: ['역전파와 gradient', '학습률', 'mini-batch'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/optimizers'),
  },
  {
    slug: 'foundation-training-step',
    title: '한 Training Step 원장: Forward에서 Update 검산까지',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'contract', title: '같은 숫자의 학습 계약' },
      { id: 'ledger', title: 'Training Step Explorer' },
      { id: 'derivation', title: '수식과 연산 선택 이유' },
      { id: 'implementation', title: '구현 순서와 검증' },
    ],
    summary: '한 binary sample의 입력, logit, 확률, BCE, gradient, SGD update와 새 loss를 같은 숫자로 끝까지 추적합니다.',
    level: '중급',
    estimatedMinutes: 44,
    prerequisites: ['신경망 순전파', '크로스 엔트로피', '역전파', 'SGD'],
    learningPath: 'ai-foundations-core',
    component: () => import('@/pages/articles/ai/foundation-training-step'),
  },
  {
    slug: 'fft',
    title: 'FFT (Fast Fourier Transform) — AI 관점',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '시간과 주파수 표현' },
      { id: 'dft', title: 'DFT와 complex projection' },
      { id: 'algorithm', title: 'FFT의 재사용 구조' },
      { id: 'sampling-stft', title: 'Sampling, window, STFT' },
      { id: 'ai-usage', title: 'AI에서의 사용 기준' },
    ],
    summary: '시간 신호를 복소 주파수 계수로 바꾸고, sampling 함정과 FFT 재사용 구조를 숫자로 검산한 뒤 AI 연산에 쓸 조건을 판단합니다.',
    level: '중급',
    estimatedMinutes: 64,
    prerequisites: ['삼각함수', '복소수의 기초', '시간·공간 신호'],
    learningPath: 'ai-signal-spectral-branch',
    component: () => import('@/pages/articles/ai/fft'),
  },
];

const foundationOrder = [
  'deep-learning-overview',
  'perceptron',
  'paper-perceptron-1958',
  'neural-network',
  'activation-functions',
  'cross-entropy',
  'backprop-optimization',
  'paper-backprop-1986',
  'optimizers',
  'paper-adam-2014',
  'paper-adamw-2017',
  'foundation-training-step',
  'autoencoder',
  'paper-autoencoder-2006',
  'fft',
  'paper-fft-1965',
];

const foundationBySlug = new Map(
  [...dlFoundationArticles, ...dlFoundation2Articles, ...foundationPaperArticles].map((article) => [article.slug, article]),
);

const orderedFoundationArticles = foundationOrder
  .map((slug) => foundationBySlug.get(slug))
  .filter((article): article is Article => article !== undefined);

const nlpSourceArticles = foundationPaperArticles.filter((article) => article.slug === 'paper-word2vec-2013');
const orderedNlpArticles = dlNlpArticles.flatMap((article) => (
  article.slug === 'word2vec' ? [article, ...nlpSourceArticles] : [article]
));

/** Combined DL articles: ordered foundations + NLP + vision */
export const dlArticles: Article[] = [
  ...orderedFoundationArticles,
  ...orderedNlpArticles,
  ...dlVisionArticles,
];
