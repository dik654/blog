import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'K-버킷 구조: 비트별 거리 범위로 분류' },
  { label: '로그 스케일: 가까운 노드를 더 세밀하게 관리' },
  { label: 'LRU 교체: 오래된 노드 우선, 응답 없으면 교체' },
];

const ANNOT = ['XOR 거리별 k-bucket 분류', '가까운 노드 더 세밀하게 관리', 'LRU Ping 실패 시 교체'];
const BUCKETS = [
  { idx: 0, fill: 3, label: '50%', color: '#6366f1' },
  { idx: 1, fill: 5, label: '25%', color: '#6366f1' },
  { idx: 2, fill: 2, label: '12.5%', color: '#3b82f6' },
  { idx: 3, fill: 4, label: '6.25%', color: '#3b82f6' },
  { idx: 4, fill: 1, label: '3.1%', color: '#10b981' },
  { idx: 5, fill: 3, label: '1.6%', color: '#10b981' },
  { idx: 6, fill: 0, label: '0.8%', color: '#f59e0b' },
  { idx: 7, fill: 2, label: '0.4%', color: '#f59e0b' },
];

export default function RoutingTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* My node */}
          <circle cx={30} cy={105} r={12} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1.5} />
          <text x={30} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">ME</text>

          {/* Buckets */}
          {BUCKETS.map((b, i) => {
            const y = 15 + i * 24;
            const barW = (b.fill / 16) * 180;
            const highlight = step === 0 ? true : step === 1 ? i >= 4 : i === 6;
            return (
              <g key={b.idx}>
                <text x={55} y={y + 14} fontSize={10} fontWeight={600} fill={b.color}>B{b.idx}</text>
                {/* background bar */}
                <rect x={80} y={y + 2} width={180} height={16} rx={3}
                  fill={`${b.color}06`} stroke={b.color} strokeWidth={0.5} />
                {/* fill bar */}
                <motion.rect x={80} y={y + 2} width={barW} height={16} rx={3}
                  fill={highlight ? `${b.color}50` : `${b.color}25`}
                  initial={{ width: 0 }} animate={{ width: barW }}
                  transition={{ delay: i * 0.05, duration: 0.4 }} />
                <text x={270} y={y + 14} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">{b.fill}/16</text>
                <text x={310} y={y + 14} fontSize={10} fill="var(--muted-foreground)">{b.label}</text>
                {/* LRU indicator for step 2 */}
                {step === 2 && b.fill > 0 && (
                  <motion.circle cx={80 + barW - 5} cy={y + 10} r={3} fill={b.color}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }} />
                )}
              </g>
            );
          })}

          {/* Connection lines from ME to buckets */}
          <line x1={42} y1={105} x2={55} y2={105} stroke="var(--border)" strokeWidth={1} />

          {/* Step 1: log scale label */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x={345} y={55} fontSize={10} fontWeight={600} fill="#6366f1" textAnchor="end">먼 노드</text>
              <text x={345} y={175} fontSize={10} fontWeight={600} fill="#f59e0b" textAnchor="end">가까운 노드</text>
              <line x1={340} y1={60} x2={340} y2={168} stroke="var(--border)" strokeWidth={1}
                markerEnd="url(#arrowhead)" />
            </motion.g>
          )}

          {/* Step 2: LRU badge */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <rect x={80} y={155} width={90} height={20} rx={4} fill="#ef444420" stroke="#ef4444" />
              <text x={125} y={168} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">LRU 교체</text>
            </motion.g>
          )}
          <defs>
            <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
                  <motion.text x={385} y={105} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
