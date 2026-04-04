import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: 'SNP_INIT  // PSP 초기화', c: C.psp, y: 38 },
    { line: '  PSP → DRAM_CTRL: alloc_key_slot(ASID)', c: C.psp, y: 58 },
    { line: '  AES_KEY[ASID] = random_128bit()', c: C.sev, y: 78 },
    { line: '  // VM별 다른 ASID → 다른 암호화 키', c: C.sev, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.psp}>SEV INIT: PSP 키 생성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={30} y={l.y - 13} width={360} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepSEV() {
  const lines = [
    { line: 'SNP_LAUNCH_START(gctx, policy, ma)', c: C.sev, y: 38 },
    { line: '  VMCB.SEV_EN    = 1  // SEV 암호화 활성화', c: C.sev, y: 58 },
    { line: '  VMCB.ASID      = guest_asid', c: C.sev, y: 78 },
    { line: '  MEM_CTRL: encrypt(phys_page, AES_KEY[ASID])', c: C.ok, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sev}>LAUNCH: 메모리 암호화 활성화</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={30} y={l.y - 13} width={370} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepES() {
  const lines = [
    { line: 'VMCB.SEV_ES_EN = 1  // ES 모드 활성화', c: C.sev, y: 38 },
    { line: '// VMEXIT 발생 시:', c: C.ok, y: 62 },
    { line: 'VMSA = AES_Encrypt(key, {RAX,RBX,...,RFLAGS})', c: C.ok, y: 82 },
    { line: '// 호스트는 암호화된 VMSA만 접근 가능', c: C.err, y: 106 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>SEV-ES: 레지스터 암호화</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={30} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
