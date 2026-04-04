export const C = { realm: '#6366f1', tz: '#f59e0b', ok: '#10b981', err: '#ef4444', root: '#8b5cf6' };

export const STEPS = [
  {
    label: 'TrustZone NS 비트: 2개 세계만 구분',
    body: 'SCR_EL3.NS = 0(Secure) / 1(Normal) → 보안 앱 간 격리 없음, 하나 침해 시 전체 노출',
  },
  {
    label: 'GPT: 물리 페이지별 세계 지정 테이블',
    body: 'GPCCR_EL3 레지스터가 GPT 베이스 주소 지정, 각 granule에 2비트 PAS(Physical Address Space) 태깅',
  },
  {
    label: 'RMI: Realm Management Interface 호출',
    body: 'SMC #RMI_REALM_CREATE(rd) → RMM이 Realm Descriptor 초기화 + RIPAS 페이지 테이블 구성',
  },
  {
    label: 'RSI: Realm 내부에서 측정값 확장',
    body: 'SMC #RSI_MEASUREMENT_EXTEND(idx, data) → REM[idx] = SHA-512(REM[idx] || data)',
  },
  {
    label: 'CCA Token: PSA 기반 CBOR/COSE 증명',
    body: 'SMC #RSI_ATTEST_TOKEN_INIT(challenge) → {RIM, REM[0..3], platform_claims} COSE_Sign1 서명',
  },
];
