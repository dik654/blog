import type { Article } from "../types";

export const commonwareArticles: Article[] = [
  {
    slug: "commonware-deep-dive",
    title: "Commonware 개요: 조합형 분산 시스템 프리미티브",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "프리미티브를 조립하는 이유" },
      { id: "composition", title: "Runtime·P2P·합의·저장 경계" },
      { id: "bridge-boundary", title: "Bridge에서 application receipt까지" },
      { id: "release", title: "결정론적 재현과 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/commonware-deep-dive"),
  },
  {
    slug: "commonware-simplex",
    title: "Commonware Simplex: 인증·certification·finalization",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "한 view의 전체 흐름" },
      { id: "certificate-path", title: "Notarize·nullify·finalize" },
      { id: "component-boundary", title: "Batcher·Voter·Resolver·Application" },
      { id: "release", title: "Recovery·replay·release gate" },
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
    title: "Commonware Storage: MMR·Any·Current·QMDB",
    subcategory: "commonware",
    sections: [
      { id: "overview", title: "Operation log에서 authenticated root까지" },
      { id: "proof-layout", title: "MMR peak와 inclusion proof" },
      { id: "database-paths", title: "Any·Current와 QMDB batch" },
      { id: "release", title: "Commit·prune·crash recovery" },
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
