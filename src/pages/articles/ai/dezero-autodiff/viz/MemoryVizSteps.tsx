import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './MemoryVizData';

export function Step0() {
  return (
    <g>
      <VizBox x={20} y={20} w={90} h={30} label="var_a" sub="Rc::clone()" c={CV} />
      <VizBox x={20} y={70} w={90} h={30} label="var_b" sub="Rc::clone()" c={CV} delay={0.1} />
      <VizBox x={200} y={35} w={140} h={50} label="VarInner (data=3.0)" sub="grad + creator" c={CE} delay={0.2} />
      {[[110, 35, 200, 52], [110, 85, 200, 68]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={CA} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={345} y={43} width={48} height={20} rx={4}
          fill={`${CA}15`} stroke={CA} strokeWidth={1} />
        <text x={369} y={57} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={CA}>rc=2</text>
      </motion.g>
      <motion.text x={150} y={52} fontSize={7} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Rc</motion.text>
      <motion.text x={150} y={82} fontSize={7} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>Rc</motion.text>
      <motion.text x={200} y={105} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        var_a drop 시 rc=2→1 / var_b drop 시 rc=1→0 해제
      </motion.text>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <VizBox x={5} y={15} w={80} h={32} label="Variable" sub="Rc(rc=1)" c={CV} />
      <motion.line x1={85} y1={31} x2={110} y2={31} stroke={CV} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
      <text x={92} y={25} fontSize={7} fill={CV}>creator</text>
      <VizBox x={110} y={15} w={100} h={32} label="FuncState" sub="inputs: Rc(rc=2)" c={CA} delay={0.15} />
      <motion.line x1={210} y1={31} x2={238} y2={31} stroke={CE} strokeWidth={1}
        strokeDasharray="4 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <text x={218} y={24} fontSize={7} fill={CE}>Weak</text>
      <VizBox x={238} y={15} w={85} h={32} label="output" sub="weak_count=1" c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={5} y={60} width={155} height={48} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.6} />
        <text x={82} y={76} textAnchor="middle" fontSize={8} fill={CE}>output 살아있을 때</text>
        <text x={82} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Weak::upgrade() → Some(Rc) rc=2
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={178} y={60} width={155} height={48} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.6} />
        <text x={255} y={76} textAnchor="middle" fontSize={8} fill={CA}>output drop 이후</text>
        <text x={255} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Weak::upgrade() → None (rc=0)
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <VizBox x={30} y={15} w={100} h={30} label="no_grad()" sub="RAII guard 생성" c={CA} />
      <motion.path d="M 80 45 L 80 55" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <VizBox x={30} y={55} w={100} h={30} label="BACKPROP=false" sub="그래프 기록 안 함" c={CV} delay={0.2} />
      <VizBox x={180} y={20} w={160} h={55} label="{ 스코프 내 연산 }" sub="Func::call() → forward만 실행" c={CE} delay={0.3} />
      <motion.path d="M 80 85 L 80 95" stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <VizBox x={30} y={95} w={100} h={25} label="Drop → 복원" sub="BACKPROP=prev" c={CA} delay={0.5} />
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <VizBox x={30} y={20} w={140} h={35} label="thread_local!" sub="스레드별 독립 상태" c={CV} />
      <VizBox x={220} y={10} w={140} h={28} label="Thread A" sub="BACKPROP=true" c={CE} delay={0.15} />
      <VizBox x={220} y={45} w={140} h={28} label="Thread B" sub="BACKPROP=false" c={CA} delay={0.25} />
      <motion.line x1={170} y1={32} x2={220} y2={24} stroke={CE} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.line x1={170} y1={42} x2={220} y2={59} stroke={CA} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.text x={200} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Cell&lt;bool&gt; — borrow 충돌 없이 내부 가변성
      </motion.text>
    </g>
  );
}
