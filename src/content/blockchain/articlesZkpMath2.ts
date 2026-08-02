import type { Article } from '../types';

// 순서: 프리미티브 조합 → 커밋먼트 스킴 → MPC (zkp-math 뒤, zkp-systems 앞)
export const zkpMath2Articles: Article[] = [
  {
    slug: 'crypto-primitives',
    title: 'ZK 암호 프리미티브',
    subcategory: 'zkp-math',
    sections: [
      { id: 'poseidon', title: 'Poseidon 해시' },
      { id: 'merkle-commitment', title: 'Merkle Tree & Commitment' },
      { id: 'schnorr', title: 'Schnorr 서명' },
      { id: 'ed25519', title: 'Ed25519' },
      { id: 'abelian-group', title: '아벨군' },
    ],
    component: () => import('@/pages/articles/blockchain/crypto-primitives'),
  },
  {
    slug: 'polycommit',
    title: '다항식 커밋먼트 스킴: KZG · IPA · Linear Codes 구현 비교',
    subcategory: 'zkp-math',
    sections: [
      { id: 'overview', title: '개요 & 스킴 비교' },
      { id: 'kzg10', title: 'KZG10 구현 상세' },
      { id: 'ipa', title: 'IPA & Marlin PC' },
      { id: 'fri', title: 'Linear Codes (Ligero/Brakedown)' },
      { id: 'compare', title: '비교 분석' },
    ],
    component: () => import('@/pages/articles/blockchain/polycommit'),
  },
  {
    slug: 'mpc',
    title: 'MPC 구현 심화: Shamir · Paillier · Threshold ECDSA',
    subcategory: 'mpc',
    summary: '지갑 키 관리 경로에서 배운 경계를 실제 Shamir·Paillier·MtA·threshold ECDSA 코드에 대입합니다.',
    level: '심화',
    estimatedMinutes: 38,
    prerequisites: ['wallet-key-management-map', 'threshold-wallet-signing', 'browser-wallet-recovery'],
    learningPath: 'wallet-key-management-current-first',
    sections: [
      { id: 'overview', title: '구현 범위 & 보안 모델' },
      { id: 'shamir', title: 'Shamir 비밀 분산' },
      { id: 'paillier', title: 'Paillier 동형 암호화' },
      { id: 'dkg', title: '분산 키 생성 (DKG)' },
    ],
    component: () => import('@/pages/articles/blockchain/mpc'),
  },
];
