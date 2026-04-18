import type { StepDef } from '@/components/ui/step-viz';

export const C = { dot: '#6366f1', scaled: '#f59e0b', general: '#10b981', muted: '#64748b' };

/* Variance demonstration values */
export const VARIANCE_EXAMPLES = [
  { dk: 64, sqrt: 8, raw: 4.96, scaled: 0.62 },
  { dk: 128, sqrt: 11.3, raw: 9.8, scaled: 0.87 },
  { dk: 512, sqrt: 22.6, raw: 21.1, scaled: 0.93 },
];

/* Softmax saturation demo */
export const SOFT_LARGE = [0.9998, 0.0001, 0.0001];
export const SOFT_SMALL = [0.48, 0.26, 0.26];

/* Score function comparison */
export const SCORE_TABLE = [
  { name: 'Dot', formula: 'QᵀK', params: 0, speed: '★★★' },
  { name: 'Scaled', formula: 'QᵀK/√d', params: 0, speed: '★★★' },
  { name: 'General', formula: 'QᵀWK', params: 1, speed: '★★' },
  { name: 'Concat', formula: 'vᵀtanh(W[Q;K])', params: 2, speed: '★' },
];

export const STEPS: StepDef[] = [
  {
    label: '√dₖ 스케일링 — 분산 분석',
    body: 'Qᵢ, Kᵢ ∼ N(0,1) 독립 가정 → Q·K의 분산 = dₖ.\ndₖ=64이면 내적 값이 ±8 범위로 펼쳐진다.\n큰 값 → softmax가 one-hot에 수렴 → 기울기 거의 0.\n해결: Q·K/√dₖ → 분산 = dₖ/dₖ = 1로 정규화.\nVaswani: "large dₖ pushes softmax into saturated regions".',
  },
  {
    label: 'Softmax 포화 시각화',
    body: '입력 [10, 1, 1] → softmax [0.9998, 0.0001, 0.0001]. 거의 one-hot.\n입력 [1, 0.1, 0.1] → softmax [0.48, 0.26, 0.26]. 부드러운 분포.\n포화 상태에서 ∂softmax/∂input ≈ 0 → 학습 정지.\n스케일링 후 값이 작아져 부드러운 영역 유지.\ndₖ=64: raw=4.96 → /8 = 0.62. dₖ=512: raw=21.1 → /22.6 = 0.93.',
  },
  {
    label: 'Score 함수 4종 비교',
    body: 'Dot: QᵀK — 파라미터 0개, 최고 속도, 같은 차원 필수.\nScaled: QᵀK/√dₖ — Transformer 표준, 큰 차원에서 필수.\nGeneral: QᵀWK — W가 유사도 함수 학습, 다른 차원 허용.\nConcat: vᵀtanh(W[Q;K]) — 가장 유연하지만 느림.\n실무: 대부분 Scaled dot, 소규모 RNN은 Additive.',
  },
  {
    label: 'Luong의 추가 기여: Global vs Local',
    body: 'Global: 모든 소스 위치 참조 — 표준 방식.\nLocal: 윈도우 내 위치만 참조 — 긴 시퀀스에서 효율적.\nInput-feeding: 이전 context vector를 다음 디코더 입력에 concat.\n과거 attention 결정을 기억하게 하여 정렬 일관성 향상.\nLuong dot → Scaled dot (Transformer) → Multi-head로 계승.',
  },
];
