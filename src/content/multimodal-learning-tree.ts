export type MultimodalLearningTrack = "concept";

export type MultimodalLearningNodeId =
  | "vlm-assembly"
  | "retrieval-grounding";

export interface MultimodalLearningNode {
  id: MultimodalLearningNodeId;
  href: string;
  shortTitle: string;
  track: MultimodalLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const MULTIMODAL_LEARNING_NODES: readonly MultimodalLearningNode[] = [
  {
    id: "vlm-assembly",
    href: "/cs/ai/vision-language-model-architecture#overview",
    shortTitle: "VLM 조립",
    track: "concept",
    parentHref: "/cs/ai/vision-transformer#patch-embedding",
    parentLabel: "Vision Transformer · patch sequence",
    question:
      "이미지의 patch 표현은 어떤 변환을 거쳐 LLM의 text token과 한 sequence에서 처리될까요?",
    closure:
      "Vision encoder가 만든 patch 표현을 connector가 LLM hidden 차원과 결합 방식에 맞게 바꾸고, 생성형 VLM은 그 visual token과 text token을 함께 처리합니다.",
  },
  {
    id: "retrieval-grounding",
    href: "/cs/ai/multimodal-retrieval-and-visual-grounding#overview",
    shortTitle: "검색과 위치 찾기",
    track: "concept",
    parentHref: "/cs/ai/vision-language-model-architecture#boundary",
    parentLabel: "멀티모달 경로 · 생성과 검색의 경계",
    question:
      "텍스트로 어느 이미지를 고르는 계산과, 고른 이미지 안에서 대상 위치를 찾는 계산은 어디에서 갈릴까요?",
    closure:
      "Dual encoder와 similarity가 후보 이미지를 고른 뒤, grounding 모델이 그 이미지 안의 box·point·mask를 냅니다. 생성형 VLM의 projector 경로와는 별도 경로입니다.",
  },
] as const;

export function getMultimodalLearningNode(id: MultimodalLearningNodeId) {
  const node = MULTIMODAL_LEARNING_NODES.find(
    (candidate) => candidate.id === id,
  );
  if (!node) throw new Error(`Multimodal learning node를 찾을 수 없습니다: ${id}`);
  return node;
}

