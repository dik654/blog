export const PRYSM_BEACON_API_NODE = {
  id: "blockchain/prysm-beacon-api",
  shortTitle: "Prysm Beacon API",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question:
    "GET /eth/v1/beacon/states/head/root 요청은 어느 라우트와 조회 함수를 지나며, 응답의 state root·execution_optimistic·finalized는 같은 대상을 말합니까?",
  region:
    "외부 HTTP 요청을 Beacon API handler로 연결하고 symbolic state ID를 root·state·block metadata로 해석해 JSON 응답을 만드는 조회 경로",
  closure:
    "Prysm v7.3.1은 Beacon REST 라우트를 Go ServeMux에 직접 등록하고 gRPC service는 별도로 등록합니다. GET /eth/v1/beacon/states/head/root는 state root를 HeadBlock에서, BeaconState를 HeadState에서 각각 조회합니다. execution_optimistic은 state ID를 기준으로 다시 확인하고, finalized는 조회한 state의 latest block header로 block root를 계산한 뒤 판정합니다. 따라서 data.root는 BeaconState의 HashTreeRoot이고 finalized는 그 state를 만든 block의 finality입니다. symbolic head를 여러 번 해석하는 현재 호출 구조는 reorg 시점의 일관성을 별도 테스트해야 하는 경계이며, 이 글에서는 실제 장애가 재현됐다고 주장하지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-state-cache#overview",
    label: "Prysm 상태 재구성",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-engine-api#overview",
    label: "Prysm Engine API",
  },
} as const;
