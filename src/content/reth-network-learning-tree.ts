export type RethNetworkTrack = "concept" | "practice" | "reference";

export type RethNetworkNodeId = "reth-net" | "reth-net-validation";

export interface RethNetworkNode {
  id: RethNetworkNodeId;
  shortTitle: string;
  question: string;
  track: RethNetworkTrack;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RETH_NETWORK_NODES: readonly RethNetworkNode[] = [
  {
    id: "reth-net",
    shortTitle: "피어 세션",
    question:
      "Reth는 발견한 주소를 어떤 검사 뒤에 거래와 블록을 주고받는 피어로 바꿉니까?",
    track: "concept",
    href: "/cs/blockchain/reth-net#overview",
    parentLabel: "이더리움 노드 · 실행 P2P",
    parentHref: "/cs/blockchain/node-architecture#deeper",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-payload-builder-validation#return-map",
      label: "Payload Builder 변경 검증",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-net-validation#overview",
      label: "피어 세션 변경 검증",
    },
  },
  {
    id: "reth-net-validation",
    shortTitle: "변경 검증",
    question:
      "Reth 네트워크 구현이나 설정을 바꿀 때 세션 회귀와 복구 실패를 어떻게 찾습니까?",
    track: "practice",
    href: "/cs/blockchain/reth-net-validation#overview",
    parentLabel: "Reth 피어 세션 · 연결 계약",
    parentHref: "/cs/blockchain/reth-net#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-net#return-map",
      label: "Reth 피어 세션",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-sync#overview",
      label: "Reth 동기화",
    },
    anchors: [
      {
        href: "/cs/blockchain/reth-net#discovery",
        label: "후보 주소와 연결 권한 분리",
      },
      {
        href: "/cs/blockchain/reth-net#identity",
        label: "ECIES identity와 Hello ID 결속",
      },
      {
        href: "/cs/blockchain/reth-net#capability",
        label: "공통 capability 선택",
      },
      {
        href: "/cs/blockchain/reth-net#status",
        label: "ETH Status 호환성 검사",
      },
      {
        href: "/cs/blockchain/reth-net#data-path",
        label: "활성 세션과 자료 교환",
      },
      {
        href: "/cs/blockchain/reth-net#failure-boundaries",
        label: "실패와 slot 정리",
      },
    ],
  },
] as const;

export function getRethNetworkNode(id: RethNetworkNodeId) {
  const node = RETH_NETWORK_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Reth 네트워크 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getRethNetworkTrackNodes(track: RethNetworkTrack) {
  return RETH_NETWORK_NODES.filter((node) => node.track === track);
}
