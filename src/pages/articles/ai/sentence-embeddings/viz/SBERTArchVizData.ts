import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  bert: '#6366f1',     // BERT 인코더 — 인디고
  sim: '#f59e0b',      // 유사도 계산 — 앰버
  triplet: '#ef4444',  // Triplet loss — 빨강
  contrast: '#10b981', // Contrastive — 초록
  cross: '#8b5cf6',    // Cross-encoder — 보라
  bi: '#2563eb',       // Bi-encoder — 파랑
};

export const STEPS: StepDef[] = [
  {
    label: 'SBERT: 샴(Siamese) 네트워크 구조',
    body: `동일한 BERT 가중치를 공유하는 두 인코더.\n문장 A와 B를 독립적으로 인코딩 → 각각 고정 벡터 u, v 생성.\n"샴(Siamese)" = 쌍둥이 — 같은 구조, 같은 가중치를 공유.`,
  },
  {
    label: '풀링 전략: Mean Pooling + [CLS] + Max',
    body: `SBERT 논문에서 3가지 풀링 비교.\nMean Pooling이 최고 성능: 모든 토큰 정보를 균등하게 반영.\n핵심: BERT 위에 풀링 레이어를 추가하고, 유사도 태스크로 파인튜닝.`,
  },
  {
    label: '학습 목표 1: Classification (NLI)',
    body: `NLI(Natural Language Inference) 데이터셋으로 학습.\nu, v, |u-v|를 concat → softmax 분류: entailment / contradiction / neutral.\n|u-v|: 두 벡터의 element-wise 차이 — 의미 차이를 포착하는 핵심 피처.`,
  },
  {
    label: '학습 목표 2: Regression (STS)',
    body: `STS(Semantic Textual Similarity) 데이터셋: 문장 쌍 + 유사도 점수(0~5).\ncosine_sim(u, v)를 계산하고 MSE 손실로 학습.\n직접적으로 cosine similarity를 최적화 → 추론 시에도 cosine으로 비교.`,
  },
  {
    label: '학습 목표 3: Triplet Loss',
    body: `(anchor, positive, negative) 세 문장.\n목표: sim(anchor, positive) > sim(anchor, negative) + margin.\nloss = max(0, ||a-p|| - ||a-n|| + ε).\nε(margin) = 보통 1.0 — positive와 negative 사이 최소 거리 보장.`,
  },
  {
    label: 'Cross-Encoder vs Bi-Encoder 비교',
    body: `Cross-Encoder: 두 문장을 [SEP]로 연결 → BERT 한 번에 통과 → 점수 출력. 정확도 높지만 O(n²).\nBi-Encoder(SBERT): 각 문장 독립 인코딩 → 벡터 사전 계산 가능 → cosine으로 즉시 비교. O(n).\n실용적 해법: Bi-Encoder로 후보 검색 → Cross-Encoder로 리랭킹.`,
  },
];
