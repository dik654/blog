export const C = {
  config: '#6366f1',
  fault: '#ef4444',
  seed: '#f59e0b',
  result: '#10b981',
};

export const STEPS = [
  {
    label: 'Link + Config: 네트워크 특성 모델링',
    body: 'Link { latency, jitter, success_rate } — 지연/지터/성공률.',
  },
  {
    label: '4가지 장애 시뮬레이션',
    body: '파티션: remove_link(a,b) — 그룹 간 통신 차단.',
  },
  {
    label: 'seed 기반 완벽한 재현성',
    body: 'deterministic::Runner::seeded(seed).',
  },
];

export const STEP_REFS = [
  'sim-config',
  'sim-deterministic',
  'sim-deterministic',
];

export const STEP_LABELS = [
  'mod.rs — Config/Link',
  'mod.rs — 장애 시뮬레이션',
  'mod.rs — deterministic::Runner',
];
