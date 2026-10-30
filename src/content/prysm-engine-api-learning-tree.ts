export const PRYSM_ENGINE_API_NODE = {
  id: "blockchain/prysm-engine-api",
  shortTitle: "Prysm Engine API",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question:
    "Prysm은 실행 payload 하나를 만들고 검증한 뒤, 어떤 응답을 근거로 optimistic 상태와 execution head를 바꿉니까?",
  region:
    "Consensus client가 선택한 parent·head와 execution client가 계산한 payload validity를 versioned JSON-RPC 호출로 맞추는 경계",
  closure:
    "Prysm v7.3.1은 proposal 준비 때 forkchoiceUpdated로 head·safe·finalized와 payload attributes를 보내 8-byte payloadId를 받고, getPayload로 build 결과를 회수합니다. 그 payload를 담은 block을 처리할 때는 newPayload 응답을 VALID·SYNCING·INVALID로 나눕니다. VALID는 optimistic 표시를 해제하고, SYNCING은 판정을 미루며, INVALID는 latestValidHash를 기준으로 invalid descendant를 제거합니다. 이후 forkchoiceUpdated가 선택된 head·safe·finalized를 execution client에 다시 반영합니다. JSON-RPC 전송 성공, payload VALID, canonical head와 finality는 서로 다른 상태입니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-beacon-api#overview",
    label: "Prysm Beacon API",
  },
  curriculumNext: {
    href: "/cs/blockchain/commonware-deep-dive#overview",
    label: "Commonware 전체 구조",
  },
} as const;
