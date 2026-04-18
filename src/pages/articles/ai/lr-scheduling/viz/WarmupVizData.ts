export const STEPS = [
  {
    label: 'Linear Warmup — 0에서 시작하는 안전장치',
    body: '초기 가중치는 랜덤 → gradient가 불안정하고 크기가 불규칙.\n이 상태에서 큰 LR을 바로 적용하면 파라미터가 "잘못된 방향"으로 크게 이동.\nWarmup: η를 0에서 η_target까지 N step 동안 선형 증가.\nη_t = η_target × (t / warmup_steps)\n초반 작은 LR로 gradient 통계가 안정화된 후 본격 학습 시작.',
  },
  {
    label: 'Transformer에서 Warmup이 필수인 이유',
    body: 'Adam의 2nd moment(분산 추정)가 초기에 부정확.\nAdaptive LR = grad / sqrt(v_t) — v_t가 0에 가까우면 실질 LR이 폭발.\nBatch Norm 없음 → Layer Norm만으로는 초기 gradient 폭을 제어 못함.\nAttention score가 초기에 uniform에 가까워 gradient가 noisy.\nOriginal Transformer(2017): warmup_steps=4000이 표준.\nBERT: warmup=10000 step, GPT-3: warmup=375 step (큰 배치).',
  },
  {
    label: 'Warmup + Cosine Decay — 2024 표준 조합',
    body: 'Phase 1 (Warmup): 0 → η_max, linear, 전체의 5~10%.\nPhase 2 (Cosine Decay): η_max → η_min, cosine, 나머지 90~95%.\nLLaMA-2: warmup=2000 step + cosine → η_min=η_max×0.1.\nViT: warmup=10000 step + cosine → η_min=0.\n수식: warmup 구간 η_t = η_max×(t/T_w), 이후 η_t = η_min + 0.5(η_max−η_min)(1+cos(π(t−T_w)/(T−T_w)))',
  },
  {
    label: '기타 Warmup 변형 & Decay 조합',
    body: 'Exponential Warmup: η_t = η_max × (1 − e^(−t/τ)) — 처음 가파르게, 끝에 완만.\nInverse Sqrt Decay: η_t = η_max / sqrt(t) — Transformer 원 논문의 schedule.\n수식: η_t = d_model^(-0.5) × min(t^(-0.5), t × warmup^(-1.5))\nPolynomial Decay: η_t = (η_max−η_min)×(1−t/T)^p + η_min — p=1이면 linear.\nR-Drop, WSD(Warmup-Stable-Decay): warmup 후 일정 구간 유지 → 마지막에 급감.\n선택 가이드: CV=Cosine, NLP/LLM=Warmup+Cosine, 짧은 학습=OneCycle.',
  },
];

export const C = {
  warmup: '#ef4444',
  decay: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  dim: '#94a3b8',
};
