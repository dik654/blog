import type { Article } from '../types';

export const ethereum2Articles: Article[] = [
  /* ── Scaling & L2 ── */
  {
    slug: 'rollup-fundamentals', title: '롤업 기초: Optimistic vs ZK Rollup', subcategory: 'eth-scaling',
    sections: [{ id: 'glossary', title: '핵심 용어 & 배경 지식' }, { id: 'overview', title: '개요 & L1 vs L2' }, { id: 'optimistic', title: 'Optimistic Rollup (사기 증명)' }, { id: 'zk-rollup', title: 'ZK Rollup (유효성 증명)' }, { id: 'comparison', title: 'Optimistic vs ZK 비교' }],
    component: () => import('@/pages/articles/blockchain/rollup-fundamentals'),
  },
  {
    slug: 'da-theory', title: '데이터 가용성 이론: DAS, DA Layer, EIP-4844', subcategory: 'eth-scaling',
    sections: [{ id: 'glossary', title: '핵심 용어 & 배경 지식' }, { id: 'overview', title: '개요 & DA 문제' }, { id: 'das', title: 'Data Availability Sampling' }, { id: 'da-layer', title: 'Celestia, EigenDA, Avail' }, { id: 'eip-4844', title: 'Blob 트랜잭션 & Proto-Danksharding' }],
    component: () => import('@/pages/articles/blockchain/da-theory'),
  },

  /* ── Privacy (심층 코드 추적) ── */
  {
    slug: 'railgun', title: 'RAILGUN: ZKP 기반 EVM 프라이버시 프로토콜', subcategory: 'eth-privacy',
    sections: [
      { id: 'overview', title: '아키텍처 & UTXO 모델' },
      { id: 'note-struct', title: 'Note 구조체 (npk, token, value, random)' },
      { id: 'shield', title: 'Shield: ERC-20 입금 흐름' },
      { id: 'commitment', title: 'Commitment: Poseidon 해시 & Merkle 삽입' },
      { id: 'nullifier', title: 'Nullifier: 이중 사용 방지' },
      { id: 'transact', title: 'Transact: 내부 전송 (shielded → shielded)' },
      { id: 'unshield', title: 'Unshield: ERC-20 출금' },
      { id: 'zk-circuit', title: 'ZK 회로: R1CS 제약 조건' },
      { id: 'groth16-verify', title: 'Groth16 증명 & 온체인 검증' },
      { id: 'broadcaster', title: 'Broadcaster: Waku P2P 릴레이' },
    ],
    component: () => import('@/pages/articles/blockchain/railgun'),
  },
  /* ── Helios (Light Client) ── */
  {
    slug: 'helios', title: 'Helios 아키텍처 개요', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '아키텍처 개요' }],
    component: () => import('@/pages/articles/ethereum/helios'),
  },
  {
    slug: 'helios-bootstrap', title: 'Helios Checkpoint Sync & 부트스트랩', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '왜 부트스트랩이 필요한가' }, { id: 'checkpoint-sources', title: '체크포인트 소스 (API · 하드코딩 · 사용자)' }, { id: 'weak-subjectivity', title: 'Weak Subjectivity 유효 기간' }, { id: 'fetch-checkpoint', title: 'fetch_checkpoint() HTTP + SSZ 파싱' }, { id: 'bootstrap-response', title: 'Bootstrap 응답 구조 (header + committee + branch)' }, { id: 'committee-branch', title: 'committee_branch Merkle 증명 검증' }, { id: 'store-init', title: 'Store 초기화 (각 필드의 의미)' }, { id: 'first-update', title: '첫 번째 Update 요청' }, { id: 'error-cases', title: '에러 케이스 (만료 · 네트워크 불일치)' }],
    component: () => import('@/pages/articles/ethereum/helios-bootstrap'),
  },
  {
    slug: 'helios-consensus', title: 'Helios Sync Committee BLS 검증 & 교체', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '왜 BLS 검증인가 (블록 실행 없이 신뢰)' }, { id: 'bls12-381', title: 'BLS12-381 곡선 기초 (G1 · G2 · GT · 페어링)' }, { id: 'participation-bits', title: '참여 비트맵 필터링 (512비트 → 참여자)' }, { id: 'aggregate-pubkeys', title: 'bls_aggregate_pubkeys() G1 점 합산' }, { id: 'signing-root', title: 'compute_signing_root() SSZ + 도메인' }, { id: 'bls-verify', title: 'bls_verify() 페어링 비교 (lhs == rhs)' }, { id: 'quorum', title: '2/3 정족수 검사' }, { id: 'committee-rotation', title: '위원회 교체 (256 에폭 · period 계산)' }, { id: 'committee-handoff', title: '위원회 핸드오프 (current → next)' }],
    component: () => import('@/pages/articles/ethereum/helios-consensus'),
  },
  {
    slug: 'helios-update', title: 'Helios Light Client Update', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '왜 Update가 필요한가' }, { id: 'update-types', title: 'OptimisticUpdate vs FinalityUpdate' }, { id: 'validate-update', title: 'validate_light_client_update() 3가지 검사' }, { id: 'slot-comparison', title: '헤더 슬롯 비교 (optimistic vs finalized)' }, { id: 'apply-update', title: 'apply_store_update() 내부' }, { id: 'best-update', title: 'Best Update 선택 (다수 Update 도착 시)' }, { id: 'reorg-handling', title: '경량 클라이언트의 Reorg 처리' }],
    component: () => import('@/pages/articles/ethereum/helios-update'),
  },
  {
    slug: 'helios-state', title: 'Helios State Proof & Merkle-Patricia 검증', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '왜 상태 증명인가 (로컬 상태 없이 검증)' }, { id: 'eip1186', title: 'EIP-1186 eth_getProof 포맷' }, { id: 'account-proof', title: 'Account Proof 검증 (keccak 경로)' }, { id: 'storage-proof', title: 'Storage Proof 검증 (중첩 트라이)' }, { id: 'rlp-decode', title: 'RLP 디코딩 (nonce · balance · storageRoot · codeHash)' }, { id: 'proof-caching', title: '증명 캐싱 전략' }, { id: 'error-cases', title: '에러 케이스 (누락 · 잘못된 증명)' }],
    component: () => import('@/pages/articles/ethereum/helios-state'),
  },
  {
    slug: 'helios-execution', title: 'Helios Execution RPC', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '왜 로컬 실행인가 (RPC 결과를 신뢰할 수 없음)' }, { id: 'proof-db', title: 'ProofDB 아키텍처 (증명 기반 가상 DB)' }, { id: 'eth-call', title: 'eth_call: revm 로컬 실행' }, { id: 'get-balance', title: 'eth_getBalance 구현' }, { id: 'get-code', title: 'eth_getCode 구현' }, { id: 'get-storage', title: 'eth_getStorageAt 구현' }, { id: 'get-logs', title: 'eth_getLogs: Bloom Filter 필터링' }, { id: 'send-tx', title: 'eth_sendRawTransaction (유일한 신뢰 지점)' }, { id: 'gas-estimation', title: '가스 추정 (경량 클라이언트 기반)' }],
    component: () => import('@/pages/articles/ethereum/helios-execution'),
  },
  {
    slug: 'helios-types', title: 'Helios 타입 시스템', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: 'CL 타입 vs EL 타입 비교' }, { id: 'beacon-header', title: 'BeaconBlockHeader 필드 상세' }, { id: 'sync-aggregate', title: 'SyncAggregate (bits + signature)' }, { id: 'lc-update', title: 'LightClientUpdate 구조체' }, { id: 'store', title: 'LightClientStore 상태 관리' }, { id: 'fork-domain', title: 'Fork · ForkData · Domain 계산' }, { id: 'ssz-serialization', title: 'SSZ 직렬화 (이 타입들에 대해)' }],
    component: () => import('@/pages/articles/ethereum/helios-types'),
  },
  {
    slug: 'helios-config', title: 'Helios 설정 · 캐싱 · 네트워크', subcategory: 'eth-helios',
    sections: [{ id: 'overview', title: '설정 전체 구조' }, { id: 'network-enum', title: 'Network enum (mainnet · sepolia · holesky)' }, { id: 'consensus-spec', title: 'ConsensusSpec 파라미터' }, { id: 'client-builder', title: 'ClientBuilder 패턴' }, { id: 'rpc-endpoints', title: 'CL/EL RPC 엔드포인트 설정' }, { id: 'file-db', title: 'FileDB 체크포인트 영속성' }, { id: 'multi-rpc', title: '멀티 RPC Fallback 전략' }],
    component: () => import('@/pages/articles/ethereum/helios-config'),
  },
  {
    slug: 'kohaku-provider', title: 'Kohaku: 프라이버시 우선 이더리움 월렛', subcategory: 'eth-privacy',
    sections: [
      { id: 'overview', title: '프레임워크 아키텍처 & 위협 모델' },
      { id: 'provider-trait', title: 'Provider trait 조합 패턴' },
      { id: 'private-rpc', title: '프라이빗 RPC: ORAM & TEE' },
      { id: 'key-derivation', title: 'BIP-44 키 파생 & 로컬 서명' },
      { id: 'tx-submission', title: 'TX 제출: Dandelion++ 프로토콜' },
      { id: 'ens-resolution', title: 'ENS 경량 해석' },
      { id: 'token-tracking', title: '토큰 잔액 추적 (ERC-20/721)' },
      { id: 'gas-estimation', title: '가스 추정 (경량 클라이언트 기반)' },
      { id: 'multichain', title: '멀티체인 지원' },
    ],
    component: () => import('@/pages/articles/blockchain/kohaku-provider'),
  },
  {
    slug: 'pq-account', title: 'Post-Quantum Account Abstraction', subcategory: 'eth-privacy',
    sections: [
      { id: 'overview', title: '양자 위협 & AA 해결책' },
      { id: 'userop-struct', title: 'UserOperation 구조체' },
      { id: 'entrypoint', title: 'EntryPoint.handleOps() 내부 추적' },
      { id: 'validate', title: 'validateUserOp() 검증 흐름' },
      { id: 'execute', title: 'execute() 실행 & 상태 변경' },
      { id: 'dilithium-keygen', title: 'Dilithium 키 생성 (Module-LWE)' },
      { id: 'dilithium-sign', title: 'Dilithium 서명 (NTT + 거부 샘플링)' },
      { id: 'dilithium-verify', title: 'Dilithium 검증 (UseHint)' },
      { id: 'hybrid-migration', title: '하이브리드 전환: ECDSA → PQ' },
    ],
    component: () => import('@/pages/articles/blockchain/pq-account'),
  },
];
