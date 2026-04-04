import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepSolution() {
  return (<g>
    <ModuleBox x={40} y={15} w={130} h={45} label="EC (블록 생산)" sub="기존 그대로" color={C.ec} />
    <motion.line x1={175} y1={38} x2={230} y2={38} stroke={C.f3} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={235} y={15} w={140} h={45} label="F3 (확정 레이어)" sub="수 분 내 확정" color={C.f3} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      EC를 변경하지 않고 확정성만 추가
    </motion.text>
  </g>);
}

export function StepVoting() {
  const phases = ['QUALITY', 'CONVERGE', 'PREPARE', 'COMMIT', 'DECIDE'];
  return (<g>
    {phases.map((p, i) => (
      <motion.g key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={8 + i * 82} y={30} width={72} height={28} rx={4}
          fill={`${C.vote}12`} stroke={C.vote} strokeWidth={0.8} />
        <text x={44 + i * 82} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.vote}>{p}</text>
        {i < 4 && <motion.line x1={80 + i * 82} y1={44} x2={90 + i * 82} y2={44}
          stroke={C.f3} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.1 + 0.2 }} />}
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.f3}>각 단계마다 2/3+ 스토리지 파워 확인</text>
  </g>);
}

export function StepCert() {
  return (<g>
    <ActionBox x={20} y={25} w={110} h={40} label="투표 완료" sub="5단계 모두 통과" color={C.vote} />
    <motion.line x1={135} y1={45} x2={185} y2={45} stroke={C.cert} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
      <DataBox x={190} y={28} w={110} h={34} label="Certificate" sub="확정 인증서" color={C.cert} />
    </motion.g>
    <motion.text x={350} y={48} textAnchor="middle" fontSize={11} fill={C.f3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      reorg 불가
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      900 에폭 → 수 분으로 확정 시간 단축
    </text>
  </g>);
}
