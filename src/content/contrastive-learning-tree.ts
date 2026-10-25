export type ContrastiveLearningTrack = "concept" | "practice" | "reference";

export type ContrastiveLearningNodeId =
  | "pair-contract"
  | "simclr"
  | "triplet"
  | "supervised"
  | "evaluation";

export interface ContrastiveLearningNode {
  id: ContrastiveLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: ContrastiveLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
  conceptAnchors?: readonly {
    label: string;
    href: string;
  }[];
}

export const CONTRASTIVE_LEARNING_NODES: readonly ContrastiveLearningNode[] = [
  {
    id: "pair-contract",
    href: "/cs/ai/contrastive-learning#overview",
    shortTitle: "Pair 의미",
    mapLabel: "관계 → 불변성 → h/z 경계",
    track: "concept",
    parentHref: "/cs/ai?sub=ai-practical-embedding",
    parentLabel: "도메인 임베딩",
    question:
      "두 입력을 가깝게 또는 멀게 만들기 전에, 어떤 근거로 positive·negative·unknown 관계를 정해야 할까요?",
    closure:
      "대조 학습은 loss 이름보다 pair의 업무상 의미에서 시작합니다. 관계 근거와 변환 버전을 기록하고, 재사용할 encoder 표현 h와 학습용 projection z를 구분해야 다음 objective를 고를 수 있습니다.",
  },
  {
    id: "simclr",
    href: "/cs/ai/simclr-infonce#overview",
    shortTitle: "SimCLR",
    mapLabel: "두 view → 2N 후보 → NT-Xent",
    track: "concept",
    parentHref: "/cs/ai/contrastive-learning#return-map",
    parentLabel: "Pair 의미 · 다음 objective",
    question:
      "N개 원본에서 만든 2N개 view가 어떻게 각 anchor의 분류 문제로 바뀔까요?",
    closure:
      "같은 원본의 다른 view 하나를 positive로 두고 anchor 자신을 뺀 후보에 softmax를 적용하면 NT-Xent가 됩니다. Temperature와 hidden positive는 별도로 점검해야 합니다.",
  },
  {
    id: "triplet",
    href: "/cs/ai/triplet-metric-learning#overview",
    shortTitle: "Triplet",
    mapLabel: "anchor → margin → mining",
    track: "concept",
    parentHref: "/cs/ai/contrastive-learning#return-map",
    parentLabel: "Pair 의미 · 상대 거리",
    question:
      "Anchor·positive·negative의 상대 거리와 margin은 언제 loss를 남길까요?",
    closure:
      "Triplet loss는 positive와 negative의 절대 거리가 아니라 anchor 기준의 상대 순서를 학습합니다. Miner가 고른 후보와 index 버전을 함께 남겨야 결과를 재현할 수 있습니다.",
  },
  {
    id: "supervised",
    href: "/cs/ai/supervised-contrastive-learning#overview",
    shortTitle: "Supervised",
    mapLabel: "label → P(i) → multi-positive",
    track: "concept",
    parentHref: "/cs/ai/contrastive-learning#return-map",
    parentLabel: "Pair 의미 · 여러 positive",
    question:
      "Class label 하나를 anchor마다 여러 positive가 있는 학습 신호로 어떻게 바꿀까요?",
    closure:
      "같은 label의 다른 sample을 P(i)로 모으고 각 positive의 log probability를 평균합니다. 논문의 two-view 구성에서는 paired view가 남고, one-view 변형에서는 빈 positive 집합을 따로 처리해야 합니다.",
  },
  {
    id: "evaluation",
    href: "/cs/ai/contrastive-evaluation#overview",
    shortTitle: "평가",
    mapLabel: "후보 고정 → 감사 → 출시 판단",
    track: "practice",
    parentHref: "/cs/ai/contrastive-learning#return-map",
    parentLabel: "대조 학습 · Pair 의미",
    question:
      "새 encoder·miner·pair policy를 운영 환경에 반영해도 된다는 근거를 어떻게 남길까요?",
    closure:
      "후보 snapshot을 고정하고 위험 구간별 pair audit과 같은 split·seed의 downstream 차이를 함께 봐야 출시 근거가 됩니다. 평가 계약이 깨지면 영향을 받은 receipt를 폐기하고 이전 revision을 유지합니다.",
    conceptAnchors: [
      {
        label: "Pair 관계의 업무상 의미",
        href: "/cs/ai/contrastive-learning#pair-contract",
      },
      {
        label: "Triplet miner와 candidate receipt",
        href: "/cs/ai/triplet-metric-learning#mining",
      },
      {
        label: "Label 관계의 경계",
        href: "/cs/ai/supervised-contrastive-learning#boundaries",
      },
      {
        label: "Test feedback와 선택 편향",
        href: "/cs/ai/train-validation-test#selection-feedback",
      },
    ],
  },
] as const;

export function getContrastiveLearningNode(id: ContrastiveLearningNodeId) {
  const node = CONTRASTIVE_LEARNING_NODES.find(
    (candidate) => candidate.id === id,
  );
  if (!node) throw new Error(`대조 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getContrastiveTrackNodes(track: ContrastiveLearningTrack) {
  return CONTRASTIVE_LEARNING_NODES.filter((node) => node.track === track);
}
