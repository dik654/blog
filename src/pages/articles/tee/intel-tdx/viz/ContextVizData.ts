export const C = { tdx: '#6366f1', sgx: '#10b981', err: '#ef4444', key: '#f59e0b', vm: '#8b5cf6' };

export const STEPS = [
  {
    label: 'SEAMCALL[TDH.MNG.INIT]: TD 생성 초기화',
    body: 'TDH.MNG.INIT(TDCS_page) → TDCS(TD Control Structure) 초기화 + MKTME KeyID 할당',
  },
  {
    label: 'MKTME: 메모리 컨트롤러가 KeyID별 암호화',
    body: 'IA32_TME_ACTIVATE MSR → KeyID 슬롯 활성화, 메모리 컨트롤러가 물리 주소 상위 비트로 키 선택',
  },
  {
    label: 'SEAMCALL[TDH.VP.ENTER]: TD 진입',
    body: 'TDH.VP.ENTER(TDVPS) → SEAM 모듈이 VMCS 구성 → VMLAUNCH → TD Guest Ring 0 실행',
  },
  {
    label: 'TDG.MR.REPORT: TD 내부에서 증명 생성',
    body: 'TDCALL[TDG.MR.REPORT](data) → MRTD + RTMR[0..3] + report_data → SEAM이 MAC 서명',
  },
  {
    label: 'SGX vs TDX: 격리 단위와 TCB 크기 차이',
    body: 'SGX: SECS(Enclave, 수MB) / TDX: TDCS(VM 전체, 수GB) — TCB 대 호환성 트레이드오프',
  },
];
