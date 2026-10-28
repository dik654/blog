export type RethPrecompilesTrack = "concept" | "practice" | "reference";

export type RethPrecompilesNodeId =
  | "reth-precompiles"
  | "reth-precompiles-validation";

export interface RethPrecompilesNode {
  id: RethPrecompilesNodeId;
  shortTitle: string;
  mapLabel: string;
  question: string;
  track: RethPrecompilesTrack;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RETH_PRECOMPILES_NODES: readonly RethPrecompilesNode[] = [
  {
    id: "reth-precompiles",
    shortTitle: "Precompile 호출",
    mapLabel: "Fork registry에서 gas·입력·출력까지",
    question:
      "Reth는 특정 주소의 CALL을 어떻게 네이티브 연산으로 바꾸고 같은 결과를 보장합니까?",
    track: "concept",
    href: "/cs/blockchain/reth-precompiles#overview",
    parentLabel: "Reth Block Execution · 순차 실행",
    parentHref: "/cs/blockchain/reth-block-execution#execution",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-block-execution-validation#return-map",
      label: "Block Execution 변경 검증",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-precompiles-validation#overview",
      label: "Precompile 변경 검증",
    },
  },
  {
    id: "reth-precompiles-validation",
    shortTitle: "변경 검증",
    mapLabel: "Registry·gas·vector·backend parity 대조",
    question:
      "Reth·revm 또는 암호 backend를 바꿀 때 precompile 회귀와 복구 실패를 어떻게 찾습니까?",
    track: "practice",
    href: "/cs/blockchain/reth-precompiles-validation#overview",
    parentLabel: "Reth Precompile · 호출 계약",
    parentHref: "/cs/blockchain/reth-precompiles#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-precompiles#return-map",
      label: "Reth Precompile 호출",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-txpool#overview",
      label: "Reth TxPool",
    },
    anchors: [
      {
        href: "/cs/blockchain/reth-precompiles#registry",
        label: "Fork별 registry와 주소 lookup",
      },
      {
        href: "/cs/blockchain/reth-precompiles#gas-gate",
        label: "입력 길이 기반 gas gate",
      },
      {
        href: "/cs/blockchain/reth-precompiles#execution",
        label: "네이티브 연산과 output 변환",
      },
      {
        href: "/cs/blockchain/reth-precompiles#failure-boundaries",
        label: "미등록·OOG·잘못된 입력 실패 구분",
      },
    ],
  },
] as const;

export function getRethPrecompilesNode(id: RethPrecompilesNodeId) {
  const node = RETH_PRECOMPILES_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Reth Precompiles 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getRethPrecompilesTrackNodes(track: RethPrecompilesTrack) {
  return RETH_PRECOMPILES_NODES.filter((node) => node.track === track);
}
