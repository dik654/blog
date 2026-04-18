export const STEPS = [
  {
    label: '훈련 루프 3단계 — Forward / Backward / Update',
    body: '매 배치(batch)마다 3단계 반복:\n① Forward: logits = model(x); loss = criterion(logits, y)\n  — 입력 x를 통과시켜 예측 logits 생성, 정답 y와 비교하여 loss 계산\n② Backward: optimizer.zero_grad(); loss.backward()\n  — 이전 gradient 초기화 후, loss에서 모든 파라미터까지 gradient 역전파\n③ Update: optimizer.step()\n  — 내부: θ = θ − η·∇L (vanilla) 또는 momentum buffer 사용\nη(eta) = learning rate, 보통 0.001~0.01. 너무 크면 발산, 작으면 수렴 느림.\nzero_grad()를 잊으면 gradient가 누적되어 잘못된 업데이트 발생.',
  },
  {
    label: 'Momentum 내부 동작 — gradient의 EMA',
    body: 'Momentum = gradient의 지수 이동 평균(Exponential Moving Average)\nbuf = β × buf + grad — 과거 gradient를 β 비율로 누적\nW = W − lr × buf — buffer 방향으로 파라미터 이동\nβ=0.9: 최근 ~10 step의 gradient 평균 (1/(1−β) ≈ 10)\nβ=0.99: 최근 ~100 step의 gradient 평균 (LLM 훈련에 사용)\n효과: ① noise 상쇄 — 반대 방향 gradient가 서로 cancel\n② 일관된 방향 가속 — 같은 방향이 반복되면 속도 누적\n③ ravine/saddle point 탈출 — 관성으로 좁은 골짜기 빠르게 통과\n수렴 속도 보통 2-3배 향상. β=1이면 overshooting 위험.',
  },
  {
    label: 'Gradient Clipping — Norm 방식',
    body: 'Global Norm Clipping: 전체 gradient 벡터의 L2 norm을 제한.\n3단계 과정:\n① ||g|| = √(Σgᵢ²) 계산 — 모든 파라미터의 gradient를 하나의 벡터로 합산\n② ||g|| > max_norm이면 → g = g × (max_norm / ||g||)로 비례 축소\n③ ||g|| ≤ max_norm이면 → 그대로 사용\n핵심: 방향(direction)은 유지하되 크기(magnitude)만 제한.\nNorm Clipping(주류): clip_grad_norm_(params, 1.0) — L2 norm 기준\nValue Clipping(보조): clip_grad_value_(params, 5.0) — 각 원소 [-5,+5] 클램프\nValue Clipping은 방향 왜곡 가능하여 덜 사용.',
  },
  {
    label: 'Clipping 적용 시점 — backward 후, step 전',
    body: '순서 필수: loss.backward() → clip_grad_norm_() → optimizer.step()\n① backward(): 모든 파라미터의 .grad에 gradient 저장\n② clip_grad_norm_(): .grad 값을 in-place로 축소\n③ step(): 축소된 .grad로 파라미터 갱신\n순서가 틀리면 clipping 효과 없음(step 후 clip은 의미 없음).\nTransformer 계열 표준값: max_norm = 1.0\nBERT(1.0), GPT(1.0), LLaMA(1.0), T5(1.0) — 모두 동일.\n왜 1.0? gradient norm이 평균적으로 0.1~1.0 범위이므로\n1.0은 정상 gradient는 그대로 두고 비정상적 폭발(>1.0)만 차단.',
  },
];

export const C = {
  train: '#f59e0b',
  grad: '#8b5cf6',
  clip: '#ef4444',
  safe: '#10b981',
  code: '#3b82f6',
  dim: '#94a3b8',
};
