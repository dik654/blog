import type { Article } from '../types';

export const zkpSystems2Articles: Article[] = [
  // ── Bulletproofs (투명 셋업, 기초) ──
  {
    slug: 'bulletproofs',
    title: 'Bulletproofs: 투명 셋업 범위 증명 (Inner Product Argument)',
    subcategory: 'zkp-bp-concept',
    sections: [
      { id: 'overview', title: '개요 & 핵심 구조' },
      { id: 'inner-product', title: '내적 인수 증명 (O(log n))' },
      { id: 'range-proof', title: '범위 증명 & 집계' },
    ],
    component: () => import('@/pages/articles/blockchain/bulletproofs'),
  },

  // ── IOP 계열 ──
  {
    slug: 'libiop',
    title: 'libiop: Interactive Oracle Proof (Aurora / Ligero / Fractal)',
    subcategory: 'zkp-iop-concept',
    sections: [
      { id: 'overview', title: 'IOP 개요' },
      { id: 'aurora-ligero', title: 'Aurora / Ligero 프로토콜' },
      { id: 'r1cs-iop', title: 'R1CS -> IOP 변환' },
      { id: 'bcs', title: 'BCS 변환' },
      { id: 'fractal', title: 'Fractal PCS' },
      { id: 'optimization', title: '최적화' },
    ],
    component: () => import('@/pages/articles/blockchain/libiop'),
  },
  {
    slug: 'proofofsql',
    title: 'Proof of SQL: SQL 쿼리 영지식 증명 (Sumcheck + Dory)',
    subcategory: 'zkp-iop-impl',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'query-proof', title: 'SQL 쿼리 증명' },
      { id: 'dory-commitment', title: 'Dory Commitment' },
      { id: 'verification', title: 'Verification' },
      { id: 'benchmark', title: '벤치마크' },
    ],
    component: () => import('@/pages/articles/blockchain/proofofsql'),
  },

  // ── Folding (재귀 증명) ──
  {
    slug: 'nova',
    title: 'Nova: NIFS 폴딩 기반 재귀 증명 (IVC)',
    subcategory: 'zkp-nova-concept',
    sections: [
      { id: 'overview', title: '개요 & IVC 폴딩 구조' },
      { id: 'nifs', title: 'NIFS & prove_step (실제 구현)' },
    ],
    component: () => import('@/pages/articles/blockchain/nova'),
  },

  // ── PLONK 구현 ──
  {
    slug: 'halo2',
    title: 'Halo2: KZG + PLONKish 증명 프레임워크 (zcash/halo2)',
    subcategory: 'zkp-plonk-impl',
    sections: [
      { id: 'overview', title: '개요 & 회로 구조' },
      { id: 'keygen', title: '키 생성 (keygen_vk / keygen_pk)' },
      { id: 'prover', title: 'create_proof — 증명 생성 파이프라인' },
      { id: 'constraint-system', title: '제약 조건 시스템 (FlexGate & RangeGate)' },
      { id: 'virtual-region', title: '가상 영역 관리 (Virtual Region)' },
      { id: 'halo2-ecc', title: 'halo2-ecc: 회로 내 타원곡선 연산' },
      { id: 'examples', title: '실전 예제: ECDSA 검증 & BN254 Pairing' },
    ],
    component: () => import('@/pages/articles/blockchain/halo2'),
  },

  // ── STARK 구현 ──
  {
    slug: 'plonky3',
    title: 'Plonky3: 모듈형 STARK 프레임워크 (BabyBear + FRI)',
    subcategory: 'zkp-stark-impl',
    sections: [
      { id: 'overview', title: '개요 & 크레이트 구조' },
      { id: 'field-arithmetic', title: 'BabyBear 필드 & 확장체' },
      { id: 'air', title: 'AIR — Algebraic Intermediate Representation' },
      { id: 'fri', title: 'FRI & TwoAdicFriPcs' },
      { id: 'hash', title: 'Poseidon2 & 해시 레이어' },
      { id: 'poseidon2-hash', title: 'Poseidon2 해시 상세' },
      { id: 'merkle-commit', title: 'Merkle 커밋먼트 스킴' },
      { id: 'uni-stark', title: 'uni-stark 증명 시스템' },
      { id: 'challenger', title: 'Fiat-Shamir 챌린저' },
      { id: 'performance', title: '성능 벤치마크' },
    ],
    component: () => import('@/pages/articles/blockchain/plonky3'),
  },
];
