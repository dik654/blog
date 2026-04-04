export const C = {
  store: '#6366f1', field: '#10b981', init: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 37: finalized_header 초기화',
    body: 'finalized_header = boot.header.clone()\n체크포인트의 헤더가 현재 확정된 최신 헤더가 된다.',
  },
  {
    label: 'Line 38~39: current_sync_committee 설정',
    body: 'current_sync_committee = boot.current_sync_committee.clone()\nMerkle 검증 통과한 512개 공개키를 Store에 저장.',
  },
  {
    label: 'Line 40~42: optimistic_header + 나머지',
    body: 'optimistic_header = boot.header.clone()\nprevious_max_participants = 0 (아직 Update 없음)\nbest_valid_update = None (첫 Update 대기 중)',
  },
];
