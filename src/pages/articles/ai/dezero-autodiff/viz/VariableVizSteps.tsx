import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './VariableVizData';

export function VarInnerStep() {
  const fields = [
    ['data: ArrayD<f64>', 38], ['grad: Option<Variable>', 58],
    ['creator: Option<FuncStateRef>', 78], ['generation: u32', 98],
    ['name: Option<String>', 118],
  ] as const;
  return (
    <g>
      <rect x={120} y={20} width={180} height={120} rx={6}
        fill={`${CV}08`} stroke={CV} strokeWidth={1} />
      <text x={210} y={14} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={CV}>VarInner</text>
      {fields.map(([t, y], i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <text x={130} y={y} fontSize={9} fill="var(--foreground)">{t}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function RcRefCellStep() {
  return (
    <g>
      <VizBox x={40} y={30} w={80} h={40} label="Variable A" sub="Rc clone" c={CE} />
      <VizBox x={40} y={90} w={80} h={40} label="Variable B" sub="Rc clone" c={CE} delay={0.1} />
      <VizBox x={200} y={50} w={140} h={60} label="VarInner" sub="data + grad + creator" c={CV} delay={0.2} />
      {[[120, 50, 200, 70], [120, 110, 200, 90]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={CA} strokeWidth={1} markerEnd="url(#varArrow)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.2, duration: 0.4 }} />
      ))}
      <defs>
        <marker id="varArrow" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function GradVarStep() {
  const boxes = [
    { x: 30, y: 40, w: 90, label: 'x.grad', sub: 'Variable', c: CE },
    { x: 170, y: 20, w: 90, label: 'MulFn', sub: 'creator', c: CA },
    { x: 170, y: 80, w: 90, label: 'PowFn', sub: 'creator', c: CA },
  ];
  return (
    <g>
      {boxes.map((b, i) => (
        <VizBox key={i} x={b.x} y={b.y} w={b.w} h={40}
          label={b.label} sub={b.sub} c={b.c} delay={i * 0.15} />
      ))}
      <motion.line x1={120} y1={55} x2={170} y2={40} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.line x1={120} y1={65} x2={170} y2={95} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <text x={310} y={60} fontSize={8} fill="var(--muted-foreground)">grad.backward()</text>
      <text x={310} y={74} fontSize={8} fill="var(--muted-foreground)">→ f''(x) 계산</text>
    </g>
  );
}

export function GenStep() {
  const nodes = [
    { x: 30, y: 55, label: 'x', gen: 0, c: CV },
    { x: 130, y: 35, label: 'AddFn', gen: 0, c: CA },
    { x: 130, y: 80, label: 'MulFn', gen: 0, c: CA },
    { x: 250, y: 35, label: 'y', gen: 1, c: CE },
    { x: 250, y: 80, label: 'z', gen: 1, c: CE },
    { x: 340, y: 55, label: 'out', gen: 2, c: CV },
  ];
  return (
    <g>
      {nodes.map((n, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={n.x} y={n.y} width={70} height={30} rx={5}
            fill={`${n.c}10`} stroke={n.c} strokeWidth={1} />
          <text x={n.x + 35} y={n.y + 14} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={n.c}>{n.label}</text>
          <text x={n.x + 35} y={n.y + 25} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">gen={n.gen}</text>
        </motion.g>
      ))}
    </g>
  );
}
