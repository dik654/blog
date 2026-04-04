export const OVERVIEW_STEPS = [
  { label: 'Kubo 전체 구조' },
  { label: 'libp2p 네트워크' },
  { label: '콘텐츠 교환' },
  { label: '저장 & 서빙' },
];

export const ARCH_NODES = [
  { id: 'api', label: 'HTTP API', color: '#6366f1', x: 10, y: 5 },
  { id: 'gw', label: 'Gateway', color: '#0ea5e9', x: 130, y: 5 },
  { id: 'core', label: 'IPFS Core', color: '#8b5cf6', x: 70, y: 60 },
  { id: 'bitswap', label: 'Bitswap', color: '#10b981', x: 10, y: 120 },
  { id: 'dht', label: 'Kademlia DHT', color: '#f59e0b', x: 130, y: 120 },
  { id: 'bs', label: 'Blockstore', color: '#ef4444', x: 10, y: 180 },
  { id: 'p2p', label: 'libp2p', color: '#ec4899', x: 130, y: 180 },
];

export const ARCH_EDGES = [
  { from: 0, to: 2, label: 'RPC' },
  { from: 1, to: 2, label: 'HTTP' },
  { from: 2, to: 3, label: '블록 교환' },
  { from: 2, to: 4, label: '라우팅' },
  { from: 3, to: 5, label: '저장' },
  { from: 3, to: 6, label: '전송' },
  { from: 4, to: 6, label: '전송' },
];

export const ARCH_VN = [[0, 1, 2, 3, 4, 5, 6], [5, 6], [2, 3, 4], [0, 1, 2, 5]];
export const ARCH_VE = [[0, 1, 2, 3, 4, 5, 6], [5, 6], [2, 3, 4, 5, 6], [0, 1, 4]];
