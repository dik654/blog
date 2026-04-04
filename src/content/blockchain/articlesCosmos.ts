import type { Article } from '../types';

export const cosmosArticles: Article[] = [
  /* ── Cosmos SDK (애플리케이션 레벨) ── */
  {
    slug: 'cosmos-sdk', title: 'Cosmos SDK 아키텍처 (이더리움 EL과 비교)', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '개요' }, { id: 'baseapp', title: 'BaseApp — 애플리케이션 셸' }, { id: 'abci-integration', title: 'ABCI 통합 — FinalizeBlock' }, { id: 'runtx-pipeline', title: 'RunTx 파이프라인' }, { id: 'module-architecture', title: '모듈 시스템 & Keeper' }, { id: 'state-management', title: '상태 관리 (MultiStore & IAVL)' }],
    component: () => import('@/pages/articles/blockchain/cosmos-sdk'),
  },

  /* ── CometBFT 심층 분석 ── */
  {
    slug: 'cometbft', title: 'CometBFT 아키텍처 개요', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '개요' }],
    component: () => import('@/pages/articles/blockchain/cometbft'),
  },

  /* 1. 기본 타입 & 데이터 구조 */
  {
    slug: 'cometbft-types', title: 'CometBFT 타입: Block · Vote · Validator', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '핵심 타입 전체 구조' }, { id: 'block-header', title: 'Block & Header 구조체' }, { id: 'vote-commit', title: 'Vote · Commit · VoteSet' }, { id: 'validator-set', title: 'ValidatorSet & 가중 추첨' }],
    component: () => import('@/pages/articles/blockchain/cometbft-types'),
  },

  /* 2. 합의 엔진 (핵심) */
  {
    slug: 'cometbft-consensus', title: 'CometBFT 합의 엔진: receiveRoutine → 라운드 상태 머신', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '합의 엔진 전체 구조' }, { id: 'receive-routine', title: 'receiveRoutine & handleMsg 디스패치' }, { id: 'round-state', title: 'enterPropose → enterPrevote → enterPrecommit → enterCommit' }, { id: 'timeout', title: '타임아웃 전략 & 장애 복구' }, { id: 'byzantine', title: '비잔틴 탐지 & 증거 수집' }],
    component: () => import('@/pages/articles/blockchain/cometbft-consensus'),
  },

  /* 3. ABCI */
  {
    slug: 'cometbft-abci', title: 'CometBFT ABCI: PrepareProposal → FinalizeBlock → Commit', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: 'ABCI 인터페이스 전체 구조' }, { id: 'abci-client', title: 'ABCI 클라이언트 (gRPC · 소켓 · 로컬)' }, { id: 'prepare-process', title: 'PrepareProposal & ProcessProposal' }, { id: 'finalize-commit', title: 'FinalizeBlock & Commit' }],
    component: () => import('@/pages/articles/blockchain/cometbft-abci'),
  },

  /* 4. 블록 실행 (전체 흐름) */
  {
    slug: 'cometbft-execution', title: 'CometBFT BlockExecutor.ApplyBlock 전체 추적', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: 'ApplyBlock 전체 흐름' }, { id: 'validate-block', title: 'ValidateBlock (헤더 · 커밋 · 증거 검증)' }, { id: 'execute-block', title: 'ApplyBlock 내부 (ABCI 호출 순서)' }, { id: 'save-state', title: 'SaveState & BlockStore 기록' }],
    component: () => import('@/pages/articles/blockchain/cometbft-execution'),
  },

  /* 5. P2P 네트워킹 */
  {
    slug: 'cometbft-p2p', title: 'CometBFT P2P: MConnection · Switch · Reactor', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: 'P2P 스택 전체 구조' }, { id: 'mconnection', title: 'MConnection 다중화 (채널 프로토콜)' }, { id: 'switch', title: 'Switch & Peer 관리' }, { id: 'reactor', title: 'Reactor 패턴 (메시지 디스패치)' }],
    component: () => import('@/pages/articles/blockchain/cometbft-p2p'),
  },

  /* 6. 멤풀 */
  {
    slug: 'cometbft-mempool', title: 'CometBFT 멤풀: CListMempool · CheckTx · Recheck', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '멤풀 전체 흐름' }, { id: 'clist', title: 'CListMempool 이중 연결 리스트' }, { id: 'checktx', title: 'CheckTx → ABCI 검증' }, { id: 'recheck', title: 'Recheck & 블록 후 정리' }],
    component: () => import('@/pages/articles/blockchain/cometbft-mempool'),
  },

  /* 7. 상태 저장 */
  {
    slug: 'cometbft-state', title: 'CometBFT 상태: State · BlockStore · EvidencePool', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '상태 관리 전체 구조' }, { id: 'state-struct', title: 'State 구조체 (LastBlockHeight, Validators, AppHash)' }, { id: 'blockstore', title: 'BlockStore (LevelDB 블록 저장)' }, { id: 'evidence', title: 'EvidencePool (비잔틴 증거 수집)' }],
    component: () => import('@/pages/articles/blockchain/cometbft-state'),
  },

  /* 8. 암호학 */
  {
    slug: 'cometbft-crypto', title: 'CometBFT 암호학: Ed25519 · Merkle · VRF', subcategory: 'cosmos-core',
    sections: [{ id: 'overview', title: '암호 프리미티브 전체 구조' }, { id: 'ed25519', title: 'Ed25519 서명 & 검증' }, { id: 'merkle', title: 'Merkle 증명 & SimpleHashFromByteSlices' }, { id: 'hash', title: 'TMHASH & 해시 체인' }],
    component: () => import('@/pages/articles/blockchain/cometbft-crypto'),
  },

  /* ── Cosmos EVM Integration ── */
  {
    slug: 'omni-octane', title: 'Omni Octane (CometBFT + Engine API)', subcategory: 'cosmos-evm',
    sections: [{ id: 'overview', title: '개요' }, { id: 'engine-integration', title: 'Engine API 통합 & 크로스체인' }],
    component: () => import('@/pages/articles/blockchain/omni-octane'),
  },
  {
    slug: 'initia-evm', title: 'Initia MiniEVM (Cosmos 내장 EVM)', subcategory: 'cosmos-evm',
    sections: [{ id: 'overview', title: '개요' }, { id: 'architecture', title: '상태 매핑 & 실행 흐름' }, { id: 'evm-execution', title: 'EVM 실행 흐름' }, { id: 'tx-lifecycle', title: '트랜잭션 생명주기' }, { id: 'precompiles', title: '프리컴파일' }],
    component: () => import('@/pages/articles/blockchain/initia-evm'),
  },
  {
    slug: 'berachain', title: 'Berachain BeaconKit (이더리움 CL의 Cosmos 구현)', subcategory: 'cosmos-evm',
    sections: [{ id: 'overview', title: '개요' }, { id: 'pol-architecture', title: 'Proof of Liquidity & 모듈 구조' }],
    component: () => import('@/pages/articles/blockchain/berachain'),
  },
  {
    slug: 'dydx', title: 'dYdX v4 (Cosmos SDK 기반 탈중앙화 거래소)', subcategory: 'cosmos-evm',
    sections: [{ id: 'overview', title: '개요' }, { id: 'orderbook-architecture', title: '오더북 아키텍처' }, { id: 'matching-engine', title: '매칭 엔진' }, { id: 'cosmos-integration', title: 'Cosmos SDK 통합' }, { id: 'indexer', title: '인덱서' }, { id: 'frontend', title: '프론트엔드' }],
    component: () => import('@/pages/articles/blockchain/dydx'),
  },
  {
    slug: 'evmos', title: 'Evmos / Cosmos EVM', subcategory: 'cosmos-evm',
    sections: [{ id: 'overview', title: '개요' }, { id: 'evm-module', title: 'EVM 모듈 (x/vm)' }, { id: 'revenue-module', title: 'ERC20 & Revenue 모듈' }, { id: 'ibc-integration', title: 'IBC EVM 통합' }],
    component: () => import('@/pages/articles/blockchain/evmos'),
  },
];
