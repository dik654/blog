export const PRYSM_SSZ_NODE = {
  id: "blockchain/prysm-ssz",
  shortTitle: "Prysm SSZ",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "하나의 typed value가 어떻게 전송 바이트, state root와 field proof로 이어집니까?",
  region: "consensus object · byte identity · Merkle commitment",
  closure:
    "Prysm은 fork별 SSZ schema를 기준으로 consensus object를 canonical bytes로 읽고 씁니다. 같은 typed value는 별도의 hash-tree-root 규칙으로 32-byte commitment가 되며, generalized index와 sibling hash는 특정 field가 그 root에 포함됐는지 검증하게 합니다. Decode나 proof 성공은 signature·state transition·canonical chain까지 증명하지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/reth-mev#overview",
    label: "Reth와 MEV",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-bls#overview",
    label: "Prysm BLS",
  },
} as const;
