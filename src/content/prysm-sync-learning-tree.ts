export const PRYSM_SYNC_NODE = {
  id: "blockchain/prysm-sync",
  shortTitle: "Prysm 동기화",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question:
    "로컬 head가 slot 100인데 network는 slot 140까지 전진했을 때, 뒤쪽 range가 먼저 도착해도 Prysm은 왜 앞 구간부터 처리하고 initial sync가 끝날 때까지 gossip block을 무시합니까?",
  region:
    "신뢰 anchor에서 finalized 구간과 live head를 차례로 따라잡는 Sync 경로",
  closure:
    "Prysm v7.3.1은 checkpoint state와 block의 내부 짝을 확인해 origin을 만들고, peer 다수가 알리는 finalized 지점까지 먼저 동기화한 뒤 non-finalized head를 따라갑니다. Blocks queue는 여러 range를 미리 요청해도 더 이른 state machine이 처리 가능한 상태가 될 때까지 뒤 range를 내보내지 않습니다. 실제 block 검증·저장과 head 변경은 queue가 아니라 blockchain receiver가 소유합니다. Head가 current slot에 도달해 initial sync가 완료되기 전에는 live block validator가 gossip block을 Ignore하므로 range 처리와 live 처리가 동시에 정본을 바꾸지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-finality#overview",
    label: "Prysm 최종성",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-beacon-db#overview",
    label: "Prysm BeaconDB",
  },
} as const;
