export type EmbeddingLearningTrack = "concept" | "practice" | "reference";

export type EmbeddingLearningNodeId =
  | "sentence-vector"
  | "retrieval"
  | "vector-index"
  | "serving-contract"
  | "image-vector"
  | "image-text-relation"
  | "evaluation"
  | "eureka-pipeline";

export interface EmbeddingLearningNode {
  id: EmbeddingLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  track: EmbeddingLearningTrack;
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
}

export const EMBEDDING_LEARNING_NODES: readonly EmbeddingLearningNode[] = [
  {
    id: "sentence-vector",
    href: "/cs/ai/sentence-embeddings#overview",
    shortTitle: "문장 벡터",
    mapLabel: "token state → pooling → relation",
    track: "concept",
    parentHref: "/cs/ai?sub=ai-practical-embedding",
    parentLabel: "도메인 임베딩·적응",
    question: "길이가 다른 문장을 어떻게 같은 크기의 벡터로 만들고, 그 벡터의 가까움에 의미를 부여할까요?",
    closure: "문장 임베딩은 padding을 뺀 token state를 checkpoint의 규칙대로 모아 정규화한 벡터이며, 가까움의 뜻은 pooling이 아니라 학습 pair와 objective가 정합니다.",
  },
  {
    id: "retrieval",
    href: "/cs/ai/bi-encoder-retrieval#overview",
    shortTitle: "검색",
    mapLabel: "사전 계산 → candidate → rerank",
    track: "concept",
    parentHref: "/cs/ai/sentence-embeddings#similarity",
    parentLabel: "임베딩 지도 · 벡터 비교",
    question: "문서 전체를 요청마다 다시 읽지 않고도 정답 후보를 찾고 정교하게 다시 정렬하려면 계산을 어디에서 나눌까요?",
    closure: "Bi-encoder는 문서 벡터를 미리 계산해 online 경로를 query encode와 ANN 탐색으로 줄입니다. Reranker는 전달받은 candidate의 순서만 바꾸므로 첫 단계의 recall이 복구 가능한 범위를 정합니다.",
  },
  {
    id: "vector-index",
    href: "/cs/ai/vector-search-and-ann-indexes#overview",
    shortTitle: "벡터 색인",
    mapLabel: "전수 비교 → 구역 선택 → 짧은 code",
    track: "concept",
    parentHref: "/cs/ai/bi-encoder-retrieval#offline-index",
    parentLabel: "임베딩 지도 · 사전 계산된 문서 벡터",
    question: "문서 벡터가 100만 개일 때 정답 후보를 놓칠 위험과 저장 비용을 어떻게 보면서 비교량을 줄일까요?",
    closure: "전수 비교는 모든 벡터를 확인해 최근접을 보장합니다. IVF는 가까운 구역만 열어 비교 대상을 줄이고, PQ는 벡터를 짧은 code로 바꿔 저장과 거리 계산을 줄이지만 두 단계 모두 recall이나 거리 정밀도를 내줄 수 있습니다.",
  },
  {
    id: "serving-contract",
    href: "/cs/ai/embedding-serving-contract#overview",
    shortTitle: "서빙 계약",
    mapLabel: "입력 규칙 → token 예산 → index 세대",
    track: "concept",
    parentHref: "/cs/ai/bi-encoder-retrieval#offline-index",
    parentLabel: "임베딩 지도 · 사전 계산된 index",
    question: "Checkpoint가 같아도 입력과 index가 달라질 수 있는데, 무엇을 한 배포 세대로 묶어야 할까요?",
    closure: "Checkpoint·tokenizer·role prefix·pooling·normalization·길이·dimension·dtype·corpus·ANN 설정을 한 generation receipt로 묶어야 query와 index가 같은 좌표계를 사용합니다.",
  },
  {
    id: "image-vector",
    href: "/cs/ai/image-embedding-pipeline#overview",
    shortTitle: "이미지 벡터",
    mapLabel: "resize·crop → patch → pooling",
    track: "concept",
    parentHref: "/cs/ai/sentence-embeddings#embedding-family-map",
    parentLabel: "임베딩 지도 · 입력별 벡터화",
    question: "크기와 종횡비가 다른 사진에서 어떤 정보를 남기고 어떤 출력 벡터를 검색에 사용할까요?",
    closure: "이미지 임베딩은 전처리 순서, patch 출력의 pooling 범위, normalization과 similarity 규칙까지 합쳐진 변환입니다. 하나가 바뀌면 같은 백본이어도 index를 다시 만들어야 할 수 있습니다.",
  },
  {
    id: "image-text-relation",
    href: "/cs/ai/image-text-contrastive-pretraining#overview",
    shortTitle: "이미지·텍스트 관계",
    mapLabel: "paired batch → loss → shared space",
    track: "concept",
    parentHref: "/cs/ai/image-embedding-pipeline#similarity",
    parentLabel: "임베딩 지도 · 이미지 벡터의 관계",
    question: "사진과 문장을 같은 공간에 놓을 때 짝을 어떻게 점수화하고, 손실의 정규화 방식은 무엇을 바꿀까요?",
    closure: "이미지·텍스트 대조학습은 paired example을 같은 공간으로 끌어당깁니다. Softmax 손실은 배치 전체를 한 선택 문제로 묶고 sigmoid 손실은 각 쌍을 독립적으로 채점합니다.",
  },
  {
    id: "evaluation",
    href: "/cs/ai/embedding-evaluation#overview",
    shortTitle: "평가",
    mapLabel: "정답 집합 → Recall·NDCG → 경계",
    track: "concept",
    parentHref: "/cs/ai/sentence-embeddings#embedding-family-map",
    parentLabel: "임베딩 지도 · 공통 평가",
    question: "정답이 여러 개이고 후보마다 속도와 크기가 다를 때 검색 품질과 비용을 어떻게 분리해 비교할까요?",
    closure: "먼저 corpus와 multi-positive label snapshot을 고정합니다. Recall은 candidate coverage를, NDCG는 relevant 문서의 순위를 재며, 조건부 선택은 필수 slice와 비용 축을 따로 보존합니다.",
  },
  {
    id: "eureka-pipeline",
    href: "/cs/ai/sionic-eureka#overview",
    shortTitle: "EUREKA 사례",
    mapLabel: "corpus → mining → distillation → slice",
    track: "practice",
    parentHref: "/cs/ai/embedding-evaluation#release",
    parentLabel: "임베딩 평가 · 필수 slice와 배포 경계",
    question: "앞에서 배운 검색·라벨·평가 개념을 실제 데이터와 증류 파이프라인에서는 어떤 artifact로 이어야 할까요?",
    closure: "EUREKA 사례는 corpus lineage, query-positive graph, mining snapshot, teacher scalar, training config, slice report를 따로 버전 관리합니다. 공개하지 않은 값과 내부 실험은 외부 논문의 사실과 분리합니다.",
  },
] as const;

export function getEmbeddingLearningNode(id: EmbeddingLearningNodeId) {
  const node = EMBEDDING_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`임베딩 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getEmbeddingLearningTrackNodes(track: EmbeddingLearningTrack) {
  return EMBEDDING_LEARNING_NODES.filter((node) => node.track === track);
}
