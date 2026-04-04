export const LAYERS = 11;

export const layerInfo = [
  'replica_id + layer_0 + node_id + SHA256(parents)',
  '이전 레이어 레이블을 부모로 참조 (DRG 6개 + expander 8개)',
  '순차적 SHA256 체인 — 병렬화 불가',
  '각 노드: label[i] = SHA256(replica_id ‖ layer ‖ node_id ‖ labels[parents])',
  'TOTAL_PARENTS = 37 (DRG 6 + expander 31)',
  '레이어간 참조로 시간적 의존성 형성',
  '중간 레이어 TreeC 컬럼 해시 기여',
  'column_hash[i] = Poseidon(label[1][i], ..., label[11][i])',
  '각 레이어 완료 후 다음 레이어만 계산 가능',
  '마지막 레이어 레이블이 복제본 인코딩에 사용됨',
  'replica[i] = label[11][i] XOR data[i] → TreeR 구성',
];

export const PC2_ITEMS = [
  { label: 'TreeC 생성', color: 'bg-purple-500', desc: 'column_hash[i] = Poseidon(layer[1..11][i]) → Merkle 트리 → comm_c' },
  { label: '복제본 인코딩', color: 'bg-orange-500', desc: 'replica[i] = AES-256(label[11][i], data[i]) — GPU 가속' },
  { label: 'TreeR 생성', color: 'bg-red-500', desc: 'Poseidon Arity-8 Merkle(replica) → comm_r_last' },
  { label: 'comm_r 계산', color: 'bg-emerald-500', desc: 'comm_r = SHA256(comm_c ‖ comm_r_last) → 온체인 등록' },
];
