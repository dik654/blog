export const C = { mesh: '#8b5cf6', topic: '#3b82f6', err: '#ef4444', ok: '#10b981', msg: '#f59e0b' };

export const STEPS = [
  {
    label: '12초 안에 전체 전파',
    body: '블록과 어테스테이션이 수초 내에 전체 네트워크에 도달해야 합의가 작동합니다.',
  },
  {
    label: '문제: 브로드캐스트 = 대역폭 폭발',
    body: '수만 노드에 전체 브로드캐스트하면 대역폭이 O(N^2)으로 증가합니다.',
  },
  {
    label: '문제: 스팸 메시지 전파',
    body: '악의적 피어의 무효 메시지를 검증 없이 전파하면 네트워크가 오염됩니다.',
  },
  {
    label: '해결: GossipSub 메시 + 3단계 검증',
    body: '토픽별 메시(D=8 피어)에만 전파하고 Accept/Reject/Ignore 3단계로 검증합니다.',
  },
  {
    label: '해결: SSZ-Snappy 인코딩 + 메시 유지보수',
    body: 'SSZ+Snappy 압축으로 대역폭을 절약하고 GRAFT/PRUNE으로 메시 크기를 유지합니다.',
  },
];
