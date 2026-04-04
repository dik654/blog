export const C = { fee: '#f59e0b', err: '#ef4444', ok: '#10b981', old: '#6366f1', reth: '#0ea5e9' };

export const STEPS = [
  {
    label: '가스 가격은 왜 예측 가능해야 하는가',
    body: '프로토콜이 가격을 자동 조정해야 지갑 UX와 L2 비용 관리가 가능합니다.',
  },
  {
    label: '문제: first-price auction',
    body: 'EIP-1559 이전에는 사용자가 직접 가격을 입찰하여 과다 입찰이 빈번했습니다.',
  },
  {
    label: '해결: base fee 자동 조정',
    body: '블록 가스 사용률 50% 타깃 기준으로 base fee를 자동 조정하고 소각합니다.',
  },
  {
    label: 'Reth: u128 정수 산술',
    body: 'Geth의 big.Int(힙 할당) 대신 u128(스택 할당)으로 동기화 성능 차이가 누적됩니다.',
  },
];
