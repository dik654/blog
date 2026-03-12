import type { Category } from '../types';
import { nodeSections } from '@/pages/articles/ethereum/node-architecture/meta';

const blockchain: Category = {
  slug: 'blockchain',
  name: 'Blockchain',
  description: '블록체인, ZKP 구현, 이더리움, 파일코인 학습 노트',
  subcategories: [
    { slug: 'fundamentals', name: 'Fundamentals' },
    { slug: 'zkp', name: 'Zero Knowledge Proof' },
    {
      slug: 'ethereum',
      name: 'Ethereum',
      children: [
        { slug: 'eth-architecture', name: 'Architecture' },
        { slug: 'eth-p2p', name: 'P2P Network' },
        { slug: 'eth-consensus', name: 'Consensus' },
        { slug: 'eth-evm', name: 'EVM' },
      ],
    },
    {
      slug: 'filecoin',
      name: 'Filecoin',
      children: [
        { slug: 'fil-consensus', name: 'Consensus' },
        { slug: 'fil-storage', name: 'Storage Proof' },
        { slug: 'fil-network', name: 'Network' },
      ],
    },
  ],
  articles: [
    {
      slug: 'consensus-mechanisms',
      title: '합의 알고리즘 비교',
      subcategory: 'fundamentals',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'pow', title: 'Proof of Work' },
        { id: 'pos', title: 'Proof of Stake' },
        { id: 'comparison', title: '비교 분석' },
      ],
      component: () => import('@/pages/articles/blockchain/consensus-mechanisms'),
    },
    {
      slug: 'field-arithmetic',
      title: '유한체 산술 구현',
      subcategory: 'zkp',
      sections: [
        { id: 'prime-repr', title: '소수 표현 (u64 limbs)' },
        { id: 'montgomery', title: 'Montgomery 곱셈' },
        { id: 'operator-overload', title: '연산자 오버로딩' },
        { id: 'fr-scalar', title: 'Fr 스칼라체' },
      ],
      component: () => import('@/pages/articles/blockchain/field-arithmetic'),
    },
    {
      slug: 'extension-fields',
      title: '확장체 구현 (Fp2→Fp12)',
      subcategory: 'zkp',
      sections: [
        { id: 'fp2', title: 'Fp2 이차 확장' },
        { id: 'fp6', title: 'Fp6 삼차 확장' },
        { id: 'fp12', title: 'Fp12 완성' },
      ],
      component: () => import('@/pages/articles/blockchain/extension-fields'),
    },
    {
      slug: 'elliptic-curves',
      title: '타원곡선군 구현',
      subcategory: 'zkp',
      sections: [
        { id: 'g1-curve', title: 'G1 타원곡선군' },
        { id: 'g1-g2-bn254', title: 'G1 + G2 BN254' },
      ],
      component: () => import('@/pages/articles/blockchain/elliptic-curves'),
    },
    {
      slug: 'pairing',
      title: 'Optimal Ate Pairing',
      subcategory: 'zkp',
      sections: [
        { id: 'miller-loop', title: 'Miller Loop' },
        { id: 'final-exp', title: 'Final Exponentiation' },
        { id: 'math-foundation', title: '수학적 기초' },
      ],
      component: () => import('@/pages/articles/blockchain/pairing'),
    },
    {
      slug: 'crypto-primitives',
      title: 'ZK 암호 프리미티브',
      subcategory: 'zkp',
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
      slug: 'constraint-systems',
      title: 'R1CS와 QAP',
      subcategory: 'zkp',
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
      subcategory: 'zkp',
      sections: [
        { id: 'trusted-setup', title: 'Trusted Setup' },
        { id: 'prove', title: 'Prove (MSM)' },
        { id: 'verify', title: 'Verify (Pairing)' },
      ],
      component: () => import('@/pages/articles/blockchain/groth16'),
    },
    {
      slug: 'plonk',
      title: 'PLONK 증명 시스템',
      subcategory: 'zkp',
      sections: [
        { id: 'kzg', title: 'KZG 다항식 Commitment' },
        { id: 'plonkish', title: 'PLONKish Arithmetization' },
        { id: 'plookup', title: 'Plookup' },
        { id: 'prover-verifier', title: 'PLONK Prover/Verifier' },
        { id: 'fflonk', title: 'FFLONK 최적화' },
      ],
      component: () => import('@/pages/articles/blockchain/plonk'),
    },
    {
      slug: 'node-architecture',
      title: '이더리움 노드 아키텍처 (EL + CL)',
      subcategory: 'eth-architecture',
      sections: nodeSections,
      component: () => import('@/pages/articles/ethereum/node-architecture'),
    },
    {
      slug: 'fork-id',
      title: 'Fork ID (EIP-2124) 분석',
      subcategory: 'eth-p2p',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'crc32-enr', title: 'CRC32 & ENR' },
        { id: 'pow-to-pos', title: 'PoW→PoS 전환' },
        { id: 'test-design', title: '테스트 케이스 설계' },
      ],
      component: () => import('@/pages/articles/ethereum/fork-id'),
    },
    {
      slug: 'expected-consensus',
      title: 'Expected Consensus',
      subcategory: 'fil-consensus',
      sections: [
        { id: 'sortition', title: 'Poisson Sortition' },
        { id: 'tipset', title: 'Tipset 선택' },
      ],
      component: () => import('@/pages/articles/filecoin/expected-consensus'),
    },
    {
      slug: 'bittorrent',
      title: 'BitTorrent 아키텍처',
      subcategory: 'fil-network',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'architecture', title: '아키텍처' },
      ],
      component: () => import('@/pages/articles/filecoin/bittorrent'),
    },
  ],
};

export default blockchain;
