import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '이전 셀 상태 Cₜ₋₁ 입력', body: '과거 정보가 담긴 셀 상태가 좌측에서 유입.\n각 슬롯은 서로 다른 정보 차원의 기억 강도.' },
  { label: 'Forget: 불필요한 정보 삭제', body: 'fₜ * Cₜ₋₁ — forget gate(빨간)로 원소별 곱셈.\nf=0.2인 슬롯은 80% 삭제 → 불필요한 과거 기억 제거.' },
  { label: 'Input: 새 정보 추가', body: '+ iₜ * C̃ₜ — 새 후보 셀 값(초록)을 더함.\n덧셈 연산이 핵심: 기울기가 1에 가깝게 유지됨.' },
  { label: 'Cₜ → hₜ 출력 (장기 vs 단기 기억)', body: 'hₜ = oₜ * tanh(Cₜ) — 셀 상태 중 출력할 부분 선별.\nCₜ = 장기 기억, hₜ = 단기 기억. 두 흐름이 분리됨.' },
];

export const BELT_Y = 58;
export const BELT_H = 24;
export const SEGMENTS = 8;
