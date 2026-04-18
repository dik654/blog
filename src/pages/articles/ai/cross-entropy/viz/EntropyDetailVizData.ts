export const IC = '#6366f1';   // Information Content — 보라
export const EC = '#10b981';   // Entropy — 초록
export const MC = '#f59e0b';   // ML 활용 — 노랑
export const CC = '#3b82f6';   // Conditional — 파랑
export const RC = '#ef4444';   // 강조/경고 — 빨강

export const STEPS = [
  {
    label: 'Information Content — 놀라움의 양',
    body: 'I(x) = -log P(x) — 사건 x가 발생했을 때 얻는 정보량(놀라움)\nP(x)가 낮을수록 I(x)는 커짐: 드문 사건 = 높은 정보량\n예: 동전 앞면 P=0.5 → I=-log₂(0.5)=1 bit\n예: 주사위 1 P=1/6 → I=-log₂(1/6)≈2.58 bits\nP=1이면 I=0 (확실한 사건은 놀라움 없음), P→0이면 I→∞',
  },
  {
    label: 'Shannon Entropy — 놀라움의 기대값',
    body: 'H(P) = -Σ P(x)·log P(x) = E_P[I(x)] — 전체 분포의 평균 놀라움\n균등 분포 → 최대 엔트로피: 동전 H=[0.5,0.5] → 1 bit, 주사위 H=log₂6≈2.58\n결정적 분포 → 최소: P=[1,0,0] → H=0 (불확실성 없음)\n예: P=[0.8,0.2] → H=-(0.8·log₂0.8+0.2·log₂0.2)≈0.72 bits\n0·log0 은 극한값 0으로 정의 (L\'Hopital 규칙으로 확인 가능)',
  },
  {
    label: 'ML에서 Entropy 활용',
    body: '① Decision Tree: Information Gain = H(parent) - Σ(wᵢ·H(childᵢ)) — 엔트로피 감소가 큰 특징으로 분할\n② Cross-Entropy Loss: H(P,Q) = -Σ P(x)·log Q(x) — 모델 Q가 P를 얼마나 잘 표현하나\n③ Maximum Entropy 원리: 제약 외에 가정을 최소화 → 가장 "겸손한" 모델\n④ RL Entropy Regularization: π에 H(π)를 더해 탐색 장려 (SAC 알고리즘)\n공통 원리: 엔트로피가 높으면 불확실, 낮으면 확신 → 이를 조절하는 것이 학습',
  },
  {
    label: 'Conditional Entropy & Mutual Information',
    body: 'H(Y|X) = -Σ P(x,y)·log P(y|x) — X를 알 때 Y의 남은 불확실성\nH(Y|X) ≤ H(Y): 조건부 정보는 항상 불확실성을 줄이거나 유지\nI(X;Y) = H(Y) - H(Y|X) = H(X) - H(X|Y) — 상호 정보량, 대칭\n예: X=날씨, Y=우산 → I(X;Y)가 크면 날씨로 우산 여부를 잘 예측\n특징 선택에서 I(feature; label)이 큰 feature를 우선 사용하는 원리',
  },
];
