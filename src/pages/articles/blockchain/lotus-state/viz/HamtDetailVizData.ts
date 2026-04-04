export const C = { actor: '#6366f1', hamt: '#10b981', amt: '#f59e0b', state: '#8b5cf6' };

export const STEPS = [
  { label: 'HAMT 구조: Bitfield + Pointers', body: '각 노드: Bitfield(32비트) + Pointers 배열' },
  { label: '키 탐색: 해시 슬라이싱', body: 'SHA-256(key) → 비트폭(5) 단위로 슬라이스' },
  { label: 'AMT: 인덱스 기반 접근', body: '섹터 번호 → AMT 인덱스로 직접 접근' },
  { label: 'Flush: IPLD 영속화', body: 'dirty 노드를 CBOR 직렬화 — → 블록스토어에 PUT' },
];
