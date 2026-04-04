export interface CalcStep {
  condition: string;
  formula: string;
  detail: string;
  color: string;
}

export const CALC_STEPS: CalcStep[] = [
  {
    condition: 'gas_used == gas_target',
    formula: 'next_base_fee = base_fee (변동 없음)',
    detail: '가스 사용량이 목표치와 정확히 일치하면 base fee를 유지한다. 네트워크가 이상적으로 작동하는 상태다.',
    color: '#6366f1',
  },
  {
    condition: 'gas_used > gas_target',
    formula: 'delta = base_fee * (used - target) / target / 8',
    detail: 'u128로 곱셈을 수행하여 오버플로를 방지한다. std::cmp::max(delta, 1)로 최소 1 wei 증가를 보장한다. 블록이 꽉 찰수록 base fee가 빠르게 오른다.',
    color: '#ef4444',
  },
  {
    condition: 'gas_used < gas_target',
    formula: 'delta = base_fee * (target - used) / target / 8',
    detail: 'saturating_sub(delta)로 0 이하가 되지 않도록 보호한다. 빈 블록이 이어지면 base fee가 계속 내려간다.',
    color: '#10b981',
  },
];

export interface OverflowInsight {
  question: string;
  answer: string;
}

export const OVERFLOW_INSIGHTS: OverflowInsight[] = [
  {
    question: '왜 u128이 필요한가?',
    answer: 'base_fee(u64, 최대 ~18.4 * 10^18 wei) * gas_used_delta(u64)의 곱이 u64 범위(2^64)를 초과할 수 있다. u128은 2^128까지 표현하므로 두 u64의 곱은 항상 안전하다.',
  },
  {
    question: 'Geth의 big.Int와 차이는?',
    answer: 'big.Int는 힙에 할당되어 GC가 관리한다. 초기 동기화 시 수백만 블록을 처리하면 GC 압력이 누적된다. u128은 스택 16바이트로 할당/해제 비용이 0이다.',
  },
  {
    question: 'elasticity_multiplier = 2의 의미?',
    answer: 'gas_target = gas_limit / 2. 블록이 최대로 채워지면(gas_used = gas_limit = 2 * target) base fee가 12.5% 상승한다. 반대로 빈 블록이면 12.5% 하락한다.',
  },
];
