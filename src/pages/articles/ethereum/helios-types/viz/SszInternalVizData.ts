/** SszInternal Viz — 색상 + 스텝 정의 */

export const C = {
  ssz: '#6366f1',      // 보라 — SSZ 인코딩
  chunk: '#0ea5e9',    // 하늘 — 32B 청크
  merkle: '#f59e0b',   // 앰버 — Merkle tree / hash
  index: '#10b981',    // 녹색 — generalized index
  verify: '#8b5cf6',   // 바이올렛 — 검증
  muted: '#94a3b8',    // 회색 — 비활성/패딩
  alert: '#ef4444',    // 빨강 — RLP 비교
};

export const STEPS = [
  {
    label: 'SSZ 인코딩 — 고정 크기 필드를 연결(concat)하면 끝',
    body: 'BeaconBlockHeader 5필드: slot(8B) + proposer_index(8B) + parent_root(32B) + state_root(32B) + body_root(32B) = 112B.\nRLP는 길이 접두사(length prefix) → 순차 파싱 O(n). SSZ는 offset → O(1) 필드 접근.',
  },
  {
    label: 'hash_tree_root — 청크를 Merkle 트리로 해싱',
    body: '각 필드를 32B 청크로 패딩 → 2의 거듭제곱까지 빈 청크 추가 → 바이너리 Merkle 트리.\n인접 두 청크를 SHA-256으로 해싱, 반복하면 32B root가 나온다.',
  },
  {
    label: 'generalized index — 트리 노드에 고유 번호 부여',
    body: 'root=1, left=2n, right=2n+1. 공식: 2^depth + field_index.\nBeaconState의 current_sync_committee → 2^5 + 22 = 54.',
  },
  {
    label: 'is_valid_merkle_branch() — leaf에서 root까지 재구성',
    body: 'leaf hash + 형제 해시 depth개로 root를 재계산.\nindex 짝/홀로 왼쪽/오른쪽 판단. 재구성 root == state_root이면 증명 유효.',
  },
];
