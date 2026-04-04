import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepSGXLimit() {
  const lines = [
    { line: 'SEAMCALL[TDH.MNG.INIT](TDCS_page)', c: C.tdx, y: 38 },
    { line: '  TDCS.lifecycle  = TD_STATE_INIT', c: C.tdx, y: 58 },
    { line: '  TDCS.max_vcpus  = policy.max_vcpus', c: C.tdx, y: 78 },
    { line: '  MKTME.KeyID[td] = alloc_key_slot()', c: C.key, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tdx}>TDH.MNG.INIT: TD 생성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepVMMThreat() {
  const lines = [
    { line: '// MKTME 암호화 레지스터', c: C.key, y: 38 },
    { line: 'IA32_TME_ACTIVATE.enable = 1', c: C.key, y: 58 },
    { line: 'phys_addr[51:46] = KeyID  // 상위 비트 = 키 선택', c: C.key, y: 78 },
    { line: 'MEM_CTRL: AES-XTS(KEY[KeyID], data)', c: C.sgx, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>MKTME: KeyID별 암호화</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepMKTME() {
  const lines = [
    { line: 'SEAMCALL[TDH.VP.ENTER](TDVPS_ptr)', c: C.tdx, y: 38 },
    { line: '  SEAM: VMCS.guest_CR3 = TDVPS.CR3', c: C.tdx, y: 58 },
    { line: '  SEAM: VMCS.EPT_ptr   = SEPT_root', c: C.sgx, y: 78 },
    { line: '  VMLAUNCH  // TD vCPU 실행 시작', c: C.sgx, y: 98 },
    { line: '  // TD Guest Ring 0: 기존 OS 그대로 동작', c: C.sgx, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tdx}>TDH.VP.ENTER: TD 진입</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
