export const B = {
  client: { label: 'Client', x: 10, y: 8, w: 60, h: 20, color: '#a855f7' },
  api:    { label: 'API Server', x: 10, y: 42, w: 60, h: 20, color: '#6366f1' },
  zmq:    { label: 'ZeroMQ IPC', x: 95, y: 42, w: 60, h: 20, color: '#f59e0b' },
  sched:  { label: 'Scheduler', x: 180, y: 30, w: 60, h: 20, color: '#10b981' },
  kv:     { label: 'KV Cache', x: 180, y: 60, w: 60, h: 20, color: '#3b82f6' },
  worker: { label: 'GPU Worker', x: 265, y: 30, w: 70, h: 20, color: '#8b5cf6' },
  flash:  { label: 'FlashAttn', x: 265, y: 60, w: 34, h: 16, color: '#ef4444' },
  cuda:   { label: 'CUDA Graph', x: 301, y: 60, w: 34, h: 16, color: '#ec4899' },
};

export const GRP = [
  { label: 'API Process', x: 5, y: 36, w: 70, h: 30, c: '#6366f130' },
  { label: 'EngineCore', x: 90, y: 24, w: 80, h: 60, c: '#10b98120' },
  { label: 'Worker', x: 260, y: 24, w: 80, h: 56, c: '#8b5cf620' },
];

export type K = keyof typeof B;

export const VIS: K[][] = [
  ['client', 'api', 'zmq', 'sched', 'kv', 'worker', 'flash', 'cuda'],
  ['client', 'api', 'zmq'],
  ['zmq', 'sched', 'kv'],
  ['sched', 'worker', 'flash', 'cuda', 'zmq'],
];

export const STEPS = [
  { label: 'V1 멀티프로세스 구조' },
  { label: 'Client → API → EngineCore' },
  { label: 'Scheduler + KV Cache' },
  { label: 'GPU Worker 실행' },
];

export const BODY = [
  'API / EngineCore / Worker 분리',
  'FastAPI → ZeroMQ → EngineCore',
  '배치 결정 + KV 블록 할당',
  'FlashAttn + CUDA Graphs 실행',
];
