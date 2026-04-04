import type { Article } from '../types';

// ── Foundations (후반): 딥러닝 개요, 오토인코더 ──
export const dlFoundation2Articles: Article[] = [
  {
    slug: 'deep-learning-overview',
    title: '딥러닝: 더 깊게, 더 빠르게',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '왜 깊은 네트워크인가' },
      { id: 'history', title: '딥러닝의 초기 역사' },
      { id: 'acceleration', title: '딥러닝 고속화' },
      { id: 'applications', title: '딥러닝의 활용' },
    ],
    component: () => import('@/pages/articles/ai/deep-learning-overview'),
  },
  {
    slug: 'autoencoder',
    title: '오토인코더: 압축과 복원으로 배우는 표현 학습',
    subcategory: 'ai-foundations',
    sections: [
      { id: 'overview', title: '오토인코더란' },
      { id: 'architecture', title: '구조 상세' },
      { id: 'forward-example', title: '순전파 예시 (구체적 숫자)' },
      { id: 'loss-backprop', title: '손실 + 역전파' },
      { id: 'dimension-reduction', title: '차원 축소의 의미' },
      { id: 'applications', title: '활용 사례' },
      { id: 'variants', title: '변형' },
    ],
    component: () => import('@/pages/articles/ai/autoencoder'),
  },
];

// ── Computer Vision ──
export const dlVisionArticles: Article[] = [
  {
    slug: 'cnn',
    title: 'CNN: 합성곱 신경망의 원리와 진화',
    subcategory: 'ai-vision',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'convolution-layer', title: '합성곱 연산의 구성요소' },
      { id: 'inductive-bias', title: '귀납적 편향 & CNN의 한계' },
      { id: 'architectures', title: 'CNN 아키텍처의 진화' },
      { id: 'applications', title: 'CNN 응용 분야' },
      { id: 'cnn-vs-transformer', title: 'CNN vs Transformer' },
    ],
    component: () => import('@/pages/articles/ai/cnn'),
  },
  {
    slug: 'resnet',
    title: 'ResNet: 스킵 커넥션과 기울기 소실 해결',
    subcategory: 'ai-vision',
    sections: [
      { id: 'overview', title: '왜 깊은 신경망이 문제인가' },
      { id: 'vanishing-gradient', title: '기울기 소실 숫자 증명' },
      { id: 'skip-connection', title: '스킵 커넥션 원리' },
      { id: 'residual-computation', title: '잔차 신경망 숫자 계산' },
      { id: 'architecture', title: 'ResNet 아키텍처' },
      { id: 'impact', title: 'ResNet의 영향' },
    ],
    component: () => import('@/pages/articles/ai/resnet'),
  },
];
