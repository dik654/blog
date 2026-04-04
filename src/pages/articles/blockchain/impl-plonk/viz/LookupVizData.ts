export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Plookup — 테이블 멤버십 증명이 필요한 이유',
    body: 'Plookup으로 range check가 O(1) — 게이트 16개 대신 테이블 lookup 1개',
  },
  {
    label: 'LookupTable — 사전 정의된 유효 값 테이블',
    body: 'range_table(8): {0..255}, xor_table: alpha 인코딩으로 유일하게 디코딩',
  },
  {
    label: 'Sorted Merge — f ∪ T를 T 순서로 정렬',
    body: 'f∪T를 정렬 → h1, h2로 분리 (1개 중첩) — 연속 쌍으로 전체 커버',
  },
  {
    label: 'Grand Product — Z_lookup이 1로 돌아오면 정렬 올바름',
    body: '인접 쌍의 랜덤 선형 결합 — Z_lookup이 1로 돌아오면 정렬 올바름',
  },
];

export const STEP_REFS = ['lookup-sort', 'lookup-sort', 'lookup-sort', 'lookup-grand'];
export const STEP_LABELS = ['lookup.rs — 왜 Plookup?', 'lookup.rs — LookupTable', 'lookup.rs — sorted merge', 'lookup.rs — grand product'];
