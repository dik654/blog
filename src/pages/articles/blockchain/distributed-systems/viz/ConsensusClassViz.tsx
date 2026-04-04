import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '합의 알고리즘 분류', body: '장애 모델(CFT vs BFT)과 최종성 유형(결정적 vs 확률적)으로 분류.' },
  { label: 'CFT — Crash Fault Tolerant', body: '노드가 멈추기만 하고 악의적 행동 없음. Raft, Paxos. f < n/2 허용.' },
  { label: 'BFT — Byzantine Fault Tolerant', body: '임의의 악의적 행동 허용. PBFT, HotStuff, Tendermint. f < n/3 허용.' },
  { label: '결정적 vs 확률적 최종성', body: '결정적 — 커밋 즉시 확정(BFT). 확률적 — 시간이 지날수록 확정 확률 증가(Nakamoto).' },
];

const QUADRANTS = [
  { label: 'CFT+결정적', examples: 'Raft, Paxos', x: 40, y: 35, color: C1 },
  { label: 'BFT+결정적', examples: 'PBFT, HotStuff', x: 220, y: 35, color: C2 },
  { label: 'CFT+확률적', examples: '(드묾)', x: 40, y: 90, color: C1 },
  { label: 'BFT+확률적', examples: 'Nakamoto, Filecoin', x: 220, y: 90, color: C3 },
];

export default function ConsensusClassViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Axes */}
          <line x1={35} y1={25} x2={35} y2={130} stroke="var(--border)" strokeWidth={0.8} />
          <line x1={35} y1={80} x2={400} y2={80} stroke="var(--border)" strokeWidth={0.8} />
          <text x={15} y={55} fontSize={10} fill="var(--muted-foreground)" transform="rotate(-90,15,55)">최종성</text>
          <text x={20} y={50} fontSize={10} fill="var(--muted-foreground)">결정적</text>
          <text x={20} y={110} fontSize={10} fill="var(--muted-foreground)">확률적</text>
          <text x={120} y={140} fontSize={10} fill="var(--muted-foreground)">CFT (f{'<'}n/2)</text>
          <text x={290} y={140} fontSize={10} fill="var(--muted-foreground)">BFT (f{'<'}n/3)</text>
          {/* Quadrant boxes */}
          {QUADRANTS.map((q, i) => {
            const highlight = (step === 1 && (i === 0 || i === 2)) ||
                              (step === 2 && (i === 1 || i === 3)) ||
                              (step === 3);
            const op = step === 0 || highlight ? 1 : 0.2;
            return (
              <motion.g key={q.label} animate={{ opacity: op }} transition={{ duration: 0.3 }}>
                <rect x={q.x} y={q.y} width={170} height={38} rx={5}
                  fill={`${q.color}${highlight ? '12' : '06'}`}
                  stroke={q.color} strokeWidth={highlight ? 1.2 : 0.6} />
                <text x={q.x + 8} y={q.y + 16} fontSize={10} fontWeight={500} fill={q.color}>
                  {q.label}
                </text>
                <text x={q.x + 8} y={q.y + 30} fontSize={10} fill="var(--muted-foreground)">
                  {q.examples}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
