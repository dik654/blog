export const STEPS = [
  {
    label: '① 손실 함수 선택 — MSE / BCE / Perceptual',
    body: 'MSE = (1/n) Σ(x_i - x_hat_i)². 가정: 오차가 가우시안 분포. 실수 범위 데이터에 적합. 이상치에 민감.\nBCE = -(1/n) Σ[x_i·log(x_hat_i) + (1-x_i)·log(1-x_hat_i)]. 픽셀 [0,1]에서 sigmoid 출력과 수학적 궁합.\nBCE가 MSE보다 MNIST에서 더 날카로운 재구성 — 이유: BCE가 0/1 근처에서 더 강한 gradient 제공.\nPerceptual Loss: L = ||VGG(x) - VGG(x_hat)||². VGG 네트워크 중간층의 특징 벡터를 비교.\n인간 시각 품질 우수 — MSE는 픽셀 단위 평균이라 blurry, Perceptual은 구조적 유사성 포착.\nSSIM(Structural Similarity): 밝기, 대비, 구조 세 요소 비교. 범위 [0,1]. 평가 지표로 많이 사용.',
  },
  {
    label: '② 손실 함수 선택 기준',
    body: '이미지 [0,1] 정규화 → BCE + Sigmoid 출력. MNIST, CelebA, 의료영상에서 표준.\n실수 범위 데이터(오디오 파형, 센서값) → MSE + Linear 출력. 정규화 없이 원래 스케일 유지.\n이미지 품질이 최우선(얼굴 생성, super-resolution) → Perceptual + SSIM 조합. VGG-16 conv3_3 특징 추출.\n이상치가 많은 데이터(금융, 로그) → MAE = (1/n)Σ|x_i - x_hat_i| 또는 Huber Loss.\nHuber(δ): |error|<δ이면 MSE, ≥δ이면 MAE. δ=1.0이 기본. 이상치에 강건하면서 미분 가능.\n실무: 여러 손실 조합이 흔함. L_total = λ₁·MSE + λ₂·Perceptual + λ₃·KL. 가중치 λ를 하이퍼파라미터로 조정.',
  },
  {
    label: '③ 역전파 체인룰 — 디코더 → 인코더 순서',
    body: '① 출력 오차: dL/dx_hat = 2(x_hat - x)/n. MSE의 미분 — 각 출력 뉴런의 오차 신호.\n② 디코더 기울기: δ_dec = dL/dx_hat ⊙ σ\'(a_dec). a_dec는 활성화 전 값. ⊙는 원소별 곱.\n③ 디코더 가중치: dL/dW₂ = δ_dec · zᵀ. dL/db₂ = δ_dec. 잠재 벡터 z가 입력 역할.\n④ 잠재층 오차: dL/dz = W₂ᵀ · δ_dec. 디코더 가중치를 전치하여 오차를 인코더로 전파.\n⑤ 인코더 가중치: δ_enc = dL/dz ⊙ σ\'(a_enc). dL/dW₁ = δ_enc · xᵀ. dL/db₁ = δ_enc.\n총 4개 파라미터 행렬(W₁, b₁, W₂, b₂) 동시 업데이트. PyTorch에서 loss.backward() 한 줄이 이 전체를 자동 수행.',
  },
  {
    label: '④ 파라미터 업데이트 + 실무 팁',
    body: 'SGD 업데이트: W ← W - η·∇W. η(학습률)가 너무 크면 발산, 너무 작으면 수렴 느림.\nAdam optimizer: m_t = β₁m_{t-1} + (1-β₁)g_t, v_t = β₂v_{t-1} + (1-β₂)g_t². W ← W - η·m_hat/(√v_hat+ε).\nAdam 기본값: β₁=0.9, β₂=0.999, ε=1e-8, lr=1e-3. 모멘텀(m) + 적응적 학습률(v)로 빠른 수렴.\n초기화: Xavier — Var(W) = 2/(n_in+n_out). sigmoid/tanh용. He — Var(W) = 2/n_in. ReLU용.\nEarly stopping: validation loss가 patience(=10) 에포크 연속 개선 없으면 학습 중단. 과적합 방지.\nBatch size: 64~256 권장. 작으면 노이즈↑수렴↓, 크면 메모리↑일반화↓. 학습률과 함께 조정.',
  },
];

export const C = {
  mse: '#6366f1',
  bce: '#10b981',
  perc: '#f59e0b',
  mae: '#8b5cf6',
  grad: '#ef4444',
  enc: '#6366f1',
  dec: '#10b981',
  muted: '#94a3b8',
};
