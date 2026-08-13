export const EUREKA_SOURCE_LINKS = {
  e5: {
    label: "E5-Mistral: Improving Text Embeddings with Large Language Models",
    href: "https://arxiv.org/abs/2401.00368",
  },
  gecko: {
    label:
      "Gecko: Versatile Text Embeddings Distilled from Large Language Models",
    href: "https://arxiv.org/abs/2403.20327",
  },
  qwen: {
    label: "Qwen3 Embedding technical report",
    href: "https://arxiv.org/abs/2506.05176",
  },
  positionBias: {
    label:
      "Is Position Bias in Dense Retrievers Built In—or Learned from Data?",
    href: "https://arxiv.org/abs/2605.26578",
  },
  nvRetriever: {
    label: "NV-Retriever: positive-aware hard-negative mining",
    href: "https://arxiv.org/abs/2407.15831",
  },
  multiPositive: {
    label: "Training Dense Retrievers with Multiple Positive Passages",
    href: "https://arxiv.org/abs/2602.12727",
  },
  distillation: {
    label: "Distilling the Knowledge in a Neural Network",
    href: "https://arxiv.org/abs/1503.02531",
  },
} as const;

export const EUREKA_PIPELINE = [
  {
    id: "corpus",
    label: "코퍼스 수집·누출 제거",
    artifact: "문서 풀",
  },
  {
    id: "queries",
    label: "쿼리 합성·positive 라벨 구성",
    artifact: "(query, positive+) 쌍",
  },
  {
    id: "negatives",
    label: "positive-aware hard negative mining",
    artifact: "positive + negative × 15",
  },
  {
    id: "teachers",
    label: "teacher scalar score 사전 계산",
    artifact: "후보별 teacher logit",
  },
  {
    id: "student",
    label: "후보군 내부 KL distillation",
    artifact: "student retriever",
  },
  {
    id: "evaluation",
    label: "분리된 benchmark·OOD 평가",
    artifact: "NDCG@10·slice별 진단",
  },
] as const;

export const EUREKA_NEGATIVE_COUNT = 15;

export const EUREKA_ABLATIONS = [
  {
    dataset: "데이터 A",
    kl005: 0.6216,
    kl10: 0.5912,
    marginMse: 0.6035,
    cosine: 0.5732,
  },
  {
    dataset: "데이터 B",
    kl005: 0.6244,
    kl10: 0.605,
    marginMse: 0.6053,
    cosine: null,
  },
  {
    dataset: "데이터 C",
    kl005: 0.6232,
    kl10: 0.5935,
    marginMse: 0.6017,
    cosine: null,
  },
  {
    dataset: "데이터 D",
    kl005: 0.6281,
    kl10: 0.6148,
    marginMse: 0.6034,
    cosine: null,
  },
] as const;

export const EUREKA_EVIDENCE = {
  internalExperiment:
    "Sionic 내부 retrieval 종합 점수. student·teacher·learning rate를 고정한 프로젝트 실험이며 외부 benchmark의 보편적 우열을 뜻하지 않는다.",
  unreleasedDetails:
    "두 teacher의 정체·결합식, corpus 규모, margin 값과 최종 benchmark 수치는 이 초안에 공개되지 않았다.",
} as const;
