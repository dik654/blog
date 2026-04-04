export const C = { epoch: '#8b5cf6', reward: '#10b981', err: '#ef4444', ok: '#10b981', slash: '#f59e0b' };

export const STEPS = [
  {
    label: '32슬롯마다 정산이 필요',
    body: '에폭(32슬롯, ~6.4분) 종료 시 보상, 패널티, 검증자 상태를 정산해야 합니다.',
  },
  {
    label: '문제: 연산 집약적',
    body: '수십만 검증자의 어테스테이션 집계와 보상/패널티 계산을 12초 안에 처리해야 합니다.',
  },
  {
    label: '문제: 순서 의존성',
    body: 'Justification → Rewards → Registry 순서가 고정되며 포크별 보상 공식이 다릅니다.',
  },
  {
    label: '해결: Precompute 일괄 집계',
    body: '검증자별 참여 통계를 O(N) 단일 패스로 사전 계산합니다.',
  },
  {
    label: '해결: 7단계 순차 파이프라인',
    body: 'Precompute → Justification → Inactivity → Rewards → Registry → Slashings → Effective Balance입니다.',
  },
];
