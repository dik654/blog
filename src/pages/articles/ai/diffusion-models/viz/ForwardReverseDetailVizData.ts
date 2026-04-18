export const STEPS = [
  {
    label: 'Forward: 단일 스텝 공식',
    body: 'x_t = √(1−β_t) · x_{t-1} + √β_t · ε_t, ε_t ~ N(0,I).\nα_t = 1 − β_t, α&#772;_t = Π α_s (누적곱).\n핵심 트릭: q(x_t|x_0) = N(√α&#772;_t · x_0, (1−α&#772;_t)·I).\n임의 시점 t의 x_t를 x_0에서 직접 샘플링 가능!',
  },
  {
    label: 'Reverse: 노이즈 예측 학습',
    body: 'Simple Loss: L = E[‖ε − ε_θ(x_t, t)‖²].\nt ~ Uniform(1,T), ε ~ N(0,I), x_t = √α&#772;_t·x_0 + √(1−α&#772;_t)·ε.\n각 batch에서 t를 랜덤 선택하여 학습.\n수렴 시 ε_θ가 각 시점의 노이즈를 정확히 예측.',
  },
  {
    label: '샘플링 알고리즘',
    body: 'x_T ~ N(0,I)에서 시작.\nfor t = T → 1: ε&#770; = ε_θ(x_t, t), x_{t-1} = denoise(x_t, ε&#770;, t).\nDDIM: 결정론적, 50 스텝 충분.\nDPM-Solver: 20 스텝. Consistency Models: 1~4 스텝.',
  },
  {
    label: '노이즈 스케줄 비교',
    body: 'Linear: β₁=0.0001 → β_T=0.02 — 초기 노이즈 추가가 빠름.\nCosine: α&#772;_t = cos²(π/2·(t/T+s)/(1+s)) — 부드러운 전환, 품질 개선.\nSD 학습: linear. GLIDE/Imagen: cosine.\n최근: sigmoid schedule, flow matching.',
  },
];
