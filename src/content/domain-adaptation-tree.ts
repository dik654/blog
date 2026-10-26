export type DomainAdaptationTrack = "concept" | "practice" | "reference";

export type DomainAdaptationNodeId =
  | "decision-map"
  | "continued-pretraining"
  | "task-finetuning"
  | "lora-mechanism"
  | "lora-operations"
  | "data-governance";

export interface DomainAdaptationNode {
  id: DomainAdaptationNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: DomainAdaptationTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
  anchors?: readonly { href: string; label: string }[];
}

export const DOMAIN_ADAPTATION_NODES: readonly DomainAdaptationNode[] = [
  {
    id: "decision-map",
    href: "/cs/ai/domain-finetuning#overview",
    shortTitle: "적응 지도",
    mapLabel: "실패 → 상태 위치 → 최소 개입",
    track: "concept",
    parentHref: "/cs/ai?sub=ai-practical-embedding",
    parentLabel: "도메인 임베딩·적응",
    question:
      "도메인에서 실패한 요청을 보고 무엇을 외부 문서·가중치·행동 예시·실행 환경 중 어디에서 고쳐야 할까요?",
    closure:
      "현재 사실은 외부 문서, 반복되는 언어 패턴은 모델 가중치, 출력 행동은 supervised example, 지연·메모리 문제는 실행 환경에서 고칩니다. 먼저 잘못된 상태의 위치를 찾은 뒤 그 상태를 소유한 가장 작은 개입을 검증합니다.",
  },
  {
    id: "continued-pretraining",
    href: "/cs/ai/continued-pretraining#overview",
    shortTitle: "Continued pretraining",
    mapLabel: "corpus → token loss → checkpoint",
    track: "concept",
    parentHref: "/cs/ai/domain-finetuning#branches",
    parentLabel: "적응 지도 · 반복되는 언어 패턴",
    question:
      "전문 corpus를 더 읽힐 때 어떤 token을 섞고 어느 checkpoint를 남겨야 할까요?",
    closure:
      "Continued pretraining은 versioned domain corpus와 general replay를 같은 token objective로 학습하고, domain gain과 general forgetting을 함께 본 checkpoint를 반환합니다.",
  },
  {
    id: "task-finetuning",
    href: "/cs/ai/domain-task-finetuning#overview",
    shortTitle: "Task fine-tuning",
    mapLabel: "demonstration → loss mask → 행동",
    track: "concept",
    parentHref: "/cs/ai/domain-finetuning#branches",
    parentLabel: "적응 지도 · 출력 행동",
    question:
      "원하는 응답 형식과 거절 행동을 어떤 demonstration과 loss로 학습할까요?",
    closure:
      "Task fine-tuning은 입력·target·loss mask·평가 계약을 한 demonstration에 묶고, 업데이트 범위와 행동 release gate를 별도로 검증합니다.",
  },
  {
    id: "lora-mechanism",
    href: "/cs/ai/lora-finetuning#overview",
    shortTitle: "LoRA·QLoRA",
    mapLabel: "frozen base → low-rank update",
    track: "concept",
    parentHref: "/cs/ai/domain-task-finetuning#update-scope",
    parentLabel: "Task fine-tuning · 업데이트 범위",
    question:
      "전체 base를 다시 학습하지 않고 작은 변화량만 학습하면 어떤 상태가 줄고, 어떤 계산은 그대로 남을까요?",
    closure:
      "LoRA는 frozen base의 forward를 유지한 채 선택한 layer의 저랭크 변화량만 학습·저장합니다. QLoRA는 base 저장 표현까지 low-bit로 바꾸지만 adapter 학습과 activation·workspace는 별도 상태로 남습니다.",
  },
  {
    id: "lora-operations",
    href: "/cs/ai/lora-training-and-release#overview",
    shortTitle: "LoRA 학습·배포",
    mapLabel: "data → checkpoint → artifact 승인",
    track: "practice",
    parentHref: "/cs/ai/lora-finetuning#return-map",
    parentLabel: "LoRA·QLoRA · 개념 경계",
    question:
      "선택한 LoRA 구성을 실제 데이터로 학습하고, 중단 뒤 이어서 실행하며, 재현 가능한 배포 후보로 어떻게 승인할까요?",
    closure:
      "실무 경로는 token 직렬화와 loss mask, 재개 checkpoint, base·adapter lineage, merge·requantization parity를 각각 검증하고 통과한 artifact만 배포 후보로 남깁니다.",
    anchors: [
      { href: "/cs/ai/lora-finetuning#lora", label: "저랭크 update와 trainable scope" },
      { href: "/cs/ai/lora-finetuning#qlora", label: "QLoRA 저장·연산·학습 정밀도" },
      { href: "/cs/ai/supervised-fine-tuning#response-loss", label: "Response-only loss mask" },
    ],
  },
  {
    id: "data-governance",
    href: "/cs/ai/domain-data-governance#overview",
    shortTitle: "데이터 경계",
    mapLabel: "group·time → rights → 주장 범위",
    track: "concept",
    parentHref: "/cs/ai/domain-finetuning#branches",
    parentLabel: "적응 지도 · 근거 경계",
    question:
      "Row가 많아 보여도 같은 원인과 권리를 공유할 때 무엇을 독립 근거로 셀 수 있을까요?",
    closure:
      "도메인 적응의 근거는 row 수가 아니라 배포 단위를 닮은 독립 group, 시간 경계, 권리·삭제 lineage, 평가 slice coverage로 제한됩니다.",
  },
] as const;

export function getDomainAdaptationNode(id: DomainAdaptationNodeId) {
  const node = DOMAIN_ADAPTATION_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`도메인 적응 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getDomainAdaptationTrackNodes(track: DomainAdaptationTrack) {
  return DOMAIN_ADAPTATION_NODES.filter((node) => node.track === track);
}
