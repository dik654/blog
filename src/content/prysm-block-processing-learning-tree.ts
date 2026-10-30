export const PRYSM_BLOCK_PROCESSING_NODE = {
  id: "blockchain/prysm-block-processing",
  shortTitle: "Prysm 블록 처리",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "Slot 352의 Fulu 블록은 어떻게 검증되어 optimistic 후보가 됩니까?",
  region: "수신 블록의 consensus·execution 검증 경계",
  closure:
    "Prysm은 parent state를 찾은 뒤 consensus state transition과 Engine API의 execution payload 판정을 동시에 진행합니다. Consensus 경로는 header·withdrawal·payload 문맥·RANDAO·Eth1 data·operations·sync aggregate를 규격 순서로 적용하고, 계산한 post-state root와 block의 commitment를 비교한 뒤 BLS signature batch를 확인합니다. Execution 경로가 SYNCING을 반환해도 consensus transition과 data availability가 통과하면 block은 execution-optimistic 후보로 fork-choice에 들어갈 수 있습니다. 이후 VALID이면 optimistic 표시를 해제하고, INVALID이면 해당 payload와 그 후손을 제거합니다. 이 단계는 후보를 등록할 뿐 최종 head를 결정하지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-epoch-processing#overview",
    label: "Prysm 에폭 처리",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-block-proposal#overview",
    label: "Prysm 블록 제안",
  },
} as const;
