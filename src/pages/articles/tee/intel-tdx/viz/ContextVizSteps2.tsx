import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepSEAM() {
  const lines = [
    { line: 'TDCALL[TDG.MR.REPORT](report_data[64])', c: C.tdx, y: 38 },
    { line: '  report.mrtd      = TDCS.MRTD  // TD 초기 해시', c: C.tdx, y: 58 },
    { line: '  report.rtmr[0..3] = runtime 측정값', c: C.sgx, y: 78 },
    { line: '  report.mac = CMAC(report_key, body)', c: C.sgx, y: 98 },
    { line: '  // QE가 ECDSA-P256 서명 → TDX Quote', c: C.key, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tdx}>TDG.MR.REPORT: 증명 생성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepQuote() {
  const lines = [
    { line: '// SGX vs TDX 격리 단위 비교', c: C.vm, y: 38 },
    { line: 'SGX:  SECS.size  = 0x100000    // ~1MB Enclave', c: C.sgx, y: 62 },
    { line: 'TDX:  TDCS.mem   = 0x100000000 // ~4GB VM', c: C.tdx, y: 82 },
    { line: 'SGX TCB: CPU + Enclave (수 MB)', c: C.sgx, y: 106 },
    { line: 'TDX TCB: CPU + SEAM + VM OS (수 GB)', c: C.tdx, y: 126 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vm}>SGX vs TDX: TCB 크기</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
