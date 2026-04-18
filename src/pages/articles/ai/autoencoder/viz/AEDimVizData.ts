export const STEPS = [
  {
    label: '① Linear AE = PCA 증명',
    body: '활성화 함수 없는 AE: z = W_enc·x (인코더), x_hat = W_dec·z (디코더). 합치면 x_hat = W_dec·W_enc·x.\nW = W_dec·W_enc ∈ R^{n×n}는 rank-k 행렬. 이 W의 최적해가 PCA의 상위 k개 주성분 부분공간과 동일.\n증명 핵심(Baldi & Hornik 1989): min_W ||X - WX||_F² 의 해가 X의 공분산 행렬의 상위 k개 고유벡터.\nSVD로 표현: X ≈ U_k Σ_k V_k^T. 인코더 = V_k^T (주성분 방향 사영), 디코더 = V_k (복원).\n의미: Linear AE를 학습하면 gradient descent가 자동으로 PCA 해에 수렴. 비선형 활성화가 AE를 PCA 이상으로 만드는 핵심.\n예시: MNIST에 Linear AE(k=30) 학습 → PCA(k=30)과 동일한 explained variance ≈ 0.95.',
  },
  {
    label: '② PCA vs 비선형 AE — Swiss Roll',
    body: 'Swiss Roll: 3D 공간의 2D 곡면. 점들이 나선 모양으로 분포 — 본질 차원(intrinsic dim)은 2.\nPCA(k=2): 3D→2D 선형 사영. 나선이 겹쳐져 구분 불가. 가까운 점이 먼 점으로, 먼 점이 가까운 점으로.\n비선형 AE(k=2, ReLU): 곡면을 "펼쳐서" 2D 평면에 매핑. 매니폴드 위의 측지선(geodesic) 거리 보존.\n정량 비교: k-NN 분류 정확도 — PCA 2D 72% vs AE 2D 94% (Swiss Roll 색상 기준).\n핵심: 비선형 활성화가 "구부러진 좌표축"을 학습 — 직선 좌표(PCA)로 불가능한 구조 포착.\n실제 데이터도 대부분 비선형 매니폴드: 얼굴 회전, 조명 변화, 필기 스타일 변동 등.',
  },
  {
    label: '③ 매니폴드 가설 — 고차원 데이터의 저차원 구조',
    body: '매니폴드 가설: 고차원 데이터는 저차원 매니폴드 위(또는 근처)에 분포한다.\nMNIST: 784차원 공간(256^784 가능한 이미지)에서 실제 "숫자 이미지"는 극소 부분만 차지.\n랜덤 784차원 벡터를 28×28로 표시하면 → 노이즈. 숫자처럼 보이는 이미지가 나올 확률 ≈ 0.\n본질 차원 추정: PCA explained variance 95% 도달에 k≈30 필요 → intrinsic dim ≈ 10~30.\n왜 중요한가: 매니폴드 가설이 맞다면, 고차원에서 학습하는 것보다 저차원 매니폴드에서 학습하는 것이 효율적.\nAE의 역할: 데이터의 매니폴드 구조를 발견하고, 잠재 공간 z가 매니폴드의 좌표계 역할.',
  },
  {
    label: '④ 잠재 공간의 4가지 활용',
    body: '① 시각화: k=2로 설정 → z를 2D scatter plot. MNIST에서 10개 숫자가 클러스터로 분리. t-SNE/UMAP보다 의미 있는 축.\n② 생성: 잠재 공간에서 z를 샘플링 → 디코더 통과 → 새로운 데이터 생성. VAE는 z ~ N(0,I)에서 샘플링.\n③ 보간: z_interp = (1-α)·z₁ + α·z₂, α ∈ [0,1]. "3"에서 "8"로 부드럽게 변환되는 이미지 시퀀스.\n잠재 공간이 연속적일수록 보간이 자연스러움 — VAE가 Vanilla AE보다 보간 품질 우수.\n④ 이상 탐지: 정상 데이터로 학습 → 이상 데이터 입력 시 reconstruction error 급증. 임계값 τ = μ + 3σ.\n제조 결함: 정상 제품 MSE=0.01, 결함 제품 MSE=0.15. 15배 차이로 명확한 이상 판별.',
  },
];

export const C = {
  pca: '#8b5cf6',
  ae: '#6366f1',
  manifold: '#f59e0b',
  lat: '#10b981',
  muted: '#94a3b8',
  warn: '#ef4444',
};
