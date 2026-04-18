import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  model: '#6366f1',     // 임베딩 모델
  vector: '#0ea5e9',    // 벡터
  db: '#10b981',        // 벡터 DB
  index: '#f59e0b',     // 인덱싱
  tradeoff: '#ef4444',  // 트레이드오프
  muted: '#64748b',
};

export const MODELS = [
  { name: 'E5-large', dim: 1024, lang: 'multi', score: 0.89 },
  { name: 'BGE-large', dim: 1024, lang: 'multi', score: 0.88 },
  { name: 'GTE-large', dim: 1024, lang: 'multi', score: 0.87 },
  { name: 'KoSimCSE', dim: 768, lang: 'ko', score: 0.84 },
];

export const DBS = [
  { name: 'FAISS', type: '라이브러리', scale: '10M~1B', note: 'GPU 지원' },
  { name: 'Chroma', type: '임베디드', scale: '~1M', note: '프로토타입' },
  { name: 'Milvus', type: '분산 DB', scale: '1B+', note: '프로덕션' },
];

export const STEPS: StepDef[] = [
  {
    label: '임베딩 모델 선택 — E5, BGE, 다국어',
    body: 'E5-large: "query: ..." 접두사로 검색 최적화. MTEB 벤치마크 상위.\nBGE-large: 중국어+영어+다국어 지원. FlagEmbedding 라이브러리.\nGTE-large: 알리바바 제작, 효율적 추론.\nKoSimCSE: 한국어 특화, 768차원, 한국어 유사도 태스크 강점.\n선택 기준: 대상 언어, 차원 수, 추론 속도, 라이선스.',
  },
  {
    label: '텍스트 → 벡터 변환 과정',
    body: '입력 텍스트를 토크나이저로 토큰 ID 시퀀스로 변환.\n토큰 시퀀스 → Transformer 인코더 → 각 토큰의 hidden state 출력.\nPooling: [CLS] 토큰 또는 mean pooling으로 단일 벡터 추출.\n결과: 1024차원 실수 벡터. L2 정규화 후 코사인 유사도 = 내적.\n배치 처리: GPU에서 256~512 청크를 한 번에 인코딩 — 처리량 극대화.',
  },
  {
    label: '벡터 DB 비교 — FAISS, Chroma, Milvus',
    body: 'FAISS(Meta): C++ 기반 라이브러리. GPU 지원으로 10억 벡터 밀리초 검색.\nChroma: Python 네이티브 임베디드 DB. pip install로 즉시 사용. 프로토타입에 적합.\nMilvus: 분산 아키텍처. 수십억 벡터 프로덕션 운영. k8s 배포.\n선택 기준: 데이터 규모(만→억), 인프라(로컬→클라우드), 운영 복잡도.',
  },
  {
    label: '인덱싱 전략 — HNSW vs IVF',
    body: 'Flat: 전수 검색. 100% 정확도이나 O(n) — 만 개 이하에서만 실용적.\nIVF(Inverted File): 벡터를 nlist개 클러스터로 분류. nprobe개만 탐색.\nHNSW(Hierarchical Navigable Small World): 그래프 기반. M=16, ef=64 기본.\nIVF: 메모리 효율적, 대규모에 유리. HNSW: 지연 시간 최소, 메모리 2~3배.\nFAISS 조합: IVF + PQ(Product Quantization)로 메모리 90% 절감.',
  },
  {
    label: '차원 vs 검색 속도 트레이드오프',
    body: '차원↑ → 표현력↑, 검색 정밀도↑ / 메모리↑, 검색 시간↑.\n768차원(BERT 기반): 벡터당 3KB. 100만 벡터 = 3GB.\n1024차원(E5-large): 벡터당 4KB. 100만 벡터 = 4GB.\nMatryoshka 임베딩: 1024 → 256 차원 축소 시 성능 95% 유지.\n실전: 프로토타입 768차원 → 프로덕션에서 256~512차원 + PQ 압축.',
  },
];
