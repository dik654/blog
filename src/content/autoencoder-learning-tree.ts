export type AutoencoderLearningTrack = "concept" | "practice";

export type AutoencoderLearningNodeId =
  | "autoencoder"
  | "linear-pca"
  | "denoising-masked"
  | "sparse-autoencoder"
  | "anomaly-decision";

export interface AutoencoderLearningNode {
  id: AutoencoderLearningNodeId;
  href: string;
  shortTitle: string;
  track: AutoencoderLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
  conceptAnchors?: readonly { href: string; label: string }[];
}

export const AUTOENCODER_LEARNING_NODES: readonly AutoencoderLearningNode[] = [
  {
    id: "autoencoder",
    href: "/cs/ai/autoencoder#overview",
    shortTitle: "Autoencoder 전체 지도",
    track: "concept",
    parentHref: "/cs/ai/deep-learning-overview",
    parentLabel: "딥러닝 전체 지도",
    question:
      "별도 정답 없이 입력 자체를 복원할 때, 무엇을 제한해야 단순 복사와 다른 중간 표현을 배울까요?",
    closure:
      "입력을 좁은 중간값으로 바꾸고 그 값만으로 복원하게 만들며, 복원 점수와 중간 표현의 유용성을 따로 검사합니다.",
  },
  {
    id: "linear-pca",
    href: "/cs/ai/linear-autoencoder-pca#overview",
    shortTitle: "Linear AE와 PCA",
    track: "concept",
    parentHref: "/cs/ai/autoencoder#bottleneck",
    parentLabel: "Autoencoder · 정보 경로 제한",
    question:
      "어떤 전제를 모두 만족할 때 linear autoencoder의 최적 복원 부분공간이 PCA와 같아질까요?",
    closure:
      "중심화한 자료, 선형 encoder·decoder, rank-k 제한, 제곱 오차를 함께 고정하면 최적 복원 부분공간이 PCA의 principal subspace와 일치합니다.",
  },
  {
    id: "denoising-masked",
    href: "/cs/ai/denoising-masked-autoencoders#overview",
    shortTitle: "Denoising과 Masking",
    track: "concept",
    parentHref: "/cs/ai/autoencoder#overview",
    parentLabel: "Autoencoder · input과 target",
    question:
      "Input 일부를 손상하거나 숨기면 encoder가 보는 값과 loss가 비교하는 값은 어떻게 달라질까요?",
    closure:
      "Encoder에는 손상되거나 보이는 부분만 주고 loss는 깨끗한 원본 또는 숨긴 부분과 계산해 그대로 복사하는 경로를 막습니다.",
  },
  {
    id: "sparse-autoencoder",
    href: "/cs/ai/sparse-autoencoder#overview",
    shortTitle: "Sparse AE와 해석",
    track: "concept",
    parentHref: "/cs/ai/autoencoder#bottleneck",
    parentLabel: "Autoencoder · 표현을 제한하는 방법",
    question:
      "LLM의 한 activation을 더 넓은 사전의 소수 방향으로 다시 표현하면, 무엇을 설명할 수 있고 무엇은 아직 증명하지 못할까요?",
    closure:
      "SAE는 model·layer·hook에서 수집한 activation을 sparse dictionary로 복원해 검증할 좌표를 만들지만, feature의 이름·안정성·인과 역할은 별도 증거가 필요합니다.",
  },
  {
    id: "anomaly-decision",
    href: "/cs/ai/reconstruction-anomaly-detection#overview",
    shortTitle: "복원 오차로 경보 만들기",
    track: "practice",
    parentHref: "/cs/ai/autoencoder#reconstruction",
    parentLabel: "Autoencoder · reconstruction score",
    question:
      "한 sample의 복원 오차를 실제 경보로 바꾸려면 threshold·검증 자료·drift·rollback을 어떻게 관리해야 할까요?",
    closure:
      "복원 오차는 score일 뿐이므로 별도 validation에서 threshold를 정하고, 배포 뒤 false alarm과 drift를 보며 판정 버전을 되돌릴 수 있어야 합니다.",
    conceptAnchors: [
      {
        href: "/cs/ai/autoencoder#reconstruction",
        label: "Reconstruction objective",
      },
      {
        href: "/cs/ai/autoencoder#evaluation",
        label: "Identity failure와 평가 분리",
      },
    ],
  },
] as const;

export function getAutoencoderLearningNode(id: AutoencoderLearningNodeId) {
  const node = AUTOENCODER_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Autoencoder learning node를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getAutoencoderTrackNodes(track: AutoencoderLearningTrack) {
  return AUTOENCODER_LEARNING_NODES.filter((node) => node.track === track);
}
