import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepSameProto() {
  const lines = [
    { line: '// NVMe 폼팩터 스펙 비교', c: C.m2, y: 38 },
    { line: 'M.2 2280:  22×80mm, PCIe x4, 컨슈머용', c: C.m2, y: 58 },
    { line: 'U.2 2.5":  69×100mm 금속, PCIe x4, 핫스왑', c: C.u2, y: 78 },
    { line: 'E1.S:      31.5×111mm, PCIe x4, 1U 고밀도', c: C.e1s, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.m2}>NVMe 폼팩터 비교</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={390} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepHeat() {
  const lines = [
    { line: '// M.2 발열 프로파일', c: C.err, y: 38 },
    { line: '면적: 22 × 80 = 1,760 mm² (열 분산 한계)', c: C.m2, y: 58 },
    { line: '유휴: ~40℃  →  쓰기 시작: ~55℃', c: C.m2, y: 78 },
    { line: '연속 5분: ~85℃ → 쓰로틀링 시작', c: C.err, y: 98 },
    { line: '봉인(PC1): 수시간 연속 쓰기 → 속도 70% 감소', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>M.2 발열 쓰로틀링</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
