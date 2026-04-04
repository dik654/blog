import type { Article } from '../types';

export const ethereum3Articles: Article[] = [
  /* ── Reth (EL) 심층 분석 ── */
  /* 순서: 기초 → 저장 → 실행 → TX/가스 → 네트워크 → 확장 */

  /* 1. 기초: 노드 시작 & 설정 */
  {
    slug: 'reth-cli', title: 'Reth CLI & 노드 빌더', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'CLI 아키텍처' }, { id: 'node-builder', title: 'NodeBuilder 패턴' }, { id: 'components', title: 'NodeComponents trait' }],
    component: () => import('@/pages/articles/ethereum/reth-cli'),
  },
  {
    slug: 'reth-chainspec', title: 'Reth ChainSpec & 하드포크 관리', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'ChainSpec 구조' }, { id: 'hardfork', title: 'Hardfork enum & 활성화' }, { id: 'genesis', title: 'Genesis 초기화' }],
    component: () => import('@/pages/articles/ethereum/reth-chainspec'),
  },
  {
    slug: 'reth-alloy-primitives', title: 'Reth alloy 프리미티브 & RLP', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'alloy 생태계 개요' }, { id: 'rlp', title: 'alloy-rlp 인코딩/디코딩' }, { id: 'primitives', title: 'Address · B256 · U256 타입' }],
    component: () => import('@/pages/articles/ethereum/reth-alloy-primitives'),
  },

  /* 2. 저장: 데이터가 어디에 어떻게 저장되는가 */
  {
    slug: 'lsm-tree', title: 'LSM-tree (Log-Structured Merge-tree)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'LSM-tree가 뭔가' }, { id: 'write-flow', title: '쓰기 경로' }, { id: 'read-flow', title: '읽기 경로와 Read Amplification' }, { id: 'compaction', title: 'Compaction과 Write Amplification' }, { id: 'compaction-stall', title: 'Compaction 간섭 문제' }, { id: 'lsm-vs-btree', title: 'LSM-tree vs B+tree' }],
    component: () => import('@/pages/articles/ethereum/lsm-tree'),
  },
  {
    slug: 'bplus-tree', title: 'B+tree 자료구조 (검색 · 삽입 · 삭제)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'B+tree가 왜 필요한가' }, { id: 'node-structure', title: '노드 구조' }, { id: 'search', title: '검색 과정' }, { id: 'insert-split', title: '삽입과 노드 분할' }, { id: 'delete-merge', title: '삭제와 병합/재분배' }, { id: 'why-database', title: 'DB에서 B+tree를 쓰는 이유' }],
    component: () => import('@/pages/articles/ethereum/bplus-tree'),
  },
  {
    slug: 'mdbx-internals', title: 'MDBX 내부 구조 (B+tree · mmap · MVCC)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'MDBX가 왜 필요한가' }, { id: 'btree-structure', title: 'B+tree 페이지 구조' }, { id: 'mmap-cow', title: 'mmap과 Copy-on-Write' }, { id: 'mvcc', title: 'MVCC 동시성 모델' }, { id: 'dupsort', title: 'DupSort와 멀티밸류' }, { id: 'vs-alternatives', title: 'MDBX vs 대안 비교' }],
    component: () => import('@/pages/articles/ethereum/mdbx-internals'),
  },
  {
    slug: 'reth-db', title: 'Reth DB (MDBX & Tables)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'DB 아키텍처' }, { id: 'tables', title: 'Tables 매크로 & 스키마' }, { id: 'cursor', title: 'Cursor & 트랜잭션' }, { id: 'static-files', title: 'StaticFiles (고대 데이터)' }],
    component: () => import('@/pages/articles/ethereum/reth-db'),
  },
  {
    slug: 'reth-provider', title: 'Reth State Provider & 상태 접근', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'Provider 계층 구조' }, { id: 'state-provider', title: 'StateProvider trait' }, { id: 'bundle-state', title: 'BundleState & revm 캐시' }, { id: 'historical', title: 'HistoricalStateProvider' }],
    component: () => import('@/pages/articles/ethereum/reth-provider'),
  },
  {
    slug: 'reth-trie', title: 'Reth Trie & 상태 루트 계산', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '트라이 아키텍처' }, { id: 'prefix-set', title: 'PrefixSet & 변경 추적' }, { id: 'state-root', title: 'StateRoot 계산 흐름' }, { id: 'parallel', title: '병렬 상태 루트 (Parallel Trie)' }],
    component: () => import('@/pages/articles/ethereum/reth-trie'),
  },

  /* 3. 실행: 블록을 어떻게 처리하는가 */
  {
    slug: 'reth-pipeline', title: 'Reth Pipeline & Stages 아키텍처', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'Pipeline 전체 흐름' }, { id: 'headers-stage', title: 'HeadersStage 추적' }, { id: 'bodies-stage', title: 'BodiesStage 추적' }, { id: 'senders-stage', title: 'SendersStage 추적' }, { id: 'execution-stage', title: 'ExecutionStage 추적' }, { id: 'merkle-stage', title: 'MerkleStage 추적' }, { id: 'stage-trait', title: 'Stage trait & 실행 모델' }],
    component: () => import('@/pages/articles/ethereum/reth-pipeline'),
  },
  {
    slug: 'reth-block-execution', title: 'Reth 블록 실행 (revm)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '블록 실행 전체 흐름' }, { id: 'executor', title: 'BlockExecutor trait' }, { id: 'evm-config', title: 'EvmConfig & revm 설정' }, { id: 'state-changes', title: '상태 변경 & Bundle' }],
    component: () => import('@/pages/articles/ethereum/reth-block-execution'),
  },
  {
    slug: 'reth-precompiles', title: 'Reth 프리컴파일 (revm)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '프리컴파일 레지스트리' }, { id: 'crypto', title: 'ecRecover · SHA256 · bn128' }, { id: 'eip-precompiles', title: 'blake2f · KZG Point Eval' }],
    component: () => import('@/pages/articles/ethereum/reth-precompiles'),
  },

  /* 4. TX & 가스: 트랜잭션 생명주기 */
  {
    slug: 'reth-eip1559', title: 'Reth EIP-1559 가스 메커니즘', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'EIP-1559 가스 모델' }, { id: 'calc-base-fee', title: 'calc_next_block_base_fee' }, { id: 'effective-tip', title: 'effective_tip_per_gas' }],
    component: () => import('@/pages/articles/ethereum/reth-eip1559'),
  },
  {
    slug: 'reth-txpool', title: 'Reth 트랜잭션 풀', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '풀 아키텍처' }, { id: 'validation', title: 'TransactionValidator trait' }, { id: 'ordering', title: 'TransactionOrdering & 우선순위' }, { id: 'subpool', title: 'Pending · Queued · BaseFee 서브풀' }],
    component: () => import('@/pages/articles/ethereum/reth-txpool'),
  },
  {
    slug: 'reth-eip4844', title: 'Reth EIP-4844 Blob TX', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'Blob TX 구조' }, { id: 'blob-pool', title: 'BlobPool 관리' }, { id: 'blob-store', title: 'BlobStore 저장소' }, { id: 'kzg', title: 'KZG Commitment 검증' }, { id: 'blob-gas', title: 'Blob Gas 가격 모델' }, { id: 'lifecycle', title: 'Blob 생명주기' }],
    component: () => import('@/pages/articles/ethereum/reth-eip4844'),
  },
  {
    slug: 'reth-payload-builder', title: 'Reth Payload Builder (블록 생성)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '페이로드 빌드 흐름' }, { id: 'build-job', title: 'BuildJob & TX 선택' }, { id: 'engine-api', title: 'Engine API 연동' }],
    component: () => import('@/pages/articles/ethereum/reth-payload-builder'),
  },

  /* 5. 네트워크 & 동기화 */
  {
    slug: 'reth-net', title: 'Reth 네트워크 (devp2p + discv4)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '네트워크 스택' }, { id: 'session', title: 'SessionManager & 세션 라이프사이클' }, { id: 'eth-wire', title: 'eth-wire 프로토콜 메시지' }, { id: 'discovery', title: 'Discovery v4 (Kademlia)' }],
    component: () => import('@/pages/articles/ethereum/reth-net'),
  },
  {
    slug: 'reth-sync', title: 'Reth 동기화 전략 (Full + Snap)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: '동기화 모드 비교' }, { id: 'full-sync', title: 'Full Pipeline 동기화' }, { id: 'snap-sync', title: 'Snap Sync 상태 다운로드' }, { id: 'live-sync', title: 'Live Sync (ExEx)' }],
    component: () => import('@/pages/articles/ethereum/reth-sync'),
  },
  {
    slug: 'reth-rpc', title: 'Reth RPC & Engine API', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'RPC 서버 아키텍처' }, { id: 'eth-api', title: 'EthApi trait 구현' }, { id: 'engine-api', title: 'Engine API (CL 연동)' }, { id: 'middleware', title: '미들웨어 & Rate Limiting' }],
    component: () => import('@/pages/articles/ethereum/reth-rpc'),
  },

  /* 6. 확장 */
  {
    slug: 'reth-exex', title: 'Reth ExEx (Execution Extensions)', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'ExEx 아키텍처' }, { id: 'notification', title: 'ExExNotification 스트림' }, { id: 'use-cases', title: '인덱서 · 브릿지 · 분석' }],
    component: () => import('@/pages/articles/ethereum/reth-exex'),
  },
  {
    slug: 'reth-mev', title: 'Reth MEV & Builder 연동', subcategory: 'eth-reth',
    sections: [{ id: 'overview', title: 'MEV 아키텍처' }, { id: 'builder-api', title: 'Builder API 연동' }, { id: 'flashbots', title: 'Flashbots 호환' }],
    component: () => import('@/pages/articles/ethereum/reth-mev'),
  },
];
