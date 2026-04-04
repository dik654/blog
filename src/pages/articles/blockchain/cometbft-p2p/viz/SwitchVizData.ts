export const C = { sw: '#10b981', reactor: '#f59e0b', peer: '#6366f1' };

export const STEPS = [
  {
    label: 'Switch.AddReactor() — 채널 → Reactor 매핑',
    body: 'reactorsByCh[chID]=reactor로 매핑 — channelID로 처리 Reactor 결정',
  },
  {
    label: 'Switch.OnStart() → acceptRoutine()',
    body: 'Reactor Start → acceptRoutine으로 연결 수락 → MConnection 생성',
  },
  {
    label: 'DialPeersAsync() — 비동기 연결',
    body: 'seed/persistent 피어에 랜덤 셔플 후 동시 dial — 성공 시 목록에 추가',
  },
];

export const STEP_KEYS = ['switch-add-reactor', 'switch-onstart', 'switch-dial'];
export const STEP_LABELS = ['switch.go — AddReactor()', 'switch.go — OnStart()', 'switch.go — DialPeersAsync()'];
