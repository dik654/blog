import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function LimbSplitStep() {
  const limbs = [
    { label: 'limbs[0]', val: '0x3c208c16d87cfd47', y: 30 },
    { label: 'limbs[1]', val: '0x97816a916871ca8d', y: 58 },
    { label: 'limbs[2]', val: '0xb85045b68181585d', y: 86 },
    { label: 'limbs[3]', val: '0x30644e72e131a029', y: 114 },
  ];
  return (
    <g>
      <VizBox x={20} y={48} w={120} h={50} label="p (254-bit)" sub="BN254 modulus" c={CV} />
      <motion.path d="M 140 73 L 170 73" stroke={CA} strokeWidth={1}
        markerEnd="url(#fArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
      {limbs.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
          <rect x={175} y={l.y} width={230} height={22} rx={3}
            fill={i === 0 ? `${CE}15` : `${CV}08`}
            stroke={i === 0 ? CE : CV} strokeWidth={0.8} />
          <text x={185} y={l.y + 14} fontSize={8} fontWeight={600}
            fill={i === 0 ? CE : CV}>{l.label}</text>
          <text x={245} y={l.y + 14} fontSize={7.5}
            fill="var(--muted-foreground)">{l.val}</text>
        </motion.g>
      ))}
      <text x={300} y={12} fontSize={7} fill="var(--muted-foreground)" textAnchor="middle">
        little-endian: [0]=LSB, [3]=MSB
      </text>
      <defs>
        <marker id="fArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function HelperOpsStep() {
  const ops = [
    { label: 'adc', sub: 'a + b + carry', c: CV, x: 30 },
    { label: 'sbb', sub: 'a - b - borrow', c: CE, x: 170 },
    { label: 'mac', sub: 'acc + a*b + carry', c: CA, x: 310 },
  ];
  return (
    <g>
      {ops.map((o, i) => (
        <VizBox key={i} x={o.x} y={35} w={120} h={50} label={o.label}
          sub={o.sub} c={o.c} delay={i * 0.15} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={210} y={115} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          u128 확장 곱셈 → 오버플로 없이 64x64 = 128비트 처리
        </text>
      </motion.g>
    </g>
  );
}
