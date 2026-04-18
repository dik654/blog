import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  e5: '#2563eb',       // E5 — 파랑
  bge: '#10b981',      // BGE — 초록
  gte: '#f59e0b',      // GTE — 앰버
  instruct: '#8b5cf6', // Instruction — 보라
  compare: '#64748b',  // 비교 — 슬레이트
};

export const STEPS: StepDef[] = [
  {
    label: 'E5: "EmbEddings from bidirEctional Encoder rEpresentations"',
    body: `Microsoft (2022). 핵심 아이디어: 모든 입력 앞에 태스크 prefix를 붙임.\n"query: 맛집 추천" / "passage: 서울 강남 맛집 목록..." — 모델이 검색 vs 분류 vs 클러스터링 의도를 구분.\nCCPairs(Consistency-filtered C4 Pairs)로 대규모 사전학습 후, NLI·STS로 파인튜닝.`,
  },
  {
    label: 'BGE: BAAI General Embedding',
    body: `BAAI(Beijing Academy of AI, 2023). RetroMAE(Masked Auto-Encoder)로 사전학습.\n1단계: 대규모 비지도 대조학습 (contrastive). 2단계: 태스크별 파인튜닝.\n특징: Instruction tuning으로 다국어 지원. "Represent this sentence:" prefix 사용.`,
  },
  {
    label: 'GTE: General Text Embeddings',
    body: `Alibaba DAMO (2023). Multi-stage contrastive learning.\n1단계: 대규모 비지도 (위키피디아, 웹 크롤). 2단계: 지도 NLI/STS. 3단계: 어려운 네거티브 마이닝.\n다양한 크기 제공: GTE-small(33M), GTE-base(109M), GTE-large(335M).`,
  },
  {
    label: '인스트럭션 기반 임베딩의 핵심',
    body: `전통 임베딩: 하나의 벡터 공간에서 모든 태스크 수행 → 태스크 간 충돌.\n인스트럭션 기반: prefix/instruction으로 태스크 의도 전달 → 같은 모델이 검색/분류/클러스터링 모두 최적화.\n"query: X" → 검색 모드, "Classify: X" → 분류 모드.`,
  },
  {
    label: '모델 성능 비교 (MTEB 기준)',
    body: `MTEB(Massive Text Embedding Benchmark) 평균 점수 기준.\n모델 크기, 학습 데이터 규모, 다국어 지원 여부가 주요 차별점.\nE5-large-v2: 지시문 접두사로 다양한 태스크 적응. BGE-large: 다국어 강점. GTE-large: 효율-성능 균형.`,
  },
];
