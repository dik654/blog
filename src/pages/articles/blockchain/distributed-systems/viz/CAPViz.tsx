import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'CAP 정리 (Brewer, 2000)', body: '분산 시스템은 Consistency, Availability, Partition tolerance 중 최대 2가지만 동시 보장.' },
  { label: 'CP — 일관성 + 분할 내성', body: '네트워크 분할 시 가용성 포기. 예: 전통 BFT, Tendermint — 합의 못하면 멈춤.' },
  { label: 'AP — 가용성 + 분할 내성', body: '네트워크 분할 시 일관성 포기. 예: Nakamoto 합의 — 포크 허용, 나중에 수렴.' },
  { label: 'PACELC — 정상 시에도 트레이드오프', body: 'P분할 시 A vs C 선택, Else(정상) 시 Latency vs Consistency. 더 현실적 모델.' },
];

const R = 55, CX = 150, CY = 80;
const angles = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6];
const labels = ['C', 'A', 'P'];
const fullLabels = ['Consistency', 'Availability', 'Partition Tol.'];
const colors = [C1, C2, C3];

export default function CAPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Triangle edges */}
          {[0, 1, 2].map(i => {
            const j = (i + 1) % 3;
            const x1 = CX + Math.cos(angles[i]) * R;
            const y1 = CY + Math.sin(angles[i]) * R;
            const x2 = CX + Math.cos(angles[j]) * R;
            const y2 = CY + Math.sin(angles[j]) * R;
            const edgeActive = (step === 1 && (i === 0 || j === 0) && (i === 2 || j === 2)) ||
                               (step === 2 && (i === 1 || j === 1) && (i === 2 || j === 2));
            return (
              <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={edgeActive ? colors[Math.max(i, j)] : 'var(--border)'}
                strokeWidth={edgeActive ? 1.5 : 0.8} />
            );
          })}
          {/* Vertex labels */}
          {labels.map((l, i) => {
            const x = CX + Math.cos(angles[i]) * (R + 18);
            const y = CY + Math.sin(angles[i]) * (R + 18);
            const active = step === 0 || (step === 1 && (i === 0 || i === 2)) || (step === 2 && (i === 1 || i === 2));
            return (
              <motion.g key={l} animate={{ opacity: active ? 1 : 0.25 }}>
                <circle cx={CX + Math.cos(angles[i]) * R} cy={CY + Math.sin(angles[i]) * R}
                  r={14} fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={active ? 1.2 : 0.6} />
                <text x={CX + Math.cos(angles[i]) * R} y={CY + Math.sin(angles[i]) * R + 4}
                  textAnchor="middle" fontSize={11} fontWeight={600} fill={colors[i]}>{l}</text>
                <text x={x} y={y + 3} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{fullLabels[i]}</text>
              </motion.g>
            );
          })}
          {/* Right side info */}
          <rect x={260} y={20} width={145} height={130} rx={6}
            fill={`${C1}06`} stroke={C1} strokeWidth={0.5} />
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={270} y={45} fontSize={10} fontWeight={600} fill={C1}>CP 시스템</text>
              <text x={270} y={63} fontSize={10} fill="var(--muted-foreground)">분할 시 → 서비스 중단</text>
              <text x={270} y={80} fontSize={10} fill="var(--muted-foreground)">Tendermint, Raft</text>
              <text x={270} y={97} fontSize={10} fill="var(--muted-foreground)">즉시 최종성 보장</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={270} y={45} fontSize={10} fontWeight={600} fill={C2}>AP 시스템</text>
              <text x={270} y={63} fontSize={10} fill="var(--muted-foreground)">분할 시 → 포크 허용</text>
              <text x={270} y={80} fontSize={10} fill="var(--muted-foreground)">Bitcoin, Ethereum PoW</text>
              <text x={270} y={97} fontSize={10} fill="var(--muted-foreground)">확률적 최종성</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={270} y={40} fontSize={10} fontWeight={600} fill={C3}>PACELC</text>
              <text x={270} y={58} fontSize={10} fill="var(--muted-foreground)">P: A vs C 선택</text>
              <text x={270} y={75} fontSize={10} fill="var(--muted-foreground)">E: Latency vs Consistency</text>
              <text x={270} y={92} fontSize={10} fill="var(--muted-foreground)">PA/EL: Dynamo, Cassandra</text>
              <text x={270} y={109} fontSize={10} fill="var(--muted-foreground)">PC/EC: BigTable, HBase</text>
            </motion.g>
          )}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={270} y={50} fontSize={10} fill={C1}>3가지 중 2가지만</text>
              <text x={270} y={68} fontSize={10} fill={C1}>동시 보장 가능</text>
              <text x={270} y={90} fontSize={10} fill="var(--muted-foreground)">네트워크 분할(P)은</text>
              <text x={270} y={105} fontSize={10} fill="var(--muted-foreground)">불가피 → C vs A 선택</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
