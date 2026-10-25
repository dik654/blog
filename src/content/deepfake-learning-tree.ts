export type DeepfakeLearningTrack = "concept" | "practice" | "reference";

export type DeepfakeLearningNodeId =
  | "evaluation-map"
  | "preprocessing-lineage"
  | "frequency-evidence"
  | "video-decisions"
  | "dataset-governance";

export interface DeepfakeLearningNode {
  id: DeepfakeLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: DeepfakeLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const DEEPFAKE_LEARNING_NODES: readonly DeepfakeLearningNode[] = [
  {
    id: "evaluation-map",
    href: "/cs/ai/deepfake-detection#overview",
    shortTitle: "평가 지도",
    mapLabel: "원본 → 분리 → 위험 범위",
    track: "concept",
    parentHref: "/cs/ai/image-classification-pipeline#overview",
    parentLabel: "이미지 분류 · 데이터와 평가 경계",
    question:
      "같은 원본에서 만든 파생본과 이미 본 생성 조건이 시험 자료에 섞일 때, 왜 좋은 점수가 새로운 딥페이크를 찾는 능력을 뜻하지 않을까요?",
    closure:
      "파일 수가 아니라 원본 영상·등장 인물 단위로 파생본을 묶고, 학습에서 가린 생성기·코덱·촬영 조건마다 위험을 따로 계산해야 평가 점수의 적용 범위를 말할 수 있습니다.",
  },
  {
    id: "preprocessing-lineage",
    href: "/cs/ai/deepfake-preprocessing-lineage#overview",
    shortTitle: "전처리 증거",
    mapLabel: "프레임 → 얼굴 추적 → 입력",
    track: "concept",
    parentHref: "/cs/ai/deepfake-detection#overview",
    parentLabel: "딥페이크 평가 지도 · 입력 증거",
    question:
      "얼굴을 못 찾은 프레임을 버리면 탐지기가 쉬운 얼굴만 본 결과가 되는데, 실패까지 어떻게 평가 분모와 원본에 연결할까요?",
    closure:
      "평가할 원본 시각을 먼저 고정하고 detect·track·crop의 성공과 실패를 모두 기록해야 coverage와 detector 성능을 분리해 설명할 수 있습니다.",
  },
  {
    id: "frequency-evidence",
    href: "/cs/ai/deepfake-frequency-evidence#overview",
    shortTitle: "주파수 단서",
    mapLabel: "스펙트럼 → 손상 → 공동 오류",
    track: "concept",
    parentHref: "/cs/ai/deepfake-detection#domain-risk",
    parentLabel: "딥페이크 평가 지도 · 조건별 위험",
    question:
      "특정 생성기에서 보인 주파수 무늬가 코덱과 크기 변경 뒤에도 탐지 근거로 남는지 어떻게 구분할까요?",
    closure:
      "주파수 패턴을 보편 서명으로 가정하지 않고 같은 원본의 손상 조건과 공간 분기의 공동 오류를 비교해야 추가 단서인지 판단할 수 있습니다.",
  },
  {
    id: "video-decisions",
    href: "/cs/ai/deepfake-video-decisions#overview",
    shortTitle: "영상 판정",
    mapLabel: "프레임 점수 → 영상 행동",
    track: "concept",
    parentHref: "/cs/ai/deepfake-detection#domain-risk",
    parentLabel: "딥페이크 평가 지도 · 조건별 위험",
    question:
      "프레임마다 다른 점수를 길이가 다른 영상 하나의 판정으로 만들 때 무엇을 고정해야 후보를 공정하게 비교할 수 있을까요?",
    closure:
      "프레임 선택·coverage·집계·보정·임계값을 하나의 판정 계약으로 고정해야 모델 구조가 아닌 평가 차이를 성능 차이로 오인하지 않습니다.",
  },
  {
    id: "dataset-governance",
    href: "/cs/ai/deepfake-dataset-governance#overview",
    shortTitle: "자료 범위",
    mapLabel: "출처 → 사용 범위 → coverage",
    track: "concept",
    parentHref: "/cs/ai/deepfake-detection#release",
    parentLabel: "딥페이크 평가 지도 · 주장 범위",
    question:
      "어떤 원본·인물·생성기·코덱을 어느 split에서 썼는지와 사용할 권한을 어떻게 함께 추적합니까?",
    closure:
      "파생 자료의 출처와 사용 범위를 manifest로 연결합니다. 조건별 독립 원본 수를 세어야 자료를 쓸 수 있는 범위와 점수가 뒷받침하는 범위를 함께 설명할 수 있습니다.",
  },
] as const;

export function getDeepfakeLearningNode(id: DeepfakeLearningNodeId) {
  const node = DEEPFAKE_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) {
    throw new Error(`딥페이크 학습 노드를 찾을 수 없습니다: ${id}`);
  }
  return node;
}

export function getDeepfakeTrackNodes(track: DeepfakeLearningTrack) {
  return DEEPFAKE_LEARNING_NODES.filter((node) => node.track === track);
}
