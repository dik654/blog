import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '초기 후보 선택: 라우팅 테이블에서 k=20개' },
  { label: 'alpha=3 병렬 질의: FIND_NODE 동시 전송' },
  { label: '응답 병합 & 정렬: XOR 거리 기준 재정렬' },
  { label: '수렴 확인: 최근접 노드가 개선되지 않으면 종료' },
];

const ANNOT = ['XOR 거리 기준 k=20 선택', 'alpha=3 병렬 질의 전송', '응답 병합+XOR 재정렬', '개선 없으면 수렴 종료'];
const NODES = [
  { id: 'T', x: 310, y: 100, color: '#ef4444', label: 'Target' },
  { id: 'N1', x: 80, y: 40, color: '#6366f1', label: 'N1' },
  { id: 'N2', x: 60, y: 120, color: '#6366f1', label: 'N2' },
  { id: 'N3', x: 110, y: 170, color: '#6366f1', label: 'N3' },
  { id: 'N4', x: 190, y: 50, color: '#10b981', label: 'N4' },
  { id: 'N5', x: 200, y: 140, color: '#10b981', label: 'N5' },
  { id: 'N6', x: 260, y: 80, color: '#f59e0b', label: 'N6' },
];

export default function KadLookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* All nodes */}
          {NODES.map(n => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.id === 'T' ? 14 : 10}
                fill={`${n.color}20`} stroke={n.color} strokeWidth={n.id === 'T' ? 2.5 : 1.5} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
            </g>
          ))}

          {/* Step 0: highlight initial candidates */}
          {step === 0 && [1, 2, 3].map(i => (
            <motion.circle key={i} cx={NODES[i].x} cy={NODES[i].y} r={16}
              fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3,3"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }} />
          ))}

          {/* Step 1: parallel queries from N1,N2,N3 */}
          {step === 1 && [1, 2, 3].map(i => (
            <motion.line key={i} x1={NODES[i].x} y1={NODES[i].y}
              x2={NODES[i + 3] ? NODES[i + 3].x : NODES[0].x}
              y2={NODES[i + 3] ? NODES[i + 3].y : NODES[0].y}
              stroke="#10b981" strokeWidth={1.5} strokeDasharray="5,3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }} />
          ))}
          {step === 1 && [1, 2, 3].map(i => (
            <motion.circle key={`p${i}`} r={4} fill="#10b981"
              initial={{ cx: NODES[i].x, cy: NODES[i].y }}
              animate={{ cx: NODES[i + 3] ? NODES[i + 3].x : NODES[0].x, cy: NODES[i + 3] ? NODES[i + 3].y : NODES[0].y }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.3 }} />
          ))}

          {/* Step 2: merge & sort - closer nodes highlighted */}
          {step === 2 && [4, 5, 6].map(i => (
            <motion.circle key={i} cx={NODES[i].x} cy={NODES[i].y} r={16}
              fill="none" stroke="#f59e0b" strokeWidth={1.5}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: (i - 4) * 0.1 }} />
          ))}
          {step === 2 && (
            <motion.line x1={NODES[6].x} y1={NODES[6].y} x2={NODES[0].x} y2={NODES[0].y}
              stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }} />
          )}

          {/* Step 3: converged - N6 closest */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}>
              <line x1={NODES[6].x} y1={NODES[6].y} x2={NODES[0].x} y2={NODES[0].y}
                stroke="#10b981" strokeWidth={2.5} />
              <rect x={250} y={170} width={100} height={24} rx={5} fill="#10b98120" stroke="#10b981" />
              <text x={300} y={186} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">수렴 완료</text>
            </motion.g>
          )}
                  <motion.text x={385} y={105} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
