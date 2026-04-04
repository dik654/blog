/** ProofTrace Viz — 색상 상수 + step 정의 */

export const C = {
  keccak: '#6366f1',   // keccak256 해시 (인디고)
  mpt: '#10b981',      // Merkle-Patricia Trie (에메랄드)
  rlp: '#f59e0b',      // RLP 디코딩 (앰버)
  nested: '#8b5cf6',   // 중첩 트라이 (보라)
  pipeline: '#06b6d4', // 전체 파이프라인 (시안)
};

export const STEPS = [
  {
    label: '단계 1: 주소 → 트라이 경로 (keccak256)',
    body: 'keccak256(address) → 32바이트 해시.\n주소 분포가 편향되어도 해시가 균등하므로 트라이가 한쪽으로 깊어지지 않는다.',
  },
  {
    label: '단계 2: Merkle-Patricia Trie 경로 검증',
    body: 'account_proof 배열의 각 노드를 루트부터 순서대로 검증한다.\nBranch(16분기), Extension(공통경로 압축), Leaf(최종값) — 3가지 노드 타입으로 구성.',
  },
  {
    label: '단계 3: RLP 디코딩 — 바이트 → Account 구조체',
    body: '리프 노드의 값을 RLP 디코딩하여 4개 필드로 분해한다.\nnonce, balance, storage_root, code_hash — 이더리움 계정의 완전한 상태.',
  },
  {
    label: '단계 4: 중첩 트라이 — State Trie → Storage Trie',
    body: '계정 증명에서 획득한 storage_root가 스토리지 트라이의 루트.\n"트라이 안의 트라이" 2단계 구조로, 공격자가 가짜 storage_root를 제출하면 1단계에서 차단.',
  },
  {
    label: '전체 파이프라인 — verify_account_proof + verify_storage_proof',
    body: 'eth_getBalance: keccak→MPT→RLP→balance 추출. ~0.5ms.\nReth는 DB 직접 읽기(~0.1ms)지만 700GB 저장 필요. Helios는 저장 0, 증명만으로 동일 신뢰.',
  },
];
