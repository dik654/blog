import type { Article } from '../types';

export const zkpSystems2Articles: Article[] = [
  // ── Bulletproofs — 개념 ──
  {
    slug: 'bulletproofs-concept',
    title: 'Bulletproofs 개념: IPA 와 Range Proof 이론',
    subcategory: 'zkp-bp-concept',
    sections: [
      { id: 'overview', title: '왜 Bulletproofs 인가' },
      { id: 'inner-product', title: 'Inner Product Argument — O(log n)' },
      { id: 'range-proof', title: 'Range Proof 이론' },
    ],
    component: () => import('@/pages/articles/blockchain/bulletproofs-concept'),
  },

  // ── Bulletproofs — dalek 구현체 분석 ──
  {
    slug: 'bulletproofs',
    title: 'Bulletproofs 구현체: dalek-cryptography/bulletproofs 분석',
    subcategory: 'zkp-bp-impl',
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

  // ── Folding (재귀 증명) — 개념 ──
  {
    slug: 'nova-concept',
    title: 'Nova 개념: IVC 와 NIFS 폴딩 이론',
    subcategory: 'zkp-nova-concept',
    sections: [
      { id: 'overview', title: 'IVC & Folding Scheme' },
      { id: 'relaxed-r1cs', title: 'Relaxed R1CS — 폴딩에 닫힌 형태' },
      { id: 'nifs', title: 'NIFS — 비대화형 폴딩 프로토콜' },
    ],
    component: () => import('@/pages/articles/blockchain/nova-concept'),
  },

  // ── Folding — microsoft/Nova 구현체 분석 ──
  {
    slug: 'nova',
    title: 'Nova 구현체: microsoft/Nova-snark 코드 분석',
    subcategory: 'zkp-nova-impl',
    sections: [
      { id: 'overview', title: '개요 & IVC 폴딩 구조' },
      { id: 'relaxed-r1cs', title: 'Relaxed R1CS — 폴딩 가능한 형태' },
      { id: 'nifs', title: 'NIFS & prove_step (실제 구현)' },
      { id: 'recursive-circuit', title: 'NovaAugmentedCircuit — 재귀 검증 회로' },
      { id: 'spartan', title: 'Spartan 압축 SNARK — 최종 단계' },
      { id: 'use-cases', title: '활용 & 비교 (Halo2 누적, ProtoStar)' },
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
