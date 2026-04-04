import type { Article } from '../types';

export const filecoin3Articles: Article[] = [
  /* ── 이론 ── */
  {
    slug: 'erasure-coding', title: '이레이저 코딩 이론: RS, 2D 코딩, DAS', subcategory: 'fundamentals',
    sections: [{ id: 'overview', title: '개요 & 이레이저 코딩 개념' }, { id: 'reed-solomon', title: 'Reed-Solomon 코딩' }, { id: 'two-dimensional', title: '2D 이레이저 코딩 & DAS' }, { id: 'comparison', title: 'RS vs Fountain vs LDPC' }],
    component: () => import('@/pages/articles/blockchain/erasure-coding'),
  },
  {
    slug: 'pos-theory', title: '저장 증명 이론: PoR, PoRep, PoSt', subcategory: 'fil-theory',
    sections: [{ id: 'overview', title: '개요 & 저장 증명 분류' }, { id: 'por', title: 'Proof of Retrievability' }, { id: 'porep', title: 'Proof of Replication' }, { id: 'post', title: 'Proof of Spacetime' }],
    component: () => import('@/pages/articles/blockchain/pos-theory'),
  },
  {
    slug: 'vdf', title: 'VDF: Verifiable Delay Function', subcategory: 'fil-theory',
    sections: [{ id: 'overview', title: 'VDF 개요 & 동기' }, { id: 'construction', title: '구성: 순차 계산 + 빠른 검증' }, { id: 'applications', title: '응용: DRAND, Irys, Ethereum' }],
    component: () => import('@/pages/articles/blockchain/vdf'),
  },
  {
    slug: 'drand', title: 'DRAND: 분산 랜덤 비콘', subcategory: 'fil-theory',
    sections: [{ id: 'overview', title: 'DRAND 개요' }, { id: 'protocol', title: 'BLS 임계값 서명 프로토콜' }, { id: 'filecoin-integration', title: 'Filecoin 연동' }],
    component: () => import('@/pages/articles/blockchain/drand'),
  },
];
