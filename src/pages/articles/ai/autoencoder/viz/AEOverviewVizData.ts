export const STEPS = [
  {
    label: '① 오토인코더 수학적 정의',
    body: '인코더 f_θ: R^n → R^k, 디코더 g_φ: R^k → R^n. 파라미터 θ(인코더 가중치), φ(디코더 가중치).\n학습 목표: min_{θ,φ} E_{x~p_data} [L(x, g_φ(f_θ(x)))]. L은 재구성 손실(MSE 또는 BCE).\n병목층 k << n이 핵심: k=10, n=784(MNIST)이면 압축률 78.4배. 정보를 버려야 하므로 핵심만 보존.\n만약 k ≥ n이면 항등 함수(identity) 학습 가능 → 정보 압축이 일어나지 않아 무의미.\n자기지도학습(Self-supervised): 라벨 불필요. 입력 x 자체가 정답(target). 대규모 비라벨 데이터 활용 가능.',
  },
  {
    label: '② 구조: 입력층 → 인코더 → 병목층 → 디코더 → 출력층',
    body: 'MNIST 예시: 784(28×28) → 256 → 64 → 10(병목) → 64 → 256 → 784. 대칭 구조.\n파라미터 수: W₁(784×256)=200,704 + W₂(256×64)=16,384 + W₃(64×10)=640 + 디코더 동일 ≈ 435K.\n인코더: 784차원 → 10차원으로 점진 압축. 각 층에서 ReLU 활성화로 비선형 매니폴드 학습.\n디코더: 10차원 → 784차원으로 복원. 마지막 층 sigmoid로 출력 [0,1] 범위 → 픽셀값과 대응.\n대칭 구조가 필수는 아님 — 인코더/디코더 깊이를 달리할 수 있으나, 대칭이 학습 안정성에 유리.',
  },
  {
    label: '③ PCA vs 오토인코더 vs VAE vs GAN',
    body: 'PCA: X = UΣVᵀ에서 상위 k개 특이값 유지. 선형 변환만 — 비선형 구조(Swiss Roll 등) 학습 불가.\nAE: 비선형 활성화(ReLU)로 곡면 매니폴드 학습. MNIST reconstruction MSE: PCA(k=30) 0.043 vs AE 0.012.\nVAE: 잠재 변수 z ~ N(μ, σ²). 손실 = reconstruction + KL(q(z|x) || p(z)). 연속 잠재 공간 → 생성 가능.\nGAN: Generator G(z→x)와 Discriminator D(x→[0,1])의 적대적 학습. 인코더 없이 생성.\n핵심 차이: PCA/AE는 압축 목적, VAE는 생성 가능한 압축, GAN은 순수 생성. 목적에 따라 선택.',
  },
  {
    label: '④ Diffusion과의 관계',
    body: 'Diffusion Model: 이미지에 T=1000 단계로 가우시안 노이즈 추가(forward) → 역방향으로 노이즈 제거(reverse) 학습.\nForward: q(x_t|x_{t-1}) = N(x_t; √(1-β_t)·x_{t-1}, β_t·I). β_t는 노이즈 스케줄(0.0001~0.02).\nReverse: p_θ(x_{t-1}|x_t) = N(x_{t-1}; μ_θ(x_t, t), σ_t²·I). 신경망이 μ_θ(노이즈 제거 방향)를 학습.\nStable Diffusion: VAE 인코더로 512×512 → 64×64 latent 압축 → latent 공간에서 diffusion → VAE 디코더로 복원.\n각 denoising step이 사실상 Denoising AE — 노이즈 입력에서 원본 복원 학습. AE의 현대적 확장.\nDAE → VAE → VQ-VAE → Diffusion → Latent Diffusion(SD) 순서로 AE 개념이 생성 모델의 핵심 구성요소로 진화.',
  },
];

export const C = {
  enc: '#6366f1',
  lat: '#f59e0b',
  dec: '#10b981',
  pca: '#8b5cf6',
  vae: '#ec4899',
  gan: '#ef4444',
  diff: '#06b6d4',
  muted: '#94a3b8',
  bg: '#f8fafc',
};
