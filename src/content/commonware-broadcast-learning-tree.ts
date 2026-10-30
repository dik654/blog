export const COMMONWARE_BROADCAST_NODE = {
  id: "blockchain/commonware-broadcast",
  shortTitle: "Commonware Broadcast",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain?sub=commonware",
  parentLabel: "Commonware 글 묶음",
  question:
    "Alice의 로컬 broadcast 요청이 접수된 뒤 Bob이 같은 digest의 typed item을 얻기까지 어떤 상태가 따로 바뀝니까?",
  region:
    "Commonware broadcast crate에서 로컬 mailbox, network receive, digest waiter, bounded cache가 이어지는 부분",
  closure:
    "Broadcaster의 Feedback은 Alice 노드의 mailbox가 요청을 받아들였는지만 알려 줍니다. Engine이 전송을 시도하고 Bob의 Engine이 bytes를 decode한 뒤, 같은 digest를 기다리던 subscriber가 typed item을 받아야 노드 로컬 수신 증거가 생깁니다. 그 항목이 캐시에 남는지는 최신 primary 집합과 peer별 bounded deque가 별도로 결정합니다. Broadcast는 total order, durable storage, application acceptance를 대신하지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/commonware-simplex#overview",
    label: "Commonware Simplex",
  },
  curriculumNext: {
    href: "/cs/blockchain/commonware-storage#overview",
    label: "Commonware Storage",
  },
} as const;
