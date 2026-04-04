export const C = {
  ssz: '#6366f1', domain: '#10b981', root: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 29~31: compute_domain()',
    body: 'DOMAIN_SYNC_COMMITTEE + fork_version 조합.\n네트워크별로 다른 도메인 → 크로스체인 리플레이 방지.',
  },
  {
    label: 'Line 32~33: compute_signing_root()',
    body: 'SSZ(header) + domain → signing_root.\n이 해시가 BLS 서명의 메시지 역할.',
  },
];
