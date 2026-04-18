export const STEPS = [
  {
    label: 'Mode Collapse',
    body: '증상: G가 소수의 샘플만 생성 (다양성 상실).\n원인: D를 속이는 "쉬운 해답"에 고착.\n해결: Mini-batch Discrimination, WGAN-GP.\nUnrolled GAN — D의 미래 업데이트 미리 고려.',
  },
  {
    label: 'Non-convergence & Vanishing Gradient',
    body: 'Non-convergence: G와 D 손실 진동, Nash 균형 미도달.\nVanishing Gradient: D가 너무 강하면 G의 기울기 소실.\n해결: Non-saturating loss (max log D(G(z))), LSGAN (MSE), TTUR.',
  },
  {
    label: 'WGAN: Wasserstein Distance',
    body: 'JSD는 분포 겹치지 않으면 정보 없음 → Wasserstein 거리 도입.\nW(p_r, p_g) = inf E[‖x−y‖] — "흙 옮기기" 최소 비용.\n1-Lipschitz 제약으로 추정 가능.\nWGAN-GP: gradient penalty — 안정적 + mode coverage.',
  },
  {
    label: 'WGAN-GP 구현',
    body: 'L_D = E[D(G(z))] − E[D(x)] + λ·E[(‖∇D(x&#770;)‖₂ − 1)²].\nx&#770; = εx + (1−ε)G(z), ε ~ U(0,1) — 보간점.\nλ = 10 (표준). BatchNorm → LayerNorm.\n손실 값이 품질과 상관 → 모니터링 용이.',
  },
];
