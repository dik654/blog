export const PRYSM_BLS_NODE = {
  id: "blockchain/prysm-bls",
  shortTitle: "Prysm BLS",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "SSZ object root는 어떻게 특정 validator의 서명으로 검증되고 여러 서명과 함께 처리됩니까?",
  region: "signing root · BLS signature · aggregate와 batch",
  closure:
    "Prysm은 SSZ object root와 consensus domain을 다시 SSZ로 묶어 32-byte signing root를 만듭니다. BLST 경계에서 48-byte public key와 96-byte signature를 point로 검증한 뒤 pairing 관계를 확인합니다. 같은 signing root의 여러 서명은 하나의 aggregate signature로 표현할 수 있지만, 서로 다른 signing root의 여러 독립 서명을 함께 검사하는 batch verification은 별도 계산이며 실패하면 개별 판정이 필요합니다. 서명이 맞아도 object의 상태 전이·fork choice·slashing 안전성까지 증명하지는 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-ssz#overview",
    label: "Prysm SSZ",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-beacon-state#overview",
    label: "Prysm BeaconState",
  },
} as const;
