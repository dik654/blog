import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '① Forget Gate — 버릴 정보 결정', body: 'fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf) → 0이면 삭제, 1이면 유지.\n실수 예시: f = 0.8이면 80% 유지, f = 0.1이면 90% 삭제.' },
  { label: '② Input Gate — 저장할 정보 결정', body: 'iₜ = σ(...), C̃ₜ = tanh(...) → 새 정보의 크기와 내용.\ni = 0.9이면 새 정보 90% 반영, i = 0.05이면 거의 무시.' },
  { label: '③ Output Gate — 출력할 정보 선별', body: 'oₜ = σ(...) → 셀 상태 중 외부에 공개할 부분.\no = 0.7이면 tanh(Cₜ)의 70%만 은닉 상태로 출력.' },
  { label: '④ 실제 숫자로 보는 게이트 연산', body: '입력: "나는 프랑스에서 태어났다"\n각 게이트의 출력값이 셀 상태를 어떻게 바꾸는지 추적.' },
];

export const FORGET_C = '#ef4444';
export const INPUT_C = '#10b981';
export const OUTPUT_C = '#6366f1';
export const CELL_C = '#f59e0b';

/** Numeric gate example data (Step 3) */
export const GATE_ROWS = [
  { dim: '언어', cPrev: 0.90, f: 0.95, afterF: 0.86, iC: 0.02, cNew: 0.88, o: 0.70, h: 0.55 },
  { dim: '주어', cPrev: 0.30, f: 0.10, afterF: 0.03, iC: 0.85, cNew: 0.88, o: 0.80, h: 0.63 },
  { dim: '시제', cPrev: 0.70, f: 0.80, afterF: 0.56, iC: 0.30, cNew: 0.86, o: 0.60, h: 0.44 },
  { dim: '감정', cPrev: 0.50, f: 0.05, afterF: 0.03, iC: 0.01, cNew: 0.04, o: 0.20, h: 0.01 },
];
export const COL_X = [8, 66, 124, 182, 240, 298, 356, 414];
export const COL_W = 48;
export const ROW_H = 28;
