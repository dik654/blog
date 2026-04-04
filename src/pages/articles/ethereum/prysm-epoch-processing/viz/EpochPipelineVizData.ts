export const C = {
  just: '#8b5cf6', reward: '#10b981', slash: '#ef4444',
  reg: '#f59e0b', bal: '#0ea5e9', why: '#6366f1',
};

export const STEPS = [
  { label: '왜 에폭 전환이 필요한가', body: '32슬롯(~6.4분)마다 보상/패널티 정산, 체크포인트 최종화, 레지스트리 갱신' },
  { label: '① Justification & Finalization', body: '타겟 투표 비율 2/3 초과 시 justified → finalized 전환' },
  { label: '② Inactivity Scores', body: 'Altair 도입, 비활성 검증자에 누적 페널티로 네트워크 복구 유도' },
  { label: '③ Rewards & Penalties', body: '소스/타겟/헤드 참여도에 따라 보상 또는 패널티를 잔액에 반영' },
  { label: '④ Registry & Slashings', body: '활성화 대기열, 자발적 이탈, 슬래싱 감액 등 상태 전환 처리' },
  { label: '⑤ Effective Balance Update', body: '실제 잔액과 유효 잔액의 차이가 임계값 초과 시 갱신' },
];

export const NODES = [
  { id: 'why', label: '에폭 전환', x: 15, y: 15 },
  { id: 'just', label: 'Justification', x: 240, y: 15 },
  { id: 'inact', label: 'Inactivity', x: 465, y: 15 },
  { id: 'reward', label: 'Rewards', x: 15, y: 115 },
  { id: 'reg', label: 'Registry', x: 240, y: 115 },
  { id: 'bal', label: 'Eff. Balance', x: 465, y: 115 },
];

export const EDGES = [
  { from: 0, to: 1, label: '2/3 투표' },
  { from: 1, to: 2, label: '비활성' },
  { from: 2, to: 3, label: '보상' },
  { from: 3, to: 4, label: '레지스트리' },
  { from: 4, to: 5, label: '잔액' },
];
