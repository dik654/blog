import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '접선 방정식: l(x,y) = yP - yT - lambda(xP - xT)',
    body: 'xP, yP는 Fp(정수 1개). xT, yT, lambda는 Fp2(a+bu).',
  },
  {
    label: 'Fp 원소를 Fp12에 매핑',
    body: '첫 번째 슬롯에만 값이 들어간다. 나머지 11개는 0.',
  },
  {
    label: 'Fp2 원소를 Fp12에 매핑',
    body: '특정 2개 슬롯에만 값이 들어간다. 나머지 10개는 0.',
  },
  {
    label: '합치면 3개 슬롯만 non-zero',
    body: 'twist degree 6이 이 구조를 결정한다.',
  },
];

// Slot labels for each step
export const FP_SLOTS = [
  { idx: 0, label: 'yP', field: 'Fp' },
];
export const FP2_SLOTS = [
  { idx: 2, label: '-lambda*xP', field: 'Fp2' },
  { idx: 3, label: 'lambda*xT-yT', field: 'Fp2' },
];
