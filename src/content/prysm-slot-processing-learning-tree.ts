export const PRYSM_SLOT_PROCESSING_NODE = {
  id: "blockchain/prysm-slot-processing",
  shortTitle: "Prysm 슬롯 처리",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "Slot 30의 state는 block이 없는 slot 31·32를 지나 어떻게 block 33 직전 state가 됩니까?",
  region: "per-slot transition · historical roots · epoch boundary · fork upgrade · skip-slot cache",
  closure:
    "Prysm은 target block의 slot으로 곧바로 숫자만 바꾸지 않습니다. 현재 slot마다 state root와 latest block root를 같은 historical index에 기록하고, zero인 latest header state root를 한 번 backfill합니다. 다음 slot이 epoch 시작이면 slot을 올리기 전에 fork별 epoch transition을 실행합니다. Slot 증가 뒤에는 그 slot에서 활성화되는 fork schema를 적용합니다. SkipSlotCache는 이 순서를 건너뛰는 장부가 아니라 같은 입력에서 이미 계산한 중간 state를 복사해 재사용하는 프로세스 내 최적화이며, 재시작 뒤 남는 durable state가 아닙니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-beacon-state#overview",
    label: "Prysm BeaconState",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-epoch-processing#overview",
    label: "Prysm 에폭 처리",
  },
} as const;
