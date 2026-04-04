import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const NODES = [
  { label: 'Sequencer', color: C[1], sub: '배치 생성' },
  { label: 'Prover', color: C[2], sub: 'ZK 증명 생성' },
  { label: 'L1 검증', color: C[0], sub: 'Verifier' },
  { label: '즉시 확정', color: C[1], sub: 'Finalized' },
];
const EDGES = ['배치 전달', '증명 제출', '검증 통과'];
const STEPS = [
  { label: 'Sequencer가 배치 생성', body: 'Sequencer가 L2 트랜잭션을 모아 배치로 만듭니다.' },
  { label: 'Prover가 ZK 증명 생성', body: 'Prover가 상태 전이의 정확성을 증명하는 ZK proof를 생성합니다.' },
  { label: 'L1 Verifier가 증명 검증', body: 'L1 컨트랙트의 Verifier가 proof를 검증합니다. O(1) 시간.' },
  { label: '검증 즉시 확정', body: '검증 통과 즉시 상태가 확정됩니다. 챌린지 기간 불필요.' },
];
const NW = 72, NH = 36, GAP = 90, SY = 55;
function nx(i: number) { return 16 + i * GAP; }

export default function ZKRollupFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="zk-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW, x2 = nx(i + 1);
            return (
              <motion.g key={`e-${i}`} animate={{ opacity: i < step ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY}
                  stroke="var(--muted-foreground)" strokeWidth={1.2}
                  markerEnd="url(#zk-ah)" />
                <text x={(x1 + x2) / 2} y={SY - 8} textAnchor="middle"
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
                <text x={x + NW / 2} y={SY} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 11} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
          {/* proof generation time indicator */}
          {step >= 1 && (
            <motion.text x={nx(1) + NW / 2} y={SY + 30} textAnchor="middle"
              fontSize={10} fill={C[2]} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              GPU 가속 증명 (~분 단위)
            </motion.text>
          )}
          {/* instant finality badge */}
          {step === 3 && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.3 }}>
              <circle cx={nx(3) + NW / 2} cy={14} r={8}
                fill={C[1]} style={{ filter: `drop-shadow(0 0 4px ${C[1]}88)` }} />
              <text x={nx(3) + NW / 2} y={17} textAnchor="middle"
                fontSize={10} fill="white" fontWeight={600}>!</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
