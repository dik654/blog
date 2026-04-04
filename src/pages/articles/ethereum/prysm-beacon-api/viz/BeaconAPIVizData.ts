export const C = {
  why: '#8b5cf6', grpc: '#6366f1', register: '#10b981',
  gateway: '#f59e0b', spec: '#ec4899', validator: '#06b6d4',
};

export const STEPS = [
  { label: '왜 이중 API인가', body: 'gRPC(내부) + REST(외부) 두 경로로 생태계 표준 충족' },
  { label: '① gRPC 서버 시작', body: 'TCP 리스너 → gRPC 서버 생성 → 인터셉터 설정 → Serve()' },
  { label: '② 서비스 등록', body: 'BeaconChain, Validator, Node 서버를 도메인별로 등록' },
  { label: '③ gRPC-gateway (REST)', body: 'HTTP → gRPC-gateway가 자동 변환하여 REST 엔드포인트 제공' },
  { label: '④ Beacon API 스펙 준수', body: '/eth/v2/beacon/blocks/{block_id} 등 표준 엔드포인트 지원' },
  { label: '⑤ Validator 엔드포인트', body: '의무 조회, 어테스테이션 제출, 블록 제안 — 매 슬롯 호출 핵심 API' },
];

export const NODES = [
  { id: 'client', label: '클라이언트', x: 15, y: 20 },
  { id: 'grpc', label: 'gRPC 서버', x: 225, y: 20 },
  { id: 'register', label: '서비스 등록', x: 435, y: 20 },
  { id: 'rest', label: 'REST Gateway', x: 15, y: 110 },
  { id: 'beacon', label: 'BeaconChain', x: 225, y: 110 },
  { id: 'validator', label: 'ValidatorAPI', x: 435, y: 110 },
  { id: 'state', label: '상태·블록 DB', x: 225, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: 'gRPC 호출' },
  { from: 1, to: 2, label: '핸들러' },
  { from: 3, to: 1, label: 'HTTP→gRPC' },
  { from: 2, to: 4, label: 'Beacon' },
  { from: 2, to: 5, label: 'Validator' },
  { from: 4, to: 6, label: 'DB 조회' },
];
