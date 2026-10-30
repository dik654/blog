export const PRYSM_STATE_CACHE_NODE = {
  id: "blockchain/prysm-state-cache",
  shortTitle: "Prysm 상태 재구성",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question:
    "요청한 block root의 post-state가 cache와 DB에 없을 때 Prysm은 어디서 시작해 어떤 block을 replay하며, 반환 state는 누가 소유합니까?",
  region:
    "Block root로 post-state를 찾고, 직접 저장 state가 없으면 같은 branch의 ancestor state와 block으로 다시 만드는 state generation 경로",
  closure:
    "Prysm v7.3.1은 block root를 hot LRU, epoch-boundary FIFO, DB 순서로 조회합니다. 모두 miss면 StateSummary에서 목표 slot만 확인하고 parent root를 따라 가장 가까운 ancestor state를 따로 찾습니다. Ancestry query는 descendant에서 parent로 모은 block을 과거→현재 순서로 뒤집고, replay는 각 block slot까지 빈 slot transition을 실행한 뒤 stored block을 적용합니다. 일반 cache 조회는 state를 Copy하지만 NoCopy 경로는 read-only shared object를 반환합니다. Replay의 block transition은 이미 검증·저장된 block을 전제로 signature와 최종 state-root 비교를 반복하지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-beacon-db#overview",
    label: "Prysm BeaconDB",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-beacon-api#overview",
    label: "Prysm Beacon API",
  },
} as const;
