export type RethBlockExecutionTrack = "concept" | "practice" | "reference";

export type RethBlockExecutionNodeId =
  | "reth-block-execution"
  | "reth-block-execution-validation";

export interface RethBlockExecutionNode {
  id: RethBlockExecutionNodeId;
  shortTitle: string;
  mapLabel: string;
  question: string;
  track: RethBlockExecutionTrack;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RETH_BLOCK_EXECUTION_NODES: readonly RethBlockExecutionNode[] = [
  {
    id: "reth-block-execution",
    shortTitle: "블록 실행",
    mapLabel: "부모 상태에서 순차 실행 결과까지",
    question:
      "Reth는 블록의 거래를 어떤 순서로 실행하고, 무엇을 결과로 돌려줍니까?",
    track: "concept",
    href: "/cs/blockchain/reth-block-execution#overview",
    parentLabel: "EVM 심화 · 프레임 결과",
    parentHref: "/cs/blockchain/evm-advanced#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-payload-builder-validation#return-map",
      label: "Payload Builder 변경 검증",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-block-execution-validation#overview",
      label: "Block Execution 변경 검증",
    },
  },
  {
    id: "reth-block-execution-validation",
    shortTitle: "변경 검증",
    mapLabel: "같은 블록에서 실행·실패·복구 결과 대조",
    question:
      "Reth release나 실행 설정을 바꿀 때 상태·영수증·검증·rollback 회귀를 어떻게 찾습니까?",
    track: "practice",
    href: "/cs/blockchain/reth-block-execution-validation#overview",
    parentLabel: "Reth Block Execution · 블록 실행",
    parentHref: "/cs/blockchain/reth-block-execution#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-block-execution#return-map",
      label: "Reth Block Execution",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-precompiles#overview",
      label: "Reth Precompiles",
    },
    anchors: [
      {
        href: "/cs/blockchain/reth-block-execution#evm-config",
        label: "Fork에 맞는 EVM 환경",
      },
      {
        href: "/cs/blockchain/reth-block-execution#execution",
        label: "Pre·거래·Post 실행 순서",
      },
      {
        href: "/cs/blockchain/reth-block-execution#bundle",
        label: "결과 묶음과 되돌림 기록",
      },
      {
        href: "/cs/blockchain/reth-block-execution#validation-boundary",
        label: "실행과 사후 검증의 경계",
      },
    ],
  },
] as const;

export function getRethBlockExecutionNode(id: RethBlockExecutionNodeId) {
  const node = RETH_BLOCK_EXECUTION_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Reth Block Execution 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getRethBlockExecutionTrackNodes(track: RethBlockExecutionTrack) {
  return RETH_BLOCK_EXECUTION_NODES.filter((node) => node.track === track);
}
