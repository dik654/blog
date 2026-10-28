export type RailgunTrack = "concept" | "practice" | "reference";

export type RailgunNodeId = "railgun" | "railgun-validation";

export interface RailgunNode {
  id: RailgunNodeId;
  shortTitle: string;
  question: string;
  track: RailgunTrack;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RAILGUN_NODES: readonly RailgunNode[] = [
  {
    id: "railgun",
    shortTitle: "비공개 송금",
    question:
      "금액과 받는 사람을 공개하지 않으면서 이미 존재하는 note를 한 번만 쓰고 새 note를 만들었다는 사실을 어떻게 검증합니까?",
    track: "concept",
    href: "/cs/blockchain/railgun#overview",
    parentLabel: "이더리움 · 프라이버시",
    parentHref: "/cs/blockchain#eth-privacy",
    curriculumPrevious: {
      href: "/cs/blockchain/robinhood-chain-blob-demand#return-map",
      label: "블롭 수요와 공급 압력",
    },
    curriculumNext: {
      href: "/cs/blockchain/railgun-validation#overview",
      label: "RAILGUN 변경 검증",
    },
  },
  {
    id: "railgun-validation",
    shortTitle: "변경 검증",
    question:
      "계약·회로·키·wallet engine을 바꿀 때 기존 note를 잃지 않고 잘못된 송금을 계속 거절하는지 어떻게 검증합니까?",
    track: "practice",
    href: "/cs/blockchain/railgun-validation#overview",
    parentLabel: "RAILGUN · note에서 contract state까지",
    parentHref: "/cs/blockchain/railgun#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/railgun#return-map",
      label: "RAILGUN 비공개 송금",
    },
    curriculumNext: {
      href: "/cs/blockchain/helios#overview",
      label: "Helios 경량 클라이언트",
    },
    anchors: [
      { href: "/cs/blockchain/railgun#state", label: "tree와 nullifier 상태" },
      { href: "/cs/blockchain/railgun#circuit", label: "회로가 확인하는 관계" },
      { href: "/cs/blockchain/railgun#artifact", label: "proof와 boundParams 결속" },
      { href: "/cs/blockchain/railgun#contract", label: "계약의 원자적 상태 전이" },
      { href: "/cs/blockchain/railgun#visibility", label: "보이는 정보와 남는 메타데이터" },
    ],
  },
] as const;

export function getRailgunNode(id: RailgunNodeId) {
  const node = RAILGUN_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`RAILGUN 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getRailgunTrackNodes(track: RailgunTrack) {
  return RAILGUN_NODES.filter((node) => node.track === track);
}
