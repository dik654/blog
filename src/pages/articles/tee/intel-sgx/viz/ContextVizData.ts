export const C = { sgx: '#6366f1', err: '#ef4444', ok: '#10b981', epc: '#0ea5e9', key: '#f59e0b' };

export const STEPS = [
  {
    label: 'ECREATE: EPC에 Enclave 메모리 할당',
    body: 'ECREATE(SECS_page) → SECS(SGX Enclave Control Structure) 초기화, MRENCLAVE = SHA-256 시작',
  },
  {
    label: 'EADD + EEXTEND: 페이지별 코드 로딩 + 해시 누적',
    body: 'EADD(page) → EPC에 페이지 복사 + EEXTEND 256B 블록마다 MRENCLAVE에 SHA-256 누적',
  },
  {
    label: 'EINIT: 최종 MRENCLAVE 확정 + Enclave 봉인',
    body: 'EINIT(SIGSTRUCT) → MRENCLAVE 최종 해시 확정, SIGSTRUCT 서명 검증 후 실행 가능 상태',
  },
  {
    label: 'EENTER: TCS를 통한 Enclave 진입',
    body: 'EENTER(TCS_addr) → Ring 3 유지, RIP=oentry, CR_ENCLAVE_MODE=1, TLB flush',
  },
];
