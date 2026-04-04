export const C = {
  slot: '#8b5cf6', cache: '#10b981', epoch: '#f59e0b',
  loop: '#0ea5e9', why: '#6366f1', inc: '#ec4899',
};

export const STEPS = [
  { label: '왜 12초마다 슬롯을 처리하는가', body: '빈 슬롯도 상태 루트를 캐싱하고 카운터를 증가시켜야 체인이 연속' },
  { label: '① ProcessSlots 루프', body: 'state.Slot()이 목표 슬롯보다 작은 동안 빈 슬롯도 하나씩 반복 처리' },
  { label: '② 상태 루트 캐싱', body: 'HashTreeRoot 계산 후 stateRoots 링 버퍼에 저장' },
  { label: '③ 슬롯 증가', body: 'state.SetSlot(slot + 1) — 상태 전환의 핵심 단위' },
  { label: '④ 에폭 경계 체크', body: 'slot+1이 에폭 시작 슬롯이면 에폭 전환을 트리거(32슬롯마다)' },
  { label: '⑤ ProcessEpoch 트리거', body: '에폭 경계에서 보상/패널티, 레지스트리 갱신, 최종화 실행' },
];

export const NODES = [
  { id: 'why', label: '왜 12초 슬롯?', x: 15, y: 15 },
  { id: 'loop', label: 'ProcessSlots', x: 240, y: 15 },
  { id: 'cache', label: '루트 캐싱', x: 465, y: 15 },
  { id: 'inc', label: 'slot++', x: 15, y: 115 },
  { id: 'check', label: '에폭 경계?', x: 240, y: 115 },
  { id: 'epoch', label: 'ProcessEpoch', x: 465, y: 115 },
];

export const EDGES = [
  { from: 0, to: 1, label: '루프 시작' },
  { from: 1, to: 2, label: 'HashRoot' },
  { from: 1, to: 3, label: 'slot++' },
  { from: 3, to: 4, label: '경계?' },
  { from: 4, to: 5, label: '에폭 처리' },
];
