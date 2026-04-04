export const C = {
  state: '#8b5cf6', field: '#10b981', hash: '#f59e0b',
  cow: '#0ea5e9', fork: '#ec4899', why: '#6366f1',
};

export const STEPS = [
  { label: '왜 BeaconState가 거대한가', body: '수십만 검증자의 잔액·상태·어테스테이션을 매 슬롯마다 추적' },
  { label: '① BeaconState 구조체', body: '20+ 필드, 각 필드는 독립적인 Merkle 서브트리를 형성' },
  { label: '② fieldIndex 열거형', body: 'dirtyFields[fieldIndex]로 변경된 필드만 추적하여 불필요한 해시 방지' },
  { label: '③ Copy-on-Write', body: '상태 복사 시 참조만 공유, 수정 시에만 해당 필드를 복사하여 메모리 절약' },
  { label: '④ FieldTrie 해시 캐싱', body: '변경된 인덱스만 recomputeFieldTrie()로 갱신 — O(log n)' },
  { label: '⑤ 포크별 상태 업그레이드', body: 'Phase0→Altair→Bellatrix→Capella→Deneb, UpgradeToAltair() 등 인플레이스 변환' },
];

export const NODES = [
  { id: 'why', label: '왜 거대한가?', x: 15, y: 15 },
  { id: 'struct', label: 'BeaconState', x: 235, y: 15 },
  { id: 'fields', label: 'fieldIndex', x: 455, y: 15 },
  { id: 'cow', label: 'Copy-on-Write', x: 15, y: 115 },
  { id: 'trie', label: 'FieldTrie', x: 235, y: 115 },
  { id: 'fork', label: '포크 업그레이드', x: 455, y: 115 },
];

export const EDGES = [
  { from: 0, to: 1, label: '구조' },
  { from: 1, to: 2, label: '인덱스' },
  { from: 1, to: 3, label: 'COW' },
  { from: 2, to: 4, label: '캐싱' },
  { from: 4, to: 5, label: '버전' },
];
