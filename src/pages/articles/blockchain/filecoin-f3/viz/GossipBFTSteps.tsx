import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './GossipBFTVizData';

export function StepRunLoop() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>gpbft.RunToCompletion() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.f3}>Line 1: for r.phase {'<'}= DECIDE {'{'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:   votes := r.collectVotes(ctx)  // GossipSub 수집
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3:   if !hasQuorum(votes) {'{'} return ErrNoQuorum {'}'}  // 2/3+ 파워
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={68} w={110} h={22} label="5단계 루프" sub="QUALITY→DECIDE" color={C.f3} />
    </motion.g>
  </g>);
}

export function StepQualityConverge() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.vote}>QUALITY → CONVERGE 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.vote}>Line 1: r.phase = QUALITY  // "이 tipset이 유효한가?"</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: r.broadcast(QualityVote{'{'}Value: proposal{'}'})
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: r.phase = CONVERGE  // 최다 득표 수렴 — 비잔틴 분산 흡수
    </motion.text>
  </g>);
}
