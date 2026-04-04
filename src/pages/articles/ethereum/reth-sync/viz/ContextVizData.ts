export const C = { full: '#6366f1', snap: '#10b981', live: '#f59e0b', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: '새 노드가 네트워크에 참여하려면',
    body: '제네시스부터 최신까지 따라잡아야 블록 검증과 RPC 응답이 가능합니다.',
  },
  {
    label: '문제: 수억 블록 전체 실행은 며칠 소요',
    body: '모든 블록을 순서대로 실행하면 수일~수주가 소요됩니다.',
  },
  {
    label: '문제: 상태만 다운로드하면 검증 불가',
    body: '악의적 피어의 거짓 상태 방지를 위해 상태 루트 기반 Merkle proof 검증이 필수입니다.',
  },
  {
    label: '해결: 3가지 동기화 전략',
    body: 'Full(전체 재실행), Snap(상태 다운로드+범위 증명), Live(ExEx 실시간 스트림)을 제공합니다.',
  },
  {
    label: '일반적 경로: Snap → Live 전환',
    body: 'Snap으로 최신 상태를 빠르게 확보한 후 Live 모드로 전환하여 12초마다 실시간 처리합니다.',
  },
];
