export const STEPS = [
  {
    label: 'ELBO 유도: 목표 정의',
    body: '관찰 데이터 x의 로그 우도 log p(x)를 최대화하고 싶다.\np(x) = ∫ p(x|z) p(z) dz — z가 고차원이면 적분 불가능(intractable).\n직접 계산 대신 하한(lower bound)을 최대화하는 전략.',
  },
  {
    label: 'ELBO 유도: 변분 분포 도입',
    body: '진짜 사후분포 p(z|x)를 모르니, 근사 분포 q(z|x)를 도입한다.\nJensen 부등식을 적용하면 log p(x) ≥ ELBO(x, q).\nELBO = E_q[log p(x|z)] − KL(q(z|x) ‖ p(z)).',
  },
  {
    label: 'ELBO 두 항의 해석',
    body: '재구성 항 E_q[log p(x|z)] — 디코더가 z로부터 x를 얼마나 잘 복원하는가.\n정규화 항 KL(q(z|x) ‖ p(z)) — 인코더 분포가 사전분포 N(0,I)에서 얼마나 벗어났는가.\n두 항의 균형이 VAE 학습의 핵심.',
  },
  {
    label: 'VAE 손실 함수',
    body: 'VAE는 −ELBO를 최소화한다.\nLoss = −E_q[log p(x|z)] + KL(q(z|x) ‖ p(z))\n     = 재구성 손실 + KL Divergence.\n실무: q(z|x) ≈ N(μ(x), σ²(x)), p(z) = N(0, I).',
  },
];
