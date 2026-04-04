export const C = {
  vm: '#f59e0b', cron: '#ef4444', msg: '#8b5cf6', state: '#10b981',
};

export const STEP_REFS: Record<number, string> = {
  0: 'state-apply', 1: 'state-apply', 2: 'state-apply',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'stmgr.go L25 — NewFVM()',
  1: 'stmgr.go L30 — ApplyImplicitMessage(cronMsg)',
  2: 'stmgr.go L34 — ApplyMessage() + Flush()',
};

export const STEPS = [
  {
    label: 'FVM 인스턴스 생성',
    body: 'ApplyBlocks()가 부모 상태(parentState)에서 VM 생성',
  },
  {
    label: 'CronTick 먼저 실행',
    body: 'vmi.ApplyImplicitMessage(cronMsg)',
  },
  {
    label: '사용자 메시지 순차 실행 → Flush',
    body: 'ts.Blocks() 순회 → blk.Messages 순차 실행',
  },
];
