/** CommitteeLifecycle Viz — 색상 + 스텝 정의 */

export const C = {
  period: '#6366f1',   // 보라 — period 영역
  current: '#10b981',  // 녹색 — current committee
  next: '#f59e0b',     // 앰버 — next committee
  alert: '#ef4444',    // 빨강 — 실패/경고
  muted: '#94a3b8',    // 회색 — 비활성
};

export const STEPS = [
  {
    label: 'Period 타임라인 — 256 에폭마다 위원회 교체',
    body: 'period = slot / 8192.\n예: slot 8,000,000 → period 976, slot 8,008,192 → period 977 (새 위원회).',
  },
  {
    label: '핸드오프 과정 — 한 period 앞서 next를 받아두는 이유',
    body: 'Period N에서 current로 검증하면서 next를 미리 수신·검증.\n경계를 넘으면 current ← next, next ← None으로 즉시 교체.',
  },
  {
    label: '실패 케이스 — next 없이 경계를 넘으면',
    body: 'next_sync_committee가 None인 채 period 경계를 넘으면 서명 검증 불가.\n재부트스트랩(또는 Update 재요청)으로 복구해야 한다.',
  },
];
