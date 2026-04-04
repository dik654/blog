export const C = {
  up: '#ef4444',
  down: '#10b981',
  target: '#6366f1',
  fee: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Why: 왜 동적 base fee인가?',
    body: 'first-price auction의 가격 예측 불가 문제를 프로토콜이 base fee를 자동 조정하여 해결합니다.',
  },
  {
    label: 'gas_target = gas_limit / elasticity (2)',
    body: 'gas_target은 gas_limit의 절반으로 사용량이 target에 수렴하도록 base fee를 조정합니다.',
  },
  {
    label: 'gas_used > target → base fee 인상',
    body: 'delta = base_fee*(used-target)/target/8로 계산하며 최소 1 wei 증가를 보장합니다.',
  },
  {
    label: 'gas_used < target → base fee 인하',
    body: 'delta = base_fee*(target-used)/target/8로 계산하며 saturating_sub로 0 미만 방지합니다.',
  },
  {
    label: 'Reth vs Geth: u128 vs big.Int',
    body: 'Reth u128(스택 할당) vs Geth big.Int(힙+GC)로 대량 동기화 시 성능 차이가 누적됩니다.',
  },
];
