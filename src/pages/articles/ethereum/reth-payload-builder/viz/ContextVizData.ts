export const C = { cl: '#6366f1', err: '#ef4444', ok: '#10b981', builder: '#f59e0b', engine: '#0ea5e9' };

export const STEPS = [
  {
    label: '검증자의 블록 제안 의무',
    body: '블록 제안자로 선정되면 12초 슬롯 안에 유효한 블록을 조립해야 합니다.',
  },
  {
    label: '문제: 12초 시간 제한',
    body: 'TX 선택 + 실행 + 상태 루트 계산을 12초 안에 완료하지 못하면 수수료 수익이 0입니다.',
  },
  {
    label: '문제: MEV 경쟁',
    body: 'MEV builder가 더 수익 높은 블록을 제안하므로 로컬 빌더의 수익 최적화가 중요합니다.',
  },
  {
    label: '해결: ForkchoiceUpdated → 백그라운드 빌드',
    body: 'CL의 FCU + payload_attributes 수신 즉시 백그라운드 빌드를 시작하여 GetPayload 전까지 TX를 추가합니다.',
  },
  {
    label: '해결: PayloadBuilder trait',
    body: 'trait 기반으로 MEV builder 교체가 가능하며 GetPayload 시 최적 결과를 즉시 반환합니다.',
  },
];
