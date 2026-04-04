export const C = {
  ec: '#6366f1',
  f3: '#10b981',
  cert: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'EC + F3 — 완전 분리된 레이어',
    body: 'EC = 블록 생산 (VRF + Poisson Sortition)',
  },
  {
    label: 'F3.Run() — goroutine 메인 루프',
    body: 'EC 체인의 새 tipset Notification 수신',
  },
  {
    label: '인증서 발행 → 체인 확정',
    body: 'cert := instance.RunToCompletion(ctx)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'f3-run', 1: 'f3-run', 2: 'f3-run',
};
