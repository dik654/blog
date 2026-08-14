import type { Article } from "../types";

export const filecoinArticles: Article[] = [
  /* ── 개요 & 합의 ── */
  {
    slug: "filecoin-lotus",
    title: "Filecoin Lotus 아키텍처",
    subcategory: "fil-overview",
    sections: [
      { id: "overview", title: "개요" },
      { id: "process-map", title: "프로세스 책임 지도" },
      { id: "artifact-handoff", title: "체인·provider 산출물" },
      { id: "operations", title: "운영 판단" },
      { id: "release-gate", title: "릴리스 기준" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-lotus"),
  },
  {
    slug: "expected-consensus",
    title: "Expected Consensus: leader에서 weighted head까지",
    subcategory: "fil-overview",
    sections: [
      { id: "overview", title: "한눈에 보는 전체 흐름" },
      { id: "sortition", title: "Poisson sortition" },
      { id: "tipset-weight", title: "Tipset·validation·weight" },
      { id: "release", title: "Reorg와 release 경계" },
    ],
    component: () => import("@/pages/articles/filecoin/expected-consensus"),
  },
  {
    slug: "filecoin-f3",
    title: "Filecoin F3: EC에서 fast finality까지",
    subcategory: "fil-overview",
    sections: [
      { id: "overview", title: "한눈에 보는 EC→F3" },
      { id: "ec-f3-boundary", title: "EC input·base·committee" },
      { id: "cert-sync", title: "Certificate sync와 fork-choice fence" },
      { id: "release", title: "Halt·retry·release" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-f3"),
  },

  /* ── Lotus 내부 (심층) ── */
  {
    slug: "lotus-chain",
    title: "Lotus 체인 동기화 & 블록 검증",
    subcategory: "fil-lotus",
    sections: [
      { id: "overview", title: "ChainSync 전체 흐름" },
      { id: "sync-stages", title: "Header·message 수집" },
      { id: "state-replay", title: "Tipset 상태 재실행" },
      { id: "head-reorg", title: "Head 변경·reorg" },
      { id: "release-gate", title: "릴리스 기준" },
    ],
    component: () => import("@/pages/articles/blockchain/lotus-chain"),
  },
  {
    slug: "lotus-miner",
    title: "Lotus 마이닝 & 섹터 관리",
    subcategory: "fil-lotus",
    sections: [
      { id: "overview", title: "마이닝 전체 흐름" },
      { id: "sealing-jobs", title: "Sector job·chain 단계" },
      { id: "proof-duties", title: "Winning·WindowPoSt" },
      { id: "scheduler", title: "스케줄러·deadline" },
      { id: "release-gate", title: "릴리스 기준" },
    ],
    component: () => import("@/pages/articles/blockchain/lotus-miner"),
  },
  {
    slug: "lotus-market",
    title: "Lotus 스토리지 딜 & 리트리벌",
    subcategory: "fil-lotus",
    sections: [
      { id: "overview", title: "딜 흐름 개요" },
      { id: "deal-artifact", title: "Deal artifact" },
      { id: "activation", title: "Sector activation" },
      { id: "retrieval", title: "Retrieval delivery" },
      { id: "release-gate", title: "릴리스 기준" },
    ],
    component: () => import("@/pages/articles/blockchain/lotus-market"),
  },
  {
    slug: "lotus-mpool",
    title: "Lotus 메시지 풀 & 가스",
    subcategory: "fil-lotus",
    sections: [
      { id: "overview", title: "메시지 풀 구조" },
      { id: "gas-estimation", title: "가스 추정 & 선택" },
      { id: "nonce-management", title: "Nonce 관리" },
    ],
    component: () => import("@/pages/articles/blockchain/lotus-mpool"),
  },
  {
    slug: "lotus-state",
    title: "Lotus 상태 관리 (Actor & HAMT)",
    subcategory: "fil-lotus",
    sections: [
      { id: "overview", title: "Actor 시스템" },
      { id: "hamt-amt", title: "HAMT & AMT 자료구조" },
      { id: "state-tree", title: "StateTree & 스냅샷" },
    ],
    component: () => import("@/pages/articles/blockchain/lotus-state"),
  },
];
