import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const NODES = [
  { label: 'Sequencer', color: C[1], sub: '배치 생성' },
  { label: 'L1 게시', color: C[0], sub: 'calldata' },
  { label: '챌린지 기간', color: C[2], sub: '7일' },
  { label: '사기 증명', color: '#ef4444', sub: 'Fraud Proof' },
  { label: '확정', color: C[1], sub: 'Finalized' },
];
const EDGES = ['배치 제출', '데이터 게시', '이의 제기', '통과'];
const STEPS = [
  { label: 'Sequencer가 배치 생성' },
  { label: 'L1에 calldata 게시' },
  { label: '7일 챌린지 기간 시작' },
  { label: '사기 증명 제출 가능' },
  { label: '이의 없으면 확정' },
];
const NW = 75, NH = 44, GAP = 30, SY = 60;
function nx(i: number) { return 15 + i * (NW + GAP); }

export default function OptimisticFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="op-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW + 2, x2 = nx(i + 1) - 2;
            return (
              <motion.g key={`e-${i}`} animate={{ opacity: i < step ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY}
                  stroke="var(--muted-foreground)" strokeWidth={1.2}
                  markerEnd="url(#op-ah)" />
                <text x={(x1 + x2) / 2} y={SY + NH / 2 + 14} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const x = nx(i), glow = i === step;
            return (
              <motion.g key={i} animate={{ opacity: i <= step ? 1 : 0.15 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? `${n.color}22` : '#ffffff08'}
                  stroke={n.color} strokeWidth={glow ? 2 : 1} />
                <text x={x + NW / 2} y={SY - 2} textAnchor="middle"
                  fontSize={11} fontWeight={600} fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 12} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
          {step >= 2 && (
            <motion.rect x={nx(2)} y={SY - NH / 2 - 18}
              width={NW * 2 + GAP} height={14} rx={4}
              fill={`${C[2]}10`} stroke={C[2]} strokeWidth={0.8}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
