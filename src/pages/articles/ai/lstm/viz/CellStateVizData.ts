import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '이전 셀 상태 C_{t-1} 입력', body: '과거 정보가 담긴 셀 상태가 좌측에서 유입.\n각 슬롯은 서로 다른 정보 차원의 기억 강도.' },
  { label: 'Forget: 불필요한 정보 삭제', body: 'f_t * C_{t-1} — forget gate(빨간)로 원소별 곱셈.\nf=0.2인 슬롯은 80% 삭제 → 불필요한 과거 기억 제거.' },
  { label: 'Input: 새 정보 추가', body: '+ i_t * C̃_t — 새 후보 셀 값(초록)을 더함.\n덧셈 연산이 핵심: 기울기가 1에 가깝게 유지됨.' },
  { label: 'C_t → h_t 출력 (장기 vs 단기 기억)', body: 'h_t = o_t * tanh(C_t) — 셀 상태 중 출력할 부분 선별.\nC_t = 장기 기억, h_t = 단기 기억. 두 흐름이 분리됨.' },
];

export const BELT_Y = 50;
export const BELT_H = 24;
export const SEGMENTS = 8;
