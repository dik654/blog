export const C = { init: '#8b5cf6', batch: '#3b82f6', err: '#ef4444', ok: '#10b981', ckpt: '#f59e0b' };

export const STEPS = [
  {
    label: '새 노드의 첫 과제',
    body: '새 CL 노드는 수백만 슬롯을 따라잡아야 검증에 참여할 수 있습니다.',
  },
  {
    label: '문제: 제네시스부터 재실행은 수일 소요',
    body: '모든 슬롯을 순차 실행하면 수일~수주가 걸려 영원히 따라잡지 못할 수 있습니다.',
  },
  {
    label: '문제: 신뢰 vs 속도 트레이드오프',
    body: '체크포인트 시작은 빠르지만 Weak Subjectivity 초과 시 가짜 상태 주입에 취약합니다.',
  },
  {
    label: '해결: 3가지 동기화 모드',
    body: 'Initial(제네시스 배치), Checkpoint(Finalized DL), Regular(실시간) 모드를 자동 전환합니다.',
  },
  {
    label: '해결: 라운드로빈 + Backfill',
    body: '여러 피어에 범위를 분산하여 병렬 다운로드하고 Checkpoint 이후 역방향으로 채웁니다.',
  },
];
