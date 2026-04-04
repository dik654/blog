export const C = { why: '#8b5cf6', tick: '#6366f1', duty: '#10b981', exec: '#f59e0b', sign: '#ef4444', submit: '#3b82f6' };

export const STEPS = [
  { label: '왜 별도 바이너리인가', body: '검증자 키를 비콘 노드와 분리하여 키 유출 시 영향을 최소화' },
  { label: '① 슬롯 틱 수신', body: 'NextSlot() 채널에서 12초마다 새 슬롯 번호 수신' },
  { label: '② RolesAt 의무 조회', body: 'gRPC로 Proposer, Attester, SyncCommittee, Aggregator 역할 질의' },
  { label: '③ 역할별 실행', body: 'ProposeBlock / SubmitAttestation / SyncCommitteeMessage를 병렬 실행' },
  { label: '④ 서명 + 슬래싱 DB 확인', body: 'SlashingProtectionDB로 이중 투표 여부 확인 후 BLS 서명 생성' },
  { label: '⑤ 비콘 노드에 제출', body: '서명된 블록/어테스테이션을 gRPC로 전송, gossip 브로드캐스트' },
];

export const NODES = [
  { id: 'vclient', label: 'Validator Client', x: 15, y: 20 },
  { id: 'tick', label: '슬롯 틱', x: 225, y: 20 },
  { id: 'roles', label: 'RolesAt()', x: 435, y: 20 },
  { id: 'propose', label: 'ProposeBlock', x: 25, y: 110 },
  { id: 'attest', label: 'Attestation', x: 230, y: 110 },
  { id: 'sync', label: 'SyncCommittee', x: 435, y: 110 },
  { id: 'sign', label: 'BLS 서명', x: 120, y: 200 },
  { id: 'beacon', label: 'Beacon Node', x: 330, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: '12초' },
  { from: 1, to: 2, label: 'gRPC' },
  { from: 2, to: 3, label: 'proposer' },
  { from: 2, to: 4, label: 'attester' },
  { from: 2, to: 5, label: 'sync' },
  { from: 3, to: 6, label: '서명 요청' },
  { from: 6, to: 7, label: '제출' },
];
