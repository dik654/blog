export type ColType = 'advice' | 'fixed' | 'instance';

export const COL_META: Record<ColType, { color: string; label: string; desc: string; example: string }> = {
  advice: {
    color: '#6366f1',
    label: 'Advice',
    desc: '비밀 증인 값. prove 시 어드바이스 열에 할당. KZG 커밋 + 블라인딩.',
    example: 'assign_advice(|| "a", col, row, || Value::known(x))',
  },
  fixed: {
    color: '#10b981',
    label: 'Fixed',
    desc: '회로 상수. keygen 시 결정. 퍼뮤테이션에 포함 가능. 커밋만.',
    example: 'assign_fixed(|| "const", col, row, || Value::known(F::ONE))',
  },
  instance: {
    color: '#f59e0b',
    label: 'Instance',
    desc: '공개 입력. 검증자가 알고 있는 값. 퍼뮤테이션으로 복사 제약 가능.',
    example: 'instance_column() — 공개 출력값, 해시 입력 등',
  },
};

export const EXPRESSION_TYPES = [
  { name: 'Constant(F)', desc: '상수 스칼라', color: '#6b7280' },
  { name: 'Selector', desc: '행 활성화 비트', color: '#a855f7' },
  { name: 'Fixed(query)', desc: '고정 열 셀 참조', color: '#10b981' },
  { name: 'Advice(query)', desc: '어드바이스 셀 참조', color: '#6366f1' },
  { name: 'Instance(query)', desc: '공개 입력 셀', color: '#f59e0b' },
  { name: 'Sum(a, b)', desc: 'a + b 표현식 합성', color: '#0ea5e9' },
  { name: 'Product(a, b)', desc: 'a × b 게이트 제약', color: '#ef4444' },
  { name: 'Scaled(a, c)', desc: 'c × a 스칼라 곱', color: '#f97316' },
];
