import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 단층 퍼셉트론의 한계 — 직선 하나',
    body: '직선 하나로는 XOR 분류 불가.\n선형 분리 가능한 문제만 해결.',
  },
  {
    label: '② 다층 = NAND + OR → AND = XOR',
    body: '1층: NAND와 OR이 각각 입력 처리.\n2층: AND로 결합 → XOR 완성.',
  },
  {
    label: '③ 보편 근사 정리의 출발점',
    body: 'NAND만으로 모든 논리 회로 구성 가능.\n층을 깊게 쌓으면 어떤 함수든 근사 가능.',
  },
];

export const NAND_C = '#6366f1';
export const OR_C = '#10b981';
export const AND_C = '#f59e0b';
