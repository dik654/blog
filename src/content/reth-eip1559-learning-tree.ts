export type RethEip1559Track = "concept" | "practice" | "reference";

export type RethEip1559NodeId =
  | "reth-eip1559"
  | "reth-eip1559-validation";

export interface RethEip1559Node {
  id: RethEip1559NodeId;
  shortTitle: string;
  mapLabel: string;
  question: string;
  track: RethEip1559Track;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RETH_EIP1559_NODES: readonly RethEip1559Node[] = [
  {
    id: "reth-eip1559",
    shortTitle: "가격과 정산",
    mapLabel: "Parent 사용량에서 다음 base fee와 실제 지불액까지",
    question:
      "지난 블록의 사용량은 어떻게 다음 블록의 가격이 되고, 한 거래의 수수료는 어디로 나뉩니까?",
    track: "concept",
    href: "/cs/blockchain/reth-eip1559#overview",
    parentLabel: "Reth 전체 구조 · 검증과 실행",
    parentHref: "/cs/blockchain/reth#overview",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-txpool-validation#return-map",
      label: "TxPool 변경 검증",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-eip1559-validation#overview",
      label: "EIP-1559 변경 검증",
    },
  },
  {
    id: "reth-eip1559-validation",
    shortTitle: "변경 검증",
    mapLabel: "Fork·정수 경계·세 실행 경로를 같은 fixture로 대조",
    question:
      "Reth나 ChainSpec을 바꿀 때 1 wei의 차이와 서로 다른 실행 경로의 불일치를 어떻게 배포 전에 찾습니까?",
    track: "practice",
    href: "/cs/blockchain/reth-eip1559-validation#overview",
    parentLabel: "Reth EIP-1559 가격과 정산",
    parentHref: "/cs/blockchain/reth-eip1559#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-eip1559#return-map",
      label: "EIP-1559 가격과 정산",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-eip4844#overview",
      label: "EIP-4844 Blob 수수료",
    },
    anchors: [
      {
        href: "/cs/blockchain/reth-eip1559#base-fee",
        label: "Parent header에서 next base fee 계산",
      },
      {
        href: "/cs/blockchain/reth-eip1559#transaction-fee",
        label: "Fee cap·effective tip·burn 정산",
      },
      {
        href: "/cs/blockchain/reth-eip1559#implementation",
        label: "ChainSpec→Alloy→검증 경계",
      },
    ],
  },
] as const;

export function getRethEip1559Node(id: RethEip1559NodeId) {
  return RETH_EIP1559_NODES.find((node) => node.id === id)!;
}

export function getRethEip1559TrackNodes(track: RethEip1559Track) {
  return RETH_EIP1559_NODES.filter((node) => node.track === track);
}
