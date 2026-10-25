export type PruningLearningTrack = "concept" | "practice" | "reference";

export type PruningLearningNodeId =
  | "mask-contract"
  | "unstructured"
  | "structured"
  | "one-shot"
  | "recovery-deployment";

export interface PruningConceptAnchor {
  href: string;
  label: string;
}

export interface PruningLearningNode {
  id: PruningLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  region: "기준" | "제거 단위" | "Mask 결정" | "배포";
  track: PruningLearningTrack;
  form: "explanation" | "decision" | "lookup";
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
  anchors?: readonly PruningConceptAnchor[];
}

export const PRUNING_LEARNING_NODES: readonly PruningLearningNode[] = [
  {
    id: "mask-contract",
    href: "/cs/ai/pruning#overview",
    shortTitle: "가지치기 기초",
    mapLabel: "weight → mask → 실행 단위",
    region: "기준",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai?sub=ai-practical-compression",
    parentLabel: "모델 경량화",
    question: "Weight에 0을 쓰는 일과 실제 계산을 없애는 일은 왜 다를까요?",
    closure:
      "가지치기는 mask로 제거 대상을 정하지만, 실제 이득은 제거 단위와 저장 형식, 이를 읽는 kernel까지 이어져야 생깁니다.",
  },
  {
    id: "unstructured",
    href: "/cs/ai/unstructured-pruning#overview",
    shortTitle: "개별 weight",
    mapLabel: "score → 불규칙 mask → index",
    region: "제거 단위",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/pruning#removal-unit",
    parentLabel: "가지치기 기초 · 제거 단위",
    question: "개별 weight를 자유롭게 지우면 저장량과 실행 비용은 어떻게 달라질까요?",
    closure:
      "개별 weight 제거는 mask 선택의 자유도가 크지만 남은 위치를 기록해야 하므로, value와 index를 함께 센 저장 임계점과 sparse kernel을 따로 확인해야 합니다.",
  },
  {
    id: "structured",
    href: "/cs/ai/structured-pruning#overview",
    shortTitle: "구조 단위",
    mapLabel: "dimension 축소 또는 N:M pattern",
    region: "제거 단위",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/pruning#removal-unit",
    parentLabel: "가지치기 기초 · 제거 단위",
    question: "Channel 축소와 N:M sparsity는 계산 모양을 어떻게 다르게 바꿀까요?",
    closure:
      "Channel pruning은 연결된 tensor dimension을 함께 줄여 더 작은 dense graph를 만들고, N:M은 shape를 유지한 채 모든 local group의 pattern을 제한합니다.",
  },
  {
    id: "one-shot",
    href: "/cs/ai/one-shot-llm-pruning#overview",
    shortTitle: "One-shot LLM",
    mapLabel: "prompt 표본 → activation → mask",
    region: "Mask 결정",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/pruning#mask-shape",
    parentLabel: "가지치기 기초 · mask 적용",
    question: "전체 재학습 없이 작은 prompt 표본으로 어떤 weight를 남길 수 있을까요?",
    closure:
      "One-shot LLM pruning은 calibration prompt가 만든 layer input으로 중요도나 복원 오차를 계산하므로, 표본 범위와 method 경계를 함께 고정해야 합니다.",
  },
  {
    id: "recovery-deployment",
    href: "/cs/ai/pruning-recovery-deployment#overview",
    shortTitle: "복구·배포",
    mapLabel: "mask 유지 → build → release",
    region: "배포",
    track: "practice",
    form: "decision",
    parentHref: "/cs/ai/pruning#handoff",
    parentLabel: "가지치기 기초 · 실행 계약",
    question: "정한 mask를 지키면서 품질을 회복하고 실제 runtime 이득까지 어떻게 확인할까요?",
    closure:
      "배포 후보는 recovery 중 weight와 optimizer state의 mask 불변식을 지키고, 대상 engine에서 실제 선택된 sparse tactic과 품질·메모리·지연시간을 함께 통과해야 합니다.",
    anchors: [
      { href: "/cs/ai/pruning#mask-shape", label: "mask·density 계산" },
      { href: "/cs/ai/unstructured-pruning#storage-break-even", label: "value·index 저장 임계점" },
      { href: "/cs/ai/structured-pruning#nm-pattern", label: "shape 축소·N:M 계약" },
      { href: "/cs/ai/one-shot-llm-pruning#calibration", label: "calibration 표본과 중요도" },
    ],
  },
] as const;

export function getPruningLearningNode(id: PruningLearningNodeId) {
  const node = PRUNING_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`가지치기 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getPruningLearningTrackNodes(track: PruningLearningTrack) {
  return PRUNING_LEARNING_NODES.filter((node) => node.track === track);
}
