export interface SubpoolInfo {
  name: string;
  condition: string;
  promoteTo: string;
  demoteFrom: string;
  detail: string;
  color: string;
}

export const SUBPOOLS: SubpoolInfo[] = [
  {
    name: 'Pending',
    condition: 'nonce 연속 + max_fee >= base_fee',
    promoteTo: '-',
    demoteFrom: 'base fee 상승 시 BaseFee로 강등',
    detail: 'PayloadBuilder가 best_transactions()로 여기서 TX를 꺼낸다. 블록에 즉시 포함 가능한 TX만 존재한다. 정렬은 TransactionOrdering이 결정한다.',
    color: '#10b981',
  },
  {
    name: 'BaseFee',
    condition: 'nonce 연속 + max_fee < base_fee',
    promoteTo: 'base fee 하락 시 Pending으로 승격',
    demoteFrom: '-',
    detail: 'nonce는 연속이지만 현재 base fee를 감당하지 못하는 TX다. base fee가 하락하면 자동 승격된다. base fee가 더 오르면 계속 대기한다.',
    color: '#0ea5e9',
  },
  {
    name: 'Queued',
    condition: 'nonce gap 존재',
    promoteTo: 'gap 해소 시 Pending/BaseFee로 승격',
    demoteFrom: '-',
    detail: '선행 nonce TX가 도착하지 않아 실행 순서가 맞지 않는 TX다. gap이 해소되면 fee 조건에 따라 Pending 또는 BaseFee로 승격한다.',
    color: '#ef4444',
  },
];

export interface StateChangeEvent {
  event: string;
  action: string;
}

export const STATE_CHANGES: StateChangeEvent[] = [
  { event: '새 블록 도착 (base fee 변동)', action: 'BaseFee ↔ Pending 승격/강등' },
  { event: 'nonce gap 해소', action: 'Queued → Pending/BaseFee 승격' },
  { event: '서브풀 한도 초과', action: '낮은 priority TX 퇴출 (eviction)' },
  { event: 'TX replacement (같은 nonce, 높은 fee)', action: '기존 TX 대체, 차이가 10% 미만이면 거부' },
];
