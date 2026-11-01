import type { Article } from "../types";

export const bftNewArticles: Article[] = [
  {
    slug: "longest-chain",
    title: "Nakamoto: 누적 work와 재조직",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "한 분기의 전체 흐름" },
      { id: "chain-selection", title: "누적 work와 재조직" },
      { id: "finality", title: "확인 깊이와 따라잡기" },
      { id: "release", title: "공통 접두사와 실패" },
    ],
    component: () => import("@/pages/articles/blockchain/longest-chain"),
  },
  {
    slug: "avalanche-consensus",
    title: "Avalanche Snow: 표본 투표와 결정",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "한 poll부터 결정까지" },
      { id: "sampling-poll", title: "두 threshold" },
      { id: "confidence", title: "두 종류의 기억" },
      { id: "limits", title: "로컬 결정과 network 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/avalanche-consensus"),
  },
  {
    slug: "tusk",
    title: "Tusk (비동기 DAG 합의)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "두 wave의 전체 흐름" },
      { id: "wave-commit", title: "공통 동전과 f+1 지지" },
      { id: "causal-order", title: "이전 지도자와 인과 과거" },
      { id: "limits", title: "진행성 주장과 후속 반론" },
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
      { id: "consensus", title: "Cut 합의와 view change" },
      { id: "boundaries", title: "논문·코드·완료 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/autobahn-deep"),
  },
  {
    slug: "mysticeti",
    title: "Mysticeti 합의",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "거래 하나의 전체 흐름" },
      { id: "votes", title: "Support와 certificate pattern" },
      { id: "decisions", title: "Slot decision과 prefix" },
      { id: "boundaries", title: "Linearization과 완료 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/mysticeti"),
  },
  {
    slug: "gossipbft",
    title: "GossiPBFT 합의",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "한 chain의 전체 흐름" },
      { id: "quorum", title: "Weighted strong quorum" },
      { id: "phases", title: "Round와 phase" },
      { id: "recovery", title: "Bottom과 다음 round" },
      { id: "decision", title: "DECIDE와 완료 경계" },
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
