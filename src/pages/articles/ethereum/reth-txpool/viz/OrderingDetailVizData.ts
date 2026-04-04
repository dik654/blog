export const C = { tip: '#10b981', pool: '#f59e0b', base: '#0ea5e9' };

export const STEPS = [
  {
    label: 'TransactionOrdering::priority()',
    body: 'priority() 메서드로 TX 정렬 키(PriorityValue)를 반환하는 trait입니다.',
  },
  {
    label: 'CoinbaseTipOrdering (기본 구현)',
    body: 'effective_tip_per_gas(base_fee)로 U256 값을 반환하여 best_txs()의 정렬 기준이 됩니다.',
  },
  {
    label: '커스텀 정렬 가능',
    body: 'trait 교체로 MEV 번들 수익 등 커스텀 정렬이 가능합니다(Geth는 하드코딩).',
  },
];
