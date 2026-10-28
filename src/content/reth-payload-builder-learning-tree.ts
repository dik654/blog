export type RethPayloadBuilderTrack = "concept" | "practice" | "reference";

export type RethPayloadBuilderNodeId =
  | "reth-payload-builder"
  | "reth-payload-builder-validation";

export interface RethPayloadBuilderNode {
  id: RethPayloadBuilderNodeId;
  shortTitle: string;
  mapLabel: string;
  question: string;
  track: RethPayloadBuilderTrack;
  href: string;
  parentLabel: string;
  parentHref: string;
  anchors?: readonly { href: string; label: string }[];
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const RETH_PAYLOAD_BUILDER_NODES: readonly RethPayloadBuilderNode[] = [
  {
    id: "reth-payload-builder",
    shortTitle: "후보 만들기",
    mapLabel: "forkchoice 요청에서 실행 가능한 block candidate까지",
    question:
      "합의 클라이언트의 한 요청은 어떻게 payloadId가 되고, Reth는 그 ID로 어떤 후보를 돌려줍니까?",
    track: "concept",
    href: "/cs/blockchain/reth-payload-builder#overview",
    parentLabel: "Reth 전체 구조 · 검증과 실행",
    parentHref: "/cs/blockchain/reth#overview",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-blob-reorg-release#return-map",
      label: "Blob Reorg와 회수",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-payload-builder-validation#overview",
      label: "Payload Builder 변경 검증",
    },
  },
  {
    id: "reth-payload-builder-validation",
    shortTitle: "변경 검증",
    mapLabel: "같은 입력에서 후보·실패·복구 결과를 대조",
    question:
      "Payload Builder release나 설정을 바꿀 때 유효성·deadline·restart 회귀를 어떻게 배포 전에 찾습니까?",
    track: "practice",
    href: "/cs/blockchain/reth-payload-builder-validation#overview",
    parentLabel: "Reth Payload Builder · 후보 만들기",
    parentHref: "/cs/blockchain/reth-payload-builder#return-map",
    curriculumPrevious: {
      href: "/cs/blockchain/reth-payload-builder#return-map",
      label: "Payload Builder 후보 만들기",
    },
    curriculumNext: {
      href: "/cs/blockchain/reth-block-execution#overview",
      label: "Reth Block Execution",
    },
    anchors: [
      {
        href: "/cs/blockchain/reth-payload-builder#request",
        label: "forkchoiceUpdated와 payloadId",
      },
      {
        href: "/cs/blockchain/reth-payload-builder#selection",
        label: "거래 선택과 임시 실행 상태",
      },
      {
        href: "/cs/blockchain/reth-payload-builder#resolve",
        label: "반복 build와 getPayload resolve",
      },
    ],
  },
] as const;

export function getRethPayloadBuilderNode(id: RethPayloadBuilderNodeId) {
  return RETH_PAYLOAD_BUILDER_NODES.find((node) => node.id === id)!;
}

export function getRethPayloadBuilderTrackNodes(track: RethPayloadBuilderTrack) {
  return RETH_PAYLOAD_BUILDER_NODES.filter((node) => node.track === track);
}
