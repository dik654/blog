export type VideoLearningTrack = "concept" | "practice" | "reference";

export type VideoLearningNodeId =
  | "time-observation"
  | "clip-sampling"
  | "convolution"
  | "transformers";

export interface VideoLearningNode {
  id: VideoLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: VideoLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const VIDEO_LEARNING_NODES: readonly VideoLearningNode[] = [
  {
    id: "time-observation",
    href: "/cs/ai/video-understanding#overview",
    shortTitle: "시간 관측",
    mapLabel: "timestamp → duration → rate → alias",
    track: "concept",
    parentHref: "/cs/ai?sub=ai-practical-cv",
    parentLabel: "실전 CV · 비디오 이해",
    question:
      "같은 16장이라도 원본 시각과 stride가 다르면 모델이 본 시간이 달라지는데, 실제 관측 구간과 시간 해상도를 어떻게 계산할까요?",
    closure:
      "프레임 수만 기록하지 않고 PTS·time base·stride를 함께 읽으면 관측 시간과 초당 관측 횟수를 분리할 수 있고, 그 값으로 빠른 반복 움직임이 겹쳐 보이는 조건까지 설명할 수 있습니다.",
  },
  {
    id: "clip-sampling",
    href: "/cs/ai/video-clip-sampling#overview",
    shortTitle: "Clip Sampling",
    mapLabel: "구간 선택 → 합집합 → 평가 재현",
    track: "concept",
    parentHref: "/cs/ai/video-understanding#return",
    parentLabel: "비디오 시간 관측 · 다음 질문",
    question:
      "여러 clip이 같은 시간을 겹쳐 볼 때 실제 관측 범위를 어떻게 세고, 같은 평가 입력과 판정을 어떻게 다시 확인할까요?",
    closure:
      "Clip 길이의 단순합이 아니라 interval union을 계산하고 source·timestamp·decode·crop·model·reducer를 한 재현 기록으로 이으면 관측 범위와 prediction이 달라진 첫 경계를 찾을 수 있습니다.",
  },
  {
    id: "convolution",
    href: "/cs/ai/video-convolution-architectures#overview",
    shortTitle: "Video Convolution",
    mapLabel: "seconds → 초기화 → block → pathway",
    track: "concept",
    parentHref: "/cs/ai/video-understanding#return",
    parentLabel: "비디오 시간 관측 · 다음 질문",
    question:
      "같은 clip을 넣었을 때 I3D·R(2+1)D·SlowFast는 어느 계산을 바꾸며, temporal output 하나는 원본 몇 초와 연결될까요?",
    closure:
      "Input timestamp에서 temporal receptive span을 계산한 뒤, I3D의 초기화·R(2+1)D의 block 연산·SlowFast의 pathway 배분을 서로 다른 축으로 놓으면 세 구조의 역할과 보장 범위를 구분할 수 있습니다.",
  },
  {
    id: "transformers",
    href: "/cs/ai/video-transformers#overview",
    shortTitle: "Video Transformer",
    mapLabel: "tubelet → token → space-time attention",
    track: "concept",
    parentHref: "/cs/ai/video-understanding#return",
    parentLabel: "비디오 시간 관측 · 다음 질문",
    question:
      "비디오 격자를 tubelet token으로 바꾸면 sequence 길이와 space-time attention 비용은 어떻게 정해질까요?",
    closure:
      "시간·높이·너비를 tubelet 크기로 나눈 token geometry에서 출발해야 joint·divided attention과 masked pretraining이 줄이는 계산을 같은 경계에서 셀 수 있습니다.",
  },
] as const;

export function getVideoLearningNode(id: VideoLearningNodeId) {
  const node = VIDEO_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`비디오 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getVideoTrackNodes(track: VideoLearningTrack) {
  return VIDEO_LEARNING_NODES.filter((node) => node.track === track);
}
