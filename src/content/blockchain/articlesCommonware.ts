import type { Article } from "../types";

export const commonwareArticles: Article[] = [
  {
    slug: "commonware-deep-dive",
    title: "Commonware 개요: Anti-Framework 블록체인 프리미티브",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "Anti-Framework 철학 & 아키텍처" },
      { id: "runtime-foundation", title: "Runtime: 모든 모듈의 기반" },
      { id: "bridge-assembly", title: "Bridge 예제: 프리미티브 조립" },
      { id: "simplex", title: "Simplex Consensus" },
      { id: "broadcast", title: "브로드캐스트 & DSMR" },
      { id: "storage", title: "저장 프리미티브 (MMR · ADB · QMDB)" },
      { id: "crypto-p2p", title: "암호화 & P2P 네트워킹" },
      { id: "runtime-alto", title: "결정론적 시뮬레이션 & 채택 현황" },
    ],
    component: () => import("@/pages/articles/blockchain/commonware-deep-dive"),
  },
  {
    slug: "commonware-simplex",
    title: "Simplex Consensus 코드 분석",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "Simplex 프로토콜 & BFT 진화" },
      {
        id: "core-traits",
        title: "Core Traits: Automaton · Relay · Committer",
      },
      { id: "engine", title: "Engine 실행 루프" },
      { id: "voting", title: "Propose → Vote → Finalize 흐름" },
      { id: "lazy-verify", title: "Lazy Verification & 서명 배치" },
      { id: "threshold", title: "threshold_simplex: VRF + BLS" },
    ],
    component: () => import("@/pages/articles/blockchain/commonware-simplex"),
  },
  {
    slug: "commonware-broadcast",
    title: "Commonware buffered broadcast: digest·cache·delivery receipt",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "local acceptance와 remote receipt" },
      { id: "broadcast-subscribe", title: "broadcast·subscribe·digest" },
      { id: "cache-eligibility", title: "peer deque·refcount·primary eligibility" },
      { id: "release", title: "실패·eviction·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/commonware-broadcast"),
  },
  {
    slug: "commonware-storage",
    title: "MMR · ADB · QMDB 코드 분석",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "저장소 설계 철학 & Persistable" },
      { id: "mmr", title: "Merkle Mountain Range 구조 & 증명" },
      { id: "adb-any", title: "adb::any — 이력 값 증명" },
      { id: "adb-current", title: "adb::current — 현재 값 증명 & Grafting" },
      { id: "qmdb", title: "QMDB: O(1) SSD 인증 데이터베이스" },
    ],
    component: () => import("@/pages/articles/blockchain/commonware-storage"),
  },
  {
    slug: "commonware-crypto-p2p",
    title: "Commonware authenticated P2P: handshake·channel·quota",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "known peer에서 authenticated channel까지" },
      { id: "handshake", title: "Syn·SynAck·Ack와 timestamp gate" },
      { id: "channel-quota", title: "channel routing·quota·priority mailbox" },
      { id: "release", title: "failure·retry·release gate" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/commonware-crypto-p2p"),
  },
];
