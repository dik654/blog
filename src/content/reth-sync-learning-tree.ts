export type RethSyncTrack = "concept" | "practice" | "reference";

export const RETH_SYNC_NODE = {
  id: "reth-sync",
  track: "concept" as RethSyncTrack,
  shortTitle: "Reth 동기화",
  question: "CL이 가리킨 head의 부모 자료가 없을 때, 누가 자료를 채우고 언제 live 실행으로 돌아갑니까?",
  href: "/cs/blockchain/reth-sync#overview",
  parentHref: "/cs/blockchain/node-architecture#deeper",
  parentLabel: "이더리움 노드 전체 지도",
  curriculumPrevious: {
    href: "/cs/blockchain/reth-net-validation#overview",
    label: "Reth P2P 검증",
  },
  curriculumNext: {
    href: "/cs/blockchain/reth-rpc#overview",
    label: "Reth RPC: 한 노드의 두 입구",
  },
  closure:
    "실행 클라이언트는 모르는 head를 곧바로 실행하지 않습니다. 가까운 누락은 downloader와 engine tree가 채우고, 큰 구간은 backfill pipeline이 단독 writer로 처리합니다. 검증된 저장 상태가 이어진 뒤에만 engine tree가 다시 live head를 맡습니다.",
} as const;
