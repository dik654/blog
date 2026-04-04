export const C = { hw: '#6366f1', err: '#ef4444', ok: '#10b981', key: '#f59e0b', fw: '#8b5cf6' };

export const STEPS = [
  {
    label: 'CPU 보안 레지스터 초기화',
    body: 'BIOS가 IA32_FEATURE_CONTROL MSR로 TEE 기능 활성화 → Lock Bit 설정으로 재부팅 전 변경 불가',
  },
  {
    label: 'TCB 범위를 레지스터 수준으로 축소',
    body: 'CR4.SMEP=1(커널 실행 방지) + CR4.SMAP=1(커널 접근 차단) → Ring 0에서도 유저 메모리 보호',
  },
  {
    label: 'MEE가 메모리 버스에서 AES-XTS 암호화',
    body: 'CPU→DRAM 경로에 MEE(Memory Encryption Engine) 삽입, 물리 주소별 tweak로 위치 의존 암호화',
  },
  {
    label: 'Root of Trust: 퓨즈 기반 하드웨어 앵커',
    body: 'CPU 제조 시 OTP 퓨즈에 Root Key 소성 → CSME가 이 키로 부트 체인 검증, 소프트웨어 변경 불가',
  },
];
