export const C = { hot: '#8b5cf6', cold: '#3b82f6', err: '#ef4444', ok: '#10b981', replay: '#f59e0b' };

export const STEPS = [
  {
    label: '상태 조회 요구',
    body: 'StateByRoot/Slot 요청에 빠르게 응답해야 RPC와 포크 선택이 작동합니다.',
  },
  {
    label: '문제: 메모리 vs 지연 트레이드오프',
    body: '모든 슬롯 상태를 메모리에 두면 OOM, DB에서 매번 읽으면 응답 지연입니다.',
  },
  {
    label: '문제: 빈 슬롯의 상태 없음',
    body: '에폭 경계에만 DB 저장하므로 빈 슬롯은 가장 가까운 저장 상태에서 replay해야 합니다.',
  },
  {
    label: '해결: Hot/Cold + Replay',
    body: 'Hot(최근 에폭 인메모리) + Cold(DB 에폭 경계) + Replay(빈 슬롯 재적용)으로 구성됩니다.',
  },
  {
    label: '해결: StateSummary + 캐시 교체',
    body: 'StateSummary로 미저장 슬롯을 관리하고 Finalized 경계에서 Hot→Cold 자동 전환합니다.',
  },
];
