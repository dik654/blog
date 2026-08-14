import type { Article } from "../types";

export const fundamentalsArticles: Article[] = [
  {
    slug: "distributed-systems",
    title: "분산 시스템 이론",
    subcategory: "fundamentals",
    sections: [
      { id: "overview", title: "분산 시스템 모델" },
      { id: "flp", title: "FLP 불가능성 정리" },
      { id: "cap", title: "CAP 정리 & PACELC" },
      { id: "bft-theory", title: "Byzantine 장군 문제" },
      { id: "consensus-class", title: "합의 알고리즘 분류" },
    ],
    component: () => import("@/pages/articles/blockchain/distributed-systems"),
  },
  {
    slug: "consensus-mechanisms",
    title: "합의 알고리즘 비교",
    subcategory: "fundamentals",
    sections: [
      { id: "overview", title: "개요" },
      { id: "pow", title: "Proof of Work" },
      { id: "pos", title: "Proof of Stake" },
      { id: "comparison", title: "비교 분석" },
    ],
    component: () => import("@/pages/articles/blockchain/consensus-mechanisms"),
  },
  {
    slug: "smr-theory",
    title: "상태 머신 복제 (SMR) 이론",
    subcategory: "fundamentals",
    sections: [
      { id: "overview", title: "상태 머신 복제" },
      { id: "total-order", title: "전체 순서 브로드캐스트" },
      { id: "log-replication", title: "로그 복제: Raft 기초" },
      { id: "paxos", title: "Paxos 프로토콜" },
    ],
    component: () => import("@/pages/articles/blockchain/smr-theory"),
  },
  {
    slug: "crypto-theory",
    title: "암호학 프리미티브 이론",
    subcategory: "fundamentals",
    sections: [
      { id: "overview", title: "Primitive claim 읽기" },
      { id: "security-game", title: "Security game·advantage" },
      { id: "assumption-composition", title: "Assumption·composition" },
      { id: "crypto-release", title: "Implementation·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/crypto-theory"),
  },
];

export const bftArticles: Article[] = [
  /* ── 1. 이론 기초 ── */
  {
    slug: "bft-theory",
    title: "비잔틴 장애 모델 & 안전성 증명",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "비잔틴 장군 문제" },
      { id: "byzantine-model", title: "비잔틴 장애 모델" },
      { id: "safety-liveness", title: "안전성 vs 활성" },
      { id: "faulty-threshold", title: "f < n/3 한계" },
    ],
    component: () => import("@/pages/articles/blockchain/bft-theory"),
  },
  {
    slug: "pbft-deep",
    title: "PBFT 3단계 심층 (Pre-prepare/Prepare/Commit)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "PBFT 개요" },
      { id: "normal-case", title: "Normal case와 두 predicate" },
      { id: "view-recovery", title: "View change와 checkpoint" },
      { id: "release", title: "Client reply와 복구" },
    ],
    component: () => import("@/pages/articles/blockchain/pbft-deep"),
  },
  {
    slug: "tendermint-bft",
    title: "Tendermint BFT 프로토콜",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "Tendermint BFT 개요" },
      { id: "protocol", title: "프로토콜 흐름" },
      { id: "locking", title: "Polka 잠금 메커니즘" },
      { id: "comparison", title: "PBFT와 비교" },
    ],
    component: () => import("@/pages/articles/blockchain/tendermint-bft"),
  },
  {
    slug: "hotstuff-deep",
    title: "HotStuff 체인 투표 & 선형 통신",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "HotStuff 개요" },
      { id: "qc-chain", title: "Safe vote와 QC chain" },
      { id: "pacemaker", title: "Pacemaker와 응답성" },
      { id: "release", title: "Persistence와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/hotstuff-deep"),
  },
  {
    slug: "hotstuff2",
    title: "HotStuff-2 (2단계 축소)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "HotStuff-2 개요" },
      { id: "two-phase", title: "2단계 프로토콜" },
      { id: "view-sync", title: "View entry와 lock status" },
      { id: "release", title: "비용과 release" },
    ],
    component: () => import("@/pages/articles/blockchain/hotstuff2"),
  },
  {
    slug: "jolteon-ditto",
    title: "Jolteon & Ditto (Aptos DiemBFT 기반)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "두 실행 경로" },
      { id: "jolteon-path", title: "Jolteon sync path" },
      { id: "ditto-fallback", title: "Ditto fallback" },
      { id: "release", title: "Certification과 rejoin" },
    ],
    component: () => import("@/pages/articles/blockchain/jolteon-ditto"),
  },
  /* ── 리더 기반 BFT 비교 ── */
  {
    slug: "bft-comparison",
    title: "BFT 합의 비교 (PBFT → HotStuff → Autobahn)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "BFT 프로토콜 진화" },
      { id: "pbft", title: "PBFT" },
      { id: "hotstuff", title: "HotStuff" },
      { id: "autobahn", title: "Autobahn" },
      { id: "comparison", title: "종합 비교" },
    ],
    component: () => import("@/pages/articles/blockchain/bft-comparison"),
  },
  /* ── DAG 기반 합의 ── */
  {
    slug: "dag-consensus",
    title: "DAG 기반 합의 (Narwhal & Bullshark)",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "개요" },
      { id: "narwhal", title: "Narwhal: DAG 기반 멤풀" },
      { id: "bullshark", title: "Bullshark: DAG 순서 결정" },
    ],
    component: () => import("@/pages/articles/blockchain/dag-consensus"),
  },
  {
    slug: "narwhal-deep",
    title: "Narwhal DAG 멤풀 심층",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "Bytes와 ordering metadata" },
      { id: "worker-header", title: "Worker와 primary" },
      { id: "certificate-dag", title: "Certificate DAG" },
      { id: "release", title: "복구와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/narwhal-deep"),
  },
  {
    slug: "bullshark-deep",
    title: "Bullshark 순서화 심층",
    subcategory: "bft-consensus",
    sections: [
      { id: "overview", title: "DAG ordering 경계" },
      { id: "wave-anchor", title: "Wave와 leader support" },
      { id: "ordering", title: "Deterministic sub-DAG" },
      { id: "release", title: "Variant와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/bullshark-deep"),
  },
];
