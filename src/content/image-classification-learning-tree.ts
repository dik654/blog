export type ImageClassificationLearningTrack = "concept" | "practice" | "reference";

export type ImageClassificationLearningNodeId =
  | "data-boundary"
  | "backbone-budget"
  | "training-stages"
  | "probability-action"
  | "multiview-fusion";

export interface ImageClassificationLearningNode {
  id: ImageClassificationLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: ImageClassificationLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const IMAGE_CLASSIFICATION_LEARNING_NODES: readonly ImageClassificationLearningNode[] = [
  {
    id: "data-boundary",
    href: "/cs/ai/image-classification-pipeline#overview",
    shortTitle: "데이터 경계",
    mapLabel: "파일 → 평가 단위",
    track: "concept",
    parentHref: "/cs/ai/training-pipeline#dataset",
    parentLabel: "학습 파이프라인 · 입력 고정",
    question:
      "같은 상품에서 만든 원본과 crop을 서로 다른 표본으로 세면, 검증 점수는 왜 실제 배포 성능보다 좋아질까요?",
    closure:
      "파일이 아니라 배포에서 처음 만날 대상을 identity group으로 삼고, 그 group 전체를 한 split으로 이동시켜야 검증 자료가 새로운 대상을 나타냅니다.",
  },
  {
    id: "backbone-budget",
    href: "/cs/ai/image-backbone-scaling#overview",
    shortTitle: "표현과 비용",
    mapLabel: "화소 → 표현 → 실행 비용",
    track: "concept",
    parentHref: "/cs/ai/cnn#overview",
    parentLabel: "CNN · 이미지에서 표현 만들기",
    question:
      "같은 이미지를 CNN과 ViT에 넣을 때 해상도와 상호작용 방식은 계산량과 메모리를 어떻게 바꿀까요?",
    closure:
      "해상도·깊이·폭은 모델 이름과 따로 고를 수 없으며, 같은 입력과 학습 예산에서 품질·지연·메모리를 함께 측정해야 합니다.",
  },
  {
    id: "training-stages",
    href: "/cs/ai/image-training-stages#overview",
    shortTitle: "학습 단계",
    mapLabel: "기준 학습 → 단계별 변경",
    track: "concept",
    parentHref: "/cs/ai/training-pipeline#loop",
    parentLabel: "학습 파이프라인 · 상태 갱신",
    question:
      "해상도나 pseudo-label을 추가할 때 어느 상태를 넘겨야 이전 단계의 연장이 아니라 새 실험임을 설명할 수 있을까요?",
    closure:
      "입력·최적화·위치 상태가 같은 구간을 한 stage로 기록하고, 한 번에 한 축만 바꿔 stage별 이득과 실패를 분리합니다.",
  },
  {
    id: "probability-action",
    href: "/cs/ai/image-probability-decisions#overview",
    shortTitle: "확률과 판정",
    mapLabel: "점수 → 확률 → 행동",
    track: "concept",
    parentHref: "/cs/ai/imbalanced-data#thresholding",
    parentLabel: "불균형 데이터 · 임계값과 업무 비용",
    question:
      "모델의 가장 큰 점수가 실제 확률과 업무 행동으로 바뀔 때, 보정과 임계값은 어디에서 따로 결정해야 할까요?",
    closure:
      "logit·보정 확률·업무 행동을 분리하고 calibration·aggregation·threshold의 자료와 적용 순서를 하나의 판정 버전으로 고정합니다.",
  },
  {
    id: "multiview-fusion",
    href: "/cs/ai/multiview-fusion#overview",
    shortTitle: "여러 관측 결합",
    mapLabel: "관측 묶음 → 결합 → 누락 검사",
    track: "concept",
    parentHref: "/cs/ai/image-classification-pipeline#overview",
    parentLabel: "이미지 분류 · 데이터 경계",
    question:
      "같은 상품을 찍은 여러 사진과 센서값 중 하나가 빠져도, 한 상품의 판정을 흔들리지 않게 만들려면 어디에서 어떻게 합쳐야 할까요?",
    closure:
      "먼저 같은 대상을 관측 묶음으로 만들고 좌표·순서·누락의 의미를 고정해야 합니다. 그 뒤에만 입력·표현·토큰 중 결합 위치를 고르고, 실제 누락과 정렬 오차로 결과를 검사할 수 있습니다.",
  },
] as const;

export function getImageClassificationLearningNode(
  id: ImageClassificationLearningNodeId,
) {
  const node = IMAGE_CLASSIFICATION_LEARNING_NODES.find(
    (candidate) => candidate.id === id,
  );
  if (!node) {
    throw new Error(`이미지 분류 학습 노드를 찾을 수 없습니다: ${id}`);
  }
  return node;
}

export function getImageClassificationTrackNodes(
  track: ImageClassificationLearningTrack,
) {
  return IMAGE_CLASSIFICATION_LEARNING_NODES.filter(
    (node) => node.track === track,
  );
}
