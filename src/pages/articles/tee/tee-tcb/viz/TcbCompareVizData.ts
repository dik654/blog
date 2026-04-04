export const STEPS = [
  { label: 'Intel SGX: 가장 작은 TCB',
    body: 'TCB = CPU 하드웨어 + Enclave 코드(수 MB). OS, 하이퍼바이저, 드라이버 모두 TCB에서 제외됩니다.' },
  { label: 'Intel TDX: VM 단위 보호',
    body: 'TCB = CPU + TDX Module(SEAM) + VM 전체. 기존 앱을 수정 없이 보호(Lift & Shift)할 수 있는 대신 TCB가 커집니다.' },
  { label: 'AMD SEV-SNP: 펌웨어 기반 격리',
    body: 'TCB = AMD SP 펌웨어 + CPU. RMP(Reverse Map Table)로 VM 메모리 무결성을 보장합니다.' },
  { label: 'ARM TrustZone: 물리적 세계 분리',
    body: 'TCB = Secure World OS(OP-TEE) + Secure Monitor. Normal World와 물리적으로 분리된 별도 실행 환경입니다.' },
];

export const C = { trusted: '#6366f1', untrusted: '#94a3b8', accent: '#10b981' };
