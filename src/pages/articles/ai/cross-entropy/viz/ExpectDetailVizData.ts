export const STEPS = [
  {
    label: '기대값의 정의: E[X] = Sigma x * P(x)',
    body: '이산: E[X] = Σ xᵢ·P(xᵢ) — 각 값에 확률을 가중한 평균\n연속: E[X] = ∫ x·f(x)dx — 확률밀도함수 f(x)로 적분\n주사위: E[X] = 1·(1/6)+2·(1/6)+...+6·(1/6) = 21/6 = 3.5\n편향 동전(P(H)=0.7): E[X] = 1·0.7+0·0.3 = 0.7\n기대값은 "많이 반복하면 수렴하는 값" — 대수의 법칙(LLN)의 핵심',
  },
  {
    label: 'E[X^2] != E[X]^2 -- 함수의 기대값 주의',
    body: 'E[g(X)] = Σ g(xᵢ)·P(xᵢ) — LOTUS (Law of the Unconscious Statistician)\n주사위: E[X²] = (1+4+9+16+25+36)/6 = 91/6 ≈ 15.17\nE[X]² = 3.5² = 12.25 — E[X²] ≠ E[X]²\nVar(X) = E[X²]-E[X]² = 15.17-12.25 = 2.92 — 이 차이가 곧 분산\n분산이 0이 아닌 한 E[g(X)] ≠ g(E[X]) — 비선형 함수에서 항상 주의',
  },
  {
    label: '선형성 + 독립 조건',
    body: '선형성: E[aX+bY+c] = aE[X]+bE[Y]+c — 독립 여부와 무관하게 항상 성립\n예: E[3X+2Y+5] = 3E[X]+2E[Y]+5\n독립 조건: X,Y 독립이면 E[XY] = E[X]·E[Y]\n비독립이면: E[XY] = E[X]E[Y]+Cov(X,Y) — 공분산 항 추가\nML에서 배치 평균 loss = E[l(f(x),y)] 계산 시 선형성을 이용해 샘플 평균으로 근사',
  },
  {
    label: "Jensen's Inequality: 볼록/오목 함수와 기대값",
    body: 'convex(볼록) f: f(E[X]) ≤ E[f(X)] — 평균의 함수값 ≤ 함수값의 평균\nconcave(오목) f: f(E[X]) ≥ E[f(X)] — 부등호 반대\nlog는 concave → E[log X] ≤ log E[X]\nKL ≥ 0 증명: -D_KL = Σ P·log(Q/P) = E_P[log(Q/P)] ≤ log E_P[Q/P] = log1 = 0\n따라서 D_KL ≥ 0 — Gibbs 부등식의 핵심이 Jensen 부등식',
  },
  {
    label: 'ML에서의 기대값 -- Loss, Entropy, Monte Carlo',
    body: 'Loss = E_(x,y)~D[l(f(x),y)] — 데이터 분포 D에서의 손실 기대값\nEntropy: H(P) = -E_P[log P(x)] = -Σ P(x)·log P(x)\nMonte Carlo 근사: E[f(X)] ≈ 1/N Σ f(xᵢ) — N개 샘플 평균으로 기대값 추정\n미니배치 SGD가 이 원리: 전체 데이터 기대값을 배치 평균으로 근사\nN↑이면 분산 ↓ (∝ 1/N) — 배치 크기와 학습 안정성의 트레이드오프',
  },
];

// Colors
export const MAIN_C = '#6366f1';  // indigo
export const SUB_C = '#f59e0b';   // amber
export const ACC_C = '#ef4444';   // red
export const OK_C = '#10b981';    // green
export const PURP_C = '#8b5cf6';  // purple
