import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  mteb: '#6366f1',     // MTEB 벤치마크 — 인디고
  sts: '#2563eb',      // STS — 파랑
  retrieval: '#10b981', // 검색 — 초록
  cluster: '#f59e0b',  // 클러스터링 — 앰버
  probe: '#8b5cf6',    // Probing — 보라
  pair: '#ef4444',     // 쌍 분류 — 빨강
};

export const STEPS: StepDef[] = [
  {
    label: 'MTEB: Massive Text Embedding Benchmark',
    body: `Muennighoff et al. (2023). 8개 태스크 카테고리, 56개 데이터셋.\n분류, 클러스터링, 쌍 분류, 재순위, 검색, STS, 요약 — 임베딩의 "종합 성적표".\n하나의 점수로 모델의 전반적 품질을 비교 가능.`,
  },
  {
    label: 'STS: Semantic Textual Similarity',
    body: `두 문장 간 의미 유사도를 0~5 스케일로 측정.\ncosine similarity와 인간 평가 간 Spearman/Pearson 상관계수 계산.\nSTSb(STS Benchmark): 가장 대표적 — 8,628개 문장 쌍, 뉴스/포럼/캡션 도메인.\nBERT [CLS]: ρ=29.2, SBERT: ρ=84.6, E5-large: ρ=86.0.`,
  },
  {
    label: '검색 정확도: Recall@k, MRR, NDCG',
    body: `Recall@k: 상위 k개 결과에 정답이 포함된 비율.\nMRR(Mean Reciprocal Rank): 정답의 평균 역순위 — 1위에 있으면 1.0, 2위면 0.5.\nNDCG(Normalized Discounted Cumulative Gain): 순위 품질의 표준 지표 — 상위에 관련 문서가 많을수록 높음.\nMS-MARCO, Natural Questions, BEIR 벤치마크가 대표적.`,
  },
  {
    label: '클러스터링 품질: V-measure, ARI',
    body: `임베딩 벡터로 k-means/AgglomerativeClustering 수행 후 실제 라벨과 비교.\nV-measure: 동질성(한 클러스터 안에 같은 클래스) × 완전성(같은 클래스가 한 클러스터에)의 조화평균.\nARI(Adjusted Rand Index): 우연의 일치를 보정한 클러스터 일치도 — 0이면 랜덤, 1이면 완벽.\n20 Newsgroups, Reddit 클러스터링 데이터셋 사용.`,
  },
  {
    label: 'Probing Tasks: 임베딩이 담고 있는 정보 분석',
    body: `임베딩 벡터 위에 간단한 선형 분류기만 올려서 특정 정보가 인코딩되었는지 확인.\n구문 정보: 트리 깊이, 최상위 성분, 문장 길이. 의미 정보: 시제, 주어 수, 목적어 수.\n핵심 원리: 선형 분류기가 성공하면, 해당 정보가 벡터 공간에 선형적으로 인코딩되어 있다는 뜻.\n좋은 문장 임베딩: 구문+의미 정보 모두 높은 probing 정확도.`,
  },
];
