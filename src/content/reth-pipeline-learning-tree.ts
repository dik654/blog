export type RethPipelineTrack = "concept" | "practice" | "reference";

export interface RethPipelineAnchor {
  href: string;
  label: string;
}

export interface RethPipelineNode {
  id: "reth-pipeline" | "reth-pipeline-validation";
  href: string;
  shortTitle: string;
  track: RethPipelineTrack;
  mapLabel: string;
  question: string;
  parentHref: string;
  parentLabel: string;
  closure: string;
  anchors?: readonly RethPipelineAnchor[];
  paired?: RethPipelineAnchor;
}

export const RETH_PIPELINE_NODES = [
  {
    id: "reth-pipeline",
    href: "/cs/blockchain/reth-pipeline#overview",
    shortTitle: "Pipeline",
    track: "concept",
    mapLabel: "단계·checkpoint·unwind",
    question: "긴 과거 동기화를 중단하고 다시 시작해도 어떻게 같은 블록 경계로 이어갈까요?",
    parentHref: "/cs/blockchain/reth-sync#backfill-sync",
    parentLabel: "Reth 동기화의 backfill 경로",
    closure: "Reth Pipeline은 과거 동기화를 의존 순서가 있는 stage로 나눕니다. 각 stage는 앞 stage의 checkpoint까지만 유한한 범위를 처리하고, output과 새 checkpoint를 같은 provider transaction에 저장합니다. 잘못된 suffix를 버릴 때는 소비자 stage부터 역순으로 unwind합니다.",
    paired: {
      href: "/cs/blockchain/reth-pipeline-validation#overview",
      label: "Pipeline 중단·복구 검증",
    },
  },
  {
    id: "reth-pipeline-validation",
    href: "/cs/blockchain/reth-pipeline-validation#overview",
    shortTitle: "Pipeline 검증",
    track: "practice",
    mapLabel: "중단·재시작·되감기 대조",
    question: "어떤 중단·복구 증거가 있어야 Pipeline 변경을 운영에 적용할 수 있을까요?",
    parentHref: "/cs/blockchain/reth-pipeline#return-map",
    parentLabel: "Pipeline의 단계·checkpoint·unwind 메커니즘",
    closure: "Pipeline 변경은 정상 완료 시간만으로 승인하지 않습니다. 같은 chain fixture에서 commit 전후 종료, 잘못된 입력과 reorg를 재생하고 stage별 output·checkpoint·state root를 기준 구현에 대조합니다. 정확성과 rollback을 통과한 run에서만 처리량과 복구 시간을 비교하며, 측정 전 결정은 proposed로 남깁니다.",
    anchors: [
      { href: "/cs/blockchain/reth-pipeline#order", label: "Stage 의존 순서" },
      { href: "/cs/blockchain/reth-pipeline#batch", label: "Checkpoint와 batch 범위" },
      { href: "/cs/blockchain/reth-pipeline#commit", label: "Output·checkpoint commit" },
      { href: "/cs/blockchain/reth-pipeline#unwind", label: "역순 unwind" },
    ],
  },
] as const satisfies readonly RethPipelineNode[];

export type RethPipelineNodeId = (typeof RETH_PIPELINE_NODES)[number]["id"];

export function getRethPipelineNode(id: RethPipelineNodeId): RethPipelineNode {
  const node = RETH_PIPELINE_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Unknown Reth pipeline node: ${id}`);
  return node;
}

export function getRethPipelineTrackNodes(track: RethPipelineTrack) {
  return RETH_PIPELINE_NODES.filter((node) => node.track === track);
}
