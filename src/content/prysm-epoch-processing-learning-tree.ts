export const PRYSM_EPOCH_PROCESSING_NODE = {
  id: "blockchain/prysm-epoch-processing",
  shortTitle: "Prysm 에폭 처리",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "Slot 351의 누적 상태는 어떻게 다음 Epoch 상태가 됩니까?",
  region: "Fulu epoch state transition",
  closure:
    "Prysm은 epoch 경계에서 state version으로 fork별 ProcessEpoch를 고른 뒤, 같은 BeaconState를 규격 순서대로 바꿉니다. 참여 기록을 먼저 집계해 justification·finalization과 보상·패널티에 재사용하고, 그 뒤 registry·slashing·pending queue·effective balance를 처리합니다. 마지막에 participation과 committee·proposer lookahead를 다음 epoch용으로 회전합니다. 이 순서를 바꾸면 뒤 단계가 읽는 state가 달라지므로 post-state root도 달라집니다. 중간 단계에서 오류가 나면 함수가 앞선 mutation을 되돌려 주지는 않으므로, 호출자는 그 working state를 완성된 epoch 결과로 공개하면 안 됩니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-slot-processing#overview",
    label: "Prysm 슬롯 처리",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-block-processing#overview",
    label: "Prysm 블록 처리",
  },
} as const;
