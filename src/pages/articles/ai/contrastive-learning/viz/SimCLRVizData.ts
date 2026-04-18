export const STEPS = [
  {
    label: '① SimCLR 파이프라인: Augmentation → Encoder → Projection → Loss',
    body: '같은 이미지 x에서 랜덤 augmentation t, t\'를 적용해 x_i, x_j 생성 → positive pair.\nResNet-50 인코더로 2048차원 특징 h 추출 → MLP projection head로 128차원 z 매핑.\n학습 시 z 공간에서 InfoNCE loss 적용. 추론 시 projection head를 제거하고 h를 사용.',
  },
  {
    label: '② Positive / Negative Pair 구성',
    body: '배치 N개 이미지 → 2N개 augmented view. 같은 이미지의 두 view = 1 positive pair.\n나머지 2(N-1)개 = negative. N=256이면 positive 1쌍 vs negative 510개.\n다양한 augmentation이 핵심: 랜덤 크롭+리사이즈, 색상 왜곡, 가우시안 블러, 수평 뒤집기.',
  },
  {
    label: '③ InfoNCE Loss: Temperature-scaled Cross-Entropy',
    body: 'L(i,j) = -log( exp(sim(z_i, z_j)/τ) / Σ_{k≠i} exp(sim(z_i, z_k)/τ) ).\nsim(u,v) = u·v/(||u||·||v||) — cosine similarity. τ=0.1이 기본값.\nτ가 작을수록 유사도 차이가 증폭되어 hard negative에 집중. τ=0.5면 easy/hard 구분이 약해짐.',
  },
  {
    label: '④ 배치 크기의 영향: 256 vs 4096 vs 8192',
    body: 'N=256: negative 510개 → ImageNet linear eval 64.6%. 다양성 부족.\nN=4096: negative 8190개 → 74.2%. 충분한 다양성.\nN=8192: negative 16382개 → 76.5%. 수확 체감 시작. TPU v3 32코어 필요.\nMoCo는 momentum queue로 배치 크기와 무관하게 65536 negative 유지 → 소규모 GPU에서 대안.',
  },
];

export const C = {
  img: '#6366f1',
  enc: '#3b82f6',
  proj: '#8b5cf6',
  pos: '#10b981',
  neg: '#ef4444',
  tau: '#f59e0b',
  muted: '#94a3b8',
};
