export const COMMONWARE_P2P_NODE = {
  id: "blockchain/commonware-crypto-p2p",
  shortTitle: "Commonware P2P",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain?sub=commonware",
  parentLabel: "Commonware 글 묶음",
  question:
    "Alice가 보낸 bytes를 Bob의 Application이 받기까지 어떤 접수·인증·전달 상태가 서로 따로 바뀝니까?",
  region:
    "Commonware의 encrypted stream, authenticated router, peer actor와 channel mailbox가 이어지는 전송 경계",
  closure:
    "Alice의 Sender가 돌려주는 결과는 local rate check와 router mailbox 접수 범위입니다. Bob이 bytes를 얻으려면 두 identity의 handshake가 끝나고, 연결별 relay·encrypted stream·channel 검증·per-peer rate limit·bounded inbound mailbox를 더 통과해야 합니다. Bob의 Receiver가 (Alice public key, bytes)를 반환해야 node-local application receipt가 생기며, durable commit·업무 승인·Alice로 돌아가는 remote acknowledgement는 P2P crate가 만들지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/commonware-storage#overview",
    label: "Commonware Storage",
  },
  curriculumNext: {
    href: "/cs/blockchain?sub=commonware",
    label: "Commonware 전체 지도",
  },
} as const;
