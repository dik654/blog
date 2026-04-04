import type { Article } from '../types';

export const zkpSystemsArticles: Article[] = [
  // ── SNARK 개론 & Groth16 ──
  {
    slug: 'snark-overview',
    title: 'SNARK 개론',
    subcategory: 'zkp-groth16-concept',
    sections: [
      { id: 'overview', title: 'SNARK란?' },
      { id: 'components', title: 'Setup · Prove · Verify' },
      { id: 'verify-flow', title: '검증 흐름' },
      { id: 'landscape', title: '증명 시스템 지도' },
    ],
    component: () => import('@/pages/articles/blockchain/snark-overview'),
  },
  {
    slug: 'constraint-systems',
    title: 'R1CS와 QAP',
    subcategory: 'zkp-groth16-concept',
    sections: [
      { id: 'r1cs', title: 'R1CS 제약 시스템' },
      { id: 'r1cs-gadgets', title: 'R1CS 가젯' },
      { id: 'qap', title: 'QAP 변환' },
    ],
    component: () => import('@/pages/articles/blockchain/constraint-systems'),
  },
  {
    slug: 'groth16',
    title: 'Groth16 증명 시스템',
    subcategory: 'zkp-groth16-concept',
    sections: [
      { id: 'data-structures', title: '데이터 구조 상세' },
      { id: 'trusted-setup', title: 'Trusted Setup' },
      { id: 'setup-detail', title: 'Setup 상세' },
      { id: 'prove', title: 'Prove (MSM)' },
      { id: 'proving-detail', title: 'Proving 상세' },
      { id: 'verify', title: 'Verify (Pairing)' },
      { id: 'r1cs-to-qap', title: 'R1CS → QAP 변환' },
      { id: 'performance', title: '성능 최적화' },
    ],
    component: () => import('@/pages/articles/blockchain/groth16'),
  },

  // ── PLONK 계열 ──
  {
    slug: 'plonk',
    title: 'PLONK 증명 시스템',
    subcategory: 'zkp-plonk-concept',
    sections: [
      { id: 'kzg', title: 'KZG 다항식 Commitment' },
      { id: 'plonkish', title: 'PLONKish Arithmetization' },
      { id: 'standard-composer', title: 'StandardComposer 구조' },
      { id: 'gate-types', title: '게이트 타입 상세' },
      { id: 'constraints', title: '제약 조건 시스템' },
      { id: 'plookup', title: 'Plookup' },
      { id: 'prover-verifier', title: 'PLONK Prover/Verifier' },
      { id: 'prover-detail', title: 'Prover 5-Round 상세' },
      { id: 'verifier-detail', title: 'Verifier 상세' },
      { id: 'proof-structure', title: '증명 데이터 구조' },
      { id: 'ipa', title: 'Inner Product Argument' },
      { id: 'homomorphic-commitment', title: '동형 커밋먼트' },
      { id: 'circuit-compilation', title: '회로 컴파일' },
      { id: 'proof-gen-verify', title: '증명 생성 및 검증' },
      { id: 'fflonk', title: 'FFLONK 최적화' },
    ],
    component: () => import('@/pages/articles/blockchain/plonk'),
  },
  {
    slug: 'hyperplonk',
    title: 'HyperPLONK',
    subcategory: 'zkp-plonk-concept',
    sections: [
      { id: 'overview', title: 'HyperPLONK이란?' },
      { id: 'multilinear', title: '다중선형 확장 (MLE)' },
      { id: 'sumcheck', title: 'Sumcheck 프로토콜' },
      { id: 'comparison', title: 'PLONK vs HyperPLONK' },
    ],
    component: () => import('@/pages/articles/blockchain/hyperplonk'),
  },

  // ── STARK 계열 ──
  {
    slug: 'stark-theory',
    title: 'STARK 증명 시스템',
    subcategory: 'zkp-stark-concept',
    sections: [
      { id: 'overview', title: 'STARK이란?' },
      { id: 'execution-trace', title: '실행 추적 (Execution Trace)' },
      { id: 'air-constraints', title: 'AIR 제약 시스템' },
      { id: 'low-degree-extension', title: '저차 확장 (LDE)' },
      { id: 'proof-pipeline', title: 'STARK 증명 파이프라인' },
      { id: 'comparison', title: 'SNARK vs STARK' },
    ],
    component: () => import('@/pages/articles/blockchain/stark-theory'),
  },
];
