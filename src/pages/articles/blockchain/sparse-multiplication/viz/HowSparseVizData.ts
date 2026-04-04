import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'f²(12 슬롯) x l(P)(3 슬롯) 나란히 배치',
    body: 'f²는 full — 12개 전부 채워짐. l(P)는 3개만 non-zero.',
  },
  {
    label: 'non-zero 슬롯에서만 연결선 생성',
    body: '3개 non-zero 슬롯이 각각 12개와 곱해진다. 나머지는 건너뜀.',
  },
  {
    label: 'Full 144 연결 vs Sparse 36 연결',
    body: '0 x 무엇이든 = 0. 계산할 필요 없다. Karatsuba로 18 Fp곱.',
  },
];
