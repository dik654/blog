export const C = { tip: '#10b981', base: '#6366f1', max: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: 'max_fee vs base_fee 검사',
    body: 'max_fee < base_fee이면 None 반환으로 현재 블록 포함 불가, BaseFee 서브풀에서 대기합니다.',
  },
  {
    label: 'EIP-1559 TX: min(priority_fee, max_fee - base_fee)',
    body: 'min(priority_fee, max_fee-base_fee)로 사용자 한도 내 실효 팁을 결정합니다.',
  },
  {
    label: 'Legacy TX: gas_price - base_fee',
    body: 'Legacy TX는 gas_price - base_fee로 팁을 계산하며 effective_gas_price()가 처리합니다.',
  },
];
