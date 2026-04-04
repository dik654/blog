import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'DhtState: 160비트 Id20 노드 식별자' },
  { label: 'XOR 거리 메트릭: Id20::distance()' },
  { label: 'BucketTree: 동적 k-bucket 트리' },
  { label: 'NodeStatus: Good/Questionable/Bad/Unknown' },
  { label: '노드 삽입: 기존 확인 → 교체 → 분할' },
];

const ANNOT = ['DhtState Id20 노드 식별', 'XOR distance() 거리 계산', '동적 BucketTree 구조', '15분 내 응답 시 Good', '5단계 노드 삽입 과정'];
const NODES = [
  { x: 180, y: 30, label: 'Root', color: '#6366f1' },
  { x: 100, y: 75, label: 'L', color: '#3b82f6' },
  { x: 260, y: 75, label: 'R', color: '#10b981' },
  { x: 60, y: 120, label: 'LL', color: '#3b82f6' },
  { x: 140, y: 120, label: 'LR', color: '#f59e0b' },
];

export default function DHTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Tree edges */}
          {[[0,1],[0,2],[1,3],[1,4]].map(([a,b], i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y + 12} x2={NODES[b].x} y2={NODES[b].y - 12}
              stroke="var(--border)" strokeWidth={1.5} />
          ))}
          {/* Nodes */}
          {NODES.map((n, i) => {
            const active = (step === 0 && i === 0) || (step === 2 && i <= 2) ||
              (step === 4 && i >= 3) || (step === 1) || (step === 3 && i <= 2);
            return (
              <g key={n.label}>
                <motion.circle cx={n.x} cy={n.y} r={16}
                  fill={active ? `${n.color}22` : `${n.color}08`}
                  stroke={active ? n.color : `${n.color}30`}
                  strokeWidth={active ? 2 : 1}
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? n.color : 'var(--muted-foreground)'}>{n.label}</text>
              </g>
            );
          })}
          {/* XOR distance indicator on step 1 */}
          {step === 1 && (
            <motion.text x={180} y={85} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="#6366f1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              XOR = A ^ B
            </motion.text>
          )}
          {/* Status badges on step 3 */}
          {step === 3 && ['Good', 'Quest.', 'Bad'].map((s, i) => (
            <g key={s}>
              <rect x={50 + i * 100} y={135} width={60} height={16} rx={4}
                fill={i === 0 ? '#10b98130' : i === 1 ? '#f59e0b30' : '#ef444430'} />
              <text x={80 + i * 100} y={146} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : '#ef4444'}>{s}</text>
            </g>
          ))}
                  <motion.text x={365} y={78} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
