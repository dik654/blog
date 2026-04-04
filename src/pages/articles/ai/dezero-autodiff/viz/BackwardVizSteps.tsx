import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './BackwardVizData';

export function Step0() {
  return (
    <g>
      <VizBox x={130} y={20} w={140} h={35} label="output = 5.0" sub="grad = None" c={CV} />
      <motion.path d="M 200 55 L 200 68" stroke={CE} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        style={{ transformOrigin: '200px 85px' }}>
        <rect x={130} y={70} width={140} height={30} rx={5}
          fill={`${CE}15`} stroke={CE} strokeWidth={1.2} />
        <text x={200} y={89} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={CE}>grad = 1.0 (seed)</text>
      </motion.g>
      <motion.text x={200} y={115} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        dloss/doutput = 1.0 (자기 자신에 대한 미분)
      </motion.text>
    </g>
  );
}

export function Step1() {
  const fns = [
    { x: 30, y: 20, label: 'MulFn', gen: 2, c: CA },
    { x: 160, y: 20, label: 'AddFn', gen: 1, c: CE },
    { x: 290, y: 20, label: 'SinFn', gen: 0, c: CV },
  ];
  return (
    <g>
      {fns.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={f.x} y={f.y} width={100} height={40} rx={5}
            fill={`${f.c}10`} stroke={f.c} strokeWidth={1} />
          <text x={f.x + 50} y={f.y + 18} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={f.c}>{f.label}</text>
          <text x={f.x + 50} y={f.y + 32} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">gen={f.gen}</text>
        </motion.g>
      ))}
      <motion.text x={200} y={85} textAnchor="middle" fontSize={9} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        pop() → gen=2 먼저 → gen=1 → gen=0
      </motion.text>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <VizBox x={10} y={15} w={100} h={40} label="out.grad=1.0" sub="gys = [1.0]" c={CV} />
      <motion.path d="M 110 35 L 145 35" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <VizBox x={145} y={10} w={110} h={50} label="Add::backward" sub="gys[0] → [1.0, 1.0]" c={CA} delay={0.2} />
      <motion.path d="M 255 35 L 285 35" stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <VizBox x={285} y={15} w={105} h={40} label="gxs=[1.0, 1.0]" sub="x.grad, y.grad" c={CE} delay={0.4} />
      <motion.text x={200} y={82} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Add의 미분: d(x+y)/dx = 1, d(x+y)/dy = 1
      </motion.text>
      <motion.text x={200} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        _guard = using_backprop(create_graph)
      </motion.text>
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <VizBox x={20} y={15} w={80} h={35} label="x" sub="grad=None" c={CV} />
      <motion.path d="M 100 32 L 140 32" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
      <VizBox x={140} y={15} w={70} h={35} label="Add₁" sub="gx=1.0" c={CA} delay={0.15} />
      <motion.text x={260} y={22} fontSize={8} fill={CE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        x.grad = 1.0
      </motion.text>
      <VizBox x={20} y={70} w={80} h={35} label="x" sub="grad=1.0" c={CV} delay={0.35} />
      <motion.path d="M 100 87 L 140 87" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <VizBox x={140} y={70} w={70} h={35} label="Add₂" sub="gx=1.0" c={CA} delay={0.45} />
      <motion.text x={260} y={80} fontSize={8} fill={CE} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        x.grad = 1.0 + 1.0 = 2.0
      </motion.text>
      <motion.text x={260} y={94} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        &prev + &gx → 새 Variable
      </motion.text>
    </g>
  );
}
