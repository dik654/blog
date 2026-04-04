import type { Annotation } from '@/components/ui/code-panel';

export const flexGateAnnotations: Annotation[] = [
  { lines: [3, 3], color: 'sky', note: '단일 advice 컬럼 + selector로 산술 연산 구현' },
  { lines: [8, 8], color: 'emerald', note: '4행을 사용: a(cur), b(next), c(+2), d(+3)' },
  { lines: [17, 17], color: 'amber', note: 'Rotation으로 연속된 행에서 값 참조' },
  { lines: [21, 21], color: 'violet', note: '하나의 다항식으로 덧셈/곱셈/곱셈-덧셈 모두 표현' },
];

export const rangeGateAnnotations: Annotation[] = [
  { lines: [4, 4], color: 'sky', note: 'FlexGate 위에 lookup 기반 범위 검사 레이어' },
  { lines: [7, 7], color: 'emerald', note: 'lookup_bits로 테이블 크기 결정 (8비트 → 0~255)' },
  { lines: [13, 13], color: 'amber', note: '큰 값을 여러 limb로 분해 후 각각 lookup' },
  { lines: [16, 16], color: 'violet', note: '내적(inner_product)으로 재조합 → 원래 값과 동일성 검증' },
];
