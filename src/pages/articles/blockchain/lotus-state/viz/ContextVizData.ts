export const C = { actor: '#6366f1', hamt: '#10b981', amt: '#f59e0b', state: '#8b5cf6', err: '#ef4444' };

export const STEPS = [
  {
    label: 'Filecoin의 상태 모델',
    body: '이더리움: Account → 잔고/nonce/코드',
  },
  {
    label: 'HAMT: 상태 저장의 핵심',
    body: 'Hash Array Mapped Trie',
  },
  {
    label: 'AMT: 순서 있는 배열',
    body: 'Array Mapped Trie — 인덱스 기반 접근',
  },
  {
    label: 'StateTree = HAMT root',
    body: 'StateTree: Actor 주소 → Actor 상태 매핑',
  },
];
