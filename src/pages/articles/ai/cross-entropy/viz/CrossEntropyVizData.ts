export const STEPS = [
  { label: '정답 분포 P (one-hot)', body: '고양이=1, 개=0, 새=0 — 정답은 "고양이"' },
  { label: '모델 출력 Q (softmax)', body: 'Q(고양이)=0.7, Q(개)=0.2, Q(새)=0.1 — 모델의 예측 확률' },
  { label: 'CE 손실 계산', body: 'H(P,Q) = -1·log(0.7) - 0·log(0.2) - 0·log(0.1) ≈ 0.36' },
  { label: '학습 → Q가 P에 가까워짐', body: 'Q(고양이)→0.95 → CE≈0.05로 감소 — 모델이 정답에 수렴' },
];

export const P_C = '#6366f1';
export const Q_C = '#f59e0b';
export const CE_C = '#ef4444';
export const OK_C = '#10b981';

export const LABELS = ['고양이', '개', '새'];
export const P_VALS = [1, 0, 0];
export const Q_VALS = [
  [0.7, 0.2, 0.1],
  [0.7, 0.2, 0.1],
  [0.7, 0.2, 0.1],
  [0.95, 0.03, 0.02],
];
