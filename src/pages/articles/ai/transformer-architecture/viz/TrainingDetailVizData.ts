export const C = {
  warm: '#f59e0b',
  adam: '#6366f1',
  mix: '#10b981',
  grad: '#0ea5e9',
  clip: '#ef4444',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① Warmup + Cosine Decay -- 학습률 스케줄',
    body: 'Warmup: lr = peak_lr x (step / warmup_steps). 선형 증가.\nCosine Decay: lr = min_lr + 0.5(peak_lr - min_lr)(1 + cos(pi x progress)).\n전형적 설정: warmup=2000, total=100K, peak=1e-4, min=1e-5.\n왜 Warmup? 초기 큰 lr → attention 불안정.\nAdam의 2nd moment 추정이 초기엔 부정확.\n작은 lr로 시작해 모멘텀 추정을 안정화한 뒤 증가.',
  },
  {
    label: '② AdamW -- Weight Decay 분리',
    body: 'Adam: m = beta1·m + (1-beta1)·g, v = beta2·v + (1-beta2)·g^2.\nbeta1=0.9, beta2=0.95(LLM) 또는 0.999(소형).\nAdamW: W = W - lr x (grad + weight_decay x W).\n기존 Adam은 weight decay가 적응 학습률에 의해 왜곡.\nAdamW가 이를 분리 — L2 정규화 정확히 적용.\nweight_decay=0.1(LLM), 0.01(일반). eps=1e-8.',
  },
  {
    label: '③ Mixed Precision -- FP16/BF16 혼합',
    body: 'FP32: 2B params → 8GB 메모리.\nFP16: 같은 모델 → 4GB (2배 절감).\nBF16: FP16보다 넓은 지수 범위 — overflow 감소, 권장.\n구현: forward FP16, gradient FP16, optimizer FP32.\nloss scaling으로 FP16 underflow 방지.\nA100/H100 BF16 텐서 코어 → 연산 속도도 2배.',
  },
  {
    label: '④ Gradient 기법 -- Accumulation + Clipping',
    body: 'Gradient Accumulation: 작은 미니배치 N개의 gradient 합산.\nfor micro_batch: loss = model(mb)/N, loss.backward().\nN개 후 optimizer.step() — 큰 배치 시뮬레이션.\nGradient Clipping: norm=1.0 — gradient 폭발 방지.\nDropout=0.1, Label Smoothing=0.1 표준.\nCheckpointing: 중간 활성값 재계산 — 메모리 40% 절감.',
  },
];
