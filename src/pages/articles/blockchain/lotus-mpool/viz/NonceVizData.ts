export const C = {
  ok: '#10b981', wait: '#8b5cf6', err: '#ef4444', miner: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Nonce 순차 관리',
    body: '계정별 nonce 순차 증가\n갭 허용 안 함: nonce 5 없으면 6도 실행 불가',
  },
  {
    label: '마이너의 대량 메시지 문제',
    body: 'WindowPoSt, PreCommit, ProveCommit 등 대량 발송\n하나의 nonce 갭 → 뒤따르는 모든 메시지 블로킹',
  },
  {
    label: 'MpoolPushMessage 자동 할당',
    body: 'Lotus API가 자동으로 nonce 할당\npending 맵에서 다음 nonce 계산 → 갭 방지',
  },
];
