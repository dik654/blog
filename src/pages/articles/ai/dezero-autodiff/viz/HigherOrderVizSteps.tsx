import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './HigherOrderVizData';

export function Step0() {
  const nodes = [
    { x: 20, y: 40, label: 'x=2.0', sub: 'Variable', c: CV },
    { x: 120, y: 20, label: 'PowFn(4)', sub: 'x⁴=16', c: CA },
    { x: 120, y: 70, label: 'MulFn', sub: '2·x²=8', c: CA },
    { x: 250, y: 40, label: 'SubFn', sub: '16-8=8', c: CA },
    { x: 340, y: 40, label: 'y=8', sub: 'output', c: CE },
  ];
  const edges = [[100, 50, 120, 37], [100, 57, 120, 87], [200, 37, 250, 52], [200, 87, 250, 62], [330, 57, 340, 57]];
  return (
    <g>
      {nodes.map((n, i) => <VizBox key={i} {...n} w={80} h={35} delay={i * 0.1} />)}
      {edges.map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--muted-foreground)" strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + i * 0.08 }} />
      ))}
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <VizBox x={20} y={30} w={70} h={35} label="y=8" sub="grad=1.0" c={CE} />
      <motion.path d="M 90 47 L 130 47" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
      <VizBox x={130} y={30} w={90} h={35} label="SubFn.bwd" sub="gys→gxs" c={CA} delay={0.15} />
      <motion.path d="M 220 47 L 260 47" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <VizBox x={260} y={30} w={100} h={35} label="x.grad = 24" sub="= 4x³ - 4x" c={CV} delay={0.35} />
      <motion.rect x={260} y={80} width={100} height={25} rx={4}
        fill={`${CE}15`} stroke={CE} strokeWidth={1}
        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} />
      <motion.text x={310} y={96} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        그래프에 기록됨
      </motion.text>
    </g>
  );
}

export function Step2() {
  const chain = [
    { x: 20, y: 40, label: 'x.grad', sub: 'data=24.0', c: CE },
    { x: 130, y: 40, label: 'SubFn', sub: 'creator', c: CA },
    { x: 240, y: 40, label: 'MulFn', sub: 'creator', c: CA },
    { x: 340, y: 40, label: 'PowFn', sub: 'creator', c: CA },
  ];
  return (
    <g>
      {chain.map((n, i) => <VizBox key={i} {...n} w={85} h={35} delay={i * 0.12} />)}
      {[105, 215, 325].map((x, i) => (
        <motion.line key={i} x1={x} y1={57} x2={x + 25} y2={57}
          stroke={CA} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + i * 0.12 }} />
      ))}
      <motion.text x={210} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        grad가 Variable → creator 체인 보존 → 2차 미분 가능
      </motion.text>
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <VizBox x={20} y={25} w={90} h={35} label="gx = x.grad" sub="Variable(24.0)" c={CE} />
      <motion.path d="M 110 42 L 150 42" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
      <VizBox x={150} y={25} w={100} h={35} label="gx.backward()" sub="2차 역전파" c={CA} delay={0.15} />
      <motion.path d="M 250 42 L 290 42" stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <VizBox x={290} y={25} w={90} h={35} label="x.grad=44" sub="12x²-4" c={CV} delay={0.35} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={100} y={80} width={220} height={28} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={210} y={98} textAnchor="middle" fontSize={8} fill={CA}>
          Newton: x ← x - f'(x)/f''(x) = 2 - 24/44
        </text>
      </motion.g>
    </g>
  );
}
