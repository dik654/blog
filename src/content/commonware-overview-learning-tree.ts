export const COMMONWARE_OVERVIEW_NODE = {
  id: "blockchain/commonware-deep-dive",
  shortTitle: "Commonware 전체 구조",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain?sub=commonware",
  parentLabel: "Commonware 글 묶음",
  question:
    "Commonware bridge 예제는 블록 원문을 어디에 보관하고, 어떤 확인을 받은 뒤 digest를 합의에 넘기며, finalization을 어디에 기록합니까?",
  region:
    "Runtime Context가 Application·Simplex·인증 P2P를 조립하고, Application이 외부 indexer와 주고받는 저장 확인을 합의의 propose·verify·report 경계에 연결하는 부분",
  closure:
    "Commonware v2026.9.0의 bridge 예제에서 Application은 블록을 encode하고 hash한 뒤 PutBlock을 보냅니다. Indexer가 Success(true)를 돌려줘야 digest가 Simplex proposal로 넘어갑니다. 다른 validator가 digest를 검증할 때는 GetBlock으로 원문을 다시 읽고, finalization이 생기면 PutFinalization으로 certificate를 기록합니다. Runtime·P2P·Simplex·Application·Indexer는 서로 다른 상태를 소유하며, bridge 예제는 ALPHA 예제이지 Application 상태 실행이나 운영 구성을 자동으로 완성하는 프레임워크가 아닙니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-engine-api#overview",
    label: "Prysm Engine API",
  },
  curriculumNext: {
    href: "/cs/blockchain/commonware-simplex#overview",
    label: "Commonware Simplex",
  },
} as const;
