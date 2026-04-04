export const C = {
  proposer: '#8b5cf6', attest: '#10b981', deposit: '#f59e0b',
  assemble: '#0ea5e9', sign: '#ec4899', why: '#6366f1',
};

export const STEPS = [
  { label: '왜 제안자 선정이 중요한가', body: '매 슬롯 1명, RANDAO 기반 유효 잔액 비례 공정 추첨' },
  { label: '① ComputeProposerIndex', body: 'RANDAO 시드 + 활성 검증자 목록으로 제안자 결정' },
  { label: '② 어테스테이션 수집', body: '풀에서 호환 어테스테이션을 필터링하여 최대 128개 포함' },
  { label: '③ 예치금 & eth1 데이터', body: 'eth1 예치금 수집 + eth1_data_votes용 블록 해시 결정' },
  { label: '④ BeaconBlock 조립', body: 'RANDAO reveal, attestations, deposits 등을 모아 구조체 완성' },
  { label: '⑤ BLS 서명 & 브로드캐스트', body: 'BLS 개인키로 서명 후 gossipsub에 브로드캐스트' },
];

export const NODES = [
  { id: 'why', label: '제안자 선정', x: 15, y: 15 },
  { id: 'proposer', label: 'ProposerIndex', x: 240, y: 15 },
  { id: 'attest', label: 'attestations', x: 465, y: 15 },
  { id: 'deposit', label: 'deposits', x: 15, y: 115 },
  { id: 'assemble', label: 'BeaconBlock', x: 240, y: 115 },
  { id: 'sign', label: 'BLS 서명', x: 465, y: 115 },
];

export const EDGES = [
  { from: 0, to: 1, label: 'RANDAO' },
  { from: 1, to: 2, label: '풀 조회' },
  { from: 2, to: 3, label: 'eth1' },
  { from: 3, to: 4, label: '조립' },
  { from: 4, to: 5, label: '서명' },
];
