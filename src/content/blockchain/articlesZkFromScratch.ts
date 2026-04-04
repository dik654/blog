import type { Article } from '../types';

export const zkFromScratchArticles: Article[] = [
  {
    slug: 'impl-field-arithmetic',
    title: '유한체 산술 구현 (Rust)',
    subcategory: 'zk-from-scratch',
    sections: [
      { id: 'overview', title: 'Fp 소수체 표현' },
      { id: 'montgomery', title: '몽고메리 곱셈' },
      { id: 'extension', title: '확장체 Fp2 → Fp6 → Fp12' },
      { id: 'scalar', title: 'Fr 스칼라 필드' },
    ],
    component: () => import('@/pages/articles/blockchain/impl-field-arithmetic'),
  },
  {
    slug: 'impl-elliptic-curve',
    title: '타원곡선 & 페어링 구현 (Rust)',
    subcategory: 'zk-from-scratch',
    sections: [
      { id: 'overview', title: 'BN254 곡선 파라미터' },
      { id: 'g1-ops', title: 'G1 점 연산 (add, double, scalar mul)' },
      { id: 'g2-ops', title: 'G2 확장체 위의 연산' },
      { id: 'pairing', title: 'Miller 루프 & 최종 지수화' },
    ],
    component: () => import('@/pages/articles/blockchain/impl-elliptic-curve'),
  },
  {
    slug: 'impl-hash-commitment',
    title: 'Poseidon 해시 & Merkle 트리 구현 (Rust)',
    subcategory: 'zk-from-scratch',
    sections: [
      { id: 'overview', title: 'ZK-friendly 해시 설계' },
      { id: 'poseidon', title: 'Poseidon 해시 구현' },
      { id: 'merkle', title: 'Merkle 트리 & 증명' },
      { id: 'commitment', title: '커밋먼트 스킴' },
    ],
    component: () => import('@/pages/articles/blockchain/impl-hash-commitment'),
  },
  {
    slug: 'impl-groth16',
    title: 'Groth16 증명 시스템 구현 (Rust)',
    subcategory: 'zk-from-scratch',
    sections: [
      { id: 'overview', title: 'R1CS → QAP 변환' },
      { id: 'setup', title: 'Trusted Setup (CRS 생성)' },
      { id: 'prove', title: '증명 생성 (Prover)' },
      { id: 'verify', title: '검증 (Verifier)' },
      { id: 'circuit', title: '회로 작성 (Merkle, Poseidon)' },
    ],
    component: () => import('@/pages/articles/blockchain/impl-groth16'),
  },
  {
    slug: 'impl-plonk',
    title: 'PLONK 증명 시스템 구현 (Rust)',
    subcategory: 'zk-from-scratch',
    sections: [
      { id: 'overview', title: 'PLONKish 산술화' },
      { id: 'kzg', title: 'KZG 다항식 커밋먼트' },
      { id: 'permutation', title: '순열 인자 (Copy Constraints)' },
      { id: 'lookup', title: 'Plookup (Lookup Arguments)' },
      { id: 'prover', title: 'Prover 구현' },
    ],
    component: () => import('@/pages/articles/blockchain/impl-plonk'),
  },
];
