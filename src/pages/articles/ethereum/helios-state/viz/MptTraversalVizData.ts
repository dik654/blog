/** MptTraversal Viz — 색상 상수 + step 정의 */

export const C = {
  nibble: '#6366f1',   // nibble 변환 (인디고)
  hash: '#10b981',     // 해시 체인 검증 (에메랄드)
  branch: '#f59e0b',   // Branch 노드 (앰버)
  extLeaf: '#8b5cf6',  // Extension + Leaf (보라)
  walk: '#06b6d4',     // 전체 순회 (시안)
  danger: '#ef4444',   // 위조 탐지 (레드)
};

export const STEPS = [
  {
    label: '단계 0: 주소 → 64 nibble 경로',
    body: 'keccak256(address)의 32바이트 해시를 64개의 nibble(4비트)로 분해한다.\n각 nibble은 0~f 범위의 값으로, Branch 노드에서 16개 자식 중 하나를 선택하는 인덱스가 된다.',
  },
  {
    label: '단계 1: 해시 체인 검증 — 루트부터 리프까지',
    body: '매 노드마다 keccak256(node) == expected_hash를 확인한다.\n첫 노드의 expected_hash는 state_root(BLS 검증 완료). 이후 부모가 가리킨 해시가 자식의 실제 해시와 일치해야 한다.',
  },
  {
    label: '단계 2: Branch 노드 — nibble로 자식 선택',
    body: 'Branch 노드는 17개 항목: children[0..15] + value[16].\nnibble 값(0~f)이 곧 children 인덱스. 선택된 자식의 해시가 다음 expected_hash가 되고, path_offset이 1 증가한다.',
  },
  {
    label: '단계 3: Extension + Leaf — 경로 압축과 값 추출',
    body: 'Extension: 공통 nibble을 한 번에 건너뜀 (path_offset += shared.len).\nLeaf: 나머지 경로가 일치하면 items[1]이 최종 값. HP 인코딩의 상위 nibble로 Extension(0,1)과 Leaf(2,3)를 구분한다.',
  },
  {
    label: '전체 순회: root → Branch → Extension → Branch → Leaf',
    body: 'path_offset이 0에서 시작해 Branch마다 +1, Extension에서 +N, Leaf에서 done.\n실제 이더리움에서 proof 배열은 보통 4~8개 노드. Extension 압축 덕분에 64보다 훨씬 적은 깊이로 도달한다.',
  },
];
