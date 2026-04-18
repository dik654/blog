export const STEPS = [
  {
    label: '① 5가지 주요 활용 — 노이즈 제거부터 추천까지',
    body: '노이즈 제거(DAE): 의료 CT/MRI 영상의 방사선 노이즈 제거. PSNR 30dB → 38dB 향상. BM3D 대비 +2~3dB.\n이상 탐지: 정상 데이터만으로 학습 → 이상 시 reconstruction error 급증. 반도체 웨이퍼, 네트워크 침입 탐지.\n데이터 압축: z 벡터만 저장. 784→32 = 24.5배 압축. JPEG 대비 학습 기반이라 도메인 특화 압축 가능.\n결측치 보완: 관측된 부분만 입력 → AE가 전체 복원. 추천 시스템의 빈 칸 예측과 동일 원리.\n추천 시스템: user-item 행렬 → AE로 잠재 factor 추출 → 미시청 아이템 점수 예측. AutoRec(Sedhain 2015).',
  },
  {
    label: '② 이상 탐지 원리 — 정상 학습, 이상 감지',
    body: '학습: 정상 데이터 X_normal로만 AE 학습. 인코더가 "정상 매니폴드"의 구조를 학습.\n추론: 새 입력 x → 복원 x_hat → anomaly_score = ||x - x_hat||². 정상이면 낮고, 이상이면 높음.\n임계값 설정: τ = μ_score + k·σ_score. k=3이면 99.7% 정상 범위. k=2이면 95% 범위.\n이유: 이상 데이터는 정상 매니폴드에서 벗어남 → AE가 본 적 없는 패턴 → 복원 실패 → 높은 오차.\n실제 사례: 신용카드 사기 — 정상 거래 MSE=0.002, 사기 MSE=0.045. AUC-ROC 0.95+.\n장점: 이상 라벨 불필요(비지도), 새로운 유형의 이상도 감지 가능, 해석 가능(어느 차원에서 오차가 큰지).',
  },
  {
    label: '③ 현대 AE 기반 모델 — Stable Diffusion, MAE, BERT',
    body: 'Stable Diffusion: VAE 인코더로 512×512×3 → 64×64×4 latent(64배 압축) → latent 공간에서 U-Net diffusion.\n압축 이유: 픽셀 공간 diffusion은 O(512²) 연산, latent 공간은 O(64²) → 64배 빠른 학습/추론.\nMAE(Masked AE, He 2022): ViT 패치 196개 중 75%(147개) 랜덤 마스킹 → 나머지 49개로 전체 복원.\nMAE 사전학습 효과: ImageNet fine-tuning ViT-Large 87.8%(scratch) → 85.9%(MAE pretrain) → scratch 대비 16배 적은 labeled data로 동등.\nBERT(Devlin 2018): 15% 토큰 [MASK] 대체 → 원래 토큰 예측. 사실상 텍스트 Denoising AE.\nVQ-VAE → DALL-E 1: 이미지를 32×32 이산 코드(8192 코드북)로 변환 → Transformer로 자기회귀 생성.',
  },
  {
    label: '④ 실무 선택 가이드',
    body: '데이터 압축/차원 축소만 필요 → Vanilla AE. 구현 간단, 학습 빠름. scikit-learn 수준의 전처리.\n잠재 공간 탐색/보간 → VAE. 연속적 잠재 공간 보장. 약물 분자 최적화, 디자인 탐색.\n고품질 이미지 생성 → Diffusion(Latent Diffusion). VAE보다 샘플 품질 높지만 추론 느림(50~1000 step).\n대규모 사전학습 → MAE(비전), BERT/MLM(텍스트). 비라벨 데이터 활용 → fine-tuning 효율 극대화.\n이상 탐지 → Vanilla AE 또는 VAE. VAE는 잠재 분포의 likelihood로 이상 점수 계산 가능.\n결정 트리: 생성이 필요한가? → Yes: VAE/Diffusion. No: 해석 필요? → Yes: Sparse AE. No: Vanilla/DAE.',
  },
];

export const C = {
  denoise: '#10b981',
  anomaly: '#ef4444',
  compress: '#6366f1',
  impute: '#f59e0b',
  recsys: '#8b5cf6',
  sd: '#06b6d4',
  mae: '#ec4899',
  vqvae: '#f59e0b',
  bert: '#10b981',
  muted: '#94a3b8',
};
