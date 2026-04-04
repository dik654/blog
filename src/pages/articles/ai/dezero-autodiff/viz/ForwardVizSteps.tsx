import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ForwardVizData';

export function Step0() {
  return (
    <g>
      <VizBox x={20} y={40} w={80} h={40} label="x = 3.0" sub="Variable" c={CV} />
      <VizBox x={20} y={95} w={80} h={40} label="y = 2.0" sub="Variable" c={CV} delay={0.1} />
      <motion.text x={140} y={65} fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        .borrow().data.clone()
      </motion.text>
      <motion.path d="M 100 60 L 210 60" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M 100 115 L 210 80" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <VizBox x={210} y={45} w={100} h={40} label="xs = [3.0, 2.0]" sub="Vec<ArrayD>" c={CA} delay={0.4} />
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <VizBox x={10} y={50} w={100} h={40} label="xs = [3.0, 2.0]" sub="Vec<ArrayD>" c={CA} />
      <VizBox x={140} y={50} w={110} h={40} label="AddFn::forward()" sub="xs[0] + xs[1]" c={CE} delay={0.1} />
      <motion.path d="M 110 70 L 140 70" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M 250 70 L 290 70" stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <VizBox x={290} y={50} w={90} h={40} label="ys = [5.0]" sub="3.0 + 2.0" c={CE} delay={0.4} />
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <VizBox x={15} y={25} w={90} h={35} label="x=3.0 (gen=0)" sub="input Variable" c={CV} />
      <VizBox x={15} y={75} w={90} h={35} label="y=2.0 (gen=0)" sub="input Variable" c={CV} delay={0.05} />
      <VizBox x={145} y={45} w={110} h={40} label="FuncState" sub="gen = max(0,0) = 0" c={CA} delay={0.15} />
      <VizBox x={295} y={45} w={95} h={40} label="out=5.0" sub="gen = 0+1 = 1" c={CE} delay={0.3} />
      <motion.path d="M 105 42 L 145 60" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.path d="M 105 92 L 145 72" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <motion.path d="M 255 65 L 295 65" stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.text x={300} y={100} fontSize={7} fill={CE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        out.creator = FuncState
      </motion.text>
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <VizBox x={20} y={40} w={80} h={40} label="Variable" sub="Rc → VarInner" c={CV} />
      <motion.path d="M 100 55 L 140 55" stroke={CA} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
      <text x={115} y={48} fontSize={7} fill={CA}>creator</text>
      <VizBox x={140} y={40} w={100} h={40} label="FuncState" sub="inputs: Vec<Var>" c={CA} delay={0.15} />
      <motion.path d="M 240 55 L 280 55" stroke={CE} strokeWidth={1} strokeDasharray="4 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <text x={250} y={48} fontSize={7} fill={CE}>Weak</text>
      <VizBox x={280} y={40} w={90} h={40} label="output" sub="Weak<RefCell>" c={CE} delay={0.3} />
      <motion.text x={195} y={105} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        Weak로 끊어 순환 참조 방지
      </motion.text>
    </g>
  );
}
