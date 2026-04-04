export const C = { init: '#8b5cf6', batch: '#3b82f6', proc: '#10b981', ckpt: '#f59e0b', back: '#ef4444', reg: '#ec4899' };

export const STEPS = [
  { label: '왜 동기화가 필요한가', body: '새 노드는 기존 피어에서 블록을 받아 상태를 재구축해야 한다' },
  { label: '① Initial Sync: 배치 요청', body: 'BlocksByRange RPC로 여러 피어에 라운드로빈 분산 병렬 다운로드' },
  { label: '② 블록 순차 처리', body: '슬롯 순서대로 정렬 후 하나씩 상태 전환 실행 (병렬 불가)' },
  { label: '③ Checkpoint Sync: 상태 직접 다운로드', body: 'Finalized 상태를 신뢰 소스에서 직접 DL, 수 분 안에 완료' },
  { label: '④ Backfill: 과거 블록 채우기', body: '체크포인트 이전 블록을 역방향으로 저장 (상태 전환 없이 빠름)' },
  { label: '⑤ Regular Sync: 실시간 처리', body: '초기 동기화 완료 후 GossipSub로 실시간 수신·검증·처리' },
];

export const NODES = [
  { id: 'start', label: '새 노드', x: 240, y: 10 },
  { id: 'batch', label: 'BatchRequest', x: 30, y: 80 },
  { id: 'process', label: '순차 처리', x: 240, y: 80 },
  { id: 'ckpt', label: '체크포인트 DL', x: 450, y: 80 },
  { id: 'backfill', label: 'Backfill', x: 130, y: 170 },
  { id: 'regular', label: 'Regular Sync', x: 340, y: 170 },
  { id: 'head', label: '최신 헤드', x: 240, y: 250 },
];

export const EDGES = [
  { from: 0, to: 1, label: 'RPC 요청' },
  { from: 1, to: 2, label: '정렬' },
  { from: 0, to: 3, label: '상태 DL' },
  { from: 3, to: 4, label: '역방향' },
  { from: 2, to: 5, label: '완료' },
  { from: 5, to: 6, label: 'gossip' },
];
