export const FIELDS = [
  { label: 'ChainStore', sub: '체인 데이터 접근', color: '#3b82f6' },
  { label: 'Executor', sub: 'FVM TipSet 실행', color: '#10b981' },
  { label: 'networkVersions', sub: '에폭별 네트워크 버전', color: '#8b5cf6' },
  { label: 'stateMigrations', sub: '업그레이드 마이그레이션', color: '#f59e0b' },
  { label: 'execTraceCache', sub: '실행 트레이스 ARC', color: '#ec4899' },
  { label: 'beacon', sub: 'DRAND 랜덤 비콘', color: '#ef4444' },
];

export const STEPS = [
  {
    label: 'Executor 인터페이스',
    body: 'ExecuteTipSet(ctx, sm, ts, em, vmTracing)',
  },
  {
    label: 'networkVersions — 버전 스케줄',
    body: '[]versionSpec{networkVersion, atOrBelow}',
  },
  {
    label: 'stateMigrations — 상태 업그레이드',
    body: 'map[ChainEpoch]*migration',
  },
  {
    label: 'execTraceCache — 디버깅 캐시',
    body: 'ARC[TipSetKey, tipSetCacheEntry] (기본 16개)',
  },
  {
    label: 'beacon — DRAND 연동',
    body: 'beacon.Schedule로 랜덤값 추출',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'lotus-statemgr',
  1: 'lotus-statemgr',
  2: 'lotus-statemgr',
  3: 'lotus-statemgr',
  4: 'lotus-statemgr',
};
