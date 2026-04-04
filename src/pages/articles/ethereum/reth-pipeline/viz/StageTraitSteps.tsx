import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './StageTraitVizData';

export function Step0() {
  const stages = ['Headers', 'Bodies', 'Senders', 'Execution', 'Merkle'];
  return (<g>
    <ModuleBox x={10} y={15} w={100} h={40} label="Pipeline" sub="::run()" color={C.pipeline} />
    <motion.line x1={115} y1={35} x2={140} y2={35} stroke={C.pipeline} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <rect x={145 + i * 52} y={20} width={48} height={28} rx={6}
          fill={`${C.exec}10`} stroke={C.exec} strokeWidth={0.7} />
        <text x={169 + i * 52} y={37} textAnchor="middle" fontSize={10} fill={C.exec}>{s}</text>
        {i < stages.length - 1 && (
          <text x={196 + i * 52} y={37} fontSize={11} fill="var(--muted-foreground)">→</text>
        )}
      </motion.g>
    ))}
    <motion.path d="M 145 55 Q 250 75 405 55" fill="none" stroke={C.pipeline} strokeWidth={0.6}
      strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.5 }} />
    <motion.text x={275} y={75} textAnchor="middle" fontSize={10} fill={C.pipeline}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
      순서대로 반복 실행
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <ActionBox x={15} y={25} w={105} h={40} label="ExecInput" sub="target, checkpoint" color={C.exec} />
    <motion.line x1={125} y1={45} x2={165} y2={45} stroke={C.exec} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={170} y={20} w={90} h={48} label="Stage" sub=".execute()" color={C.pipeline} />
    </motion.g>
    <motion.line x1={265} y1={45} x2={300} y2={45} stroke={C.done} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={305} y={28} w={105} h={32} label="ExecOutput" sub="checkpoint, done" color={C.done} />
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      {'Input → execute() → Output{checkpoint, done}'}
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={70} y={20} w={130} h={32} label="ExecOutput" sub="done = false" color={C.exec} />
    <motion.path d="M 135 55 L 135 75 Q 135 85 125 85 L 60 85 Q 50 85 50 75 L 50 45 Q 50 35 60 35 L 65 35"
      fill="none" stroke={C.reorg} strokeWidth={0.8} strokeDasharray="3 2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
    <motion.text x={95} y={98} textAnchor="middle" fontSize={10} fill={C.reorg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      루프 중단 → 다음 반복
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={240} y={25} width={150} height={55} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={315} y={45} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
        이어서 실행
      </text>
      <text x={315} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        이전 checkpoint부터 재개
      </text>
    </motion.g>
  </g>);
}

export function Step3() {
  return (<g>
    <AlertBox x={20} y={20} w={90} h={40} label="reorg!" sub="블록 재구성" color={C.reorg} />
    <motion.line x1={115} y1={40} x2={155} y2={40} stroke={C.reorg} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={160} y={18} w={110} h={42} label="unwind()" sub="역방향 되감기" color={C.reorg} />
    </motion.g>
    <motion.line x1={275} y1={40} x2={310} y2={40} stroke={C.done} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <DataBox x={315} y={25} w={95} h={30} label="롤백 완료" color={C.done} />
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      해당 Stage 데이터만 부분 롤백 — Geth 대비 세밀한 제어
    </text>
  </g>);
}
