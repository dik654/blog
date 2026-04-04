export const C = { block: '#6366f1', err: '#ef4444', ok: '#10b981', exec: '#f59e0b', state: '#8b5cf6' };

export const STEPS = [
  {
    label: '블록 실행의 역할',
    body: 'P2P에서 도착한 블록의 TX를 EVM으로 실행하여 계정 상태를 변경합니다.',
  },
  {
    label: '문제: TX마다 DB에 쓰면?',
    body: '블록당 수백 TX × 수천 블록 = 수십만 번 I/O로 동기화 병목이 발생합니다.',
  },
  {
    label: '문제: revert 처리',
    body: 'TX revert 시 해당 TX의 상태 변경만 정확히 롤백해야 하며 DB 즉시 기록 시 복잡해집니다.',
  },
  {
    label: '해결: BundleState 누적',
    body: 'revm이 상태 변경을 BundleState에 메모리 누적하여 DB 접근 없이 고속 실행합니다.',
  },
  {
    label: '해결: BlockExecutor trait 분리',
    body: 'BlockExecutor/BatchExecutor로 분리하고 finalize() 시 BundleState를 한 번에 반환합니다.',
  },
];
