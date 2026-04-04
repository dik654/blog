import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'proposer', label: '제안자', color: '#6366f1', x: 60, y: 20 },
  { id: 'validators', label: '밸리데이터', color: '#8b5cf6', x: 200, y: 20 },
  { id: 'prevote', label: 'Prevote', color: '#0ea5e9', x: 340, y: 20 },
  { id: 'precommit', label: 'Precommit', color: '#10b981', x: 340, y: 80 },
  { id: 'commit', label: '블록 커밋', color: '#f59e0b', x: 200, y: 80 },
  { id: 'staking', label: '스테이킹', color: '#ef4444', x: 60, y: 80 },
];

const EDGES = [
  { from: 0, to: 1, label: '블록 제안' },
  { from: 1, to: 2, label: '검증 & 투표' },
  { from: 2, to: 3, label: '2/3+ 수집' },
  { from: 3, to: 4, label: '2/3+ 확인' },
  { from: 5, to: 0, label: '보증금 기반' },
];

const STEPS = [
  { label: '블록 제안 (Propose)' },
  { label: 'Prevote & Precommit' },
  { label: '블록 커밋 & Finality' },
  { label: '스테이킹 & 거버넌스' },
];

const ANNOT = ['라운드 로빈 블록 제안', 'Prevote/Precommit 투표', '2/3+ 블록 커밋 Finality', '스테이킹 거버넌스 보증금'];
const VN = [[0, 1], [1, 2, 3], [3, 4], [0, 1, 2, 3, 4, 5]];
const VE = [[0], [1, 2], [3], [0, 1, 2, 3, 4]];

export default function ConsensusServicesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 50} y={n.y} width={100} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={405} y={65} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
