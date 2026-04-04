import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'State Machine Replication', body: '모든 복제본이 동일한 초기 상태에서 같은 순서로 명령을 실행하면 같은 결과에 도달한다. — Schneider, 1990' },
  { label: '클라이언트 요청', body: '클라이언트가 명령(command)을 제출한다. 예: 트랜잭션, 상태 변경 요청.' },
  { label: '합의 & 순서 결정', body: '리더가 명령을 수집하고, 합의 프로토콜로 전체 순서(total order)를 결정한다.' },
  { label: '결정론적 실행', body: '모든 복제본이 합의된 순서대로 명령을 실행한다. f(S, cmd) → S\'. 동일한 상태 전이.' },
];

const REPLICAS = [
  { label: 'R1', x: 260, y: 40 },
  { label: 'R2', x: 260, y: 80 },
  { label: 'R3', x: 260, y: 120 },
];

export default function SMRModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Client */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.4 }}>
            <rect x={20} y={60} width={70} height={30} rx={5} fill={`${C3}12`} stroke={C3} strokeWidth={1} />
            <text x={55} y={79} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>Client</text>
          </motion.g>
          {/* Arrow: Client → Consensus */}
          <motion.line x1={90} y1={75} x2={140} y2={75} stroke={C3} strokeWidth={0.8}
            animate={{ opacity: step >= 1 ? 0.8 : 0.2 }} markerEnd="url(#arr)" />
          {/* Consensus box */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <rect x={140} y={50} width={80} height={50} rx={6} fill={`${C1}10`} stroke={C1} strokeWidth={step >= 2 ? 1.2 : 0.6} />
            <text x={180} y={72} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>Consensus</text>
            <text x={180} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Total Order</text>
          </motion.g>
          {/* Replicas */}
          {REPLICAS.map((r) => {
            const active = step >= 3;
            return (
              <motion.g key={r.label} animate={{ opacity: active ? 1 : (step === 0 ? 0.5 : 0.3) }}>
                <rect x={r.x} y={r.y} width={90} height={28} rx={5}
                  fill={`${C2}${active ? '12' : '06'}`} stroke={C2} strokeWidth={active ? 1.2 : 0.6} />
                <text x={r.x + 18} y={r.y + 17} fontSize={10} fontWeight={500} fill={C2}>{r.label}</text>
                {active && (
                  <motion.text x={r.x + 55} y={r.y + 17} fontSize={10} fill="var(--muted-foreground)"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    S → S'
                  </motion.text>
                )}
                {/* Arrow from consensus to replica */}
                <motion.line x1={220} y1={75} x2={r.x} y2={r.y + 14}
                  stroke={C2} strokeWidth={0.6} animate={{ opacity: step >= 2 ? 0.6 : 0.15 }} />
              </motion.g>
            );
          })}
          {/* Label */}
          <text x={380} y={150} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
            동일 순서 → 동일 상태
          </text>
          <defs>
            <marker id="arr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C3} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
