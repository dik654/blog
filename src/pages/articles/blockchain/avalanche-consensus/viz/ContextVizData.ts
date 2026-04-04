export const C = { avax: '#ef4444', bft: '#6366f1', ok: '#10b981', snow: '#0ea5e9' };

export const STEPS = [
  {
    label: 'BFT O(n²) 통신의 한계',
    body: 'PBFT, HotStuff 등 결정론적 BFT는',
  },
  {
    label: '서브샘플링 아이디어',
    body: '전체 노드 대신 소수 k개를 무작위 샘플링해 질의',
  },
  {
    label: 'Snowflake → Snowball 진화',
    body: 'Snowflake: 이진 합의 (연속 α 동의 시 결정)',
  },
  {
    label: 'Avalanche: DAG 위 Snowball',
    body: 'Snowball을 DAG 구조 위에 적용',
  },
];
