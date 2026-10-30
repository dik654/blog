export const PRYSM_BEACON_STATE_NODE = {
  id: "blockchain/prysm-beacon-state",
  shortTitle: "Prysm BeaconState",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "복사한 BeaconState의 balance 하나를 바꾸면 왜 원본은 그대로이고 새 state root만 바뀝니까?",
  region: "state view · multi-value field · dirty path · state root · fork schema",
  closure:
    "Prysm은 같은 protocol BeaconState에서 갈라진 후보를 state ID별 view로 관리합니다. Copy는 큰 collection과 FieldTrie를 곧바로 전부 복제하지 않고 공유 가능한 구조로 등록합니다. 한 view에서 balance index 5를 바꾸면 그 state ID의 값만 분리하고 Balances field와 element index 5를 dirty로 남깁니다. FieldTrie는 uint64 네 개가 한 SSZ chunk에 들어간다는 규칙으로 index 5를 chunk 1로 바꿔 해당 path와 top-level state path를 다시 계산합니다. 원본 view의 값과 root는 그대로이고 복사본의 root만 바뀌어야 합니다. Fork가 바뀌면 같은 cache를 재사용하는 것이 아니라 새 schema와 upgrade 함수가 field의 보존·초깃값·파생값을 정합니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-bls#overview",
    label: "Prysm BLS",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-slot-processing#overview",
    label: "Prysm 슬롯 처리",
  },
} as const;
