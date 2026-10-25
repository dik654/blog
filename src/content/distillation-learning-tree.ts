export type DistillationLearningTrack = "concept" | "practice" | "reference";

export type DistillationLearningNodeId =
  | "signal-interface"
  | "sequence"
  | "on-policy"
  | "self";

export interface DistillationLearningNode {
  id: DistillationLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  region: "공유 출력" | "문자열" | "방문 상태" | "세대";
  track: DistillationLearningTrack;
  form: "explanation" | "decision" | "lookup";
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const DISTILLATION_LEARNING_NODES: readonly DistillationLearningNode[] = [
  {
    id: "signal-interface",
    href: "/cs/ai/knowledge-distillation#overview",
    shortTitle: "증류 기초",
    mapLabel: "logit·feature → student target",
    region: "공유 출력",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai?sub=ai-practical-compression",
    parentLabel: "모델 경량화",
    question: "Teacher가 아는 것을 student가 학습할 수 있는 신호로 어떻게 바꿀까요?",
    closure:
      "Teacher와 student가 같은 class나 대응 가능한 feature를 공유하면 soft target과 feature bridge로 신호를 전달할 수 있지만, 최종 판단은 student 단독 평가로 해야 합니다.",
  },
  {
    id: "sequence",
    href: "/cs/ai/sequence-distillation#overview",
    shortTitle: "문자열 증류",
    mapLabel: "teacher text → student dataset",
    region: "문자열",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/knowledge-distillation#distillation-scope",
    parentLabel: "증류 기초 · 전달 신호",
    question: "Teacher의 logit을 볼 수 없거나 tokenizer가 다르면 무엇을 전달할까요?",
    closure:
      "공유 vocabulary가 없으면 teacher 문자열을 student tokenizer로 다시 나눠 학습하되, prompt·teacher·sampling·filter·loss mask의 생성 이력을 함께 보존해야 합니다.",
  },
  {
    id: "on-policy",
    href: "/cs/ai/on-policy-distillation#overview",
    shortTitle: "On-policy",
    mapLabel: "student prefix → teacher feedback",
    region: "방문 상태",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/sequence-distillation#coverage-release",
    parentLabel: "문자열 증류 · 고정 데이터의 경계",
    question: "Student가 실제 추론 중 만든 실수 뒤에서도 teacher에게 배울 수 있을까요?",
    closure:
      "Student rollout에서 방문한 prefix를 teacher가 다시 채점하면 고정 응답과 실제 추론 상태의 차이를 줄일 수 있지만, teacher 비용과 오류, domain별 성능은 별도로 확인해야 합니다.",
  },
  {
    id: "self",
    href: "/cs/ai/self-distillation#overview",
    shortTitle: "Self-distillation",
    mapLabel: "frozen 세대 → 다음 세대",
    region: "세대",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/knowledge-distillation#hard-soft-loss",
    parentLabel: "증류 기초 · hard·soft target",
    question: "같은 구조의 이전 세대를 teacher로 쓰면 무엇을 물려받고 무엇을 잃을까요?",
    closure:
      "이전 checkpoint를 frozen teacher로 고정하고 새 student만 갱신해야 세대별 신호를 추적할 수 있으며, teacher agreement와 정답 품질을 나눠 봐야 오류 상속을 찾을 수 있습니다.",
  },
] as const;

export function getDistillationLearningNode(id: DistillationLearningNodeId) {
  const node = DISTILLATION_LEARNING_NODES.find(
    (candidate) => candidate.id === id,
  );
  if (!node) throw new Error(`지식 증류 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getDistillationLearningTrackNodes(
  track: DistillationLearningTrack,
) {
  return DISTILLATION_LEARNING_NODES.filter((node) => node.track === track);
}
