export const RETH_RPC_NODE = {
  id: "blockchain/reth-rpc",
  shortTitle: "Reth RPC",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/reth#overview",
  parentLabel: "Reth 전체 구조",
  question: "같은 JSON-RPC 형식인데도 지갑 요청과 합의 클라이언트 요청을 왜 서로 다른 입구로 받아야 합니까?",
  region: "외부 요청 경계 · JSON-RPC와 Engine API",
  closure: "Reth는 공개 조회용 transport module과 JWT 인증 Engine module을 별도로 구성합니다. 두 경로는 JSON-RPC 봉투만 공유하며 호출자, 허용 메서드, 상태를 읽거나 바꾸는 권한, 실패 응답이 다릅니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/reth-sync#overview",
    label: "Reth 동기화",
  },
  curriculumNext: {
    href: "/cs/blockchain/reth-exex#overview",
    label: "Reth ExEx",
  },
} as const;
