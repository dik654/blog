import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { propose: '#6366f1', prevote: '#10b981', precommit: '#f59e0b' };

const STEPS = [
  { label: 'Round 0 — 기본 타임아웃', body: 'Propose=3s, Prevote=1s, Precommit=1s입니다.' },
  { label: 'Round 1 — 타임아웃 증가', body: '리더 장애 시 각 타임아웃이 500ms씩 증가합니다.' },
  { label: 'Round 2+ — 점진적 증가', body: '연속 실패 시 Safety를 유지하며 복구를 기다립니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">config.Consensus — Round 0 기본값</text>
    <text x={20} y={44} fontSize={10} fill={C.propose}>Line 1: TimeoutPropose = 3000ms  // 리더 제안 대기</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.prevote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: TimeoutPrevote = 1000ms  // +2/3 prevote 대기
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.precommit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: TimeoutPrecommit = 1000ms  // +2/3 precommit 대기
    </motion.text>
    <motion.text x={20} y={104} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      총 ~5s에 블록 생성 (정상 네트워크)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={350} y={92} w={100} h={22} label="합계 5.0s" sub="Round 0" color={C.prevote} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">timeoutPropose() — Round 1 계산</text>
    <text x={20} y={44} fontSize={10} fill={C.propose}>Line 1: timeout = TimeoutPropose + TimeoutProposeDelta*round</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.propose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 3000 + 500*1 = 3500ms  (Propose)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.prevote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 1000 + 500*1 = 1500ms  (Prevote, Precommit)
    </motion.text>
    <motion.text x={20} y={104} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Delta 기본값 = 500ms — Safety 유지하며 리더 교체
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={350} y={92} w={100} h={22} label="합계 6.5s" sub="Round 1" color={C.propose} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">Round 2 이상 — 점진적 증가</text>
    <text x={20} y={44} fontSize={10} fill={C.propose}>Line 1: Round 2: 4000 + 2000 + 2000 = 8.0s</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.prevote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: Round 3: 4500 + 2500 + 2500 = 9.5s
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.precommit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: Round N: base + delta*N  // 선형 증가
    </motion.text>
    <motion.text x={20} y={104} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Liveness: 정직 노드 2/3+ 존재 시 결국 합의 도달
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function TimeoutStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
