export const C = { sev: '#6366f1', err: '#ef4444', ok: '#10b981', psp: '#f59e0b', vm: '#8b5cf6' };

export const STEPS = [
  {
    label: 'SEV INIT: PSP가 VM별 AES 키 생성',
    body: 'SNP_INIT → PSP(ARM Cortex-A5)가 DRAM 컨트롤러의 AES-128-XEX 키 슬롯에 VM별 키 주입',
  },
  {
    label: 'SEV LAUNCH: 메모리 컨트롤러 암호화 활성화',
    body: 'SNP_LAUNCH_START(policy) → ASID별 암호화 키 바인딩 → VMCB.SEV_EN=1로 VM 메모리 실시간 암호화',
  },
  {
    label: 'SEV-ES: VMSA 암호화로 레지스터 보호',
    body: 'VMRUN 시 VMCB.SEV_ES_EN=1 → VMEXIT에서 VMSA(레지스터 상태)를 AES 암호화 후 저장',
  },
  {
    label: 'SEV-SNP: RMP로 페이지 소유권 추적',
    body: 'RMP[phys_addr] = {ASID, immutable, validated} → 페이지 재매핑/리플레이 공격 하드웨어 차단',
  },
  {
    label: 'PSP 원격 증명: VCEK 인증서 체인',
    body: 'SNP_GET_REPORT → PSP가 VCEK(ECDSA-P384)로 서명, ARK→ASK→VCEK 체인으로 AMD 루트까지 검증',
  },
];
