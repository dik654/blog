export const C = {
  why: '#8b5cf6', type: '#6366f1', marshal: '#10b981',
  unmarshal: '#f59e0b', merkle: '#ec4899', proof: '#06b6d4',
};

export const STEPS = [
  { label: 'SSZ가 필요한 이유', body: 'RLP 대비 고정 오프셋 + 바이너리 머클 트리로 상태 증명에 최적화' },
  { label: '① 고정 vs 가변 길이 타입', body: '고정(uint64 등)은 인라인, 가변(List 등)은 4B LE 오프셋으로 위치 기록' },
  { label: '② Marshal: 필드 순차 패킹', body: '고정 필드는 크기대로, 가변 필드는 오프셋 기록 후 뒤에 추가' },
  { label: '③ Unmarshal: 오프셋 → 데이터', body: '고정부에서 오프셋 수집 → 각 구간에서 가변 데이터 역직렬화' },
  { label: '④ Merkleize → HashTreeRoot', body: '32B 청크 패딩 → BitwiseMerkleize로 바이너리 트리 상향 구축' },
  { label: '⑤ GeneralizedIndex & Proof', body: 'BFS 인덱스로 특정 필드의 증명 경로 지정, 라이트 클라이언트 핵심' },
];

export const NODES = [
  { id: 'fields', label: '필드 목록', x: 15, y: 20 },
  { id: 'fixed', label: '고정 크기', x: 225, y: 20 },
  { id: 'variable', label: '가변 (오프셋)', x: 435, y: 20 },
  { id: 'pack', label: 'PackByChunk', x: 15, y: 110 },
  { id: 'merkle', label: 'Merkleize', x: 225, y: 110 },
  { id: 'htr', label: 'HashTreeRoot', x: 435, y: 110 },
  { id: 'proof', label: 'GenIndex Proof', x: 225, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: '타입 분류' },
  { from: 0, to: 2, label: '오프셋 기록' },
  { from: 1, to: 3, label: '32B 청크' },
  { from: 3, to: 4, label: '상향 해시' },
  { from: 4, to: 5, label: '루트' },
  { from: 5, to: 6, label: '형제 경로' },
];
