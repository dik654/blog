export const STEPS = [
  { label: '전통 SMR: 순차 결합',
    body: 'Replicate → Sequence → Execute가 동기 파이프라인. 가장 느린 단계(합의)가 전체 병목.' },
  { label: 'Decoupled SMR: 3단계 독립',
    body: 'Replicate(ordered_broadcast) · Sequence(Simplex) · Execute(VM) 각각 독립 파이프라인.' },
  { label: '코드 매핑: 모듈 → 역할',
    body: 'broadcast::buffered::Engine — Replicate (데이터 전파)' },
];

export const STEP_REFS: Record<number, string> = {
  0: 'buffered-engine',
  1: 'ordered-engine',
  2: 'ordered-engine',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'engine.rs — 병목 분석',
  1: 'engine.rs — 3단계 분리 아키텍처',
  2: 'engine.rs — 코드 모듈 매핑',
};
