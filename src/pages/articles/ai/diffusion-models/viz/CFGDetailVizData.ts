export const STEPS = [
  {
    label: 'Classifier-Free Guidance 원리',
    body: '훈련 시: 일정 확률(10%)로 조건 드롭 → 모델이 조건부/무조건 모두 학습.\n추론 시: ε_cond = ε_θ(x_t, t, c), ε_uncond = ε_θ(x_t, t, ∅).\nε&#770; = ε_uncond + w·(ε_cond − ε_uncond).\nw = guidance scale — 조건부 방향으로 "증폭".',
  },
  {
    label: 'Guidance Scale 효과',
    body: 'w=0: 무조건부 생성.\nw=1: 표준 조건부 생성.\nw=7.5: SD 기본값 (품질-다양성 균형).\nw>15: 과포화, 아티팩트 — 비용: 매 스텝 UNet 2회 forward.',
  },
];
