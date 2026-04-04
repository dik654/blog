import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepSNP() {
  const lines = [
    { line: '// RMP (Reverse Map Table) 엔트리', c: C.ok, y: 38 },
    { line: 'RMP[phys_addr].assigned  = 1', c: C.ok, y: 58 },
    { line: 'RMP[phys_addr].asid     = guest_asid', c: C.ok, y: 78 },
    { line: 'RMP[phys_addr].immutable = 1  // 재매핑 차단', c: C.err, y: 98 },
    { line: '// 호스트 remap 시도 → #NPF (Nested Page Fault)', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>SEV-SNP: RMP 페이지 보호</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={25} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={35} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepPSP() {
  const lines = [
    { line: 'SNP_GET_REPORT(report_data[64], vmpl)', c: C.psp, y: 38 },
    { line: '  report.measurement = LAUNCH_DIGEST', c: C.sev, y: 58 },
    { line: '  report.policy      = guest_policy', c: C.sev, y: 78 },
    { line: '  sig = ECDSA_P384(VCEK_priv, report)', c: C.ok, y: 100 },
    { line: '  // 검증: ARK → ASK → VCEK 인증서 체인', c: C.ok, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.psp}>PSP: VCEK 서명 증명</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={25} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={35} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
