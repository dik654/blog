import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DORY_STEPS } from '../DoryCommitmentData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { id: 'col', label: '컬럼 데이터', color: '#6366f1', x: 15, y: 50 },
  { id: 'cc', label: 'CommittableColumn', color: '#0ea5e9', x: 130, y: 10 },
  { id: 'hkzg', label: 'HyperKZG', color: '#10b981', x: 130, y: 60 },
  { id: 'dory', label: 'DORY', color: '#f59e0b', x: 130, y: 110 },
  { id: 'commit', label: 'Commitment', color: '#8b5cf6', x: 280, y: 50 },
];
const EDGES = [
  { from: 0, to: 1, label: '타입 변환' },
  { from: 1, to: 2, label: 'KZG commit' },
  { from: 1, to: 3, label: 'IPA commit' },
  { from: 2, to: 4, label: 'G1 포인트' },
  { from: 3, to: 4, label: 'G1 포인트' },
];
const VN = [[0, 1, 2, 3, 4], [0, 1], [1, 2, 4], [1, 3, 4]];
const VE = [[0, 1, 2, 3, 4], [0], [1, 3], [2, 4]];

export default function CommitFlowViz() {
  return (
    <StepViz steps={DORY_STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x + 55} y1={f.y + 15} x2={t.x} y2={t.y + 15}
                  stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 2" />
                <rect x={(f.x + 55 + t.x) / 2 - 22} y={(f.y + t.y) / 2 + 3} width={44} height={11} rx={2} fill="var(--card)" />
                <text x={(f.x + 55 + t.x) / 2} y={(f.y + t.y) / 2 + 10}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x} y={n.y} width={110} height={30} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + 55} y={n.y + 19} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
