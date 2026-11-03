import type { Article } from "../types";

export const bftNewArticles: Article[] = [
  {
    slug: "longest-chain",
    title: "더 무거운 분기는 장부를 어떻게 바꿀까?",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "한 분기의 전체 흐름" },
      { id: "chain-selection", title: "후보 선택과 장부 교체" },
      { id: "finality", title: "확인 깊이와 남은 위험" },
      { id: "release", title: "공통 접두사의 전제" },
    ],
    component: () => import("@/pages/articles/blockchain/longest-chain"),
  },
  {
    slug: "avalanche-consensus",
    title: "Avalanche는 작은 표본을 어떻게 한 노드의 결정으로 쌓을까요?",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "한 poll부터 결정까지" },
      { id: "sampling-poll", title: "두 기준이 필요한 이유" },
      { id: "confidence", title: "연속 기억과 누적 기억" },
      { id: "limits", title: "로컬 결정과 네트워크 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/avalanche-consensus"),
  },
  {
    slug: "tusk",
    title: "Tusk는 건너뛴 지도자를 어떻게 되찾을까?",
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
    title: "Autobahn은 멈춘 동안 쌓인 거래를 어떻게 따라잡을까요?",
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
    title: "Mysticeti는 별도 인증서 없이 어떻게 블록을 확정할까?",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "별도 인증서를 없앤 자리" },
      { id: "uncertified-votes", title: "두 개의 정족수" },
      { id: "decision-linearize", title: "미결정 장벽과 순서" },
      { id: "release", title: "합의·실행·최종성 경계" },
    ],
    component: () => import("@/pages/articles/blockchain/mysticeti"),
  },
  {
    slug: "gossipbft",
    title: "GossiPBFT는 메시지 수신을 어떻게 결정으로 바꿀까?",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "전송에서 인증서까지" },
      { id: "quorum-phase", title: "정족수와 단계의 이유" },
      { id: "recovery", title: "막힌 round의 복구" },
      { id: "release", title: "안전성과 진행성 검사" },
    ],
    component: () => import("@/pages/articles/blockchain/gossipbft"),
  },
  {
    slug: "consensus-comparison",
    title: "합의 계열은 무엇부터 비교해야 할까?",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "같은 요청의 네 경로" },
      { id: "evidence", title: "영향력과 증거" },
      { id: "security", title: "분리와 복구" },
      { id: "performance", title: "대기 시간" },
      { id: "use-cases", title: "선택 순서" },
    ],
    component: () => import("@/pages/articles/blockchain/consensus-comparison"),
  },
];
