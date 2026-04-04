import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PIPELINE } from './CompositionData';

const W = 480, H = 200;

export default function CompositionViz() {
  const gap = 88;
  const startX = 30;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* pipeline boxes */}
          {PIPELINE.map((node, i) => {
            const x = startX + i * gap;
            const y = 80;
            const active = step === i || (step === 4 && i >= 3);
            return (
              <motion.g key={node.label}
                initial={{ opacity: 0.3 }} animate={{ opacity: active ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={y} width={72} height={36} rx={6}
                  fill={active ? `${node.color}20` : `${node.color}08`}
                  stroke={node.color} strokeWidth={active ? 2 : 1} />
                <text x={x + 36} y={y + 22} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={node.color}>
                  {node.label}
                </text>
                {/* arrow to next */}
                {i < PIPELINE.length - 1 && (
                  <line x1={x + 72} y1={y + 18} x2={x + gap} y2={y + 18}
                    stroke="var(--muted-foreground)" strokeWidth={1}
                    markerEnd="url(#arrowHead)" opacity={0.4} />
                )}
              </motion.g>
            );
          })}

          {/* highlight current step label */}
          <motion.text
            key={step}
            x={W / 2} y={30} textAnchor="middle"
            fontSize={10} fontWeight={600}
            fill={PIPELINE[Math.min(step, PIPELINE.length - 1)].color}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}>
            {step < 5 ? (typeof STEPS[step] === 'string' ? STEPS[step] : STEPS[step].label) : ''}
          </motion.text>

          {/* step 4: retry arrow (fallback) */}
          {step === 4 && (
            <motion.path
              d={`M ${startX + 4 * gap + 36} 116 Q ${startX + 4 * gap + 36} 150 ${startX + 2 * gap + 36} 150 Q ${startX + 2 * gap - 10} 150 ${startX + 2 * gap + 10} 116`}
              fill="none" stroke="#f59e0b" strokeWidth={1.5}
              strokeDasharray="4 3" markerEnd="url(#arrowAmber)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }} />
          )}
          {step === 4 && (
            <motion.text x={startX + 3 * gap + 10} y={166}
              textAnchor="middle" fontSize={9} fill="#f59e0b"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              재시도 / 대체 모델
            </motion.text>
          )}

          {/* arrow markers */}
          <defs>
            <marker id="arrowHead" markerWidth="6" markerHeight="6"
              refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none"
                stroke="var(--muted-foreground)" strokeWidth={1} />
            </marker>
            <marker id="arrowAmber" markerWidth="6" markerHeight="6"
              refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none"
                stroke="#f59e0b" strokeWidth={1} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
