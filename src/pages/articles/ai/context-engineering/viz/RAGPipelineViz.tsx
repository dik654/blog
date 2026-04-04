import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PIPELINE_NODES } from './RAGPipelineData';

const W = 460, H = 200;
const BW = 66, BH = 34, CY = 60;

export default function RAGPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* pipeline nodes */}
          {PIPELINE_NODES.map((n, i) => {
            const active = step === i;
            const done = step > i;
            const op = active ? 1 : done ? 0.5 : 0.2;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={CY - BH / 2} width={BW} height={BH} rx={5}
                  fill={active ? `${n.color}20` : `${n.color}08`}
                  stroke={n.color}
                  animate={{ strokeWidth: active ? 2 : 1, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + BW / 2} y={CY + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600}
                  fill={active ? n.color : 'var(--foreground)'}
                  opacity={op}>{n.label}</text>
                {/* arrow to next */}
                {i < PIPELINE_NODES.length - 1 && (
                  <line x1={n.x + BW + 3} y1={CY} x2={PIPELINE_NODES[i + 1].x - 3} y2={CY}
                    stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.15}
                    markerEnd="url(#arrowR)" />
                )}
              </g>
            );
          })}

          {/* arrow marker */}
          <defs>
            <marker id="arrowR" markerWidth={6} markerHeight={6} refX={5} refY={3}
              orient="auto"><path d="M0,0 L6,3 L0,6" fill="var(--border)" /></marker>
          </defs>

          {/* flowing packet */}
          {step <= 4 && (
            <motion.circle r={5}
              animate={{ cx: PIPELINE_NODES[step].x + BW / 2, cy: CY - BH / 2 - 10 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              fill={PIPELINE_NODES[step].color}
              style={{ filter: `drop-shadow(0 0 4px ${PIPELINE_NODES[step].color}88)` }} />
          )}

          {/* query arrow from user (step >= 3) */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={W / 2 - 40} y={CY + 40} width={80} height={26} rx={5}
                fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={W / 2} y={CY + 57} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#f59e0b">User Query</text>
              <motion.path
                d={`M${W / 2} ${CY + 40} L${PIPELINE_NODES[3].x + BW / 2} ${CY + BH / 2 + 2}`}
                fill="none" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
            </motion.g>
          )}

          {/* reranker label (step 4) */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={W - 110} y={CY + 40} width={90} height={26} rx={5}
                fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={W - 65} y={CY + 57} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#10b981">Reranker</text>
            </motion.g>
          )}

          {/* LLM inject label */}
          <motion.text x={W / 2} y={H - 15} textAnchor="middle"
            fontSize={9} fill="var(--muted-foreground)"
            animate={{ opacity: step === 4 ? 0.8 : 0.2 }}>
            → LLM 컨텍스트에 주입
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
