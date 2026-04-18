export const STEPS = [
  {
    label: '① sigmoid 함수 — 출력 범위 [0,1], 미분값 최대 0.25',
    body: 'σ(x) = 1 / (1 + e^{-x}). 출력 범위 (0, 1) — 확률이나 정규화 픽셀값 표현에 적합.\n대표값: σ(-5)≈0.007, σ(-2)≈0.119, σ(0)=0.5, σ(1)≈0.731, σ(2)≈0.881, σ(5)≈0.993.\n미분: σ\'(x) = σ(x)(1-σ(x)). 최대값 = σ\'(0) = 0.25. x=0에서 기울기가 가장 크고 양 끝에서 0 수렴.\n포화 문제: |x|>5이면 σ\'(x) < 0.007. 역전파에서 이 값이 곱해져 층이 깊을수록 기울기 소실(vanishing gradient).\n5층 sigmoid 네트워크: 기울기 ∝ 0.25^5 ≈ 0.001. 10층이면 0.25^{10} ≈ 10^{-6} — 사실상 학습 정지.\n해결: 은닉층에 ReLU(x>0이면 기울기=1) 사용. 출력층만 sigmoid(픽셀값 [0,1] 매핑).',
  },
  {
    label: '② 은닉층 활성화 함수 비교',
    body: 'ReLU(x) = max(0, x). 기울기: x>0이면 1, x≤0이면 0. 단순하고 빠르며 기울기 소실 없음.\nLeakyReLU(x) = max(αx, x), α=0.01. 음수 영역에서도 작은 기울기 유지 → Dead ReLU 문제 방지.\nGELU(x) = x · Φ(x). Φ는 정규분포 CDF. Transformer/BERT 표준. 부드러운 비선형성.\n은닉층 선택: ReLU(일반), LeakyReLU(심층), GELU(Transformer). sigmoid/tanh는 은닉층에 비추천.\n출력층 선택: Sigmoid — 이미지 [0,1]. Tanh — 범위 [-1,1]. Linear — 회귀(제한 없는 실수).\n조합 예시: AE 은닉층 ReLU + 출력층 Sigmoid가 MNIST/CIFAR에서 가장 일반적인 구성.',
  },
  {
    label: '③ 텐서 연산으로 일반화',
    body: 'Encoder: z = σ(W_enc · x + b_enc). W_enc ∈ R^{k×n}, x ∈ R^n, b_enc ∈ R^k → z ∈ R^k.\nDecoder: x_hat = σ(W_dec · z + b_dec). W_dec ∈ R^{n×k}, z ∈ R^k → x_hat ∈ R^n.\n본문 예시(k=1, n=2): W_enc = [0.5, 0.8], x = [0.7, 0.3] → z = σ(0.5×0.7 + 0.8×0.3) = σ(0.59) ≈ 0.643.\nDecoder: W_dec = [0.6, 0.4]ᵀ, z = 0.643 → x_hat = [σ(0.386), σ(0.257)] ≈ [0.595, 0.564].\n배치 처리: X ∈ R^{B×n} → Z = σ(X·W_encᵀ + b_enc) ∈ R^{B×k}. B=64 배치를 한 번에 행렬 곱으로 처리.\nGPU 가속의 핵심: 배치 단위 행렬 곱 = GEMM(General Matrix Multiply). cuBLAS로 최적화.',
  },
  {
    label: '④ 손실 계산 — MSE',
    body: 'MSE = (1/n) Σ_{i=1}^{n} (x_i - x_hat_i)². 각 차원의 오차 제곱 평균.\n본문 예시: x=[0.7, 0.3], x_hat=[0.595, 0.564]. L = ((0.7-0.595)² + (0.3-0.564)²) / 2 = (0.011 + 0.070) / 2 = 0.0431.\n학습 초기: MSE ≈ 0.1~0.3 (랜덤 출력). 수렴 후: MSE ≈ 0.005~0.02 (시각적으로 원본과 유사).\nMSE=0이면 완벽 복원이지만 실제로는 불가능 — 병목 k가 정보 손실을 강제하므로 항상 잔차 존재.\n학습 곡선 패턴: 처음 5 에포크에서 급격히 감소 → 이후 완만한 수렴. validation loss가 상승하면 early stopping.\nMNIST k=32일 때 최종 MSE ≈ 0.012 → 재구성 이미지에서 숫자 식별 충분. k=2이면 MSE ≈ 0.05.',
  },
];

export const C = {
  sig: '#6366f1',
  relu: '#10b981',
  gelu: '#f59e0b',
  enc: '#6366f1',
  dec: '#10b981',
  lat: '#f59e0b',
  loss: '#ef4444',
  muted: '#94a3b8',
};
