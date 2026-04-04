export const C = { db: '#8b5cf6', bucket: '#3b82f6', save: '#10b981', state: '#f59e0b', prune: '#ef4444', arch: '#ec4899' };

export const STEPS = [
  { label: '왜 BoltDB인가', body: '단일 파일 ACID + B+Tree 읽기 최적화, 읽기 >> 쓰기인 비콘 체인에 적합' },
  { label: '① KV 버킷 구조', body: 'blocksBucket, stateBucket, validatorsBucket 등 유형별 분리' },
  { label: '② SaveBlock 흐름', body: 'HashTreeRoot → SSZ 직렬화 → root→enc 저장 + 슬롯→루트 인덱스' },
  { label: '③ SaveState 흐름', body: 'SSZ 직렬화 → stateBucket에 저장, 크기가 커서 매 슬롯 저장 불가' },
  { label: '④ 프루닝: Finalized 경계', body: 'Finalized 이전 비-캐노니컬 블록/상태를 삭제하여 디스크 제어' },
  { label: '⑤ 아카이벌 모드', body: '--archive 플래그로 프루닝 건너뜀, 전체 히스토리 필요 인프라용' },
];

export const NODES = [
  { id: 'boltdb', label: 'BoltDB', x: 240, y: 10 },
  { id: 'blocks', label: 'blocksBucket', x: 30, y: 80 },
  { id: 'states', label: 'stateBucket', x: 240, y: 80 },
  { id: 'validators', label: 'validatorsBkt', x: 450, y: 80 },
  { id: 'save', label: 'Save 흐름', x: 130, y: 170 },
  { id: 'prune', label: 'Pruning', x: 340, y: 170 },
  { id: 'disk', label: '디스크 파일', x: 240, y: 250 },
];

export const EDGES = [
  { from: 0, to: 1, label: '버킷' },
  { from: 0, to: 2, label: '버킷' },
  { from: 0, to: 3, label: '버킷' },
  { from: 1, to: 4, label: 'SSZ' },
  { from: 2, to: 4, label: 'SSZ' },
  { from: 4, to: 5, label: 'finalized' },
  { from: 5, to: 6, label: '삭제/유지' },
];
