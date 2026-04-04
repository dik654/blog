import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: '// CA (Normal World, EL0)', c: C.nw, y: 38 },
    { line: 'TEEC_InvokeCommand(session, cmd_id, &op)', c: C.nw, y: 58 },
    { line: '  → ioctl(/dev/tee0, TEE_IOC_INVOKE)', c: C.nw, y: 78 },
    { line: '  → SMC #0  (OPTEE_SMC_CALL_WITH_ARG)', c: C.mon, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.nw}>Normal World → SMC 호출</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepWorlds() {
  const lines = [
    { line: '// EL3 Secure Monitor (entry.S)', c: C.mon, y: 38 },
    { line: 'MRS  X0, SPSR_EL3      // 저장: 상태 레지스터', c: C.mon, y: 58 },
    { line: 'MRS  X1, ELR_EL3       // 저장: 복귀 주소', c: C.mon, y: 78 },
    { line: 'BIC  X2, SCR_EL3, #1   // SCR_EL3.NS = 0 (Secure)', c: C.sw, y: 100 },
    { line: 'MSR  SCR_EL3, X2       // 세계 전환 완료', c: C.sw, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mon}>EL3 Monitor: 세계 전환</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepSMC() {
  const lines = [
    { line: '// OP-TEE OS (S.EL1) thread 할당', c: C.sw, y: 38 },
    { line: 'thread = thread_alloc_and_run(a0..a7)', c: C.sw, y: 58 },
    { line: '  thread->state = THREAD_STATE_ACTIVE', c: C.sw, y: 78 },
    { line: '  thread->ctx.uuid = ta_uuid', c: C.sw, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sw}>thread_alloc: TA 스레드 할당</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={360} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepOPTEE() {
  const lines = [
    { line: '// TA Entry Points (S.EL0)', c: C.sw, y: 38 },
    { line: 'TA_OpenSessionEntryPoint(paramTypes, params)', c: C.sw, y: 58 },
    { line: '  → 세션 생성, 인증 검사', c: C.sw, y: 78 },
    { line: 'TA_InvokeCommandEntryPoint(cmd_id, params)', c: C.mon, y: 100 },
    { line: '  → cmd_id별 분기 (암호화/서명/저장)', c: C.mon, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sw}>TA Entry: GP API 호출</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={370} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
