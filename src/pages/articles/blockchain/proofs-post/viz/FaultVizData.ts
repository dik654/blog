export const C = {
  ok: '#10b981', fault: '#ef4444', recover: '#f59e0b', term: '#6b7280',
};

export const STEPS = [
  {
    label: '데드라인 미제출 → 자동 Fault',
    body: 'Fault 섹터 → 파워에서 즉시 제외',
  },
  {
    label: '14일 내 복구 선언',
    body: 'DeclareFaultsRecovered 메시지 제출',
  },
  {
    label: '14일 초과 → Termination',
    body: '초기 담보 전액 몰수 — 섹터 데이터 네트워크에서 영구 제거',
  },
];
