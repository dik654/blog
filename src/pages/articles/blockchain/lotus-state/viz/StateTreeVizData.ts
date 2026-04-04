export const C = {
  tree: '#8b5cf6', hamt: '#10b981', store: '#0ea5e9', snap: '#f59e0b',
};

export const STEPS = [
  {
    label: 'StateTree 구조',
    body: 'HAMT root + IPLD Store로 구성',
  },
  {
    label: 'GetActor: 주소 → Actor',
    body: 'f0 ID 주소로 변환 (LookupID)',
  },
  {
    label: 'Flush: 상태 영속화',
    body: '변경된 HAMT 노드를 CBOR 직렬화',
  },
  {
    label: '스냅샷 & 공유',
    body: '에폭마다 새 state root 생성',
  },
];
