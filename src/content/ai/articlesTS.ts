import type { Article } from '../types';

export const tsArticles: Article[] = [
  {
    slug: 'arima',
    title: 'ARIMA: 시계열 예측의 고전',
    subcategory: 'ai-timeseries',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'components', title: 'AR(p), I(d), MA(q) 구성요소' },
      { id: 'modeling', title: '모델링 과정' },
      { id: 'applications', title: 'SARIMA 확장과 실전 적용' },
    ],
    component: () => import('@/pages/articles/ai/arima'),
  },
  {
    slug: 'lstm-timeseries',
    title: 'LSTM: 시계열 분석을 위한 장단기 기억 네트워크',
    subcategory: 'ai-timeseries',
    sections: [
      { id: 'overview', title: 'RNN의 한계와 LSTM의 등장' },
      { id: 'cell-architecture', title: 'LSTM 셀 구조' },
      { id: 'training', title: '시계열 학습 파이프라인' },
      { id: 'applications', title: '응용 & Transformer 비교' },
    ],
    component: () => import('@/pages/articles/ai/lstm-timeseries'),
  },
  {
    slug: 'ecod',
    title: 'ECOD: ECDF 기반 이상 탐지',
    subcategory: 'ai-timeseries',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'algorithm', title: 'ECDF 기반 이상치 점수 계산' },
      { id: 'implementation', title: 'PyOD 구현 & 대규모 처리' },
      { id: 'comparison', title: '다른 기법과 비교' },
    ],
    component: () => import('@/pages/articles/ai/ecod'),
  },
];
