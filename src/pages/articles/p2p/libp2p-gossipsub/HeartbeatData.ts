export const HB_PHASES = [
  {
    id: 'cleanup',
    label: '1. 정리',
    items: [
      { action: 'backoffs.heartbeat()', desc: '만료된 백오프 제거', color: '#64748b' },
      { action: 'count_sent_iwant.clear()', desc: 'IWANT 카운터 초기화', color: '#64748b' },
      { action: 'count_received_ihave.clear()', desc: 'IHAVE 카운터 초기화', color: '#64748b' },
    ],
    color: '#06b6d4',
  },
  {
    id: 'penalty',
    label: '2. 페널티',
    items: [
      { action: 'apply_iwant_penalties()', desc: 'IWANT 약속 미이행 피어에 스코어 감점', color: '#ef4444' },
    ],
    color: '#f59e0b',
  },
  {
    id: 'mesh',
    label: '3. 메시 유지',
    items: [
      { action: 'prune 음수 스코어', desc: '스코어 < 0인 피어를 메시에서 제거', color: '#ef4444' },
      { action: 'graft 부족분', desc: '피어 수 < mesh_n_low이면 랜덤 추가', color: '#10b981' },
      { action: 'prune 초과분', desc: '피어 수 > mesh_n_high이면 저스코어 제거', color: '#f59e0b' },
    ],
    color: '#10b981',
  },
  {
    id: 'fanout',
    label: '4. 팬아웃',
    items: [
      { action: 'fanout TTL 체크', desc: '마지막 발행 후 일정 시간 경과하면 fanout 제거', color: '#8b5cf6' },
      { action: 'fanout 보충', desc: '피어 부족하면 랜덤 피어 추가', color: '#8b5cf6' },
    ],
    color: '#8b5cf6',
  },
  {
    id: 'gossip',
    label: '5. Gossip',
    items: [
      { action: 'emit_gossip()', desc: 'mcache에서 IHAVE 메시지 생성 → 비메시 피어에게 전송', color: '#ec4899' },
    ],
    color: '#ec4899',
  },
];
