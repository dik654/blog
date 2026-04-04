export const C = {
  internal: '#6366f1',
  leaf: '#10b981',
  overflow: '#f59e0b',
  path: '#ef4444',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'B+tree 페이지 단위: OS 페이지(4KB) 기반',
    body: 'MDBX는 OS의 가상 메모리 페이지(보통 4096 바이트)를 저장 단위로 사용합니다.\n각 페이지는 Internal(분기), Leaf(데이터), Overflow(대형 값) 중 하나입니다.',
  },
  {
    label: 'Internal Node: 키 + 자식 포인터 배열',
    body: '각 Internal 노드는 [key | child_pgno] 쌍을 정렬 순서로 보관합니다.\nkey 값으로 이진 탐색하여 다음 레벨 페이지를 결정합니다.',
  },
  {
    label: 'Leaf Node: 키 + 데이터 쌍',
    body: 'Leaf 노드에 실제 key-value 데이터가 저장됩니다.\n값이 페이지에 맞으면 인라인, 4KB를 초과하면 Overflow 페이지에 별도 저장합니다.',
  },
  {
    label: 'Overflow Page: 4KB 초과 값 저장',
    body: 'value가 4KB보다 크면 Leaf에는 포인터만 기록하고,\n연속된 Overflow 페이지에 실제 데이터를 저장합니다.',
  },
  {
    label: '검색 경로: Root → Internal → Leaf',
    body: 'key=0x5C 검색 예시: Root에서 이진 탐색 → Internal에서 범위 확인 → Leaf에서 정확한 key를 찾습니다.\ntree depth가 3~4로 디스크 I/O 횟수가 고정됩니다.',
  },
];
