import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';
import { V1, COMMITTED, STEPS, RX, VY, vertices, edgesR2, edgesR3, edgesR4 } from './DAGVizData';
import { VertexCircle, EdgeLine } from './DAGVizComponents';

export default function DAGViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Round labels */}
          {RX.map((x, i) => (
            <text key={i} x={x} y={14} textAnchor="middle"
              fontSize={10} fontWeight="600" fill="var(--muted-foreground)">
              Round {i + 1}
            </text>
          ))}

          {/* Validator labels */}
          {['V1', 'V2', 'V3'].map((label, i) => (
            <text key={i} x={14} y={VY[i] + 4} textAnchor="middle"
              fontSize={10} fill="var(--muted-foreground)">
              {label}
            </text>
          ))}

          {/* Edges */}
          {edgesR2.map((e, i) => (
            <EdgeLine key={`e2-${i}`} e={e} show={step >= 1} delay={i * 0.03} />
          ))}
          {edgesR3.map((e, i) => (
            <EdgeLine key={`e3-${i}`} e={e} show={step >= 3} delay={i * 0.03} />
          ))}
          {edgesR4.map((e, i) => (
            <EdgeLine key={`e4-${i}`} e={e} show={step >= 3} delay={0.3 + i * 0.03} />
          ))}

          {/* Vertices */}
          {vertices[0].map((v, i) => (
            <VertexCircle key={`r1-${i}`} v={v} show={step >= 0}
              glow={step >= 3} delay={i * 0.1} />
          ))}
          {vertices[1].map((v, i) => (
            <VertexCircle key={`r2-${i}`} v={v} show={step >= 1}
              anchor={step >= 2 && i === 0}
              glow={step >= 3} delay={0.3 + i * 0.1} />
          ))}
          {vertices[2].map((v, i) => (
            <VertexCircle key={`r3-${i}`} v={v} show={step >= 3} delay={i * 0.1} />
          ))}
          {vertices[3].map((v, i) => (
            <VertexCircle key={`r4-${i}`} v={v} show={step >= 3} delay={0.3 + i * 0.1} />
          ))}

          {/* Anchor commit label */}
          {step >= 2 && step < 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <rect x={RX[1] - 38} y={VY[0] + 18 + 8} width={76} height={18} rx={4}
                fill={`${V1}22`} stroke={V1} strokeWidth={1} />
              <text x={RX[1]} y={VY[0] + 18 + 20} textAnchor="middle"
                fontSize={10} fontWeight="600" fill={V1}>
                Anchor ★
              </text>
            </motion.g>
          )}

          {/* Committed label at step 3 */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <rect x={RX[0] - 20} y={200} width={RX[1] - RX[0] + 40} height={16} rx={4}
                fill={`${COMMITTED}15`} stroke={COMMITTED} strokeWidth={1} />
              <text x={(RX[0] + RX[1]) / 2} y={211} textAnchor="middle"
                fontSize={10} fontWeight="600" fill={COMMITTED}>
                Committed (causal history)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
