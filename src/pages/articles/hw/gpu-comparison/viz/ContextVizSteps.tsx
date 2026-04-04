import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepNeed() {
  const lines = [
    { line: '// GPU 스펙 비교 (ZK 증명 기준)', c: C.ok, y: 38 },
    { line: 'RTX 4090 — 16384코어, 24GB GDDR6X, 1008 GB/s', c: C.consumer, y: 58 },
    { line: 'A100 80GB — 6912코어, 80GB HBM2e,  2039 GB/s', c: C.dc, y: 78 },
    { line: 'H100 SXM  — 16896코어, 80GB HBM3,   3352 GB/s', c: C.ok, y: 98 },
    { line: 'RTX 5090 — 21760코어, 32GB GDDR7,  1792 GB/s', c: C.consumer, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>GPU 스펙 비교</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepProblem() {
  const lines = [
    { line: '// 가격 대비 성능 (MSM 2^24)', c: C.consumer, y: 38 },
    { line: 'RTX 4090: $1,600  → MSM 1.2s → $1,333/s당', c: C.consumer, y: 58 },
    { line: 'A100:     $10,000 → MSM 0.8s → $8,000/s당', c: C.dc, y: 78 },
    { line: 'H100:     $25,000 → MSM 0.5s → $12,500/s당', c: C.dc, y: 98 },
    { line: '// 가성비: 4090 > A100 > H100', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.consumer}>가격 대비 성능</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
