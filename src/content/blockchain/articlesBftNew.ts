import type { Article } from "../types";

export const bftNewArticles: Article[] = [
  {
    slug: "longest-chain",
    title: "Nakamoto 최장 체인 합의",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "최장 체인 개요" },
      { id: "chain-selection", title: "체인 선택 규칙" },
      { id: "finality", title: "확률적 최종성" },
      { id: "comparison", title: "BFT와의 비교" },
    ],
    component: () => import("@/pages/articles/blockchain/longest-chain"),
  },
  {
    slug: "avalanche-consensus",
    title: "Avalanche 합의: sampling에서 Snowball까지",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "한눈에 보는 전체 흐름" },
      { id: "sampling-poll", title: "무작위 표본과 threshold" },
      { id: "confidence", title: "Snowflake와 Snowball 상태" },
      { id: "release", title: "Safety·liveness와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/avalanche-consensus"),
  },
  {
    slug: "tusk",
    title: "Tusk (비동기 DAG 합의)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "Narwhal DAG와 Tusk의 경계" },
      { id: "coin-support", title: "공통 coin과 f+1 support" },
      { id: "causal-order", title: "Leader history를 total order로" },
      { id: "release", title: "비동기 liveness와 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/tusk"),
  },
  {
    slug: "autobahn-deep",
    title: "Autobahn 하이브리드 파이프라인 심층",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "Lane과 cut 경계" },
      { id: "lanes-cut", title: "Car PoA와 certified cut" },
      { id: "commit-recovery", title: "Commit과 view change" },
      { id: "release", title: "Blip·backlog release" },
    ],
    component: () => import("@/pages/articles/blockchain/autobahn-deep"),
  },
  {
    slug: "mysticeti",
    title: "Mysticeti (Sui 최신 합의)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "Uncertified DAG 경계" },
      { id: "uncertified-votes", title: "Support와 vote pattern" },
      { id: "decision-linearize", title: "Slot decision과 linearize" },
      { id: "release", title: "FPC와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/mysticeti"),
  },
  {
    slug: "gossipbft",
    title: "GossiPBFT: weighted quorum에서 decision까지",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "전파와 합의의 경계" },
      { id: "quorum-phase", title: "Weighted quorum과 phases" },
      { id: "recovery", title: "Bottom·timeout·rebroadcast" },
      { id: "release", title: "Failure test와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/gossipbft"),
  },
  {
    slug: "consensus-comparison",
    title: "합의 프로토콜 종합 비교",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "종합 비교 개요" },
      { id: "performance", title: "성능 비교" },
      { id: "security", title: "안전성 & 활성" },
      { id: "use-cases", title: "용도별 선택 가이드" },
    ],
    component: () => import("@/pages/articles/blockchain/consensus-comparison"),
  },
];
