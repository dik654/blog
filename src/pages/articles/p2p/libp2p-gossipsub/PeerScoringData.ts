export const TOPIC_PARAMS = [
  {
    name: 'P1: 메시 시간',
    desc: '메시에 머문 시간이 길수록 양수 점수.',
    why: '안정적인 피어에게 보상',
    sign: '+',
    color: '#10b981',
  },
  {
    name: 'P2: 첫 전달 수',
    desc: '해당 토픽에서 최초로 전달한 메시지 수.',
    why: '유용한 전파 기여에 보상',
    sign: '+',
    color: '#06b6d4',
  },
  {
    name: 'P3: 메시 전달 실패',
    desc: '메시에 있었지만 메시지를 전달하지 못한 횟수.',
    why: '느리거나 비협조적 피어 감점',
    sign: '-',
    color: '#f59e0b',
  },
  {
    name: 'P4: 잘못된 메시지',
    desc: '검증 실패한 메시지를 보낸 횟수.',
    why: '악의적/버그 피어에 강한 패널티',
    sign: '-',
    color: '#ef4444',
  },
];

export const THRESHOLDS = [
  { name: 'gossipThreshold', value: '-10', effect: '이하이면 gossip 전파 차단', color: '#f59e0b' },
  { name: 'publishThreshold', value: '-50', effect: '이하이면 publish 차단', color: '#ef4444' },
  { name: 'graylistThreshold', value: '-100', effect: '이하이면 메시+RPC 완전 차단', color: '#991b1b' },
];
