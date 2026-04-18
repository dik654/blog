export const STEPS = [
  {
    label: '정보이론 해석 — 평균 bits',
    body: 'Cross-Entropy: H(P,Q) = −Σ P(x) log Q(x)\n"정답 분포 P에서 나온 데이터를 예측 분포 Q로 인코딩할 때 필요한 평균 bits."\nP = 정답(one-hot), Q = softmax 출력(예측 확률).\nP가 one-hot [0,0,1,0]이면 정답 클래스(index 2)만 P(x)=1이므로:\nH(P,Q) = −1·log Q(정답) = −log Q(정답) — 나머지 항 전부 소멸.\nEntropy H(P)=0(one-hot은 불확실성 없음)이므로\nCE = H(P) + KL(P||Q) = KL(P||Q) — CE 최소화 = KL 최소화 = Q→P.',
  },
  {
    label: '구체 계산 예시 — 3가지 예측 품질',
    body: 'True = [0,0,1,0] (정답: cat, index 2), Loss = −log Q(cat)\n① 괜찮은 예측: Q=[0.1, 0.2, 0.6, 0.1] → L=−log(0.6)≈0.51\n② 랜덤 예측: Q=[0.25, 0.25, 0.25, 0.25] → L=−log(0.25)≈1.39\n③ 완벽 예측: Q=[0, 0, 1, 0] → L=−log(1.0)=0\n−log 함수의 핵심: Q(정답)↑ → loss↓(0에 수렴)\nQ(정답)→0 → loss→∞ (급격한 벌점, 기울기도 1/Q로 폭증)\n확률이 0.5→0.1로 떨어지면 loss는 0.69→2.30으로 3배 이상 증가.\n이 비선형적 벌점이 모델을 정답 확률 높이는 쪽으로 강하게 밀어냄.',
  },
  {
    label: 'Gradient 특성 — Self-regulating',
    body: 'Softmax+CE의 gradient: ∂L/∂logitₖ = Q(k) − yₖ\n정답 클래스(yₖ=1): gradient = Q(k) − 1\n- 틀릴 때(Q≈0): gradient ≈ −1 → 강한 업데이트\n- 맞을 때(Q≈1): gradient ≈ 0 → 미세 조정\n구체 값: Q(정답)=0.05 → |grad|=0.95, Q=0.5 → |grad|=0.50, Q=0.95 → |grad|=0.05\n자동 조절(self-regulating): 별도의 learning rate 스케줄링 없이도\n틀린 샘플은 크게, 맞는 샘플은 작게 업데이트 → 학습 안정성 확보.\nMSE loss의 gradient는 이런 자동 조절 없음 — CE가 분류에 적합한 이유.',
  },
];

export const C = {
  info: '#3b82f6',
  good: '#10b981',
  bad: '#ef4444',
  perfect: '#8b5cf6',
  dim: '#94a3b8',
};
