export const RETH_EXEX_NODE = {
  id: "blockchain/reth-exex",
  shortTitle: "Reth ExEx",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/reth#overview",
  parentLabel: "Reth 전체 구조",
  question: "Reth가 103~105를 103′~105′로 바꿀 때 파생 DB는 무엇을 되돌리고 언제 FinishedHeight를 보내야 합니까?",
  region: "canonical 변화 · ExEx 파생 상태",
  closure: "ExEx manager는 canonical commit·reorg·revert를 WAL과 bounded buffer를 거쳐 각 extension에 전달합니다. 채널 전달은 파생 DB의 durable commit이 아닙니다. Extension이 old branch를 되돌리고 new branch와 자체 head를 확정한 뒤 FinishedHeight를 보내야 하며, Reth는 모든 extension의 가장 느린 canonical 위치와 finalized header 가운데 낮은 지점까지만 WAL을 정리합니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/reth-rpc#overview",
    label: "Reth RPC",
  },
  curriculumNext: {
    href: "/cs/blockchain/reth-mev#overview",
    label: "Reth MEV",
  },
} as const;
