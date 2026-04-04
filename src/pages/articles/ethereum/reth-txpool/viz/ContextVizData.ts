export const C = { tx: '#6366f1', err: '#ef4444', ok: '#10b981', pool: '#f59e0b', base: '#0ea5e9' };

export const STEPS = [
  {
    label: 'TX가 블록에 들어가기 전 대기하는 곳',
    body: '블록 포함 전 TX가 메모리 풀에서 대기하며, 검증과 정렬을 거쳐 블록 빌더에 제공됩니다.',
  },
  {
    label: '문제: nonce gap',
    body: 'nonce가 연속되지 않으면 실행 불가하여 별도 관리 후 gap 해소 시 승격해야 합니다.',
  },
  {
    label: '문제: 스팸 + base fee 변동',
    body: '스팸 TX의 메모리 소진과 블록마다 바뀌는 base fee에 따른 재분류가 필요합니다.',
  },
  {
    label: '해결: 3개 서브풀',
    body: 'Pending(즉시 실행), BaseFee(fee 대기), Queued(nonce gap)로 분류하여 상태별 승격/강등합니다.',
  },
  {
    label: '해결: trait 기반 설계',
    body: 'TransactionValidator와 TransactionOrdering trait으로 검증/정렬 로직을 교체 가능합니다.',
  },
];
