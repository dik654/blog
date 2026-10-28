export type DataAvailabilityTrack = "concept" | "practice" | "reference";

export type DataAvailabilityNodeId = "da-theory" | "da-validation";

export interface DataAvailabilityNode {
  id: DataAvailabilityNodeId;
  shortTitle: string;
  question: string;
  track: DataAvailabilityTrack;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const DATA_AVAILABILITY_NODES: readonly DataAvailabilityNode[] = [
  {
    id: "da-theory",
    shortTitle: "가용성 메커니즘",
    question:
      "전체 데이터를 받지 않은 참여자는 어떤 조각과 증거로 원본을 다시 얻을 수 있다고 판단합니까?",
    track: "concept",
    href: "/cs/blockchain/da-theory#overview",
    parentLabel: "롤업 · 실행과 데이터 가용성 분리",
    parentHref: "/cs/blockchain/rollup-fundamentals#names",
    curriculumPrevious: {
      href: "/cs/blockchain/rollup-fundamentals#return-map",
      label: "롤업의 실행·게시·정산 경계",
    },
    curriculumNext: {
      href: "/cs/blockchain/da-validation#overview",
      label: "데이터 가용성 변경 검증",
    },
  },
  {
    id: "da-validation",
    shortTitle: "변경 검증",
    question:
      "데이터 가용성 구현이나 설정을 바꿀 때 잘못된 조각·숨김·재시작을 어떻게 검증하고 되돌립니까?",
    track: "practice",
    href: "/cs/blockchain/da-validation#overview",
    parentLabel: "데이터 가용성 · 조각 검증과 복원",
    parentHref: "/cs/blockchain/da-theory#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/da-theory#return-map",
      label: "데이터 가용성 메커니즘",
    },
    curriculumNext: {
      href: "/cs/blockchain/robinhood-chain-blob-demand#overview",
      label: "블롭 수요와 공급 압력",
    },
    anchors: [
      {
        href: "/cs/blockchain/da-theory#separation",
        label: "진위·인코딩·가용성 분리",
      },
      {
        href: "/cs/blockchain/da-theory#erasure-code",
        label: "4→8 복원 조건",
      },
      {
        href: "/cs/blockchain/da-theory#eip4844",
        label: "EIP-4844 전체 수신 경계",
      },
      {
        href: "/cs/blockchain/da-theory#peerdas",
        label: "PeerDAS 1차원 열 표본",
      },
      {
        href: "/cs/blockchain/da-theory#celestia",
        label: "Celestia 2차원 확장",
      },
      {
        href: "/cs/blockchain/da-theory#sampling",
        label: "표본 확률의 전제",
      },
    ],
  },
] as const;

export function getDataAvailabilityNode(id: DataAvailabilityNodeId) {
  const node = DATA_AVAILABILITY_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`데이터 가용성 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getDataAvailabilityTrackNodes(track: DataAvailabilityTrack) {
  return DATA_AVAILABILITY_NODES.filter((node) => node.track === track);
}
