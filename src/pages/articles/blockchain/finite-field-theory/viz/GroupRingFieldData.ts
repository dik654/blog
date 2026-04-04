import type { StepDef } from '@/components/ui/step-viz';

export const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

export const STEPS: StepDef[] = [
  { label: '군(Group) — 4개 공리',
    body: '닫힘 · 결합 · 항등원 · 역원. 교환까지 성립하면 아벨군.' },
  { label: '군 예시: F7의 덧셈군',
    body: '3+4=0 (mod 7). 항등원 0, 3의 역원 4.' },
  { label: '환(Ring) — 두 연산 + 분배법칙',
    body: '(R,+) 아벨군 + (R,·) 결합 + 분배법칙. 예: 정수 Z.' },
  { label: '환의 한계',
    body: '정수 Z에서 1/3은 정수가 아님 → 곱셈 역원 없음.' },
  { label: '체(Field) — 곱셈 역원 존재',
    body: '환 + 0 외 모든 원소에 곱셈 역원. ZKP 회로의 핵심 무대.' },
  { label: '체 예시: F7에서 나눗셈',
    body: '3×5=1 (mod 7) → 3의 역원=5. 나눗셈이 정확히 동작.' },
];

export const AXIOMS = [
  ['닫힘', '3+4=0 (mod 7)'],
  ['결합', '(2+3)+4=2+(3+4)'],
  ['항등원', '5+0=5'],
  ['역원', '3+4=0'],
];
