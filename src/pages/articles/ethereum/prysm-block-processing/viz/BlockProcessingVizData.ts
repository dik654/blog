export const C = {
  header: '#8b5cf6', randao: '#10b981', ops: '#f59e0b',
  exec: '#ef4444', why: '#6366f1', eth1: '#0ea5e9',
};

export const STEPS = [
  { label: '왜 블록 검증이 필요한가', body: 'P2P로 수신한 블록이 프로토콜 규칙을 따르는지 단계별 확인' },
  { label: '① process_block_header', body: '제안자 인덱스, 부모 루트 일치, 슬래싱 여부를 검증' },
  { label: '② RANDAO mix 갱신', body: '제안자의 BLS 서명으로 reveal 검증 후 XOR로 randaoMixes 갱신' },
  { label: '③ eth1 데이터 투표', body: 'eth1 블록 해시와 예치금 루트를 투표, 과반 일치 시 반영' },
  { label: '④ Operations 처리', body: 'attestation, deposit, exit, slashing 등 오퍼레이션을 순차 실행' },
  { label: '⑤ Execution Payload', body: 'Engine API NewPayload로 실행 페이로드를 EL에 전달하여 검증' },
];

export const NODES = [
  { id: 'why', label: '블록 검증', x: 15, y: 15 },
  { id: 'header', label: 'block_header', x: 240, y: 15 },
  { id: 'randao', label: 'RANDAO mix', x: 465, y: 15 },
  { id: 'eth1', label: 'eth1 투표', x: 15, y: 115 },
  { id: 'ops', label: 'Operations', x: 240, y: 115 },
  { id: 'exec', label: 'NewPayload', x: 465, y: 115 },
];

export const EDGES = [
  { from: 0, to: 1, label: '헤더' },
  { from: 1, to: 2, label: 'RANDAO' },
  { from: 2, to: 3, label: 'eth1' },
  { from: 3, to: 4, label: '오퍼레이션' },
  { from: 4, to: 5, label: 'EL 검증' },
];
