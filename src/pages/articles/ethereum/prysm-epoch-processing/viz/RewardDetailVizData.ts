export const C = { reward: '#10b981', penalty: '#ef4444', base: '#8b5cf6', flag: '#f59e0b' };

export const STEPS = [
  {
    label: 'base_reward 계산',
    body: 'effective_balance × BASE_REWARD_FACTOR / sqrt(total_active_balance)',
  },
  {
    label: '참여도 3축 평가',
    body: 'Source(justified CP) / Target(에폭 타겟) / Head(헤드 블록) 각 축 독립 평가',
  },
  {
    label: '보상/패널티 반영',
    body: '참여 축은 보상, 불참 축은 패널티 — 잔액에 직접 반영',
  },
];
