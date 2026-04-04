import type { Article } from '../types';

export const prysmArticles: Article[] = [
  /* ── Prysm (CL) 개요 ── */
  {
    slug: 'prysm', title: 'Prysm 아키텍처 개요', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '아키텍처 개요' }],
    component: () => import('@/pages/articles/ethereum/prysm'),
  },

  /* ── Prysm (CL) 심층 분석 ── */
  /* 순서: 기초(직렬화/암호) → 상태 → 합의 → 검증자 → 네트워크 → 저장 → API */

  /* 1. 기초: 직렬화 & 암호 (모든 데이터의 기반) */
  {
    slug: 'prysm-ssz', title: 'Prysm SSZ 직렬화 & Merkleization', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'SSZ 규격' }, { id: 'encode-decode', title: '인코딩 & 디코딩' }, { id: 'merkleize', title: 'Merkleization & HashTreeRoot' }, { id: 'multiproof', title: 'Multiproof & Light Client' }],
    component: () => import('@/pages/articles/ethereum/prysm-ssz'),
  },
  {
    slug: 'prysm-bls', title: 'Prysm BLS 서명 (BLST 바인딩)', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'BLS12-381 개요' }, { id: 'blst-binding', title: 'BLST CGo 바인딩' }, { id: 'sign-verify', title: '서명 · 검증 · 집계' }, { id: 'batch-verification', title: '배치 검증 최적화' }],
    component: () => import('@/pages/articles/ethereum/prysm-bls'),
  },

  /* 2. 상태: 비콘 상태 구조 & 전환 */
  {
    slug: 'prysm-beacon-state', title: 'Prysm BeaconState 구조 & 상태 접근', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'BeaconState 개요' }, { id: 'state-interface', title: '상태 인터페이스 & Copy-on-Write' }, { id: 'field-trie', title: 'FieldTrie & 해시 캐싱' }, { id: 'state-fork', title: '포크별 상태 변형' }],
    component: () => import('@/pages/articles/ethereum/prysm-beacon-state'),
  },
  {
    slug: 'prysm-slot-processing', title: 'Prysm 슬롯 처리 & 상태 루트', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '슬롯 처리 전체 흐름' }, { id: 'process-slot', title: 'ProcessSlot 내부' }, { id: 'state-root-caching', title: '상태 루트 캐싱' }],
    component: () => import('@/pages/articles/ethereum/prysm-slot-processing'),
  },
  {
    slug: 'prysm-epoch-processing', title: 'Prysm 에폭 처리: 보상, 패널티, 레지스트리', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '에폭 전환 파이프라인' }, { id: 'justification-finalization', title: 'Justification & Finalization' }, { id: 'rewards-penalties', title: '보상 & 패널티' }, { id: 'registry-slashings', title: '레지스트리 & 슬래싱' }],
    component: () => import('@/pages/articles/ethereum/prysm-epoch-processing'),
  },

  /* 3. 합의: 블록 처리 & 포크 선택 */
  {
    slug: 'prysm-block-processing', title: 'Prysm 블록 처리 & 상태 전환', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '블록 처리 전체 흐름' }, { id: 'process-block', title: 'ProcessBlock 내부' }, { id: 'operations', title: '오퍼레이션 처리' }, { id: 'execution-payload', title: '실행 페이로드 검증' }],
    component: () => import('@/pages/articles/ethereum/prysm-block-processing'),
  },
  {
    slug: 'prysm-block-proposal', title: 'Prysm 블록 제안 & 조립', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '블록 제안 파이프라인' }, { id: 'proposer-selection', title: 'Proposer 선정' }, { id: 'block-construction', title: '블록 조립' }, { id: 'graffiti-randao', title: 'RANDAO Reveal & Graffiti' }],
    component: () => import('@/pages/articles/ethereum/prysm-block-proposal'),
  },
  {
    slug: 'prysm-forkchoice', title: 'Prysm Fork Choice (LMD-GHOST)', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'Fork Choice 개요' }, { id: 'protoarray', title: 'doubly-linked-tree' }, { id: 'on-block', title: 'OnBlock & OnAttestation' }, { id: 'get-head', title: 'GetHead & 가중치 전파' }],
    component: () => import('@/pages/articles/ethereum/prysm-forkchoice'),
  },
  {
    slug: 'prysm-finality', title: 'Prysm Casper FFG & Finality', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'Casper FFG 메커니즘' }, { id: 'checkpoint-management', title: '체크포인트 관리' }, { id: 'finalization-pruning', title: 'Finalization & Prune' }, { id: 'weak-subjectivity', title: 'Weak Subjectivity' }],
    component: () => import('@/pages/articles/ethereum/prysm-finality'),
  },

  /* 4. 검증자: 클라이언트 & 의무 수행 */
  {
    slug: 'prysm-validator-client', title: 'Prysm 검증자 클라이언트', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '검증자 클라이언트 구조' }, { id: 'duty-assignment', title: '의무 할당 & 슬롯 루프' }, { id: 'key-management', title: '키 관리 (Keymanager)' }, { id: 'slashing-protection', title: '슬래싱 방지 DB' }],
    component: () => import('@/pages/articles/ethereum/prysm-validator-client'),
  },
  {
    slug: 'prysm-attestation', title: 'Prysm 어테스테이션: 생성, 집계, 서브넷', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '어테스테이션 생명주기' }, { id: 'attestation-creation', title: '생성 & 서명' }, { id: 'aggregation', title: '집계 & 서브넷' }, { id: 'pool-inclusion', title: '풀 관리 & 블록 포함' }],
    component: () => import('@/pages/articles/ethereum/prysm-attestation'),
  },
  {
    slug: 'prysm-sync-committee', title: 'Prysm 싱크 위원회', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '싱크 위원회 개요' }, { id: 'participation', title: '위원회 참여 & 서명' }, { id: 'contribution', title: '기여 집계' }],
    component: () => import('@/pages/articles/ethereum/prysm-sync-committee'),
  },

  /* 5. 네트워크: P2P & 동기화 */
  {
    slug: 'prysm-p2p-libp2p', title: 'Prysm libp2p 네트워킹 & 피어 관리', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'libp2p 스택 개요' }, { id: 'peer-discovery', title: 'Discv5 피어 탐색' }, { id: 'peer-scoring', title: '피어 스코어링' }, { id: 'connection-gating', title: '연결 게이팅' }],
    component: () => import('@/pages/articles/ethereum/prysm-p2p-libp2p'),
  },
  {
    slug: 'prysm-gossipsub', title: 'Prysm Gossipsub 토픽 & 메시지 검증', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'Gossipsub 프로토콜' }, { id: 'topics', title: '토픽 & 포크 다이제스트' }, { id: 'message-validation', title: '메시지 검증 파이프라인' }, { id: 'snappy-encoding', title: 'SSZ-Snappy 인코딩' }],
    component: () => import('@/pages/articles/ethereum/prysm-gossipsub'),
  },
  {
    slug: 'prysm-sync', title: 'Prysm 초기 동기화 & 체크포인트 싱크', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '동기화 전략 비교' }, { id: 'initial-sync', title: 'Initial Sync' }, { id: 'checkpoint-sync', title: '체크포인트 싱크' }, { id: 'regular-sync', title: 'Regular Sync' }],
    component: () => import('@/pages/articles/ethereum/prysm-sync'),
  },

  /* 6. 저장: DB & 캐시 */
  {
    slug: 'prysm-beacon-db', title: 'Prysm BeaconDB (BoltDB/KV)', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'DB 아키텍처' }, { id: 'kv-schema', title: 'KV 버킷 스키마' }, { id: 'block-state-ops', title: '블록 & 상태 CRUD' }, { id: 'pruning-archival', title: '프루닝 & 아카이벌' }],
    component: () => import('@/pages/articles/ethereum/prysm-beacon-db'),
  },
  {
    slug: 'prysm-state-cache', title: 'Prysm 상태 캐시: Hot/Cold 전략', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: '상태 캐시 아키텍처' }, { id: 'hot-state', title: 'Hot State 캐시' }, { id: 'state-summary', title: 'State Summary & 재생' }, { id: 'cold-archive', title: 'Cold State 아카이브' }],
    component: () => import('@/pages/articles/ethereum/prysm-state-cache'),
  },

  /* 7. API: 외부 인터페이스 */
  {
    slug: 'prysm-beacon-api', title: 'Prysm Beacon API (REST & gRPC)', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'API 서버 아키텍처' }, { id: 'grpc-server', title: 'gRPC 서버' }, { id: 'rest-gateway', title: 'REST Gateway' }, { id: 'validator-api', title: 'Validator API' }],
    component: () => import('@/pages/articles/ethereum/prysm-beacon-api'),
  },
  {
    slug: 'prysm-engine-api', title: 'Prysm Engine API 연동 (CL → EL)', subcategory: 'eth-prysm',
    sections: [{ id: 'overview', title: 'Engine API 개요' }, { id: 'new-payload', title: 'NewPayload 호출' }, { id: 'forkchoice-updated', title: 'ForkchoiceUpdated' }, { id: 'payload-retrieval', title: 'GetPayload & MEV-Boost' }],
    component: () => import('@/pages/articles/ethereum/prysm-engine-api'),
  },
];
