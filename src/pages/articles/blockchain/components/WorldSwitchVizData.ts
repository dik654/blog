export const smcSteps = [
  { actor: 'NS', label: 'SMC 호출', detail: '비보안 세계에서 SMC 명령어 실행\n(fast call: FID bit[31]=1, standard: FID bit[31]=0)' },
  { actor: 'CPU', label: 'Monitor 진입', detail: 'CPU가 Monitor Mode로 전환\nSCR.NS 비트 = 0 (보안 세계)\n비보안 레지스터 저장 (sm_from_nsec)' },
  { actor: 'MON', label: 'FID 디스패치', detail: 'sm_from_nsec():\n  if WDT: → wdt_handler\n  if platform: → platform_smc\n  if fast call: → vector_fast_smc_entry\n  else: → vector_std_smc_entry' },
  { actor: 'S', label: 'Secure OS 실행', detail: '보안 세계 OP-TEE OS 실행\n(tee_ta_invoke_command 등)' },
  { actor: 'CPU', label: 'Monitor 복귀', detail: 'Monitor Mode로 재진입\nSCR.NS = 1 (비보안 세계)\n보안 레지스터 복원' },
  { actor: 'NS', label: 'NS 복귀', detail: '비보안 세계로 복귀\nSMC 반환값 수신' },
];

export const REGISTER_INFO = [
  '/* 비보안 레지스터 저장 (unbanked) */',
  'r4-r12, lr (LR_mon 제외)',
  'SPSR_mon, SP_und, LR_und',
  'SP_irq, LR_irq, SPSR_irq',
  'SP_fiq, LR_fiq, SPSR_fiq',
  '/* SCR.NS = 0 → 보안 세계 전환 */',
];
