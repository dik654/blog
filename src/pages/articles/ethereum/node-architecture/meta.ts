import type { Section } from '@/content/types';

export const nodeSections: Section[] = [
  { id: 'overview', title: '전체 구조' },
  { id: 'execution-layer', title: 'Execution Layer (reth)' },
  { id: 'consensus-layer', title: 'Consensus Layer (lighthouse)' },
  {
    id: 'validator-lifecycle', title: '검증자 생명주기',
    subsections: [
      { id: 'validator-lifecycle', title: '32 ETH 예치 & 대기열' },
      { id: 'validator-lifecycle', title: '활성화 & 의무 수행' },
      { id: 'validator-lifecycle', title: '자발적 / 강제 탈출' },
    ],
  },
  {
    id: 'block-proposal', title: '블록 제안 & MEV',
    subsections: [
      { id: 'block-proposal', title: '로컬 빌드' },
      { id: 'block-proposal', title: 'MEV-Boost (PBS)' },
    ],
  },
  { id: 'block-lifecycle', title: '블록 생명주기' },
  {
    id: 'attestation-finality', title: '어테스테이션 & 최종성',
    subsections: [
      { id: 'attestation-finality', title: 'LMD-GHOST' },
      { id: 'attestation-finality', title: 'Casper FFG' },
    ],
  },
  {
    id: 'slashing', title: '슬래싱 조건 & 패널티',
    subsections: [
      { id: 'slashing', title: 'Proposer Slashing' },
      { id: 'slashing', title: 'Attester Slashing' },
      { id: 'slashing', title: 'Correlation Penalty' },
    ],
  },
  {
    id: 'transaction-evm', title: '트랜잭션 & EVM 실행',
    subsections: [
      { id: 'transaction-evm', title: 'TxPool 라우팅' },
      { id: 'transaction-evm', title: 'EVM 실행' },
      { id: 'transaction-evm', title: '상태 루트 & 저장' },
    ],
  },
  {
    id: 'bls-crypto', title: 'BLS 암호학 (서명 & 집계)',
    subsections: [
      { id: 'bls-crypto', title: '제네릭 타입 아키텍처' },
      { id: 'bls-crypto', title: '서명 & 집계 검증' },
    ],
  },
  {
    id: 'kzg-blob', title: 'KZG 커밋먼트 & Blob (EIP-4844)',
    subsections: [
      { id: 'kzg-blob', title: 'KzgCommitment & KzgProof' },
      { id: 'kzg-blob', title: 'PeerDAS 프로토콜' },
    ],
  },
  { id: 'ssz-types', title: 'SSZ 타입 시스템 & 직렬화' },
];
