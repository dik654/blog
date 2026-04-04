import type { Article } from '../types';

// 순서: 페어링 최적화 상세 (확장체 이론 아티클에서 참조하는 기법들)
export const zkpMath3Articles: Article[] = [
  {
    slug: 'karatsuba',
    title: 'Karatsuba 곱셈',
    subcategory: 'zkp-math',
    sections: [
      { id: 'overview', title: '왜 Karatsuba인가?' },
      { id: 'naive-mul', title: 'Naive 곱셈: 4회 방식' },
      { id: 'karatsuba-trick', title: 'Karatsuba 트릭: 3회로 줄이기' },
      { id: 'recursive', title: '재귀 적용: Fp² → Fp⁶ → Fp¹² 타워' },
      { id: 'cost-comparison', title: 'BN254 비용 비교' },
    ],
    component: () => import('@/pages/articles/blockchain/karatsuba'),
  },
  {
    slug: 'sparse-multiplication',
    title: 'Sparse 곱셈 — Miller Loop의 최적화',
    subcategory: 'zkp-math',
    sections: [
      { id: 'overview', title: 'Sparse 곱셈이란?' },
      { id: 'why-sparse', title: '왜 희소한가: twist 구조' },
      { id: 'how-sparse', title: '어떤 슬롯끼리 곱해지는가' },
      { id: 'cost-saving', title: 'Full vs Sparse 비용 비교' },
      { id: 'in-miller', title: '254회 반복의 누적 효과' },
    ],
    component: () => import('@/pages/articles/blockchain/sparse-multiplication'),
  },
  {
    slug: 'frobenius-optimization',
    title: 'Frobenius 최적화 — "무료" 거듭제곱',
    subcategory: 'zkp-math',
    sections: [
      { id: 'overview', title: 'Frobenius 사상이란?' },
      { id: 'coeff-rearrange', title: '12개 계수의 재배열' },
      { id: 'why-free', title: '왜 "무료"인가' },
      { id: 'in-final-exp', title: 'Final Exp에서의 지수 분해' },
      { id: 'concrete', title: '단계별 계수 변환 예제' },
    ],
    component: () => import('@/pages/articles/blockchain/frobenius-optimization'),
  },
];
