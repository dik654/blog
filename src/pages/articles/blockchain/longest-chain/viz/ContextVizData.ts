export const C = { chain: '#6366f1', fork: '#f59e0b', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: '포크(Fork) 발생',
    body: '두 채굴자가 거의 동시에 블록을 생성',
  },
  {
    label: '최장 체인 선택 규칙',
    body: '가장 긴(무거운) 체인을 정식 체인으로 채택',
  },
  {
    label: '확률적 최종성',
    body: '블록 위에 더 많은 블록이 쌓일수록 번복 확률 감소',
  },
  {
    label: 'BFT vs 최장 체인',
    body: 'BFT: 결정론적 최종성, 소수 검증자',
  },
];
