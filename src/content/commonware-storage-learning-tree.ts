export const COMMONWARE_STORAGE_NODE = {
  id: "blockchain/commonware-storage",
  shortTitle: "Commonware Storage",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain?sub=commonware",
  parentLabel: "Commonware 글 묶음",
  question:
    "Application이 만든 두 key update는 언제 candidate root를 넘어 crash 뒤에도 복구되고 proof로 다시 확인할 수 있는 상태가 됩니까?",
  region:
    "Commonware storage crate에서 QMDB batch가 operation log·activity bitmap·Merkle root·disk durability를 연결하는 부분",
  closure:
    "QMDB는 외부 Application이 만든 update를 branch-scoped batch에 stage하고 merkleize해 candidate root를 계산합니다. 현재 DB와 ancestry가 맞는 batch만 apply할 수 있으며, apply 뒤에도 commit 또는 sync를 거쳐야 durable state가 됩니다. Any proof는 어떤 value가 이력에 있었다는 사실을, Current proof는 그 operation의 activity bit까지 같은 canonical root 아래에서 검증합니다. MMR inclusion, QMDB 현재성, disk durability는 서로 다른 증거입니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/commonware-broadcast#overview",
    label: "Commonware buffered broadcast",
  },
  curriculumNext: {
    href: "/cs/blockchain/commonware-crypto-p2p#overview",
    label: "Commonware authenticated P2P",
  },
} as const;
