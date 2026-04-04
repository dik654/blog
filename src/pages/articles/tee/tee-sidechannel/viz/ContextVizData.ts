export const C = { attack: '#ef4444', cache: '#6366f1', ok: '#10b981', spec: '#f59e0b' };

export const STEPS = [
  {
    label: 'CLFLUSH + RDTSC: 캐시 라인 타이밍 측정',
    body: 'CLFLUSH(addr) → TEE 실행 → RDTSC 전후 차이로 캐시 HIT/MISS 판별 (L1 ~4 cycle vs DRAM ~200)',
  },
  {
    label: 'Spectre v1: 분기 예측 + 투기적 메모리 로드',
    body: 'if (x < array_len) 에서 분기 예측 실패 시에도 array[x]가 캐시에 로드 → 타이밍으로 x 유추',
  },
  {
    label: 'Prime+Probe: 캐시 셋 전체를 공격자가 채움',
    body: 'Prime: eviction_set으로 캐시 셋 채움 → TEE 실행 → Probe: 느린 라인 = TEE가 접근한 라인',
  },
  {
    label: '방어: LFENCE + Constant-time + 캐시 파티셔닝',
    body: 'LFENCE로 투기적 실행 차단, cmov로 분기 제거, Intel CAT로 캐시 웨이 격리 할당',
  },
];
