import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepDiff() {
  const lines = [
    { line: '// 서버 CPU 스펙 비교', c: C.server, y: 38 },
    { line: 'EPYC 9654: 128 PCIe 5.0, 12ch DDR5, 360W TDP', c: C.server, y: 58 },
    { line: 'Xeon w9-3495X: 112 PCIe 5.0, 8ch DDR5, 350W', c: C.server, y: 78 },
    { line: 'IPMI/BMC: 전원 꺼져도 원격 KVM + 전원 제어', c: C.ok, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.server}>EPYC vs Xeon 스펙</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepFilecoin() {
  const lines = [
    { line: '// Filecoin 마이닝 PCIe 요구량', c: C.server, y: 38 },
    { line: 'GPU 8장 × PCIe x16 = 128 레인', c: C.server, y: 58 },
    { line: 'NVMe 4개 × PCIe x4  =  16 레인', c: C.desktop, y: 78 },
    { line: '합계: 144+ 레인 → EPYC(128) 또는 듀얼 Xeon', c: C.ok, y: 98 },
    { line: '// 데스크톱 CPU(20 레인) → 물리적 불가능', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.server}>Filecoin: PCIe 레인 요구</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
