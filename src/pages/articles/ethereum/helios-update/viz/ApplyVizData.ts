export const C = {
  finalized: '#6366f1', committee: '#10b981', optimistic: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 34~38: finalized_header 갱신',
    body: 'update.finalized_header.slot > store.finalized_header.slot\n더 최신이면 교체.',
  },
  {
    label: 'Line 40~43: 위원회 교체 (period 경계)',
    body: 'has_next_committee(update) → true이면\ncurrent = update.next_sync_committee로 교체.',
  },
  {
    label: 'Line 44~46: optimistic_header 갱신',
    body: 'store.optimistic_header = update.attested_header\n항상 최신 헤더로 교체.',
  },
];
