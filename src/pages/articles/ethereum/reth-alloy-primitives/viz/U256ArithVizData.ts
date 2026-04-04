export const C = {
  limb: '#f59e0b', carry: '#ef4444', result: '#10b981',
  wrap: '#8b5cf6', dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'U256 — 4개 u64 limb의 little-endian 배치',
    body: 'limbs[0] = 최하위 64비트\nlimbs[3] = 최상위 64비트\n총 4 x 64 = 256비트',
  },
  {
    label: 'limb[0] + limb[0] → carry 발생',
    body: '두 u64의 덧셈이 u64::MAX를 초과하면 carry = 1\noverflowing_add()가 (합, carry) 튜플을 반환',
  },
  {
    label: 'carry 전파: limb[1] + limb[1] + carry',
    body: '이전 limb의 carry가 다음 limb 덧셈에 합산\n4개 limb을 순서대로 처리하며 carry를 전파',
  },
  {
    label: '최종 carry → 오버플로 판정',
    body: 'limb[3] 덧셈 후 carry가 남으면 256비트 초과\noverflowing_add는 (result, true)를 반환',
  },
  {
    label: 'wrapping vs checked vs saturating',
    body: 'wrapping: 오버플로 시 mod 2^256 (EVM 기본)\nchecked: 오버플로 시 None 반환\nsaturating: 오버플로 시 U256::MAX 반환',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'u256-limbs', 1: 'u256-overflowing',
  2: 'u256-overflowing', 3: 'u256-overflowing',
  4: 'u256-checked',
};
