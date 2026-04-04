import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function ModelTraitStep() {
  const methods = [
    ['forward(&self, x) → Variable', 38], ['layers() → Vec<&Linear>', 56],
    ['cleargrads()  — 자동 제공', 74], ['params() → Vec<Variable>  — 자동 제공', 92],
  ] as const;
  return (
    <g>
      <rect x={120} y={18} width={190} height={110} rx={6}
        fill={`${CV}08`} stroke={CV} strokeWidth={1} />
      <text x={215} y={13} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={CV}>trait Model</text>
      {methods.map(([t, y], i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <text x={130} y={y} fontSize={8} fill="var(--foreground)">{t}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function LinearCapsuleStep() {
  return (
    <g>
      <VizBox x={20} y={30} w={100} h={36} label="step43" sub="W1, b1, W2, b2" c={CA} />
      <VizBox x={20} y={85} w={100} h={36} label="step44" sub="l1.cleargrads()" c={CE} delay={0.15} />
      <motion.path d="M 70 66 L 70 85" stroke="var(--muted-foreground)" strokeWidth={0.8}
        strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3 }} />
      <VizBox x={180} y={50} w={160} h={50} label="Linear" sub="w + b + cleargrads + params" c={CV} delay={0.25} />
      <motion.line x1={120} y1={100} x2={180} y2={80} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    </g>
  );
}

export function LazyInitStep() {
  const boxes = [
    { x: 20, y: 55, w: 100, label: 'new(out=10)', sub: 'w: None', c: CA },
    { x: 175, y: 35, w: 110, label: 'forward(x)', sub: 'x.shape() = [N, 784]', c: CE },
    { x: 175, y: 85, w: 110, label: 'W 생성', sub: '[784, 10] Xavier', c: CV },
  ];
  return (
    <g>
      {boxes.map((b, i) => (
        <VizBox key={i} {...b} h={36} delay={i * 0.15} />
      ))}
      <motion.line x1={120} y1={73} x2={175} y2={53} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.line x1={230} y1={71} x2={230} y2={85} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <text x={345} y={60} fontSize={7} fill="var(--muted-foreground)">in_size = 784</text>
      <text x={345} y={72} fontSize={7} fill="var(--muted-foreground)">자동 감지</text>
    </g>
  );
}

export function OptimizerLinkStep() {
  return (
    <g>
      <VizBox x={20} y={50} w={100} h={40} label="SGD" sub="lr=0.01" c={CA} />
      <VizBox x={170} y={30} w={120} h={30} label="MyModel" sub="impl Model" c={CV} delay={0.1} />
      <VizBox x={170} y={75} w={120} h={30} label="params()" sub="[W1, b1, W2, b2]" c={CE} delay={0.2} />
      <motion.line x1={120} y1={65} x2={170} y2={45} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#nnArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.25 }} />
      <motion.line x1={230} y1={60} x2={230} y2={75} stroke={CV} strokeWidth={0.8}
        strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.35 }} />
      <defs>
        <marker id="nnArrow" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
