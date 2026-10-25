export type DomainAdaptationTrack = "concept" | "practice" | "reference";

export type DomainAdaptationNodeId =
  | "decision-map"
  | "continued-pretraining"
  | "task-finetuning"
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
