export const STEPS = [
  { label: '합성 함수: x → y=2x → z=4y' },
  { label: '순전파: x=3 → y=6 → z=24' },
  { label: '각 블록의 미분: dy/dx=2, dz/dy=4' },
  { label: '연쇄 법칙: dz/dx = dz/dy × dy/dx = 4×2 = 8' },
  { label: '검증: x를 3→3.01 (Δ=0.01) 바꾸면 z는 24→24.08 (Δ=0.08)' },
  { label: '신경망 적용: dL/dm₂ = (y−ŷ)×x = −0.91×2.35 = −2.14' },
];
