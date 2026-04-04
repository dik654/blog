export const C = { proto: '#6366f1', perf: '#10b981', sec: '#f59e0b', use: '#ef4444' };

export const STEPS = [
  {
    label: '다양한 합의 프로토콜',
    body: 'PBFT, HotStuff, Tendermint, Narwhal/Bullshark,',
  },
  {
    label: '어떤 기준으로 비교할 것인가',
    body: '처리량 (TPS), 지연 (latency), 최종성 시간',
  },
  {
    label: '안전성 vs 활성',
    body: 'BFT: 안전성 우선 (합의 불가 시 멈춤)',
  },
  {
    label: '용도에 맞는 합의 선택',
    body: '결제: BFT (즉시 확정) / 대규모 L1: Avalanche (확장성)',
  },
];
