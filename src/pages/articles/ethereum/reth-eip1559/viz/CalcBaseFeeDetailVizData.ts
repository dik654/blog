export const C = { target: '#6366f1', up: '#ef4444', down: '#10b981', calc: '#f59e0b' };

export const STEPS = [
  {
    label: 'gas_target 계산',
    body: 'gas_target = gas_limit / elasticity(2)로 gas_limit의 절반이 target입니다.',
  },
  {
    label: 'gas_used == target → 유지',
    body: '가스 사용량이 target과 일치하면 base fee를 변동 없이 그대로 반환합니다.',
  },
  {
    label: 'gas_used > target → 인상',
    body: 'u128 캐스팅으로 오버플로 방지하며 max(delta, 1)로 최소 1 wei 증가를 보장합니다.',
  },
  {
    label: 'gas_used < target → 인하',
    body: 'saturating_sub(delta)로 base_fee가 0 이하로 내려가지 않도록 보호합니다.',
  },
];
