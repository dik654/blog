const P = '#6366f1', S = '#10b981', A = '#f59e0b';

export const COLS = [
  { label: 'Advice', sub: '증인(비밀)', color: P, x: 40 },
  { label: 'Fixed', sub: '상수', color: S, x: 110 },
  { label: 'Instance', sub: '공개 입력', color: S, x: 180 },
];

export const MID = [
  { label: 'Selector', sub: '행 선택', color: A, x: 62, y: 58 },
  { label: 'Gate', sub: 'Expression<F>', color: A, x: 150, y: 58 },
];

export const BOTTOM = [
  { label: '복사 제약', sub: '퍼뮤테이션', color: P, x: 62, y: 82 },
  { label: 'Plookup', sub: '테이블 룩업', color: S, x: 150, y: 82 },
  { label: 'h(X)', sub: '소멸 다항식', color: A, x: 260, y: 70 },
];

export const STEP_ACTIVE: Record<number, string[]> = {
  0: ['Advice', 'Fixed', 'Instance', 'Selector', 'Gate', '복사 제약', 'Plookup', 'h(X)'],
  1: ['Advice', 'Fixed', 'Instance'],
  2: ['Advice', 'Fixed', 'Instance', 'Selector', 'Gate'],
  3: ['Advice', '복사 제약'],
  4: ['Advice', 'Fixed', 'Plookup'],
  5: ['Gate', '복사 제약', 'Plookup', 'h(X)'],
};

export const BODIES = [
  '열, 게이트, 복사 제약, 룩업 → 소멸 다항식 통합.',
  'Advice=증인, Fixed=상수, Instance=공개 입력.',
  'Expression<F> 다항식 제약 + Selector 행 활성화.',
  '다른 열/행 셀 동일값 → 그랜드 프로덕트 증명.',
  'Advice 값이 Fixed 테이블에 존재하는지 검증.',
  '제약 y^i 결합 → Z_H(X)로 나눠 h(X) 생성.',
];

export const STEPS = [
  { label: '전체 PLONKish 회로' },
  { label: '열 정의' },
  { label: 'Custom Gate + Selector' },
  { label: '복사 제약' },
  { label: 'Plookup 테이블' },
  { label: '소멸 다항식 h(X)' },
];
