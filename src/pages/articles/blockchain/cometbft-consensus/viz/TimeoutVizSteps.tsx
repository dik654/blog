import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './TimeoutVizData';

export function StepDispatch() {
  const timeouts = [
    { label: 'Propose 타임아웃', target: 'enterPrevote', color: C.propose },
    { label: 'PrevoteWait', target: 'enterPrecommit', color: C.prevote },
    { label: 'PrecommitWait', target: 'enterNewRound(r+1)', color: C.precommit },
  ];
  return (<g>
    <ModuleBox x={10} y={8} w={115} h={45} label="handleTimeout" sub="타임아웃 처리" color={C.err} />
    {timeouts.map((t, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <motion.line x1={130} y1={30} x2={165} y2={15 + i * 28}
          stroke={t.color} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.3 }} />
        <ActionBox x={170} y={5 + i * 28} w={105} h={22} label={t.label} color={t.color} />
        <text x={285} y={19 + i * 28} fontSize={10} fill={t.color}>{'→ '}{t.target}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepBackoff() {
  const rounds = [0, 1, 2, 3];
  const baseW = 55;
  return (<g>
    <text x={10} y={18} fontSize={10} fill="var(--foreground)" fontWeight={600}>
      TimeoutPropose + round × Delta
    </text>
    {rounds.map((r, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <text x={15} y={42 + i * 18} fontSize={10} fill="var(--muted-foreground)">R{r}</text>
        <rect x={35} y={32 + i * 18} width={baseW + i * 20} height={12} rx={3}
          fill={`${C.propose}20`} stroke={C.propose} strokeWidth={0.5} />
        <text x={38 + (baseW + i * 20) / 2} y={42 + i * 18} fontSize={10}
          textAnchor="middle" fill={C.propose}>
          {3000 + i * 500}ms
        </text>
      </motion.g>
    ))}
    <motion.text x={250} y={65} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      라운드마다 선형 증가 → 네트워크 안정화 대기
    </motion.text>
  </g>);
}

export function StepWAL() {
  return (<g>
    <ActionBox x={10} y={15} w={95} h={30} label="signAddVote" sub="투표 서명" color={C.propose} />
    <motion.line x1={110} y1={30} x2={150} y2={30} stroke={C.wal} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={155} y={15} w={90} h={30} label="WAL" sub="WriteSync(fsync)" color={C.wal} />
    </motion.g>
    <motion.line x1={250} y1={30} x2={290} y2={30} stroke={C.precommit} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={295} y={8} w={110} h={45} label="handleMsg" sub="디스패치 진행" color={C.precommit} />
    </motion.g>
    <motion.text x={210} y={72} textAnchor="middle" fontSize={10} fill={C.wal}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      크래시 후 WAL 리플레이 → 이중 서명 방지
    </motion.text>
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
      EndHeightMessage로 커밋 완료 지점 식별
    </motion.text>
  </g>);
}
