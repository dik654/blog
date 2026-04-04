export const C = {
  period: '#6366f1', epoch: '#10b981', calc: '#f59e0b',
};

export const STEPS = [
  {
    label: '256 에폭 = 1 Sync Committee Period',
    body: '1 에폭 = 32 슬롯 = 6.4분.\n256 에폭 = 8,192 슬롯 ≈ 27시간.',
  },
  {
    label: 'period 계산: slot / (256 * 32)',
    body: 'sync_committee_period = slot / 8192\n같은 period 내에서는 동일한 위원회가 서명.',
  },
];
