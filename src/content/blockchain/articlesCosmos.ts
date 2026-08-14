import type { Article } from "../types";

export const cosmosArticles: Article[] = [
  /* ── Cosmos SDK (애플리케이션 레벨) ── */
  {
    slug: "cosmos-sdk",
    title: "Cosmos SDK v0.55: transaction에서 committed state까지",
    subcategory: "cosmos-core",
    sections: [
      { id: "overview", title: "Consensus와 application의 경계" },
      { id: "baseapp", title: "BaseApp execution mode와 branch" },
      { id: "runtx-pipeline", title: "AnteHandler·MsgSend·gas" },
      { id: "module-architecture", title: "Module·keeper·store ownership" },
      { id: "state-management", title: "CacheMultiStore와 commit" },
    ],
    component: () => import("@/pages/articles/blockchain/cosmos-sdk"),
  },

  /* ── CometBFT 심층 분석 ── */
  {
    slug: "cometbft",
    title: "CometBFT 아키텍처 개요",
    subcategory: "cosmos-core",
    sections: [{ id: "overview", title: "개요" }],
    component: () => import("@/pages/articles/blockchain/cometbft"),
  },

  /* 1. 기본 타입 & 데이터 구조 */
  {
    slug: "cometbft-types",
    title: "CometBFT 타입: Block · Vote · Validator",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title: "핵심 type은 block·vote·commit의 합의 증거를 보존한다",
      },
      { id: "block-header", title: "Block & Header 구조체" },
      { id: "vote-commit", title: "Vote · Commit · VoteSet" },
      { id: "validator-set", title: "ValidatorSet & 가중 추첨" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-types"),
  },

  /* 2. 합의 엔진 (핵심) */
  {
    slug: "cometbft-consensus",
    title: "CometBFT 합의 엔진: receiveRoutine → 라운드 상태 머신",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title:
          "Consensus state machine은 proposal·prevote·precommit을 round마다 진행한다",
      },
      { id: "receive-routine", title: "receiveRoutine & handleMsg 디스패치" },
      {
        id: "round-state",
        title: "enterPropose → enterPrevote → enterPrecommit → enterCommit",
      },
      { id: "timeout", title: "타임아웃 전략 & 장애 복구" },
      { id: "byzantine", title: "비잔틴 탐지 & 증거 수집" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-consensus"),
  },

  /* 3. ABCI */
  {
    slug: "cometbft-abci",
    title: "CometBFT ABCI: PrepareProposal → FinalizeBlock → Commit",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title: "ABCI++는 합의 엔진과 애플리케이션의 상태 전이를 분리한다",
      },
      { id: "abci-client", title: "ABCI 클라이언트 (gRPC · 소켓 · 로컬)" },
      { id: "prepare-process", title: "PrepareProposal & ProcessProposal" },
      { id: "finalize-commit", title: "FinalizeBlock & Commit" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-abci"),
  },

  /* 4. 블록 실행 (전체 흐름) */
  {
    slug: "cometbft-execution",
    title: "CometBFT BlockExecutor: 검증·실행·영속화와 replay",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title: "결정된 block과 durable application state는 아직 다르다",
      },
      {
        id: "validate-block",
        title: "ValidateBlock: 현재 State의 바로 다음 block인지 검사한다",
      },
      {
        id: "execute-block",
        title: "FinalizeBlock result에서 next State를 계산한다",
      },
      {
        id: "save-state",
        title: "Result → Commit → State 저장과 crash replay",
      },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-execution"),
  },

  /* 5. P2P 네트워킹 */
  {
    slug: "cometbft-p2p",
    title: "CometBFT P2P: MConnection · Switch · Reactor",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title:
          "P2P stack은 peer discovery와 channel별 message routing을 분리한다",
      },
      { id: "mconnection", title: "MConnection 다중화 (채널 프로토콜)" },
      { id: "switch", title: "Switch & Peer 관리" },
      { id: "reactor", title: "Reactor 패턴 (메시지 디스패치)" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-p2p"),
  },

  /* 6. 멤풀 */
  {
    slug: "cometbft-mempool",
    title: "CometBFT mempool: admission · reap · recheck",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title: "Mempool은 node-local 대기실이지 공유 원장이 아니다",
      },
      {
        id: "clist",
        title: "CList의 local order · reap · availability signal",
      },
      {
        id: "checktx",
        title: "Capacity · cache · asynchronous CheckTx admission",
      },
      { id: "recheck", title: "Commit 뒤 Update · recheck barrier" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-mempool"),
  },

  /* 7. 상태 저장 */
  {
    slug: "cometbft-state",
    title: "CometBFT state: State · BlockStore · state sync · replay",
    subcategory: "cosmos-core",
    sections: [
      { id: "overview", title: "한 node의 durable receipt 네 종류를 구분한다" },
      {
        id: "state-struct",
        title: "State snapshot: 다음 height의 검증 입력",
      },
      { id: "blockstore", title: "BlockStore 원본과 evidence-aware retention" },
      { id: "evidence", title: "State sync trust와 crash replay 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-state"),
  },

  /* 8. 암호학 */
  {
    slug: "cometbft-crypto",
    title: "CometBFT v0.40 crypto: vote signature·Merkle·TMHash",
    subcategory: "cosmos-core",
    sections: [
      {
        id: "overview",
        title: "Validator vote와 user transaction 서명은 다르다",
      },
      { id: "ed25519", title: "Ed25519 verifier contract" },
      { id: "merkle", title: "Prefix Merkle commitment" },
      { id: "hash", title: "TMHash 32-byte hash와 20-byte address" },
    ],
    component: () => import("@/pages/articles/blockchain/cometbft-crypto"),
  },

  /* ── Cosmos EVM Integration ── */
  {
    slug: "omni-octane",
    title: "Omni Octane (CometBFT + Engine API)",
    subcategory: "cosmos-evm",
    sections: [
      { id: "overview", title: "개요" },
      { id: "engine-integration", title: "Engine API 통합 & 크로스체인" },
    ],
    component: () => import("@/pages/articles/blockchain/omni-octane"),
  },
  {
    slug: "initia-evm",
    title: "Initia MiniEVM (Cosmos 내장 EVM)",
    subcategory: "cosmos-evm",
    sections: [
      { id: "overview", title: "개요" },
      { id: "architecture", title: "상태 매핑 & 실행 흐름" },
      { id: "evm-execution", title: "EVM 실행 흐름" },
      { id: "tx-lifecycle", title: "트랜잭션 생명주기" },
      { id: "precompiles", title: "프리컴파일" },
    ],
    component: () => import("@/pages/articles/blockchain/initia-evm"),
  },
  {
    slug: "berachain",
    title: "Berachain — BERA·BGT Proof of Liquidity와 BeaconKit 경계",
    subcategory: "cosmos-evm",
    sections: [
      { id: "overview", title: "BERA·BGT·HONEY 경계" },
      { id: "pol-flow", title: "PoL reward flow" },
      { id: "consensus-boundary", title: "BeaconKit consensus 경계" },
      { id: "berachain-release", title: "State·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/berachain"),
  },
  {
    slug: "evmos",
    title: "Evmos v20: Ethereum transaction을 Cosmos state로 commit하기",
    subcategory: "cosmos-evm",
    sections: [
      { id: "overview", title: "Cosmos envelope와 Ethereum semantics" },
      { id: "evm-module", title: "Ethereum ante chain·EVM transition" },
      { id: "revenue-module", title: "StateDB journal·Cosmos KV commit" },
      { id: "ibc-integration", title: "ERC-20·IBC representation 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/evmos"),
  },
];
