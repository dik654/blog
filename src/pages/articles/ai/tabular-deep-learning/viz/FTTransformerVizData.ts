import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  num: '#3b82f6',
  cat: '#8b5cf6',
  cls: '#ef4444',
  attn: '#f59e0b',
  ffn: '#10b981',
  output: '#10b981',
  layer: '#64748b',
};

export const FEATURES = [
  { name: '나이', type: 'num', value: '32' },
  { name: '소득', type: 'num', value: '5200' },
  { name: '직업', type: 'cat', value: 'IT' },
  { name: '지역', type: 'cat', value: '서울' },
  { name: '등급', type: 'cat', value: 'Gold' },
];

export const STEPS: StepDef[] = [
  {
    label: 'Feature Tokenizer — 각 피처를 d차원 토큰으로 변환',
    body: '수치형: x_j · W_j + b_j (피처별 선형 투영, 차원 R¹ → R^d)\n범주형: 룩업 테이블에서 임베딩 벡터 추출 (고카디널리티에도 저차원 표현)\n핵심: 모든 피처가 동일한 d차원 공간에 놓임 → Transformer 입력 가능.',
  },
  {
    label: '[CLS] 토큰 추가 — 예측을 위한 집약 토큰',
    body: '학습 가능한 [CLS] 토큰을 피처 토큰 시퀀스 앞에 추가.\nNLP의 BERT와 동일한 전략 — [CLS]가 모든 피처 정보를 self-attention으로 집약.\n최종 예측은 [CLS] 토큰의 출력만 사용 → 나머지 토큰은 보조 역할.',
  },
  {
    label: 'Transformer Encoder — 피처 간 상호작용 학습',
    body: 'L개의 Transformer 블록: Multi-Head Self-Attention + FFN.\n각 피처 토큰이 다른 모든 피처 토큰과 attention 교환.\n"나이"와 "소득"의 관계, "직업"과 "지역"의 상호작용을 자동 포착.\nGBM의 수동 피처 교차(cross-feature)를 대체.',
  },
  {
    label: 'FT-Transformer가 효과적인 이유',
    body: 'Attention 맵이 피처 중요도를 직접 반영 — 해석 가능성 확보.\n피처 순서에 불변(permutation invariant) — 테이블 데이터 특성에 부합.\nGorishniy et al. (2021): 11개 벤치마크 중 6개에서 GBM과 동등 이상.',
  },
];
