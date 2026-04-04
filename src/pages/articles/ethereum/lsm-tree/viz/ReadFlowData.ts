export const CM = '#10b981', C0 = '#6366f1', C1 = '#f59e0b', C2 = '#ef4444', CB = '#8b5cf6';

export const STEPS = [
  { label: '1) Memtable 검색 → MISS', body: '가장 먼저 Memtable(메모리)을 검색. O(log n)으로 빠르지만 최근 쓰기만 존재. 없으면 다음 단계.' },
  { label: '2) Immutable Memtable → MISS', body: '아직 flush되지 않은 Immutable Memtable을 검색. 역시 없으면 디스크 레벨로 내려감.' },
  { label: '3) L0 SSTable 검색 — 키 범위 겹침 문제', body: 'L0의 SSTable들은 키 범위가 서로 겹칠 수 있음. 최악의 경우 L0의 모든 파일을 검색해야 함.' },
  { label: '4) L1 → L2 → ... 순회 (Read Amplification)', body: 'L1부터는 키 범위가 겹치지 않아 한 파일만 검색. 하지만 레벨이 깊으면 디스크 I/O가 누적됨.' },
  { label: '블룸 필터로 불필요한 검색 건너뛰기', body: '각 SSTable의 블룸 필터가 "이 키가 없다"를 O(1)로 판별. false positive만 실제 검색 → I/O 대폭 절감.' },
];

export const LEVELS = [
  { label: 'Memtable', x: 30, c: CM },
  { label: 'Immutable', x: 130, c: CM },
  { label: 'L0', x: 230, c: C0 },
  { label: 'L1', x: 330, c: C1 },
  { label: 'L2', x: 430, c: C2 },
];

export const BLOOM_BITS = ['0', '1', '0', '1', '1', '0', '0', '1', '0', '1', '0', '0'];
export const L0_RANGES = [{ a: 'a-f', y: 145 }, { a: 'c-m', y: 160 }, { a: 'b-k', y: 175 }];
