export const PRYSM_BEACON_DB_NODE = {
  id: "blockchain/prysm-beacon-db",
  shortTitle: "Prysm BeaconDB",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question:
    "같은 slot 64에 경쟁하는 block 두 개가 들어왔을 때 Prysm은 어떻게 두 root를 모두 찾게 저장하며, block·index·state·checkpoint 중 어디까지가 한 번에 commit됩니까?",
  region:
    "검증한 consensus object를 root로 저장하고 slot·parent 조회와 finality 보존 경계를 유지하는 BeaconDB 경로",
  closure:
    "Prysm v7.3.1은 block bytes와 slot·parent index를 SaveROBlocks의 한 bbolt write transaction에서 갱신합니다. 같은 slot의 경쟁 block은 서로 다른 root 원본으로 저장되고 slot index가 두 root를 열거합니다. State와 finalized checkpoint는 각각 별도 함수와 별도 transaction이므로, BeaconDB 전체가 하나의 전역 commit으로 움직인다고 볼 수 없습니다. Historical pruning은 선택한 slot/root 묶음의 block·state·관련 index를 한 transaction에서 지우지만 Gloas execution payload envelope에는 별도 pruning 경로가 필요하다는 TODO가 남아 있습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-sync#overview",
    label: "Prysm 동기화",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-state-cache#overview",
    label: "Prysm 상태 캐시",
  },
} as const;
