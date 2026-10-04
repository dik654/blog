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
  {
    "id": "overview",
    "title": "1. 누가 보냈는지 알아도 어느 송금이 먼저인지는 남습니다"
  },
  {
    "id": "black-box",
    "title": "2. 참여 비용, 내용 검사, 기록 선택을 차례로 봅니다"
  },
  {
    "id": "case",
    "title": "3. 네 참여자의 자원을 합하면 100입니다"
  },
  {
    "id": "parts",
    "title": "4. 후보를 만드는 사람과 그 후보를 확인하는 사람이 있습니다"
  },
  {
    "id": "why-parts",
    "title": "5. 이름 수로 투표하면 같은 사람이 표를 계속 늘립니다"
  },
  {
    "id": "names",
    "title": "6. PoW와 PoS는 영향력의 근거를 달리 정합니다"
  },
  {
    "id": "trace",
    "title": "7. 같은 X를 만들고 검사한 뒤 선택 근거를 모읍니다"
  },
  {
    "id": "pow",
    "title": "8. A의 이름이 100개여도 계산 몫 10%는 그대로입니다"
  },
  {
    "id": "pos",
    "title": "9. 지분 40은 매번 당첨된다는 뜻이 아닙니다"
  },
  {
    "id": "comparison",
    "title": "10. 자원 비용만으로 안전성과 속도를 함께 결론내릴 수 없습니다"
  }
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
  {
    "id": "overview",
    "title": "1. 잘 도착한 편지도 몰래 읽혔을 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2. 내용을 준비하고, 가리고, 확인한 뒤 실행합니다"
  },
  {
    "id": "worked-case",
    "title": "3. 7번 지시로 30원을 보냅니다"
  },
  {
    "id": "parts",
    "title": "4. 같은 편지 안에서도 숨길 부분과 드러낼 부분이 다릅니다"
  },
  {
    "id": "why-parts",
    "title": "5. 내용을 가리는 계산만으로는 부족합니다"
  },
  {
    "id": "names",
    "title": "6. 정상 동작과 공격 저항에는 서로 다른 이름이 붙습니다"
  },
  {
    "id": "request-trace",
    "title": "7. 7번 지시를 복원한 다음에도 처리 이력을 봅니다"
  },
  {
    "id": "source-interface",
    "title": "8. 표준은 평문 또는 실패를 반환하도록 정합니다"
  },
  {
    "id": "security-game",
    "title": "9. 한 번 맞힌 결과와 보안 주장은 다릅니다"
  },
  {
    "id": "assumption-composition",
    "title": "10. 계산의 가정과 실제 사용 조건을 함께 지켜야 합니다"
  },
  {
    "id": "crypto-release",
    "title": "11. 7번이 다시 도착해도 잔액은 70원이어야 합니다"
  }
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
  {
    "id": "overview",
    "title": "1. 같은 사람이 양쪽에 다른 답을 보내도 기록은 하나여야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 제안을 받고, 서명을 확인하고, 충분한 동의를 모읍니다"
  },
  {
    "id": "case",
    "title": "3. 네 명 중 한 명은 두 후보에 모두 동의할 수 있습니다"
  },
  {
    "id": "parts",
    "title": "4. 서명에는 사람뿐 아니라 주문과 단계가 함께 들어갑니다"
  },
  {
    "id": "why-parts",
    "title": "5. 기다리는 시간이 끝났다는 사실은 새 결정을 허용하는 증거가 아닙니다"
  },
  {
    "id": "names",
    "title": "6. 비잔틴 장애 허용은 임의 행동의 범위를 먼저 정합니다"
  },
  {
    "id": "byzantine-model",
    "title": "7. 주문 7의 표를 발신자와 대상에 맞춰 셉니다"
  },
  {
    "id": "faulty-threshold",
    "title": "8. 두 묶음의 겹침에 정직한 사람이 남아야 합니다"
  },
  {
    "id": "timing-source",
    "title": "9. 통신이 늦어져도 안전성 조건은 지워지지 않습니다"
  },
  {
    "id": "safety-liveness",
    "title": "10. 대표를 바꿀 때도 이전 결정 근거를 이어받습니다"
  }
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
