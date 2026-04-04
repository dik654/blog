export const C = {
  tx: '#6366f1',
  valid: '#10b981',
  pending: '#f59e0b',
  queued: '#ef4444',
  basefee: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'Why: trait 기반 TX 풀 설계',
    body: 'Validator, Ordering, Pool을 각각 trait으로 분리하여 구현체만 교체 가능합니다.',
  },
  {
    label: 'TX 도착 → TransactionValidator로 검증',
    body: '체인ID→서명→nonce→잔액→gas→base fee 6단계 검증 후 Valid/Invalid를 반환합니다.',
  },
  {
    label: 'TransactionOrdering으로 우선순위 결정',
    body: 'CoinbaseTipOrdering이 effective_tip으로 우선순위를 결정하며 trait 교체 가능합니다.',
  },
  {
    label: '적절한 서브풀에 배치',
    body: 'Pending(즉시 실행), BaseFee(fee 대기), Queued(nonce gap) 3개 서브풀에 분류합니다.',
  },
  {
    label: '새 블록 도착 → 서브풀 간 승격/강등',
    body: 'base fee 변동과 nonce gap 해소에 따라 on_canonical_state_change()로 승격/강등합니다.',
  },
];
