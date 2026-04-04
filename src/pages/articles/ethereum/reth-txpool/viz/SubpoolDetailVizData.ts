export const C = { pending: '#10b981', basefee: '#0ea5e9', queued: '#ef4444', ok: '#f59e0b' };

export const STEPS = [
  {
    label: 'add_transaction() 진입점',
    body: 'validate→서브풀 배치→notify 3단계로 trait 기반 각 단계 교체가 가능합니다.',
  },
  {
    label: 'Pending: 즉시 실행 가능',
    body: 'nonce 연속 + max_fee >= base_fee 조건을 충족하여 best_txs()로 블록에 포함됩니다.',
  },
  {
    label: 'BaseFee · Queued 서브풀',
    body: 'BaseFee는 fee 하락 시 Pending 승격, Queued는 nonce gap 해소 시 승격합니다.',
  },
  {
    label: 'on_canonical_state_change()',
    body: '새 블록의 base fee 변동과 nonce gap 해소를 반영하여 서브풀 간 승격/강등합니다.',
  },
];
