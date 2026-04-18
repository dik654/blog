import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  dense: '#6366f1',     // Dense retrieval
  sparse: '#f59e0b',    // Sparse (BM25)
  hybrid: '#10b981',    // Hybrid
  rerank: '#ef4444',    // Re-ranking
  mmr: '#8b5cf6',       // MMR
  query: '#0ea5e9',     // Query
  muted: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: 'Dense Retrieval — 의미 기반 검색',
    body: '질문을 동일 임베딩 모델로 벡터화 → 벡터 DB에서 코사인 유사도 상위 k개 반환.\n장점: "설비 이상 진동" ↔ "기계 비정상 떨림" — 의미적으로 매칭.\n단점: 정확한 수치/코드명 매칭 약함. "CNC-7200" 검색 시 부정확.\nbi-encoder 구조: 질문과 문서를 독립 인코딩 — 문서 벡터 사전 계산 가능.\n검색 시간: HNSW 기준 100만 벡터에서 ~5ms (k=10).',
  },
  {
    label: 'Sparse Retrieval — BM25 키워드 매칭',
    body: 'BM25: TF-IDF 기반 키워드 매칭. 역문서 빈도(IDF)로 희귀 단어 가중.\nscore(q,d) = sum_i IDF(qi) * (f(qi,d) * (k1+1)) / (f(qi,d) + k1 * (1-b+b*|d|/avgdl)).\n장점: 정확한 용어 매칭 강함. "CNC-7200" → 정확히 해당 문서.\n단점: 동의어/유사 표현 매칭 불가. 의미 이해 없이 단어 빈도만 사용.\nElasticsearch/Lucene 기반 — 대규모 문서에서도 밀리초 검색.',
  },
  {
    label: 'Hybrid Search — Dense + Sparse 결합',
    body: 'Dense와 Sparse 각각의 강점 결합 — 의미 + 키워드 동시 매칭.\nReciprocal Rank Fusion(RRF): 각 방식의 순위를 역수 합산.\nRRF_score(d) = sum_r 1/(k + rank_r(d)), k=60 기본.\n또는 가중 합산: alpha * dense_score + (1-alpha) * sparse_score.\nalpha=0.7 (dense 70%) 일반적 — 도메인별 실험으로 최적값 탐색.\n제조 도메인: 코드명(sparse) + 의미(dense) 둘 다 중요 → hybrid 필수.',
  },
  {
    label: 'Re-ranking — Cross-encoder로 정밀 재정렬',
    body: 'bi-encoder 검색 결과(top-20~50)를 cross-encoder로 재정렬.\ncross-encoder: (질문, 문서)를 하나의 입력으로 동시 인코딩 → 정밀 유사도.\nbi-encoder보다 정확도 5~15% 향상 — 단, 문서당 추론 필요로 느림.\n실전 파이프라인: bi-encoder top-50 → cross-encoder top-5 → LLM.\ncohere-rerank, bge-reranker-large, ms-marco-MiniLM 등 사용.\n지연 시간: top-20 재정렬 ~100ms (GPU 기준).',
  },
  {
    label: 'MMR — 다양성 확보',
    body: 'Maximal Marginal Relevance: 관련성 높으면서 서로 다른 문서 선택.\nMMR = argmax_d [lambda * sim(q,d) - (1-lambda) * max_dj sim(d,dj)].\nlambda=0.5: 관련성과 다양성 균형. lambda=1: 순수 관련성.\n문제: top-5가 모두 같은 섹션의 유사 문단 → 정보 중복.\nMMR 적용 후: 서로 다른 섹션에서 다양한 관점의 문서 5개 선택.\n제조 Q&A: 원인 분석 + 대응 절차 + 예방 조치가 모두 필요 → MMR 필수.',
  },
  {
    label: 'Query Transformation — 질문 개선',
    body: 'Multi-query: 원래 질문을 LLM으로 3~5개 변형 생성 → 각각 검색 → 합집합.\nHyDE: LLM이 가상 답변 생성 → 그 답변으로 검색 (답변과 문서의 유사도가 높음).\nStep-back: 구체적 질문 → 상위 개념 질문으로 확장. "7200 진동" → "CNC 진동 원인".\nQuery decomposition: 복합 질문을 하위 질문으로 분해 → 각각 검색.\n실전: Multi-query가 가장 범용적. 복잡한 질문에는 decomposition.',
  },
];
