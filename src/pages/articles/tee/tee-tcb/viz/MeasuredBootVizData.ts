export const STEPS = [
  { label: '부팅 체인: 측정 → 실행 패턴',
    body: '각 단계가 다음 단계의 코드를 SHA-256으로 해시(측정)한 뒤 실행합니다. 변조된 코드는 다른 해시를 생성합니다.' },
  { label: 'PCR Extend: 측정값 축적',
    body: '각 단계의 측정값이 TPM의 PCR 레지스터에 누적됩니다. PCR = SHA-256(PCR || M) — 단방향 확장만 가능합니다.' },
  { label: '원격 증명: PCR → Quote → 검증',
    body: '최종 PCR 값을 TPM이 서명하여 Quote를 생성합니다. 원격 검증자가 Quote를 확인하면 어떤 소프트웨어가 실행 중인지 증명됩니다.' },
];

export const C = { main: '#6366f1', hash: '#10b981', attest: '#f59e0b' };
