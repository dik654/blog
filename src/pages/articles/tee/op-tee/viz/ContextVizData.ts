export const C = { nw: '#6366f1', sw: '#10b981', mon: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: 'SMC #0 호출: Normal → Secure 세계 전환',
    body: 'CA가 SMC #0(OPTEE_SMC_CALL_WITH_ARG)를 호출하면 EL3 Monitor가 SPSR/ELR 저장 후 세계 전환',
  },
  {
    label: 'EL3 Monitor: SCR_EL3.NS 비트 토글',
    body: 'SCR_EL3.NS=0(Secure) 설정 → VBAR_EL3에서 벡터 참조 → S.EL1 OP-TEE OS 진입',
  },
  {
    label: 'thread_alloc: TA 실행 스레드 배정',
    body: 'OP-TEE OS가 thread pool에서 빈 스레드 할당 → TA 세션 컨텍스트(uuid, props) 초기화',
  },
  {
    label: 'TA Entry: open_session + invoke_command',
    body: 'TA_OpenSessionEntryPoint(paramTypes, params) → TA_InvokeCommandEntryPoint(cmd_id, params)',
  },
];
