import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { VERIFY_STEPS } from '../VerificationData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { id: 'proof', label: '증명 (bytes)', color: '#6366f1', x: 15, y: 40 },
  { id: 'transcript', label: 'Transcript 재구성', color: '#0ea5e9', x: 145, y: 10 },
  { id: 'sumcheck', label: 'Sumcheck 검증', color: '#10b981', x: 145, y: 60 },
  { id: 'pcs', label: 'PCS 검증', color: '#f59e0b', x: 145, y: 110 },
  { id: 'result', label: '검증 결과', color: '#8b5cf6', x: 290, y: 55 },
];
const EDGES = [
  { from: 0, to: 1, label: '파싱' },
  { from: 1, to: 2, label: '챌린지' },
  { from: 2, to: 3, label: '평가점' },
  { from: 3, to: 4, label: 'pairing' },
];
const VN = [[0, 1, 2, 3, 4], [0, 1], [1, 2], [2, 3, 4]];
const VE = [[0, 1, 2, 3], [0], [1], [2, 3]];

export default function VerifyFlowViz() {
  return (
    <StepViz steps={VERIFY_STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x + 60} y1={f.y + 15} x2={t.x} y2={t.y + 15}
                  stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 2" />
                <rect x={(f.x + 60 + t.x) / 2 - 22} y={(f.y + t.y) / 2 + 3} width={44} height={11} rx={2} fill="var(--card)" />
                <text x={(f.x + 60 + t.x) / 2} y={(f.y + t.y) / 2 + 10}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x} y={n.y} width={120} height={30} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + 60} y={n.y + 19} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
