import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: '// DDR4 vs DDR5 스펙 비교', c: C.ddr5, y: 38 },
    { line: 'DDR4: 3200 MT/s, 1.2V, 듀얼채널(64비트)', c: C.ddr4, y: 58 },
    { line: 'DDR5: 5600 MT/s, 1.1V, 2x서브채널(32비트×2)', c: C.ddr5, y: 78 },
    { line: '// 대역폭: DDR4 ~51.2 GB/s → DDR5 ~89.6 GB/s', c: C.ok, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ddr5}>DDR4 vs DDR5 스펙</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepDDR() {
  const lines = [
    { line: '// DDR5 서브채널 구조', c: C.ddr5, y: 38 },
    { line: 'SubCh_A: 32-bit data + 8-bit ECC = 40 pins', c: C.ddr5, y: 58 },
    { line: 'SubCh_B: 32-bit data + 8-bit ECC = 40 pins', c: C.ddr5, y: 78 },
    { line: '// 동시 독립 어드레싱 → 랜덤 I/O 성능 향상', c: C.ok, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ddr5}>DDR5 서브채널 구조</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
