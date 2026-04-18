export const STEPS = [
  {
    label: '① Denoising AE + Sparse AE — 제약으로 더 강한 표현',
    body: 'DAE(Denoising AE, Vincent 2008): 입력 x에 노이즈 추가 → x_corrupt = x + N(0, σ²). σ=0.3~0.5.\n학습 목표: min ||x - g(f(x_corrupt))||². 오염된 입력에서 원본 복원 → 단순 복사(identity) 학습 불가능.\nDAE가 학습하는 것: 데이터 매니폴드의 구조. 노이즈 방향 = 매니폴드에 수직인 방향.\nSparse AE: 잠재 벡터 z의 대부분이 0에 가깝도록 제약. L = reconstruction + λ·Σ|z_i|. λ=0.001~0.01.\n목표 활성도 ρ=0.05 → 100개 잠재 뉴런 중 평균 5개만 활성. KL(ρ||ρ_hat)로 penalize.\n해석 가능 특징: Sparse AE의 각 잠재 뉴런이 특정 패턴(엣지 방향, 곡선, 구석)에 대응. 최근 SAE(Sparse Autoencoder)로 LLM 해석.',
  },
  {
    label: '② Contractive AE + VAE — invariant/생성',
    body: 'CAE(Contractive AE, Rifai 2011): L = reconstruction + λ·||J_f(x)||²_F. J_f = df/dx ∈ R^{k×n}.\nJacobian norm 패널티: 입력의 작은 변동 → 잠재 표현 변화 최소화. 지역적 불변성(local invariance) 학습.\nDAE vs CAE: DAE는 확률적 노이즈 기반, CAE는 해석적 정규화. 이론적으로 동등한 효과(Alain & Bengio 2014).\nVAE(Variational AE, Kingma 2013): 인코더가 μ(x), log σ²(x) 출력 → z = μ + σ·ε, ε~N(0,1) (reparameterization trick).\nVAE 손실: L = E_q[log p(x|z)] - KL(q(z|x)||p(z)). reconstruction + KL divergence. β-VAE: β·KL로 분리도 조절.\nKL term이 잠재 공간을 N(0,I)에 가깝게 유지 → 연속적이고 규칙적인 잠재 공간 → 샘플링으로 새 데이터 생성.',
  },
  {
    label: '③ 변형별 특성 비교표',
    body: 'Vanilla AE: 단순 압축+복원. k<n 필수. 빠르지만 잠재 공간 구조 무보장.\nDenoising AE: 노이즈 강건성. k≥n도 가능. 사전학습(BERT의 MLM)에 영감.\nSparse AE: L1/KL 제약. 해석 가능 특징. SAE로 GPT 내부 해석 연구 활발.\nVAE: 확률적 잠재 공간. 생성 가능. ELBO 최적화. 이미지/분자/음악 생성.\nVQ-VAE(van den Oord 2017): 이산 코드북 z ∈ {e₁,...,e_K}. K=512~8192. DALL-E 1의 이미지 토큰화.\nMAE(He 2022): 75% 패치 랜덤 마스킹 → 나머지로 복원. ViT 사전학습. ImageNet linear probe 75.8%.',
  },
  {
    label: '④ 선택 가이드 + 조합 사례',
    body: '차원 축소/시각화 → Vanilla AE(k=2~3). PCA 대비 비선형 구조 포착. 학습 비용 낮음.\n노이즈 강건 표현 → DAE. 의료영상(CT 노이즈), 음성(배경 소음) 전처리에 효과적.\n해석 가능 특징 추출 → Sparse AE. 뉴런 과학, LLM 해석(Anthropic SAE), 추천 시스템.\n새 데이터 생성 → VAE(연속), VQ-VAE(이산). 약물 분자 생성, 음악 생성, 얼굴 편집.\n대규모 사전학습 → MAE/BERT(MLM). 비라벨 데이터가 풍부할 때. downstream fine-tuning으로 연결.\n조합 예시: Sparse + Denoising(강건+해석), β-VAE + Perceptual Loss(생성 품질+분리), VQ-VAE + Transformer(이산 코드 자기회귀 생성).',
  },
];

export const C = {
  dae: '#10b981',
  sparse: '#f59e0b',
  cae: '#8b5cf6',
  vae: '#ec4899',
  vqvae: '#06b6d4',
  mae: '#ef4444',
  vanilla: '#6366f1',
  muted: '#94a3b8',
};
