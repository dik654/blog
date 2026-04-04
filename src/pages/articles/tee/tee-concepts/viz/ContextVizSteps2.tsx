import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepTCB() {
  const lines = [
    { line: '// SGX TCB 범위', c: C.ok, y: 38 },
    { line: 'SECS.size = 0x100000  // Enclave = 1MB TCB', c: C.ok, y: 58 },
    { line: '// TDX TCB 범위', c: C.key, y: 82 },
    { line: 'TDCS.max_vcpus = 512  // VM 전체 = 수 GB TCB', c: C.key, y: 102 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>TCB 크기: SGX vs TDX</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepSeal() {
  const lines = [
    { line: 'EGETKEY(keyreq)', c: C.cpu, y: 38 },
    { line: '  keyreq.key_name = SEAL_KEY', c: C.cpu, y: 58 },
    { line: '  keyreq.key_policy = MRENCLAVE  // 코드별 고유', c: C.key, y: 78 },
    { line: '  seal_key = KDF(cpu_fuse_key, MRENCLAVE, SVN)', c: C.key, y: 98 },
    { line: '  // 같은 CPU + 같은 코드 → 같은 키 유도', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>EGETKEY: 봉인 키 유도</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
