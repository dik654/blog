export const C = {
  core: '#8b5cf6', sync: '#10b981', p2p: '#0ea5e9',
  db: '#ef4444', validator: '#f59e0b', crypto: '#ec4899',
  api: '#6366f1', fork: '#14b8a6',
};

export const MODS = [
  { id: 'prysm', label: 'Prysm', desc: 'CL 클라이언트', color: C.core, x: 230, y: 5 },
  { id: 'p2p', label: 'libp2p', desc: 'P2P 네트워크', color: C.p2p, x: 5, y: 105 },
  { id: 'sync', label: 'Sync', desc: '블록 동기화', color: C.sync, x: 135, y: 105 },
  { id: 'state', label: 'State', desc: '비콘 상태', color: C.core, x: 265, y: 105 },
  { id: 'fork', label: 'Forkchoice', desc: 'LMD-GHOST', color: C.fork, x: 395, y: 105 },
  { id: 'validator', label: 'Validator', desc: '검증자', color: C.validator, x: 65, y: 215 },
  { id: 'db', label: 'BeaconDB', desc: 'BoltDB/KV', color: C.db, x: 200, y: 215 },
  { id: 'crypto', label: 'BLS/SSZ', desc: '암호·직렬화', color: C.crypto, x: 340, y: 215 },
  { id: 'api', label: 'Beacon API', desc: 'gRPC/REST', color: C.api, x: 510, y: 105 },
];

export const ROUTES = [
  { from: 0, to: 1, label: 'Gossip' },
  { from: 0, to: 2, label: 'Sync' },
  { from: 0, to: 3, label: 'State' },
  { from: 0, to: 4, label: 'Fork' },
  { from: 0, to: 8, label: 'API' },
  { from: 2, to: 1, label: 'Fetch' },
  { from: 3, to: 6, label: 'Persist' },
  { from: 5, to: 7, label: 'Sign' },
];

export const STEPS = [
  { label: 'Prysm 전체 아키텍처' },
  { label: 'P2P & 동기화' },
  { label: '상태 & 포크 선택' },
  { label: '검증자 & API' },
];

export const ANNOT = [
  'CL 클라이언트 전체 구조',
  'libp2p 피어 연결 + 동기화',
  '비콘 상태 관리 + LMD-GHOST',
  '검증자 의무 수행 + API 제공',
];

export const ACTIVE: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [0, 1, 5],
  [2, 3, 6],
  [4, 7, 8],
];
