import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox } from '@/components/viz/boxes';
import { C, STEPS } from './ExecutionDetailVizData';

function Step0() {
  return (<g>
    <rect x={30} y={35} width={360} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={50} y={52} fontSize={10} fill="var(--muted-foreground)">checkpoint</text>
    <motion.rect x={50} y={58} height={6} rx={3} fill={C.range}
      initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
    <rect x={50} y={58} width={320} height={6} rx={3} fill="var(--border)" opacity={0.2} />
    <motion.text x={255} y={55} fontSize={11} fill={C.range} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      start=18,399,501 → end=18,400,000
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ExecInput.next_block_range() — 체크포인트 이후 ~ target
    </text>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={40} y={25} w={120} h={50} label="ExecutorProvider" sub="revm 팩토리" color={C.exec} />
    <motion.line x1={165} y1={50} x2={220} y2={50} stroke={C.exec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={225} y={25} w={130} h={50} label="BatchExecutor" sub="상태 누적 실행기" color={C.exec} />
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      StateProviderLatest로 최신 DB 상태를 바인딩
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <ellipse cx={60} cy={55} rx={35} ry={25} fill={`${C.db}10`} stroke={C.db} strokeWidth={0.8} />
    <text x={60} y={52} textAnchor="middle" fontSize={11} fill={C.db}>DB</text>
    <text x={60} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">MDBX</text>
    <motion.line x1={100} y1={55} x2={160} y2={55} stroke={C.db} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={165} y={30} w={80} h={22} label="Header" color={C.range} />
      <DataBox x={165} y={56} w={80} h={22} label="Body (TXs)" color={C.exec} />
      <DataBox x={165} y={82} w={80} h={22} label="Senders" color={C.db} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={280} y={52} fontSize={10} fill="var(--muted-foreground)">→</text>
      <DataBox x={295} y={40} w={95} h={30} label="SealedBlock" sub="완성된 블록" color={C.state} />
    </motion.g>
  </g>);
}

function Step3() {
  const txs = ['TX₀', 'TX₁', 'TX₂'];
  return (<g>
    <DataBox x={15} y={35} w={75} h={28} label="SealedBlock" color={C.state} />
    {txs.map((tx, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <rect x={120} y={20 + i * 28} width={48} height={20} rx={10}
          fill={`${C.exec}12`} stroke={C.exec} strokeWidth={0.7} />
        <text x={144} y={34 + i * 28} textAnchor="middle" fontSize={10} fill={C.exec}>{tx}</text>
      </motion.g>
    ))}
    <motion.circle r={3} fill={C.exec}
      initial={{ cx: 172, cy: 44, opacity: 1 }}
      animate={{ cx: 220, cy: 50, opacity: 0 }}
      transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.2 }} />
    <ModuleBox x={225} y={25} w={70} h={45} label="revm" sub="실행" color={C.exec} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <rect x={320} y={25} width={85} height={45} rx={6} fill="var(--card)" />
      <rect x={320} y={25} width={85} height={45} rx={6} fill={`${C.state}08`} stroke={C.state} strokeWidth={0.6} />
      <text x={362} y={43} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.state}>BundleState</text>
      <text x={362} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">상태 변경 누적</text>
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <StatusBox x={30} y={20} w={160} h={55} label="블록 진행" sub="18,399,501 → 18,400,000"
      color={C.exec} progress={0.7} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={220} y={28} width={170} height={40} rx={6} fill="var(--card)" />
      <rect x={220} y={28} width={3} height={40} rx={1.5} fill={C.check} />
      <rect x={220} y={28} width={170} height={40} rx={6} fill="transparent" stroke="var(--border)" strokeWidth={0.4} />
      <text x={310} y={46} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
        commit_threshold 도달
      </text>
      <text x={310} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        finalize() → DB 중간 기록
      </text>
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill={C.check}>
      크래시 시 이 지점부터 재개 가능
    </text>
  </g>);
}

function Step5() {
  return (<g>
    <rect x={20} y={25} width={90} height={45} rx={6} fill="var(--card)" />
    <rect x={20} y={25} width={90} height={45} rx={6} fill={`${C.state}08`} stroke={C.state} strokeWidth={0.6} />
    <text x={65} y={44} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.state}>BundleState</text>
    <text x={65} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">잔여 변경분</text>
    <motion.line x1={115} y1={48} x2={175} y2={48} stroke={C.db} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ellipse cx={215} cy={48} rx={35} ry={22} fill={`${C.db}12`} stroke={C.db} strokeWidth={0.8} />
      <text x={215} y={45} textAnchor="middle" fontSize={11} fill={C.db}>DB</text>
      <text x={215} y={57} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">write</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x={280} y={32} width={110} height={32} rx={16} fill="var(--card)" />
      <rect x={280} y={32} width={110} height={32} rx={16}
        fill={`${C.check}12`} stroke={C.check} strokeWidth={0.8} />
      <text x={335} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.check}>
        Checkpoint(end)
      </text>
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      {'ExecOutput { checkpoint, done: true } 반환'}
    </text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function ExecutionDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
