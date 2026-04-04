import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const STEPS = [
  { label: 'PING — 노드 생존 확인' },
  { label: 'STORE — 키-값 저장' },
  { label: 'FIND_NODE — 노드 탐색' },
  { label: 'FIND_VALUE — 값 탐색' },
];
const ANNOT = ['Ping/Pong 생존 확인', 'STORE key-value 저장', 'FIND_NODE k개 반환', 'FIND_VALUE 값 즉시 반환'];
const NAMES = ['PING', 'STORE', 'FIND_NODE', 'FIND_VALUE'];
const AX = 60, BX = 340, NY = 60, AY = 140;

export default function KadRPCViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Node A */}
          <circle cx={AX} cy={NY} r={22} fill={C[step] + '18'} stroke={C[step]} strokeWidth={1.5} />
          <text x={AX} y={NY + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={C[step]}>A</text>
          {/* Node B */}
          <circle cx={BX} cy={NY} r={22} fill={C[step] + '18'} stroke={C[step]} strokeWidth={1.5} />
          <text x={BX} y={NY + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={C[step]}>B</text>
          {/* Request arrow */}
          <motion.line
            key={`req-${step}`}
            x1={AX + 24} y1={NY - 8} x2={BX - 24} y2={NY - 8}
            stroke={C[step]} strokeWidth={1.5} markerEnd="url(#kadarr)"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.text
            key={`rn-${step}`} x={200} y={NY - 16} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={C[step]}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >{NAMES[step]}</motion.text>
          {/* Response arrow */}
          <motion.line
            key={`res-${step}`}
            x1={BX - 24} y1={NY + 8} x2={AX + 24} y2={NY + 8}
            stroke={C[step]} strokeWidth={1.5} strokeDasharray="6 3" markerEnd="url(#kadarr)"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.text
            key={`rr-${step}`} x={200} y={NY + 22} textAnchor="middle" fontSize={10}
            fill={C[step]} fillOpacity={0.7}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >{['Pong', '저장 완료', 'k개 NodeInfo', '값 / k개 노드'][step]}</motion.text>
          {/* k-bucket row for step 0,1 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              {[0, 1, 2].map(i => (
                <g key={i}>
                  <rect x={140 + i * 44} y={AY} width={38} height={22} rx={4}
                    fill={C[step] + '12'} stroke={C[step]} strokeWidth={1} strokeOpacity={0.4} />
                  <text x={159 + i * 44} y={AY + 14} textAnchor="middle" fontSize={10}
                    fill={C[step]} fillOpacity={0.7}>node {i + 1}</text>
                </g>
              ))}
              <text x={200} y={AY + 38} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.35}>
                k-버킷 (가장 가까운 노드들)
              </text>
            </motion.g>
          )}
          <defs>
            <marker id="kadarr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={C[step]} />
            </marker>
          </defs>
                  <motion.text x={405} y={90} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
