export interface TipScenario {
  type: string;
  maxFee: string;
  priorityFee: string;
  baseFee: string;
  effectiveTip: string;
  note: string;
  color: string;
}

export const TIP_SCENARIOS: TipScenario[] = [
  {
    type: 'EIP-1559 정상',
    maxFee: '100 gwei',
    priorityFee: '2 gwei',
    baseFee: '50 gwei',
    effectiveTip: 'min(2, 100-50) = 2 gwei',
    note: 'priority_fee가 여유분보다 작으므로 그대로 팁이 된다',
    color: '#10b981',
  },
  {
    type: 'EIP-1559 여유 부족',
    maxFee: '52 gwei',
    priorityFee: '5 gwei',
    baseFee: '50 gwei',
    effectiveTip: 'min(5, 52-50) = 2 gwei',
    note: 'max_fee - base_fee 여유분(2)이 priority_fee(5)보다 작다',
    color: '#f59e0b',
  },
  {
    type: 'EIP-1559 무효',
    maxFee: '40 gwei',
    priorityFee: '2 gwei',
    baseFee: '50 gwei',
    effectiveTip: 'None (무효)',
    note: 'max_fee < base_fee이므로 현재 블록에 포함 불가',
    color: '#ef4444',
  },
  {
    type: 'Legacy TX',
    maxFee: '-',
    priorityFee: '-',
    baseFee: '50 gwei',
    effectiveTip: 'gas_price - base_fee',
    note: 'Legacy TX는 gas_price 필드만 있으므로 base_fee를 빼서 팁 산출',
    color: '#6366f1',
  },
];

export interface ConnectionPoint {
  from: string;
  to: string;
  detail: string;
}

export const TX_POOL_CONNECTION: ConnectionPoint[] = [
  {
    from: 'effective_tip_per_gas()',
    to: 'CoinbaseTipOrdering::priority()',
    detail: 'TX 풀의 정렬 기준이 된다. effective_tip이 높을수록 best_transactions() 이터레이터에서 먼저 나온다.',
  },
  {
    from: 'CoinbaseTipOrdering',
    to: 'PayloadBuilder::build_payload()',
    detail: '블록 빌더가 수익 순으로 TX를 선택한다. effective_tip이 곧 검증자의 수익이다.',
  },
];
