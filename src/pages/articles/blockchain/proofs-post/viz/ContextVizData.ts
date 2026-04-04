export const C = { window: '#6366f1', winning: '#10b981', fault: '#ef4444', chain: '#f59e0b', ok: '#0ea5e9' };

export const STEPS = [
  {
    label: 'PoSt란?',
    body: 'PoRep은 "데이터를 봉인했음"을 1회 증명',
  },
  {
    label: 'WindowPoSt: 48 데드라인 구조',
    body: '24시간을 48개 데드라인(각 30분)으로 분할',
  },
  {
    label: 'WinningPoSt: 블록 생산 추첨',
    body: '매 에폭(30초)마다 DRAND VRF로 추첨',
  },
  {
    label: 'Fault & Recovery',
    body: '데드라인 미제출 → 자동 Fault 선언',
  },
];
