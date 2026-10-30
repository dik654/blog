export const RETH_MEV_NODE = {
  id: "blockchain/reth-mev",
  shortTitle: "Reth와 MEV",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/reth#overview",
  parentLabel: "Reth 전체 구조",
  question: "같은 slot에 local payload와 여러 external bid가 준비되면 누가 후보를 검증하고 언제 한 경로를 선택합니까?",
  region: "payload 준비 · proposer-builder 경계",
  closure: "Reth는 consensus client가 요청한 local execution payload를 준비합니다. External builder는 별도 서비스에서 payload와 bid를 만들고 relay가 이를 중개하며, proposer-side mev-boost와 consensus client가 요청 문맥·서명·deadline을 확인해 external header 또는 local payload 경로를 선택합니다. 높은 bid는 on-time body delivery를 보장하지 않으며, blinded block 서명 뒤 non-delivery는 local fallback 이전의 no-bid와 다른 실패입니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/reth-exex#overview",
    label: "Reth ExEx",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-ssz#overview",
    label: "Prysm SSZ",
  },
} as const;
